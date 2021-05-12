package main

import (
	"fmt"
	"strconv"
	"time"

	"github.com/rebootok/atlog/controller"
	"github.com/rebootok/atlog/global"
	"github.com/rebootok/atlog/model"
)

const logo = `   _   _     __             
  /_\ | |_  / /  ___   __ _ 
 //_\\| __|/ /  / _ \ / _' |
/  _  \ |_/ /__| (_) | (_| |
\_/ \_/\__\____/\___/ \__, |
                      |___/ `

func main() {

	fmt.Println(logo)
	fmt.Println("Version：2.1.1")
	start := time.Now()
	global.InitLogger()
	fmt.Println("日志包初始化完成...")
	model.InitDbConn()
	defer model.CloseDbConn()
	fmt.Println("数据库初始化完成...")
	model.LoadConfig()
	global.LoadJson()
	fmt.Println("配置信息读取完成...")
	web := controller.Setup()
	fmt.Println("路由器初始化完成...")
	fmt.Println("监听端口： ", global.CFG.HTTP_PORT)
	spend := time.Since(start)
	fmt.Println("启动耗时：", spend)
	global.LOG.Info("启动应用程序，耗时" + spend.String())
	web.Run(":" + strconv.Itoa(global.CFG.HTTP_PORT))
}
