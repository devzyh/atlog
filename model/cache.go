package model

import (
	"github.com/rebootok/atlog/global"
	"strconv"
)

// 数据缓存

// 初始化 global.CACHE
func LoadCache() {

	UpNoteList()
	UpMessageList()
	UpTagList()
}

// 更新 NoteList数据
func UpNoteList() {

	data := Note{}
	global.CACHE.NoteList, _ = data.QryAll(false, false, 1, listSize(), "")
}

// 更新 MessageList数据
func UpMessageList() {

	data := Message{}
	global.CACHE.MessageList, _ = data.QryAll(false, 1, listSize())
}

// 更新 TagList数据
func UpTagList() {

	data := Tag{}
	global.CACHE.TagList = data.QryAll()[:listSize()]
}

// 获取缓存数据量限制
func listSize() int {

	tmp, ok := global.HTML["CACHESIZE"].(int64)
	size, err := strconv.Atoi(strconv.FormatInt(tmp, 10))
	if (!ok) || (err != nil) {
		global.LOG.Panic("全局常量 CACHESIZE 解析错误. 使用默认值 10 赋值. " + err.Error())
		size = 10
	}
	return size
}
