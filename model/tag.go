package model

import (
	"fmt"
	"strconv"
	"strings"
)

// 标签表
type Tag struct {
	TID    int64
	TName  string
	TCount int64 //关联文章数量
}

// 查询所有标签及对应数量
func (*Tag) QryAll() []Tag {

	sql := "SELECT T.TID,T.TNAME,(SELECT COUNT(TID) FROM RELATION R WHERE R.TID = T.TID ) TCOUNT FROM TAG T ORDER BY TCOUNT DESC"
	rows := qrySql(sql)
	defer rows.Close()
	var (
		data []Tag
		x    Tag
	)
	for rows.Next() {
		rows.Scan(&x.TID, &x.TName, &x.TCount)
		data = append(data, x)
	}
	return data
}

// 查询指定标签数据
func (x *Tag) QryOne() *Tag {

	sql := "SELECT TID,TNAME FROM TAG WHERE TID = " + strconv.FormatInt(x.TID, 10)
	rows := qrySql(sql)
	defer rows.Close()
	for rows.Next() {
		rows.Scan(&x.TID, &x.TName)
	}
	return x
}

// 查询指定ID的标签
func (*Tag) QryTagByNID(nid int64) []Tag {

	sql := fmt.Sprintf("SELECT TID,TNAME FROM TAG WHERE TID IN (SELECT TID FROM RELATION WHERE NID = %d) ORDER BY TNAME ASC", nid)
	rows := qrySql(sql)
	defer rows.Close()
	defer closeRows(rows)
	var (
		data []Tag
		tmp  Tag
	)
	for rows.Next() {
		rows.Scan(&tmp.TID, &tmp.TName)
		data = append(data, tmp)
	}
	return data
}

// 添加标签
func (x *Tag) Insert() bool {

	sql := fmt.Sprintf("INSERT INTO TAG VALUES (NULL,'%s')", strings.TrimSpace(x.TName))
	lines, _ := doSql(sql)
	return lines == 1
}

// 指定NID添加标签
func (*Tag) InsertByNID(nid int64, tags []Tag) bool {

	sql := fmt.Sprintf("DELETE FROM RELATION WHERE NID = %d", nid)
	doSql(sql)
	for _, tag := range tags {
		sql = fmt.Sprintf("INSERT INTO RELATION(TID,NID) VALUES (%d,%d)", tag.TID, nid)
		if lines, _ := doSql(sql); lines == -1 {
			return false
		}
	}
	return true
}

// 删除标签
func (x *Tag) Delete() bool {

	sql := fmt.Sprintf("DELETE FROM RELATION WHERE TID = %d", x.TID)
	if lines, _ := doSql(sql); lines == -1 {
		return false
	}
	sql = fmt.Sprintf(fmt.Sprintf("DELETE FROM TAG WHERE TID =%d", x.TID))
	if lines, _ := doSql(sql); lines == -1 {
		return false
	}
	return true
}

// 更新标签
func (x *Tag) Update() bool {

	sql := fmt.Sprintf(fmt.Sprintf("UPDATE TAG SET TNAME = '%s' WHERE TID =%d", x.TName, x.TID))
	lines, _ := doSql(sql)
	return lines == 1
}
