package model

import (
	"fmt"
	"strings"

	"github.com/rebootok/atlog/global"
)

// 配置表
type Config struct {
	CKey   string
	CVal   string
	CMark  string
	Hidden bool
}

// 查询所有可见配置项
func (*Config) QryShow() []Config {

	sql := "SELECT CKEY,CVAL,CMARK FROM CONFIG WHERE NOT HIDDEN ORDER BY CKEY ASC"
	rows := qrySql(sql)
	defer closeRows(rows)

	var (
		data []Config
		tmp  Config
	)

	for rows.Next() {
		rows.Scan(&tmp.CKey, &tmp.CVal, &tmp.CMark)
		data = append(data, tmp)
	}
	return data
}

// 更新配置项
func (x *Config) Update() bool {

	sql := "UPDATE CONFIG SET "
	if x.CVal != "" {
		sql += fmt.Sprintf("CVAL = '%s'", global.Sqlite(x.CVal))
	}
	if x.CMark != "" {
		sql += fmt.Sprintf(",CMARK = '%s'", x.CMark)
	}
	if x.Hidden {
		sql += ",HIDDEN = TRUE "
	}
	sql += fmt.Sprintf(" WHERE CKEY = '%s'", strings.ToUpper(x.CKey))
	lines, _ := doSql(sql)
	return lines == 1
}
