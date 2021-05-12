package entity

// 登录请求实体
type AuthData struct {
	Passwd  string
	VeCode  string
	CodeKey string
}
