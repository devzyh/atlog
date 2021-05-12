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

func GetNote(c *gin.Context) {

	var (
		obj   model.Note
		code  int
		msg   string
		count int64
		data  []model.Note
	)

	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "20"))
	single, _ := strconv.ParseBool(c.DefaultQuery("single", "false"))
	key := c.DefaultQuery("key", "")
	data, count = obj.QryAll(global.IsAuth(c), single, page, limit, key)

	c.JSON(200, gin.H{
		"code":  code,
		"msg":   msg,
		"count": count,
		"data":  data,
	})
}

func PostNote(c *gin.Context) {

	var (
		data model.Note
		tag  model.Tag
		res  entity.Result
	)

	if !global.IsAuth(c) {
		res.Message = global.NotAllowed
	} else if c.ShouldBindJSON(&data) != nil {
		res.Message = global.DataPraseErr
	} else if ok, err := global.MustData(data, "NTitle", "NText", "NTime"); ok == false {
		res.Message = err.Error()
	} else if !global.IsTime(data.NTime) {
		res.Message = global.TimePraseErr
	} else if (!data.Single) && (len(data.Tags) == 0) {
		res.Message = global.NoteMustTag
	} else if data.Single && (strings.TrimSpace(data.NUrl) == "") {
		res.Message = global.SingeMustUrl
	} else if data.Single && global.IsDigit(data.NUrl) {
		res.Message = global.UrlIsNumber
	} else if data.Single && data.QryNUrl() {
		res.Message = global.UrlIsUsed
	} else {
		if data.QryNID() {
			// 更新
			if data.Update() {
				model.UpNoteList()
				res.Status = true
				res.Message = global.OptSuccess
				res.Data = data.NID
			} else {
				res.Message = global.OptFaild
			}
		} else {
			// 添加
			if data.Insert() {
				model.UpNoteList()
				res.Status = true
				res.Message = global.OptSuccess
				res.Data = data.NID
			} else {
				res.Message = global.OptFaild
			}
		}
		// 操作标签
		if res.Status {
			tag.InsertByNID(data.NID, data.Tags)
		}
	}

	c.JSON(200, res)
}

func DeleteNote(c *gin.Context) {

	var (
		data []int64
		obj  model.Note
		res  entity.Result
	)

	if !global.IsAuth(c) {
		res.Message = global.NotAllowed
	} else if c.ShouldBindJSON(&data) != nil {
		res.Message = global.DataPraseErr
	} else {
		i := 0
		for ; i < len(data); i++ {
			obj.NID = data[i]
			if !obj.Delete() {
				break
			}
		}
		if i == len(data) {
			model.UpNoteList()
			res.Status = true
			res.Message = global.OptSuccess
		} else {
			res.Message = global.OptFaild
		}
	}

	c.JSON(200, res)
}

func NoteImg(c *gin.Context) {

	var (
		success = 0
		message string
		url     string
	)

	file, err := c.FormFile("file")
	if err != nil {
		global.LOG.Panic("请求参数异常. " + err.Error())
	}
	if !global.IsAuth(c) {
		message = global.NotAllowed
	} else if err != nil {
		message = global.DataPraseErr
	} else if !IsImgFile(path.Ext(file.Filename)) {
		message = global.DataTypeErr
	} else {
		isOk, tip := UploadFile(file)
		if isOk {
			success = 1
			url = tip
		} else {
			message = tip
		}
	}
	c.String(200,
		fmt.Sprintf(`{
								"success":%d,
								"message":"%s",
								"url":"%s"
							}`,
			success, message, url))
}