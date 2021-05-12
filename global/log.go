package global

import (
	"fmt"
	_log "log"
	"os"
	"runtime"
	"strconv"
	"strings"
	"time"
)

// 日志工具
type Logger struct {
	// SaveDir 日志根目录
	SaveDir string
	// PrintOnCmd 是否打印到控制台
	OnCmd bool
	// SingFile 是否按文件分类保存
	SingFile bool
	// appRunDir 程序运行目录
	appRunDir string
}

// Info 输出日志信息
func (x *Logger) Info(msg string) {

	x.logger(msg, "info")
}

// Panic 输出异常信息
func (x *Logger) Panic(msg string) {

	x.logger(msg, "panic")
}

// Fatal 输出故障信息并退出程序
func (x *Logger) Fatal(msg string) {

	x.logger(msg, "fatal")
	fmt.Printf("程序终止运行: %s", msg)
	os.Exit(1)
}

// logger 日志记录
func (x *Logger) logger(msg, flag string) {

	if x.appRunDir == "" {
		x.appRunDir, _ = os.Getwd()
	}

	if x.SaveDir == "" {
		x.SaveDir = x.appRunDir + x.SaveDir
	}

	nowDate := time.Now().Local()
	fileDir := x.appRunDir + "/" + x.SaveDir + strconv.Itoa(nowDate.Year()) + "/" + strconv.Itoa(int(nowDate.Month())) + "/"
	_, err := os.Stat(fileDir)
	if os.IsNotExist(err) {
		err = os.MkdirAll(fileDir, os.ModePerm)
		if err != nil {
			_log.Fatalf("日志目录创建失败. " + err.Error())
		}
	}

	day := time.Now().Local().Format("060102")
	filePath := fileDir + day + "."

	pc, _, _, _ := runtime.Caller(2)
	msg = runtime.FuncForPC(pc).Name() + ": " + msg
	if x.SingFile {
		msg = "[" + strings.ToUpper(flag) + "] " + msg
	} else {
		filePath += flag + "."
	}
	filePath += "log"

	f, err := os.OpenFile(filePath, os.O_RDWR|os.O_CREATE|os.O_APPEND, 0644)
	if err != nil {
		_log.Fatalf(err.Error())
	}
	defer f.Close()

	_log.SetOutput(f)
	_log.SetFlags(_log.Ldate | _log.Ltime)
	_log.Println(msg)
	if x.OnCmd {
		_log.Println(msg)
	}
}
