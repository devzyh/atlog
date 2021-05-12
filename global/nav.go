package global

import (
	"strconv"
)

type Pagination struct {
	PageSize  int // 每页数量
	PageCount int // 总页数
	Current   int // 当前页
	Prev      int // 上一页
	Next      int // 下一页
	dataRows  int // 总行数
}

// 设置总数据数
func (x *Pagination) SetRows(rows int64) {

	iRows, err := strconv.Atoi(strconv.FormatInt(rows, 10))
	if err != nil {
		LOG.Panic("分页设置总行数. 数据类型转换发生错误. " + err.Error())
	}
	x.dataRows = iRows
}

// 设置每页条数
func (x *Pagination) SetPageSize(pageSize int) {

	x.PageSize = pageSize
}

// 获取每页条数
func (x *Pagination) GetPageSize() int {

	//获取分页
	if x.PageSize <= 1 {
		tmp, ok := HTML["PAGESIZE"].(int64)
		size, err := strconv.Atoi(strconv.FormatInt(tmp, 10))
		if (!ok) || (err != nil) {
			LOG.Panic("全局常量 PAGESIZE 解析错误. 使用默认值 10 赋值. " + err.Error())
			size = 10
		}
		x.PageSize = size
	}
	return x.PageSize
}

// 计算相关数据
func (x *Pagination) GetData() *Pagination {

	if x.dataRows <= 0 {
		LOG.Panic("获取分页数据成功但数据总行数为0. ")
		return x
	}

	x.PageSize = x.GetPageSize()

	// 计算数据
	x.PageCount = x.dataRows / x.PageSize
	if x.PageCount == 0 {
		x.PageCount = 1 // 不足一页
	}
	if x.dataRows >= (x.PageSize * x.PageCount) {
		x.PageCount += 1
	}

	// 设置属性
	if x.Current <= 1 {
		x.Current = 1
		x.Prev = 1
	} else {
		x.Prev = x.Current - 1
	}
	if x.Current >= x.PageCount {
		x.Current = x.PageCount
		x.Next = x.PageCount
	} else {
		x.Next = x.Current + 1
	}
	return x
}
