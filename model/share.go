package model

import (
	"fmt"
	"html/template"

	"github.com/rebootok/atlog/global"
)

// 笔记表
type Share struct {
	SID   int64
	SText template.HTML
	STime string
}

// QryPage 根据分页查询数据
func (x *Share) QryPage(page, limit int) ([]Share, int64) {

	sql := "SELECT COUNT(SID) FROM SHARE"
	count := first(sql).(int64)
	sql = fmt.Sprintf("SELECT SID,STEXT,STIME FROM SHARE ORDER BY SID DESC LIMIT %d,%d",
		(page-1)*limit, limit)
	rows := qrySql(sql)
	defer closeRows(rows)

	var (
		data []Share
		tmp  Share
	)
	for rows.Next() {
		rows.Scan(&tmp.SID, &tmp.SText, &tmp.STime)
		data = append(data, tmp)
	}
	return data, count
}

// 添加笔记 返回ID/-1
func (x *Share) Insert() bool {

	sql := fmt.Sprintf("INSERT INTO SHARE(SID,STEXT,STIME) VALUES(NULL,'%s','%s')",
		global.Sqlite(fmt.Sprint(x.SText)), global.NowTime())
	lines, id := doSql(sql)
	if lines == 1 {
		x.SID = id
		return true
	} else {
		x.SID = -1
		return false
	}
}

// 删除笔记
func (x *Share) Delete() bool {

	sql := fmt.Sprintf("DELETE FROM SHARE WHERE SID =%d", x.SID)
	lines, _ := doSql(sql)
	return lines == 1
}
