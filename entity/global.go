package entity

type Config struct {
	HTTP_PORT int
	PASSWORD  string
	TIMEOUT   int
	SALT_STR  string
	QN_AK     string
	QN_SK     string
	QN_BUCKET string
}

type Cache struct {
	// 最新发布笔记
	NoteList interface{}
	// 最新审核留言
	MessageList interface{}
	// 最多文章标签
	TagList interface{}
}
