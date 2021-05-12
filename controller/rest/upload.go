package rest

import (
	"io"
	"math/rand"
	"mime/multipart"
	"os"
	"path"
	"strconv"
	"strings"
	"time"

	"github.com/rebootok/atlog/global"
)

// 单文件上传
func UploadFile(f *multipart.FileHeader) (bool, string) {

	nowDate := time.Now().Local()
	filePath := "/" + global.FilePath + strconv.Itoa(nowDate.Year()) + "/" + strconv.Itoa(int(time.Now().Month()))
	dir, _ := os.Getwd()
	devPath := dir + filePath

	// 创建目录
	_, err := os.Stat(devPath)
	if os.IsNotExist(err) {
		err = os.MkdirAll(devPath, os.ModePerm)
		if err != nil {
			global.LOG.Panic("目录创建失败. " + err.Error())
			return false, "目录创建失败"
		}
	}

	// 文件名
	rand.Seed(time.Now().UnixNano())
	fileName := "/" + time.Now().Local().Format("060102150405") +
		strconv.Itoa(rand.Intn(100)) +
		path.Ext(f.Filename)
	filePath += fileName
	devPath += fileName

	// 保存文件
	src, err := f.Open()
	if err != nil {
		global.LOG.Panic("文件流打开失败. " + err.Error())
		return false, "文件流打开失败"
	}
	defer src.Close()

	out, err := os.Create(devPath)
	if err != nil {
		global.LOG.Panic("创建文件失败" + err.Error())
		return false, "创建文件失败"
	}
	defer out.Close()

	_, err = io.Copy(out, src)
	if err != nil {
		global.LOG.Panic("文件流复制失败" + err.Error())
		return false, "文件流复制失败"
	}

	global.LOG.Info("文件上传成功：" + devPath)
	return true, filePath[strings.Index(filePath, "/file"):]
}

// 是否图片格式
func IsImgFile(extend string) bool {

	return strings.Contains(".bmp.jpg.jpeg.png.tif.gif.pcx.tga.exif.fpx.svg.psd.cdr.pcd.dxf.ufo.eps.ai.raw.WMF.webp", strings.ToLower(extend))
}
