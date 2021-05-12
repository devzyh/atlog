package global

import (
	"github.com/gorilla/sessions"
	"github.com/rebootok/atlog/entity"
)

// 全局变量
var (
	// CFG init.go LoadJson()
	CFG entity.Config
	// HTML dbhelper.go LoadConfig()
	HTML map[string]interface{}
	// CACHE model cache.go LoadCache()
	CACHE entity.Cache
	// LOG init.go InitLogger()
	LOG Logger
	// STORE router.go Setup()
	STORE *sessions.CookieStore
)
