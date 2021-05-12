package rest

import (
	"net/http"
	"strings"

	"github.com/rebootok/atlog/entity"

	"github.com/gin-gonic/gin"
	"github.com/rebootok/atlog/controller/man"
	"github.com/rebootok/atlog/global"
)

func Auth(c *gin.Context) {

	var (
		data entity.AuthData
		res  entity.Result
	)

	if c.ShouldBindJSON(&data) != nil {
		res.Message = global.DataPraseErr
	} else if ok, err := global.MustData(data); ok == false {
		res.Message = err.Error()
	} else if !man.VeifyKey(data.CodeKey, data.VeCode) {
		res.Message = global.VerifyCodeErr
	} else if global.CFG.PASSWORD != strings.Trim(data.Passwd, "") {
		res.Message = global.PasswordErr
	} else {
		sess, _ := global.STORE.Get(c.Request, "ATLOG")
		sess.Values["AUTH"] = global.GenMd5("TRUE@" + global.CFG.SALT_STR)
		err := sess.Save(c.Request, c.Writer)
		if err != nil {
			global.LOG.Panic("Session保存错误. " + err.Error())
		}
		res.Status = true
		res.Message = global.LoginSuccess
		global.LOG.Info("IP：" + global.ClientIP(c.Request) + " 成功登陆系统！")
	}

	c.JSON(http.StatusOK, res)
}

func AuthImg(c *gin.Context) {

	key, img := man.GenCodeImg()
	c.JSON(http.StatusOK, gin.H{
		"key": key,
		"img": img,
	})
}
