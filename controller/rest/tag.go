package rest

import (
	"github.com/gin-gonic/gin"
	"github.com/rebootok/atlog/entity"
	"github.com/rebootok/atlog/global"
	"github.com/rebootok/atlog/model"
)

func GetTag(c *gin.Context) {

	var (
		obj   model.Tag
		code  int
		msg   string
		count int64
		data  []model.Tag
	)

	data = obj.QryAll()

	c.JSON(200, gin.H{
		"code":  code,
		"msg":   msg,
		"count": count,
		"data":  data,
	})
}

func PostTag(c *gin.Context) {

	var (
		data model.Tag
		res  entity.Result
	)

	if !global.IsAuth(c) {
		res.Message = global.NotAllowed
	} else if c.ShouldBindJSON(&data) != nil {
		res.Message = global.DataPraseErr
	} else if ok, err := global.MustData(data, "TName"); ok == false {
		res.Message = err.Error()
	} else {

		if data.Insert() {
			model.UpTagList()
			res.Status = true
			res.Message = global.OptSuccess
		} else {
			res.Message = global.OptFaild
		}
	}

	c.JSON(200, res)
}

func DeleteTag(c *gin.Context) {

	var (
		data model.Tag
		res  entity.Result
	)

	if !global.IsAuth(c) {
		res.Message = global.NotAllowed
	} else if c.ShouldBindJSON(&data) != nil {
		res.Message = global.DataPraseErr
	} else {

		if data.Delete() {
			model.UpTagList()
			res.Status = true
			res.Message = global.OptSuccess
		} else {
			res.Message = global.OptFaild
		}
	}

	c.JSON(200, res)
}

func PutTag(c *gin.Context) {

	var (
		data model.Tag
		res  entity.Result
	)

	if !global.IsAuth(c) {
		res.Message = global.NotAllowed
	} else if c.ShouldBindJSON(&data) != nil {
		res.Message = global.DataPraseErr
	} else {

		if data.Update() {
			model.UpTagList()
			res.Status = true
			res.Message = global.OptSuccess
		} else {
			res.Message = global.OptFaild
		}
	}

	c.JSON(200, res)
}
