package man

import (
	"strings"

	"github.com/mojocn/base64Captcha"
)

// 字符,公式,验证码配置
var charConfig = base64Captcha.ConfigCharacter{
	Height: 60,
	Width:  240,
	//const CaptchaModeNumber:数字,
	// 		CaptchaModeAlphabet:字母,
	// 		CaptchaModeArithmetic:算术,
	// 		CaptchaModeNumberAlphabet:数字字母混合.
	Mode:               base64Captcha.CaptchaModeArithmetic,
	ComplexOfNoiseText: base64Captcha.CaptchaComplexLower,
	ComplexOfNoiseDot:  base64Captcha.CaptchaComplexLower,
	IsShowHollowLine:   false,
	IsShowNoiseDot:     false,
	IsShowNoiseText:    false,
	IsShowSlimeLine:    false,
	IsShowSineLine:     false,
	CaptchaLen:         6,
}

// 生成验证码图片和ID
func GenCodeImg() (string, string) {

	key, captcha := base64Captcha.GenerateCaptcha("", charConfig)
	img := base64Captcha.CaptchaWriteToBase64Encoding(captcha)
	return key, img
}

// 验证输入结果
func VeifyKey(key, input string) bool {

	return base64Captcha.VerifyCaptcha(strings.Trim(key, ""), strings.Trim(input, ""))
}
