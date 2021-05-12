package blog

import (
	"bytes"
	"html/template"
	"net/http"
	"strconv"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/rebootok/atlog/global"
	"github.com/rebootok/atlog/model"
	"github.com/yuin/goldmark"
	"github.com/yuin/goldmark/extension"
)

// 错误页
func NotFound(c *gin.Context) {

	c.HTML(http.StatusOK, "error.htm", globalData())
}

// 标签汇总页
func Tag(c *gin.Context) {

	var obj model.Tag

	res := globalData()
	res["Data"] = obj.QryAll()
	c.HTML(http.StatusOK, "tag.htm", res)
}

// 详情页
func Page(c *gin.Context) {

	var (
		obj model.Note
		tag model.Tag
		err error
	)

	if err != nil {
		global.LOG.Panic("请求参数错误. " + err.Error())
	}
	url := strings.TrimSpace(c.Param("url"))
	htmlIndex := strings.LastIndex(url, ".html")
	if url == "" || htmlIndex == -1 {
		c.Redirect(302, "/error.html")
		return
	}
	key := url[:htmlIndex]
	if global.IsDigit(key) {
		// 查询文章
		obj.NID, _ = strconv.ParseInt(key, 10, 64)
		obj.QryOne()
	} else {
		// 查询单页
		obj.NUrl = key
		obj.QrySingle()
	}
	if len(obj.NTitle) == 0 {
		c.Redirect(302, "/error.html")
		return
	}

	md := goldmark.New(goldmark.WithExtensions(extension.GFM))
	var buf bytes.Buffer
	if err := md.Convert([]byte(obj.NText), &buf); err != nil {
		global.LOG.Panic("解析Markdwon错误. " + err.Error())
		c.Redirect(302, "/error.html")
		return
	}

	obj.NText = template.HTML(buf.String())

	obj.Tags = tag.QryTagByNID(obj.NID)

	res := globalData()
	res["Data"] = obj
	c.HTML(http.StatusOK, "page.htm", res)
}
