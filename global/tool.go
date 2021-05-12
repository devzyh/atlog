package global

import (
	"crypto/md5"
	"encoding/hex"
	"errors"
	"net/http"
	"reflect"
	"regexp"
	"strconv"
	"strings"
	"time"
	"unicode"
)

// 返回当前时间字符串
func NowTime() string {

	return time.Now().Local().Format("2006-01-02 15:04:05")
}

// 返回时间戳
func TimeStamp() string {

	return strconv.FormatInt(time.Now().UnixNano(), 10)
}

// 判断是否为时间格式
func IsTime(timeStr string) bool {

	layout := "2006-01-02 15:04:05"
	loc, _ := time.LoadLocation("Asia/Shanghai")
	_, err := time.ParseInLocation(layout, timeStr, loc)
	return err == nil
}

// 字符串是否为数字
func IsDigit(data string) bool {

	for _, item := range data {
		if unicode.IsDigit(item) {
			continue
		} else {
			return false
		}
	}
	return true
}

// MD5生成
func GenMd5(str string) string {

	ctx := md5.New()
	ctx.Write([]byte(str))
	return hex.EncodeToString(ctx.Sum(nil))
}

// 获取真实IP
func ClientIP(req *http.Request) string {

	ip := req.Header.Get("Remote_addr")
	if ip == "" {
		ip = req.RemoteAddr
	}
	return ip
}

// Sqlite 字符串处理
func Sqlite(sql string) string {

	return strings.Replace(sql, "'", "''", -1)
}

// 获取MarkDown简介
func MdSummary(str string) (string, string) {

	tmp, ok := HTML["WORDS"].(int64)
	words, err := strconv.Atoi(strconv.FormatInt(tmp, 10))
	if (!ok) || (err != nil) {
		LOG.Panic("全局常量 WORDS 解析错误. 使用默认值500赋值. " + err.Error())
		words = 10
	}
	// 获取图片
	regImg, _ := regexp.Compile("!\\[(.*?)\\]\\((.*?)\\)")
	fImg := regImg.FindString(str)
	if fImg != "" {
		fImg = fImg[strings.Index(fImg, "(")+1 : strings.Index(fImg, ")")]
	}
	txt := []rune(str)
	if len(txt) > words {
		txt = txt[:words]
	}
	reg, _ := regexp.Compile("[!\"#$%&'()*+,./:;<=>?@[\\\\\\]^_`{|}~-]")

	str = reg.ReplaceAllString(string(txt), " ")
	return str + " ...", fImg
}

// MustData 检测结构体是否为零值
func MustData(data interface{}, fields ...string) (bool, error) {

	// 检测数据类型 获取反射数据
	dataType := reflect.TypeOf(data)
	if dataType.Kind() != reflect.Struct {
		return false, errors.New("数据类型不是 Struct . ")
	}
	dataVal := reflect.ValueOf(data)

	if len(fields) == 0 {
		for i := 0; i < dataVal.NumField(); i++ {
			if dataVal.Field(i).IsZero() {
				return false, errors.New("字段 " + dataType.Field(i).Name + " 的值为零值. ")
			}
		}
	} else {
		for i := 0; i < len(fields); i++ {
			if dataVal.FieldByName(fields[i]).IsZero() {
				field, bHave := dataType.FieldByName(fields[i])
				if bHave {
					return false, errors.New("字段 " + field.Name + " 的值为零值. ")
				}
			}
		}
	}

	return true, nil
}
