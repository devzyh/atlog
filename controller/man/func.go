package man

import (
	"net/http"
	"strconv"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/rebootok/atlog/global"
	"github.com/rebootok/atlog/model"
)

func Edit(c *gin.Context) {

	var (
		obj model.Note
		tag model.Tag
	)

	key := c.Param("key")
	if len(key) > 0 {
		key = strings.ToLower(key[1:])
	}
	if key == "single" {
		obj.Single = true
	}
	id, err := strconv.ParseInt(key, 10, 64)
	if err == nil {
		obj.NID = id
		obj.QryOne()
	}
	if len(obj.NTitle) > 0 {
		tag.TID = id
		obj.Tags = tag.QryTagByNID(obj.NID)
	} else {
		obj.NID = 0
		obj.NTime = global.NowTime()
	}

	c.HTML(http.StatusOK, "edit", gin.H{
		"HTML":   global.HTML,
		"Data":   obj,
		"TagAll": tag.QryAll(),
	})
}

func Info(c *gin.Context) {
	c.HTML(http.StatusOK, "info", gin.H{
		"HTML": global.HTML,
	})
}

func Exit(c *gin.Context) {

	sess, err := global.STORE.Get(c.Request, "ATLOG")
	if err != nil {
		global.LOG.Panic("Session错误. " + err.Error())
	}

	sess.Values["AUTH"] = ""
	err = sess.Save(c.Request, c.Writer)
	if err != nil {
		global.LOG.Panic("Session错误. " + err.Error())
	}

	c.Redirect(302, "/")
}
