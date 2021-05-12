package model

import (
	"fmt"

	"github.com/rebootok/atlog/global"
)

// 评论表
type Message struct {
	MID    int64
	NID    int64
	MCall  int64
	MNick  string
	MMark  string
	MText  string
	Review bool
	MIP    string
	MTime  string
}

// 查询所有评论
func (*Message) QryAll(auth bool, page, limit int) ([]Message, int64) {

	sqlCond := ""
	if !auth {
		sqlCond += " WHERE REVIEW "
	}
	sql := "SELECT COUNT(MID) FROM MESSAGE" + sqlCond
	count := first(sql).(int64)
	sql = fmt.Sprintf("SELECT MID,MNICK,MMARK,MTEXT,MIP,REVIEW FROM MESSAGE %s ORDER BY REVIEW,MID DESC LIMIT %d,%d;",
		sqlCond, (page-1)*limit, limit)
	rows := qrySql(sql)
	defer closeRows(rows)
	var (
		data []Message
		tmp  Message
	)
	for rows.Next() {
		rows.Scan(&tmp.MID, &tmp.MNick, &tmp.MMark, &tmp.MText, &tmp.MIP, &tmp.Review)
		data = append(data, tmp)
	}
	return data, count
}

// 查询未审核数量
func QryReviewCnt() int64 {

	sql := "SELECT COUNT(MID) FROM MESSAGE WHERE NOT REVIEW"
	return first(sql).(int64)
}

// 查询指定文章ID的评论
func (x *Message) QryMsgByNID(page, limit int) ([]Message, int64) {

	sqlCond := fmt.Sprintf(" WHERE REVIEW AND NID = %d ", x.NID)
	sql := "SELECT COUNT(MID) FROM MESSAGE" + sqlCond
	count := first(sql).(int64)
	sql = fmt.Sprintf("SELECT MID,IFNULL(MCALL,0) MCALL,MNICK,MMARK,MTEXT,MTIME FROM MESSAGE %s ORDER BY REVIEW,MID DESC LIMIT %d,%d",
		sqlCond, (page-1)*limit, limit)
	rows := qrySql(sql)
	defer closeRows(rows)

	var (
		data []Message
		tmp  Message
	)
	for rows.Next() {
		rows.Scan(&tmp.MID, &tmp.MCall, &tmp.MNick, &tmp.MMark, &tmp.MText, &tmp.MTime)
		data = append(data, tmp)
	}
	return data, count
}

// 查询IP最近留言时间
func (x *Message) QryDateByIP() string {

	sql := fmt.Sprintf("SELECT IFNULL(MAX(MTIME),'2019-11-17 21:39:00') FROM MESSAGE WHERE MIP ='%s'", x.MIP)
	return first(sql).(string)
}

// 添加评论
func (x *Message) Insert() bool {

	sql := fmt.Sprintf("INSERT INTO MESSAGE(MID, NID, MCALL, MNICK, MMARK, MTEXT, REVIEW, MIP, MTIME)VALUES (NULL, %d, %d, '%s', '%s', '%s', %t, '%s',  '%s')",
		x.NID, x.MCall, x.MNick, x.MMark, global.Sqlite(x.MText), x.Review, x.MIP, global.NowTime())
	lines, _ := doSql(sql)
	return lines == 1
}

// 删除评论
func (x *Message) Delete() bool {

	sql := fmt.Sprintf("DELETE FROM MESSAGE WHERE mID = %d", x.MID)
	lines, _ := doSql(sql)
	return lines == 1
}

// 更新评论状态
func (x *Message) Update() bool {

	sql := fmt.Sprintf("UPDATE MESSAGE SET REVIEW = TRUE WHERE MID = %d", x.MID)
	lines, _ := doSql(sql)
	return lines == 1
}
