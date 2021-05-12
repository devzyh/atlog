package man

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/rebootok/atlog/global"
	"github.com/rebootok/atlog/model"
)

func Share(c *gin.Context) {

	var obj model.Share

	data, rows := obj.QryPage(0, 20)

	c.HTML(http.StatusOK, "share", gin.H{
		"HTML": global.HTML,
		"Data": data,
		"Rows": rows,
	})
}

func Message(c *gin.Context) {

	c.HTML(http.StatusOK, "message", gin.H{
		"HTML": global.HTML,
	})
}

func List(c *gin.Context) {
	c.HTML(http.StatusOK, "list", gin.H{
		"HTML": global.HTML,
	})
}

func Single(c *gin.Context) {
	c.HTML(http.StatusOK, "single", gin.H{
		"HTML": global.HTML,
	})
}

func Tag(c *gin.Context) {
	c.HTML(http.StatusOK, "tag", gin.H{
		"HTML": global.HTML,
	})
}

func Config(c *gin.Context) {
	c.HTML(http.StatusOK, "config", gin.H{
		"HTML": global.HTML,
	})
}
