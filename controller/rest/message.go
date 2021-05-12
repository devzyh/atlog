package rest

import (
	"strconv"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/rebootok/atlog/entity"
	"github.com/rebootok/atlog/global"
	"github.com/rebootok/atlog/model"
)

func GetMessage(c *gin.Context) {

	var (
		obj   model.Message
		code  int
		msg   string
		count int64
		data  []model.Message
	)

	if global.IsAuth(c) {
		page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
		limit, _ := strconv.Atoi(c.DefaultQuery("limit", "20"))
		data, count = obj.QryAll(true, page, limit)
		global.HTML["REVIEWS"] = model.QryReviewCnt()
	} else {
		code = -1
		msg = global.NotAllowed
	}

	c.JSON(200, gin.H{
		"code":  code,
		"msg":   msg,
		"count": count,
		"data":  data,
	})
}

func MessageNID(c *gin.Context) {

	var (
		obj  model.Message
		nav  global.Pagination
		data []model.Message
		err  error
	)

	obj.NID, err = strconv.ParseInt(strings.TrimSpace(c.Param("nid")), 10, 64)
	if err != nil {
		global.LOG.Panic("参数请求错误. " + err.Error())

	}
	nav.Current, _ = strconv.Atoi(strings.TrimSpace(c.Param("page")))
	data, rows := obj.QryMsgByNID(nav.Current, nav.GetPageSize())
	nav.SetRows(rows)

	c.JSON(200, gin.H{
		"Data": data,
		"Nav":  nav.GetData(),
	})
}

func PostMessage(c *gin.Context) {

	var (
		data model.Message
		res  entity.Result
	)

	err := c.ShouldBindJSON(&data)
	if err != nil {
		res.Message = global.DataPraseErr
		c.JSON(200, res)
		return
	}

	ok, err := global.MustData(data, "NID", "MNick", "MText")
	if ok == false {
		res.Message = err.Error()
		c.JSON(200, res)
		return
	}

	data.MIP = global.ClientIP(c.Request)
	data.Review = global.IsAuth(c)
	if data.Review {
		res.Data = "AUTH" // 表示已登录的状态
	} else {
		lastDate, _ := time.ParseInLocation("2006-01-02 15:04:05", data.QryDateByIP(), time.Local)
		seconds := time.Now().Sub(lastDate).Seconds()
		if seconds < 60 {
			res.Message = global.ReqIsTooHigh
			c.JSON(200, res)
			return
		}
	}
	if data.Insert() {
		res.Status = true
		res.Message = global.OptSuccess
	} else {
		res.Message = global.OptFaild
	}

	c.JSON(200, res)
}

func MessageReview(c *gin.Context) {

	var (
		data []int64
		obj  model.Message
		res  entity.Result
	)

	if !global.IsAuth(c) {
		res.Message = global.NotAllowed
	} else if c.ShouldBindJSON(&data) != nil {
		res.Message = global.DataPraseErr
	} else {
		i := 0
		for ; i < len(data); i++ {
			obj.MID = data[i]
			if !obj.Update() {
				break
			}
		}
		if i == len(data) {
			model.UpMessageList()
			res.Status = true
			res.Message = global.OptSuccess
		} else {
			res.Message = global.OptFaild
		}
	}

	c.JSON(200, res)
}

func DeleteMessage(c *gin.Context) {

	var (
		data []int64
		obj  model.Message
		res  entity.Result
	)

	if !global.IsAuth(c) {
		res.Message = global.NotAllowed
	} else if c.ShouldBindJSON(&data) != nil {
		res.Message = global.DataPraseErr
	} else {
		i := 0
		for ; i < len(data); i++ {
			obj.MID = data[i]
			if !obj.Delete() {
				break
			}
		}
		if i == len(data) {
			model.UpMessageList()
			res.Status = true
			res.Message = global.OptSuccess
		} else {
			res.Message = global.OptFaild
		}
	}

	c.JSON(200, res)
}
