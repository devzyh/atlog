package man

import (
	"github.com/gin-gonic/gin"
	"github.com/rebootok/atlog/global"
)

// 登录
func Login(c *gin.Context) {

	if global.IsAuth(c) {
		c.Redirect(302, "/man")
	} else {
		c.HTML(200, "login", gin.H{
			"HTML": global.HTML,
		})
	}
}
