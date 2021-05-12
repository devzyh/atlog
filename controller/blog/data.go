package blog

import "github.com/rebootok/atlog/global"

// 模板共用数据
func globalData() map[string]interface{} {
	return map[string]interface{}{
		"HTML":  global.HTML,
		"CACHE": global.CACHE,
	}
}
