package entity

// 结果集返回信息
type Result struct {
	Status  bool        // 请求状态
	Message string      // 提示信息
	Data    interface{} // 返回数据
}
