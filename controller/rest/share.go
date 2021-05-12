package rest

import (
	"fmt"
	"path"
	"strconv"
	"strings"

	"github.com/rebootok/atlog/entity"

	"github.com/gin-gonic/gin"
	"github.com/rebootok/atlog/global"
	"github.com/rebootok/atlog/model"
)

func GetShare(c *gin.Context) {

	var (
		obj model.Share
		nav global.Pagination
		err error
	)

	nav.Current, err = strconv.Atoi(strings.TrimSpace(c.Param("page")))
	if err != nil {
		global.LOG.Panic("请求参数错误. " + err.Error())
	}

	data, rows := obj.QryPage(nav.Current, nav.GetPageSize())
	nav.SetRows(rows)

	c.JSON(200, gin.H{
		"Data": data,
		"Nav":  nav.GetData(),
	})

}

func PostShare(c *gin.Context) {

	var (
		data model.Share
		res  entity.Result
	)

	if !global.IsAuth(c) {
		res.Message = global.NotAllowed
	} else if c.ShouldBindJSON(&data) != nil {
		res.Message = global.DataPraseErr
	} else if ok, err := global.MustData(data, "SText"); ok == false {
		res.Message = err.Error()
	} else if data.Insert() {
		res.Status = true
		res.Message = global.OptSuccess
	} else {
		res.Message = global.OptFaild
	}

	c.JSON(200, res)
}

func DeleteShare(c *gin.Context) {

	var (
		obj model.Share
		res entity.Result
		err error
	)

	obj.SID, err = strconv.ParseInt(strings.TrimSpace(c.Param("sid")), 10, 64)
	if err != nil {
		global.LOG.Panic("请求参数错误. " + err.Error())
	}
	if !global.IsAuth(c) {
		res.Message = global.NotAllowed
	} else if obj.SID == 0 || err != nil {
		res.Message = global.DataPraseErr
	} else if obj.Delete() {
		res.Status = true
		res.Message = global.OptSuccess
	} else {
		res.Message = global.OptFaild
	}

	c.JSON(200, res)
}

func PostShareImg(c *gin.Context) {

	var (
		code = -1
		msg  string
		src  string
	)
	file, err := c.FormFile("file")
	if err != nil {
		global.LOG.Panic("请求参数错误. " + err.Error())
	}
	if !global.IsAuth(c) {
		msg = global.NotAllowed
	} else if err != nil {
		msg = global.DataPraseErr
	} else if !IsImgFile(path.Ext(file.Filename)) {
		msg = global.DataTypeErr
	} else {
		isOk, tip := UploadFile(file)
		if isOk {
			code = 0
			src = tip
		} else {
			msg = tip
		}
	}

	c.JSON(200,
		fmt.Sprintf(`{
								"code":%d,
								"msg":"%s",
								"data":{"src":"%s"}
							}`,
			code, msg, src))
}
