package blog

import (
	"net/http"
	"strconv"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/rebootok/atlog/global"
	"github.com/rebootok/atlog/model"
)

// 首页列表
func Index(c *gin.Context) {

	var (
		obj  model.Note
		data []model.Note
		nav  global.Pagination
	)

	nav.Current, _ = strconv.Atoi(c.DefaultQuery("page", "1"))
	data, rows := obj.QryAll(false, false, nav.Current, nav.GetPageSize(), "")
	nav.SetRows(rows)

	res := globalData()
	res["Data"] = data
	res["Nav"] = nav.GetData()
	c.HTML(http.StatusOK, "index.htm", res)
}

// 标签列表
func List(c *gin.Context) {

	var (
		obj  model.Note
		tag  model.Tag
		data []model.Note
		nav  global.Pagination
		err  error
	)

	nav.Current, err = strconv.Atoi(c.DefaultQuery("page", "1"))
	if err != nil {
		global.LOG.Panic("Blog.List 请求参数错误. " + err.Error())
	}
	url := strings.TrimSpace(c.Param("url"))
	htmlIndex := strings.LastIndex(url, ".html")
	tid := url[:htmlIndex]
	if url == "" || htmlIndex == -1 || !global.IsDigit(tid) {
		c.Redirect(302, "/error.html")
		return
	}
	data, rows := obj.QryByTID(false, tid, nav.Current, nav.GetPageSize())
	nav.SetRows(rows)
	tag.TID, _ = strconv.ParseInt(tid, 10, 64)

	res := globalData()
	res["Data"] = data
	res["Tag"] = tag.QryOne()
	res["Nav"] = nav.GetData()
	c.HTML(http.StatusOK, "list.htm", res)
}

// 搜索结果列表
func Search(c *gin.Context) {

	var (
		obj  model.Note
		data []model.Note
		nav  global.Pagination
		err  error
		rows int64
	)

	nav.Current, err = strconv.Atoi(c.DefaultQuery("page", "1"))
	if err != nil {
		global.LOG.Panic("请求参数错误. " + err.Error())
	}
	key := strings.TrimSpace(c.DefaultQuery("key", ""))
	if key != "" {
		data, rows = obj.QryAll(false, false, nav.Current, nav.GetPageSize(), key)
		nav.SetRows(rows)
	}

	res := globalData()
	res["Data"] = data
	res["Word"] = key
	res["Nav"] = nav.GetData()
	c.HTML(http.StatusOK, "search.htm", res)
}

// 分享页
func Share(c *gin.Context) {

	var (
		obj model.Share
		nav global.Pagination
		err error
	)

	nav.Current, err = strconv.Atoi(c.DefaultQuery("page", "1"))
	if err != nil {
		global.LOG.Panic("请求参数错误. " + err.Error())
	}

	data, rows := obj.QryPage(nav.Current, nav.GetPageSize())
	nav.SetRows(rows)

	res := globalData()
	res["Data"] = data
	res["Nav"] = nav.GetData()
	res["Auth"] = global.IsAuth(c)
	c.HTML(http.StatusOK, "share.htm", res)
}
