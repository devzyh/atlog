package global

import (
	"bufio"
	"database/sql"
	"encoding/json"
	"fmt"
	"os"

	"github.com/rebootok/atlog/entity"

	"github.com/gin-gonic/gin"
	_ "github.com/mattn/go-sqlite3"
)

var (
	db  *sql.DB
	err error
)

// 日志初始化
func InitLogger() {

	// 数据目录初始化
	_, err := os.Stat(LogPath)
	if os.IsNotExist(err) {
		err = os.MkdirAll(LogPath, os.ModePerm)
		if err != nil {
			fmt.Println(err.Error())
			os.Exit(1)
		}
	}

	// 日志记录器初始化
	LOG = Logger{SaveDir: LogPath, OnCmd: false, SingFile: false}
}

// 加载配置文件信息
func LoadJson() {

	_, err := os.Stat(CfgPath)
	CFG = entity.Config{
		HTTP_PORT: 8080,
		PASSWORD:  "123456",
		TIMEOUT:   3600,
		SALT_STR:  TimeStamp()}
	if err == nil {
		f, err := os.OpenFile(CfgPath, os.O_RDONLY, 0644)
		if err != nil {
			LOG.Fatal(err.Error())
		}
		defer func() {
			if err := f.Close(); err != nil {
				LOG.Fatal(err.Error())
			}
		}()
		s := bufio.NewScanner(f)
		jsonStr := ""
		for s.Scan() {
			jsonStr += s.Text()
		}
		err = json.Unmarshal([]byte(jsonStr), &CFG)
		if err != nil {
			LOG.Fatal(err.Error())
		}
	}
	LOG.Info(fmt.Sprintf("加载配置文件信息：CFG：%#v", CFG))
}

// 是否登录
func IsAuth(c *gin.Context) bool {

	sess, _ := STORE.Get(c.Request, "ATLOG")
	login := sess.Values["AUTH"] == GenMd5("TRUE@"+CFG.SALT_STR)
	if login {
		sess.Values["AUTH"] = GenMd5("TRUE@" + CFG.SALT_STR)
		err = sess.Save(c.Request, c.Writer)
		if err != nil {
			LOG.Panic("Session保存错误. " + err.Error())
		}
	}
	return login
}
