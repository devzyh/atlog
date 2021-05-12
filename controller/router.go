package controller

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/gorilla/sessions"
	"github.com/rebootok/atlog/controller/blog"
	"github.com/rebootok/atlog/controller/man"
	"github.com/rebootok/atlog/controller/rest"
	"github.com/rebootok/atlog/global"
	"github.com/rebootok/atlog/model"
)

// Setup 设置路由
func Setup() *gin.Engine {

	// 实例化
	gin.SetMode(gin.DebugMode)
	router := gin.New()

	// 模板路径
	router.Delims("{%", "%}")
	router.LoadHTMLGlob("view/**/*.htm")

	// 静态资源
	router.StaticFS("/static", http.Dir(global.StaticPath))
	router.StaticFS("/file", http.Dir(global.FilePath))
	router.StaticFile("/favicon.ico", global.IconPath)

	// Session
	timeout := global.CFG.TIMEOUT
	global.STORE = sessions.NewCookieStore([]byte(global.CFG.SALT_STR))
	global.STORE.Options = &sessions.Options{MaxAge: timeout, Path: "/"}

	// 404 页面
	router.NoRoute(func(c *gin.Context) {
		c.Redirect(301, "/404.html")
	})

	// Blog 路径
	rBlog := router.Group("")
	{
		rBlog.GET("", blog.Index)             // 默认首页
		rBlog.GET("index.html", blog.Index)   // 前台首页
		rBlog.GET("list/:url", blog.List)     // 标签列表
		rBlog.GET("tag.html", blog.Tag)       // 标签汇总
		rBlog.GET("search.html", blog.Search) // 搜索结果
		rBlog.GET("page/:url", blog.Page)     // 页面详情
		rBlog.GET("share.html", blog.Share)   // 笔记列表
		rBlog.GET("error.html", blog.NotFound)  // 错误页面
		rBlog.GET("login", man.Login)         // 登陆页面
	}

	// Restful 路径
	rRest := router.Group("/rest")
	{
		rRest.POST("/auth", rest.Auth)       // 验证登陆数据
		rRest.GET("/auth/img", rest.AuthImg) // 获取验证码

		rRest.GET("/share/:page", rest.GetShare)      // 获取分享列表
		rRest.POST("/share", rest.PostShare)          // 添加分享内容
		rRest.DELETE("/share/:sid", rest.DeleteShare) // 删除分享内容
		rRest.POST("/share/img", rest.PostShareImg)   // 分享图片上传

		rRest.GET("/note", rest.GetNote)       // 查询笔记列表
		rRest.POST("/note", rest.PostNote)     // 编辑内容详情
		rRest.DELETE("/note", rest.DeleteNote) // 批量删除笔记
		rRest.POST("/note/img", rest.NoteImg)  // 笔记图片上传

		rRest.GET("/message", rest.GetMessage)            // 查询评论列表
		rRest.GET("/message/:nid/:page", rest.MessageNID) // 查询文章评论
		rRest.POST("/message", rest.PostMessage)          // 添加文章评论
		rRest.PUT("/message/review", rest.MessageReview)  // 批量审核评论
		rRest.DELETE("/message", rest.DeleteMessage)      // 批量删除评论

		rRest.GET("/tag", rest.GetTag)       // 获取标签
		rRest.POST("/tag", rest.PostTag)     // 添加标签
		rRest.DELETE("/tag", rest.DeleteTag) // 删除标签
		rRest.PUT("/tag", rest.PutTag)       // 标签改名

		rRest.GET("/config", rest.GetConfig)             // 查询配置数据
		rRest.PUT("/config", rest.PutConfig)             // 更新配置数据
		rRest.PUT("/config/info", rest.PutInfo)          // 更新个人信息
		rRest.POST("/config/info/img", rest.PostInfoImg) // 上传个人头像
	}

	// 权限控制
	router.Use(func(c *gin.Context) {
		if global.IsAuth(c) {
			// 刷新未审核消息总数
			global.HTML["REVIEWS"] = model.QryReviewCnt()
			c.Next()
		} else {
			c.Redirect(302, "/404.html")
			c.Abort()
		}
	})

	// Manager 路径
	rMan := router.Group("/man")
	{
		rMan.GET("/", man.Share)          // 默认首页
		rMan.GET("/share", man.Share)     // 分享页面
		rMan.GET("/edit/*key", man.Edit)  // 笔记编辑
		rMan.GET("/message", man.Message) // 消息处理
		rMan.GET("/list", man.List)       // 笔记列表
		rMan.GET("/single", man.Single)   // 单页列表
		rMan.GET("/tag", man.Tag)         // 标签管理
		rMan.GET("/config", man.Config)   // 参数设置
		rMan.GET("/info", man.Info)       // 资料设置
		rMan.GET("/exit", man.Exit)       // 退出登录
	}

	// 缓存加载
	model.LoadCache()

	// 备份任务
	man.RunBackUp()
	return router
}
