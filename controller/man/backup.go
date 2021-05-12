package man

import (
	"archive/tar"
	"compress/gzip"
	"context"
	"fmt"
	"io"
	"os"
	"path/filepath"
	"strconv"
	"strings"
	"time"

	"github.com/qiniu/api.v7/auth/qbox"
	"github.com/qiniu/api.v7/storage"
	"github.com/rebootok/atlog/global"
	"github.com/rebootok/atlog/model"
)

// 运行备份协程
func RunBackUp() {

	if (global.CFG.QN_AK == "") || (global.CFG.QN_SK == "") || (global.CFG.QN_BUCKET == "") {
		fmt.Println("自动备份任务停止...")
	} else {
		go func() {
			timer := time.NewTicker(1 * time.Hour)
			for {
				<-timer.C
				backup()
			}
		}()
		fmt.Println("自动备份正在运行...")
	}
}

// 执行备份任务
func backup() {
	var err error
	//获取备份周期及最后备份时间
	tmp, ok := global.HTML["QN_INTERVAL"].(int64)
	interval, err := strconv.Atoi(strconv.FormatInt(tmp, 10))
	if (!ok) || (err != nil) {
		global.LOG.Panic("全局常量 QN_INTERVAL 解析错误. 使用默认值 7 赋值. " + err.Error())
		interval = 7
	}

	var lastTime time.Time
	tmpTime := global.HTML["QN_TIME"].(string)
	if tmpTime != "" {
		lastTime, err = time.Parse("2006-01-02 15:04:05", tmpTime)
		if err != nil {
			global.LOG.Panic("最后备份时间解析错误，采用空时间处理. " + err.Error())
			tmpTime = ""
		}
	}

	// 不到周期返回
	days := time.Now().Local().Sub(lastTime).Hours()
	if (days < float64(interval*24)) && (tmpTime != "") {
		return
	}

	// 凌晨两点至六点执行
	nowHour, err := strconv.Atoi(time.Now().Local().Format("15"))
	if err != nil || nowHour < 2 || nowHour > 6 {
		return
	}

	// 打包站点数据目录
	src := global.DbPath[:strings.Index(global.DbPath, "/")]
	tmpFile := "tmp_bak.tar.gz"
	if err := tar_gz(src, tmpFile); err != nil {
		global.LOG.Panic("打包文件失败. " + err.Error())
		return
	}

	// 上传文件到七牛云
	remote := "atlog_bak/" + time.Now().Local().Format("20060102") + ".tar.gz"
	if !upload(global.CFG.QN_AK, global.CFG.QN_SK, global.CFG.QN_BUCKET, tmpFile, remote) {
		return
	}

	// 删除本地缓存文件
	err = os.Remove(tmpFile)
	if err != nil {
		global.LOG.Panic("文件备份成功,缓存文件删除失败. " + err.Error())
	}

	// 更新最后备份时间
	var config model.Config
	config.CKey = "QN_TIME"
	config.CVal = global.NowTime()
	if !config.Update() {
		global.LOG.Panic("文件备份成功,备份时间更新失败. " + err.Error())
	}
}

/*
 * 打包压缩
 * 代码出处：
 * https://learnku.com/articles/23433/golang-learning-notes-four-archivetar-package-compression-and-decompression
 */
func tar_gz(src, dst string) (err error) {

	// 创建文件
	fw, err := os.Create(dst)
	if err != nil {
		return
	}
	defer fw.Close()

	// 将 tar 包使用 gzip 压缩，其实添加压缩功能很简单，
	// 只需要在 fw 和 tw 之前加上一层压缩就行了，和 Linux 的管道的感觉类似
	gw := gzip.NewWriter(fw)
	defer gw.Close()

	// 创建 Tar.Writer 结构
	tw := tar.NewWriter(gw)
	// 如果需要启用 gzip 将上面代码注释，换成下面的

	defer tw.Close()

	// 下面就该开始处理数据了，这里的思路就是递归处理目录及目录下的所有文件和目录
	// 这里可以自己写个递归来处理，不过 Golang 提供了 filepath.Walk 函数，可以很方便的做这个事情
	// 直接将这个函数的处理结果返回就行，需要传给它一个源文件或目录，它就可以自己去处理
	// 我们就只需要去实现我们自己的 打包逻辑即可，不需要再去路径相关的事情
	return filepath.Walk(src, func(fileName string, fi os.FileInfo, err error) error {
		// 因为这个闭包会返回个 error ，所以先要处理一下这个
		if err != nil {
			return err
		}

		// 这里就不需要我们自己再 os.Stat 了，它已经做好了，我们直接使用 fi 即可
		hdr, err := tar.FileInfoHeader(fi, "")
		if err != nil {
			return err
		}
		// 这里需要处理下 hdr 中的 Name，因为默认文件的名字是不带路径的，
		// 打包之后所有文件就会堆在一起，这样就破坏了原本的目录结果
		// 例如： 将原本 hdr.Name 的 syslog 替换程 log/syslog
		// 这个其实也很简单，回调函数的 fileName 字段给我们返回来的就是完整路径的 log/syslog
		// strings.TrimPrefix 将 fileName 的最左侧的 / 去掉，
		// 熟悉 Linux 的都知道为什么要去掉这个
		hdr.Name = strings.TrimPrefix(fileName, string(filepath.Separator))

		// 写入文件信息
		if err := tw.WriteHeader(hdr); err != nil {
			return err
		}

		// 判断下文件是否是标准文件，如果不是就不处理了，
		// 如： 目录，这里就只记录了文件信息，不会执行下面的 copy
		if !fi.Mode().IsRegular() {
			return nil
		}

		// 打开文件
		fr, err := os.Open(fileName)
		defer fr.Close()
		if err != nil {
			return err
		}

		// copy 文件数据到 tw
		n, err := io.Copy(tw, fr)
		if err != nil {
			return err
		}

		// 记录下过程，这个可以不记录，这个看需要，这样可以看到打包的过程
		global.LOG.Info("成功打包 " + fileName + " ，共写入了 " + strconv.FormatInt(n, 10) + " 字节的数据. ")

		return nil
	})
}

/*
 * 上传备份文件
 */
func upload(ak, sk, bucket, local, remote string) bool {

	putPolicy := storage.PutPolicy{
		Scope: bucket,
	}
	mac := qbox.NewMac(ak, sk)
	upToken := putPolicy.UploadToken(mac)
	cfg := storage.Config{}
	cfg.Zone, _ = storage.GetZone(ak, bucket)
	cfg.UseHTTPS = false
	cfg.UseCdnDomains = false
	formUploader := storage.NewFormUploader(&cfg)
	ret := storage.PutRet{}
	putExtra := storage.PutExtra{}
	err := formUploader.PutFile(context.Background(), &ret, upToken, remote, local, &putExtra)
	if err != nil {
		global.LOG.Panic("备份文件上传错误. " + err.Error())
		return false
	}
	return true
}
