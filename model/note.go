package model

import (
	"fmt"
	"html/template"
	"strings"

	"github.com/rebootok/atlog/global"
)

// 页面表
type Note struct {
	NID    int64
	NUrl   string
	NTitle string
	NText  template.HTML
	NTime  string
	Draft  bool   // 存为草稿
	Single bool   // 独立页面
	NoTalk bool   // 禁止评论
	NImage string // 第一张图像
	Tags   []Tag  // 标签列表
}

/* 查询列表
 * 参数：
 * auth 是否验证 single 是否单页 page limit 分页参数 key 搜索关键字
 */
func (*Note) QryAll(auth, single bool, page, limit int, key string) ([]Note, int64) {

	sqlCond := " WHERE"
	if !auth {
		sqlCond += " NOT DRAFT AND"
	}
	if single {
		sqlCond += " SINGLE"
	} else {
		sqlCond += " NOT SINGLE"
	}
	if len(strings.TrimSpace(key)) > 0 {
		sqlCond += " AND NTITLE LIKE '%" + key + "%'"
	}

	sql := "SELECT COUNT(NID) FROM NOTE " + sqlCond
	count := first(sql).(int64)
	sql = fmt.Sprintf("SELECT NID,IFNULL(NURL,'')NURL,NTITLE,NTEXT,NTIME,DRAFT FROM NOTE %s ORDER BY DRAFT DESC,NTIME DESC LIMIT %d,%d",
		sqlCond, (page-1)*limit, limit)
	rows := qrySql(sql)
	defer closeRows(rows)

	var (
		data []Note
		tmp  Note
	)
	for rows.Next() {
		rows.Scan(&tmp.NID, &tmp.NUrl, &tmp.NTitle, &tmp.NText, &tmp.NTime, &tmp.Draft)
		text, fImg := global.MdSummary(string(tmp.NText))
		tmp.NText = template.HTML(text)
		tmp.NImage = fImg
		data = append(data, tmp)
	}
	return data, count
}

// 查询指定标签ID数据
func (*Note) QryByTID(auth bool, id string, page, limit int) ([]Note, int64) {

	sqlCond := "WHERE "
	if !auth {
		sqlCond += " NOT DRAFT"
	}
	sqlCond += fmt.Sprintf(" AND NID IN (SELECT NID FROM RELATION WHERE TID = %s)", id)
	sql := "SELECT COUNT(NID) FROM NOTE " + sqlCond
	count := first(sql).(int64)
	sql = fmt.Sprintf("SELECT NID,IFNULL(NURL,'')NURL,NTITLE,NTEXT,NTIME,DRAFT FROM NOTE %s ORDER BY DRAFT DESC,NTIME DESC LIMIT %d,%d",
		sqlCond, (page-1)*limit, limit)
	rows := qrySql(sql)
	defer closeRows(rows)

	var (
		data []Note
		tmp  Note
	)
	for rows.Next() {
		rows.Scan(&tmp.NID, &tmp.NUrl, &tmp.NTitle, &tmp.NText, &tmp.NTime, &tmp.Draft)
		text, fImg := global.MdSummary(string(tmp.NText))
		tmp.NText = template.HTML(text)
		tmp.NImage = fImg
		data = append(data, tmp)
	}
	return data, count
}

// 查询指定ID文章
func (x *Note) QryOne() {

	sql := fmt.Sprintf("SELECT IFNULL(NURL,'')NURL,NTITLE,NTEXT,NTIME,DRAFT,SINGLE,NOTALK FROM NOTE WHERE NID = %d", x.NID)
	rows := qrySql(sql)
	defer closeRows(rows)
	for rows.Next() {
		rows.Scan(&x.NUrl, &x.NTitle, &x.NText, &x.NTime, &x.Draft, &x.Single, &x.NoTalk)
	}
}

// 查询指定别名单页
func (x *Note) QrySingle() {

	sql := fmt.Sprintf("SELECT NID,NTITLE,NTEXT,NTIME,DRAFT,SINGLE,NOTALK FROM NOTE WHERE NURL = '%s'", x.NUrl)
	rows := qrySql(sql)
	defer closeRows(rows)
	for rows.Next() {
		rows.Scan(&x.NID, &x.NTitle, &x.NText, &x.NTime, &x.Draft, &x.Single, &x.NoTalk)
	}
}

// NID重复检测
func (x *Note) QryNID() bool {

	sql := fmt.Sprintf("SELECT COUNT(NID) FROM NOTE WHERE NID = %d", x.NID)
	return first(sql).(int64) > 0
}

// NUrl重复检测
func (x *Note) QryNUrl() bool {

	// 仅单页才可以使用自定义路径
	sql := fmt.Sprintf("SELECT COUNT(NID) FROM NOTE WHERE NID <> %d AND NURL = TRIM('%s') AND SINGLE", x.NID, strings.ToLower(x.NUrl))
	return first(sql).(int64) > 0
}

// 添加页面
func (x *Note) Insert() bool {

	if x.Single {
		x.NUrl = "'" + strings.ToLower(strings.TrimSpace(x.NUrl)) + "'"
	} else {
		x.NUrl = "NULL"
	}
	sql := fmt.Sprintf("INSERT INTO NOTE(NID,NURL,NTITLE,NTEXT,NTIME,DRAFT,SINGLE,NOTALK)VALUES (NULL,%s,'%s','%s','%s',%t,%t,%t)",
		x.NUrl, x.NTitle, global.Sqlite(fmt.Sprint(x.NText)), x.NTime, x.Draft, x.Single, x.NoTalk)
	lines, id := doSql(sql)
	if lines == 1 {
		x.NID = id
		return true
	} else {
		x.NID = -1
		return false
	}
}

// 更新页面
func (x *Note) Update() bool {

	if x.Single {
		x.NUrl = "'" + strings.ToLower(strings.TrimSpace(x.NUrl)) + "'"
	} else {
		x.NUrl = "NULL"
	}
	sql := fmt.Sprintf("UPDATE NOTE SET NURL = %s, NTITLE = '%s', NTEXT = '%s', NTIME = '%s', DRAFT = %t, NOTALK = %t WHERE NID = %d ",
		x.NUrl, x.NTitle, global.Sqlite(fmt.Sprint(x.NText)), x.NTime, x.Draft, x.NoTalk, x.NID)
	lines, _ := doSql(sql)
	return lines == 1
}

func (x *Note) Delete() bool {

	sql := fmt.Sprintf("DELETE FROM NOTE WHERE NID = %d", x.NID)
	lines, _ := doSql(sql)
	return lines == 1
}
