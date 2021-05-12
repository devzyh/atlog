package rest

import (
	"path"

	"github.com/rebootok/atlog/entity"

	"github.com/gin-gonic/gin"
	"github.com/rebootok/atlog/global"
	"github.com/rebootok/atlog/model"
)

func GetConfig(c *gin.Context) {

	var (
		obj  model.Config
		code int
		msg  string
		data []model.Config
	)

	if global.IsAuth(c) {
		data = obj.QryShow()
	} else {
		code = -1
		msg = global.NotAllowed
	}

	c.JSON(200, gin.H{
		"code": code,
		"msg":  msg,
		"data": data,
	})
}

func PutConfig(c *gin.Context) {

	var (
		data model.Config
		res  entity.Result
	)

	if !global.IsAuth(c) {
		res.Message = global.NotAllowed
	} else if c.ShouldBindJSON(&data) != nil {
		res.Message = global.DataPraseErr
	} else if ok, err := global.MustData(data, "CKey", "CVal"); ok == false {
		res.Message = err.Error()
	} else {
		if data.Update() {
			res.Status = true
			res.Message = global.OptSuccess
			model.LoadConfig()
		} else {
			res.Message = global.OptFaild
		}
	}

	c.JSON(200, res)
}

func PutInfo(c *gin.Context) {

	var (
		data []model.Config
		res  entity.Result
	)

	if !global.IsAuth(c) {
		res.Message = global.NotAllowed
	} else if c.ShouldBindJSON(&data) != nil {
		res.Message = global.DataPraseErr
	} else if len(data) == 0 {
		res.Message = global.AuthDataErr
	} else {
		// 更新信息
		i := 0
		for _, val := range data {
			ok, err := global.MustData(val, "CKey", "CVal")
			if ok == false {
				res.Message = err.Error()
				c.JSON(200, res)
				return
			}
			if val.Update() {
				i++
			}
		}
		if i == len(data) {
			res.Status = true
			res.Message = global.OptSuccess
			model.LoadConfig()
		} else {
			res.Message = global.OptFaild
		}
	}

	c.JSON(200, res)
}

func PostInfoImg(c *gin.Context) {

	res := entity.Result{}

	file, err := c.FormFile("file")
	if err != nil {
		global.LOG.Panic("请求参数错误. " + err.Error())
	}

	if !global.IsAuth(c) {
		res.Message = global.NotAllowed
	} else if err != nil {
		res.Message = global.DataPraseErr
	} else if !IsImgFile(path.Ext(file.Filename)) {
		res.Message = global.DataTypeErr
	} else {
		isOk, tip := UploadFile(file)
		if isOk {
			res.Status = true
			res.Data = tip
		} else {
			res.Message = tip
		}
	}

	c.JSON(200, res)
}
