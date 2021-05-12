package model

import (
	"database/sql"
	"fmt"

	_ "github.com/mattn/go-sqlite3"
	"github.com/rebootok/atlog/global"
)

var (
	_db  *sql.DB
	_err error
)

// 初始化数据库连接
func InitDbConn() {

	_db, _err = sql.Open("sqlite3", global.DbPath)
	if _err != nil {
		global.LOG.Fatal(_err.Error())
	}
	_db.Exec(global.DbScript)
}

// 加载数据库配置
func LoadConfig() {

	rows := qrySql("SELECT CKEY,CVAL FROM CONFIG")
	defer rows.Close()
	var key string
	var val interface{}
	global.HTML = make(map[string]interface{})
	for rows.Next() {
		rows.Scan(&key, &val)
		global.HTML[key] = val
	}
	global.LOG.Info(fmt.Sprintf("加载全局配置信息：HTML：%#v", global.HTML))
}

// 关闭数据库连接
func CloseDbConn() {

	if _err = _db.Close(); _err != nil {
		global.LOG.Panic(_err.Error())
	}
}

// 查询单列数据的首行
func first(sql string) interface{} {

	rows, err := _db.Query(sql)
	defer rows.Close()
	if err != nil {
		global.LOG.Panic("执行sql：" + sql + "出现错误. " + err.Error())
		return nil
	} else {
		var res interface{}
		rows.Next()
		rows.Scan(&res)
		return res
	}
}

// 查询数据 记得执行 rows.Close()
func qrySql(sql string) *sql.Rows {

	rows, err := _db.Query(sql)
	if err != nil {
		global.LOG.Panic("执行sql：" + sql + "出现错误. " + err.Error())
		return nil
	} else {
		return rows
	}
}

// 关闭数据行读取
func closeRows(rows *sql.Rows) {

	err := rows.Close()
	if err != nil {
		global.LOG.Panic("查询SQL关闭出现错误. " + err.Error())
	}
}

// 更新数据
func doSql(sql string) (int64, int64) {

	res, err := _db.Exec(sql)
	if err != nil {
		global.LOG.Panic("执行sql：" + sql + "出现错误. " + err.Error())
		return -1, -1
	} else {
		global.LOG.Info("执行sql：" + sql)
		lines, _ := res.RowsAffected()
		id, _ := res.LastInsertId()
		return lines, id
	}
}
