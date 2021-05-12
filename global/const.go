package global

// 文件路径常量
const (
	DbPath     = "data/atlog.db"      // 数据文件路径
	CfgPath    = "data/atlog.json"    // 配置文件路径
	LogPath    = "data/log/"          // 日志保存路径
	FilePath   = "data/file/"         // 文件保存路径
	StaticPath = "static"             // 静态资源路径
	IconPath   = "static/favicon.ico" // 图标文件路径
)

// 复用字符串
const (
	// 笔记相关
	TimePraseErr = "日期格式不正确"
	NoteMustTag  = "笔记必须设置标签"
	SingeMustUrl = "单页必须设置别名"
	UrlIsNumber  = "别名不能为纯数字"
	UrlIsUsed    = "页面别名已存在"
	// 登陆相关
	VerifyCodeErr = "验证码结果错误"
	PasswordErr   = "登录密码错误"
	LoginSuccess  = "登录成功"
	// 留言相关
	ReqIsTooHigh = "请求频率过高"
	// 数据处理类
	DataPraseErr = "数据解析失败"
	DataTypeErr  = "数据格式错误"
	// 操作验证类
	AuthDataErr = "数据验证失败"
	NotAllowed  = "无权访问资源"
	// 操作结果类
	OptSuccess = "操作成功"
	OptFaild   = "操作失败"
)

// 数据库脚本
const DbScript = `
create table if not exists config
(
    ckey    VARCHAR(255)  primary key,
    cval    STRING        not null,
    cmark   VARCHAR(255),
    hidden  BOOLEAN
);

create table if not exists share
(
    sid    INTEGER      primary key autoincrement,
    stext  STRING       not null,
    stime  VARCHAR(20)  not null
);

create table if not exists note
(
    nid     INTEGER      not null primary key autoincrement,
    nurl    VARCHAR(255) unique,
    ntitle  VARCHAR(255) not null,
    ntext   TEXT         not null,
    ntime   VARCHAR(20)  not null,
    draft   BOOLEAN      not null,
    single  BOOLEAN      not null,
    notalk  BOOLEAN      not null
);

create table if not exists tag
(
    tid   INTEGER       not null primary key autoincrement,
    tname VARCHAR(255) not null
);

create table if not exists relation
(
    tid   INTEGER not null references tag (tid),
    nid   INTEGER not null references note (nid),
    primary key (tid, nid)
);

create table if not exists message
(
    mid     INTEGER      primary key autoincrement,
    nid     INTEGER      not null references note (nid),
    mcall   BIGINT       references message (mid),
    mnick   VARCHAR(255) not null,
    mmark   VARCHAR(255),
    mtext   STRING       not null,
    review  BOOLEAN      not  null,
    mip     VARCHAR(50)  not null,
    mtime   VARCHAR(20)  not null
);

INSERT INTO config (ckey, cval, cmark, hidden) VALUES ('TITLE', 'AtLog博客', '站点标题', 0);
INSERT INTO config (ckey, cval, cmark, hidden) VALUES ('TIPMSG', '网站正在不断的成长中 ...', '站点头条信息', 0);
INSERT INTO config (ckey, cval, cmark, hidden) VALUES ('PAGESIZE', 6, '每页显示文章数量，INT类型', 0);
INSERT INTO config (ckey, cval, cmark, hidden) VALUES ('KEYWORD', 'Atlog,RebootOK,博客,轻量级个人博客', '页面SEO关键字，多个使用英文逗号分隔', 0);
INSERT INTO config (ckey, cval, cmark, hidden) VALUES ('WORDS', 500, '列表显示最大文本字符数,INT类型', 0);
INSERT INTO config (ckey, cval, cmark, hidden) VALUES ('DESCRIPTION', '一个人技术人的博客', '页面描述信息', 0);
INSERT INTO config (ckey, cval, cmark, hidden) VALUES ('SUMMARY', '一位效率极低的菜鸡开发者', '个人简介', 1);
INSERT INTO config (ckey, cval, cmark, hidden) VALUES ('REVIEWS', 0, '未审核评论数', 1);
INSERT INTO config (ckey, cval, cmark, hidden) VALUES ('NICK', 'RebootOK', '昵称', 1);
INSERT INTO config (ckey, cval, cmark, hidden) VALUES ('EMAIL', 'mail@rebootok.com', '联系邮箱', 1);
INSERT INTO config (ckey, cval, cmark, hidden) VALUES ('AVATAR', '/file/2019/12/15758670449.png', '头像地址', 1);
INSERT INTO config (ckey, cval, cmark, hidden) VALUES ('QN_INTERVAL', '7', '文件备份周期，单位：天，必须配置七牛云KODO授权信息', 0);
INSERT INTO config (ckey, cval, cmark, hidden) VALUES ('QN_TIME', '', '最后备份时间，备份功能使用', 1);
INSERT INTO config (ckey, cval, cmark, hidden) VALUES ('CACHESIZE',10, '缓存列表展示数量', 0);

INSERT INTO note (nid, nurl, ntitle, ntext, ntime, draft, single, notalk) VALUES (NULL, 'about', '关于我', '* RebootOK

* mail@rebootok.com

* 一个简单的个人博客 ...

* https://gitee.com/rebootok/atlog', '2019-11-20 22:34:04', 0, 1, 0);
`
