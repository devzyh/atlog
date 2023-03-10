/**
 * simplemde v1.7.2 Atlog 修改版
 * Copyright Next Step Webs, Inc.
 * @link https://github.com/NextStepWebs/simplemde-markdown-editor
 * @license MIT
 * 添加上传图片的功能，font-awesome资源本地化
 * libdir 为修改后资源的网站URL根目录
 */

var libdir = "/static/sme/"

function fixShortcut(e) {
    return e = isMac ? e.replace("Ctrl", "Cmd") : e.replace("Cmd", "Ctrl")
}

function createIcon(e, t) {
    e = e || {};
    var r = document.createElement("a");
    return t = void 0 == t ? !0 : t, e.title && t && (r.title = e.title, isMac && (r.title = r.title.replace("Ctrl", "⌘"), r.title = r.title.replace("Alt", "⌥"))), r.className = e.className, r
}

function createSep() {
    return el = document.createElement("i"), el.className = "separator", el.innerHTML = "|", el
}

function getState(e, t) {
    t = t || e.getCursor("start");
    var r = e.getTokenAt(t);
    if (!r.type) return {};
    for (var n, i, o = r.type.split(" "), l = {}, a = 0; a < o.length; a++) n = o[a], "strong" === n ? l.bold = !0 : "variable-2" === n ? (i = e.getLine(t.line), /^\s*\d+\.\s/.test(i) ? l["ordered-list"] = !0 : l["unordered-list"] = !0) : "atom" === n ? l.quote = !0 : "em" === n ? l.italic = !0 : "quote" === n ? l.quote = !0 : "strikethrough" === n ? l.strikethrough = !0 : "comment" === n && (l.code = !0);
    return l
}

function toggleFullScreen(e) {
    var t = e.codemirror;
    t.setOption("fullScreen", !t.getOption("fullScreen")), t.getOption("fullScreen") ? (saved_overflow = document.body.style.overflow, document.body.style.overflow = "hidden") : document.body.style.overflow = saved_overflow;
    var r = t.getWrapperElement();
    /fullscreen/.test(r.previousSibling.className) ? r.previousSibling.className = r.previousSibling.className.replace(/\s*fullscreen\b/, "") : r.previousSibling.className += " fullscreen";
    var n = e.toolbarElements.fullscreen;
    /active/.test(n.className) ? n.className = n.className.replace(/\s*active\s*/g, "") : n.className += " active";
    var i = t.getWrapperElement().nextSibling;
    /editor-preview-active-side/.test(i.className) && toggleSideBySide(e)
}

function toggleBold(e) {
    _toggleBlock(e, "bold", "**")
}

function toggleItalic(e) {
    _toggleBlock(e, "italic", "*")
}

function toggleStrikethrough(e) {
    _toggleBlock(e, "strikethrough", "~~")
}

function toggleCodeBlock(e) {
    _toggleBlock(e, "code", "```\r\n", "\r\n```")
}

function toggleBlockquote(e) {
    var t = e.codemirror;
    _toggleLine(t, "quote")
}

function toggleHeadingSmaller(e) {
    var t = e.codemirror;
    _toggleHeading(t, "smaller")
}

function toggleHeadingBigger(e) {
    var t = e.codemirror;
    _toggleHeading(t, "bigger")
}

function toggleHeading1(e) {
    var t = e.codemirror;
    _toggleHeading(t, void 0, 1)
}

function toggleHeading2(e) {
    var t = e.codemirror;
    _toggleHeading(t, void 0, 2)
}

function toggleHeading3(e) {
    var t = e.codemirror;
    _toggleHeading(t, void 0, 3)
}

function toggleUnorderedList(e) {
    var t = e.codemirror;
    _toggleLine(t, "unordered-list")
}

function toggleOrderedList(e) {
    var t = e.codemirror;
    _toggleLine(t, "ordered-list")
}

function drawLink(e) {
    var t = e.codemirror, r = getState(t);
    _replaceSelection(t, r.link, "[", "](http://)")
}

// Upload
function drawImage(e) {

	if (e.options.upload == undefined) {
		alert("upload is undefined.");
		return;
	}
	var t = e.codemirror,
	r = getState(t);
	var sme = document.getElementById('sme-upload');
	sme.click();
	sme.onchange = function(file) {
	
		var file = sme.files[0];
		// 图片限制
		var exten = file.name.substr(file.name.lastIndexOf(".") + 1).toLowerCase();
		var type = ".bmp.jpg.jpeg.png.tif.gif.pcx.tga.exif.fpx.svg.psd.cdr.pcd.dxf.ufo.eps.ai.raw.WMF.webp";
		if (type.indexOf(exten) == -1) {
			alert("not an image file .");
			return;
		}
		// 上传数据
		var form = new FormData();
		form.append("file", file);
		xhr = new XMLHttpRequest();
		xhr.open("post", e.options.upload, true);
		xhr.onload = function() {
			var data = JSON.parse(xhr.responseText);
			console.log(data);
			if (data.success == 1) {
				_replaceSelection(t, r.image, "![](" + data.url, ")");
			} else {
				alert(data.message + " .");
			}
		};
		xhr.onerror = function() {
			alert("upload faild .");
		};
		xhr.send(form);
	}
}

function drawHorizontalRule(e) {
    var t = e.codemirror, r = getState(t);
    _replaceSelection(t, r.image, "", "\n\n-----\n\n")
}

function undo(e) {
    var t = e.codemirror;
    t.undo(), t.focus()
}

function redo(e) {
    var t = e.codemirror;
    t.redo(), t.focus()
}

function toggleSideBySide(e) {
    var t = e.codemirror, r = t.getWrapperElement(), n = (r.firstChild, r.nextSibling),
        i = e.toolbarElements["side-by-side"];
    /editor-preview-active-side/.test(n.className) ? (n.className = n.className.replace(/\s*editor-preview-active-side\s*/g, ""), i.className = i.className.replace(/\s*active\s*/g, ""), r.className = r.className.replace(/\s*CodeMirror-sided\s*/g, " ")) : (setTimeout(function () {
        t.getOption("fullScreen") || toggleFullScreen(e), n.className += " editor-preview-active-side"
    }, 1), i.className += " active", r.className += " CodeMirror-sided");
    var o = r.lastChild;
    if (/editor-preview-active/.test(o.className)) {
        o.className = o.className.replace(/\s*editor-preview-active\s*/g, "");
        var l = e.toolbarElements.preview, a = r.previousSibling;
        l.className = l.className.replace(/\s*active\s*/g, ""), a.className = a.className.replace(/\s*disabled-for-preview*/g, "")
    }
    n.innerHTML = e.options.previewRender(e.value(), n), t.on("update", function () {
        n.innerHTML = e.options.previewRender(e.value(), n)
    })
}

function togglePreview(e) {
    var t = e.codemirror, r = t.getWrapperElement(), n = r.previousSibling, i = e.toolbarElements.preview,
        o = r.lastChild;
    o && /editor-preview/.test(o.className) || (o = document.createElement("div"), o.className = "markdown-body editor-preview ", r.appendChild(o)), /editor-preview-active/.test(o.className) ? (o.className = o.className.replace(/\s*editor-preview-active\s*/g, ""), i.className = i.className.replace(/\s*active\s*/g, ""), n.className = n.className.replace(/\s*disabled-for-preview*/g, "")) : (setTimeout(function () {
        o.className += " editor-preview-active"
    }, 1), i.className += " active", n.className += " disabled-for-preview"), o.innerHTML = e.options.previewRender(e.value(), o);
    var l = t.getWrapperElement().nextSibling;
    /editor-preview-active-side/.test(l.className) && toggleSideBySide(e)
}

function _replaceSelection(e, t, r, n) {
    if (!/editor-preview-active/.test(e.getWrapperElement().lastChild.className)) {
        var i, o = e.getCursor("start"), l = e.getCursor("end");
        t ? (i = e.getLine(o.line), r = i.slice(0, o.ch), n = i.slice(o.ch), e.replaceRange(r + n, {
            line: o.line,
            ch: 0
        })) : (i = e.getSelection(), e.replaceSelection(r + i + n), o.ch += r.length, o !== l && (l.ch += r.length)), e.setSelection(o, l), e.focus()
    }
}

function _toggleHeading(e, t, r) {
    if (!/editor-preview-active/.test(e.getWrapperElement().lastChild.className)) {
        for (var n = e.getCursor("start"), i = e.getCursor("end"), o = n.line; o <= i.line; o++) !function (n) {
            var i = e.getLine(n), o = i.search(/[^#]/);
            i = void 0 !== t ? 0 >= o ? "bigger" == t ? "###### " + i : "# " + i : 6 == o && "smaller" == t ? i.substr(7) : 1 == o && "bigger" == t ? i.substr(2) : "bigger" == t ? i.substr(1) : "#" + i : 1 == r ? 0 >= o ? "# " + i : o == r ? i.substr(o + 1) : "# " + i.substr(o + 1) : 2 == r ? 0 >= o ? "## " + i : o == r ? i.substr(o + 1) : "## " + i.substr(o + 1) : 0 >= o ? "### " + i : o == r ? i.substr(o + 1) : "### " + i.substr(o + 1), e.replaceRange(i, {
                line: n,
                ch: 0
            }, {line: n, ch: 99999999999999})
        }(o);
        e.focus()
    }
}

function _toggleLine(e, t) {
    if (!/editor-preview-active/.test(e.getWrapperElement().lastChild.className)) {
        for (var r = getState(e), n = e.getCursor("start"), i = e.getCursor("end"), o = {
            quote: /^(\s*)\>\s+/,
            "unordered-list": /^(\s*)(\*|\-|\+)\s+/,
            "ordered-list": /^(\s*)\d+\.\s+/
        }, l = {
            quote: "> ",
            "unordered-list": "* ",
            "ordered-list": "1. "
        }, a = n.line; a <= i.line; a++) !function (n) {
            var i = e.getLine(n);
            i = r[t] ? i.replace(o[t], "$1") : l[t] + i, e.replaceRange(i, {line: n, ch: 0}, {
                line: n,
                ch: 99999999999999
            })
        }(a);
        e.focus()
    }
}

function _toggleBlock(e, t, r, n) {
    if (!/editor-preview-active/.test(e.codemirror.getWrapperElement().lastChild.className)) {
        n = "undefined" == typeof n ? r : n;
        var i, o = e.codemirror, l = getState(o), a = r, s = n, u = o.getCursor("start"), c = o.getCursor("end");
        l[t] ? (i = o.getLine(u.line), a = i.slice(0, u.ch), s = i.slice(u.ch), "bold" == t ? (a = a.replace(/(\*\*|__)(?![\s\S]*(\*\*|__))/, ""), s = s.replace(/(\*\*|__)/, "")) : "italic" == t ? (a = a.replace(/(\*|_)(?![\s\S]*(\*|_))/, ""), s = s.replace(/(\*|_)/, "")) : "strikethrough" == t && (a = a.replace(/(\*\*|~~)(?![\s\S]*(\*\*|~~))/, ""), s = s.replace(/(\*\*|~~)/, "")), o.replaceRange(a + s, {
            line: u.line,
            ch: 0
        }, {
            line: u.line,
            ch: 99999999999999
        }), "bold" == t || "strikethrough" == t ? (u.ch -= 2, u !== c && (c.ch -= 2)) : "italic" == t && (u.ch -= 1, u !== c && (c.ch -= 1))) : (i = o.getSelection(), "bold" == t ? (i = i.split("**").join(""), i = i.split("__").join("")) : "italic" == t ? (i = i.split("*").join(""), i = i.split("_").join("")) : "strikethrough" == t && (i = i.split("~~").join("")), o.replaceSelection(a + i + s), u.ch += r.length, c.ch = u.ch + i.length), o.setSelection(u, c), o.focus()
    }
}

function wordCount(e) {
    var t = /[a-zA-Z0-9_\u0392-\u03c9]+|[\u4E00-\u9FFF\u3400-\u4dbf\uf900-\ufaff\u3040-\u309f\uac00-\ud7af]+/g,
        r = e.match(t), n = 0;
    if (null === r) return n;
    for (var i = 0; i < r.length; i++) n += r[i].charCodeAt(0) >= 19968 ? r[i].length : 1;
    return n
}

function SimpleMDE(e) {
    e = e || {}, e.parent = this;
    var t = !0;
    if (e.autoDownloadFontAwesome === !1 && (t = !1), e.autoDownloadFontAwesome !== !0) for (var r = document.styleSheets, n = 0; n < r.length; n++) r[n].href && r[n].href.indexOf("//maxcdn.bootstrapcdn.com/font-awesome/") > -1 && (t = !1);
    if (t) {
        var i = document.createElement("link");
        i.rel = "stylesheet", i.href = libdir + "font-awesome/css/font-awesome.min.css", document.getElementsByTagName("head")[0].appendChild(i)
    }
    if (e.element) this.element = e.element; else if (null === e.element) return void console.log("SimpleMDE: Error. No element was found.");
    e.toolbar !== !1 && (e.toolbar = e.toolbar || SimpleMDE.toolbar), e.hasOwnProperty("status") || (e.status = ["autosave", "lines", "words", "cursor"]), e.previewRender || (e.previewRender = function (e) {
        return this.parent.markdown(e)
    }), e.parsingConfig = e.parsingConfig || {}, this.options = e, this.render(), e.initialValue && this.value(e.initialValue)
}

!function (e) {
    if ("object" == typeof exports && "object" == typeof module) module.exports = e(); else {
        if ("function" == typeof define && define.amd) return define([], e);
        this.CodeMirror = e()
    }
}(function () {
    "use strict";

    function e(r, n) {
        if (!(this instanceof e)) return new e(r, n);
        this.options = n = n ? Fi(n) : {}, Fi(Yo, n, !1), f(n);
        var i = n.value;
        "string" == typeof i && (i = new xl(i, n.mode, null, n.lineSeparator)), this.doc = i;
        var o = new e.inputStyles[n.inputStyle](this), l = this.display = new t(r, i, o);
        l.wrapper.CodeMirror = this, u(this), a(this), n.lineWrapping && (this.display.wrapper.className += " CodeMirror-wrap"), n.autofocus && !Mo && l.input.focus(), v(this), this.state = {
            keyMaps: [],
            overlays: [],
            modeGen: 0,
            overwrite: !1,
            delayingBlurEvent: !1,
            focused: !1,
            suppressEdits: !1,
            pasteIncoming: !1,
            cutIncoming: !1,
            selectingText: !1,
            draggingText: !1,
            highlight: new Ai,
            keySeq: null,
            specialChars: null
        };
        var s = this;
        mo && 11 > vo && setTimeout(function () {
            s.display.input.reset(!0)
        }, 20), Rt(this), Ki(), bt(this), this.curOp.forceUpdate = !0, Xn(this, i), n.autofocus && !Mo || s.hasFocus() ? setTimeout(Pi(gr, this), 20) : mr(this);
        for (var c in Zo) Zo.hasOwnProperty(c) && Zo[c](this, n[c], Qo);
        S(this), n.finishInit && n.finishInit(this);
        for (var h = 0; h < rl.length; ++h) rl[h](this);
        wt(this), yo && n.lineWrapping && "optimizelegibility" == getComputedStyle(l.lineDiv).textRendering && (l.lineDiv.style.textRendering = "auto")
    }

    function t(e, t, r) {
        var n = this;
        this.input = r, n.scrollbarFiller = Ri("div", null, "CodeMirror-scrollbar-filler"), n.scrollbarFiller.setAttribute("cm-not-content", "true"), n.gutterFiller = Ri("div", null, "CodeMirror-gutter-filler"), n.gutterFiller.setAttribute("cm-not-content", "true"), n.lineDiv = Ri("div", null, "CodeMirror-code"), n.selectionDiv = Ri("div", null, null, "position: relative; z-index: 1"), n.cursorDiv = Ri("div", null, "CodeMirror-cursors"), n.measure = Ri("div", null, "CodeMirror-measure"), n.lineMeasure = Ri("div", null, "CodeMirror-measure"), n.lineSpace = Ri("div", [n.measure, n.lineMeasure, n.selectionDiv, n.cursorDiv, n.lineDiv], null, "position: relative; outline: none"), n.mover = Ri("div", [Ri("div", [n.lineSpace], "CodeMirror-lines")], null, "position: relative"), n.sizer = Ri("div", [n.mover], "CodeMirror-sizer"), n.sizerWidth = null, n.heightForcer = Ri("div", null, null, "position: absolute; height: " + Ol + "px; width: 1px;"), n.gutters = Ri("div", null, "CodeMirror-gutters"), n.lineGutter = null, n.scroller = Ri("div", [n.sizer, n.heightForcer, n.gutters], "CodeMirror-scroll"), n.scroller.setAttribute("tabIndex", "-1"), n.wrapper = Ri("div", [n.scrollbarFiller, n.gutterFiller, n.scroller], "CodeMirror"), mo && 8 > vo && (n.gutters.style.zIndex = -1, n.scroller.style.paddingRight = 0), yo || fo && Mo || (n.scroller.draggable = !0), e && (e.appendChild ? e.appendChild(n.wrapper) : e(n.wrapper)), n.viewFrom = n.viewTo = t.first, n.reportedViewFrom = n.reportedViewTo = t.first, n.view = [], n.renderedView = null, n.externalMeasured = null, n.viewOffset = 0, n.lastWrapHeight = n.lastWrapWidth = 0, n.updateLineNumbers = null, n.nativeBarWidth = n.barHeight = n.barWidth = 0, n.scrollbarsClipped = !1, n.lineNumWidth = n.lineNumInnerWidth = n.lineNumChars = null, n.alignWidgets = !1, n.cachedCharWidth = n.cachedTextHeight = n.cachedPaddingH = null, n.maxLine = null, n.maxLineLength = 0, n.maxLineChanged = !1, n.wheelDX = n.wheelDY = n.wheelStartX = n.wheelStartY = null, n.shift = !1, n.selForContextMenu = null, n.activeTouch = null, r.init(n)
    }

    function r(t) {
        t.doc.mode = e.getMode(t.options, t.doc.modeOption), n(t)
    }

    function n(e) {
        e.doc.iter(function (e) {
            e.stateAfter && (e.stateAfter = null), e.styles && (e.styles = null)
        }), e.doc.frontier = e.doc.first, Be(e, 100), e.state.modeGen++, e.curOp && Wt(e)
    }

    function i(e) {
        e.options.lineWrapping ? (Kl(e.display.wrapper, "CodeMirror-wrap"), e.display.sizer.style.minWidth = "", e.display.sizerWidth = null) : (Vl(e.display.wrapper, "CodeMirror-wrap"), d(e)), l(e), Wt(e), lt(e), setTimeout(function () {
            y(e)
        }, 100)
    }

    function o(e) {
        var t = vt(e.display), r = e.options.lineWrapping,
            n = r && Math.max(5, e.display.scroller.clientWidth / yt(e.display) - 3);
        return function (i) {
            if (wn(e.doc, i)) return 0;
            var o = 0;
            if (i.widgets) for (var l = 0; l < i.widgets.length; l++) i.widgets[l].height && (o += i.widgets[l].height);
            return r ? o + (Math.ceil(i.text.length / n) || 1) * t : o + t
        }
    }

    function l(e) {
        var t = e.doc, r = o(e);
        t.iter(function (e) {
            var t = r(e);
            t != e.height && Jn(e, t)
        })
    }

    function a(e) {
        e.display.wrapper.className = e.display.wrapper.className.replace(/\s*cm-s-\S+/g, "") + e.options.theme.replace(/(^|\s)\s*/g, " cm-s-"), lt(e)
    }

    function s(e) {
        u(e), Wt(e), setTimeout(function () {
            w(e)
        }, 20)
    }

    function u(e) {
        var t = e.display.gutters, r = e.options.gutters;
        qi(t);
        for (var n = 0; n < r.length; ++n) {
            var i = r[n], o = t.appendChild(Ri("div", null, "CodeMirror-gutter " + i));
            "CodeMirror-linenumbers" == i && (e.display.lineGutter = o, o.style.width = (e.display.lineNumWidth || 1) + "px")
        }
        t.style.display = n ? "" : "none", c(e)
    }

    function c(e) {
        var t = e.display.gutters.offsetWidth;
        e.display.sizer.style.marginLeft = t + "px"
    }

    function h(e) {
        if (0 == e.height) return 0;
        for (var t, r = e.text.length, n = e; t = pn(n);) {
            var i = t.find(0, !0);
            n = i.from.line, r += i.from.ch - i.to.ch
        }
        for (n = e; t = gn(n);) {
            var i = t.find(0, !0);
            r -= n.text.length - i.from.ch, n = i.to.line, r += n.text.length - i.to.ch
        }
        return r
    }

    function d(e) {
        var t = e.display, r = e.doc;
        t.maxLine = Yn(r, r.first), t.maxLineLength = h(t.maxLine), t.maxLineChanged = !0, r.iter(function (e) {
            var r = h(e);
            r > t.maxLineLength && (t.maxLineLength = r, t.maxLine = e)
        })
    }

    function f(e) {
        var t = Hi(e.gutters, "CodeMirror-linenumbers");
        -1 == t && e.lineNumbers ? e.gutters = e.gutters.concat(["CodeMirror-linenumbers"]) : t > -1 && !e.lineNumbers && (e.gutters = e.gutters.slice(0), e.gutters.splice(t, 1))
    }

    function p(e) {
        var t = e.display, r = t.gutters.offsetWidth, n = Math.round(e.doc.height + Ue(e.display));
        return {
            clientHeight: t.scroller.clientHeight,
            viewHeight: t.wrapper.clientHeight,
            scrollWidth: t.scroller.scrollWidth,
            clientWidth: t.scroller.clientWidth,
            viewWidth: t.wrapper.clientWidth,
            barLeft: e.options.fixedGutter ? r : 0,
            docHeight: n,
            scrollHeight: n + je(e) + t.barHeight,
            nativeBarWidth: t.nativeBarWidth,
            gutterWidth: r
        }
    }

    function g(e, t, r) {
        this.cm = r;
        var n = this.vert = Ri("div", [Ri("div", null, null, "min-width: 1px")], "CodeMirror-vscrollbar"),
            i = this.horiz = Ri("div", [Ri("div", null, null, "height: 100%; min-height: 1px")], "CodeMirror-hscrollbar");
        e(n), e(i), Ml(n, "scroll", function () {
            n.clientHeight && t(n.scrollTop, "vertical")
        }), Ml(i, "scroll", function () {
            i.clientWidth && t(i.scrollLeft, "horizontal")
        }), this.checkedOverlay = !1, mo && 8 > vo && (this.horiz.style.minHeight = this.vert.style.minWidth = "18px")
    }

    function m() {
    }

    function v(t) {
        t.display.scrollbars && (t.display.scrollbars.clear(), t.display.scrollbars.addClass && Vl(t.display.wrapper, t.display.scrollbars.addClass)), t.display.scrollbars = new e.scrollbarModel[t.options.scrollbarStyle](function (e) {
            t.display.wrapper.insertBefore(e, t.display.scrollbarFiller), Ml(e, "mousedown", function () {
                t.state.focused && setTimeout(function () {
                    t.display.input.focus()
                }, 0)
            }), e.setAttribute("cm-not-content", "true")
        }, function (e, r) {
            "horizontal" == r ? nr(t, e) : rr(t, e)
        }, t), t.display.scrollbars.addClass && Kl(t.display.wrapper, t.display.scrollbars.addClass)
    }

    function y(e, t) {
        t || (t = p(e));
        var r = e.display.barWidth, n = e.display.barHeight;
        b(e, t);
        for (var i = 0; 4 > i && r != e.display.barWidth || n != e.display.barHeight; i++) r != e.display.barWidth && e.options.lineWrapping && O(e), b(e, p(e)), r = e.display.barWidth, n = e.display.barHeight
    }

    function b(e, t) {
        var r = e.display, n = r.scrollbars.update(t);
        r.sizer.style.paddingRight = (r.barWidth = n.right) + "px", r.sizer.style.paddingBottom = (r.barHeight = n.bottom) + "px", n.right && n.bottom ? (r.scrollbarFiller.style.display = "block", r.scrollbarFiller.style.height = n.bottom + "px", r.scrollbarFiller.style.width = n.right + "px") : r.scrollbarFiller.style.display = "", n.bottom && e.options.coverGutterNextToScrollbar && e.options.fixedGutter ? (r.gutterFiller.style.display = "block", r.gutterFiller.style.height = n.bottom + "px", r.gutterFiller.style.width = t.gutterWidth + "px") : r.gutterFiller.style.display = ""
    }

    function x(e, t, r) {
        var n = r && null != r.top ? Math.max(0, r.top) : e.scroller.scrollTop;
        n = Math.floor(n - qe(e));
        var i = r && null != r.bottom ? r.bottom : n + e.wrapper.clientHeight, o = ti(t, n), l = ti(t, i);
        if (r && r.ensure) {
            var a = r.ensure.from.line, s = r.ensure.to.line;
            o > a ? (o = a, l = ti(t, ri(Yn(t, a)) + e.wrapper.clientHeight)) : Math.min(s, t.lastLine()) >= l && (o = ti(t, ri(Yn(t, s)) - e.wrapper.clientHeight), l = s)
        }
        return {from: o, to: Math.max(l, o + 1)}
    }

    function w(e) {
        var t = e.display, r = t.view;
        if (t.alignWidgets || t.gutters.firstChild && e.options.fixedGutter) {
            for (var n = k(t) - t.scroller.scrollLeft + e.doc.scrollLeft, i = t.gutters.offsetWidth, o = n + "px", l = 0; l < r.length; l++) if (!r[l].hidden) {
                e.options.fixedGutter && r[l].gutter && (r[l].gutter.style.left = o);
                var a = r[l].alignable;
                if (a) for (var s = 0; s < a.length; s++) a[s].style.left = o
            }
            e.options.fixedGutter && (t.gutters.style.left = n + i + "px")
        }
    }

    function S(e) {
        if (!e.options.lineNumbers) return !1;
        var t = e.doc, r = C(e.options, t.first + t.size - 1), n = e.display;
        if (r.length != n.lineNumChars) {
            var i = n.measure.appendChild(Ri("div", [Ri("div", r)], "CodeMirror-linenumber CodeMirror-gutter-elt")),
                o = i.firstChild.offsetWidth, l = i.offsetWidth - o;
            return n.lineGutter.style.width = "", n.lineNumInnerWidth = Math.max(o, n.lineGutter.offsetWidth - l) + 1, n.lineNumWidth = n.lineNumInnerWidth + l, n.lineNumChars = n.lineNumInnerWidth ? r.length : -1, n.lineGutter.style.width = n.lineNumWidth + "px", c(e), !0
        }
        return !1
    }

    function C(e, t) {
        return String(e.lineNumberFormatter(t + e.firstLineNumber))
    }

    function k(e) {
        return e.scroller.getBoundingClientRect().left - e.sizer.getBoundingClientRect().left
    }

    function L(e, t, r) {
        var n = e.display;
        this.viewport = t, this.visible = x(n, e.doc, t), this.editorIsHidden = !n.wrapper.offsetWidth, this.wrapperHeight = n.wrapper.clientHeight, this.wrapperWidth = n.wrapper.clientWidth, this.oldDisplayWidth = $e(e), this.force = r, this.dims = E(e), this.events = []
    }

    function M(e) {
        var t = e.display;
        !t.scrollbarsClipped && t.scroller.offsetWidth && (t.nativeBarWidth = t.scroller.offsetWidth - t.scroller.clientWidth, t.heightForcer.style.height = je(e) + "px", t.sizer.style.marginBottom = -t.nativeBarWidth + "px", t.sizer.style.borderRightWidth = je(e) + "px", t.scrollbarsClipped = !0)
    }

    function T(e, t) {
        var r = e.display, n = e.doc;
        if (t.editorIsHidden) return Ft(e), !1;
        if (!t.force && t.visible.from >= r.viewFrom && t.visible.to <= r.viewTo && (null == r.updateLineNumbers || r.updateLineNumbers >= r.viewTo) && r.renderedView == r.view && 0 == _t(e)) return !1;
        S(e) && (Ft(e), t.dims = E(e));
        var i = n.first + n.size, o = Math.max(t.visible.from - e.options.viewportMargin, n.first),
            l = Math.min(i, t.visible.to + e.options.viewportMargin);
        r.viewFrom < o && o - r.viewFrom < 20 && (o = Math.max(n.first, r.viewFrom)), r.viewTo > l && r.viewTo - l < 20 && (l = Math.min(i, r.viewTo)), Eo && (o = bn(e.doc, o), l = xn(e.doc, l));
        var a = o != r.viewFrom || l != r.viewTo || r.lastWrapHeight != t.wrapperHeight || r.lastWrapWidth != t.wrapperWidth;
        zt(e, o, l), r.viewOffset = ri(Yn(e.doc, r.viewFrom)), e.display.mover.style.top = r.viewOffset + "px";
        var s = _t(e);
        if (!a && 0 == s && !t.force && r.renderedView == r.view && (null == r.updateLineNumbers || r.updateLineNumbers >= r.viewTo)) return !1;
        var u = Gi();
        return s > 4 && (r.lineDiv.style.display = "none"), W(e, r.updateLineNumbers, t.dims), s > 4 && (r.lineDiv.style.display = ""), r.renderedView = r.view, u && Gi() != u && u.offsetHeight && u.focus(), qi(r.cursorDiv), qi(r.selectionDiv), r.gutters.style.height = r.sizer.style.minHeight = 0, a && (r.lastWrapHeight = t.wrapperHeight, r.lastWrapWidth = t.wrapperWidth, Be(e, 400)), r.updateLineNumbers = null, !0
    }

    function N(e, t) {
        for (var r = t.viewport, n = !0; (n && e.options.lineWrapping && t.oldDisplayWidth != $e(e) || (r && null != r.top && (r = {top: Math.min(e.doc.height + Ue(e.display) - Ve(e), r.top)}), t.visible = x(e.display, e.doc, r), !(t.visible.from >= e.display.viewFrom && t.visible.to <= e.display.viewTo))) && T(e, t); n = !1) {
            O(e);
            var i = p(e);
            Ee(e), D(e, i), y(e, i)
        }
        t.signal(e, "update", e), (e.display.viewFrom != e.display.reportedViewFrom || e.display.viewTo != e.display.reportedViewTo) && (t.signal(e, "viewportChange", e, e.display.viewFrom, e.display.viewTo), e.display.reportedViewFrom = e.display.viewFrom, e.display.reportedViewTo = e.display.viewTo)
    }

    function A(e, t) {
        var r = new L(e, t);
        if (T(e, r)) {
            O(e), N(e, r);
            var n = p(e);
            Ee(e), D(e, n), y(e, n), r.finish()
        }
    }

    function D(e, t) {
        e.display.sizer.style.minHeight = t.docHeight + "px";
        var r = t.docHeight + e.display.barHeight;
        e.display.heightForcer.style.top = r + "px", e.display.gutters.style.height = Math.max(r + je(e), t.clientHeight) + "px"
    }

    function O(e) {
        for (var t = e.display, r = t.lineDiv.offsetTop, n = 0; n < t.view.length; n++) {
            var i, o = t.view[n];
            if (!o.hidden) {
                if (mo && 8 > vo) {
                    var l = o.node.offsetTop + o.node.offsetHeight;
                    i = l - r, r = l
                } else {
                    var a = o.node.getBoundingClientRect();
                    i = a.bottom - a.top
                }
                var s = o.line.height - i;
                if (2 > i && (i = vt(t)), (s > .001 || -.001 > s) && (Jn(o.line, i), H(o.line), o.rest)) for (var u = 0; u < o.rest.length; u++) H(o.rest[u])
            }
        }
    }

    function H(e) {
        if (e.widgets) for (var t = 0; t < e.widgets.length; ++t) e.widgets[t].height = e.widgets[t].node.offsetHeight
    }

    function E(e) {
        for (var t = e.display, r = {}, n = {}, i = t.gutters.clientLeft, o = t.gutters.firstChild, l = 0; o; o = o.nextSibling, ++l) r[e.options.gutters[l]] = o.offsetLeft + o.clientLeft + i, n[e.options.gutters[l]] = o.clientWidth;
        return {
            fixedPos: k(t),
            gutterTotalWidth: t.gutters.offsetWidth,
            gutterLeft: r,
            gutterWidth: n,
            wrapperWidth: t.wrapper.clientWidth
        }
    }

    function W(e, t, r) {
        function n(t) {
            var r = t.nextSibling;
            return yo && To && e.display.currentWheelTarget == t ? t.style.display = "none" : t.parentNode.removeChild(t), r
        }

        for (var i = e.display, o = e.options.lineNumbers, l = i.lineDiv, a = l.firstChild, s = i.view, u = i.viewFrom, c = 0; c < s.length; c++) {
            var h = s[c];
            if (h.hidden) ; else if (h.node && h.node.parentNode == l) {
                for (; a != h.node;) a = n(a);
                var d = o && null != t && u >= t && h.lineNumber;
                h.changes && (Hi(h.changes, "gutter") > -1 && (d = !1), I(e, h, u, r)), d && (qi(h.lineNumber), h.lineNumber.appendChild(document.createTextNode(C(e.options, u)))), a = h.node.nextSibling
            } else {
                var f = U(e, h, u, r);
                l.insertBefore(f, a)
            }
            u += h.size
        }
        for (; a;) a = n(a)
    }

    function I(e, t, r, n) {
        for (var i = 0; i < t.changes.length; i++) {
            var o = t.changes[i];
            "text" == o ? z(e, t) : "gutter" == o ? R(e, t, r, n) : "class" == o ? _(t) : "widget" == o && q(e, t, n)
        }
        t.changes = null
    }

    function F(e) {
        return e.node == e.text && (e.node = Ri("div", null, null, "position: relative"), e.text.parentNode && e.text.parentNode.replaceChild(e.node, e.text), e.node.appendChild(e.text), mo && 8 > vo && (e.node.style.zIndex = 2)), e.node
    }

    function P(e) {
        var t = e.bgClass ? e.bgClass + " " + (e.line.bgClass || "") : e.line.bgClass;
        if (t && (t += " CodeMirror-linebackground"), e.background) t ? e.background.className = t : (e.background.parentNode.removeChild(e.background), e.background = null); else if (t) {
            var r = F(e);
            e.background = r.insertBefore(Ri("div", null, t), r.firstChild)
        }
    }

    function B(e, t) {
        var r = e.display.externalMeasured;
        return r && r.line == t.line ? (e.display.externalMeasured = null, t.measure = r.measure, r.built) : Pn(e, t)
    }

    function z(e, t) {
        var r = t.text.className, n = B(e, t);
        t.text == t.node && (t.node = n.pre), t.text.parentNode.replaceChild(n.pre, t.text), t.text = n.pre, n.bgClass != t.bgClass || n.textClass != t.textClass ? (t.bgClass = n.bgClass, t.textClass = n.textClass, _(t)) : r && (t.text.className = r)
    }

    function _(e) {
        P(e), e.line.wrapClass ? F(e).className = e.line.wrapClass : e.node != e.text && (e.node.className = "");
        var t = e.textClass ? e.textClass + " " + (e.line.textClass || "") : e.line.textClass;
        e.text.className = t || ""
    }

    function R(e, t, r, n) {
        if (t.gutter && (t.node.removeChild(t.gutter), t.gutter = null), t.gutterBackground && (t.node.removeChild(t.gutterBackground), t.gutterBackground = null), t.line.gutterClass) {
            var i = F(t);
            t.gutterBackground = Ri("div", null, "CodeMirror-gutter-background " + t.line.gutterClass, "left: " + (e.options.fixedGutter ? n.fixedPos : -n.gutterTotalWidth) + "px; width: " + n.gutterTotalWidth + "px"), i.insertBefore(t.gutterBackground, t.text)
        }
        var o = t.line.gutterMarkers;
        if (e.options.lineNumbers || o) {
            var i = F(t),
                l = t.gutter = Ri("div", null, "CodeMirror-gutter-wrapper", "left: " + (e.options.fixedGutter ? n.fixedPos : -n.gutterTotalWidth) + "px");
            if (e.display.input.setUneditable(l), i.insertBefore(l, t.text), t.line.gutterClass && (l.className += " " + t.line.gutterClass), !e.options.lineNumbers || o && o["CodeMirror-linenumbers"] || (t.lineNumber = l.appendChild(Ri("div", C(e.options, r), "CodeMirror-linenumber CodeMirror-gutter-elt", "left: " + n.gutterLeft["CodeMirror-linenumbers"] + "px; width: " + e.display.lineNumInnerWidth + "px"))), o) for (var a = 0; a < e.options.gutters.length; ++a) {
                var s = e.options.gutters[a], u = o.hasOwnProperty(s) && o[s];
                u && l.appendChild(Ri("div", [u], "CodeMirror-gutter-elt", "left: " + n.gutterLeft[s] + "px; width: " + n.gutterWidth[s] + "px"))
            }
        }
    }

    function q(e, t, r) {
        t.alignable && (t.alignable = null);
        for (var n, i = t.node.firstChild; i; i = n) {
            var n = i.nextSibling;
            "CodeMirror-linewidget" == i.className && t.node.removeChild(i)
        }
        G(e, t, r)
    }

    function U(e, t, r, n) {
        var i = B(e, t);
        return t.text = t.node = i.pre, i.bgClass && (t.bgClass = i.bgClass), i.textClass && (t.textClass = i.textClass), _(t), R(e, t, r, n), G(e, t, n), t.node
    }

    function G(e, t, r) {
        if (j(e, t.line, t, r, !0), t.rest) for (var n = 0; n < t.rest.length; n++) j(e, t.rest[n], t, r, !1)
    }

    function j(e, t, r, n, i) {
        if (t.widgets) for (var o = F(r), l = 0, a = t.widgets; l < a.length; ++l) {
            var s = a[l], u = Ri("div", [s.node], "CodeMirror-linewidget");
            s.handleMouseEvents || u.setAttribute("cm-ignore-events", "true"), $(s, u, r, n), e.display.input.setUneditable(u), i && s.above ? o.insertBefore(u, r.gutter || r.text) : o.appendChild(u), Ci(s, "redraw")
        }
    }

    function $(e, t, r, n) {
        if (e.noHScroll) {
            (r.alignable || (r.alignable = [])).push(t);
            var i = n.wrapperWidth;
            t.style.left = n.fixedPos + "px", e.coverGutter || (i -= n.gutterTotalWidth, t.style.paddingLeft = n.gutterTotalWidth + "px"), t.style.width = i + "px"
        }
        e.coverGutter && (t.style.zIndex = 5, t.style.position = "relative", e.noHScroll || (t.style.marginLeft = -n.gutterTotalWidth + "px"))
    }

    function V(e) {
        return Wo(e.line, e.ch)
    }

    function K(e, t) {
        return Io(e, t) < 0 ? t : e
    }

    function X(e, t) {
        return Io(e, t) < 0 ? e : t
    }

    function Y(e) {
        e.state.focused || (e.display.input.focus(), gr(e))
    }

    function Z(e) {
        return e.options.readOnly || e.doc.cantEdit
    }

    function Q(e, t, r, n, i) {
        var o = e.doc;
        e.display.shift = !1, n || (n = o.sel);
        var l = e.state.pasteIncoming || "paste" == i, a = o.splitLines(t), s = null;
        if (l && n.ranges.length > 1) if (Fo && Fo.join("\n") == t) {
            if (n.ranges.length % Fo.length == 0) {
                s = [];
                for (var u = 0; u < Fo.length; u++) s.push(o.splitLines(Fo[u]))
            }
        } else a.length == n.ranges.length && (s = Ei(a, function (e) {
            return [e]
        }));
        for (var u = n.ranges.length - 1; u >= 0; u--) {
            var c = n.ranges[u], h = c.from(), d = c.to();
            c.empty() && (r && r > 0 ? h = Wo(h.line, h.ch - r) : e.state.overwrite && !l && (d = Wo(d.line, Math.min(Yn(o, d.line).text.length, d.ch + Oi(a).length))));
            var f = e.curOp.updateInput, p = {
                from: h,
                to: d,
                text: s ? s[u % s.length] : a,
                origin: i || (l ? "paste" : e.state.cutIncoming ? "cut" : "+input")
            };
            kr(e.doc, p), Ci(e, "inputRead", e, p)
        }
        t && !l && ee(e, t), Fr(e), e.curOp.updateInput = f, e.curOp.typing = !0, e.state.pasteIncoming = e.state.cutIncoming = !1
    }

    function J(e, t) {
        var r = e.clipboardData && e.clipboardData.getData("text/plain");
        return r ? (e.preventDefault(), Z(t) || t.options.disableInput || Nt(t, function () {
            Q(t, r, 0, null, "paste")
        }), !0) : void 0
    }

    function ee(e, t) {
        if (e.options.electricChars && e.options.smartIndent) for (var r = e.doc.sel, n = r.ranges.length - 1; n >= 0; n--) {
            var i = r.ranges[n];
            if (!(i.head.ch > 100 || n && r.ranges[n - 1].head.line == i.head.line)) {
                var o = e.getModeAt(i.head), l = !1;
                if (o.electricChars) {
                    for (var a = 0; a < o.electricChars.length; a++) if (t.indexOf(o.electricChars.charAt(a)) > -1) {
                        l = Br(e, i.head.line, "smart");
                        break
                    }
                } else o.electricInput && o.electricInput.test(Yn(e.doc, i.head.line).text.slice(0, i.head.ch)) && (l = Br(e, i.head.line, "smart"));
                l && Ci(e, "electricInput", e, i.head.line)
            }
        }
    }

    function te(e) {
        for (var t = [], r = [], n = 0; n < e.doc.sel.ranges.length; n++) {
            var i = e.doc.sel.ranges[n].head.line, o = {anchor: Wo(i, 0), head: Wo(i + 1, 0)};
            r.push(o), t.push(e.getRange(o.anchor, o.head))
        }
        return {text: t, ranges: r}
    }

    function re(e) {
        e.setAttribute("autocorrect", "off"), e.setAttribute("autocapitalize", "off"), e.setAttribute("spellcheck", "false")
    }

    function ne(e) {
        this.cm = e, this.prevInput = "", this.pollingFast = !1, this.polling = new Ai, this.inaccurateSelection = !1, this.hasSelection = !1, this.composing = null
    }

    function ie() {
        var e = Ri("textarea", null, null, "position: absolute; padding: 0; width: 1px; height: 1em; outline: none"),
            t = Ri("div", [e], null, "overflow: hidden; position: relative; width: 3px; height: 0px;");
        return yo ? e.style.width = "1000px" : e.setAttribute("wrap", "off"), Lo && (e.style.border = "1px solid black"), re(e), t
    }

    function oe(e) {
        this.cm = e, this.lastAnchorNode = this.lastAnchorOffset = this.lastFocusNode = this.lastFocusOffset = null, this.polling = new Ai, this.gracePeriod = !1
    }

    function le(e, t) {
        var r = Qe(e, t.line);
        if (!r || r.hidden) return null;
        var n = Yn(e.doc, t.line), i = Xe(r, n, t.line), o = ni(n), l = "left";
        if (o) {
            var a = so(o, t.ch);
            l = a % 2 ? "right" : "left"
        }
        var s = tt(i.map, t.ch, l);
        return s.offset = "right" == s.collapse ? s.end : s.start, s
    }

    function ae(e, t) {
        return t && (e.bad = !0), e
    }

    function se(e, t, r) {
        var n;
        if (t == e.display.lineDiv) {
            if (n = e.display.lineDiv.childNodes[r], !n) return ae(e.clipPos(Wo(e.display.viewTo - 1)), !0);
            t = null, r = 0
        } else for (n = t; ; n = n.parentNode) {
            if (!n || n == e.display.lineDiv) return null;
            if (n.parentNode && n.parentNode == e.display.lineDiv) break
        }
        for (var i = 0; i < e.display.view.length; i++) {
            var o = e.display.view[i];
            if (o.node == n) return ue(o, t, r)
        }
    }

    function ue(e, t, r) {
        function n(t, r, n) {
            for (var i = -1; i < (c ? c.length : 0); i++) for (var o = 0 > i ? u.map : c[i], l = 0; l < o.length; l += 3) {
                var a = o[l + 2];
                if (a == t || a == r) {
                    var s = ei(0 > i ? e.line : e.rest[i]), h = o[l] + n;
                    return (0 > n || a != t) && (h = o[l + (n ? 1 : 0)]), Wo(s, h)
                }
            }
        }

        var i = e.text.firstChild, o = !1;
        if (!t || !Gl(i, t)) return ae(Wo(ei(e.line), 0), !0);
        if (t == i && (o = !0, t = i.childNodes[r], r = 0, !t)) {
            var l = e.rest ? Oi(e.rest) : e.line;
            return ae(Wo(ei(l), l.text.length), o)
        }
        var a = 3 == t.nodeType ? t : null, s = t;
        for (a || 1 != t.childNodes.length || 3 != t.firstChild.nodeType || (a = t.firstChild, r && (r = a.nodeValue.length)); s.parentNode != i;) s = s.parentNode;
        var u = e.measure, c = u.maps, h = n(a, s, r);
        if (h) return ae(h, o);
        for (var d = s.nextSibling, f = a ? a.nodeValue.length - r : 0; d; d = d.nextSibling) {
            if (h = n(d, d.firstChild, 0)) return ae(Wo(h.line, h.ch - f), o);
            f += d.textContent.length
        }
        for (var p = s.previousSibling, f = r; p; p = p.previousSibling) {
            if (h = n(p, p.firstChild, -1)) return ae(Wo(h.line, h.ch + f), o);
            f += d.textContent.length
        }
    }

    function ce(e, t, r, n, i) {
        function o(e) {
            return function (t) {
                return t.id == e
            }
        }

        function l(t) {
            if (1 == t.nodeType) {
                var r = t.getAttribute("cm-text");
                if (null != r) return "" == r && (r = t.textContent.replace(/\u200b/g, "")), void (a += r);
                var c, h = t.getAttribute("cm-marker");
                if (h) {
                    var d = e.findMarks(Wo(n, 0), Wo(i + 1, 0), o(+h));
                    return void (d.length && (c = d[0].find()) && (a += Zn(e.doc, c.from, c.to).join(u)))
                }
                if ("false" == t.getAttribute("contenteditable")) return;
                for (var f = 0; f < t.childNodes.length; f++) l(t.childNodes[f]);
                /^(pre|div|p)$/i.test(t.nodeName) && (s = !0)
            } else if (3 == t.nodeType) {
                var p = t.nodeValue;
                if (!p) return;
                s && (a += u, s = !1), a += p
            }
        }

        for (var a = "", s = !1, u = e.doc.lineSeparator(); l(t), t != r;) t = t.nextSibling;
        return a
    }

    function he(e, t) {
        this.ranges = e, this.primIndex = t
    }

    function de(e, t) {
        this.anchor = e, this.head = t
    }

    function fe(e, t) {
        var r = e[t];
        e.sort(function (e, t) {
            return Io(e.from(), t.from())
        }), t = Hi(e, r);
        for (var n = 1; n < e.length; n++) {
            var i = e[n], o = e[n - 1];
            if (Io(o.to(), i.from()) >= 0) {
                var l = X(o.from(), i.from()), a = K(o.to(), i.to()),
                    s = o.empty() ? i.from() == i.head : o.from() == o.head;
                t >= n && --t, e.splice(--n, 2, new de(s ? a : l, s ? l : a))
            }
        }
        return new he(e, t)
    }

    function pe(e, t) {
        return new he([new de(e, t || e)], 0)
    }

    function ge(e, t) {
        return Math.max(e.first, Math.min(t, e.first + e.size - 1))
    }

    function me(e, t) {
        if (t.line < e.first) return Wo(e.first, 0);
        var r = e.first + e.size - 1;
        return t.line > r ? Wo(r, Yn(e, r).text.length) : ve(t, Yn(e, t.line).text.length)
    }

    function ve(e, t) {
        var r = e.ch;
        return null == r || r > t ? Wo(e.line, t) : 0 > r ? Wo(e.line, 0) : e
    }

    function ye(e, t) {
        return t >= e.first && t < e.first + e.size
    }

    function be(e, t) {
        for (var r = [], n = 0; n < t.length; n++) r[n] = me(e, t[n]);
        return r
    }

    function xe(e, t, r, n) {
        if (e.cm && e.cm.display.shift || e.extend) {
            var i = t.anchor;
            if (n) {
                var o = Io(r, i) < 0;
                o != Io(n, i) < 0 ? (i = r, r = n) : o != Io(r, n) < 0 && (r = n)
            }
            return new de(i, r)
        }
        return new de(n || r, r)
    }

    function we(e, t, r, n) {
        Te(e, new he([xe(e, e.sel.primary(), t, r)], 0), n)
    }

    function Se(e, t, r) {
        for (var n = [], i = 0; i < e.sel.ranges.length; i++) n[i] = xe(e, e.sel.ranges[i], t[i], null);
        var o = fe(n, e.sel.primIndex);
        Te(e, o, r)
    }

    function Ce(e, t, r, n) {
        var i = e.sel.ranges.slice(0);
        i[t] = r, Te(e, fe(i, e.sel.primIndex), n)
    }

    function ke(e, t, r, n) {
        Te(e, pe(t, r), n)
    }

    function Le(e, t) {
        var r = {
            ranges: t.ranges, update: function (t) {
                this.ranges = [];
                for (var r = 0; r < t.length; r++) this.ranges[r] = new de(me(e, t[r].anchor), me(e, t[r].head))
            }
        };
        return Al(e, "beforeSelectionChange", e, r), e.cm && Al(e.cm, "beforeSelectionChange", e.cm, r), r.ranges != t.ranges ? fe(r.ranges, r.ranges.length - 1) : t
    }

    function Me(e, t, r) {
        var n = e.history.done, i = Oi(n);
        i && i.ranges ? (n[n.length - 1] = t, Ne(e, t, r)) : Te(e, t, r)
    }

    function Te(e, t, r) {
        Ne(e, t, r), ci(e, e.sel, e.cm ? e.cm.curOp.id : NaN, r)
    }

    function Ne(e, t, r) {
        (Ti(e, "beforeSelectionChange") || e.cm && Ti(e.cm, "beforeSelectionChange")) && (t = Le(e, t));
        var n = r && r.bias || (Io(t.primary().head, e.sel.primary().head) < 0 ? -1 : 1);
        Ae(e, Oe(e, t, n, !0)), r && r.scroll === !1 || !e.cm || Fr(e.cm)
    }

    function Ae(e, t) {
        t.equals(e.sel) || (e.sel = t, e.cm && (e.cm.curOp.updateInput = e.cm.curOp.selectionChanged = !0, Mi(e.cm)), Ci(e, "cursorActivity", e))
    }

    function De(e) {
        Ae(e, Oe(e, e.sel, null, !1), El)
    }

    function Oe(e, t, r, n) {
        for (var i, o = 0; o < t.ranges.length; o++) {
            var l = t.ranges[o], a = He(e, l.anchor, r, n), s = He(e, l.head, r, n);
            (i || a != l.anchor || s != l.head) && (i || (i = t.ranges.slice(0, o)), i[o] = new de(a, s))
        }
        return i ? fe(i, t.primIndex) : t
    }

    function He(e, t, r, n) {
        var i = !1, o = t, l = r || 1;
        e.cantEdit = !1;
        e:for (; ;) {
            var a = Yn(e, o.line);
            if (a.markedSpans) for (var s = 0; s < a.markedSpans.length; ++s) {
                var u = a.markedSpans[s], c = u.marker;
                if ((null == u.from || (c.inclusiveLeft ? u.from <= o.ch : u.from < o.ch)) && (null == u.to || (c.inclusiveRight ? u.to >= o.ch : u.to > o.ch))) {
                    if (n && (Al(c, "beforeCursorEnter"), c.explicitlyCleared)) {
                        if (a.markedSpans) {
                            --s;
                            continue
                        }
                        break
                    }
                    if (!c.atomic) continue;
                    var h = c.find(0 > l ? -1 : 1);
                    if (0 == Io(h, o) && (h.ch += l, h.ch < 0 ? h = h.line > e.first ? me(e, Wo(h.line - 1)) : null : h.ch > a.text.length && (h = h.line < e.first + e.size - 1 ? Wo(h.line + 1, 0) : null), !h)) {
                        if (i) return n ? (e.cantEdit = !0, Wo(e.first, 0)) : He(e, t, r, !0);
                        i = !0, h = t, l = -l
                    }
                    o = h;
                    continue e
                }
            }
            return o
        }
    }

    function Ee(e) {
        e.display.input.showSelection(e.display.input.prepareSelection())
    }

    function We(e, t) {
        for (var r = e.doc, n = {}, i = n.cursors = document.createDocumentFragment(), o = n.selection = document.createDocumentFragment(), l = 0; l < r.sel.ranges.length; l++) if (t !== !1 || l != r.sel.primIndex) {
            var a = r.sel.ranges[l], s = a.empty();
            (s || e.options.showCursorWhenSelecting) && Ie(e, a.head, i), s || Fe(e, a, o)
        }
        return n
    }

    function Ie(e, t, r) {
        var n = dt(e, t, "div", null, null, !e.options.singleCursorHeightPerLine),
            i = r.appendChild(Ri("div", " ", "CodeMirror-cursor"));
        if (i.style.left = n.left + "px", i.style.top = n.top + "px", i.style.height = Math.max(0, n.bottom - n.top) * e.options.cursorHeight + "px", n.other) {
            var o = r.appendChild(Ri("div", " ", "CodeMirror-cursor CodeMirror-secondarycursor"));
            o.style.display = "", o.style.left = n.other.left + "px", o.style.top = n.other.top + "px", o.style.height = .85 * (n.other.bottom - n.other.top) + "px"
        }
    }

    function Fe(e, t, r) {
        function n(e, t, r, n) {
            0 > t && (t = 0), t = Math.round(t), n = Math.round(n), a.appendChild(Ri("div", null, "CodeMirror-selected", "position: absolute; left: " + e + "px; top: " + t + "px; width: " + (null == r ? c - e : r) + "px; height: " + (n - t) + "px"))
        }

        function i(t, r, i) {
            function o(r, n) {
                return ht(e, Wo(t, r), "div", h, n)
            }

            var a, s, h = Yn(l, t), d = h.text.length;
            return Ji(ni(h), r || 0, null == i ? d : i, function (e, t, l) {
                var h, f, p, g = o(e, "left");
                if (e == t) h = g, f = p = g.left; else {
                    if (h = o(t - 1, "right"), "rtl" == l) {
                        var m = g;
                        g = h, h = m
                    }
                    f = g.left, p = h.right
                }
                null == r && 0 == e && (f = u), h.top - g.top > 3 && (n(f, g.top, null, g.bottom), f = u, g.bottom < h.top && n(f, g.bottom, null, h.top)), null == i && t == d && (p = c), (!a || g.top < a.top || g.top == a.top && g.left < a.left) && (a = g), (!s || h.bottom > s.bottom || h.bottom == s.bottom && h.right > s.right) && (s = h), u + 1 > f && (f = u), n(f, h.top, p - f, h.bottom)
            }), {start: a, end: s}
        }

        var o = e.display, l = e.doc, a = document.createDocumentFragment(), s = Ge(e.display), u = s.left,
            c = Math.max(o.sizerWidth, $e(e) - o.sizer.offsetLeft) - s.right, h = t.from(), d = t.to();
        if (h.line == d.line) i(h.line, h.ch, d.ch); else {
            var f = Yn(l, h.line), p = Yn(l, d.line), g = vn(f) == vn(p),
                m = i(h.line, h.ch, g ? f.text.length + 1 : null).end, v = i(d.line, g ? 0 : null, d.ch).start;
            g && (m.top < v.top - 2 ? (n(m.right, m.top, null, m.bottom), n(u, v.top, v.left, v.bottom)) : n(m.right, m.top, v.left - m.right, m.bottom)), m.bottom < v.top && n(u, m.bottom, null, v.top)
        }
        r.appendChild(a)
    }

    function Pe(e) {
        if (e.state.focused) {
            var t = e.display;
            clearInterval(t.blinker);
            var r = !0;
            t.cursorDiv.style.visibility = "", e.options.cursorBlinkRate > 0 ? t.blinker = setInterval(function () {
                t.cursorDiv.style.visibility = (r = !r) ? "" : "hidden"
            }, e.options.cursorBlinkRate) : e.options.cursorBlinkRate < 0 && (t.cursorDiv.style.visibility = "hidden")
        }
    }

    function Be(e, t) {
        e.doc.mode.startState && e.doc.frontier < e.display.viewTo && e.state.highlight.set(t, Pi(ze, e))
    }

    function ze(e) {
        var t = e.doc;
        if (t.frontier < t.first && (t.frontier = t.first), !(t.frontier >= e.display.viewTo)) {
            var r = +new Date + e.options.workTime, n = il(t.mode, Re(e, t.frontier)), i = [];
            t.iter(t.frontier, Math.min(t.first + t.size, e.display.viewTo + 500), function (o) {
                if (t.frontier >= e.display.viewFrom) {
                    var l = o.styles, a = o.text.length > e.options.maxHighlightLength,
                        s = En(e, o, a ? il(t.mode, n) : n, !0);
                    o.styles = s.styles;
                    var u = o.styleClasses, c = s.classes;
                    c ? o.styleClasses = c : u && (o.styleClasses = null);
                    for (var h = !l || l.length != o.styles.length || u != c && (!u || !c || u.bgClass != c.bgClass || u.textClass != c.textClass), d = 0; !h && d < l.length; ++d) h = l[d] != o.styles[d];
                    h && i.push(t.frontier), o.stateAfter = a ? n : il(t.mode, n)
                } else o.text.length <= e.options.maxHighlightLength && In(e, o.text, n), o.stateAfter = t.frontier % 5 == 0 ? il(t.mode, n) : null;
                return ++t.frontier, +new Date > r ? (Be(e, e.options.workDelay), !0) : void 0
            }), i.length && Nt(e, function () {
                for (var t = 0; t < i.length; t++) It(e, i[t], "text")
            })
        }
    }

    function _e(e, t, r) {
        for (var n, i, o = e.doc, l = r ? -1 : t - (e.doc.mode.innerMode ? 1e3 : 100), a = t; a > l; --a) {
            if (a <= o.first) return o.first;
            var s = Yn(o, a - 1);
            if (s.stateAfter && (!r || a <= o.frontier)) return a;
            var u = Fl(s.text, null, e.options.tabSize);
            (null == i || n > u) && (i = a - 1, n = u)
        }
        return i
    }

    function Re(e, t, r) {
        var n = e.doc, i = e.display;
        if (!n.mode.startState) return !0;
        var o = _e(e, t, r), l = o > n.first && Yn(n, o - 1).stateAfter;
        return l = l ? il(n.mode, l) : ol(n.mode), n.iter(o, t, function (r) {
            In(e, r.text, l);
            var a = o == t - 1 || o % 5 == 0 || o >= i.viewFrom && o < i.viewTo;
            r.stateAfter = a ? il(n.mode, l) : null, ++o
        }), r && (n.frontier = o), l
    }

    function qe(e) {
        return e.lineSpace.offsetTop
    }

    function Ue(e) {
        return e.mover.offsetHeight - e.lineSpace.offsetHeight
    }

    function Ge(e) {
        if (e.cachedPaddingH) return e.cachedPaddingH;
        var t = Ui(e.measure, Ri("pre", "x")),
            r = window.getComputedStyle ? window.getComputedStyle(t) : t.currentStyle,
            n = {left: parseInt(r.paddingLeft), right: parseInt(r.paddingRight)};
        return isNaN(n.left) || isNaN(n.right) || (e.cachedPaddingH = n), n
    }

    function je(e) {
        return Ol - e.display.nativeBarWidth
    }

    function $e(e) {
        return e.display.scroller.clientWidth - je(e) - e.display.barWidth
    }

    function Ve(e) {
        return e.display.scroller.clientHeight - je(e) - e.display.barHeight
    }

    function Ke(e, t, r) {
        var n = e.options.lineWrapping, i = n && $e(e);
        if (!t.measure.heights || n && t.measure.width != i) {
            var o = t.measure.heights = [];
            if (n) {
                t.measure.width = i;
                for (var l = t.text.firstChild.getClientRects(), a = 0; a < l.length - 1; a++) {
                    var s = l[a], u = l[a + 1];
                    Math.abs(s.bottom - u.bottom) > 2 && o.push((s.bottom + u.top) / 2 - r.top)
                }
            }
            o.push(r.bottom - r.top)
        }
    }

    function Xe(e, t, r) {
        if (e.line == t) return {map: e.measure.map, cache: e.measure.cache};
        for (var n = 0; n < e.rest.length; n++) if (e.rest[n] == t) return {
            map: e.measure.maps[n],
            cache: e.measure.caches[n]
        };
        for (var n = 0; n < e.rest.length; n++) if (ei(e.rest[n]) > r) return {
            map: e.measure.maps[n],
            cache: e.measure.caches[n],
            before: !0
        }
    }

    function Ye(e, t) {
        t = vn(t);
        var r = ei(t), n = e.display.externalMeasured = new Ht(e.doc, t, r);
        n.lineN = r;
        var i = n.built = Pn(e, n);
        return n.text = i.pre, Ui(e.display.lineMeasure, i.pre), n
    }

    function Ze(e, t, r, n) {
        return et(e, Je(e, t), r, n)
    }

    function Qe(e, t) {
        if (t >= e.display.viewFrom && t < e.display.viewTo) return e.display.view[Pt(e, t)];
        var r = e.display.externalMeasured;
        return r && t >= r.lineN && t < r.lineN + r.size ? r : void 0
    }

    function Je(e, t) {
        var r = ei(t), n = Qe(e, r);
        n && !n.text ? n = null : n && n.changes && (I(e, n, r, E(e)), e.curOp.forceUpdate = !0), n || (n = Ye(e, t));
        var i = Xe(n, t, r);
        return {line: t, view: n, rect: null, map: i.map, cache: i.cache, before: i.before, hasHeights: !1}
    }

    function et(e, t, r, n, i) {
        t.before && (r = -1);
        var o, l = r + (n || "");
        return t.cache.hasOwnProperty(l) ? o = t.cache[l] : (t.rect || (t.rect = t.view.text.getBoundingClientRect()), t.hasHeights || (Ke(e, t.view, t.rect), t.hasHeights = !0), o = rt(e, t, r, n), o.bogus || (t.cache[l] = o)), {
            left: o.left,
            right: o.right,
            top: i ? o.rtop : o.top,
            bottom: i ? o.rbottom : o.bottom
        }
    }

    function tt(e, t, r) {
        for (var n, i, o, l, a = 0; a < e.length; a += 3) {
            var s = e[a], u = e[a + 1];
            if (s > t ? (i = 0, o = 1, l = "left") : u > t ? (i = t - s, o = i + 1) : (a == e.length - 3 || t == u && e[a + 3] > t) && (o = u - s, i = o - 1, t >= u && (l = "right")), null != i) {
                if (n = e[a + 2], s == u && r == (n.insertLeft ? "left" : "right") && (l = r), "left" == r && 0 == i) for (; a && e[a - 2] == e[a - 3] && e[a - 1].insertLeft;) n = e[(a -= 3) + 2], l = "left";
                if ("right" == r && i == u - s) for (; a < e.length - 3 && e[a + 3] == e[a + 4] && !e[a + 5].insertLeft;) n = e[(a += 3) + 2], l = "right";
                break
            }
        }
        return {node: n, start: i, end: o, collapse: l, coverStart: s, coverEnd: u}
    }

    function rt(e, t, r, n) {
        var i, o = tt(t.map, r, n), l = o.node, a = o.start, s = o.end, u = o.collapse;
        if (3 == l.nodeType) {
            for (var c = 0; 4 > c; c++) {
                for (; a && _i(t.line.text.charAt(o.coverStart + a));) --a;
                for (; o.coverStart + s < o.coverEnd && _i(t.line.text.charAt(o.coverStart + s));) ++s;
                if (mo && 9 > vo && 0 == a && s == o.coverEnd - o.coverStart) i = l.parentNode.getBoundingClientRect(); else if (mo && e.options.lineWrapping) {
                    var h = _l(l, a, s).getClientRects();
                    i = h.length ? h["right" == n ? h.length - 1 : 0] : _o
                } else i = _l(l, a, s).getBoundingClientRect() || _o;
                if (i.left || i.right || 0 == a) break;
                s = a, a -= 1, u = "right"
            }
            mo && 11 > vo && (i = nt(e.display.measure, i))
        } else {
            a > 0 && (u = n = "right");
            var h;
            i = e.options.lineWrapping && (h = l.getClientRects()).length > 1 ? h["right" == n ? h.length - 1 : 0] : l.getBoundingClientRect()
        }
        if (mo && 9 > vo && !a && (!i || !i.left && !i.right)) {
            var d = l.parentNode.getClientRects()[0];
            i = d ? {left: d.left, right: d.left + yt(e.display), top: d.top, bottom: d.bottom} : _o
        }
        for (var f = i.top - t.rect.top, p = i.bottom - t.rect.top, g = (f + p) / 2, m = t.view.measure.heights, c = 0; c < m.length - 1 && !(g < m[c]); c++) ;
        var v = c ? m[c - 1] : 0, y = m[c], b = {
            left: ("right" == u ? i.right : i.left) - t.rect.left,
            right: ("left" == u ? i.left : i.right) - t.rect.left,
            top: v,
            bottom: y
        };
        return i.left || i.right || (b.bogus = !0), e.options.singleCursorHeightPerLine || (b.rtop = f, b.rbottom = p), b
    }

    function nt(e, t) {
        if (!window.screen || null == screen.logicalXDPI || screen.logicalXDPI == screen.deviceXDPI || !Qi(e)) return t;
        var r = screen.logicalXDPI / screen.deviceXDPI, n = screen.logicalYDPI / screen.deviceYDPI;
        return {left: t.left * r, right: t.right * r, top: t.top * n, bottom: t.bottom * n}
    }

    function it(e) {
        if (e.measure && (e.measure.cache = {}, e.measure.heights = null, e.rest)) for (var t = 0; t < e.rest.length; t++) e.measure.caches[t] = {}
    }

    function ot(e) {
        e.display.externalMeasure = null, qi(e.display.lineMeasure);
        for (var t = 0; t < e.display.view.length; t++) it(e.display.view[t])
    }

    function lt(e) {
        ot(e), e.display.cachedCharWidth = e.display.cachedTextHeight = e.display.cachedPaddingH = null, e.options.lineWrapping || (e.display.maxLineChanged = !0), e.display.lineNumChars = null
    }

    function at() {
        return window.pageXOffset || (document.documentElement || document.body).scrollLeft
    }

    function st() {
        return window.pageYOffset || (document.documentElement || document.body).scrollTop
    }

    function ut(e, t, r, n) {
        if (t.widgets) for (var i = 0; i < t.widgets.length; ++i) if (t.widgets[i].above) {
            var o = kn(t.widgets[i]);
            r.top += o, r.bottom += o
        }
        if ("line" == n) return r;
        n || (n = "local");
        var l = ri(t);
        if ("local" == n ? l += qe(e.display) : l -= e.display.viewOffset, "page" == n || "window" == n) {
            var a = e.display.lineSpace.getBoundingClientRect();
            l += a.top + ("window" == n ? 0 : st());
            var s = a.left + ("window" == n ? 0 : at());
            r.left += s, r.right += s
        }
        return r.top += l, r.bottom += l, r
    }

    function ct(e, t, r) {
        if ("div" == r) return t;
        var n = t.left, i = t.top;
        if ("page" == r) n -= at(), i -= st(); else if ("local" == r || !r) {
            var o = e.display.sizer.getBoundingClientRect();
            n += o.left, i += o.top
        }
        var l = e.display.lineSpace.getBoundingClientRect();
        return {left: n - l.left, top: i - l.top}
    }

    function ht(e, t, r, n, i) {
        return n || (n = Yn(e.doc, t.line)), ut(e, n, Ze(e, n, t.ch, i), r)
    }

    function dt(e, t, r, n, i, o) {
        function l(t, l) {
            var a = et(e, i, t, l ? "right" : "left", o);
            return l ? a.left = a.right : a.right = a.left, ut(e, n, a, r)
        }

        function a(e, t) {
            var r = s[t], n = r.level % 2;
            return e == eo(r) && t && r.level < s[t - 1].level ? (r = s[--t], e = to(r) - (r.level % 2 ? 0 : 1), n = !0) : e == to(r) && t < s.length - 1 && r.level < s[t + 1].level && (r = s[++t], e = eo(r) - r.level % 2, n = !1), n && e == r.to && e > r.from ? l(e - 1) : l(e, n)
        }

        n = n || Yn(e.doc, t.line), i || (i = Je(e, n));
        var s = ni(n), u = t.ch;
        if (!s) return l(u);
        var c = so(s, u), h = a(u, c);
        return null != ra && (h.other = a(u, ra)), h
    }

    function ft(e, t) {
        var r = 0, t = me(e.doc, t);
        e.options.lineWrapping || (r = yt(e.display) * t.ch);
        var n = Yn(e.doc, t.line), i = ri(n) + qe(e.display);
        return {left: r, right: r, top: i, bottom: i + n.height}
    }

    function pt(e, t, r, n) {
        var i = Wo(e, t);
        return i.xRel = n, r && (i.outside = !0), i
    }

    function gt(e, t, r) {
        var n = e.doc;
        if (r += e.display.viewOffset, 0 > r) return pt(n.first, 0, !0, -1);
        var i = ti(n, r), o = n.first + n.size - 1;
        if (i > o) return pt(n.first + n.size - 1, Yn(n, o).text.length, !0, 1);
        0 > t && (t = 0);
        for (var l = Yn(n, i); ;) {
            var a = mt(e, l, i, t, r), s = gn(l), u = s && s.find(0, !0);
            if (!s || !(a.ch > u.from.ch || a.ch == u.from.ch && a.xRel > 0)) return a;
            i = ei(l = u.to.line)
        }
    }

    function mt(e, t, r, n, i) {
        function o(n) {
            var i = dt(e, Wo(r, n), "line", t, u);
            return a = !0, l > i.bottom ? i.left - s : l < i.top ? i.left + s : (a = !1, i.left)
        }

        var l = i - ri(t), a = !1, s = 2 * e.display.wrapper.clientWidth, u = Je(e, t), c = ni(t), h = t.text.length,
            d = ro(t), f = no(t), p = o(d), g = a, m = o(f), v = a;
        if (n > m) return pt(r, f, v, 1);
        for (; ;) {
            if (c ? f == d || f == co(t, d, 1) : 1 >= f - d) {
                for (var y = p > n || m - n >= n - p ? d : f, b = n - (y == d ? p : m); _i(t.text.charAt(y));) ++y;
                var x = pt(r, y, y == d ? g : v, -1 > b ? -1 : b > 1 ? 1 : 0);
                return x
            }
            var w = Math.ceil(h / 2), S = d + w;
            if (c) {
                S = d;
                for (var C = 0; w > C; ++C) S = co(t, S, 1)
            }
            var k = o(S);
            k > n ? (f = S, m = k, (v = a) && (m += 1e3), h = w) : (d = S, p = k, g = a, h -= w)
        }
    }

    function vt(e) {
        if (null != e.cachedTextHeight) return e.cachedTextHeight;
        if (null == Po) {
            Po = Ri("pre");
            for (var t = 0; 49 > t; ++t) Po.appendChild(document.createTextNode("x")), Po.appendChild(Ri("br"));
            Po.appendChild(document.createTextNode("x"))
        }
        Ui(e.measure, Po);
        var r = Po.offsetHeight / 50;
        return r > 3 && (e.cachedTextHeight = r), qi(e.measure), r || 1
    }

    function yt(e) {
        if (null != e.cachedCharWidth) return e.cachedCharWidth;
        var t = Ri("span", "xxxxxxxxxx"), r = Ri("pre", [t]);
        Ui(e.measure, r);
        var n = t.getBoundingClientRect(), i = (n.right - n.left) / 10;
        return i > 2 && (e.cachedCharWidth = i), i || 10
    }

    function bt(e) {
        e.curOp = {
            cm: e,
            viewChanged: !1,
            startHeight: e.doc.height,
            forceUpdate: !1,
            updateInput: null,
            typing: !1,
            changeObjs: null,
            cursorActivityHandlers: null,
            cursorActivityCalled: 0,
            selectionChanged: !1,
            updateMaxLine: !1,
            scrollLeft: null,
            scrollTop: null,
            scrollToPos: null,
            focus: !1,
            id: ++qo
        }, Ro ? Ro.ops.push(e.curOp) : e.curOp.ownsGroup = Ro = {ops: [e.curOp], delayedCallbacks: []}
    }

    function xt(e) {
        var t = e.delayedCallbacks, r = 0;
        do {
            for (; r < t.length; r++) t[r].call(null);
            for (var n = 0; n < e.ops.length; n++) {
                var i = e.ops[n];
                if (i.cursorActivityHandlers) for (; i.cursorActivityCalled < i.cursorActivityHandlers.length;) i.cursorActivityHandlers[i.cursorActivityCalled++].call(null, i.cm)
            }
        } while (r < t.length)
    }

    function wt(e) {
        var t = e.curOp, r = t.ownsGroup;
        if (r) try {
            xt(r)
        } finally {
            Ro = null;
            for (var n = 0; n < r.ops.length; n++) r.ops[n].cm.curOp = null;
            St(r)
        }
    }

    function St(e) {
        for (var t = e.ops, r = 0; r < t.length; r++) Ct(t[r]);
        for (var r = 0; r < t.length; r++) kt(t[r]);
        for (var r = 0; r < t.length; r++) Lt(t[r]);
        for (var r = 0; r < t.length; r++) Mt(t[r]);
        for (var r = 0; r < t.length; r++) Tt(t[r])
    }

    function Ct(e) {
        var t = e.cm, r = t.display;
        M(t), e.updateMaxLine && d(t), e.mustUpdate = e.viewChanged || e.forceUpdate || null != e.scrollTop || e.scrollToPos && (e.scrollToPos.from.line < r.viewFrom || e.scrollToPos.to.line >= r.viewTo) || r.maxLineChanged && t.options.lineWrapping, e.update = e.mustUpdate && new L(t, e.mustUpdate && {
            top: e.scrollTop,
            ensure: e.scrollToPos
        }, e.forceUpdate)
    }

    function kt(e) {
        e.updatedDisplay = e.mustUpdate && T(e.cm, e.update)
    }

    function Lt(e) {
        var t = e.cm, r = t.display;
        e.updatedDisplay && O(t), e.barMeasure = p(t), r.maxLineChanged && !t.options.lineWrapping && (e.adjustWidthTo = Ze(t, r.maxLine, r.maxLine.text.length).left + 3, t.display.sizerWidth = e.adjustWidthTo, e.barMeasure.scrollWidth = Math.max(r.scroller.clientWidth, r.sizer.offsetLeft + e.adjustWidthTo + je(t) + t.display.barWidth), e.maxScrollLeft = Math.max(0, r.sizer.offsetLeft + e.adjustWidthTo - $e(t))), (e.updatedDisplay || e.selectionChanged) && (e.preparedSelection = r.input.prepareSelection())
    }

    function Mt(e) {
        var t = e.cm;
        null != e.adjustWidthTo && (t.display.sizer.style.minWidth = e.adjustWidthTo + "px", e.maxScrollLeft < t.doc.scrollLeft && nr(t, Math.min(t.display.scroller.scrollLeft, e.maxScrollLeft), !0), t.display.maxLineChanged = !1), e.preparedSelection && t.display.input.showSelection(e.preparedSelection), e.updatedDisplay && D(t, e.barMeasure), (e.updatedDisplay || e.startHeight != t.doc.height) && y(t, e.barMeasure), e.selectionChanged && Pe(t), t.state.focused && e.updateInput && t.display.input.reset(e.typing), e.focus && e.focus == Gi() && Y(e.cm)
    }

    function Tt(e) {
        var t = e.cm, r = t.display, n = t.doc;
        if (e.updatedDisplay && N(t, e.update), null == r.wheelStartX || null == e.scrollTop && null == e.scrollLeft && !e.scrollToPos || (r.wheelStartX = r.wheelStartY = null), null == e.scrollTop || r.scroller.scrollTop == e.scrollTop && !e.forceScroll || (n.scrollTop = Math.max(0, Math.min(r.scroller.scrollHeight - r.scroller.clientHeight, e.scrollTop)), r.scrollbars.setScrollTop(n.scrollTop), r.scroller.scrollTop = n.scrollTop), null == e.scrollLeft || r.scroller.scrollLeft == e.scrollLeft && !e.forceScroll || (n.scrollLeft = Math.max(0, Math.min(r.scroller.scrollWidth - $e(t), e.scrollLeft)), r.scrollbars.setScrollLeft(n.scrollLeft), r.scroller.scrollLeft = n.scrollLeft, w(t)), e.scrollToPos) {
            var i = Hr(t, me(n, e.scrollToPos.from), me(n, e.scrollToPos.to), e.scrollToPos.margin);
            e.scrollToPos.isCursor && t.state.focused && Or(t, i)
        }
        var o = e.maybeHiddenMarkers, l = e.maybeUnhiddenMarkers;
        if (o) for (var a = 0; a < o.length; ++a) o[a].lines.length || Al(o[a], "hide");
        if (l) for (var a = 0; a < l.length; ++a) l[a].lines.length && Al(l[a], "unhide");
        r.wrapper.offsetHeight && (n.scrollTop = t.display.scroller.scrollTop), e.changeObjs && Al(t, "changes", t, e.changeObjs), e.update && e.update.finish()
    }

    function Nt(e, t) {
        if (e.curOp) return t();
        bt(e);
        try {
            return t()
        } finally {
            wt(e)
        }
    }

    function At(e, t) {
        return function () {
            if (e.curOp) return t.apply(e, arguments);
            bt(e);
            try {
                return t.apply(e, arguments)
            } finally {
                wt(e)
            }
        }
    }

    function Dt(e) {
        return function () {
            if (this.curOp) return e.apply(this, arguments);
            bt(this);
            try {
                return e.apply(this, arguments)
            } finally {
                wt(this)
            }
        }
    }

    function Ot(e) {
        return function () {
            var t = this.cm;
            if (!t || t.curOp) return e.apply(this, arguments);
            bt(t);
            try {
                return e.apply(this, arguments)
            } finally {
                wt(t)
            }
        }
    }

    function Ht(e, t, r) {
        this.line = t, this.rest = yn(t), this.size = this.rest ? ei(Oi(this.rest)) - r + 1 : 1, this.node = this.text = null, this.hidden = wn(e, t)
    }

    function Et(e, t, r) {
        for (var n, i = [], o = t; r > o; o = n) {
            var l = new Ht(e.doc, Yn(e.doc, o), o);
            n = o + l.size, i.push(l)
        }
        return i
    }

    function Wt(e, t, r, n) {
        null == t && (t = e.doc.first), null == r && (r = e.doc.first + e.doc.size), n || (n = 0);
        var i = e.display;
        if (n && r < i.viewTo && (null == i.updateLineNumbers || i.updateLineNumbers > t) && (i.updateLineNumbers = t), e.curOp.viewChanged = !0, t >= i.viewTo) Eo && bn(e.doc, t) < i.viewTo && Ft(e); else if (r <= i.viewFrom) Eo && xn(e.doc, r + n) > i.viewFrom ? Ft(e) : (i.viewFrom += n, i.viewTo += n); else if (t <= i.viewFrom && r >= i.viewTo) Ft(e); else if (t <= i.viewFrom) {
            var o = Bt(e, r, r + n, 1);
            o ? (i.view = i.view.slice(o.index), i.viewFrom = o.lineN, i.viewTo += n) : Ft(e)
        } else if (r >= i.viewTo) {
            var o = Bt(e, t, t, -1);
            o ? (i.view = i.view.slice(0, o.index), i.viewTo = o.lineN) : Ft(e)
        } else {
            var l = Bt(e, t, t, -1), a = Bt(e, r, r + n, 1);
            l && a ? (i.view = i.view.slice(0, l.index).concat(Et(e, l.lineN, a.lineN)).concat(i.view.slice(a.index)), i.viewTo += n) : Ft(e)
        }
        var s = i.externalMeasured;
        s && (r < s.lineN ? s.lineN += n : t < s.lineN + s.size && (i.externalMeasured = null))
    }

    function It(e, t, r) {
        e.curOp.viewChanged = !0;
        var n = e.display, i = e.display.externalMeasured;
        if (i && t >= i.lineN && t < i.lineN + i.size && (n.externalMeasured = null), !(t < n.viewFrom || t >= n.viewTo)) {
            var o = n.view[Pt(e, t)];
            if (null != o.node) {
                var l = o.changes || (o.changes = []);
                -1 == Hi(l, r) && l.push(r)
            }
        }
    }

    function Ft(e) {
        e.display.viewFrom = e.display.viewTo = e.doc.first, e.display.view = [], e.display.viewOffset = 0
    }

    function Pt(e, t) {
        if (t >= e.display.viewTo) return null;
        if (t -= e.display.viewFrom, 0 > t) return null;
        for (var r = e.display.view, n = 0; n < r.length; n++) if (t -= r[n].size, 0 > t) return n
    }

    function Bt(e, t, r, n) {
        var i, o = Pt(e, t), l = e.display.view;
        if (!Eo || r == e.doc.first + e.doc.size) return {index: o, lineN: r};
        for (var a = 0, s = e.display.viewFrom; o > a; a++) s += l[a].size;
        if (s != t) {
            if (n > 0) {
                if (o == l.length - 1) return null;
                i = s + l[o].size - t, o++
            } else i = s - t;
            t += i, r += i
        }
        for (; bn(e.doc, r) != r;) {
            if (o == (0 > n ? 0 : l.length - 1)) return null;
            r += n * l[o - (0 > n ? 1 : 0)].size, o += n
        }
        return {index: o, lineN: r}
    }

    function zt(e, t, r) {
        var n = e.display, i = n.view;
        0 == i.length || t >= n.viewTo || r <= n.viewFrom ? (n.view = Et(e, t, r), n.viewFrom = t) : (n.viewFrom > t ? n.view = Et(e, t, n.viewFrom).concat(n.view) : n.viewFrom < t && (n.view = n.view.slice(Pt(e, t))), n.viewFrom = t, n.viewTo < r ? n.view = n.view.concat(Et(e, n.viewTo, r)) : n.viewTo > r && (n.view = n.view.slice(0, Pt(e, r)))), n.viewTo = r
    }

    function _t(e) {
        for (var t = e.display.view, r = 0, n = 0; n < t.length; n++) {
            var i = t[n];
            i.hidden || i.node && !i.changes || ++r
        }
        return r
    }

    function Rt(e) {
        function t() {
            i.activeTouch && (o = setTimeout(function () {
                i.activeTouch = null
            }, 1e3), l = i.activeTouch, l.end = +new Date)
        }

        function r(e) {
            if (1 != e.touches.length) return !1;
            var t = e.touches[0];
            return t.radiusX <= 1 && t.radiusY <= 1
        }

        function n(e, t) {
            if (null == t.left) return !0;
            var r = t.left - e.left, n = t.top - e.top;
            return r * r + n * n > 400
        }

        var i = e.display;
        Ml(i.scroller, "mousedown", At(e, $t)), mo && 11 > vo ? Ml(i.scroller, "dblclick", At(e, function (t) {
            if (!Li(e, t)) {
                var r = jt(e, t);
                if (r && !Zt(e, t) && !Gt(e.display, t)) {
                    Cl(t);
                    var n = e.findWordAt(r);
                    we(e.doc, n.anchor, n.head)
                }
            }
        })) : Ml(i.scroller, "dblclick", function (t) {
            Li(e, t) || Cl(t)
        }), Oo || Ml(i.scroller, "contextmenu", function (t) {
            vr(e, t)
        });
        var o, l = {end: 0};
        Ml(i.scroller, "touchstart", function (e) {
            if (!r(e)) {
                clearTimeout(o);
                var t = +new Date;
                i.activeTouch = {
                    start: t,
                    moved: !1,
                    prev: t - l.end <= 300 ? l : null
                }, 1 == e.touches.length && (i.activeTouch.left = e.touches[0].pageX, i.activeTouch.top = e.touches[0].pageY)
            }
        }), Ml(i.scroller, "touchmove", function () {
            i.activeTouch && (i.activeTouch.moved = !0)
        }), Ml(i.scroller, "touchend", function (r) {
            var o = i.activeTouch;
            if (o && !Gt(i, r) && null != o.left && !o.moved && new Date - o.start < 300) {
                var l, a = e.coordsChar(i.activeTouch, "page");
                l = !o.prev || n(o, o.prev) ? new de(a, a) : !o.prev.prev || n(o, o.prev.prev) ? e.findWordAt(a) : new de(Wo(a.line, 0), me(e.doc, Wo(a.line + 1, 0))), e.setSelection(l.anchor, l.head), e.focus(), Cl(r)
            }
            t()
        }), Ml(i.scroller, "touchcancel", t), Ml(i.scroller, "scroll", function () {
            i.scroller.clientHeight && (rr(e, i.scroller.scrollTop), nr(e, i.scroller.scrollLeft, !0), Al(e, "scroll", e))
        }), Ml(i.scroller, "mousewheel", function (t) {
            ir(e, t)
        }), Ml(i.scroller, "DOMMouseScroll", function (t) {
            ir(e, t)
        }), Ml(i.wrapper, "scroll", function () {
            i.wrapper.scrollTop = i.wrapper.scrollLeft = 0
        }), i.dragFunctions = {
            enter: function (t) {
                Li(e, t) || Ll(t)
            }, over: function (t) {
                Li(e, t) || (er(e, t), Ll(t))
            }, start: function (t) {
                Jt(e, t)
            }, drop: At(e, Qt), leave: function () {
                tr(e)
            }
        };
        var a = i.input.getField();
        Ml(a, "keyup", function (t) {
            dr.call(e, t)
        }), Ml(a, "keydown", At(e, cr)), Ml(a, "keypress", At(e, fr)), Ml(a, "focus", Pi(gr, e)), Ml(a, "blur", Pi(mr, e))
    }

    function qt(t, r, n) {
        var i = n && n != e.Init;
        if (!r != !i) {
            var o = t.display.dragFunctions, l = r ? Ml : Nl;
            l(t.display.scroller, "dragstart", o.start), l(t.display.scroller, "dragenter", o.enter), l(t.display.scroller, "dragover", o.over), l(t.display.scroller, "dragleave", o.leave), l(t.display.scroller, "drop", o.drop)
        }
    }

    function Ut(e) {
        var t = e.display;
        (t.lastWrapHeight != t.wrapper.clientHeight || t.lastWrapWidth != t.wrapper.clientWidth) && (t.cachedCharWidth = t.cachedTextHeight = t.cachedPaddingH = null, t.scrollbarsClipped = !1, e.setSize())
    }

    function Gt(e, t) {
        for (var r = xi(t); r != e.wrapper; r = r.parentNode) if (!r || 1 == r.nodeType && "true" == r.getAttribute("cm-ignore-events") || r.parentNode == e.sizer && r != e.mover) return !0
    }

    function jt(e, t, r, n) {
        var i = e.display;
        if (!r && "true" == xi(t).getAttribute("cm-not-content")) return null;
        var o, l, a = i.lineSpace.getBoundingClientRect();
        try {
            o = t.clientX - a.left, l = t.clientY - a.top
        } catch (t) {
            return null
        }
        var s, u = gt(e, o, l);
        if (n && 1 == u.xRel && (s = Yn(e.doc, u.line).text).length == u.ch) {
            var c = Fl(s, s.length, e.options.tabSize) - s.length;
            u = Wo(u.line, Math.max(0, Math.round((o - Ge(e.display).left) / yt(e.display)) - c))
        }
        return u
    }

    function $t(e) {
        var t = this, r = t.display;
        if (!(r.activeTouch && r.input.supportsTouch() || Li(t, e))) {
            if (r.shift = e.shiftKey, Gt(r, e)) return void (yo || (r.scroller.draggable = !1, setTimeout(function () {
                r.scroller.draggable = !0
            }, 100)));
            if (!Zt(t, e)) {
                var n = jt(t, e);
                switch (window.focus(), wi(e)) {
                    case 1:
                        t.state.selectingText ? t.state.selectingText(e) : n ? Vt(t, e, n) : xi(e) == r.scroller && Cl(e);
                        break;
                    case 2:
                        yo && (t.state.lastMiddleDown = +new Date), n && we(t.doc, n), setTimeout(function () {
                            r.input.focus()
                        }, 20), Cl(e);
                        break;
                    case 3:
                        Oo ? vr(t, e) : pr(t)
                }
            }
        }
    }

    function Vt(e, t, r) {
        mo ? setTimeout(Pi(Y, e), 0) : e.curOp.focus = Gi();
        var n, i = +new Date;
        zo && zo.time > i - 400 && 0 == Io(zo.pos, r) ? n = "triple" : Bo && Bo.time > i - 400 && 0 == Io(Bo.pos, r) ? (n = "double", zo = {
            time: i,
            pos: r
        }) : (n = "single", Bo = {time: i, pos: r});
        var o, l = e.doc.sel, a = To ? t.metaKey : t.ctrlKey;
        e.options.dragDrop && Yl && !Z(e) && "single" == n && (o = l.contains(r)) > -1 && (Io((o = l.ranges[o]).from(), r) < 0 || r.xRel > 0) && (Io(o.to(), r) > 0 || r.xRel < 0) ? Kt(e, t, r, a) : Xt(e, t, r, n, a)
    }

    function Kt(e, t, r, n) {
        var i = e.display, o = +new Date, l = At(e, function (a) {
            yo && (i.scroller.draggable = !1), e.state.draggingText = !1, Nl(document, "mouseup", l), Nl(i.scroller, "drop", l), Math.abs(t.clientX - a.clientX) + Math.abs(t.clientY - a.clientY) < 10 && (Cl(a), !n && +new Date - 200 < o && we(e.doc, r), yo || mo && 9 == vo ? setTimeout(function () {
                document.body.focus(), i.input.focus()
            }, 20) : i.input.focus())
        });
        yo && (i.scroller.draggable = !0), e.state.draggingText = l, i.scroller.dragDrop && i.scroller.dragDrop(), Ml(document, "mouseup", l), Ml(i.scroller, "drop", l)
    }

    function Xt(e, t, r, n, i) {
        function o(t) {
            if (0 != Io(m, t)) if (m = t, "rect" == n) {
                for (var i = [], o = e.options.tabSize, l = Fl(Yn(u, r.line).text, r.ch, o), a = Fl(Yn(u, t.line).text, t.ch, o), s = Math.min(l, a), f = Math.max(l, a), p = Math.min(r.line, t.line), g = Math.min(e.lastLine(), Math.max(r.line, t.line)); g >= p; p++) {
                    var v = Yn(u, p).text, y = Pl(v, s, o);
                    s == f ? i.push(new de(Wo(p, y), Wo(p, y))) : v.length > y && i.push(new de(Wo(p, y), Wo(p, Pl(v, f, o))))
                }
                i.length || i.push(new de(r, r)), Te(u, fe(d.ranges.slice(0, h).concat(i), h), {
                    origin: "*mouse",
                    scroll: !1
                }), e.scrollIntoView(t)
            } else {
                var b = c, x = b.anchor, w = t;
                if ("single" != n) {
                    if ("double" == n) var S = e.findWordAt(t); else var S = new de(Wo(t.line, 0), me(u, Wo(t.line + 1, 0)));
                    Io(S.anchor, x) > 0 ? (w = S.head, x = X(b.from(), S.anchor)) : (w = S.anchor, x = K(b.to(), S.head))
                }
                var i = d.ranges.slice(0);
                i[h] = new de(me(u, x), w), Te(u, fe(i, h), Wl)
            }
        }

        function l(t) {
            var r = ++y, i = jt(e, t, !0, "rect" == n);
            if (i) if (0 != Io(i, m)) {
                e.curOp.focus = Gi(), o(i);
                var a = x(s, u);
                (i.line >= a.to || i.line < a.from) && setTimeout(At(e, function () {
                    y == r && l(t)
                }), 150)
            } else {
                var c = t.clientY < v.top ? -20 : t.clientY > v.bottom ? 20 : 0;
                c && setTimeout(At(e, function () {
                    y == r && (s.scroller.scrollTop += c, l(t))
                }), 50)
            }
        }

        function a(t) {
            e.state.selectingText = !1, y = 1 / 0, Cl(t), s.input.focus(), Nl(document, "mousemove", b), Nl(document, "mouseup", w), u.history.lastSelOrigin = null
        }

        var s = e.display, u = e.doc;
        Cl(t);
        var c, h, d = u.sel, f = d.ranges;
        if (i && !t.shiftKey ? (h = u.sel.contains(r), c = h > -1 ? f[h] : new de(r, r)) : (c = u.sel.primary(), h = u.sel.primIndex), t.altKey) n = "rect", i || (c = new de(r, r)), r = jt(e, t, !0, !0), h = -1; else if ("double" == n) {
            var p = e.findWordAt(r);
            c = e.display.shift || u.extend ? xe(u, c, p.anchor, p.head) : p
        } else if ("triple" == n) {
            var g = new de(Wo(r.line, 0), me(u, Wo(r.line + 1, 0)));
            c = e.display.shift || u.extend ? xe(u, c, g.anchor, g.head) : g
        } else c = xe(u, c, r);
        i ? -1 == h ? (h = f.length, Te(u, fe(f.concat([c]), h), {
            scroll: !1,
            origin: "*mouse"
        })) : f.length > 1 && f[h].empty() && "single" == n && !t.shiftKey ? (Te(u, fe(f.slice(0, h).concat(f.slice(h + 1)), 0), {
            scroll: !1,
            origin: "*mouse"
        }), d = u.sel) : Ce(u, h, c, Wl) : (h = 0, Te(u, new he([c], 0), Wl), d = u.sel);
        var m = r, v = s.wrapper.getBoundingClientRect(), y = 0, b = At(e, function (e) {
            wi(e) ? l(e) : a(e)
        }), w = At(e, a);
        e.state.selectingText = w, Ml(document, "mousemove", b), Ml(document, "mouseup", w)
    }

    function Yt(e, t, r, n, i) {
        try {
            var o = t.clientX, l = t.clientY
        } catch (t) {
            return !1
        }
        if (o >= Math.floor(e.display.gutters.getBoundingClientRect().right)) return !1;
        n && Cl(t);
        var a = e.display, s = a.lineDiv.getBoundingClientRect();
        if (l > s.bottom || !Ti(e, r)) return bi(t);
        l -= s.top - a.viewOffset;
        for (var u = 0; u < e.options.gutters.length; ++u) {
            var c = a.gutters.childNodes[u];
            if (c && c.getBoundingClientRect().right >= o) {
                var h = ti(e.doc, l), d = e.options.gutters[u];
                return i(e, r, e, h, d, t), bi(t)
            }
        }
    }

    function Zt(e, t) {
        return Yt(e, t, "gutterClick", !0, Ci)
    }

    function Qt(e) {
        var t = this;
        if (tr(t), !Li(t, e) && !Gt(t.display, e)) {
            Cl(e), mo && (Uo = +new Date);
            var r = jt(t, e, !0), n = e.dataTransfer.files;
            if (r && !Z(t)) if (n && n.length && window.FileReader && window.File) for (var i = n.length, o = Array(i), l = 0, a = function (e, n) {
                var a = new FileReader;
                a.onload = At(t, function () {
                    if (o[n] = a.result, ++l == i) {
                        r = me(t.doc, r);
                        var e = {
                            from: r,
                            to: r,
                            text: t.doc.splitLines(o.join(t.doc.lineSeparator())),
                            origin: "paste"
                        };
                        kr(t.doc, e), Me(t.doc, pe(r, Xo(e)))
                    }
                }), a.readAsText(e)
            }, s = 0; i > s; ++s) a(n[s], s); else {
                if (t.state.draggingText && t.doc.sel.contains(r) > -1) return t.state.draggingText(e), void setTimeout(function () {
                    t.display.input.focus()
                }, 20);
                try {
                    var o = e.dataTransfer.getData("Text");
                    if (o) {
                        if (t.state.draggingText && !(To ? e.altKey : e.ctrlKey)) var u = t.listSelections();
                        if (Ne(t.doc, pe(r, r)), u) for (var s = 0; s < u.length; ++s) Dr(t.doc, "", u[s].anchor, u[s].head, "drag");
                        t.replaceSelection(o, "around", "paste"), t.display.input.focus()
                    }
                } catch (e) {
                }
            }
        }
    }

    function Jt(e, t) {
        if (mo && (!e.state.draggingText || +new Date - Uo < 100)) return void Ll(t);
        if (!Li(e, t) && !Gt(e.display, t) && (t.dataTransfer.setData("Text", e.getSelection()), t.dataTransfer.setDragImage && !So)) {
            var r = Ri("img", null, null, "position: fixed; left: 0; top: 0;");
            r.src = "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==", wo && (r.width = r.height = 1, e.display.wrapper.appendChild(r), r._top = r.offsetTop), t.dataTransfer.setDragImage(r, 0, 0), wo && r.parentNode.removeChild(r)
        }
    }

    function er(e, t) {
        var r = jt(e, t);
        if (r) {
            var n = document.createDocumentFragment();
            Ie(e, r, n), e.display.dragCursor || (e.display.dragCursor = Ri("div", null, "CodeMirror-cursors CodeMirror-dragcursors"), e.display.lineSpace.insertBefore(e.display.dragCursor, e.display.cursorDiv)), Ui(e.display.dragCursor, n)
        }
    }

    function tr(e) {
        e.display.dragCursor && (e.display.lineSpace.removeChild(e.display.dragCursor), e.display.dragCursor = null)
    }

    function rr(e, t) {
        Math.abs(e.doc.scrollTop - t) < 2 || (e.doc.scrollTop = t, fo || A(e, {top: t}), e.display.scroller.scrollTop != t && (e.display.scroller.scrollTop = t), e.display.scrollbars.setScrollTop(t), fo && A(e), Be(e, 100))
    }

    function nr(e, t, r) {
        (r ? t == e.doc.scrollLeft : Math.abs(e.doc.scrollLeft - t) < 2) || (t = Math.min(t, e.display.scroller.scrollWidth - e.display.scroller.clientWidth), e.doc.scrollLeft = t, w(e), e.display.scroller.scrollLeft != t && (e.display.scroller.scrollLeft = t), e.display.scrollbars.setScrollLeft(t))
    }

    function ir(e, t) {
        var r = $o(t), n = r.x, i = r.y, o = e.display, l = o.scroller;
        if (n && l.scrollWidth > l.clientWidth || i && l.scrollHeight > l.clientHeight) {
            if (i && To && yo) e:for (var a = t.target, s = o.view; a != l; a = a.parentNode) for (var u = 0; u < s.length; u++) if (s[u].node == a) {
                e.display.currentWheelTarget = a;
                break e
            }
            if (n && !fo && !wo && null != jo) return i && rr(e, Math.max(0, Math.min(l.scrollTop + i * jo, l.scrollHeight - l.clientHeight))), nr(e, Math.max(0, Math.min(l.scrollLeft + n * jo, l.scrollWidth - l.clientWidth))), Cl(t), void (o.wheelStartX = null);
            if (i && null != jo) {
                var c = i * jo, h = e.doc.scrollTop, d = h + o.wrapper.clientHeight;
                0 > c ? h = Math.max(0, h + c - 50) : d = Math.min(e.doc.height, d + c + 50), A(e, {top: h, bottom: d})
            }
            20 > Go && (null == o.wheelStartX ? (o.wheelStartX = l.scrollLeft, o.wheelStartY = l.scrollTop, o.wheelDX = n, o.wheelDY = i, setTimeout(function () {
                if (null != o.wheelStartX) {
                    var e = l.scrollLeft - o.wheelStartX, t = l.scrollTop - o.wheelStartY,
                        r = t && o.wheelDY && t / o.wheelDY || e && o.wheelDX && e / o.wheelDX;
                    o.wheelStartX = o.wheelStartY = null, r && (jo = (jo * Go + r) / (Go + 1), ++Go)
                }
            }, 200)) : (o.wheelDX += n, o.wheelDY += i))
        }
    }

    function or(e, t, r) {
        if ("string" == typeof t && (t = ll[t], !t)) return !1;
        e.display.input.ensurePolled();
        var n = e.display.shift, i = !1;
        try {
            Z(e) && (e.state.suppressEdits = !0), r && (e.display.shift = !1), i = t(e) != Hl
        } finally {
            e.display.shift = n, e.state.suppressEdits = !1
        }
        return i
    }

    function lr(e, t, r) {
        for (var n = 0; n < e.state.keyMaps.length; n++) {
            var i = sl(t, e.state.keyMaps[n], r, e);
            if (i) return i
        }
        return e.options.extraKeys && sl(t, e.options.extraKeys, r, e) || sl(t, e.options.keyMap, r, e)
    }

    function ar(e, t, r, n) {
        var i = e.state.keySeq;
        if (i) {
            if (ul(t)) return "handled";
            Vo.set(50, function () {
                e.state.keySeq == i && (e.state.keySeq = null, e.display.input.reset())
            }), t = i + " " + t
        }
        var o = lr(e, t, n);
        return "multi" == o && (e.state.keySeq = t), "handled" == o && Ci(e, "keyHandled", e, t, r), ("handled" == o || "multi" == o) && (Cl(r), Pe(e)), i && !o && /\'$/.test(t) ? (Cl(r), !0) : !!o
    }

    function sr(e, t) {
        var r = cl(t, !0);
        return r ? t.shiftKey && !e.state.keySeq ? ar(e, "Shift-" + r, t, function (t) {
            return or(e, t, !0)
        }) || ar(e, r, t, function (t) {
            return ("string" == typeof t ? /^go[A-Z]/.test(t) : t.motion) ? or(e, t) : void 0
        }) : ar(e, r, t, function (t) {
            return or(e, t)
        }) : !1
    }

    function ur(e, t, r) {
        return ar(e, "'" + r + "'", t, function (t) {
            return or(e, t, !0)
        })
    }

    function cr(e) {
        var t = this;
        if (t.curOp.focus = Gi(), !Li(t, e)) {
            mo && 11 > vo && 27 == e.keyCode && (e.returnValue = !1);
            var r = e.keyCode;
            t.display.shift = 16 == r || e.shiftKey;
            var n = sr(t, e);
            wo && (Ko = n ? r : null, !n && 88 == r && !Jl && (To ? e.metaKey : e.ctrlKey) && t.replaceSelection("", null, "cut")), 18 != r || /\bCodeMirror-crosshair\b/.test(t.display.lineDiv.className) || hr(t)
        }
    }

    function hr(e) {
        function t(e) {
            18 != e.keyCode && e.altKey || (Vl(r, "CodeMirror-crosshair"), Nl(document, "keyup", t), Nl(document, "mouseover", t))
        }

        var r = e.display.lineDiv;
        Kl(r, "CodeMirror-crosshair"), Ml(document, "keyup", t), Ml(document, "mouseover", t)
    }

    function dr(e) {
        16 == e.keyCode && (this.doc.sel.shift = !1), Li(this, e)
    }

    function fr(e) {
        var t = this;
        if (!(Gt(t.display, e) || Li(t, e) || e.ctrlKey && !e.altKey || To && e.metaKey)) {
            var r = e.keyCode, n = e.charCode;
            if (wo && r == Ko) return Ko = null,
                void Cl(e);
            if (!wo || e.which && !(e.which < 10) || !sr(t, e)) {
                var i = String.fromCharCode(null == n ? r : n);
                ur(t, e, i) || t.display.input.onKeyPress(e)
            }
        }
    }

    function pr(e) {
        e.state.delayingBlurEvent = !0, setTimeout(function () {
            e.state.delayingBlurEvent && (e.state.delayingBlurEvent = !1, mr(e))
        }, 100)
    }

    function gr(e) {
        e.state.delayingBlurEvent && (e.state.delayingBlurEvent = !1), "nocursor" != e.options.readOnly && (e.state.focused || (Al(e, "focus", e), e.state.focused = !0, Kl(e.display.wrapper, "CodeMirror-focused"), e.curOp || e.display.selForContextMenu == e.doc.sel || (e.display.input.reset(), yo && setTimeout(function () {
            e.display.input.reset(!0)
        }, 20)), e.display.input.receivedFocus()), Pe(e))
    }

    function mr(e) {
        e.state.delayingBlurEvent || (e.state.focused && (Al(e, "blur", e), e.state.focused = !1, Vl(e.display.wrapper, "CodeMirror-focused")), clearInterval(e.display.blinker), setTimeout(function () {
            e.state.focused || (e.display.shift = !1)
        }, 150))
    }

    function vr(e, t) {
        Gt(e.display, t) || yr(e, t) || e.display.input.onContextMenu(t)
    }

    function yr(e, t) {
        return Ti(e, "gutterContextMenu") ? Yt(e, t, "gutterContextMenu", !1, Al) : !1
    }

    function br(e, t) {
        if (Io(e, t.from) < 0) return e;
        if (Io(e, t.to) <= 0) return Xo(t);
        var r = e.line + t.text.length - (t.to.line - t.from.line) - 1, n = e.ch;
        return e.line == t.to.line && (n += Xo(t).ch - t.to.ch), Wo(r, n)
    }

    function xr(e, t) {
        for (var r = [], n = 0; n < e.sel.ranges.length; n++) {
            var i = e.sel.ranges[n];
            r.push(new de(br(i.anchor, t), br(i.head, t)))
        }
        return fe(r, e.sel.primIndex)
    }

    function wr(e, t, r) {
        return e.line == t.line ? Wo(r.line, e.ch - t.ch + r.ch) : Wo(r.line + (e.line - t.line), e.ch)
    }

    function Sr(e, t, r) {
        for (var n = [], i = Wo(e.first, 0), o = i, l = 0; l < t.length; l++) {
            var a = t[l], s = wr(a.from, i, o), u = wr(Xo(a), i, o);
            if (i = a.to, o = u, "around" == r) {
                var c = e.sel.ranges[l], h = Io(c.head, c.anchor) < 0;
                n[l] = new de(h ? u : s, h ? s : u)
            } else n[l] = new de(s, s)
        }
        return new he(n, e.sel.primIndex)
    }

    function Cr(e, t, r) {
        var n = {
            canceled: !1, from: t.from, to: t.to, text: t.text, origin: t.origin, cancel: function () {
                this.canceled = !0
            }
        };
        return r && (n.update = function (t, r, n, i) {
            t && (this.from = me(e, t)), r && (this.to = me(e, r)), n && (this.text = n), void 0 !== i && (this.origin = i)
        }), Al(e, "beforeChange", e, n), e.cm && Al(e.cm, "beforeChange", e.cm, n), n.canceled ? null : {
            from: n.from,
            to: n.to,
            text: n.text,
            origin: n.origin
        }
    }

    function kr(e, t, r) {
        if (e.cm) {
            if (!e.cm.curOp) return At(e.cm, kr)(e, t, r);
            if (e.cm.state.suppressEdits) return
        }
        if (!(Ti(e, "beforeChange") || e.cm && Ti(e.cm, "beforeChange")) || (t = Cr(e, t, !0))) {
            var n = Ho && !r && an(e, t.from, t.to);
            if (n) for (var i = n.length - 1; i >= 0; --i) Lr(e, {
                from: n[i].from,
                to: n[i].to,
                text: i ? [""] : t.text
            }); else Lr(e, t)
        }
    }

    function Lr(e, t) {
        if (1 != t.text.length || "" != t.text[0] || 0 != Io(t.from, t.to)) {
            var r = xr(e, t);
            si(e, t, r, e.cm ? e.cm.curOp.id : NaN), Nr(e, t, r, nn(e, t));
            var n = [];
            Kn(e, function (e, r) {
                r || -1 != Hi(n, e.history) || (yi(e.history, t), n.push(e.history)), Nr(e, t, null, nn(e, t))
            })
        }
    }

    function Mr(e, t, r) {
        if (!e.cm || !e.cm.state.suppressEdits) {
            for (var n, i = e.history, o = e.sel, l = "undo" == t ? i.done : i.undone, a = "undo" == t ? i.undone : i.done, s = 0; s < l.length && (n = l[s], r ? !n.ranges || n.equals(e.sel) : n.ranges); s++) ;
            if (s != l.length) {
                for (i.lastOrigin = i.lastSelOrigin = null; n = l.pop(), n.ranges;) {
                    if (hi(n, a), r && !n.equals(e.sel)) return void Te(e, n, {clearRedo: !1});
                    o = n
                }
                var u = [];
                hi(o, a), a.push({
                    changes: u,
                    generation: i.generation
                }), i.generation = n.generation || ++i.maxGeneration;
                for (var c = Ti(e, "beforeChange") || e.cm && Ti(e.cm, "beforeChange"), s = n.changes.length - 1; s >= 0; --s) {
                    var h = n.changes[s];
                    if (h.origin = t, c && !Cr(e, h, !1)) return void (l.length = 0);
                    u.push(oi(e, h));
                    var d = s ? xr(e, h) : Oi(l);
                    Nr(e, h, d, ln(e, h)), !s && e.cm && e.cm.scrollIntoView({from: h.from, to: Xo(h)});
                    var f = [];
                    Kn(e, function (e, t) {
                        t || -1 != Hi(f, e.history) || (yi(e.history, h), f.push(e.history)), Nr(e, h, null, ln(e, h))
                    })
                }
            }
        }
    }

    function Tr(e, t) {
        if (0 != t && (e.first += t, e.sel = new he(Ei(e.sel.ranges, function (e) {
            return new de(Wo(e.anchor.line + t, e.anchor.ch), Wo(e.head.line + t, e.head.ch))
        }), e.sel.primIndex), e.cm)) {
            Wt(e.cm, e.first, e.first - t, t);
            for (var r = e.cm.display, n = r.viewFrom; n < r.viewTo; n++) It(e.cm, n, "gutter")
        }
    }

    function Nr(e, t, r, n) {
        if (e.cm && !e.cm.curOp) return At(e.cm, Nr)(e, t, r, n);
        if (t.to.line < e.first) return void Tr(e, t.text.length - 1 - (t.to.line - t.from.line));
        if (!(t.from.line > e.lastLine())) {
            if (t.from.line < e.first) {
                var i = t.text.length - 1 - (e.first - t.from.line);
                Tr(e, i), t = {
                    from: Wo(e.first, 0),
                    to: Wo(t.to.line + i, t.to.ch),
                    text: [Oi(t.text)],
                    origin: t.origin
                }
            }
            var o = e.lastLine();
            t.to.line > o && (t = {
                from: t.from,
                to: Wo(o, Yn(e, o).text.length),
                text: [t.text[0]],
                origin: t.origin
            }), t.removed = Zn(e, t.from, t.to), r || (r = xr(e, t)), e.cm ? Ar(e.cm, t, n) : jn(e, t, n), Ne(e, r, El)
        }
    }

    function Ar(e, t, r) {
        var n = e.doc, i = e.display, l = t.from, a = t.to, s = !1, u = l.line;
        e.options.lineWrapping || (u = ei(vn(Yn(n, l.line))), n.iter(u, a.line + 1, function (e) {
            return e == i.maxLine ? (s = !0, !0) : void 0
        })), n.sel.contains(t.from, t.to) > -1 && Mi(e), jn(n, t, r, o(e)), e.options.lineWrapping || (n.iter(u, l.line + t.text.length, function (e) {
            var t = h(e);
            t > i.maxLineLength && (i.maxLine = e, i.maxLineLength = t, i.maxLineChanged = !0, s = !1)
        }), s && (e.curOp.updateMaxLine = !0)), n.frontier = Math.min(n.frontier, l.line), Be(e, 400);
        var c = t.text.length - (a.line - l.line) - 1;
        t.full ? Wt(e) : l.line != a.line || 1 != t.text.length || Gn(e.doc, t) ? Wt(e, l.line, a.line + 1, c) : It(e, l.line, "text");
        var d = Ti(e, "changes"), f = Ti(e, "change");
        if (f || d) {
            var p = {from: l, to: a, text: t.text, removed: t.removed, origin: t.origin};
            f && Ci(e, "change", e, p), d && (e.curOp.changeObjs || (e.curOp.changeObjs = [])).push(p)
        }
        e.display.selForContextMenu = null
    }

    function Dr(e, t, r, n, i) {
        if (n || (n = r), Io(n, r) < 0) {
            var o = n;
            n = r, r = o
        }
        "string" == typeof t && (t = e.splitLines(t)), kr(e, {from: r, to: n, text: t, origin: i})
    }

    function Or(e, t) {
        if (!Li(e, "scrollCursorIntoView")) {
            var r = e.display, n = r.sizer.getBoundingClientRect(), i = null;
            if (t.top + n.top < 0 ? i = !0 : t.bottom + n.top > (window.innerHeight || document.documentElement.clientHeight) && (i = !1), null != i && !ko) {
                var o = Ri("div", "​", null, "position: absolute; top: " + (t.top - r.viewOffset - qe(e.display)) + "px; height: " + (t.bottom - t.top + je(e) + r.barHeight) + "px; left: " + t.left + "px; width: 2px;");
                e.display.lineSpace.appendChild(o), o.scrollIntoView(i), e.display.lineSpace.removeChild(o)
            }
        }
    }

    function Hr(e, t, r, n) {
        null == n && (n = 0);
        for (var i = 0; 5 > i; i++) {
            var o = !1, l = dt(e, t), a = r && r != t ? dt(e, r) : l,
                s = Wr(e, Math.min(l.left, a.left), Math.min(l.top, a.top) - n, Math.max(l.left, a.left), Math.max(l.bottom, a.bottom) + n),
                u = e.doc.scrollTop, c = e.doc.scrollLeft;
            if (null != s.scrollTop && (rr(e, s.scrollTop), Math.abs(e.doc.scrollTop - u) > 1 && (o = !0)), null != s.scrollLeft && (nr(e, s.scrollLeft), Math.abs(e.doc.scrollLeft - c) > 1 && (o = !0)), !o) break
        }
        return l
    }

    function Er(e, t, r, n, i) {
        var o = Wr(e, t, r, n, i);
        null != o.scrollTop && rr(e, o.scrollTop), null != o.scrollLeft && nr(e, o.scrollLeft)
    }

    function Wr(e, t, r, n, i) {
        var o = e.display, l = vt(e.display);
        0 > r && (r = 0);
        var a = e.curOp && null != e.curOp.scrollTop ? e.curOp.scrollTop : o.scroller.scrollTop, s = Ve(e), u = {};
        i - r > s && (i = r + s);
        var c = e.doc.height + Ue(o), h = l > r, d = i > c - l;
        if (a > r) u.scrollTop = h ? 0 : r; else if (i > a + s) {
            var f = Math.min(r, (d ? c : i) - s);
            f != a && (u.scrollTop = f)
        }
        var p = e.curOp && null != e.curOp.scrollLeft ? e.curOp.scrollLeft : o.scroller.scrollLeft,
            g = $e(e) - (e.options.fixedGutter ? o.gutters.offsetWidth : 0), m = n - t > g;
        return m && (n = t + g), 10 > t ? u.scrollLeft = 0 : p > t ? u.scrollLeft = Math.max(0, t - (m ? 0 : 10)) : n > g + p - 3 && (u.scrollLeft = n + (m ? 0 : 10) - g), u
    }

    function Ir(e, t, r) {
        (null != t || null != r) && Pr(e), null != t && (e.curOp.scrollLeft = (null == e.curOp.scrollLeft ? e.doc.scrollLeft : e.curOp.scrollLeft) + t), null != r && (e.curOp.scrollTop = (null == e.curOp.scrollTop ? e.doc.scrollTop : e.curOp.scrollTop) + r)
    }

    function Fr(e) {
        Pr(e);
        var t = e.getCursor(), r = t, n = t;
        e.options.lineWrapping || (r = t.ch ? Wo(t.line, t.ch - 1) : t, n = Wo(t.line, t.ch + 1)), e.curOp.scrollToPos = {
            from: r,
            to: n,
            margin: e.options.cursorScrollMargin,
            isCursor: !0
        }
    }

    function Pr(e) {
        var t = e.curOp.scrollToPos;
        if (t) {
            e.curOp.scrollToPos = null;
            var r = ft(e, t.from), n = ft(e, t.to),
                i = Wr(e, Math.min(r.left, n.left), Math.min(r.top, n.top) - t.margin, Math.max(r.right, n.right), Math.max(r.bottom, n.bottom) + t.margin);
            e.scrollTo(i.scrollLeft, i.scrollTop)
        }
    }

    function Br(e, t, r, n) {
        var i, o = e.doc;
        null == r && (r = "add"), "smart" == r && (o.mode.indent ? i = Re(e, t) : r = "prev");
        var l = e.options.tabSize, a = Yn(o, t), s = Fl(a.text, null, l);
        a.stateAfter && (a.stateAfter = null);
        var u, c = a.text.match(/^\s*/)[0];
        if (n || /\S/.test(a.text)) {
            if ("smart" == r && (u = o.mode.indent(i, a.text.slice(c.length), a.text), u == Hl || u > 150)) {
                if (!n) return;
                r = "prev"
            }
        } else u = 0, r = "not";
        "prev" == r ? u = t > o.first ? Fl(Yn(o, t - 1).text, null, l) : 0 : "add" == r ? u = s + e.options.indentUnit : "subtract" == r ? u = s - e.options.indentUnit : "number" == typeof r && (u = s + r), u = Math.max(0, u);
        var h = "", d = 0;
        if (e.options.indentWithTabs) for (var f = Math.floor(u / l); f; --f) d += l, h += "	";
        if (u > d && (h += Di(u - d)), h != c) return Dr(o, h, Wo(t, 0), Wo(t, c.length), "+input"), a.stateAfter = null, !0;
        for (var f = 0; f < o.sel.ranges.length; f++) {
            var p = o.sel.ranges[f];
            if (p.head.line == t && p.head.ch < c.length) {
                var d = Wo(t, c.length);
                Ce(o, f, new de(d, d));
                break
            }
        }
    }

    function zr(e, t, r, n) {
        var i = t, o = t;
        return "number" == typeof t ? o = Yn(e, ge(e, t)) : i = ei(t), null == i ? null : (n(o, i) && e.cm && It(e.cm, i, r), o)
    }

    function _r(e, t) {
        for (var r = e.doc.sel.ranges, n = [], i = 0; i < r.length; i++) {
            for (var o = t(r[i]); n.length && Io(o.from, Oi(n).to) <= 0;) {
                var l = n.pop();
                if (Io(l.from, o.from) < 0) {
                    o.from = l.from;
                    break
                }
            }
            n.push(o)
        }
        Nt(e, function () {
            for (var t = n.length - 1; t >= 0; t--) Dr(e.doc, "", n[t].from, n[t].to, "+delete");
            Fr(e)
        })
    }

    function Rr(e, t, r, n, i) {
        function o() {
            var t = a + r;
            return t < e.first || t >= e.first + e.size ? h = !1 : (a = t, c = Yn(e, t))
        }

        function l(e) {
            var t = (i ? co : ho)(c, s, r, !0);
            if (null == t) {
                if (e || !o()) return h = !1;
                s = i ? (0 > r ? no : ro)(c) : 0 > r ? c.text.length : 0
            } else s = t;
            return !0
        }

        var a = t.line, s = t.ch, u = r, c = Yn(e, a), h = !0;
        if ("char" == n) l(); else if ("column" == n) l(!0); else if ("word" == n || "group" == n) for (var d = null, f = "group" == n, p = e.cm && e.cm.getHelper(t, "wordChars"), g = !0; !(0 > r) || l(!g); g = !1) {
            var m = c.text.charAt(s) || "\n",
                v = Bi(m, p) ? "w" : f && "\n" == m ? "n" : !f || /\s/.test(m) ? null : "p";
            if (!f || g || v || (v = "s"), d && d != v) {
                0 > r && (r = 1, l());
                break
            }
            if (v && (d = v), r > 0 && !l(!g)) break
        }
        var y = He(e, Wo(a, s), u, !0);
        return h || (y.hitSide = !0), y
    }

    function qr(e, t, r, n) {
        var i, o = e.doc, l = t.left;
        if ("page" == n) {
            var a = Math.min(e.display.wrapper.clientHeight, window.innerHeight || document.documentElement.clientHeight);
            i = t.top + r * (a - (0 > r ? 1.5 : .5) * vt(e.display))
        } else "line" == n && (i = r > 0 ? t.bottom + 3 : t.top - 3);
        for (; ;) {
            var s = gt(e, l, i);
            if (!s.outside) break;
            if (0 > r ? 0 >= i : i >= o.height) {
                s.hitSide = !0;
                break
            }
            i += 5 * r
        }
        return s
    }

    function Ur(t, r, n, i) {
        e.defaults[t] = r, n && (Zo[t] = i ? function (e, t, r) {
            r != Qo && n(e, t, r)
        } : n)
    }

    function Gr(e) {
        for (var t, r, n, i, o = e.split(/-(?!$)/), e = o[o.length - 1], l = 0; l < o.length - 1; l++) {
            var a = o[l];
            if (/^(cmd|meta|m)$/i.test(a)) i = !0; else if (/^a(lt)?$/i.test(a)) t = !0; else if (/^(c|ctrl|control)$/i.test(a)) r = !0; else {
                if (!/^s(hift)$/i.test(a)) throw new Error("Unrecognized modifier name: " + a);
                n = !0
            }
        }
        return t && (e = "Alt-" + e), r && (e = "Ctrl-" + e), i && (e = "Cmd-" + e), n && (e = "Shift-" + e), e
    }

    function jr(e) {
        return "string" == typeof e ? al[e] : e
    }

    function $r(e, t, r, n, i) {
        if (n && n.shared) return Vr(e, t, r, n, i);
        if (e.cm && !e.cm.curOp) return At(e.cm, $r)(e, t, r, n, i);
        var o = new fl(e, i), l = Io(t, r);
        if (n && Fi(n, o, !1), l > 0 || 0 == l && o.clearWhenEmpty !== !1) return o;
        if (o.replacedWith && (o.collapsed = !0, o.widgetNode = Ri("span", [o.replacedWith], "CodeMirror-widget"), n.handleMouseEvents || o.widgetNode.setAttribute("cm-ignore-events", "true"), n.insertLeft && (o.widgetNode.insertLeft = !0)), o.collapsed) {
            if (mn(e, t.line, t, r, o) || t.line != r.line && mn(e, r.line, t, r, o)) throw new Error("Inserting collapsed marker partially overlapping an existing one");
            Eo = !0
        }
        o.addToHistory && si(e, {from: t, to: r, origin: "markText"}, e.sel, NaN);
        var a, s = t.line, u = e.cm;
        if (e.iter(s, r.line + 1, function (e) {
            u && o.collapsed && !u.options.lineWrapping && vn(e) == u.display.maxLine && (a = !0), o.collapsed && s != t.line && Jn(e, 0), en(e, new Zr(o, s == t.line ? t.ch : null, s == r.line ? r.ch : null)), ++s
        }), o.collapsed && e.iter(t.line, r.line + 1, function (t) {
            wn(e, t) && Jn(t, 0)
        }), o.clearOnEnter && Ml(o, "beforeCursorEnter", function () {
            o.clear()
        }), o.readOnly && (Ho = !0, (e.history.done.length || e.history.undone.length) && e.clearHistory()), o.collapsed && (o.id = ++dl, o.atomic = !0), u) {
            if (a && (u.curOp.updateMaxLine = !0), o.collapsed) Wt(u, t.line, r.line + 1); else if (o.className || o.title || o.startStyle || o.endStyle || o.css) for (var c = t.line; c <= r.line; c++) It(u, c, "text");
            o.atomic && De(u.doc), Ci(u, "markerAdded", u, o)
        }
        return o
    }

    function Vr(e, t, r, n, i) {
        n = Fi(n), n.shared = !1;
        var o = [$r(e, t, r, n, i)], l = o[0], a = n.widgetNode;
        return Kn(e, function (e) {
            a && (n.widgetNode = a.cloneNode(!0)), o.push($r(e, me(e, t), me(e, r), n, i));
            for (var s = 0; s < e.linked.length; ++s) if (e.linked[s].isParent) return;
            l = Oi(o)
        }), new pl(o, l)
    }

    function Kr(e) {
        return e.findMarks(Wo(e.first, 0), e.clipPos(Wo(e.lastLine())), function (e) {
            return e.parent
        })
    }

    function Xr(e, t) {
        for (var r = 0; r < t.length; r++) {
            var n = t[r], i = n.find(), o = e.clipPos(i.from), l = e.clipPos(i.to);
            if (Io(o, l)) {
                var a = $r(e, o, l, n.primary, n.primary.type);
                n.markers.push(a), a.parent = n
            }
        }
    }

    function Yr(e) {
        for (var t = 0; t < e.length; t++) {
            var r = e[t], n = [r.primary.doc];
            Kn(r.primary.doc, function (e) {
                n.push(e)
            });
            for (var i = 0; i < r.markers.length; i++) {
                var o = r.markers[i];
                -1 == Hi(n, o.doc) && (o.parent = null, r.markers.splice(i--, 1))
            }
        }
    }

    function Zr(e, t, r) {
        this.marker = e, this.from = t, this.to = r
    }

    function Qr(e, t) {
        if (e) for (var r = 0; r < e.length; ++r) {
            var n = e[r];
            if (n.marker == t) return n
        }
    }

    function Jr(e, t) {
        for (var r, n = 0; n < e.length; ++n) e[n] != t && (r || (r = [])).push(e[n]);
        return r
    }

    function en(e, t) {
        e.markedSpans = e.markedSpans ? e.markedSpans.concat([t]) : [t], t.marker.attachLine(e)
    }

    function tn(e, t, r) {
        if (e) for (var n, i = 0; i < e.length; ++i) {
            var o = e[i], l = o.marker, a = null == o.from || (l.inclusiveLeft ? o.from <= t : o.from < t);
            if (a || o.from == t && "bookmark" == l.type && (!r || !o.marker.insertLeft)) {
                var s = null == o.to || (l.inclusiveRight ? o.to >= t : o.to > t);
                (n || (n = [])).push(new Zr(l, o.from, s ? null : o.to))
            }
        }
        return n
    }

    function rn(e, t, r) {
        if (e) for (var n, i = 0; i < e.length; ++i) {
            var o = e[i], l = o.marker, a = null == o.to || (l.inclusiveRight ? o.to >= t : o.to > t);
            if (a || o.from == t && "bookmark" == l.type && (!r || o.marker.insertLeft)) {
                var s = null == o.from || (l.inclusiveLeft ? o.from <= t : o.from < t);
                (n || (n = [])).push(new Zr(l, s ? null : o.from - t, null == o.to ? null : o.to - t))
            }
        }
        return n
    }

    function nn(e, t) {
        if (t.full) return null;
        var r = ye(e, t.from.line) && Yn(e, t.from.line).markedSpans,
            n = ye(e, t.to.line) && Yn(e, t.to.line).markedSpans;
        if (!r && !n) return null;
        var i = t.from.ch, o = t.to.ch, l = 0 == Io(t.from, t.to), a = tn(r, i, l), s = rn(n, o, l),
            u = 1 == t.text.length, c = Oi(t.text).length + (u ? i : 0);
        if (a) for (var h = 0; h < a.length; ++h) {
            var d = a[h];
            if (null == d.to) {
                var f = Qr(s, d.marker);
                f ? u && (d.to = null == f.to ? null : f.to + c) : d.to = i
            }
        }
        if (s) for (var h = 0; h < s.length; ++h) {
            var d = s[h];
            if (null != d.to && (d.to += c), null == d.from) {
                var f = Qr(a, d.marker);
                f || (d.from = c, u && (a || (a = [])).push(d))
            } else d.from += c, u && (a || (a = [])).push(d)
        }
        a && (a = on(a)), s && s != a && (s = on(s));
        var p = [a];
        if (!u) {
            var g, m = t.text.length - 2;
            if (m > 0 && a) for (var h = 0; h < a.length; ++h) null == a[h].to && (g || (g = [])).push(new Zr(a[h].marker, null, null));
            for (var h = 0; m > h; ++h) p.push(g);
            p.push(s)
        }
        return p
    }

    function on(e) {
        for (var t = 0; t < e.length; ++t) {
            var r = e[t];
            null != r.from && r.from == r.to && r.marker.clearWhenEmpty !== !1 && e.splice(t--, 1)
        }
        return e.length ? e : null
    }

    function ln(e, t) {
        var r = pi(e, t), n = nn(e, t);
        if (!r) return n;
        if (!n) return r;
        for (var i = 0; i < r.length; ++i) {
            var o = r[i], l = n[i];
            if (o && l) e:for (var a = 0; a < l.length; ++a) {
                for (var s = l[a], u = 0; u < o.length; ++u) if (o[u].marker == s.marker) continue e;
                o.push(s)
            } else l && (r[i] = l)
        }
        return r
    }

    function an(e, t, r) {
        var n = null;
        if (e.iter(t.line, r.line + 1, function (e) {
            if (e.markedSpans) for (var t = 0; t < e.markedSpans.length; ++t) {
                var r = e.markedSpans[t].marker;
                !r.readOnly || n && -1 != Hi(n, r) || (n || (n = [])).push(r)
            }
        }), !n) return null;
        for (var i = [{
            from: t,
            to: r
        }], o = 0; o < n.length; ++o) for (var l = n[o], a = l.find(0), s = 0; s < i.length; ++s) {
            var u = i[s];
            if (!(Io(u.to, a.from) < 0 || Io(u.from, a.to) > 0)) {
                var c = [s, 1], h = Io(u.from, a.from), d = Io(u.to, a.to);
                (0 > h || !l.inclusiveLeft && !h) && c.push({
                    from: u.from,
                    to: a.from
                }), (d > 0 || !l.inclusiveRight && !d) && c.push({
                    from: a.to,
                    to: u.to
                }), i.splice.apply(i, c), s += c.length - 1
            }
        }
        return i
    }

    function sn(e) {
        var t = e.markedSpans;
        if (t) {
            for (var r = 0; r < t.length; ++r) t[r].marker.detachLine(e);
            e.markedSpans = null
        }
    }

    function un(e, t) {
        if (t) {
            for (var r = 0; r < t.length; ++r) t[r].marker.attachLine(e);
            e.markedSpans = t
        }
    }

    function cn(e) {
        return e.inclusiveLeft ? -1 : 0
    }

    function hn(e) {
        return e.inclusiveRight ? 1 : 0
    }

    function dn(e, t) {
        var r = e.lines.length - t.lines.length;
        if (0 != r) return r;
        var n = e.find(), i = t.find(), o = Io(n.from, i.from) || cn(e) - cn(t);
        if (o) return -o;
        var l = Io(n.to, i.to) || hn(e) - hn(t);
        return l ? l : t.id - e.id
    }

    function fn(e, t) {
        var r, n = Eo && e.markedSpans;
        if (n) for (var i, o = 0; o < n.length; ++o) i = n[o], i.marker.collapsed && null == (t ? i.from : i.to) && (!r || dn(r, i.marker) < 0) && (r = i.marker);
        return r
    }

    function pn(e) {
        return fn(e, !0)
    }

    function gn(e) {
        return fn(e, !1)
    }

    function mn(e, t, r, n, i) {
        var o = Yn(e, t), l = Eo && o.markedSpans;
        if (l) for (var a = 0; a < l.length; ++a) {
            var s = l[a];
            if (s.marker.collapsed) {
                var u = s.marker.find(0), c = Io(u.from, r) || cn(s.marker) - cn(i),
                    h = Io(u.to, n) || hn(s.marker) - hn(i);
                if (!(c >= 0 && 0 >= h || 0 >= c && h >= 0) && (0 >= c && (Io(u.to, r) > 0 || s.marker.inclusiveRight && i.inclusiveLeft) || c >= 0 && (Io(u.from, n) < 0 || s.marker.inclusiveLeft && i.inclusiveRight))) return !0
            }
        }
    }

    function vn(e) {
        for (var t; t = pn(e);) e = t.find(-1, !0).line;
        return e
    }

    function yn(e) {
        for (var t, r; t = gn(e);) e = t.find(1, !0).line, (r || (r = [])).push(e);
        return r
    }

    function bn(e, t) {
        var r = Yn(e, t), n = vn(r);
        return r == n ? t : ei(n)
    }

    function xn(e, t) {
        if (t > e.lastLine()) return t;
        var r, n = Yn(e, t);
        if (!wn(e, n)) return t;
        for (; r = gn(n);) n = r.find(1, !0).line;
        return ei(n) + 1
    }

    function wn(e, t) {
        var r = Eo && t.markedSpans;
        if (r) for (var n, i = 0; i < r.length; ++i) if (n = r[i], n.marker.collapsed) {
            if (null == n.from) return !0;
            if (!n.marker.widgetNode && 0 == n.from && n.marker.inclusiveLeft && Sn(e, t, n)) return !0
        }
    }

    function Sn(e, t, r) {
        if (null == r.to) {
            var n = r.marker.find(1, !0);
            return Sn(e, n.line, Qr(n.line.markedSpans, r.marker))
        }
        if (r.marker.inclusiveRight && r.to == t.text.length) return !0;
        for (var i, o = 0; o < t.markedSpans.length; ++o) if (i = t.markedSpans[o], i.marker.collapsed && !i.marker.widgetNode && i.from == r.to && (null == i.to || i.to != r.from) && (i.marker.inclusiveLeft || r.marker.inclusiveRight) && Sn(e, t, i)) return !0
    }

    function Cn(e, t, r) {
        ri(t) < (e.curOp && e.curOp.scrollTop || e.doc.scrollTop) && Ir(e, null, r)
    }

    function kn(e) {
        if (null != e.height) return e.height;
        var t = e.doc.cm;
        if (!t) return 0;
        if (!Gl(document.body, e.node)) {
            var r = "position: relative;";
            e.coverGutter && (r += "margin-left: -" + t.display.gutters.offsetWidth + "px;"), e.noHScroll && (r += "width: " + t.display.wrapper.clientWidth + "px;"), Ui(t.display.measure, Ri("div", [e.node], null, r))
        }
        return e.height = e.node.offsetHeight
    }

    function Ln(e, t, r, n) {
        var i = new gl(e, r, n), o = e.cm;
        return o && i.noHScroll && (o.display.alignWidgets = !0), zr(e, t, "widget", function (t) {
            var r = t.widgets || (t.widgets = []);
            if (null == i.insertAt ? r.push(i) : r.splice(Math.min(r.length - 1, Math.max(0, i.insertAt)), 0, i), i.line = t, o && !wn(e, t)) {
                var n = ri(t) < e.scrollTop;
                Jn(t, t.height + kn(i)), n && Ir(o, null, i.height), o.curOp.forceUpdate = !0
            }
            return !0
        }), i
    }

    function Mn(e, t, r, n) {
        e.text = t, e.stateAfter && (e.stateAfter = null), e.styles && (e.styles = null), null != e.order && (e.order = null), sn(e), un(e, r);
        var i = n ? n(e) : 1;
        i != e.height && Jn(e, i)
    }

    function Tn(e) {
        e.parent = null, sn(e)
    }

    function Nn(e, t) {
        if (e) for (; ;) {
            var r = e.match(/(?:^|\s+)line-(background-)?(\S+)/);
            if (!r) break;
            e = e.slice(0, r.index) + e.slice(r.index + r[0].length);
            var n = r[1] ? "bgClass" : "textClass";
            null == t[n] ? t[n] = r[2] : new RegExp("(?:^|s)" + r[2] + "(?:$|s)").test(t[n]) || (t[n] += " " + r[2])
        }
        return e
    }

    function An(t, r) {
        if (t.blankLine) return t.blankLine(r);
        if (t.innerMode) {
            var n = e.innerMode(t, r);
            return n.mode.blankLine ? n.mode.blankLine(n.state) : void 0
        }
    }

    function Dn(t, r, n, i) {
        for (var o = 0; 10 > o; o++) {
            i && (i[0] = e.innerMode(t, n).mode);
            var l = t.token(r, n);
            if (r.pos > r.start) return l
        }
        throw new Error("Mode " + t.name + " failed to advance stream.")
    }

    function On(e, t, r, n) {
        function i(e) {
            return {start: h.start, end: h.pos, string: h.current(), type: o || null, state: e ? il(l.mode, c) : c}
        }

        var o, l = e.doc, a = l.mode;
        t = me(l, t);
        var s, u = Yn(l, t.line), c = Re(e, t.line, r), h = new hl(u.text, e.options.tabSize);
        for (n && (s = []); (n || h.pos < t.ch) && !h.eol();) h.start = h.pos, o = Dn(a, h, c), n && s.push(i(!0));
        return n ? s : i()
    }

    function Hn(e, t, r, n, i, o, l) {
        var a = r.flattenSpans;
        null == a && (a = e.options.flattenSpans);
        var s, u = 0, c = null, h = new hl(t, e.options.tabSize), d = e.options.addModeClass && [null];
        for ("" == t && Nn(An(r, n), o); !h.eol();) {
            if (h.pos > e.options.maxHighlightLength ? (a = !1, l && In(e, t, n, h.pos), h.pos = t.length, s = null) : s = Nn(Dn(r, h, n, d), o), d) {
                var f = d[0].name;
                f && (s = "m-" + (s ? f + " " + s : f))
            }
            if (!a || c != s) {
                for (; u < h.start;) u = Math.min(h.start, u + 5e4), i(u, c);
                c = s
            }
            h.start = h.pos
        }
        for (; u < h.pos;) {
            var p = Math.min(h.pos, u + 5e4);
            i(p, c), u = p
        }
    }

    function En(e, t, r, n) {
        var i = [e.state.modeGen], o = {};
        Hn(e, t.text, e.doc.mode, r, function (e, t) {
            i.push(e, t)
        }, o, n);
        for (var l = 0; l < e.state.overlays.length; ++l) {
            var a = e.state.overlays[l], s = 1, u = 0;
            Hn(e, t.text, a.mode, !0, function (e, t) {
                for (var r = s; e > u;) {
                    var n = i[s];
                    n > e && i.splice(s, 1, e, i[s + 1], n), s += 2, u = Math.min(e, n)
                }
                if (t) if (a.opaque) i.splice(r, s - r, e, "cm-overlay " + t), s = r + 2; else for (; s > r; r += 2) {
                    var o = i[r + 1];
                    i[r + 1] = (o ? o + " " : "") + "cm-overlay " + t
                }
            }, o)
        }
        return {styles: i, classes: o.bgClass || o.textClass ? o : null}
    }

    function Wn(e, t, r) {
        if (!t.styles || t.styles[0] != e.state.modeGen) {
            var n = Re(e, ei(t)), i = En(e, t, t.text.length > e.options.maxHighlightLength ? il(e.doc.mode, n) : n);
            t.stateAfter = n, t.styles = i.styles, i.classes ? t.styleClasses = i.classes : t.styleClasses && (t.styleClasses = null), r === e.doc.frontier && e.doc.frontier++
        }
        return t.styles
    }

    function In(e, t, r, n) {
        var i = e.doc.mode, o = new hl(t, e.options.tabSize);
        for (o.start = o.pos = n || 0, "" == t && An(i, r); !o.eol();) Dn(i, o, r), o.start = o.pos
    }

    function Fn(e, t) {
        if (!e || /^\s*$/.test(e)) return null;
        var r = t.addModeClass ? yl : vl;
        return r[e] || (r[e] = e.replace(/\S+/g, "cm-$&"))
    }

    function Pn(e, t) {
        var r = Ri("span", null, null, yo ? "padding-right: .1px" : null), n = {
            pre: Ri("pre", [r], "CodeMirror-line"),
            content: r,
            col: 0,
            pos: 0,
            cm: e,
            splitSpaces: (mo || yo) && e.getOption("lineWrapping")
        };
        t.measure = {};
        for (var i = 0; i <= (t.rest ? t.rest.length : 0); i++) {
            var o, l = i ? t.rest[i - 1] : t.line;
            n.pos = 0, n.addToken = zn, Zi(e.display.measure) && (o = ni(l)) && (n.addToken = Rn(n.addToken, o)), n.map = [];
            var a = t != e.display.externalMeasured && ei(l);
            Un(l, n, Wn(e, l, a)), l.styleClasses && (l.styleClasses.bgClass && (n.bgClass = $i(l.styleClasses.bgClass, n.bgClass || "")), l.styleClasses.textClass && (n.textClass = $i(l.styleClasses.textClass, n.textClass || ""))), 0 == n.map.length && n.map.push(0, 0, n.content.appendChild(Yi(e.display.measure))), 0 == i ? (t.measure.map = n.map, t.measure.cache = {}) : ((t.measure.maps || (t.measure.maps = [])).push(n.map), (t.measure.caches || (t.measure.caches = [])).push({}))
        }
        return yo && /\bcm-tab\b/.test(n.content.lastChild.className) && (n.content.className = "cm-tab-wrap-hack"), Al(e, "renderLine", e, t.line, n.pre), n.pre.className && (n.textClass = $i(n.pre.className, n.textClass || "")), n
    }

    function Bn(e) {
        var t = Ri("span", "•", "cm-invalidchar");
        return t.title = "\\u" + e.charCodeAt(0).toString(16), t.setAttribute("aria-label", t.title), t
    }

    function zn(e, t, r, n, i, o, l) {
        if (t) {
            var a = e.splitSpaces ? t.replace(/ {3,}/g, _n) : t, s = e.cm.state.specialChars, u = !1;
            if (s.test(t)) for (var c = document.createDocumentFragment(), h = 0; ;) {
                s.lastIndex = h;
                var d = s.exec(t), f = d ? d.index - h : t.length - h;
                if (f) {
                    var p = document.createTextNode(a.slice(h, h + f));
                    mo && 9 > vo ? c.appendChild(Ri("span", [p])) : c.appendChild(p), e.map.push(e.pos, e.pos + f, p), e.col += f, e.pos += f
                }
                if (!d) break;
                if (h += f + 1, "	" == d[0]) {
                    var g = e.cm.options.tabSize, m = g - e.col % g, p = c.appendChild(Ri("span", Di(m), "cm-tab"));
                    p.setAttribute("role", "presentation"), p.setAttribute("cm-text", "	"), e.col += m
                } else if ("\r" == d[0] || "\n" == d[0]) {
                    var p = c.appendChild(Ri("span", "\r" == d[0] ? "␍" : "␤", "cm-invalidchar"));
                    p.setAttribute("cm-text", d[0]), e.col += 1
                } else {
                    var p = e.cm.options.specialCharPlaceholder(d[0]);
                    p.setAttribute("cm-text", d[0]), mo && 9 > vo ? c.appendChild(Ri("span", [p])) : c.appendChild(p), e.col += 1
                }
                e.map.push(e.pos, e.pos + 1, p), e.pos++
            } else {
                e.col += t.length;
                var c = document.createTextNode(a);
                e.map.push(e.pos, e.pos + t.length, c), mo && 9 > vo && (u = !0), e.pos += t.length
            }
            if (r || n || i || u || l) {
                var v = r || "";
                n && (v += n), i && (v += i);
                var y = Ri("span", [c], v, l);
                return o && (y.title = o), e.content.appendChild(y)
            }
            e.content.appendChild(c)
        }
    }

    function _n(e) {
        for (var t = " ", r = 0; r < e.length - 2; ++r) t += r % 2 ? " " : " ";
        return t += " "
    }

    function Rn(e, t) {
        return function (r, n, i, o, l, a, s) {
            i = i ? i + " cm-force-border" : "cm-force-border";
            for (var u = r.pos, c = u + n.length; ;) {
                for (var h = 0; h < t.length; h++) {
                    var d = t[h];
                    if (d.to > u && d.from <= u) break
                }
                if (d.to >= c) return e(r, n, i, o, l, a, s);
                e(r, n.slice(0, d.to - u), i, o, null, a, s), o = null, n = n.slice(d.to - u), u = d.to
            }
        }
    }

    function qn(e, t, r, n) {
        var i = !n && r.widgetNode;
        i && e.map.push(e.pos, e.pos + t, i), !n && e.cm.display.input.needsContentAttribute && (i || (i = e.content.appendChild(document.createElement("span"))), i.setAttribute("cm-marker", r.id)), i && (e.cm.display.input.setUneditable(i), e.content.appendChild(i)), e.pos += t
    }

    function Un(e, t, r) {
        var n = e.markedSpans, i = e.text, o = 0;
        if (n) for (var l, a, s, u, c, h, d, f = i.length, p = 0, g = 1, m = "", v = 0; ;) {
            if (v == p) {
                s = u = c = h = a = "", d = null, v = 1 / 0;
                for (var y = [], b = 0; b < n.length; ++b) {
                    var x = n[b], w = x.marker;
                    "bookmark" == w.type && x.from == p && w.widgetNode ? y.push(w) : x.from <= p && (null == x.to || x.to > p || w.collapsed && x.to == p && x.from == p) ? (null != x.to && x.to != p && v > x.to && (v = x.to, u = ""), w.className && (s += " " + w.className), w.css && (a = w.css), w.startStyle && x.from == p && (c += " " + w.startStyle), w.endStyle && x.to == v && (u += " " + w.endStyle), w.title && !h && (h = w.title), w.collapsed && (!d || dn(d.marker, w) < 0) && (d = x)) : x.from > p && v > x.from && (v = x.from)
                }
                if (d && (d.from || 0) == p) {
                    if (qn(t, (null == d.to ? f + 1 : d.to) - p, d.marker, null == d.from), null == d.to) return;
                    d.to == p && (d = !1)
                }
                if (!d && y.length) for (var b = 0; b < y.length; ++b) qn(t, 0, y[b])
            }
            if (p >= f) break;
            for (var S = Math.min(f, v); ;) {
                if (m) {
                    var C = p + m.length;
                    if (!d) {
                        var k = C > S ? m.slice(0, S - p) : m;
                        t.addToken(t, k, l ? l + s : s, c, p + k.length == v ? u : "", h, a)
                    }
                    if (C >= S) {
                        m = m.slice(S - p), p = S;
                        break
                    }
                    p = C, c = ""
                }
                m = i.slice(o, o = r[g++]), l = Fn(r[g++], t.cm.options)
            }
        } else for (var g = 1; g < r.length; g += 2) t.addToken(t, i.slice(o, o = r[g]), Fn(r[g + 1], t.cm.options))
    }

    function Gn(e, t) {
        return 0 == t.from.ch && 0 == t.to.ch && "" == Oi(t.text) && (!e.cm || e.cm.options.wholeLineUpdateBefore)
    }

    function jn(e, t, r, n) {
        function i(e) {
            return r ? r[e] : null
        }

        function o(e, r, i) {
            Mn(e, r, i, n), Ci(e, "change", e, t)
        }

        function l(e, t) {
            for (var r = e, o = []; t > r; ++r) o.push(new ml(u[r], i(r), n));
            return o
        }

        var a = t.from, s = t.to, u = t.text, c = Yn(e, a.line), h = Yn(e, s.line), d = Oi(u), f = i(u.length - 1),
            p = s.line - a.line;
        if (t.full) e.insert(0, l(0, u.length)), e.remove(u.length, e.size - u.length); else if (Gn(e, t)) {
            var g = l(0, u.length - 1);
            o(h, h.text, f), p && e.remove(a.line, p), g.length && e.insert(a.line, g)
        } else if (c == h) if (1 == u.length) o(c, c.text.slice(0, a.ch) + d + c.text.slice(s.ch), f); else {
            var g = l(1, u.length - 1);
            g.push(new ml(d + c.text.slice(s.ch), f, n)), o(c, c.text.slice(0, a.ch) + u[0], i(0)), e.insert(a.line + 1, g)
        } else if (1 == u.length) o(c, c.text.slice(0, a.ch) + u[0] + h.text.slice(s.ch), i(0)), e.remove(a.line + 1, p); else {
            o(c, c.text.slice(0, a.ch) + u[0], i(0)), o(h, d + h.text.slice(s.ch), f);
            var g = l(1, u.length - 1);
            p > 1 && e.remove(a.line + 1, p - 1), e.insert(a.line + 1, g)
        }
        Ci(e, "change", e, t)
    }

    function $n(e) {
        this.lines = e, this.parent = null;
        for (var t = 0, r = 0; t < e.length; ++t) e[t].parent = this, r += e[t].height;
        this.height = r
    }

    function Vn(e) {
        this.children = e;
        for (var t = 0, r = 0, n = 0; n < e.length; ++n) {
            var i = e[n];
            t += i.chunkSize(), r += i.height, i.parent = this
        }
        this.size = t, this.height = r, this.parent = null
    }

    function Kn(e, t, r) {
        function n(e, i, o) {
            if (e.linked) for (var l = 0; l < e.linked.length; ++l) {
                var a = e.linked[l];
                if (a.doc != i) {
                    var s = o && a.sharedHist;
                    (!r || s) && (t(a.doc, s), n(a.doc, e, s))
                }
            }
        }

        n(e, null, !0)
    }

    function Xn(e, t) {
        if (t.cm) throw new Error("This document is already in use.");
        e.doc = t, t.cm = e, l(e), r(e), e.options.lineWrapping || d(e), e.options.mode = t.modeOption, Wt(e)
    }

    function Yn(e, t) {
        if (t -= e.first, 0 > t || t >= e.size) throw new Error("There is no line " + (t + e.first) + " in the document.");
        for (var r = e; !r.lines;) for (var n = 0; ; ++n) {
            var i = r.children[n], o = i.chunkSize();
            if (o > t) {
                r = i;
                break
            }
            t -= o
        }
        return r.lines[t]
    }

    function Zn(e, t, r) {
        var n = [], i = t.line;
        return e.iter(t.line, r.line + 1, function (e) {
            var o = e.text;
            i == r.line && (o = o.slice(0, r.ch)), i == t.line && (o = o.slice(t.ch)), n.push(o), ++i
        }), n
    }

    function Qn(e, t, r) {
        var n = [];
        return e.iter(t, r, function (e) {
            n.push(e.text)
        }), n
    }

    function Jn(e, t) {
        var r = t - e.height;
        if (r) for (var n = e; n; n = n.parent) n.height += r
    }

    function ei(e) {
        if (null == e.parent) return null;
        for (var t = e.parent, r = Hi(t.lines, e), n = t.parent; n; t = n, n = n.parent) for (var i = 0; n.children[i] != t; ++i) r += n.children[i].chunkSize();
        return r + t.first
    }

    function ti(e, t) {
        var r = e.first;
        e:do {
            for (var n = 0; n < e.children.length; ++n) {
                var i = e.children[n], o = i.height;
                if (o > t) {
                    e = i;
                    continue e
                }
                t -= o, r += i.chunkSize()
            }
            return r
        } while (!e.lines);
        for (var n = 0; n < e.lines.length; ++n) {
            var l = e.lines[n], a = l.height;
            if (a > t) break;
            t -= a
        }
        return r + n
    }

    function ri(e) {
        e = vn(e);
        for (var t = 0, r = e.parent, n = 0; n < r.lines.length; ++n) {
            var i = r.lines[n];
            if (i == e) break;
            t += i.height
        }
        for (var o = r.parent; o; r = o, o = r.parent) for (var n = 0; n < o.children.length; ++n) {
            var l = o.children[n];
            if (l == r) break;
            t += l.height
        }
        return t
    }

    function ni(e) {
        var t = e.order;
        return null == t && (t = e.order = na(e.text)), t
    }

    function ii(e) {
        this.done = [], this.undone = [], this.undoDepth = 1 / 0, this.lastModTime = this.lastSelTime = 0, this.lastOp = this.lastSelOp = null, this.lastOrigin = this.lastSelOrigin = null, this.generation = this.maxGeneration = e || 1
    }

    function oi(e, t) {
        var r = {from: V(t.from), to: Xo(t), text: Zn(e, t.from, t.to)};
        return di(e, r, t.from.line, t.to.line + 1), Kn(e, function (e) {
            di(e, r, t.from.line, t.to.line + 1)
        }, !0), r
    }

    function li(e) {
        for (; e.length;) {
            var t = Oi(e);
            if (!t.ranges) break;
            e.pop()
        }
    }

    function ai(e, t) {
        return t ? (li(e.done), Oi(e.done)) : e.done.length && !Oi(e.done).ranges ? Oi(e.done) : e.done.length > 1 && !e.done[e.done.length - 2].ranges ? (e.done.pop(), Oi(e.done)) : void 0
    }

    function si(e, t, r, n) {
        var i = e.history;
        i.undone.length = 0;
        var o, l = +new Date;
        if ((i.lastOp == n || i.lastOrigin == t.origin && t.origin && ("+" == t.origin.charAt(0) && e.cm && i.lastModTime > l - e.cm.options.historyEventDelay || "*" == t.origin.charAt(0))) && (o = ai(i, i.lastOp == n))) {
            var a = Oi(o.changes);
            0 == Io(t.from, t.to) && 0 == Io(t.from, a.to) ? a.to = Xo(t) : o.changes.push(oi(e, t))
        } else {
            var s = Oi(i.done);
            for (s && s.ranges || hi(e.sel, i.done), o = {
                changes: [oi(e, t)],
                generation: i.generation
            }, i.done.push(o); i.done.length > i.undoDepth;) i.done.shift(), i.done[0].ranges || i.done.shift()
        }
        i.done.push(r), i.generation = ++i.maxGeneration, i.lastModTime = i.lastSelTime = l, i.lastOp = i.lastSelOp = n, i.lastOrigin = i.lastSelOrigin = t.origin, a || Al(e, "historyAdded")
    }

    function ui(e, t, r, n) {
        var i = t.charAt(0);
        return "*" == i || "+" == i && r.ranges.length == n.ranges.length && r.somethingSelected() == n.somethingSelected() && new Date - e.history.lastSelTime <= (e.cm ? e.cm.options.historyEventDelay : 500)
    }

    function ci(e, t, r, n) {
        var i = e.history, o = n && n.origin;
        r == i.lastSelOp || o && i.lastSelOrigin == o && (i.lastModTime == i.lastSelTime && i.lastOrigin == o || ui(e, o, Oi(i.done), t)) ? i.done[i.done.length - 1] = t : hi(t, i.done), i.lastSelTime = +new Date, i.lastSelOrigin = o, i.lastSelOp = r, n && n.clearRedo !== !1 && li(i.undone)
    }

    function hi(e, t) {
        var r = Oi(t);
        r && r.ranges && r.equals(e) || t.push(e)
    }

    function di(e, t, r, n) {
        var i = t["spans_" + e.id], o = 0;
        e.iter(Math.max(e.first, r), Math.min(e.first + e.size, n), function (r) {
            r.markedSpans && ((i || (i = t["spans_" + e.id] = {}))[o] = r.markedSpans), ++o
        })
    }

    function fi(e) {
        if (!e) return null;
        for (var t, r = 0; r < e.length; ++r) e[r].marker.explicitlyCleared ? t || (t = e.slice(0, r)) : t && t.push(e[r]);
        return t ? t.length ? t : null : e
    }

    function pi(e, t) {
        var r = t["spans_" + e.id];
        if (!r) return null;
        for (var n = 0, i = []; n < t.text.length; ++n) i.push(fi(r[n]));
        return i
    }

    function gi(e, t, r) {
        for (var n = 0, i = []; n < e.length; ++n) {
            var o = e[n];
            if (o.ranges) i.push(r ? he.prototype.deepCopy.call(o) : o); else {
                var l = o.changes, a = [];
                i.push({changes: a});
                for (var s = 0; s < l.length; ++s) {
                    var u, c = l[s];
                    if (a.push({
                        from: c.from,
                        to: c.to,
                        text: c.text
                    }), t) for (var h in c) (u = h.match(/^spans_(\d+)$/)) && Hi(t, Number(u[1])) > -1 && (Oi(a)[h] = c[h], delete c[h])
                }
            }
        }
        return i
    }

    function mi(e, t, r, n) {
        r < e.line ? e.line += n : t < e.line && (e.line = t, e.ch = 0)
    }

    function vi(e, t, r, n) {
        for (var i = 0; i < e.length; ++i) {
            var o = e[i], l = !0;
            if (o.ranges) {
                o.copied || (o = e[i] = o.deepCopy(), o.copied = !0);
                for (var a = 0; a < o.ranges.length; a++) mi(o.ranges[a].anchor, t, r, n), mi(o.ranges[a].head, t, r, n)
            } else {
                for (var a = 0; a < o.changes.length; ++a) {
                    var s = o.changes[a];
                    if (r < s.from.line) s.from = Wo(s.from.line + n, s.from.ch), s.to = Wo(s.to.line + n, s.to.ch); else if (t <= s.to.line) {
                        l = !1;
                        break
                    }
                }
                l || (e.splice(0, i + 1), i = 0)
            }
        }
    }

    function yi(e, t) {
        var r = t.from.line, n = t.to.line, i = t.text.length - (n - r) - 1;
        vi(e.done, r, n, i), vi(e.undone, r, n, i)
    }

    function bi(e) {
        return null != e.defaultPrevented ? e.defaultPrevented : 0 == e.returnValue
    }

    function xi(e) {
        return e.target || e.srcElement
    }

    function wi(e) {
        var t = e.which;
        return null == t && (1 & e.button ? t = 1 : 2 & e.button ? t = 3 : 4 & e.button && (t = 2)), To && e.ctrlKey && 1 == t && (t = 3), t
    }

    function Si(e, t, r) {
        var n = e._handlers && e._handlers[t];
        return r ? n && n.length > 0 ? n.slice() : Tl : n || Tl
    }

    function Ci(e, t) {
        function r(e) {
            return function () {
                e.apply(null, o)
            }
        }

        var n = Si(e, t, !1);
        if (n.length) {
            var i, o = Array.prototype.slice.call(arguments, 2);
            Ro ? i = Ro.delayedCallbacks : Dl ? i = Dl : (i = Dl = [], setTimeout(ki, 0));
            for (var l = 0; l < n.length; ++l) i.push(r(n[l]))
        }
    }

    function ki() {
        var e = Dl;
        Dl = null;
        for (var t = 0; t < e.length; ++t) e[t]()
    }

    function Li(e, t, r) {
        return "string" == typeof t && (t = {
            type: t, preventDefault: function () {
                this.defaultPrevented = !0
            }
        }), Al(e, r || t.type, e, t), bi(t) || t.codemirrorIgnore
    }

    function Mi(e) {
        var t = e._handlers && e._handlers.cursorActivity;
        if (t) for (var r = e.curOp.cursorActivityHandlers || (e.curOp.cursorActivityHandlers = []), n = 0; n < t.length; ++n) -1 == Hi(r, t[n]) && r.push(t[n])
    }

    function Ti(e, t) {
        return Si(e, t).length > 0
    }

    function Ni(e) {
        e.prototype.on = function (e, t) {
            Ml(this, e, t)
        }, e.prototype.off = function (e, t) {
            Nl(this, e, t)
        }
    }

    function Ai() {
        this.id = null
    }

    function Di(e) {
        for (; Bl.length <= e;) Bl.push(Oi(Bl) + " ");
        return Bl[e]
    }

    function Oi(e) {
        return e[e.length - 1]
    }

    function Hi(e, t) {
        for (var r = 0; r < e.length; ++r) if (e[r] == t) return r;
        return -1
    }

    function Ei(e, t) {
        for (var r = [], n = 0; n < e.length; n++) r[n] = t(e[n], n);
        return r
    }

    function Wi() {
    }

    function Ii(e, t) {
        var r;
        return Object.create ? r = Object.create(e) : (Wi.prototype = e, r = new Wi), t && Fi(t, r), r
    }

    function Fi(e, t, r) {
        t || (t = {});
        for (var n in e) !e.hasOwnProperty(n) || r === !1 && t.hasOwnProperty(n) || (t[n] = e[n]);
        return t
    }

    function Pi(e) {
        var t = Array.prototype.slice.call(arguments, 1);
        return function () {
            return e.apply(null, t)
        }
    }

    function Bi(e, t) {
        return t ? t.source.indexOf("\\w") > -1 && ql(e) ? !0 : t.test(e) : ql(e)
    }

    function zi(e) {
        for (var t in e) if (e.hasOwnProperty(t) && e[t]) return !1;
        return !0
    }

    function _i(e) {
        return e.charCodeAt(0) >= 768 && Ul.test(e)
    }

    function Ri(e, t, r, n) {
        var i = document.createElement(e);
        if (r && (i.className = r), n && (i.style.cssText = n), "string" == typeof t) i.appendChild(document.createTextNode(t)); else if (t) for (var o = 0; o < t.length; ++o) i.appendChild(t[o]);
        return i
    }

    function qi(e) {
        for (var t = e.childNodes.length; t > 0; --t) e.removeChild(e.firstChild);
        return e
    }

    function Ui(e, t) {
        return qi(e).appendChild(t)
    }

    function Gi() {
        for (var e = document.activeElement; e && e.root && e.root.activeElement;) e = e.root.activeElement;
        return e
    }

    function ji(e) {
        return new RegExp("(^|\\s)" + e + "(?:$|\\s)\\s*")
    }

    function $i(e, t) {
        for (var r = e.split(" "), n = 0; n < r.length; n++) r[n] && !ji(r[n]).test(t) && (t += " " + r[n]);
        return t
    }

    function Vi(e) {
        if (document.body.getElementsByClassName) for (var t = document.body.getElementsByClassName("CodeMirror"), r = 0; r < t.length; r++) {
            var n = t[r].CodeMirror;
            n && e(n)
        }
    }

    function Ki() {
        Xl || (Xi(), Xl = !0)
    }

    function Xi() {
        var e;
        Ml(window, "resize", function () {
            null == e && (e = setTimeout(function () {
                e = null, Vi(Ut)
            }, 100))
        }), Ml(window, "blur", function () {
            Vi(mr)
        })
    }

    function Yi(e) {
        if (null == jl) {
            var t = Ri("span", "​");
            Ui(e, Ri("span", [t, document.createTextNode("x")])), 0 != e.firstChild.offsetHeight && (jl = t.offsetWidth <= 1 && t.offsetHeight > 2 && !(mo && 8 > vo))
        }
        var r = jl ? Ri("span", "​") : Ri("span", " ", null, "display: inline-block; width: 1px; margin-right: -1px");
        return r.setAttribute("cm-text", ""), r
    }

    function Zi(e) {
        if (null != $l) return $l;
        var t = Ui(e, document.createTextNode("AخA")), r = _l(t, 0, 1).getBoundingClientRect();
        if (!r || r.left == r.right) return !1;
        var n = _l(t, 1, 2).getBoundingClientRect();
        return $l = n.right - r.right < 3
    }

    function Qi(e) {
        if (null != ea) return ea;
        var t = Ui(e, Ri("span", "x")), r = t.getBoundingClientRect(), n = _l(t, 0, 1).getBoundingClientRect();
        return ea = Math.abs(r.left - n.left) > 1
    }

    function Ji(e, t, r, n) {
        if (!e) return n(t, r, "ltr");
        for (var i = !1, o = 0; o < e.length; ++o) {
            var l = e[o];
            (l.from < r && l.to > t || t == r && l.to == t) && (n(Math.max(l.from, t), Math.min(l.to, r), 1 == l.level ? "rtl" : "ltr"), i = !0)
        }
        i || n(t, r, "ltr")
    }

    function eo(e) {
        return e.level % 2 ? e.to : e.from
    }

    function to(e) {
        return e.level % 2 ? e.from : e.to
    }

    function ro(e) {
        var t = ni(e);
        return t ? eo(t[0]) : 0
    }

    function no(e) {
        var t = ni(e);
        return t ? to(Oi(t)) : e.text.length
    }

    function io(e, t) {
        var r = Yn(e.doc, t), n = vn(r);
        n != r && (t = ei(n));
        var i = ni(n), o = i ? i[0].level % 2 ? no(n) : ro(n) : 0;
        return Wo(t, o)
    }

    function oo(e, t) {
        for (var r, n = Yn(e.doc, t); r = gn(n);) n = r.find(1, !0).line, t = null;
        var i = ni(n), o = i ? i[0].level % 2 ? ro(n) : no(n) : n.text.length;
        return Wo(null == t ? ei(n) : t, o)
    }

    function lo(e, t) {
        var r = io(e, t.line), n = Yn(e.doc, r.line), i = ni(n);
        if (!i || 0 == i[0].level) {
            var o = Math.max(0, n.text.search(/\S/)), l = t.line == r.line && t.ch <= o && t.ch;
            return Wo(r.line, l ? 0 : o)
        }
        return r
    }

    function ao(e, t, r) {
        var n = e[0].level;
        return t == n ? !0 : r == n ? !1 : r > t
    }

    function so(e, t) {
        ra = null;
        for (var r, n = 0; n < e.length; ++n) {
            var i = e[n];
            if (i.from < t && i.to > t) return n;
            if (i.from == t || i.to == t) {
                if (null != r) return ao(e, i.level, e[r].level) ? (i.from != i.to && (ra = r), n) : (i.from != i.to && (ra = n), r);
                r = n
            }
        }
        return r
    }

    function uo(e, t, r, n) {
        if (!n) return t + r;
        do t += r; while (t > 0 && _i(e.text.charAt(t)));
        return t
    }

    function co(e, t, r, n) {
        var i = ni(e);
        if (!i) return ho(e, t, r, n);
        for (var o = so(i, t), l = i[o], a = uo(e, t, l.level % 2 ? -r : r, n); ;) {
            if (a > l.from && a < l.to) return a;
            if (a == l.from || a == l.to) return so(i, a) == o ? a : (l = i[o += r], r > 0 == l.level % 2 ? l.to : l.from);
            if (l = i[o += r], !l) return null;
            a = r > 0 == l.level % 2 ? uo(e, l.to, -1, n) : uo(e, l.from, 1, n)
        }
    }

    function ho(e, t, r, n) {
        var i = t + r;
        if (n) for (; i > 0 && _i(e.text.charAt(i));) i += r;
        return 0 > i || i > e.text.length ? null : i
    }

    var fo = /gecko\/\d/i.test(navigator.userAgent), po = /MSIE \d/.test(navigator.userAgent),
        go = /Trident\/(?:[7-9]|\d{2,})\..*rv:(\d+)/.exec(navigator.userAgent), mo = po || go,
        vo = mo && (po ? document.documentMode || 6 : go[1]), yo = /WebKit\//.test(navigator.userAgent),
        bo = yo && /Qt\/\d+\.\d+/.test(navigator.userAgent), xo = /Chrome\//.test(navigator.userAgent),
        wo = /Opera\//.test(navigator.userAgent), So = /Apple Computer/.test(navigator.vendor),
        Co = /Mac OS X 1\d\D([8-9]|\d\d)\D/.test(navigator.userAgent), ko = /PhantomJS/.test(navigator.userAgent),
        Lo = /AppleWebKit/.test(navigator.userAgent) && /Mobile\/\w+/.test(navigator.userAgent),
        Mo = Lo || /Android|webOS|BlackBerry|Opera Mini|Opera Mobi|IEMobile/i.test(navigator.userAgent),
        To = Lo || /Mac/.test(navigator.platform), No = /win/i.test(navigator.platform),
        Ao = wo && navigator.userAgent.match(/Version\/(\d*\.\d*)/);
    Ao && (Ao = Number(Ao[1])), Ao && Ao >= 15 && (wo = !1, yo = !0);
    var Do = To && (bo || wo && (null == Ao || 12.11 > Ao)), Oo = fo || mo && vo >= 9, Ho = !1, Eo = !1;
    g.prototype = Fi({
        update: function (e) {
            var t = e.scrollWidth > e.clientWidth + 1, r = e.scrollHeight > e.clientHeight + 1, n = e.nativeBarWidth;
            if (r) {
                this.vert.style.display = "block", this.vert.style.bottom = t ? n + "px" : "0";
                var i = e.viewHeight - (t ? n : 0);
                this.vert.firstChild.style.height = Math.max(0, e.scrollHeight - e.clientHeight + i) + "px"
            } else this.vert.style.display = "", this.vert.firstChild.style.height = "0";
            if (t) {
                this.horiz.style.display = "block", this.horiz.style.right = r ? n + "px" : "0", this.horiz.style.left = e.barLeft + "px";
                var o = e.viewWidth - e.barLeft - (r ? n : 0);
                this.horiz.firstChild.style.width = e.scrollWidth - e.clientWidth + o + "px"
            } else this.horiz.style.display = "", this.horiz.firstChild.style.width = "0";
            return !this.checkedOverlay && e.clientHeight > 0 && (0 == n && this.overlayHack(), this.checkedOverlay = !0), {
                right: r ? n : 0,
                bottom: t ? n : 0
            }
        }, setScrollLeft: function (e) {
            this.horiz.scrollLeft != e && (this.horiz.scrollLeft = e)
        }, setScrollTop: function (e) {
            this.vert.scrollTop != e && (this.vert.scrollTop = e)
        }, overlayHack: function () {
            var e = To && !Co ? "12px" : "18px";
            this.horiz.style.minHeight = this.vert.style.minWidth = e;
            var t = this, r = function (e) {
                xi(e) != t.vert && xi(e) != t.horiz && At(t.cm, $t)(e)
            };
            Ml(this.vert, "mousedown", r), Ml(this.horiz, "mousedown", r)
        }, clear: function () {
            var e = this.horiz.parentNode;
            e.removeChild(this.horiz), e.removeChild(this.vert)
        }
    }, g.prototype), m.prototype = Fi({
        update: function () {
            return {bottom: 0, right: 0}
        }, setScrollLeft: function () {
        }, setScrollTop: function () {
        }, clear: function () {
        }
    }, m.prototype), e.scrollbarModel = {"native": g, "null": m}, L.prototype.signal = function (e, t) {
        Ti(e, t) && this.events.push(arguments)
    }, L.prototype.finish = function () {
        for (var e = 0; e < this.events.length; e++) Al.apply(null, this.events[e])
    };
    var Wo = e.Pos = function (e, t) {
        return this instanceof Wo ? (this.line = e, void (this.ch = t)) : new Wo(e, t)
    }, Io = e.cmpPos = function (e, t) {
        return e.line - t.line || e.ch - t.ch
    }, Fo = null;
    ne.prototype = Fi({
        init: function (e) {
            function t(e) {
                if (n.somethingSelected()) Fo = n.getSelections(), r.inaccurateSelection && (r.prevInput = "", r.inaccurateSelection = !1, o.value = Fo.join("\n"), zl(o)); else {
                    if (!n.options.lineWiseCopyCut) return;
                    var t = te(n);
                    Fo = t.text, "cut" == e.type ? n.setSelections(t.ranges, null, El) : (r.prevInput = "", o.value = t.text.join("\n"), zl(o))
                }
                "cut" == e.type && (n.state.cutIncoming = !0)
            }

            var r = this, n = this.cm, i = this.wrapper = ie(), o = this.textarea = i.firstChild;
            e.wrapper.insertBefore(i, e.wrapper.firstChild), Lo && (o.style.width = "0px"), Ml(o, "input", function () {
                mo && vo >= 9 && r.hasSelection && (r.hasSelection = null), r.poll()
            }), Ml(o, "paste", function (e) {
                return J(e, n) ? !0 : (n.state.pasteIncoming = !0, void r.fastPoll())
            }), Ml(o, "cut", t), Ml(o, "copy", t), Ml(e.scroller, "paste", function (t) {
                Gt(e, t) || (n.state.pasteIncoming = !0, r.focus())
            }), Ml(e.lineSpace, "selectstart", function (t) {
                Gt(e, t) || Cl(t)
            }), Ml(o, "compositionstart", function () {
                var e = n.getCursor("from");
                r.composing && r.composing.range.clear(), r.composing = {
                    start: e,
                    range: n.markText(e, n.getCursor("to"), {className: "CodeMirror-composing"})
                }
            }), Ml(o, "compositionend", function () {
                r.composing && (r.poll(), r.composing.range.clear(), r.composing = null)
            })
        }, prepareSelection: function () {
            var e = this.cm, t = e.display, r = e.doc, n = We(e);
            if (e.options.moveInputWithCursor) {
                var i = dt(e, r.sel.primary().head, "div"), o = t.wrapper.getBoundingClientRect(),
                    l = t.lineDiv.getBoundingClientRect();
                n.teTop = Math.max(0, Math.min(t.wrapper.clientHeight - 10, i.top + l.top - o.top)), n.teLeft = Math.max(0, Math.min(t.wrapper.clientWidth - 10, i.left + l.left - o.left))
            }
            return n
        }, showSelection: function (e) {
            var t = this.cm, r = t.display;
            Ui(r.cursorDiv, e.cursors), Ui(r.selectionDiv, e.selection), null != e.teTop && (this.wrapper.style.top = e.teTop + "px", this.wrapper.style.left = e.teLeft + "px")
        }, reset: function (e) {
            if (!this.contextMenuPending) {
                var t, r, n = this.cm, i = n.doc;
                if (n.somethingSelected()) {
                    this.prevInput = "";
                    var o = i.sel.primary();
                    t = Jl && (o.to().line - o.from().line > 100 || (r = n.getSelection()).length > 1e3);
                    var l = t ? "-" : r || n.getSelection();
                    this.textarea.value = l, n.state.focused && zl(this.textarea), mo && vo >= 9 && (this.hasSelection = l)
                } else e || (this.prevInput = this.textarea.value = "", mo && vo >= 9 && (this.hasSelection = null));
                this.inaccurateSelection = t
            }
        }, getField: function () {
            return this.textarea
        }, supportsTouch: function () {
            return !1
        }, focus: function () {
            if ("nocursor" != this.cm.options.readOnly && (!Mo || Gi() != this.textarea)) try {
                this.textarea.focus()
            } catch (e) {
            }
        }, blur: function () {
            this.textarea.blur()
        }, resetPosition: function () {
            this.wrapper.style.top = this.wrapper.style.left = 0
        }, receivedFocus: function () {
            this.slowPoll()
        }, slowPoll: function () {
            var e = this;
            e.pollingFast || e.polling.set(this.cm.options.pollInterval, function () {
                e.poll(), e.cm.state.focused && e.slowPoll()
            })
        }, fastPoll: function () {
            function e() {
                var n = r.poll();
                n || t ? (r.pollingFast = !1, r.slowPoll()) : (t = !0, r.polling.set(60, e))
            }

            var t = !1, r = this;
            r.pollingFast = !0, r.polling.set(20, e)
        }, poll: function () {
            var e = this.cm, t = this.textarea, r = this.prevInput;
            if (this.contextMenuPending || !e.state.focused || Ql(t) && !r && !this.composing || Z(e) || e.options.disableInput || e.state.keySeq) return !1;
            var n = t.value;
            if (n == r && !e.somethingSelected()) return !1;
            if (mo && vo >= 9 && this.hasSelection === n || To && /[\uf700-\uf7ff]/.test(n)) return e.display.input.reset(), !1;
            if (e.doc.sel == e.display.selForContextMenu) {
                var i = n.charCodeAt(0);
                if (8203 != i || r || (r = "​"), 8666 == i) return this.reset(), this.cm.execCommand("undo")
            }
            for (var o = 0, l = Math.min(r.length, n.length); l > o && r.charCodeAt(o) == n.charCodeAt(o);) ++o;
            var a = this;
            return Nt(e, function () {
                Q(e, n.slice(o), r.length - o, null, a.composing ? "*compose" : null), n.length > 1e3 || n.indexOf("\n") > -1 ? t.value = a.prevInput = "" : a.prevInput = n, a.composing && (a.composing.range.clear(), a.composing.range = e.markText(a.composing.start, e.getCursor("to"), {className: "CodeMirror-composing"}))
            }), !0
        }, ensurePolled: function () {
            this.pollingFast && this.poll() && (this.pollingFast = !1)
        }, onKeyPress: function () {
            mo && vo >= 9 && (this.hasSelection = null), this.fastPoll()
        }, onContextMenu: function (e) {
            function t() {
                if (null != l.selectionStart) {
                    var e = i.somethingSelected(), t = "​" + (e ? l.value : "");
                    l.value = "⇚", l.value = t, n.prevInput = e ? "" : "​", l.selectionStart = 1, l.selectionEnd = t.length, o.selForContextMenu = i.doc.sel
                }
            }

            function r() {
                if (n.contextMenuPending = !1, n.wrapper.style.position = "relative", l.style.cssText = c, mo && 9 > vo && o.scrollbars.setScrollTop(o.scroller.scrollTop = s), null != l.selectionStart) {
                    (!mo || mo && 9 > vo) && t();
                    var e = 0, r = function () {
                        o.selForContextMenu == i.doc.sel && 0 == l.selectionStart && l.selectionEnd > 0 && "​" == n.prevInput ? At(i, ll.selectAll)(i) : e++ < 10 ? o.detectingSelectAll = setTimeout(r, 500) : o.input.reset()
                    };
                    o.detectingSelectAll = setTimeout(r, 200)
                }
            }

            var n = this, i = n.cm, o = i.display, l = n.textarea, a = jt(i, e), s = o.scroller.scrollTop;
            if (a && !wo) {
                var u = i.options.resetSelectionOnContextMenu;
                u && -1 == i.doc.sel.contains(a) && At(i, Te)(i.doc, pe(a), El);
                var c = l.style.cssText;
                if (n.wrapper.style.position = "absolute", l.style.cssText = "position: fixed; width: 30px; height: 30px; top: " + (e.clientY - 5) + "px; left: " + (e.clientX - 5) + "px; z-index: 1000; background: " + (mo ? "rgba(255, 255, 255, .05)" : "transparent") + "; outline: none; border-width: 0; outline: none; overflow: hidden; opacity: .05; filter: alpha(opacity=5);", yo) var h = window.scrollY;
                if (o.input.focus(), yo && window.scrollTo(null, h), o.input.reset(), i.somethingSelected() || (l.value = n.prevInput = " "), n.contextMenuPending = !0, o.selForContextMenu = i.doc.sel, clearTimeout(o.detectingSelectAll), mo && vo >= 9 && t(), Oo) {
                    Ll(e);
                    var d = function () {
                        Nl(window, "mouseup", d), setTimeout(r, 20)
                    };
                    Ml(window, "mouseup", d)
                } else setTimeout(r, 50)
            }
        }, readOnlyChanged: function (e) {
            e || this.reset()
        }, setUneditable: Wi, needsContentAttribute: !1
    }, ne.prototype), oe.prototype = Fi({
        init: function (e) {
            function t(e) {
                if (n.somethingSelected()) Fo = n.getSelections(), "cut" == e.type && n.replaceSelection("", null, "cut"); else {
                    if (!n.options.lineWiseCopyCut) return;
                    var t = te(n);
                    Fo = t.text, "cut" == e.type && n.operation(function () {
                        n.setSelections(t.ranges, 0, El), n.replaceSelection("", null, "cut")
                    })
                }
                if (e.clipboardData && !Lo) e.preventDefault(), e.clipboardData.clearData(), e.clipboardData.setData("text/plain", Fo.join("\n")); else {
                    var r = ie(), i = r.firstChild;
                    n.display.lineSpace.insertBefore(r, n.display.lineSpace.firstChild), i.value = Fo.join("\n");
                    var o = document.activeElement;
                    zl(i), setTimeout(function () {
                        n.display.lineSpace.removeChild(r), o.focus()
                    }, 50)
                }
            }

            var r = this, n = r.cm, i = r.div = e.lineDiv;
            re(i), Ml(i, "paste", function (e) {
                J(e, n)
            }), Ml(i, "compositionstart", function (e) {
                var t = e.data;
                if (r.composing = {sel: n.doc.sel, data: t, startData: t}, t) {
                    var i = n.doc.sel.primary(), o = n.getLine(i.head.line),
                        l = o.indexOf(t, Math.max(0, i.head.ch - t.length));
                    l > -1 && l <= i.head.ch && (r.composing.sel = pe(Wo(i.head.line, l), Wo(i.head.line, l + t.length)))
                }
            }), Ml(i, "compositionupdate", function (e) {
                r.composing.data = e.data
            }), Ml(i, "compositionend", function (e) {
                var t = r.composing;
                t && (e.data == t.startData || /\u200b/.test(e.data) || (t.data = e.data), setTimeout(function () {
                    t.handled || r.applyComposition(t), r.composing == t && (r.composing = null)
                }, 50))
            }), Ml(i, "touchstart", function () {
                r.forceCompositionEnd()
            }), Ml(i, "input", function () {
                r.composing || (Z(n) || !r.pollContent()) && Nt(r.cm, function () {
                    Wt(n)
                })
            }), Ml(i, "copy", t), Ml(i, "cut", t)
        }, prepareSelection: function () {
            var e = We(this.cm, !1);
            return e.focus = this.cm.state.focused, e
        }, showSelection: function (e) {
            e && this.cm.display.view.length && (e.focus && this.showPrimarySelection(), this.showMultipleSelections(e))
        }, showPrimarySelection: function () {
            var e = window.getSelection(), t = this.cm.doc.sel.primary(), r = se(this.cm, e.anchorNode, e.anchorOffset),
                n = se(this.cm, e.focusNode, e.focusOffset);
            if (!r || r.bad || !n || n.bad || 0 != Io(X(r, n), t.from()) || 0 != Io(K(r, n), t.to())) {
                var i = le(this.cm, t.from()), o = le(this.cm, t.to());
                if (i || o) {
                    var l = this.cm.display.view, a = e.rangeCount && e.getRangeAt(0);
                    if (i) {
                        if (!o) {
                            var s = l[l.length - 1].measure, u = s.maps ? s.maps[s.maps.length - 1] : s.map;
                            o = {node: u[u.length - 1], offset: u[u.length - 2] - u[u.length - 3]}
                        }
                    } else i = {node: l[0].measure.map[2], offset: 0};
                    try {
                        var c = _l(i.node, i.offset, o.offset, o.node)
                    } catch (h) {
                    }
                    c && (e.removeAllRanges(), e.addRange(c), a && null == e.anchorNode ? e.addRange(a) : fo && this.startGracePeriod()), this.rememberSelection()
                }
            }
        }, startGracePeriod: function () {
            var e = this;
            clearTimeout(this.gracePeriod), this.gracePeriod = setTimeout(function () {
                e.gracePeriod = !1, e.selectionChanged() && e.cm.operation(function () {
                    e.cm.curOp.selectionChanged = !0
                })
            }, 20)
        }, showMultipleSelections: function (e) {
            Ui(this.cm.display.cursorDiv, e.cursors), Ui(this.cm.display.selectionDiv, e.selection)
        }, rememberSelection: function () {
            var e = window.getSelection();
            this.lastAnchorNode = e.anchorNode, this.lastAnchorOffset = e.anchorOffset, this.lastFocusNode = e.focusNode, this.lastFocusOffset = e.focusOffset
        }, selectionInEditor: function () {
            var e = window.getSelection();
            if (!e.rangeCount) return !1;
            var t = e.getRangeAt(0).commonAncestorContainer;
            return Gl(this.div, t)
        }, focus: function () {
            "nocursor" != this.cm.options.readOnly && this.div.focus()
        }, blur: function () {
            this.div.blur()
        }, getField: function () {
            return this.div
        }, supportsTouch: function () {
            return !0
        }, receivedFocus: function () {
            function e() {
                t.cm.state.focused && (t.pollSelection(), t.polling.set(t.cm.options.pollInterval, e))
            }

            var t = this;
            this.selectionInEditor() ? this.pollSelection() : Nt(this.cm, function () {
                t.cm.curOp.selectionChanged = !0
            }), this.polling.set(this.cm.options.pollInterval, e)
        }, selectionChanged: function () {
            var e = window.getSelection();
            return e.anchorNode != this.lastAnchorNode || e.anchorOffset != this.lastAnchorOffset || e.focusNode != this.lastFocusNode || e.focusOffset != this.lastFocusOffset
        }, pollSelection: function () {
            if (!this.composing && !this.gracePeriod && this.selectionChanged()) {
                var e = window.getSelection(), t = this.cm;
                this.rememberSelection();
                var r = se(t, e.anchorNode, e.anchorOffset), n = se(t, e.focusNode, e.focusOffset);
                r && n && Nt(t, function () {
                    Te(t.doc, pe(r, n), El), (r.bad || n.bad) && (t.curOp.selectionChanged = !0)
                })
            }
        }, pollContent: function () {
            var e = this.cm, t = e.display, r = e.doc.sel.primary(), n = r.from(), i = r.to();
            if (n.line < t.viewFrom || i.line > t.viewTo - 1) return !1;
            var o;
            if (n.line == t.viewFrom || 0 == (o = Pt(e, n.line))) var l = ei(t.view[0].line),
                a = t.view[0].node; else var l = ei(t.view[o].line), a = t.view[o - 1].node.nextSibling;
            var s = Pt(e, i.line);
            if (s == t.view.length - 1) var u = t.viewTo - 1,
                c = t.lineDiv.lastChild; else var u = ei(t.view[s + 1].line) - 1,
                c = t.view[s + 1].node.previousSibling;
            for (var h = e.doc.splitLines(ce(e, a, c, l, u)), d = Zn(e.doc, Wo(l, 0), Wo(u, Yn(e.doc, u).text.length)); h.length > 1 && d.length > 1;) if (Oi(h) == Oi(d)) h.pop(), d.pop(), u--; else {
                if (h[0] != d[0]) break;
                h.shift(), d.shift(), l++
            }
            for (var f = 0, p = 0, g = h[0], m = d[0], v = Math.min(g.length, m.length); v > f && g.charCodeAt(f) == m.charCodeAt(f);) ++f;
            for (var y = Oi(h), b = Oi(d), x = Math.min(y.length - (1 == h.length ? f : 0), b.length - (1 == d.length ? f : 0)); x > p && y.charCodeAt(y.length - p - 1) == b.charCodeAt(b.length - p - 1);) ++p;
            h[h.length - 1] = y.slice(0, y.length - p), h[0] = h[0].slice(f);
            var w = Wo(l, f), S = Wo(u, d.length ? Oi(d).length - p : 0);
            return h.length > 1 || h[0] || Io(w, S) ? (Dr(e.doc, h, w, S, "+input"), !0) : void 0
        }, ensurePolled: function () {
            this.forceCompositionEnd()
        }, reset: function () {
            this.forceCompositionEnd()
        }, forceCompositionEnd: function () {
            this.composing && !this.composing.handled && (this.applyComposition(this.composing), this.composing.handled = !0, this.div.blur(), this.div.focus())
        }, applyComposition: function (e) {
            Z(this.cm) ? At(this.cm, Wt)(this.cm) : e.data && e.data != e.startData && At(this.cm, Q)(this.cm, e.data, 0, e.sel)
        }, setUneditable: function (e) {
            e.contentEditable = "false"
        }, onKeyPress: function (e) {
            e.preventDefault(), Z(this.cm) || At(this.cm, Q)(this.cm, String.fromCharCode(null == e.charCode ? e.keyCode : e.charCode), 0)
        }, readOnlyChanged: function (e) {
            this.div.contentEditable = String("nocursor" != e)
        }, onContextMenu: Wi, resetPosition: Wi, needsContentAttribute: !0
    }, oe.prototype), e.inputStyles = {textarea: ne, contenteditable: oe}, he.prototype = {
        primary: function () {
            return this.ranges[this.primIndex]
        }, equals: function (e) {
            if (e == this) return !0;
            if (e.primIndex != this.primIndex || e.ranges.length != this.ranges.length) return !1;
            for (var t = 0; t < this.ranges.length; t++) {
                var r = this.ranges[t], n = e.ranges[t];
                if (0 != Io(r.anchor, n.anchor) || 0 != Io(r.head, n.head)) return !1
            }
            return !0
        }, deepCopy: function () {
            for (var e = [], t = 0; t < this.ranges.length; t++) e[t] = new de(V(this.ranges[t].anchor), V(this.ranges[t].head));
            return new he(e, this.primIndex)
        }, somethingSelected: function () {
            for (var e = 0; e < this.ranges.length; e++) if (!this.ranges[e].empty()) return !0;
            return !1
        }, contains: function (e, t) {
            t || (t = e);
            for (var r = 0; r < this.ranges.length; r++) {
                var n = this.ranges[r];
                if (Io(t, n.from()) >= 0 && Io(e, n.to()) <= 0) return r
            }
            return -1
        }
    }, de.prototype = {
        from: function () {
            return X(this.anchor, this.head)
        }, to: function () {
            return K(this.anchor, this.head)
        }, empty: function () {
            return this.head.line == this.anchor.line && this.head.ch == this.anchor.ch
        }
    };
    var Po, Bo, zo, _o = {left: 0, right: 0, top: 0, bottom: 0}, Ro = null, qo = 0, Uo = 0, Go = 0, jo = null;
    mo ? jo = -.53 : fo ? jo = 15 : xo ? jo = -.7 : So && (jo = -1 / 3);
    var $o = function (e) {
        var t = e.wheelDeltaX, r = e.wheelDeltaY;
        return null == t && e.detail && e.axis == e.HORIZONTAL_AXIS && (t = e.detail), null == r && e.detail && e.axis == e.VERTICAL_AXIS ? r = e.detail : null == r && (r = e.wheelDelta), {
            x: t,
            y: r
        }
    };
    e.wheelEventPixels = function (e) {
        var t = $o(e);
        return t.x *= jo, t.y *= jo, t
    };
    var Vo = new Ai, Ko = null, Xo = e.changeEnd = function (e) {
        return e.text ? Wo(e.from.line + e.text.length - 1, Oi(e.text).length + (1 == e.text.length ? e.from.ch : 0)) : e.to
    };
    e.prototype = {
        constructor: e, focus: function () {
            window.focus(), this.display.input.focus()
        }, setOption: function (e, t) {
            var r = this.options, n = r[e];
            (r[e] != t || "mode" == e) && (r[e] = t, Zo.hasOwnProperty(e) && At(this, Zo[e])(this, t, n))
        }, getOption: function (e) {
            return this.options[e]
        }, getDoc: function () {
            return this.doc
        }, addKeyMap: function (e, t) {
            this.state.keyMaps[t ? "push" : "unshift"](jr(e))
        }, removeKeyMap: function (e) {
            for (var t = this.state.keyMaps, r = 0; r < t.length; ++r) if (t[r] == e || t[r].name == e) return t.splice(r, 1), !0
        }, addOverlay: Dt(function (t, r) {
            var n = t.token ? t : e.getMode(this.options, t);
            if (n.startState) throw new Error("Overlays may not be stateful.");
            this.state.overlays.push({mode: n, modeSpec: t, opaque: r && r.opaque}), this.state.modeGen++, Wt(this)
        }), removeOverlay: Dt(function (e) {
            for (var t = this.state.overlays, r = 0; r < t.length; ++r) {
                var n = t[r].modeSpec;
                if (n == e || "string" == typeof e && n.name == e) return t.splice(r, 1), this.state.modeGen++, void Wt(this)
            }
        }), indentLine: Dt(function (e, t, r) {
            "string" != typeof t && "number" != typeof t && (t = null == t ? this.options.smartIndent ? "smart" : "prev" : t ? "add" : "subtract"), ye(this.doc, e) && Br(this, e, t, r)
        }), indentSelection: Dt(function (e) {
            for (var t = this.doc.sel.ranges, r = -1, n = 0; n < t.length; n++) {
                var i = t[n];
                if (i.empty()) i.head.line > r && (Br(this, i.head.line, e, !0), r = i.head.line, n == this.doc.sel.primIndex && Fr(this)); else {
                    var o = i.from(), l = i.to(), a = Math.max(r, o.line);
                    r = Math.min(this.lastLine(), l.line - (l.ch ? 0 : 1)) + 1;
                    for (var s = a; r > s; ++s) Br(this, s, e);
                    var u = this.doc.sel.ranges;
                    0 == o.ch && t.length == u.length && u[n].from().ch > 0 && Ce(this.doc, n, new de(o, u[n].to()), El)
                }
            }
        }), getTokenAt: function (e, t) {
            return On(this, e, t)
        }, getLineTokens: function (e, t) {
            return On(this, Wo(e), t, !0)
        }, getTokenTypeAt: function (e) {
            e = me(this.doc, e);
            var t, r = Wn(this, Yn(this.doc, e.line)), n = 0, i = (r.length - 1) / 2, o = e.ch;
            if (0 == o) t = r[2]; else for (; ;) {
                var l = n + i >> 1;
                if ((l ? r[2 * l - 1] : 0) >= o) i = l; else {
                    if (!(r[2 * l + 1] < o)) {
                        t = r[2 * l + 2];
                        break
                    }
                    n = l + 1
                }
            }
            var a = t ? t.indexOf("cm-overlay ") : -1;
            return 0 > a ? t : 0 == a ? null : t.slice(0, a - 1)
        }, getModeAt: function (t) {
            var r = this.doc.mode;
            return r.innerMode ? e.innerMode(r, this.getTokenAt(t).state).mode : r
        }, getHelper: function (e, t) {
            return this.getHelpers(e, t)[0]
        }, getHelpers: function (e, t) {
            var r = [];
            if (!nl.hasOwnProperty(t)) return r;
            var n = nl[t], i = this.getModeAt(e);
            if ("string" == typeof i[t]) n[i[t]] && r.push(n[i[t]]); else if (i[t]) for (var o = 0; o < i[t].length; o++) {
                var l = n[i[t][o]];
                l && r.push(l)
            } else i.helperType && n[i.helperType] ? r.push(n[i.helperType]) : n[i.name] && r.push(n[i.name]);
            for (var o = 0; o < n._global.length; o++) {
                var a = n._global[o];
                a.pred(i, this) && -1 == Hi(r, a.val) && r.push(a.val)
            }
            return r
        }, getStateAfter: function (e, t) {
            var r = this.doc;
            return e = ge(r, null == e ? r.first + r.size - 1 : e), Re(this, e + 1, t)
        }, cursorCoords: function (e, t) {
            var r, n = this.doc.sel.primary();
            return r = null == e ? n.head : "object" == typeof e ? me(this.doc, e) : e ? n.from() : n.to(), dt(this, r, t || "page")
        }, charCoords: function (e, t) {
            return ht(this, me(this.doc, e), t || "page")
        }, coordsChar: function (e, t) {
            return e = ct(this, e, t || "page"), gt(this, e.left, e.top)
        }, lineAtHeight: function (e, t) {
            return e = ct(this, {top: e, left: 0}, t || "page").top, ti(this.doc, e + this.display.viewOffset)
        }, heightAtLine: function (e, t) {
            var r, n = !1;
            if ("number" == typeof e) {
                var i = this.doc.first + this.doc.size - 1;
                e < this.doc.first ? e = this.doc.first : e > i && (e = i, n = !0), r = Yn(this.doc, e)
            } else r = e;
            return ut(this, r, {top: 0, left: 0}, t || "page").top + (n ? this.doc.height - ri(r) : 0)
        }, defaultTextHeight: function () {
            return vt(this.display)
        }, defaultCharWidth: function () {
            return yt(this.display)
        }, setGutterMarker: Dt(function (e, t, r) {
            return zr(this.doc, e, "gutter", function (e) {
                var n = e.gutterMarkers || (e.gutterMarkers = {});
                return n[t] = r, !r && zi(n) && (e.gutterMarkers = null), !0
            })
        }), clearGutter: Dt(function (e) {
            var t = this, r = t.doc, n = r.first;
            r.iter(function (r) {
                r.gutterMarkers && r.gutterMarkers[e] && (r.gutterMarkers[e] = null, It(t, n, "gutter"), zi(r.gutterMarkers) && (r.gutterMarkers = null)), ++n
            })
        }), lineInfo: function (e) {
            if ("number" == typeof e) {
                if (!ye(this.doc, e)) return null;
                var t = e;
                if (e = Yn(this.doc, e), !e) return null
            } else {
                var t = ei(e);
                if (null == t) return null
            }
            return {
                line: t,
                handle: e,
                text: e.text,
                gutterMarkers: e.gutterMarkers,
                textClass: e.textClass,
                bgClass: e.bgClass,
                wrapClass: e.wrapClass,
                widgets: e.widgets
            }
        }, getViewport: function () {
            return {from: this.display.viewFrom, to: this.display.viewTo}
        }, addWidget: function (e, t, r, n, i) {
            var o = this.display;
            e = dt(this, me(this.doc, e));
            var l = e.bottom, a = e.left;
            if (t.style.position = "absolute", t.setAttribute("cm-ignore-events", "true"), this.display.input.setUneditable(t), o.sizer.appendChild(t), "over" == n) l = e.top; else if ("above" == n || "near" == n) {
                var s = Math.max(o.wrapper.clientHeight, this.doc.height),
                    u = Math.max(o.sizer.clientWidth, o.lineSpace.clientWidth);
                ("above" == n || e.bottom + t.offsetHeight > s) && e.top > t.offsetHeight ? l = e.top - t.offsetHeight : e.bottom + t.offsetHeight <= s && (l = e.bottom), a + t.offsetWidth > u && (a = u - t.offsetWidth)
            }
            t.style.top = l + "px", t.style.left = t.style.right = "", "right" == i ? (a = o.sizer.clientWidth - t.offsetWidth, t.style.right = "0px") : ("left" == i ? a = 0 : "middle" == i && (a = (o.sizer.clientWidth - t.offsetWidth) / 2), t.style.left = a + "px"), r && Er(this, a, l, a + t.offsetWidth, l + t.offsetHeight)
        }, triggerOnKeyDown: Dt(cr), triggerOnKeyPress: Dt(fr), triggerOnKeyUp: dr, execCommand: function (e) {
            return ll.hasOwnProperty(e) ? ll[e].call(null, this) : void 0
        }, triggerElectric: Dt(function (e) {
            ee(this, e)
        }), findPosH: function (e, t, r, n) {
            var i = 1;
            0 > t && (i = -1, t = -t);
            for (var o = 0, l = me(this.doc, e); t > o && (l = Rr(this.doc, l, i, r, n), !l.hitSide); ++o) ;
            return l
        }, moveH: Dt(function (e, t) {
            var r = this;
            r.extendSelectionsBy(function (n) {
                return r.display.shift || r.doc.extend || n.empty() ? Rr(r.doc, n.head, e, t, r.options.rtlMoveVisually) : 0 > e ? n.from() : n.to()
            }, Il)
        }), deleteH: Dt(function (e, t) {
            var r = this.doc.sel, n = this.doc;
            r.somethingSelected() ? n.replaceSelection("", null, "+delete") : _r(this, function (r) {
                var i = Rr(n, r.head, e, t, !1);
                return 0 > e ? {from: i, to: r.head} : {from: r.head, to: i}
            })
        }), findPosV: function (e, t, r, n) {
            var i = 1, o = n;
            0 > t && (i = -1, t = -t);
            for (var l = 0, a = me(this.doc, e); t > l; ++l) {
                var s = dt(this, a, "div");
                if (null == o ? o = s.left : s.left = o, a = qr(this, s, i, r), a.hitSide) break
            }
            return a
        }, moveV: Dt(function (e, t) {
            var r = this, n = this.doc, i = [], o = !r.display.shift && !n.extend && n.sel.somethingSelected();
            if (n.extendSelectionsBy(function (l) {
                if (o) return 0 > e ? l.from() : l.to();
                var a = dt(r, l.head, "div");
                null != l.goalColumn && (a.left = l.goalColumn), i.push(a.left);
                var s = qr(r, a, e, t);
                return "page" == t && l == n.sel.primary() && Ir(r, null, ht(r, s, "div").top - a.top), s
            }, Il), i.length) for (var l = 0; l < n.sel.ranges.length; l++) n.sel.ranges[l].goalColumn = i[l]
        }), findWordAt: function (e) {
            var t = this.doc, r = Yn(t, e.line).text, n = e.ch, i = e.ch;
            if (r) {
                var o = this.getHelper(e, "wordChars");
                (e.xRel < 0 || i == r.length) && n ? --n : ++i;
                for (var l = r.charAt(n), a = Bi(l, o) ? function (e) {
                    return Bi(e, o)
                } : /\s/.test(l) ? function (e) {
                    return /\s/.test(e)
                } : function (e) {
                    return !/\s/.test(e) && !Bi(e)
                }; n > 0 && a(r.charAt(n - 1));) --n;
                for (; i < r.length && a(r.charAt(i));) ++i
            }
            return new de(Wo(e.line, n), Wo(e.line, i))
        }, toggleOverwrite: function (e) {
            (null == e || e != this.state.overwrite) && ((this.state.overwrite = !this.state.overwrite) ? Kl(this.display.cursorDiv, "CodeMirror-overwrite") : Vl(this.display.cursorDiv, "CodeMirror-overwrite"), Al(this, "overwriteToggle", this, this.state.overwrite))
        }, hasFocus: function () {
            return this.display.input.getField() == Gi()
        }, scrollTo: Dt(function (e, t) {
            (null != e || null != t) && Pr(this), null != e && (this.curOp.scrollLeft = e), null != t && (this.curOp.scrollTop = t)
        }), getScrollInfo: function () {
            var e = this.display.scroller;
            return {
                left: e.scrollLeft,
                top: e.scrollTop,
                height: e.scrollHeight - je(this) - this.display.barHeight,
                width: e.scrollWidth - je(this) - this.display.barWidth,
                clientHeight: Ve(this),
                clientWidth: $e(this)
            }
        }, scrollIntoView: Dt(function (e, t) {
            if (null == e ? (e = {
                from: this.doc.sel.primary().head,
                to: null
            }, null == t && (t = this.options.cursorScrollMargin)) : "number" == typeof e ? e = {
                from: Wo(e, 0),
                to: null
            } : null == e.from && (e = {
                from: e,
                to: null
            }), e.to || (e.to = e.from), e.margin = t || 0, null != e.from.line) Pr(this), this.curOp.scrollToPos = e; else {
                var r = Wr(this, Math.min(e.from.left, e.to.left), Math.min(e.from.top, e.to.top) - e.margin, Math.max(e.from.right, e.to.right), Math.max(e.from.bottom, e.to.bottom) + e.margin);
                this.scrollTo(r.scrollLeft, r.scrollTop)
            }
        }), setSize: Dt(function (e, t) {
            function r(e) {
                return "number" == typeof e || /^\d+$/.test(String(e)) ? e + "px" : e
            }

            var n = this;
            null != e && (n.display.wrapper.style.width = r(e)), null != t && (n.display.wrapper.style.height = r(t)), n.options.lineWrapping && ot(this);
            var i = n.display.viewFrom;
            n.doc.iter(i, n.display.viewTo, function (e) {
                if (e.widgets) for (var t = 0; t < e.widgets.length; t++) if (e.widgets[t].noHScroll) {
                    It(n, i, "widget");
                    break
                }
                ++i
            }), n.curOp.forceUpdate = !0, Al(n, "refresh", this)
        }), operation: function (e) {
            return Nt(this, e)
        }, refresh: Dt(function () {
            var e = this.display.cachedTextHeight;
            Wt(this), this.curOp.forceUpdate = !0, lt(this), this.scrollTo(this.doc.scrollLeft, this.doc.scrollTop), c(this), (null == e || Math.abs(e - vt(this.display)) > .5) && l(this), Al(this, "refresh", this)
        }), swapDoc: Dt(function (e) {
            var t = this.doc;
            return t.cm = null, Xn(this, e), lt(this), this.display.input.reset(), this.scrollTo(e.scrollLeft, e.scrollTop), this.curOp.forceScroll = !0, Ci(this, "swapDoc", this, t), t
        }), getInputField: function () {
            return this.display.input.getField()
        }, getWrapperElement: function () {
            return this.display.wrapper
        }, getScrollerElement: function () {
            return this.display.scroller
        }, getGutterElement: function () {
            return this.display.gutters
        }
    }, Ni(e);
    var Yo = e.defaults = {}, Zo = e.optionHandlers = {}, Qo = e.Init = {
        toString: function () {
            return "CodeMirror.Init"
        }
    };
    Ur("value", "", function (e, t) {
        e.setValue(t)
    }, !0), Ur("mode", null, function (e, t) {
        e.doc.modeOption = t, r(e)
    }, !0), Ur("indentUnit", 2, r, !0), Ur("indentWithTabs", !1), Ur("smartIndent", !0), Ur("tabSize", 4, function (e) {
        n(e), lt(e), Wt(e)
    }, !0), Ur("lineSeparator", null, function (e, t) {
        if (e.doc.lineSep = t, t) {
            var r = [], n = e.doc.first;
            e.doc.iter(function (e) {
                for (var i = 0; ;) {
                    var o = e.text.indexOf(t, i);
                    if (-1 == o) break;
                    i = o + t.length, r.push(Wo(n, o))
                }
                n++
            });
            for (var i = r.length - 1; i >= 0; i--) Dr(e.doc, t, r[i], Wo(r[i].line, r[i].ch + t.length))
        }
    }), Ur("specialChars", /[\t\u0000-\u0019\u00ad\u200b-\u200f\u2028\u2029\ufeff]/g, function (t, r, n) {
        t.state.specialChars = new RegExp(r.source + (r.test("	") ? "" : "|	"), "g"), n != e.Init && t.refresh()
    }), Ur("specialCharPlaceholder", Bn, function (e) {
        e.refresh()
    }, !0), Ur("electricChars", !0), Ur("inputStyle", Mo ? "contenteditable" : "textarea", function () {
        throw new Error("inputStyle can not (yet) be changed in a running editor")
    }, !0), Ur("rtlMoveVisually", !No), Ur("wholeLineUpdateBefore", !0), Ur("theme", "default", function (e) {
        a(e), s(e)
    }, !0), Ur("keyMap", "default", function (t, r, n) {
        var i = jr(r), o = n != e.Init && jr(n);
        o && o.detach && o.detach(t, i), i.attach && i.attach(t, o || null)
    }), Ur("extraKeys", null), Ur("lineWrapping", !1, i, !0), Ur("gutters", [], function (e) {
        f(e.options), s(e)
    }, !0), Ur("fixedGutter", !0, function (e, t) {
        e.display.gutters.style.left = t ? k(e.display) + "px" : "0", e.refresh()
    }, !0), Ur("coverGutterNextToScrollbar", !1, function (e) {
        y(e)
    }, !0), Ur("scrollbarStyle", "native", function (e) {
        v(e), y(e), e.display.scrollbars.setScrollTop(e.doc.scrollTop), e.display.scrollbars.setScrollLeft(e.doc.scrollLeft)
    }, !0), Ur("lineNumbers", !1, function (e) {
        f(e.options), s(e)
    }, !0), Ur("firstLineNumber", 1, s, !0), Ur("lineNumberFormatter", function (e) {
        return e
    }, s, !0), Ur("showCursorWhenSelecting", !1, Ee, !0), Ur("resetSelectionOnContextMenu", !0), Ur("lineWiseCopyCut", !0), Ur("readOnly", !1, function (e, t) {
        "nocursor" == t ? (mr(e), e.display.input.blur(), e.display.disabled = !0) : e.display.disabled = !1, e.display.input.readOnlyChanged(t)
    }), Ur("disableInput", !1, function (e, t) {
        t || e.display.input.reset()
    }, !0), Ur("dragDrop", !0, qt), Ur("cursorBlinkRate", 530), Ur("cursorScrollMargin", 0), Ur("cursorHeight", 1, Ee, !0), Ur("singleCursorHeightPerLine", !0, Ee, !0), Ur("workTime", 100), Ur("workDelay", 100), Ur("flattenSpans", !0, n, !0), Ur("addModeClass", !1, n, !0), Ur("pollInterval", 100), Ur("undoDepth", 200, function (e, t) {
        e.doc.history.undoDepth = t
    }), Ur("historyEventDelay", 1250), Ur("viewportMargin", 10, function (e) {
        e.refresh()
    }, !0),
        Ur("maxHighlightLength", 1e4, n, !0), Ur("moveInputWithCursor", !0, function (e, t) {
        t || e.display.input.resetPosition()
    }), Ur("tabindex", null, function (e, t) {
        e.display.input.getField().tabIndex = t || ""
    }), Ur("autofocus", null);
    var Jo = e.modes = {}, el = e.mimeModes = {};
    e.defineMode = function (t, r) {
        e.defaults.mode || "null" == t || (e.defaults.mode = t), arguments.length > 2 && (r.dependencies = Array.prototype.slice.call(arguments, 2)), Jo[t] = r
    }, e.defineMIME = function (e, t) {
        el[e] = t
    }, e.resolveMode = function (t) {
        if ("string" == typeof t && el.hasOwnProperty(t)) t = el[t]; else if (t && "string" == typeof t.name && el.hasOwnProperty(t.name)) {
            var r = el[t.name];
            "string" == typeof r && (r = {name: r}), t = Ii(r, t), t.name = r.name
        } else if ("string" == typeof t && /^[\w\-]+\/[\w\-]+\+xml$/.test(t)) return e.resolveMode("application/xml");
        return "string" == typeof t ? {name: t} : t || {name: "null"}
    }, e.getMode = function (t, r) {
        var r = e.resolveMode(r), n = Jo[r.name];
        if (!n) return e.getMode(t, "text/plain");
        var i = n(t, r);
        if (tl.hasOwnProperty(r.name)) {
            var o = tl[r.name];
            for (var l in o) o.hasOwnProperty(l) && (i.hasOwnProperty(l) && (i["_" + l] = i[l]), i[l] = o[l])
        }
        if (i.name = r.name, r.helperType && (i.helperType = r.helperType), r.modeProps) for (var l in r.modeProps) i[l] = r.modeProps[l];
        return i
    }, e.defineMode("null", function () {
        return {
            token: function (e) {
                e.skipToEnd()
            }
        }
    }), e.defineMIME("text/plain", "null");
    var tl = e.modeExtensions = {};
    e.extendMode = function (e, t) {
        var r = tl.hasOwnProperty(e) ? tl[e] : tl[e] = {};
        Fi(t, r)
    }, e.defineExtension = function (t, r) {
        e.prototype[t] = r
    }, e.defineDocExtension = function (e, t) {
        xl.prototype[e] = t
    }, e.defineOption = Ur;
    var rl = [];
    e.defineInitHook = function (e) {
        rl.push(e)
    };
    var nl = e.helpers = {};
    e.registerHelper = function (t, r, n) {
        nl.hasOwnProperty(t) || (nl[t] = e[t] = {_global: []}), nl[t][r] = n
    }, e.registerGlobalHelper = function (t, r, n, i) {
        e.registerHelper(t, r, i), nl[t]._global.push({pred: n, val: i})
    };
    var il = e.copyState = function (e, t) {
        if (t === !0) return t;
        if (e.copyState) return e.copyState(t);
        var r = {};
        for (var n in t) {
            var i = t[n];
            i instanceof Array && (i = i.concat([])), r[n] = i
        }
        return r
    }, ol = e.startState = function (e, t, r) {
        return e.startState ? e.startState(t, r) : !0
    };
    e.innerMode = function (e, t) {
        for (; e.innerMode;) {
            var r = e.innerMode(t);
            if (!r || r.mode == e) break;
            t = r.state, e = r.mode
        }
        return r || {mode: e, state: t}
    };
    var ll = e.commands = {
        selectAll: function (e) {
            e.setSelection(Wo(e.firstLine(), 0), Wo(e.lastLine()), El)
        }, singleSelection: function (e) {
            e.setSelection(e.getCursor("anchor"), e.getCursor("head"), El)
        }, killLine: function (e) {
            _r(e, function (t) {
                if (t.empty()) {
                    var r = Yn(e.doc, t.head.line).text.length;
                    return t.head.ch == r && t.head.line < e.lastLine() ? {
                        from: t.head,
                        to: Wo(t.head.line + 1, 0)
                    } : {from: t.head, to: Wo(t.head.line, r)}
                }
                return {from: t.from(), to: t.to()}
            })
        }, deleteLine: function (e) {
            _r(e, function (t) {
                return {from: Wo(t.from().line, 0), to: me(e.doc, Wo(t.to().line + 1, 0))}
            })
        }, delLineLeft: function (e) {
            _r(e, function (e) {
                return {from: Wo(e.from().line, 0), to: e.from()}
            })
        }, delWrappedLineLeft: function (e) {
            _r(e, function (t) {
                var r = e.charCoords(t.head, "div").top + 5, n = e.coordsChar({left: 0, top: r}, "div");
                return {from: n, to: t.from()}
            })
        }, delWrappedLineRight: function (e) {
            _r(e, function (t) {
                var r = e.charCoords(t.head, "div").top + 5,
                    n = e.coordsChar({left: e.display.lineDiv.offsetWidth + 100, top: r}, "div");
                return {from: t.from(), to: n}
            })
        }, undo: function (e) {
            e.undo()
        }, redo: function (e) {
            e.redo()
        }, undoSelection: function (e) {
            e.undoSelection()
        }, redoSelection: function (e) {
            e.redoSelection()
        }, goDocStart: function (e) {
            e.extendSelection(Wo(e.firstLine(), 0))
        }, goDocEnd: function (e) {
            e.extendSelection(Wo(e.lastLine()))
        }, goLineStart: function (e) {
            e.extendSelectionsBy(function (t) {
                return io(e, t.head.line)
            }, {origin: "+move", bias: 1})
        }, goLineStartSmart: function (e) {
            e.extendSelectionsBy(function (t) {
                return lo(e, t.head)
            }, {origin: "+move", bias: 1})
        }, goLineEnd: function (e) {
            e.extendSelectionsBy(function (t) {
                return oo(e, t.head.line)
            }, {origin: "+move", bias: -1})
        }, goLineRight: function (e) {
            e.extendSelectionsBy(function (t) {
                var r = e.charCoords(t.head, "div").top + 5;
                return e.coordsChar({left: e.display.lineDiv.offsetWidth + 100, top: r}, "div")
            }, Il)
        }, goLineLeft: function (e) {
            e.extendSelectionsBy(function (t) {
                var r = e.charCoords(t.head, "div").top + 5;
                return e.coordsChar({left: 0, top: r}, "div")
            }, Il)
        }, goLineLeftSmart: function (e) {
            e.extendSelectionsBy(function (t) {
                var r = e.charCoords(t.head, "div").top + 5, n = e.coordsChar({left: 0, top: r}, "div");
                return n.ch < e.getLine(n.line).search(/\S/) ? lo(e, t.head) : n
            }, Il)
        }, goLineUp: function (e) {
            e.moveV(-1, "line")
        }, goLineDown: function (e) {
            e.moveV(1, "line")
        }, goPageUp: function (e) {
            e.moveV(-1, "page")
        }, goPageDown: function (e) {
            e.moveV(1, "page")
        }, goCharLeft: function (e) {
            e.moveH(-1, "char")
        }, goCharRight: function (e) {
            e.moveH(1, "char")
        }, goColumnLeft: function (e) {
            e.moveH(-1, "column")
        }, goColumnRight: function (e) {
            e.moveH(1, "column")
        }, goWordLeft: function (e) {
            e.moveH(-1, "word")
        }, goGroupRight: function (e) {
            e.moveH(1, "group")
        }, goGroupLeft: function (e) {
            e.moveH(-1, "group")
        }, goWordRight: function (e) {
            e.moveH(1, "word")
        }, delCharBefore: function (e) {
            e.deleteH(-1, "char")
        }, delCharAfter: function (e) {
            e.deleteH(1, "char")
        }, delWordBefore: function (e) {
            e.deleteH(-1, "word")
        }, delWordAfter: function (e) {
            e.deleteH(1, "word")
        }, delGroupBefore: function (e) {
            e.deleteH(-1, "group")
        }, delGroupAfter: function (e) {
            e.deleteH(1, "group")
        }, indentAuto: function (e) {
            e.indentSelection("smart")
        }, indentMore: function (e) {
            e.indentSelection("add")
        }, indentLess: function (e) {
            e.indentSelection("subtract")
        }, insertTab: function (e) {
            e.replaceSelection("	")
        }, insertSoftTab: function (e) {
            for (var t = [], r = e.listSelections(), n = e.options.tabSize, i = 0; i < r.length; i++) {
                var o = r[i].from(), l = Fl(e.getLine(o.line), o.ch, n);
                t.push(new Array(n - l % n + 1).join(" "))
            }
            e.replaceSelections(t)
        }, defaultTab: function (e) {
            e.somethingSelected() ? e.indentSelection("add") : e.execCommand("insertTab")
        }, transposeChars: function (e) {
            Nt(e, function () {
                for (var t = e.listSelections(), r = [], n = 0; n < t.length; n++) {
                    var i = t[n].head, o = Yn(e.doc, i.line).text;
                    if (o) if (i.ch == o.length && (i = new Wo(i.line, i.ch - 1)), i.ch > 0) i = new Wo(i.line, i.ch + 1), e.replaceRange(o.charAt(i.ch - 1) + o.charAt(i.ch - 2), Wo(i.line, i.ch - 2), i, "+transpose"); else if (i.line > e.doc.first) {
                        var l = Yn(e.doc, i.line - 1).text;
                        l && e.replaceRange(o.charAt(0) + e.doc.lineSeparator() + l.charAt(l.length - 1), Wo(i.line - 1, l.length - 1), Wo(i.line, 1), "+transpose")
                    }
                    r.push(new de(i, i))
                }
                e.setSelections(r)
            })
        }, newlineAndIndent: function (e) {
            Nt(e, function () {
                for (var t = e.listSelections().length, r = 0; t > r; r++) {
                    var n = e.listSelections()[r];
                    e.replaceRange(e.doc.lineSeparator(), n.anchor, n.head, "+input"), e.indentLine(n.from().line + 1, null, !0), Fr(e)
                }
            })
        }, toggleOverwrite: function (e) {
            e.toggleOverwrite()
        }
    }, al = e.keyMap = {};
    al.basic = {
        Left: "goCharLeft",
        Right: "goCharRight",
        Up: "goLineUp",
        Down: "goLineDown",
        End: "goLineEnd",
        Home: "goLineStartSmart",
        PageUp: "goPageUp",
        PageDown: "goPageDown",
        Delete: "delCharAfter",
        Backspace: "delCharBefore",
        "Shift-Backspace": "delCharBefore",
        Tab: "defaultTab",
        "Shift-Tab": "indentAuto",
        Enter: "newlineAndIndent",
        Insert: "toggleOverwrite",
        Esc: "singleSelection"
    }, al.pcDefault = {
        "Ctrl-A": "selectAll",
        "Ctrl-D": "deleteLine",
        "Ctrl-Z": "undo",
        "Shift-Ctrl-Z": "redo",
        "Ctrl-Y": "redo",
        "Ctrl-Home": "goDocStart",
        "Ctrl-End": "goDocEnd",
        "Ctrl-Up": "goLineUp",
        "Ctrl-Down": "goLineDown",
        "Ctrl-Left": "goGroupLeft",
        "Ctrl-Right": "goGroupRight",
        "Alt-Left": "goLineStart",
        "Alt-Right": "goLineEnd",
        "Ctrl-Backspace": "delGroupBefore",
        "Ctrl-Delete": "delGroupAfter",
        "Ctrl-S": "save",
        "Ctrl-F": "find",
        "Ctrl-G": "findNext",
        "Shift-Ctrl-G": "findPrev",
        "Shift-Ctrl-F": "replace",
        "Shift-Ctrl-R": "replaceAll",
        "Ctrl-[": "indentLess",
        "Ctrl-]": "indentMore",
        "Ctrl-U": "undoSelection",
        "Shift-Ctrl-U": "redoSelection",
        "Alt-U": "redoSelection",
        fallthrough: "basic"
    }, al.emacsy = {
        "Ctrl-F": "goCharRight",
        "Ctrl-B": "goCharLeft",
        "Ctrl-P": "goLineUp",
        "Ctrl-N": "goLineDown",
        "Alt-F": "goWordRight",
        "Alt-B": "goWordLeft",
        "Ctrl-A": "goLineStart",
        "Ctrl-E": "goLineEnd",
        "Ctrl-V": "goPageDown",
        "Shift-Ctrl-V": "goPageUp",
        "Ctrl-D": "delCharAfter",
        "Ctrl-H": "delCharBefore",
        "Alt-D": "delWordAfter",
        "Alt-Backspace": "delWordBefore",
        "Ctrl-K": "killLine",
        "Ctrl-T": "transposeChars"
    }, al.macDefault = {
        "Cmd-A": "selectAll",
        "Cmd-D": "deleteLine",
        "Cmd-Z": "undo",
        "Shift-Cmd-Z": "redo",
        "Cmd-Y": "redo",
        "Cmd-Home": "goDocStart",
        "Cmd-Up": "goDocStart",
        "Cmd-End": "goDocEnd",
        "Cmd-Down": "goDocEnd",
        "Alt-Left": "goGroupLeft",
        "Alt-Right": "goGroupRight",
        "Cmd-Left": "goLineLeft",
        "Cmd-Right": "goLineRight",
        "Alt-Backspace": "delGroupBefore",
        "Ctrl-Alt-Backspace": "delGroupAfter",
        "Alt-Delete": "delGroupAfter",
        "Cmd-S": "save",
        "Cmd-F": "find",
        "Cmd-G": "findNext",
        "Shift-Cmd-G": "findPrev",
        "Cmd-Alt-F": "replace",
        "Shift-Cmd-Alt-F": "replaceAll",
        "Cmd-[": "indentLess",
        "Cmd-]": "indentMore",
        "Cmd-Backspace": "delWrappedLineLeft",
        "Cmd-Delete": "delWrappedLineRight",
        "Cmd-U": "undoSelection",
        "Shift-Cmd-U": "redoSelection",
        "Ctrl-Up": "goDocStart",
        "Ctrl-Down": "goDocEnd",
        fallthrough: ["basic", "emacsy"]
    }, al["default"] = To ? al.macDefault : al.pcDefault, e.normalizeKeyMap = function (e) {
        var t = {};
        for (var r in e) if (e.hasOwnProperty(r)) {
            var n = e[r];
            if (/^(name|fallthrough|(de|at)tach)$/.test(r)) continue;
            if ("..." == n) {
                delete e[r];
                continue
            }
            for (var i = Ei(r.split(" "), Gr), o = 0; o < i.length; o++) {
                var l, a;
                o == i.length - 1 ? (a = i.join(" "), l = n) : (a = i.slice(0, o + 1).join(" "), l = "...");
                var s = t[a];
                if (s) {
                    if (s != l) throw new Error("Inconsistent bindings for " + a)
                } else t[a] = l
            }
            delete e[r]
        }
        for (var u in t) e[u] = t[u];
        return e
    };
    var sl = e.lookupKey = function (e, t, r, n) {
        t = jr(t);
        var i = t.call ? t.call(e, n) : t[e];
        if (i === !1) return "nothing";
        if ("..." === i) return "multi";
        if (null != i && r(i)) return "handled";
        if (t.fallthrough) {
            if ("[object Array]" != Object.prototype.toString.call(t.fallthrough)) return sl(e, t.fallthrough, r, n);
            for (var o = 0; o < t.fallthrough.length; o++) {
                var l = sl(e, t.fallthrough[o], r, n);
                if (l) return l
            }
        }
    }, ul = e.isModifierKey = function (e) {
        var t = "string" == typeof e ? e : ta[e.keyCode];
        return "Ctrl" == t || "Alt" == t || "Shift" == t || "Mod" == t
    }, cl = e.keyName = function (e, t) {
        if (wo && 34 == e.keyCode && e["char"]) return !1;
        var r = ta[e.keyCode], n = r;
        return null == n || e.altGraphKey ? !1 : (e.altKey && "Alt" != r && (n = "Alt-" + n), (Do ? e.metaKey : e.ctrlKey) && "Ctrl" != r && (n = "Ctrl-" + n), (Do ? e.ctrlKey : e.metaKey) && "Cmd" != r && (n = "Cmd-" + n), !t && e.shiftKey && "Shift" != r && (n = "Shift-" + n), n)
    };
    e.fromTextArea = function (t, r) {
        function n() {
            t.value = u.getValue()
        }

        if (r = r ? Fi(r) : {}, r.value = t.value, !r.tabindex && t.tabIndex && (r.tabindex = t.tabIndex), !r.placeholder && t.placeholder && (r.placeholder = t.placeholder), null == r.autofocus) {
            var i = Gi();
            r.autofocus = i == t || null != t.getAttribute("autofocus") && i == document.body
        }
        if (t.form && (Ml(t.form, "submit", n), !r.leaveSubmitMethodAlone)) {
            var o = t.form, l = o.submit;
            try {
                var a = o.submit = function () {
                    n(), o.submit = l, o.submit(), o.submit = a
                }
            } catch (s) {
            }
        }
        r.finishInit = function (e) {
            e.save = n, e.getTextArea = function () {
                return t
            }, e.toTextArea = function () {
                e.toTextArea = isNaN, n(), t.parentNode.removeChild(e.getWrapperElement()), t.style.display = "", t.form && (Nl(t.form, "submit", n), "function" == typeof t.form.submit && (t.form.submit = l))
            }
        }, t.style.display = "none";
        var u = e(function (e) {
            t.parentNode.insertBefore(e, t.nextSibling)
        }, r);
        return u
    };
    var hl = e.StringStream = function (e, t) {
        this.pos = this.start = 0, this.string = e, this.tabSize = t || 8, this.lastColumnPos = this.lastColumnValue = 0, this.lineStart = 0
    };
    hl.prototype = {
        eol: function () {
            return this.pos >= this.string.length
        }, sol: function () {
            return this.pos == this.lineStart
        }, peek: function () {
            return this.string.charAt(this.pos) || void 0
        }, next: function () {
            return this.pos < this.string.length ? this.string.charAt(this.pos++) : void 0
        }, eat: function (e) {
            var t = this.string.charAt(this.pos);
            if ("string" == typeof e) var r = t == e; else var r = t && (e.test ? e.test(t) : e(t));
            return r ? (++this.pos, t) : void 0
        }, eatWhile: function (e) {
            for (var t = this.pos; this.eat(e);) ;
            return this.pos > t
        }, eatSpace: function () {
            for (var e = this.pos; /[\s\u00a0]/.test(this.string.charAt(this.pos));) ++this.pos;
            return this.pos > e
        }, skipToEnd: function () {
            this.pos = this.string.length
        }, skipTo: function (e) {
            var t = this.string.indexOf(e, this.pos);
            return t > -1 ? (this.pos = t, !0) : void 0
        }, backUp: function (e) {
            this.pos -= e
        }, column: function () {
            return this.lastColumnPos < this.start && (this.lastColumnValue = Fl(this.string, this.start, this.tabSize, this.lastColumnPos, this.lastColumnValue), this.lastColumnPos = this.start), this.lastColumnValue - (this.lineStart ? Fl(this.string, this.lineStart, this.tabSize) : 0)
        }, indentation: function () {
            return Fl(this.string, null, this.tabSize) - (this.lineStart ? Fl(this.string, this.lineStart, this.tabSize) : 0)
        }, match: function (e, t, r) {
            if ("string" != typeof e) {
                var n = this.string.slice(this.pos).match(e);
                return n && n.index > 0 ? null : (n && t !== !1 && (this.pos += n[0].length), n)
            }
            var i = function (e) {
                return r ? e.toLowerCase() : e
            }, o = this.string.substr(this.pos, e.length);
            return i(o) == i(e) ? (t !== !1 && (this.pos += e.length), !0) : void 0
        }, current: function () {
            return this.string.slice(this.start, this.pos)
        }, hideFirstChars: function (e, t) {
            this.lineStart += e;
            try {
                return t()
            } finally {
                this.lineStart -= e
            }
        }
    };
    var dl = 0, fl = e.TextMarker = function (e, t) {
        this.lines = [], this.type = t, this.doc = e, this.id = ++dl
    };
    Ni(fl), fl.prototype.clear = function () {
        if (!this.explicitlyCleared) {
            var e = this.doc.cm, t = e && !e.curOp;
            if (t && bt(e), Ti(this, "clear")) {
                var r = this.find();
                r && Ci(this, "clear", r.from, r.to)
            }
            for (var n = null, i = null, o = 0; o < this.lines.length; ++o) {
                var l = this.lines[o], a = Qr(l.markedSpans, this);
                e && !this.collapsed ? It(e, ei(l), "text") : e && (null != a.to && (i = ei(l)), null != a.from && (n = ei(l))), l.markedSpans = Jr(l.markedSpans, a), null == a.from && this.collapsed && !wn(this.doc, l) && e && Jn(l, vt(e.display))
            }
            if (e && this.collapsed && !e.options.lineWrapping) for (var o = 0; o < this.lines.length; ++o) {
                var s = vn(this.lines[o]), u = h(s);
                u > e.display.maxLineLength && (e.display.maxLine = s, e.display.maxLineLength = u, e.display.maxLineChanged = !0)
            }
            null != n && e && this.collapsed && Wt(e, n, i + 1), this.lines.length = 0, this.explicitlyCleared = !0, this.atomic && this.doc.cantEdit && (this.doc.cantEdit = !1, e && De(e.doc)), e && Ci(e, "markerCleared", e, this), t && wt(e), this.parent && this.parent.clear()
        }
    }, fl.prototype.find = function (e, t) {
        null == e && "bookmark" == this.type && (e = 1);
        for (var r, n, i = 0; i < this.lines.length; ++i) {
            var o = this.lines[i], l = Qr(o.markedSpans, this);
            if (null != l.from && (r = Wo(t ? o : ei(o), l.from), -1 == e)) return r;
            if (null != l.to && (n = Wo(t ? o : ei(o), l.to), 1 == e)) return n
        }
        return r && {from: r, to: n}
    }, fl.prototype.changed = function () {
        var e = this.find(-1, !0), t = this, r = this.doc.cm;
        e && r && Nt(r, function () {
            var n = e.line, i = ei(e.line), o = Qe(r, i);
            if (o && (it(o), r.curOp.selectionChanged = r.curOp.forceUpdate = !0), r.curOp.updateMaxLine = !0, !wn(t.doc, n) && null != t.height) {
                var l = t.height;
                t.height = null;
                var a = kn(t) - l;
                a && Jn(n, n.height + a)
            }
        })
    }, fl.prototype.attachLine = function (e) {
        if (!this.lines.length && this.doc.cm) {
            var t = this.doc.cm.curOp;
            t.maybeHiddenMarkers && -1 != Hi(t.maybeHiddenMarkers, this) || (t.maybeUnhiddenMarkers || (t.maybeUnhiddenMarkers = [])).push(this)
        }
        this.lines.push(e)
    }, fl.prototype.detachLine = function (e) {
        if (this.lines.splice(Hi(this.lines, e), 1), !this.lines.length && this.doc.cm) {
            var t = this.doc.cm.curOp;
            (t.maybeHiddenMarkers || (t.maybeHiddenMarkers = [])).push(this)
        }
    };
    var dl = 0, pl = e.SharedTextMarker = function (e, t) {
        this.markers = e, this.primary = t;
        for (var r = 0; r < e.length; ++r) e[r].parent = this
    };
    Ni(pl), pl.prototype.clear = function () {
        if (!this.explicitlyCleared) {
            this.explicitlyCleared = !0;
            for (var e = 0; e < this.markers.length; ++e) this.markers[e].clear();
            Ci(this, "clear")
        }
    }, pl.prototype.find = function (e, t) {
        return this.primary.find(e, t)
    };
    var gl = e.LineWidget = function (e, t, r) {
        if (r) for (var n in r) r.hasOwnProperty(n) && (this[n] = r[n]);
        this.doc = e, this.node = t
    };
    Ni(gl), gl.prototype.clear = function () {
        var e = this.doc.cm, t = this.line.widgets, r = this.line, n = ei(r);
        if (null != n && t) {
            for (var i = 0; i < t.length; ++i) t[i] == this && t.splice(i--, 1);
            t.length || (r.widgets = null);
            var o = kn(this);
            Jn(r, Math.max(0, r.height - o)), e && Nt(e, function () {
                Cn(e, r, -o), It(e, n, "widget")
            })
        }
    }, gl.prototype.changed = function () {
        var e = this.height, t = this.doc.cm, r = this.line;
        this.height = null;
        var n = kn(this) - e;
        n && (Jn(r, r.height + n), t && Nt(t, function () {
            t.curOp.forceUpdate = !0, Cn(t, r, n)
        }))
    };
    var ml = e.Line = function (e, t, r) {
        this.text = e, un(this, t), this.height = r ? r(this) : 1
    };
    Ni(ml), ml.prototype.lineNo = function () {
        return ei(this)
    };
    var vl = {}, yl = {};
    $n.prototype = {
        chunkSize: function () {
            return this.lines.length
        }, removeInner: function (e, t) {
            for (var r = e, n = e + t; n > r; ++r) {
                var i = this.lines[r];
                this.height -= i.height, Tn(i), Ci(i, "delete")
            }
            this.lines.splice(e, t)
        }, collapse: function (e) {
            e.push.apply(e, this.lines)
        }, insertInner: function (e, t, r) {
            this.height += r, this.lines = this.lines.slice(0, e).concat(t).concat(this.lines.slice(e));
            for (var n = 0; n < t.length; ++n) t[n].parent = this
        }, iterN: function (e, t, r) {
            for (var n = e + t; n > e; ++e) if (r(this.lines[e])) return !0
        }
    }, Vn.prototype = {
        chunkSize: function () {
            return this.size
        }, removeInner: function (e, t) {
            this.size -= t;
            for (var r = 0; r < this.children.length; ++r) {
                var n = this.children[r], i = n.chunkSize();
                if (i > e) {
                    var o = Math.min(t, i - e), l = n.height;
                    if (n.removeInner(e, o), this.height -= l - n.height, i == o && (this.children.splice(r--, 1), n.parent = null), 0 == (t -= o)) break;
                    e = 0
                } else e -= i
            }
            if (this.size - t < 25 && (this.children.length > 1 || !(this.children[0] instanceof $n))) {
                var a = [];
                this.collapse(a), this.children = [new $n(a)], this.children[0].parent = this
            }
        }, collapse: function (e) {
            for (var t = 0; t < this.children.length; ++t) this.children[t].collapse(e)
        }, insertInner: function (e, t, r) {
            this.size += t.length, this.height += r;
            for (var n = 0; n < this.children.length; ++n) {
                var i = this.children[n], o = i.chunkSize();
                if (o >= e) {
                    if (i.insertInner(e, t, r), i.lines && i.lines.length > 50) {
                        for (; i.lines.length > 50;) {
                            var l = i.lines.splice(i.lines.length - 25, 25), a = new $n(l);
                            i.height -= a.height, this.children.splice(n + 1, 0, a), a.parent = this
                        }
                        this.maybeSpill()
                    }
                    break
                }
                e -= o
            }
        }, maybeSpill: function () {
            if (!(this.children.length <= 10)) {
                var e = this;
                do {
                    var t = e.children.splice(e.children.length - 5, 5), r = new Vn(t);
                    if (e.parent) {
                        e.size -= r.size, e.height -= r.height;
                        var n = Hi(e.parent.children, e);
                        e.parent.children.splice(n + 1, 0, r)
                    } else {
                        var i = new Vn(e.children);
                        i.parent = e, e.children = [i, r], e = i
                    }
                    r.parent = e.parent
                } while (e.children.length > 10);
                e.parent.maybeSpill()
            }
        }, iterN: function (e, t, r) {
            for (var n = 0; n < this.children.length; ++n) {
                var i = this.children[n], o = i.chunkSize();
                if (o > e) {
                    var l = Math.min(t, o - e);
                    if (i.iterN(e, l, r)) return !0;
                    if (0 == (t -= l)) break;
                    e = 0
                } else e -= o
            }
        }
    };
    var bl = 0, xl = e.Doc = function (e, t, r, n) {
        if (!(this instanceof xl)) return new xl(e, t, r, n);
        null == r && (r = 0), Vn.call(this, [new $n([new ml("", null)])]), this.first = r, this.scrollTop = this.scrollLeft = 0, this.cantEdit = !1, this.cleanGeneration = 1, this.frontier = r;
        var i = Wo(r, 0);
        this.sel = pe(i), this.history = new ii(null), this.id = ++bl, this.modeOption = t, this.lineSep = n, "string" == typeof e && (e = this.splitLines(e)), jn(this, {
            from: i,
            to: i,
            text: e
        }), Te(this, pe(i), El)
    };
    xl.prototype = Ii(Vn.prototype, {
        constructor: xl, iter: function (e, t, r) {
            r ? this.iterN(e - this.first, t - e, r) : this.iterN(this.first, this.first + this.size, e)
        }, insert: function (e, t) {
            for (var r = 0, n = 0; n < t.length; ++n) r += t[n].height;
            this.insertInner(e - this.first, t, r)
        }, remove: function (e, t) {
            this.removeInner(e - this.first, t)
        }, getValue: function (e) {
            var t = Qn(this, this.first, this.first + this.size);
            return e === !1 ? t : t.join(e || this.lineSeparator())
        }, setValue: Ot(function (e) {
            var t = Wo(this.first, 0), r = this.first + this.size - 1;
            kr(this, {
                from: t,
                to: Wo(r, Yn(this, r).text.length),
                text: this.splitLines(e),
                origin: "setValue",
                full: !0
            }, !0), Te(this, pe(t))
        }), replaceRange: function (e, t, r, n) {
            t = me(this, t), r = r ? me(this, r) : t, Dr(this, e, t, r, n)
        }, getRange: function (e, t, r) {
            var n = Zn(this, me(this, e), me(this, t));
            return r === !1 ? n : n.join(r || this.lineSeparator())
        }, getLine: function (e) {
            var t = this.getLineHandle(e);
            return t && t.text
        }, getLineHandle: function (e) {
            return ye(this, e) ? Yn(this, e) : void 0
        }, getLineNumber: function (e) {
            return ei(e)
        }, getLineHandleVisualStart: function (e) {
            return "number" == typeof e && (e = Yn(this, e)), vn(e)
        }, lineCount: function () {
            return this.size
        }, firstLine: function () {
            return this.first
        }, lastLine: function () {
            return this.first + this.size - 1
        }, clipPos: function (e) {
            return me(this, e)
        }, getCursor: function (e) {
            var t, r = this.sel.primary();
            return t = null == e || "head" == e ? r.head : "anchor" == e ? r.anchor : "end" == e || "to" == e || e === !1 ? r.to() : r.from()
        }, listSelections: function () {
            return this.sel.ranges
        }, somethingSelected: function () {
            return this.sel.somethingSelected()
        }, setCursor: Ot(function (e, t, r) {
            ke(this, me(this, "number" == typeof e ? Wo(e, t || 0) : e), null, r)
        }), setSelection: Ot(function (e, t, r) {
            ke(this, me(this, e), me(this, t || e), r)
        }), extendSelection: Ot(function (e, t, r) {
            we(this, me(this, e), t && me(this, t), r)
        }), extendSelections: Ot(function (e, t) {
            Se(this, be(this, e, t))
        }), extendSelectionsBy: Ot(function (e, t) {
            Se(this, Ei(this.sel.ranges, e), t)
        }), setSelections: Ot(function (e, t, r) {
            if (e.length) {
                for (var n = 0, i = []; n < e.length; n++) i[n] = new de(me(this, e[n].anchor), me(this, e[n].head));
                null == t && (t = Math.min(e.length - 1, this.sel.primIndex)), Te(this, fe(i, t), r)
            }
        }), addSelection: Ot(function (e, t, r) {
            var n = this.sel.ranges.slice(0);
            n.push(new de(me(this, e), me(this, t || e))), Te(this, fe(n, n.length - 1), r)
        }), getSelection: function (e) {
            for (var t, r = this.sel.ranges, n = 0; n < r.length; n++) {
                var i = Zn(this, r[n].from(), r[n].to());
                t = t ? t.concat(i) : i
            }
            return e === !1 ? t : t.join(e || this.lineSeparator())
        }, getSelections: function (e) {
            for (var t = [], r = this.sel.ranges, n = 0; n < r.length; n++) {
                var i = Zn(this, r[n].from(), r[n].to());
                e !== !1 && (i = i.join(e || this.lineSeparator())), t[n] = i
            }
            return t
        }, replaceSelection: function (e, t, r) {
            for (var n = [], i = 0; i < this.sel.ranges.length; i++) n[i] = e;
            this.replaceSelections(n, t, r || "+input")
        }, replaceSelections: Ot(function (e, t, r) {
            for (var n = [], i = this.sel, o = 0; o < i.ranges.length; o++) {
                var l = i.ranges[o];
                n[o] = {from: l.from(), to: l.to(), text: this.splitLines(e[o]), origin: r}
            }
            for (var a = t && "end" != t && Sr(this, n, t), o = n.length - 1; o >= 0; o--) kr(this, n[o]);
            a ? Me(this, a) : this.cm && Fr(this.cm)
        }), undo: Ot(function () {
            Mr(this, "undo")
        }), redo: Ot(function () {
            Mr(this, "redo")
        }), undoSelection: Ot(function () {
            Mr(this, "undo", !0)
        }), redoSelection: Ot(function () {
            Mr(this, "redo", !0)
        }), setExtending: function (e) {
            this.extend = e
        }, getExtending: function () {
            return this.extend
        }, historySize: function () {
            for (var e = this.history, t = 0, r = 0, n = 0; n < e.done.length; n++) e.done[n].ranges || ++t;
            for (var n = 0; n < e.undone.length; n++) e.undone[n].ranges || ++r;
            return {undo: t, redo: r}
        }, clearHistory: function () {
            this.history = new ii(this.history.maxGeneration)
        }, markClean: function () {
            this.cleanGeneration = this.changeGeneration(!0)
        }, changeGeneration: function (e) {
            return e && (this.history.lastOp = this.history.lastSelOp = this.history.lastOrigin = null), this.history.generation
        }, isClean: function (e) {
            return this.history.generation == (e || this.cleanGeneration)
        }, getHistory: function () {
            return {done: gi(this.history.done), undone: gi(this.history.undone)}
        }, setHistory: function (e) {
            var t = this.history = new ii(this.history.maxGeneration);
            t.done = gi(e.done.slice(0), null, !0), t.undone = gi(e.undone.slice(0), null, !0)
        }, addLineClass: Ot(function (e, t, r) {
            return zr(this, e, "gutter" == t ? "gutter" : "class", function (e) {
                var n = "text" == t ? "textClass" : "background" == t ? "bgClass" : "gutter" == t ? "gutterClass" : "wrapClass";
                if (e[n]) {
                    if (ji(r).test(e[n])) return !1;
                    e[n] += " " + r
                } else e[n] = r;
                return !0
            })
        }), removeLineClass: Ot(function (e, t, r) {
            return zr(this, e, "gutter" == t ? "gutter" : "class", function (e) {
                var n = "text" == t ? "textClass" : "background" == t ? "bgClass" : "gutter" == t ? "gutterClass" : "wrapClass",
                    i = e[n];
                if (!i) return !1;
                if (null == r) e[n] = null; else {
                    var o = i.match(ji(r));
                    if (!o) return !1;
                    var l = o.index + o[0].length;
                    e[n] = i.slice(0, o.index) + (o.index && l != i.length ? " " : "") + i.slice(l) || null
                }
                return !0
            })
        }), addLineWidget: Ot(function (e, t, r) {
            return Ln(this, e, t, r)
        }), removeLineWidget: function (e) {
            e.clear()
        }, markText: function (e, t, r) {
            return $r(this, me(this, e), me(this, t), r, "range")
        }, setBookmark: function (e, t) {
            var r = {
                replacedWith: t && (null == t.nodeType ? t.widget : t),
                insertLeft: t && t.insertLeft,
                clearWhenEmpty: !1,
                shared: t && t.shared,
                handleMouseEvents: t && t.handleMouseEvents
            };
            return e = me(this, e), $r(this, e, e, r, "bookmark")
        }, findMarksAt: function (e) {
            e = me(this, e);
            var t = [], r = Yn(this, e.line).markedSpans;
            if (r) for (var n = 0; n < r.length; ++n) {
                var i = r[n];
                (null == i.from || i.from <= e.ch) && (null == i.to || i.to >= e.ch) && t.push(i.marker.parent || i.marker)
            }
            return t
        }, findMarks: function (e, t, r) {
            e = me(this, e), t = me(this, t);
            var n = [], i = e.line;
            return this.iter(e.line, t.line + 1, function (o) {
                var l = o.markedSpans;
                if (l) for (var a = 0; a < l.length; a++) {
                    var s = l[a];
                    i == e.line && e.ch > s.to || null == s.from && i != e.line || i == t.line && s.from > t.ch || r && !r(s.marker) || n.push(s.marker.parent || s.marker)
                }
                ++i
            }), n
        }, getAllMarks: function () {
            var e = [];
            return this.iter(function (t) {
                var r = t.markedSpans;
                if (r) for (var n = 0; n < r.length; ++n) null != r[n].from && e.push(r[n].marker)
            }), e
        }, posFromIndex: function (e) {
            var t, r = this.first;
            return this.iter(function (n) {
                var i = n.text.length + 1;
                return i > e ? (t = e, !0) : (e -= i, void ++r)
            }), me(this, Wo(r, t))
        }, indexFromPos: function (e) {
            e = me(this, e);
            var t = e.ch;
            return e.line < this.first || e.ch < 0 ? 0 : (this.iter(this.first, e.line, function (e) {
                t += e.text.length + 1
            }), t)
        }, copy: function (e) {
            var t = new xl(Qn(this, this.first, this.first + this.size), this.modeOption, this.first, this.lineSep);
            return t.scrollTop = this.scrollTop, t.scrollLeft = this.scrollLeft, t.sel = this.sel, t.extend = !1, e && (t.history.undoDepth = this.history.undoDepth, t.setHistory(this.getHistory())), t
        }, linkedDoc: function (e) {
            e || (e = {});
            var t = this.first, r = this.first + this.size;
            null != e.from && e.from > t && (t = e.from), null != e.to && e.to < r && (r = e.to);
            var n = new xl(Qn(this, t, r), e.mode || this.modeOption, t, this.lineSep);
            return e.sharedHist && (n.history = this.history), (this.linked || (this.linked = [])).push({
                doc: n,
                sharedHist: e.sharedHist
            }), n.linked = [{doc: this, isParent: !0, sharedHist: e.sharedHist}], Xr(n, Kr(this)), n
        }, unlinkDoc: function (t) {
            if (t instanceof e && (t = t.doc), this.linked) for (var r = 0; r < this.linked.length; ++r) {
                var n = this.linked[r];
                if (n.doc == t) {
                    this.linked.splice(r, 1), t.unlinkDoc(this), Yr(Kr(this));
                    break
                }
            }
            if (t.history == this.history) {
                var i = [t.id];
                Kn(t, function (e) {
                    i.push(e.id)
                }, !0), t.history = new ii(null), t.history.done = gi(this.history.done, i), t.history.undone = gi(this.history.undone, i)
            }
        }, iterLinkedDocs: function (e) {
            Kn(this, e)
        }, getMode: function () {
            return this.mode
        }, getEditor: function () {
            return this.cm
        }, splitLines: function (e) {
            return this.lineSep ? e.split(this.lineSep) : Zl(e)
        }, lineSeparator: function () {
            return this.lineSep || "\n"
        }
    }), xl.prototype.eachLine = xl.prototype.iter;
    var wl = "iter insert remove copy getEditor constructor".split(" ");
    for (var Sl in xl.prototype) xl.prototype.hasOwnProperty(Sl) && Hi(wl, Sl) < 0 && (e.prototype[Sl] = function (e) {
        return function () {
            return e.apply(this.doc, arguments)
        }
    }(xl.prototype[Sl]));
    Ni(xl);
    var Cl = e.e_preventDefault = function (e) {
        e.preventDefault ? e.preventDefault() : e.returnValue = !1
    }, kl = e.e_stopPropagation = function (e) {
        e.stopPropagation ? e.stopPropagation() : e.cancelBubble = !0
    }, Ll = e.e_stop = function (e) {
        Cl(e), kl(e)
    }, Ml = e.on = function (e, t, r) {
        if (e.addEventListener) e.addEventListener(t, r, !1); else if (e.attachEvent) e.attachEvent("on" + t, r); else {
            var n = e._handlers || (e._handlers = {}), i = n[t] || (n[t] = []);
            i.push(r)
        }
    }, Tl = [], Nl = e.off = function (e, t, r) {
        if (e.removeEventListener) e.removeEventListener(t, r, !1); else if (e.detachEvent) e.detachEvent("on" + t, r); else for (var n = Si(e, t, !1), i = 0; i < n.length; ++i) if (n[i] == r) {
            n.splice(i, 1);
            break
        }
    }, Al = e.signal = function (e, t) {
        var r = Si(e, t, !0);
        if (r.length) for (var n = Array.prototype.slice.call(arguments, 2), i = 0; i < r.length; ++i) r[i].apply(null, n)
    }, Dl = null, Ol = 30, Hl = e.Pass = {
        toString: function () {
            return "CodeMirror.Pass"
        }
    }, El = {scroll: !1}, Wl = {origin: "*mouse"}, Il = {origin: "+move"};
    Ai.prototype.set = function (e, t) {
        clearTimeout(this.id), this.id = setTimeout(t, e)
    };
    var Fl = e.countColumn = function (e, t, r, n, i) {
        null == t && (t = e.search(/[^\s\u00a0]/), -1 == t && (t = e.length));
        for (var o = n || 0, l = i || 0; ;) {
            var a = e.indexOf("	", o);
            if (0 > a || a >= t) return l + (t - o);
            l += a - o, l += r - l % r, o = a + 1
        }
    }, Pl = e.findColumn = function (e, t, r) {
        for (var n = 0, i = 0; ;) {
            var o = e.indexOf("	", n);
            -1 == o && (o = e.length);
            var l = o - n;
            if (o == e.length || i + l >= t) return n + Math.min(l, t - i);
            if (i += o - n, i += r - i % r, n = o + 1, i >= t) return n
        }
    }, Bl = [""], zl = function (e) {
        e.select()
    };
    Lo ? zl = function (e) {
        e.selectionStart = 0, e.selectionEnd = e.value.length
    } : mo && (zl = function (e) {
        try {
            e.select()
        } catch (t) {
        }
    });
    var _l,
        Rl = /[\u00df\u0587\u0590-\u05f4\u0600-\u06ff\u3040-\u309f\u30a0-\u30ff\u3400-\u4db5\u4e00-\u9fcc\uac00-\ud7af]/,
        ql = e.isWordChar = function (e) {
            return /\w/.test(e) || e > "" && (e.toUpperCase() != e.toLowerCase() || Rl.test(e))
        },
        Ul = /[\u0300-\u036f\u0483-\u0489\u0591-\u05bd\u05bf\u05c1\u05c2\u05c4\u05c5\u05c7\u0610-\u061a\u064b-\u065e\u0670\u06d6-\u06dc\u06de-\u06e4\u06e7\u06e8\u06ea-\u06ed\u0711\u0730-\u074a\u07a6-\u07b0\u07eb-\u07f3\u0816-\u0819\u081b-\u0823\u0825-\u0827\u0829-\u082d\u0900-\u0902\u093c\u0941-\u0948\u094d\u0951-\u0955\u0962\u0963\u0981\u09bc\u09be\u09c1-\u09c4\u09cd\u09d7\u09e2\u09e3\u0a01\u0a02\u0a3c\u0a41\u0a42\u0a47\u0a48\u0a4b-\u0a4d\u0a51\u0a70\u0a71\u0a75\u0a81\u0a82\u0abc\u0ac1-\u0ac5\u0ac7\u0ac8\u0acd\u0ae2\u0ae3\u0b01\u0b3c\u0b3e\u0b3f\u0b41-\u0b44\u0b4d\u0b56\u0b57\u0b62\u0b63\u0b82\u0bbe\u0bc0\u0bcd\u0bd7\u0c3e-\u0c40\u0c46-\u0c48\u0c4a-\u0c4d\u0c55\u0c56\u0c62\u0c63\u0cbc\u0cbf\u0cc2\u0cc6\u0ccc\u0ccd\u0cd5\u0cd6\u0ce2\u0ce3\u0d3e\u0d41-\u0d44\u0d4d\u0d57\u0d62\u0d63\u0dca\u0dcf\u0dd2-\u0dd4\u0dd6\u0ddf\u0e31\u0e34-\u0e3a\u0e47-\u0e4e\u0eb1\u0eb4-\u0eb9\u0ebb\u0ebc\u0ec8-\u0ecd\u0f18\u0f19\u0f35\u0f37\u0f39\u0f71-\u0f7e\u0f80-\u0f84\u0f86\u0f87\u0f90-\u0f97\u0f99-\u0fbc\u0fc6\u102d-\u1030\u1032-\u1037\u1039\u103a\u103d\u103e\u1058\u1059\u105e-\u1060\u1071-\u1074\u1082\u1085\u1086\u108d\u109d\u135f\u1712-\u1714\u1732-\u1734\u1752\u1753\u1772\u1773\u17b7-\u17bd\u17c6\u17c9-\u17d3\u17dd\u180b-\u180d\u18a9\u1920-\u1922\u1927\u1928\u1932\u1939-\u193b\u1a17\u1a18\u1a56\u1a58-\u1a5e\u1a60\u1a62\u1a65-\u1a6c\u1a73-\u1a7c\u1a7f\u1b00-\u1b03\u1b34\u1b36-\u1b3a\u1b3c\u1b42\u1b6b-\u1b73\u1b80\u1b81\u1ba2-\u1ba5\u1ba8\u1ba9\u1c2c-\u1c33\u1c36\u1c37\u1cd0-\u1cd2\u1cd4-\u1ce0\u1ce2-\u1ce8\u1ced\u1dc0-\u1de6\u1dfd-\u1dff\u200c\u200d\u20d0-\u20f0\u2cef-\u2cf1\u2de0-\u2dff\u302a-\u302f\u3099\u309a\ua66f-\ua672\ua67c\ua67d\ua6f0\ua6f1\ua802\ua806\ua80b\ua825\ua826\ua8c4\ua8e0-\ua8f1\ua926-\ua92d\ua947-\ua951\ua980-\ua982\ua9b3\ua9b6-\ua9b9\ua9bc\uaa29-\uaa2e\uaa31\uaa32\uaa35\uaa36\uaa43\uaa4c\uaab0\uaab2-\uaab4\uaab7\uaab8\uaabe\uaabf\uaac1\uabe5\uabe8\uabed\udc00-\udfff\ufb1e\ufe00-\ufe0f\ufe20-\ufe26\uff9e\uff9f]/;
    _l = document.createRange ? function (e, t, r, n) {
        var i = document.createRange();
        return i.setEnd(n || e, r), i.setStart(e, t), i
    } : function (e, t, r) {
        var n = document.body.createTextRange();
        try {
            n.moveToElementText(e.parentNode)
        } catch (i) {
            return n
        }
        return n.collapse(!0), n.moveEnd("character", r), n.moveStart("character", t), n
    };
    var Gl = e.contains = function (e, t) {
        if (3 == t.nodeType && (t = t.parentNode), e.contains) return e.contains(t);
        do if (11 == t.nodeType && (t = t.host), t == e) return !0; while (t = t.parentNode)
    };
    mo && 11 > vo && (Gi = function () {
        try {
            return document.activeElement
        } catch (e) {
            return document.body
        }
    });
    var jl, $l, Vl = e.rmClass = function (e, t) {
        var r = e.className, n = ji(t).exec(r);
        if (n) {
            var i = r.slice(n.index + n[0].length);
            e.className = r.slice(0, n.index) + (i ? n[1] + i : "")
        }
    }, Kl = e.addClass = function (e, t) {
        var r = e.className;
        ji(t).test(r) || (e.className += (r ? " " : "") + t)
    }, Xl = !1, Yl = function () {
        if (mo && 9 > vo) return !1;
        var e = Ri("div");
        return "draggable" in e || "dragDrop" in e
    }(), Zl = e.splitLines = 3 != "\n\nb".split(/\n/).length ? function (e) {
        for (var t = 0, r = [], n = e.length; n >= t;) {
            var i = e.indexOf("\n", t);
            -1 == i && (i = e.length);
            var o = e.slice(t, "\r" == e.charAt(i - 1) ? i - 1 : i), l = o.indexOf("\r");
            -1 != l ? (r.push(o.slice(0, l)), t += l + 1) : (r.push(o), t = i + 1)
        }
        return r
    } : function (e) {
        return e.split(/\r\n?|\n/)
    }, Ql = window.getSelection ? function (e) {
        try {
            return e.selectionStart != e.selectionEnd
        } catch (t) {
            return !1
        }
    } : function (e) {
        try {
            var t = e.ownerDocument.selection.createRange()
        } catch (r) {
        }
        return t && t.parentElement() == e ? 0 != t.compareEndPoints("StartToEnd", t) : !1
    }, Jl = function () {
        var e = Ri("div");
        return "oncopy" in e ? !0 : (e.setAttribute("oncopy", "return;"), "function" == typeof e.oncopy)
    }(), ea = null, ta = e.keyNames = {
        3: "Enter",
        8: "Backspace",
        9: "Tab",
        13: "Enter",
        16: "Shift",
        17: "Ctrl",
        18: "Alt",
        19: "Pause",
        20: "CapsLock",
        27: "Esc",
        32: "Space",
        33: "PageUp",
        34: "PageDown",
        35: "End",
        36: "Home",
        37: "Left",
        38: "Up",
        39: "Right",
        40: "Down",
        44: "PrintScrn",
        45: "Insert",
        46: "Delete",
        59: ";",
        61: "=",
        91: "Mod",
        92: "Mod",
        93: "Mod",
        106: "*",
        107: "=",
        109: "-",
        110: ".",
        111: "/",
        127: "Delete",
        173: "-",
        186: ";",
        187: "=",
        188: ",",
        189: "-",
        190: ".",
        191: "/",
        192: "`",
        219: "[",
        220: "\\",
        221: "]",
        222: "'",
        63232: "Up",
        63233: "Down",
        63234: "Left",
        63235: "Right",
        63272: "Delete",
        63273: "Home",
        63275: "End",
        63276: "PageUp",
        63277: "PageDown",
        63302: "Insert"
    };
    !function () {
        for (var e = 0; 10 > e; e++) ta[e + 48] = ta[e + 96] = String(e);
        for (var e = 65; 90 >= e; e++) ta[e] = String.fromCharCode(e);
        for (var e = 1; 12 >= e; e++) ta[e + 111] = ta[e + 63235] = "F" + e
    }();
    var ra, na = function () {
        function e(e) {
            return 247 >= e ? r.charAt(e) : e >= 1424 && 1524 >= e ? "R" : e >= 1536 && 1773 >= e ? n.charAt(e - 1536) : e >= 1774 && 2220 >= e ? "r" : e >= 8192 && 8203 >= e ? "w" : 8204 == e ? "b" : "L"
        }

        function t(e, t, r) {
            this.level = e, this.from = t, this.to = r
        }

        var r = "bbbbbbbbbtstwsbbbbbbbbbbbbbbssstwNN%%%NNNNNN,N,N1111111111NNNNNNNLLLLLLLLLLLLLLLLLLLLLLLLLLNNNNNNLLLLLLLLLLLLLLLLLLLLLLLLLLNNNNbbbbbbsbbbbbbbbbbbbbbbbbbbbbbbbbb,N%%%%NNNNLNNNNN%%11NLNNN1LNNNNNLLLLLLLLLLLLLLLLLLLLLLLNLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLN",
            n = "rrrrrrrrrrrr,rNNmmmmmmrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrmmmmmmmmmmmmmmrrrrrrrnnnnnnnnnn%nnrrrmrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrmmmmmmmmmmmmmmmmmmmNmmmm",
            i = /[\u0590-\u05f4\u0600-\u06ff\u0700-\u08ac]/, o = /[stwN]/, l = /[LRr]/, a = /[Lb1n]/, s = /[1n]/,
            u = "L";
        return function (r) {
            if (!i.test(r)) return !1;
            for (var n, c = r.length, h = [], d = 0; c > d; ++d) h.push(n = e(r.charCodeAt(d)));
            for (var d = 0, f = u; c > d; ++d) {
                var n = h[d];
                "m" == n ? h[d] = f : f = n
            }
            for (var d = 0, p = u; c > d; ++d) {
                var n = h[d];
                "1" == n && "r" == p ? h[d] = "n" : l.test(n) && (p = n, "r" == n && (h[d] = "R"))
            }
            for (var d = 1, f = h[0]; c - 1 > d; ++d) {
                var n = h[d];
                "+" == n && "1" == f && "1" == h[d + 1] ? h[d] = "1" : "," != n || f != h[d + 1] || "1" != f && "n" != f || (h[d] = f), f = n
            }
            for (var d = 0; c > d; ++d) {
                var n = h[d];
                if ("," == n) h[d] = "N"; else if ("%" == n) {
                    for (var g = d + 1; c > g && "%" == h[g]; ++g) ;
                    for (var m = d && "!" == h[d - 1] || c > g && "1" == h[g] ? "1" : "N", v = d; g > v; ++v) h[v] = m;
                    d = g - 1
                }
            }
            for (var d = 0, p = u; c > d; ++d) {
                var n = h[d];
                "L" == p && "1" == n ? h[d] = "L" : l.test(n) && (p = n)
            }
            for (var d = 0; c > d; ++d) if (o.test(h[d])) {
                for (var g = d + 1; c > g && o.test(h[g]); ++g) ;
                for (var y = "L" == (d ? h[d - 1] : u), b = "L" == (c > g ? h[g] : u), m = y || b ? "L" : "R", v = d; g > v; ++v) h[v] = m;
                d = g - 1
            }
            for (var x, w = [], d = 0; c > d;) if (a.test(h[d])) {
                var S = d;
                for (++d; c > d && a.test(h[d]); ++d) ;
                w.push(new t(0, S, d))
            } else {
                var C = d, k = w.length;
                for (++d; c > d && "L" != h[d]; ++d) ;
                for (var v = C; d > v;) if (s.test(h[v])) {
                    v > C && w.splice(k, 0, new t(1, C, v));
                    var L = v;
                    for (++v; d > v && s.test(h[v]); ++v) ;
                    w.splice(k, 0, new t(2, L, v)), C = v
                } else ++v;
                d > C && w.splice(k, 0, new t(1, C, d))
            }
            return 1 == w[0].level && (x = r.match(/^\s+/)) && (w[0].from = x[0].length, w.unshift(new t(0, 0, x[0].length))), 1 == Oi(w).level && (x = r.match(/\s+$/)) && (Oi(w).to -= x[0].length, w.push(new t(0, c - x[0].length, c))), 2 == w[0].level && w.unshift(new t(1, w[0].to, w[0].to)), w[0].level != Oi(w).level && w.push(new t(w[0].level, c, c)), w
        }
    }();
    return e.version = "5.7.1", e
}), function (e) {
    "object" == typeof exports && "object" == typeof module ? e(require("../../lib/codemirror")) : "function" == typeof define && define.amd ? define(["../../lib/codemirror"], e) : e(CodeMirror)
}(function (e) {
    "use strict";
    var t = /^(\s*)(>[> ]*|[*+-]\s|(\d+)([.)]))(\s*)/, r = /^(\s*)(>[> ]*|[*+-]|(\d+)[.)])(\s*)$/, n = /[*+-]\s/;
    e.commands.newlineAndIndentContinueMarkdownList = function (i) {
        if (i.getOption("disableInput")) return e.Pass;
        for (var o = i.listSelections(), l = [], a = 0; a < o.length; a++) {
            var s = o[a].head, u = i.getStateAfter(s.line), c = u.list !== !1, h = 0 !== u.quote, d = i.getLine(s.line),
                f = t.exec(d);
            if (!o[a].empty() || !c && !h || !f) return void i.execCommand("newlineAndIndent");
            if (r.test(d)) i.replaceRange("", {line: s.line, ch: 0}, {line: s.line, ch: s.ch + 1}), l[a] = "\n"; else {
                var p = f[1], g = f[5],
                    m = n.test(f[2]) || f[2].indexOf(">") >= 0 ? f[2] : parseInt(f[3], 10) + 1 + f[4];
                l[a] = "\n" + p + m + g
            }
        }
        i.replaceSelections(l)
    }
}), function (e) {
    "object" == typeof exports && "object" == typeof module ? e(require("../../lib/codemirror")) : "function" == typeof define && define.amd ? define(["../../lib/codemirror"], e) : e(CodeMirror)
}(function (e) {
    "use strict";
    e.commands.tabAndIndentMarkdownList = function (e) {
        var t = e.listSelections(), r = t[0].head, n = e.getStateAfter(r.line), i = n.list !== !1;
        if (i) return void e.execCommand("indentMore");
        if (e.options.indentWithTabs) e.execCommand("insertTab"); else {
            var o = Array(e.options.tabSize + 1).join(" ");
            e.replaceSelection(o)
        }
    }, e.commands.shiftTabAndUnindentMarkdownList = function (e) {
        var t = e.listSelections(), r = t[0].head, n = e.getStateAfter(r.line), i = n.list !== !1;
        if (i) return void e.execCommand("indentLess");
        if (e.options.indentWithTabs) e.execCommand("insertTab"); else {
            var o = Array(e.options.tabSize + 1).join(" ");
            e.replaceSelection(o)
        }
    }
}), function (e) {
    "object" == typeof exports && "object" == typeof module ? e(require("../../lib/codemirror")) : "function" == typeof define && define.amd ? define(["../../lib/codemirror"], e) : e(CodeMirror)
}(function (e) {
    "use strict";

    function t(e) {
        var t = e.getWrapperElement();
        e.state.fullScreenRestore = {
            scrollTop: window.pageYOffset,
            scrollLeft: window.pageXOffset,
            width: t.style.width,
            height: t.style.height
        }, t.style.width = "", t.style.height = "auto", t.className += " CodeMirror-fullscreen", document.documentElement.style.overflow = "hidden", e.refresh()
    }

    function r(e) {
        var t = e.getWrapperElement();
        t.className = t.className.replace(/\s*CodeMirror-fullscreen\b/, ""), document.documentElement.style.overflow = "";
        var r = e.state.fullScreenRestore;
        t.style.width = r.width, t.style.height = r.height, window.scrollTo(r.scrollLeft, r.scrollTop), e.refresh()
    }

    e.defineOption("fullScreen", !1, function (n, i, o) {
        o == e.Init && (o = !1), !o != !i && (i ? t(n) : r(n))
    })
}), function (e) {
    "object" == typeof exports && "object" == typeof module ? e(require("../../lib/codemirror"), require("../xml/xml"), require("../meta")) : "function" == typeof define && define.amd ? define(["../../lib/codemirror", "../xml/xml", "../meta"], e) : e(CodeMirror)
}(function (e) {
    "use strict";
    e.defineMode("markdown", function (t, r) {
        function n(r) {
            if (e.findModeByName) {
                var n = e.findModeByName(r);
                n && (r = n.mime || n.mimes[0])
            }
            var i = e.getMode(t, r);
            return "null" == i.name ? null : i
        }

        function i(e, t, r) {
            return t.f = t.inline = r, r(e, t)
        }

        function o(e, t, r) {
            return t.f = t.block = r, r(e, t)
        }

        function l(e) {
            return !e || !/\S/.test(e.string)
        }

        function a(e) {
            return e.linkTitle = !1, e.em = !1, e.strong = !1, e.strikethrough = !1, e.quote = 0, e.indentedCode = !1, S || e.f != u || (e.f = p, e.block = s), e.trailingSpace = 0, e.trailingSpaceNewLine = !1, e.prevLine = e.thisLine, e.thisLine = null, null
        }

        function s(e, t) {
            var o = e.sol(), a = t.list !== !1, s = t.indentedCode;
            t.indentedCode = !1, a && (t.indentationDiff >= 0 ? (t.indentationDiff < 4 && (t.indentation -= t.indentationDiff), t.list = null) : t.indentation > 0 ? (t.list = null, t.listDepth = Math.floor(t.indentation / 4)) : (t.list = !1, t.listDepth = 0));
            var u = null;
            if (t.indentationDiff >= 4) return e.skipToEnd(), s || l(t.prevLine) ? (t.indentation -= 4, t.indentedCode = !0, M) : null;
            if (e.eatSpace()) return null;
            if ((u = e.match(j)) && u[1].length <= 6) return t.header = u[1].length, r.highlightFormatting && (t.formatting = "header"), t.f = t.inline, d(t);
            if (!(l(t.prevLine) || t.quote || a || s) && (u = e.match($))) return t.header = "=" == u[0].charAt(0) ? 1 : 2, r.highlightFormatting && (t.formatting = "header"), t.f = t.inline, d(t);
            if (e.eat(">")) return t.quote = o ? 1 : t.quote + 1, r.highlightFormatting && (t.formatting = "quote"), e.eatSpace(), d(t);
            if ("[" === e.peek()) return i(e, t, y);
            if (e.match(R, !0)) return t.hr = !0, O;
            if ((l(t.prevLine) || a) && (e.match(q, !1) || e.match(U, !1))) {
                var h = null;
                return e.match(q, !0) ? h = "ul" : (e.match(U, !0), h = "ol"), t.indentation = e.column() + e.current().length, t.list = !0, t.listDepth++, r.taskLists && e.match(G, !1) && (t.taskList = !0), t.f = t.inline, r.highlightFormatting && (t.formatting = ["list", "list-" + h]), d(t)
            }
            return r.fencedCodeBlocks && (u = e.match(K, !0)) ? (t.fencedChars = u[1], t.localMode = n(u[2]), t.localMode && (t.localState = t.localMode.startState()), t.f = t.block = c, r.highlightFormatting && (t.formatting = "code-block"), t.code = !0, d(t)) : i(e, t, t.inline)
        }

        function u(e, t) {
            var r = C.token(e, t.htmlState);
            return (S && null === t.htmlState.tagStart && !t.htmlState.context && t.htmlState.tokenize.isInText || t.md_inside && e.current().indexOf(">") > -1) && (t.f = p, t.block = s, t.htmlState = null), r
        }

        function c(e, t) {
            return e.sol() && t.fencedChars && e.match(t.fencedChars, !1) ? (t.localMode = t.localState = null, t.f = t.block = h, null) : t.localMode ? t.localMode.token(e, t.localState) : (e.skipToEnd(), M)
        }

        function h(e, t) {
            e.match(t.fencedChars), t.block = s, t.f = p, t.fencedChars = null, r.highlightFormatting && (t.formatting = "code-block"), t.code = !0;
            var n = d(t);
            return t.code = !1, n
        }

        function d(e) {
            var t = [];
            if (e.formatting) {
                t.push(E), "string" == typeof e.formatting && (e.formatting = [e.formatting]);
                for (var n = 0; n < e.formatting.length; n++) t.push(E + "-" + e.formatting[n]), "header" === e.formatting[n] && t.push(E + "-" + e.formatting[n] + "-" + e.header), "quote" === e.formatting[n] && (!r.maxBlockquoteDepth || r.maxBlockquoteDepth >= e.quote ? t.push(E + "-" + e.formatting[n] + "-" + e.quote) : t.push("error"))
            }
            if (e.taskOpen) return t.push("meta"), t.length ? t.join(" ") : null;
            if (e.taskClosed) return t.push("property"), t.length ? t.join(" ") : null;
            if (e.linkHref ? t.push(P, "url") : (e.strong && t.push(z), e.em && t.push(B), e.strikethrough && t.push(_), e.linkText && t.push(F), e.code && t.push(M)), e.header && (t.push(L), t.push(L + "-" + e.header)), e.quote && (t.push(T), !r.maxBlockquoteDepth || r.maxBlockquoteDepth >= e.quote ? t.push(T + "-" + e.quote) : t.push(T + "-" + r.maxBlockquoteDepth)), e.list !== !1) {
                var i = (e.listDepth - 1) % 3;
                i ? 1 === i ? t.push(A) : t.push(D) : t.push(N)
            }
            return e.trailingSpaceNewLine ? t.push("trailing-space-new-line") : e.trailingSpace && t.push("trailing-space-" + (e.trailingSpace % 2 ? "a" : "b")), t.length ? t.join(" ") : null
        }

        function f(e, t) {
            return e.match(V, !0) ? d(t) : void 0
        }

        function p(t, n) {
            var i = n.text(t, n);
            if ("undefined" != typeof i) return i;
            if (n.list) return n.list = null, d(n);
            if (n.taskList) {
                var l = "x" !== t.match(G, !0)[1];
                return l ? n.taskOpen = !0 : n.taskClosed = !0, r.highlightFormatting && (n.formatting = "task"), n.taskList = !1, d(n)
            }
            if (n.taskOpen = !1, n.taskClosed = !1, n.header && t.match(/^#+$/, !0)) return r.highlightFormatting && (n.formatting = "header"), d(n);
            var a = t.sol(), s = t.next();
            if ("\\" === s && (t.next(), r.highlightFormatting)) {
                var c = d(n);
                return c ? c + " formatting-escape" : "formatting-escape"
            }
            if (n.linkTitle) {
                n.linkTitle = !1;
                var h = s;
                "(" === s && (h = ")"), h = (h + "").replace(/([.?*+^$[\]\\(){}|-])/g, "\\$1");
                var f = "^\\s*(?:[^" + h + "\\\\]+|\\\\\\\\|\\\\.)" + h;
                if (t.match(new RegExp(f), !0)) return P
            }
            if ("`" === s) {
                var p = n.formatting;
                r.highlightFormatting && (n.formatting = "code");
                var v = d(n), y = t.pos;
                t.eatWhile("`");
                var b = 1 + t.pos - y;
                return n.code ? b === k ? (n.code = !1, v) : (n.formatting = p, d(n)) : (k = b, n.code = !0, d(n))
            }
            if (n.code) return d(n);
            if ("!" === s && t.match(/\[[^\]]*\] ?(?:\(|\[)/, !1)) return t.match(/\[[^\]]*\]/), n.inline = n.f = m, H;
            if ("[" === s && t.match(/.*\](\(.*\)| ?\[.*\])/, !1)) return n.linkText = !0, r.highlightFormatting && (n.formatting = "link"), d(n);
            if ("]" === s && n.linkText && t.match(/\(.*\)| ?\[.*\]/, !1)) {
                r.highlightFormatting && (n.formatting = "link");
                var c = d(n);
                return n.linkText = !1, n.inline = n.f = m, c
            }
            if ("<" === s && t.match(/^(https?|ftps?):\/\/(?:[^\\>]|\\.)+>/, !1)) {
                n.f = n.inline = g, r.highlightFormatting && (n.formatting = "link");
                var c = d(n);
                return c ? c += " " : c = "", c + W
            }
            if ("<" === s && t.match(/^[^> \\]+@(?:[^\\>]|\\.)+>/, !1)) {
                n.f = n.inline = g, r.highlightFormatting && (n.formatting = "link");
                var c = d(n);
                return c ? c += " " : c = "", c + I
            }
            if ("<" === s && t.match(/^(!--|\w)/, !1)) {
                var x = t.string.indexOf(">", t.pos);
                if (-1 != x) {
                    var w = t.string.substring(t.start, x);
                    /markdown\s*=\s*('|"){0,1}1('|"){0,1}/.test(w) && (n.md_inside = !0)
                }
                return t.backUp(1), n.htmlState = e.startState(C), o(t, n, u)
            }
            if ("<" === s && t.match(/^\/\w*?>/)) return n.md_inside = !1, "tag";
            var S = !1;
            if (!r.underscoresBreakWords && "_" === s && "_" !== t.peek() && t.match(/(\w)/, !1)) {
                var L = t.pos - 2;
                if (L >= 0) {
                    var M = t.string.charAt(L);
                    "_" !== M && M.match(/(\w)/, !1) && (S = !0)
                }
            }
            if ("*" === s || "_" === s && !S) if (a && " " === t.peek()) ; else {
                if (n.strong === s && t.eat(s)) {
                    r.highlightFormatting && (n.formatting = "strong");
                    var v = d(n);
                    return n.strong = !1, v
                }
                if (!n.strong && t.eat(s)) return n.strong = s, r.highlightFormatting && (n.formatting = "strong"), d(n);
                if (n.em === s) {
                    r.highlightFormatting && (n.formatting = "em");
                    var v = d(n);
                    return n.em = !1, v
                }
                if (!n.em) return n.em = s, r.highlightFormatting && (n.formatting = "em"), d(n)
            } else if (" " === s && (t.eat("*") || t.eat("_"))) {
                if (" " === t.peek()) return d(n);
                t.backUp(1)
            }
            if (r.strikethrough) if ("~" === s && t.eatWhile(s)) {
                if (n.strikethrough) {
                    r.highlightFormatting && (n.formatting = "strikethrough");
                    var v = d(n);
                    return n.strikethrough = !1, v
                }
                if (t.match(/^[^\s]/, !1)) return n.strikethrough = !0, r.highlightFormatting && (n.formatting = "strikethrough"), d(n)
            } else if (" " === s && t.match(/^~~/, !0)) {
                if (" " === t.peek()) return d(n);
                t.backUp(2)
            }
            return " " === s && (t.match(/ +$/, !1) ? n.trailingSpace++ : n.trailingSpace && (n.trailingSpaceNewLine = !0)), d(n)
        }

        function g(e, t) {
            var n = e.next();
            if (">" === n) {
                t.f = t.inline = p, r.highlightFormatting && (t.formatting = "link");
                var i = d(t);
                return i ? i += " " : i = "", i + W
            }
            return e.match(/^[^>]+/, !0), W
        }

        function m(e, t) {
            if (e.eatSpace()) return null;
            var n = e.next();
            return "(" === n || "[" === n ? (t.f = t.inline = v("(" === n ? ")" : "]"), r.highlightFormatting && (t.formatting = "link-string"), t.linkHref = !0, d(t)) : "error"
        }

        function v(e) {
            return function (t, n) {
                var i = t.next();
                if (i === e) {
                    n.f = n.inline = p, r.highlightFormatting && (n.formatting = "link-string");
                    var o = d(n);
                    return n.linkHref = !1, o
                }
                return t.match(w(e), !0) && t.backUp(1), n.linkHref = !0, d(n)
            }
        }

        function y(e, t) {
            return e.match(/^[^\]]*\]:/, !1) ? (t.f = b, e.next(), r.highlightFormatting && (t.formatting = "link"), t.linkText = !0, d(t)) : i(e, t, p)
        }

        function b(e, t) {
            if (e.match(/^\]:/, !0)) {
                t.f = t.inline = x, r.highlightFormatting && (t.formatting = "link");
                var n = d(t);
                return t.linkText = !1, n
            }
            return e.match(/^[^\]]+/, !0), F
        }

        function x(e, t) {
            return e.eatSpace() ? null : (e.match(/^[^\s]+/, !0), void 0 === e.peek() ? t.linkTitle = !0 : e.match(/^(?:\s+(?:"(?:[^"\\]|\\\\|\\.)+"|'(?:[^'\\]|\\\\|\\.)+'|\((?:[^)\\]|\\\\|\\.)+\)))?/, !0), t.f = t.inline = p, P + " url")
        }

        function w(e) {
            return X[e] || (e = (e + "").replace(/([.?*+^$[\]\\(){}|-])/g, "\\$1"), X[e] = new RegExp("^(?:[^\\\\]|\\\\.)*?(" + e + ")")), X[e]
        }

        var S = e.modes.hasOwnProperty("xml"), C = e.getMode(t, S ? {name: "xml", htmlMode: !0} : "text/plain");
        void 0 === r.highlightFormatting && (r.highlightFormatting = !1), void 0 === r.maxBlockquoteDepth && (r.maxBlockquoteDepth = 0), void 0 === r.underscoresBreakWords && (r.underscoresBreakWords = !0), void 0 === r.taskLists && (r.taskLists = !1), void 0 === r.strikethrough && (r.strikethrough = !1);
        var k = 0, L = "header", M = "comment", T = "quote", N = "variable-2", A = "variable-3", D = "keyword",
            O = "hr", H = "tag", E = "formatting", W = "link", I = "link", F = "link", P = "string", B = "em",
            z = "strong", _ = "strikethrough", R = /^([*\-_])(?:\s*\1){2,}\s*$/, q = /^[*\-+]\s+/,
            U = /^[0-9]+([.)])\s+/, G = /^\[(x| )\](?=\s)/, j = r.allowAtxHeaderWithoutSpace ? /^(#+)/ : /^(#+)(?: |$)/,
            $ = /^ *(?:\={1,}|-{1,})\s*$/, V = /^[^#!\[\]*_\\<>` "'(~]+/,
            K = new RegExp("^(" + (r.fencedCodeBlocks === !0 ? "~~~+|```+" : r.fencedCodeBlocks) + ")[ \\t]*([\\w+#]*)"),
            X = [], Y = {
                startState: function () {
                    return {
                        f: s,
                        prevLine: null,
                        thisLine: null,
                        block: s,
                        htmlState: null,
                        indentation: 0,
                        inline: p,
                        text: f,
                        formatting: !1,
                        linkText: !1,
                        linkHref: !1,
                        linkTitle: !1,
                        em: !1,
                        strong: !1,
                        header: 0,
                        hr: !1,
                        taskList: !1,
                        list: !1,
                        listDepth: 0,
                        quote: 0,
                        trailingSpace: 0,
                        trailingSpaceNewLine: !1,
                        strikethrough: !1,
                        fencedChars: null
                    }
                }, copyState: function (t) {
                    return {
                        f: t.f,
                        prevLine: t.prevLine,
                        thisLine: t["this"],
                        block: t.block,
                        htmlState: t.htmlState && e.copyState(C, t.htmlState),
                        indentation: t.indentation,
                        localMode: t.localMode,
                        localState: t.localMode ? e.copyState(t.localMode, t.localState) : null,
                        inline: t.inline,
                        text: t.text,
                        formatting: !1,
                        linkTitle: t.linkTitle,
                        code: t.code,
                        em: t.em,
                        strong: t.strong,
                        strikethrough: t.strikethrough,
                        header: t.header,
                        hr: t.hr,
                        taskList: t.taskList,
                        list: t.list,
                        listDepth: t.listDepth,
                        quote: t.quote,
                        indentedCode: t.indentedCode,
                        trailingSpace: t.trailingSpace,
                        trailingSpaceNewLine: t.trailingSpaceNewLine,
                        md_inside: t.md_inside,
                        fencedChars: t.fencedChars
                    }
                }, token: function (e, t) {
                    if (t.formatting = !1, e != t.thisLine) {
                        var r = t.header || t.hr;
                        if (t.header = 0, t.hr = !1, e.match(/^\s*$/, !0) || r) {
                            if (a(t), !r) return null;
                            t.prevLine = null
                        }
                        t.prevLine = t.thisLine, t.thisLine = e, t.taskList = !1, t.trailingSpace = 0, t.trailingSpaceNewLine = !1, t.f = t.block;
                        var n = e.match(/^\s*/, !0)[0].replace(/\t/g, "    ").length,
                            i = 4 * Math.floor((n - t.indentation) / 4);
                        i > 4 && (i = 4);
                        var o = t.indentation + i;
                        if (t.indentationDiff = o - t.indentation, t.indentation = o, n > 0) return null
                    }
                    return t.f(e, t)
                }, innerMode: function (e) {
                    return e.block == u ? {state: e.htmlState, mode: C} : e.localState ? {
                        state: e.localState,
                        mode: e.localMode
                    } : {state: e, mode: Y}
                }, blankLine: a, getType: d, fold: "markdown"
            };
        return Y
    }, "xml"), e.defineMIME("text/x-markdown", "markdown")
}), function (e) {
    "object" == typeof exports && "object" == typeof module ? e(require("../../lib/codemirror")) : "function" == typeof define && define.amd ? define(["../../lib/codemirror"], e) : e(CodeMirror)
}(function (e) {
    "use strict";
    e.overlayMode = function (t, r, n) {
        return {
            startState: function () {
                return {
                    base: e.startState(t),
                    overlay: e.startState(r),
                    basePos: 0,
                    baseCur: null,
                    overlayPos: 0,
                    overlayCur: null,
                    streamSeen: null
                }
            }, copyState: function (n) {
                return {
                    base: e.copyState(t, n.base),
                    overlay: e.copyState(r, n.overlay),
                    basePos: n.basePos,
                    baseCur: null,
                    overlayPos: n.overlayPos,
                    overlayCur: null
                }
            }, token: function (e, i) {
                return (e != i.streamSeen || Math.min(i.basePos, i.overlayPos) < e.start) && (i.streamSeen = e, i.basePos = i.overlayPos = e.start), e.start == i.basePos && (i.baseCur = t.token(e, i.base), i.basePos = e.pos), e.start == i.overlayPos && (e.pos = e.start, i.overlayCur = r.token(e, i.overlay), i.overlayPos = e.pos), e.pos = Math.min(i.basePos, i.overlayPos), null == i.overlayCur ? i.baseCur : null != i.baseCur && i.overlay.combineTokens || n && null == i.overlay.combineTokens ? i.baseCur + " " + i.overlayCur : i.overlayCur
            }, indent: t.indent && function (e, r) {
                return t.indent(e.base, r)
            }, electricChars: t.electricChars, innerMode: function (e) {
                return {state: e.base, mode: t}
            }, blankLine: function (e) {
                t.blankLine && t.blankLine(e.base), r.blankLine && r.blankLine(e.overlay)
            }
        }
    }
}), function (e) {
    "object" == typeof exports && "object" == typeof module ? e(require("../../lib/codemirror"), require("../markdown/markdown"), require("../../addon/mode/overlay")) : "function" == typeof define && define.amd ? define(["../../lib/codemirror", "../markdown/markdown", "../../addon/mode/overlay"], e) : e(CodeMirror)
}(function (e) {
    "use strict";
    var t = /^((?:(?:aaas?|about|acap|adiumxtra|af[ps]|aim|apt|attachment|aw|beshare|bitcoin|bolo|callto|cap|chrome(?:-extension)?|cid|coap|com-eventbrite-attendee|content|crid|cvs|data|dav|dict|dlna-(?:playcontainer|playsingle)|dns|doi|dtn|dvb|ed2k|facetime|feed|file|finger|fish|ftp|geo|gg|git|gizmoproject|go|gopher|gtalk|h323|hcp|https?|iax|icap|icon|im|imap|info|ipn|ipp|irc[6s]?|iris(?:\.beep|\.lwz|\.xpc|\.xpcs)?|itms|jar|javascript|jms|keyparc|lastfm|ldaps?|magnet|mailto|maps|market|message|mid|mms|ms-help|msnim|msrps?|mtqp|mumble|mupdate|mvn|news|nfs|nih?|nntp|notes|oid|opaquelocktoken|palm|paparazzi|platform|pop|pres|proxy|psyc|query|res(?:ource)?|rmi|rsync|rtmp|rtsp|secondlife|service|session|sftp|sgn|shttp|sieve|sips?|skype|sm[bs]|snmp|soap\.beeps?|soldat|spotify|ssh|steam|svn|tag|teamspeak|tel(?:net)?|tftp|things|thismessage|tip|tn3270|tv|udp|unreal|urn|ut2004|vemmi|ventrilo|view-source|webcal|wss?|wtai|wyciwyg|xcon(?:-userid)?|xfire|xmlrpc\.beeps?|xmpp|xri|ymsgr|z39\.50[rs]?):(?:\/{1,3}|[a-z0-9%])|www\d{0,3}[.]|[a-z0-9.\-]+[.][a-z]{2,4}\/)(?:[^\s()<>]|\([^\s()<>]*\))+(?:\([^\s()<>]*\)|[^\s`*!()\[\]{};:'".,<>?«»“”‘’]))/i;
    e.defineMode("gfm", function (r, n) {
        function i(e) {
            return e.code = !1, null
        }

        var o = 0, l = {
            startState: function () {
                return {code: !1, codeBlock: !1, ateSpace: !1}
            }, copyState: function (e) {
                return {code: e.code, codeBlock: e.codeBlock, ateSpace: e.ateSpace}
            }, token: function (e, r) {
                if (r.combineTokens = null, r.codeBlock) return e.match(/^```+/) ? (r.codeBlock = !1, null) : (e.skipToEnd(), null);
                if (e.sol() && (r.code = !1), e.sol() && e.match(/^```+/)) return e.skipToEnd(), r.codeBlock = !0, null;
                if ("`" === e.peek()) {
                    e.next();
                    var i = e.pos;
                    e.eatWhile("`");
                    var l = 1 + e.pos - i;
                    return r.code ? l === o && (r.code = !1) : (o = l, r.code = !0), null
                }
                if (r.code) return e.next(), null;
                if (e.eatSpace()) return r.ateSpace = !0, null;
                if ((e.sol() || r.ateSpace) && (r.ateSpace = !1, n.gitHubSpice !== !1)) {
                    if (e.match(/^(?:[a-zA-Z0-9\-_]+\/)?(?:[a-zA-Z0-9\-_]+@)?(?:[a-f0-9]{7,40}\b)/)) return r.combineTokens = !0, "link";
                    if (e.match(/^(?:[a-zA-Z0-9\-_]+\/)?(?:[a-zA-Z0-9\-_]+)?#[0-9]+\b/)) return r.combineTokens = !0, "link"
                }
                return e.match(t) && "](" != e.string.slice(e.start - 2, e.start) && (0 == e.start || /\W/.test(e.string.charAt(e.start - 1))) ? (r.combineTokens = !0, "link") : (e.next(), null)
            }, blankLine: i
        }, a = {underscoresBreakWords: !1, taskLists: !0, fencedCodeBlocks: "```", strikethrough: !0};
        for (var s in n) a[s] = n[s];
        return a.name = "markdown", e.overlayMode(e.getMode(r, a), l)
    }, "markdown"), e.defineMIME("text/x-gfm", "gfm")
}), function (e) {
    "object" == typeof exports && "object" == typeof module ? e(require("../../lib/codemirror")) : "function" == typeof define && define.amd ? define(["../../lib/codemirror"], e) : e(CodeMirror)
}(function (e) {
    "use strict";
    e.defineMode("xml", function (t, r) {
        function n(e, t) {
            function r(r) {
                return t.tokenize = r, r(e, t)
            }

            var n = e.next();
            if ("<" == n) return e.eat("!") ? e.eat("[") ? e.match("CDATA[") ? r(l("atom", "]]>")) : null : e.match("--") ? r(l("comment", "-->")) : e.match("DOCTYPE", !0, !0) ? (e.eatWhile(/[\w\._\-]/), r(a(1))) : null : e.eat("?") ? (e.eatWhile(/[\w\._\-]/), t.tokenize = l("meta", "?>"), "meta") : (C = e.eat("/") ? "closeTag" : "openTag", t.tokenize = i, "tag bracket");
            if ("&" == n) {
                var o;
                return o = e.eat("#") ? e.eat("x") ? e.eatWhile(/[a-fA-F\d]/) && e.eat(";") : e.eatWhile(/[\d]/) && e.eat(";") : e.eatWhile(/[\w\.\-:]/) && e.eat(";"), o ? "atom" : "error"
            }
            return e.eatWhile(/[^&<]/), null
        }

        function i(e, t) {
            var r = e.next();
            if (">" == r || "/" == r && e.eat(">")) return t.tokenize = n, C = ">" == r ? "endTag" : "selfcloseTag", "tag bracket";
            if ("=" == r) return C = "equals", null;
            if ("<" == r) {
                t.tokenize = n, t.state = h, t.tagName = t.tagStart = null;
                var i = t.tokenize(e, t);
                return i ? i + " tag error" : "tag error"
            }
            return /[\'\"]/.test(r) ? (t.tokenize = o(r), t.stringStartCol = e.column(), t.tokenize(e, t)) : (e.match(/^[^\s\u00a0=<>\"\']*[^\s\u00a0=<>\"\'\/]/), "word")
        }

        function o(e) {
            var t = function (t, r) {
                for (; !t.eol();) if (t.next() == e) {
                    r.tokenize = i;
                    break
                }
                return "string"
            };
            return t.isInAttribute = !0, t
        }

        function l(e, t) {
            return function (r, i) {
                for (; !r.eol();) {
                    if (r.match(t)) {
                        i.tokenize = n;
                        break
                    }
                    r.next()
                }
                return e
            }
        }

        function a(e) {
            return function (t, r) {
                for (var i; null != (i = t.next());) {
                    if ("<" == i) return r.tokenize = a(e + 1), r.tokenize(t, r);
                    if (">" == i) {
                        if (1 == e) {
                            r.tokenize = n;
                            break
                        }
                        return r.tokenize = a(e - 1), r.tokenize(t, r)
                    }
                }
                return "meta"
            }
        }

        function s(e, t, r) {
            this.prev = e.context, this.tagName = t, this.indent = e.indented, this.startOfLine = r, (L.doNotIndent.hasOwnProperty(t) || e.context && e.context.noIndent) && (this.noIndent = !0)
        }

        function u(e) {
            e.context && (e.context = e.context.prev)
        }

        function c(e, t) {
            for (var r; ;) {
                if (!e.context) return;
                if (r = e.context.tagName, !L.contextGrabbers.hasOwnProperty(r) || !L.contextGrabbers[r].hasOwnProperty(t)) return;
                u(e)
            }
        }

        function h(e, t, r) {
            return "openTag" == e ? (r.tagStart = t.column(), d) : "closeTag" == e ? f : h
        }

        function d(e, t, r) {
            return "word" == e ? (r.tagName = t.current(), k = "tag", m) : (k = "error", d)
        }

        function f(e, t, r) {
            if ("word" == e) {
                var n = t.current();
                return r.context && r.context.tagName != n && L.implicitlyClosed.hasOwnProperty(r.context.tagName) && u(r), r.context && r.context.tagName == n ? (k = "tag", p) : (k = "tag error", g)
            }
            return k = "error", g
        }

        function p(e, t, r) {
            return "endTag" != e ? (k = "error", p) : (u(r), h)
        }

        function g(e, t, r) {
            return k = "error", p(e, t, r)
        }

        function m(e, t, r) {
            if ("word" == e) return k = "attribute", v;
            if ("endTag" == e || "selfcloseTag" == e) {
                var n = r.tagName, i = r.tagStart;
                return r.tagName = r.tagStart = null, "selfcloseTag" == e || L.autoSelfClosers.hasOwnProperty(n) ? c(r, n) : (c(r, n), r.context = new s(r, n, i == r.indented)), h
            }
            return k = "error", m
        }

        function v(e, t, r) {
            return "equals" == e ? y : (L.allowMissing || (k = "error"), m(e, t, r))
        }

        function y(e, t, r) {
            return "string" == e ? b : "word" == e && L.allowUnquoted ? (k = "string", m) : (k = "error", m(e, t, r))
        }

        function b(e, t, r) {
            return "string" == e ? b : m(e, t, r)
        }

        var x = t.indentUnit, w = r.multilineTagIndentFactor || 1, S = r.multilineTagIndentPastTag;
        null == S && (S = !0);
        var C, k, L = r.htmlMode ? {
            autoSelfClosers: {
                area: !0,
                base: !0,
                br: !0,
                col: !0,
                command: !0,
                embed: !0,
                frame: !0,
                hr: !0,
                img: !0,
                input: !0,
                keygen: !0,
                link: !0,
                meta: !0,
                param: !0,
                source: !0,
                track: !0,
                wbr: !0,
                menuitem: !0
            },
            implicitlyClosed: {
                dd: !0,
                li: !0,
                optgroup: !0,
                option: !0,
                p: !0,
                rp: !0,
                rt: !0,
                tbody: !0,
                td: !0,
                tfoot: !0,
                th: !0,
                tr: !0
            },
            contextGrabbers: {
                dd: {dd: !0, dt: !0},
                dt: {dd: !0, dt: !0},
                li: {li: !0},
                option: {option: !0, optgroup: !0},
                optgroup: {optgroup: !0},
                p: {
                    address: !0,
                    article: !0,
                    aside: !0,
                    blockquote: !0,
                    dir: !0,
                    div: !0,
                    dl: !0,
                    fieldset: !0,
                    footer: !0,
                    form: !0,
                    h1: !0,
                    h2: !0,
                    h3: !0,
                    h4: !0,
                    h5: !0,
                    h6: !0,
                    header: !0,
                    hgroup: !0,
                    hr: !0,
                    menu: !0,
                    nav: !0,
                    ol: !0,
                    p: !0,
                    pre: !0,
                    section: !0,
                    table: !0,
                    ul: !0
                },
                rp: {rp: !0, rt: !0},
                rt: {rp: !0, rt: !0},
                tbody: {tbody: !0, tfoot: !0},
                td: {td: !0, th: !0},
                tfoot: {tbody: !0},
                th: {td: !0, th: !0},
                thead: {tbody: !0, tfoot: !0},
                tr: {tr: !0}
            },
            doNotIndent: {pre: !0},
            allowUnquoted: !0,
            allowMissing: !0,
            caseFold: !0
        } : {
            autoSelfClosers: {},
            implicitlyClosed: {},
            contextGrabbers: {},
            doNotIndent: {},
            allowUnquoted: !1,
            allowMissing: !1,
            caseFold: !1
        }, M = r.alignCDATA;
        return n.isInText = !0, {
            startState: function () {
                return {tokenize: n, state: h, indented: 0, tagName: null, tagStart: null, context: null}
            },
            token: function (e, t) {
                if (!t.tagName && e.sol() && (t.indented = e.indentation()), e.eatSpace()) return null;
                C = null;
                var r = t.tokenize(e, t);
                return (r || C) && "comment" != r && (k = null, t.state = t.state(C || r, e, t), k && (r = "error" == k ? r + " error" : k)), r
            },
            indent: function (t, r, o) {
                var l = t.context;
                if (t.tokenize.isInAttribute) return t.tagStart == t.indented ? t.stringStartCol + 1 : t.indented + x;
                if (l && l.noIndent) return e.Pass;
                if (t.tokenize != i && t.tokenize != n) return o ? o.match(/^(\s*)/)[0].length : 0;
                if (t.tagName) return S ? t.tagStart + t.tagName.length + 2 : t.tagStart + x * w;
                if (M && /<!\[CDATA\[/.test(r)) return 0;
                var a = r && /^<(\/)?([\w_:\.-]*)/.exec(r);
                if (a && a[1]) for (; l;) {
                    if (l.tagName == a[2]) {
                        l = l.prev;
                        break
                    }
                    if (!L.implicitlyClosed.hasOwnProperty(l.tagName)) break;
                    l = l.prev
                } else if (a) for (; l;) {
                    var s = L.contextGrabbers[l.tagName];
                    if (!s || !s.hasOwnProperty(a[2])) break;
                    l = l.prev
                }
                for (; l && !l.startOfLine;) l = l.prev;
                return l ? l.indent + x : 0
            },
            electricInput: /<\/[\s\w:]+>$/,
            blockCommentStart: "<!--",
            blockCommentEnd: "-->",
            configuration: r.htmlMode ? "html" : "xml",
            helperType: r.htmlMode ? "html" : "xml"
        }
    }), e.defineMIME("text/xml", "xml"), e.defineMIME("application/xml", "xml"), e.mimeModes.hasOwnProperty("text/html") || e.defineMIME("text/html", {
        name: "xml",
        htmlMode: !0
    })
});
var Typo = function (e, t, r, n) {
    if (n = n || {}, this.platform = n.platform || "chrome", this.dictionary = null, this.rules = {}, this.dictionaryTable = {}, this.compoundRules = [], this.compoundRuleCodes = {}, this.replacementTable = [], this.flags = n.flags || {}, e) {
        if (this.dictionary = e, "chrome" == this.platform) t || (t = this._readFile(chrome.extension.getURL("lib/typo/dictionaries/" + e + "/" + e + ".aff"))), r || (r = this._readFile(chrome.extension.getURL("lib/typo/dictionaries/" + e + "/" + e + ".dic"))); else {
            var i = n.dictionaryPath || "";
            t || (t = this._readFile(i + "/" + e + "/" + e + ".aff")), r || (r = this._readFile(i + "/" + e + "/" + e + ".dic"))
        }
        this.rules = this._parseAFF(t), this.compoundRuleCodes = {};
        for (var o = 0, l = this.compoundRules.length; l > o; o++) for (var a = this.compoundRules[o], s = 0, u = a.length; u > s; s++) this.compoundRuleCodes[a[s]] = [];
        "ONLYINCOMPOUND" in this.flags && (this.compoundRuleCodes[this.flags.ONLYINCOMPOUND] = []), this.dictionaryTable = this._parseDIC(r);
        for (var o in this.compoundRuleCodes) 0 == this.compoundRuleCodes[o].length && delete this.compoundRuleCodes[o];
        for (var o = 0, l = this.compoundRules.length; l > o; o++) {
            for (var c = this.compoundRules[o], h = "", s = 0, u = c.length; u > s; s++) {
                var d = c[s];
                h += d in this.compoundRuleCodes ? "(" + this.compoundRuleCodes[d].join("|") + ")" : d
            }
            this.compoundRules[o] = new RegExp(h, "i")
        }
    }
    return this
};
Typo.prototype = {
    load: function (e) {
        for (var t in e) this[t] = e[t];
        return this
    }, _readFile: function (e, t) {
        t || (t = "ISO8859-1");
        var r = new XMLHttpRequest;
        return r.open("GET", e, !1), r.overrideMimeType && r.overrideMimeType("text/plain; charset=" + t), r.send(null), r.responseText
    }, _parseAFF: function (e) {
        var t = {};
        e = this._removeAffixComments(e);
        for (var r = e.split("\n"), n = 0, i = r.length; i > n; n++) {
            var o = r[n], l = o.split(/\s+/), a = l[0];
            if ("PFX" == a || "SFX" == a) {
                for (var s = l[1], u = l[2], c = parseInt(l[3], 10), h = [], d = n + 1, f = n + 1 + c; f > d; d++) {
                    var o = r[d], p = o.split(/\s+/), g = p[2], m = p[3].split("/"), v = m[0];
                    "0" === v && (v = "");
                    var y = this.parseRuleCodes(m[1]), b = p[4], x = {};
                    x.add = v, y.length > 0 && (x.continuationClasses = y), "." !== b && ("SFX" === a ? x.match = new RegExp(b + "$") : x.match = new RegExp("^" + b)), "0" != g && ("SFX" === a ? x.remove = new RegExp(g + "$") : x.remove = g), h.push(x)
                }
                t[s] = {type: a, combineable: "Y" == u, entries: h}, n += c
            } else if ("COMPOUNDRULE" === a) {
                for (var c = parseInt(l[1], 10), d = n + 1, f = n + 1 + c; f > d; d++) {
                    var o = r[d], p = o.split(/\s+/);
                    this.compoundRules.push(p[1])
                }
                n += c
            } else if ("REP" === a) {
                var p = o.split(/\s+/);
                3 === p.length && this.replacementTable.push([p[1], p[2]])
            } else this.flags[a] = l[1]
        }
        return t
    }, _removeAffixComments: function (e) {
        return e = e.replace(/#.*$/gm, ""), e = e.replace(/^\s\s*/m, "").replace(/\s\s*$/m, ""), e = e.replace(/\n{2,}/g, "\n"), e = e.replace(/^\s\s*/, "").replace(/\s\s*$/, "")
    }, _parseDIC: function (e) {
        function t(e, t) {
            e in n && "object" == typeof n[e] || (n[e] = []), n[e].push(t)
        }

        e = this._removeDicComments(e);
        for (var r = e.split("\n"), n = {}, i = 1, o = r.length; o > i; i++) {
            var l = r[i], a = l.split("/", 2), s = a[0];
            if (a.length > 1) {
                var u = this.parseRuleCodes(a[1]);
                "NEEDAFFIX" in this.flags && -1 != u.indexOf(this.flags.NEEDAFFIX) || t(s, u);
                for (var c = 0, h = u.length; h > c; c++) {
                    var d = u[c], f = this.rules[d];
                    if (f) for (var p = this._applyRule(s, f), g = 0, m = p.length; m > g; g++) {
                        var v = p[g];
                        if (t(v, []), f.combineable) for (var y = c + 1; h > y; y++) {
                            var b = u[y], x = this.rules[b];
                            if (x && x.combineable && f.type != x.type) for (var w = this._applyRule(v, x), S = 0, C = w.length; C > S; S++) {
                                var k = w[S];
                                t(k, [])
                            }
                        }
                    }
                    d in this.compoundRuleCodes && this.compoundRuleCodes[d].push(s)
                }
            } else t(s.trim(), [])
        }
        return n
    }, _removeDicComments: function (e) {
        return e = e.replace(/^\t.*$/gm, "")
    }, parseRuleCodes: function (e) {
        if (!e) return [];
        if (!("FLAG" in this.flags)) return e.split("");
        if ("long" === this.flags.FLAG) {
            for (var t = [], r = 0, n = e.length; n > r; r += 2) t.push(e.substr(r, 2));
            return t
        }
        return "num" === this.flags.FLAG ? textCode.split(",") : void 0
    }, _applyRule: function (e, t) {
        for (var r = t.entries, n = [], i = 0, o = r.length; o > i; i++) {
            var l = r[i];
            if (!l.match || e.match(l.match)) {
                var a = e;
                if (l.remove && (a = a.replace(l.remove, "")), "SFX" === t.type ? a += l.add : a = l.add + a, n.push(a), "continuationClasses" in l) for (var s = 0, u = l.continuationClasses.length; u > s; s++) {
                    var c = this.rules[l.continuationClasses[s]];
                    c && (n = n.concat(this._applyRule(a, c)))
                }
            }
        }
        return n
    }, check: function (e) {
        var t = e.replace(/^\s\s*/, "").replace(/\s\s*$/, "");
        if (this.checkExact(t)) return !0;
        if (t.toUpperCase() === t) {
            var r = t[0] + t.substring(1).toLowerCase();
            if (this.hasFlag(r, "KEEPCASE")) return !1;
            if (this.checkExact(r)) return !0
        }
        var n = t.toLowerCase();
        if (n !== t) {
            if (this.hasFlag(n, "KEEPCASE")) return !1;
            if (this.checkExact(n)) return !0
        }
        return !1
    }, checkExact: function (e) {
        var t = this.dictionaryTable[e];
        if ("undefined" == typeof t) {
            if ("COMPOUNDMIN" in this.flags && e.length >= this.flags.COMPOUNDMIN) for (var r = 0, n = this.compoundRules.length; n > r; r++) if (e.match(this.compoundRules[r])) return !0;
            return !1
        }
        for (var r = 0, n = t.length; n > r; r++) if (!this.hasFlag(e, "ONLYINCOMPOUND", t[r])) return !0;
        return !1
    }, hasFlag: function (e, t, r) {
        if (t in this.flags) {
            if ("undefined" == typeof r) var r = Array.prototype.concat.apply([], this.dictionaryTable[e]);
            if (r && -1 !== r.indexOf(this.flags[t])) return !0
        }
        return !1
    }, alphabet: "", suggest: function (e, t) {
        function r(e) {
            for (var t = [], r = 0, n = e.length; n > r; r++) {
                for (var i = e[r], o = [], l = 0, a = i.length + 1; a > l; l++) o.push([i.substring(0, l), i.substring(l, i.length)]);
                for (var s = [], l = 0, a = o.length; a > l; l++) {
                    var c = o[l];
                    c[1] && s.push(c[0] + c[1].substring(1))
                }
                for (var h = [], l = 0, a = o.length; a > l; l++) {
                    var c = o[l];
                    c[1].length > 1 && h.push(c[0] + c[1][1] + c[1][0] + c[1].substring(2))
                }
                for (var d = [], l = 0, a = o.length; a > l; l++) {
                    var c = o[l];
                    if (c[1]) for (var f = 0, p = u.alphabet.length; p > f; f++) d.push(c[0] + u.alphabet[f] + c[1].substring(1))
                }
                for (var g = [], l = 0, a = o.length; a > l; l++) {
                    var c = o[l];
                    if (c[1]) for (var f = 0, p = u.alphabet.length; p > f; f++) d.push(c[0] + u.alphabet[f] + c[1])
                }
                t = t.concat(s), t = t.concat(h), t = t.concat(d), t = t.concat(g)
            }
            return t
        }

        function n(e) {
            for (var t = [], r = 0; r < e.length; r++) u.check(e[r]) && t.push(e[r]);
            return t
        }

        function i(e) {
            function i(e, t) {
                return e[1] < t[1] ? -1 : 1
            }

            for (var o = r([e]), l = r(o), a = n(o).concat(n(l)), s = {}, c = 0, h = a.length; h > c; c++) a[c] in s ? s[a[c]] += 1 : s[a[c]] = 1;
            var d = [];
            for (var c in s) d.push([c, s[c]]);
            d.sort(i).reverse();
            for (var f = [], c = 0, h = Math.min(t, d.length); h > c; c++) u.hasFlag(d[c][0], "NOSUGGEST") || f.push(d[c][0]);
            return f
        }

        if (t || (t = 5), this.check(e)) return [];
        for (var o = 0, l = this.replacementTable.length; l > o; o++) {
            var a = this.replacementTable[o];
            if (-1 !== e.indexOf(a[0])) {
                var s = e.replace(a[0], a[1]);
                if (this.check(s)) return [s]
            }
        }
        var u = this;
        return u.alphabet = "abcdefghijklmnopqrstuvwxyz", i(e)
    }
};
var num_loaded = 0, aff_loading = !1, dic_loading = !1, aff_data = "", dic_data = "", typo;
CodeMirror.defineMode("spell-checker", function (e, t) {
    if (!aff_loading) {
        aff_loading = !0;
        var r = new XMLHttpRequest;
        r.open("GET", "https://cdn.jsdelivr.net/codemirror.spell-checker/latest/en_US.aff", !0), r.onload = function (e) {
            4 === r.readyState && 200 === r.status && (aff_data = r.responseText, num_loaded++, 2 == num_loaded && (typo = new Typo("en_US", aff_data, dic_data, {platform: "any"})))
        }, r.send(null)
    }
    if (!dic_loading) {
        dic_loading = !0;
        var n = new XMLHttpRequest;
        n.open("GET", "https://cdn.jsdelivr.net/codemirror.spell-checker/latest/en_US.dic", !0), n.onload = function (e) {
            4 === n.readyState && 200 === n.status && (dic_data = n.responseText, num_loaded++, 2 == num_loaded && (typo = new Typo("en_US", aff_data, dic_data, {platform: "any"})))
        }, n.send(null)
    }
    var i = '!"#$%&()*+,-./:;<=>?@[\\]^_`{|}~ ', o = {
        token: function (e, t) {
            var r = e.peek(), n = "";
            if (i.includes(r)) return e.next(), null;
            for (; null != (r = e.peek()) && !i.includes(r);) n += r, e.next();
            return typo && !typo.check(n) ? "spell-error" : null
        }
    }, l = CodeMirror.getMode(e, e.backdrop || "text/plain");
    return CodeMirror.overlayMode(l, o, !0)
}), String.prototype.includes || (String.prototype.includes = function () {
    "use strict";
    return -1 !== String.prototype.indexOf.apply(this, arguments)
}), function () {
    function e(e) {
        this.tokens = [], this.tokens.links = {}, this.options = e || u.defaults, this.rules = c.normal, this.options.gfm && (this.options.tables ? this.rules = c.tables : this.rules = c.gfm)
    }

    function t(e, t) {
        if (this.options = t || u.defaults, this.links = e, this.rules = h.normal, this.renderer = this.options.renderer || new r, this.renderer.options = this.options, !this.links) throw new Error("Tokens array requires a `links` property.");
        this.options.gfm ? this.options.breaks ? this.rules = h.breaks : this.rules = h.gfm : this.options.pedantic && (this.rules = h.pedantic)
    }

    function r(e) {
        this.options = e || {}
    }

    function n(e) {
        this.tokens = [], this.token = null, this.options = e || u.defaults, this.options.renderer = this.options.renderer || new r, this.renderer = this.options.renderer, this.renderer.options = this.options
    }

    function i(e, t) {
        return e.replace(t ? /&/g : /&(?!#?\w+;)/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;")
    }

    function o(e) {
        return e.replace(/&([#\w]+);/g, function (e, t) {
            return t = t.toLowerCase(), "colon" === t ? ":" : "#" === t.charAt(0) ? "x" === t.charAt(1) ? String.fromCharCode(parseInt(t.substring(2), 16)) : String.fromCharCode(+t.substring(1)) : ""
        })
    }

    function l(e, t) {
        return e = e.source, t = t || "", function r(n, i) {
            return n ? (i = i.source || i, i = i.replace(/(^|[^\[])\^/g, "$1"), e = e.replace(n, i), r) : new RegExp(e, t)
        }
    }

    function a() {
    }

    function s(e) {
        for (var t, r, n = 1; n < arguments.length; n++) {
            t = arguments[n];
            for (r in t) Object.prototype.hasOwnProperty.call(t, r) && (e[r] = t[r])
        }
        return e
    }

    function u(t, r, o) {
        if (o || "function" == typeof r) {
            o || (o = r, r = null), r = s({}, u.defaults, r || {});
            var l, a, c = r.highlight, h = 0;
            try {
                l = e.lex(t, r)
            } catch (d) {
                return o(d)
            }
            a = l.length;
            var f = function (e) {
                if (e) return r.highlight = c, o(e);
                var t;
                try {
                    t = n.parse(l, r)
                } catch (i) {
                    e = i
                }
                return r.highlight = c, e ? o(e) : o(null, t)
            };
            if (!c || c.length < 3) return f();
            if (delete r.highlight, !a) return f();
            for (; h < l.length; h++) !function (e) {
                return "code" !== e.type ? --a || f() : c(e.text, e.lang, function (t, r) {
                    return t ? f(t) : null == r || r === e.text ? --a || f() : (e.text = r, e.escaped = !0, void (--a || f()))
                })
            }(l[h])
        } else try {
            return r && (r = s({}, u.defaults, r)), n.parse(e.lex(t, r), r)
        } catch (d) {
            if (d.message += "\nPlease report this to https://github.com/chjj/marked.", (r || u.defaults).silent) return "<p>An error occured:</p><pre>" + i(d.message + "", !0) + "</pre>";
            throw d
        }
    }

    var c = {
        newline: /^\n+/,
        code: /^( {4}[^\n]+\n*)+/,
        fences: a,
        hr: /^( *[-*_]){3,} *(?:\n+|$)/,
        heading: /^ *(#{1,6}) *([^\n]+?) *#* *(?:\n+|$)/,
        nptable: a,
        lheading: /^([^\n]+)\n *(=|-){2,} *(?:\n+|$)/,
        blockquote: /^( *>[^\n]+(\n(?!def)[^\n]+)*\n*)+/,
        list: /^( *)(bull) [\s\S]+?(?:hr|def|\n{2,}(?! )(?!\1bull )\n*|\s*$)/,
        html: /^ *(?:comment *(?:\n|\s*$)|closed *(?:\n{2,}|\s*$)|closing *(?:\n{2,}|\s*$))/,
        def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +["(]([^\n]+)[")])? *(?:\n+|$)/,
        table: a,
        paragraph: /^((?:[^\n]+\n?(?!hr|heading|lheading|blockquote|tag|def))+)\n*/,
        text: /^[^\n]+/
    };
    c.bullet = /(?:[*+-]|\d+\.)/, c.item = /^( *)(bull) [^\n]*(?:\n(?!\1bull )[^\n]*)*/, c.item = l(c.item, "gm")(/bull/g, c.bullet)(), c.list = l(c.list)(/bull/g, c.bullet)("hr", "\\n+(?=\\1?(?:[-*_] *){3,}(?:\\n+|$))")("def", "\\n+(?=" + c.def.source + ")")(), c.blockquote = l(c.blockquote)("def", c.def)(), c._tag = "(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:/|[^\\w\\s@]*@)\\b", c.html = l(c.html)("comment", /<!--[\s\S]*?-->/)("closed", /<(tag)[\s\S]+?<\/\1>/)("closing", /<tag(?:"[^"]*"|'[^']*'|[^'">])*?>/)(/tag/g, c._tag)(), c.paragraph = l(c.paragraph)("hr", c.hr)("heading", c.heading)("lheading", c.lheading)("blockquote", c.blockquote)("tag", "<" + c._tag)("def", c.def)(), c.normal = s({}, c), c.gfm = s({}, c.normal, {
        fences: /^ *(`{3,}|~{3,})[ \.]*(\S+)? *\n([\s\S]*?)\s*\1 *(?:\n+|$)/,
        paragraph: /^/,
        heading: /^ *(#{1,6}) +([^\n]+?) *#* *(?:\n+|$)/
    }), c.gfm.paragraph = l(c.paragraph)("(?!", "(?!" + c.gfm.fences.source.replace("\\1", "\\2") + "|" + c.list.source.replace("\\1", "\\3") + "|")(), c.tables = s({}, c.gfm, {
        nptable: /^ *(\S.*\|.*)\n *([-:]+ *\|[-| :]*)\n((?:.*\|.*(?:\n|$))*)\n*/,
        table: /^ *\|(.+)\n *\|( *[-:]+[-| :]*)\n((?: *\|.*(?:\n|$))*)\n*/
    }), e.rules = c, e.lex = function (t, r) {
        var n = new e(r);
        return n.lex(t)
    }, e.prototype.lex = function (e) {
        return e = e.replace(/\r\n|\r/g, "\n").replace(/\t/g, "    ").replace(/\u00a0/g, " ").replace(/\u2424/g, "\n"), this.token(e, !0)
    }, e.prototype.token = function (e, t, r) {
        for (var n, i, o, l, a, s, u, h, d, e = e.replace(/^ +$/gm, ""); e;) if ((o = this.rules.newline.exec(e)) && (e = e.substring(o[0].length), o[0].length > 1 && this.tokens.push({type: "space"})), o = this.rules.code.exec(e)) e = e.substring(o[0].length), o = o[0].replace(/^ {4}/gm, ""), this.tokens.push({
            type: "code",
            text: this.options.pedantic ? o : o.replace(/\n+$/, "")
        }); else if (o = this.rules.fences.exec(e)) e = e.substring(o[0].length), this.tokens.push({
            type: "code",
            lang: o[2],
            text: o[3] || ""
        }); else if (o = this.rules.heading.exec(e)) e = e.substring(o[0].length), this.tokens.push({
            type: "heading",
            depth: o[1].length,
            text: o[2]
        }); else if (t && (o = this.rules.nptable.exec(e))) {
            for (e = e.substring(o[0].length), s = {
                type: "table",
                header: o[1].replace(/^ *| *\| *$/g, "").split(/ *\| */),
                align: o[2].replace(/^ *|\| *$/g, "").split(/ *\| */),
                cells: o[3].replace(/\n$/, "").split("\n")
            }, h = 0; h < s.align.length; h++) /^ *-+: *$/.test(s.align[h]) ? s.align[h] = "right" : /^ *:-+: *$/.test(s.align[h]) ? s.align[h] = "center" : /^ *:-+ *$/.test(s.align[h]) ? s.align[h] = "left" : s.align[h] = null;
            for (h = 0; h < s.cells.length; h++) s.cells[h] = s.cells[h].split(/ *\| */);
            this.tokens.push(s)
        } else if (o = this.rules.lheading.exec(e)) e = e.substring(o[0].length), this.tokens.push({
            type: "heading",
            depth: "=" === o[2] ? 1 : 2,
            text: o[1]
        }); else if (o = this.rules.hr.exec(e)) e = e.substring(o[0].length), this.tokens.push({type: "hr"}); else if (o = this.rules.blockquote.exec(e)) e = e.substring(o[0].length), this.tokens.push({type: "blockquote_start"}), o = o[0].replace(/^ *> ?/gm, ""), this.token(o, t, !0), this.tokens.push({type: "blockquote_end"}); else if (o = this.rules.list.exec(e)) {
            for (e = e.substring(o[0].length), l = o[2], this.tokens.push({
                type: "list_start",
                ordered: l.length > 1
            }), o = o[0].match(this.rules.item), n = !1, d = o.length, h = 0; d > h; h++) s = o[h], u = s.length, s = s.replace(/^ *([*+-]|\d+\.) +/, ""), ~s.indexOf("\n ") && (u -= s.length, s = this.options.pedantic ? s.replace(/^ {1,4}/gm, "") : s.replace(new RegExp("^ {1," + u + "}", "gm"), "")), this.options.smartLists && h !== d - 1 && (a = c.bullet.exec(o[h + 1])[0], l === a || l.length > 1 && a.length > 1 || (e = o.slice(h + 1).join("\n") + e, h = d - 1)), i = n || /\n\n(?!\s*$)/.test(s), h !== d - 1 && (n = "\n" === s.charAt(s.length - 1), i || (i = n)), this.tokens.push({type: i ? "loose_item_start" : "list_item_start"}), this.token(s, !1, r), this.tokens.push({type: "list_item_end"});
            this.tokens.push({type: "list_end"})
        } else if (o = this.rules.html.exec(e)) e = e.substring(o[0].length), this.tokens.push({
            type: this.options.sanitize ? "paragraph" : "html",
            pre: !this.options.sanitizer && ("pre" === o[1] || "script" === o[1] || "style" === o[1]),
            text: o[0]
        }); else if (!r && t && (o = this.rules.def.exec(e))) e = e.substring(o[0].length), this.tokens.links[o[1].toLowerCase()] = {
            href: o[2],
            title: o[3]
        }; else if (t && (o = this.rules.table.exec(e))) {
            for (e = e.substring(o[0].length), s = {
                type: "table",
                header: o[1].replace(/^ *| *\| *$/g, "").split(/ *\| */),
                align: o[2].replace(/^ *|\| *$/g, "").split(/ *\| */),
                cells: o[3].replace(/(?: *\| *)?\n$/, "").split("\n")
            }, h = 0; h < s.align.length; h++) /^ *-+: *$/.test(s.align[h]) ? s.align[h] = "right" : /^ *:-+: *$/.test(s.align[h]) ? s.align[h] = "center" : /^ *:-+ *$/.test(s.align[h]) ? s.align[h] = "left" : s.align[h] = null;
            for (h = 0; h < s.cells.length; h++) s.cells[h] = s.cells[h].replace(/^ *\| *| *\| *$/g, "").split(/ *\| */);
            this.tokens.push(s)
        } else if (t && (o = this.rules.paragraph.exec(e))) e = e.substring(o[0].length), this.tokens.push({
            type: "paragraph",
            text: "\n" === o[1].charAt(o[1].length - 1) ? o[1].slice(0, -1) : o[1]
        }); else if (o = this.rules.text.exec(e)) e = e.substring(o[0].length), this.tokens.push({
            type: "text",
            text: o[0]
        }); else if (e) throw new Error("Infinite loop on byte: " + e.charCodeAt(0));
        return this.tokens
    };
    var h = {
        escape: /^\\([\\`*{}\[\]()#+\-.!_>])/,
        autolink: /^<([^ >]+(@|:\/)[^ >]+)>/,
        url: a,
        tag: /^<!--[\s\S]*?-->|^<\/?\w+(?:"[^"]*"|'[^']*'|[^'">])*?>/,
        link: /^!?\[(inside)\]\(href\)/,
        reflink: /^!?\[(inside)\]\s*\[([^\]]*)\]/,
        nolink: /^!?\[((?:\[[^\]]*\]|[^\[\]])*)\]/,
        strong: /^__([\s\S]+?)__(?!_)|^\*\*([\s\S]+?)\*\*(?!\*)/,
        em: /^\b_((?:[^_]|__)+?)_\b|^\*((?:\*\*|[\s\S])+?)\*(?!\*)/,
        code: /^(`+)\s*([\s\S]*?[^`])\s*\1(?!`)/,
        br: /^ {2,}\n(?!\s*$)/,
        del: a,
        text: /^[\s\S]+?(?=[\\<!\[_*`]| {2,}\n|$)/
    };
    h._inside = /(?:\[[^\]]*\]|[^\[\]]|\](?=[^\[]*\]))*/, h._href = /\s*<?([\s\S]*?)>?(?:\s+['"]([\s\S]*?)['"])?\s*/, h.link = l(h.link)("inside", h._inside)("href", h._href)(), h.reflink = l(h.reflink)("inside", h._inside)(), h.normal = s({}, h), h.pedantic = s({}, h.normal, {
        strong: /^__(?=\S)([\s\S]*?\S)__(?!_)|^\*\*(?=\S)([\s\S]*?\S)\*\*(?!\*)/,
        em: /^_(?=\S)([\s\S]*?\S)_(?!_)|^\*(?=\S)([\s\S]*?\S)\*(?!\*)/
    }), h.gfm = s({}, h.normal, {
        escape: l(h.escape)("])", "~|])")(),
        url: /^(https?:\/\/[^\s<]+[^<.,:;"')\]\s])/,
        del: /^~~(?=\S)([\s\S]*?\S)~~/,
        text: l(h.text)("]|", "~]|")("|", "|https?://|")()
    }), h.breaks = s({}, h.gfm, {
        br: l(h.br)("{2,}", "*")(),
        text: l(h.gfm.text)("{2,}", "*")()
    }), t.rules = h, t.output = function (e, r, n) {
        var i = new t(r, n);
        return i.output(e)
    }, t.prototype.output = function (e) {
        for (var t, r, n, o, l = ""; e;) if (o = this.rules.escape.exec(e)) e = e.substring(o[0].length), l += o[1]; else if (o = this.rules.autolink.exec(e)) e = e.substring(o[0].length), "@" === o[2] ? (r = ":" === o[1].charAt(6) ? this.mangle(o[1].substring(7)) : this.mangle(o[1]), n = this.mangle("mailto:") + r) : (r = i(o[1]), n = r), l += this.renderer.link(n, null, r); else if (this.inLink || !(o = this.rules.url.exec(e))) {
            if (o = this.rules.tag.exec(e)) !this.inLink && /^<a /i.test(o[0]) ? this.inLink = !0 : this.inLink && /^<\/a>/i.test(o[0]) && (this.inLink = !1), e = e.substring(o[0].length), l += this.options.sanitize ? this.options.sanitizer ? this.options.sanitizer(o[0]) : i(o[0]) : o[0]; else if (o = this.rules.link.exec(e)) e = e.substring(o[0].length), this.inLink = !0, l += this.outputLink(o, {
                href: o[2],
                title: o[3]
            }), this.inLink = !1; else if ((o = this.rules.reflink.exec(e)) || (o = this.rules.nolink.exec(e))) {
                if (e = e.substring(o[0].length), t = (o[2] || o[1]).replace(/\s+/g, " "), t = this.links[t.toLowerCase()], !t || !t.href) {
                    l += o[0].charAt(0), e = o[0].substring(1) + e;
                    continue
                }
                this.inLink = !0, l += this.outputLink(o, t), this.inLink = !1
            } else if (o = this.rules.strong.exec(e)) e = e.substring(o[0].length), l += this.renderer.strong(this.output(o[2] || o[1])); else if (o = this.rules.em.exec(e)) e = e.substring(o[0].length), l += this.renderer.em(this.output(o[2] || o[1])); else if (o = this.rules.code.exec(e)) e = e.substring(o[0].length), l += this.renderer.codespan(i(o[2], !0)); else if (o = this.rules.br.exec(e)) e = e.substring(o[0].length), l += this.renderer.br(); else if (o = this.rules.del.exec(e)) e = e.substring(o[0].length), l += this.renderer.del(this.output(o[1])); else if (o = this.rules.text.exec(e)) e = e.substring(o[0].length), l += this.renderer.text(i(this.smartypants(o[0]))); else if (e) throw new Error("Infinite loop on byte: " + e.charCodeAt(0))
        } else e = e.substring(o[0].length), r = i(o[1]), n = r, l += this.renderer.link(n, null, r);
        return l
    }, t.prototype.outputLink = function (e, t) {
        var r = i(t.href), n = t.title ? i(t.title) : null;
        return "!" !== e[0].charAt(0) ? this.renderer.link(r, n, this.output(e[1])) : this.renderer.image(r, n, i(e[1]))
    }, t.prototype.smartypants = function (e) {
        return this.options.smartypants ? e.replace(/---/g, "—").replace(/--/g, "–").replace(/(^|[-\u2014/(\[{"\s])'/g, "$1‘").replace(/'/g, "’").replace(/(^|[-\u2014/(\[{\u2018\s])"/g, "$1“").replace(/"/g, "”").replace(/\.{3}/g, "…") : e
    }, t.prototype.mangle = function (e) {
        if (!this.options.mangle) return e;
        for (var t, r = "", n = e.length, i = 0; n > i; i++) t = e.charCodeAt(i), Math.random() > .5 && (t = "x" + t.toString(16)), r += "&#" + t + ";";
        return r
    }, r.prototype.code = function (e, t, r) {
        if (this.options.highlight) {
            var n = this.options.highlight(e, t);
            null != n && n !== e && (r = !0, e = n)
        }
        return t ? '<pre><code class="' + this.options.langPrefix + i(t, !0) + '">' + (r ? e : i(e, !0)) + "\n</code></pre>\n" : "<pre><code>" + (r ? e : i(e, !0)) + "\n</code></pre>"
    }, r.prototype.blockquote = function (e) {
        return "<blockquote>\n" + e + "</blockquote>\n"
    }, r.prototype.html = function (e) {
        return e
    }, r.prototype.heading = function (e, t, r) {
        return "<h" + t + ' id="' + this.options.headerPrefix + r.toLowerCase().replace(/[^\w]+/g, "-") + '">' + e + "</h" + t + ">\n"
    }, r.prototype.hr = function () {
        return this.options.xhtml ? "<hr/>\n" : "<hr>\n"
    }, r.prototype.list = function (e, t) {
        var r = t ? "ol" : "ul";
        return "<" + r + ">\n" + e + "</" + r + ">\n"
    }, r.prototype.listitem = function (e) {
        return "<li>" + e + "</li>\n"
    }, r.prototype.paragraph = function (e) {
        return "<p>" + e + "</p>\n"
    }, r.prototype.table = function (e, t) {
        return "<table>\n<thead>\n" + e + "</thead>\n<tbody>\n" + t + "</tbody>\n</table>\n"
    }, r.prototype.tablerow = function (e) {
        return "<tr>\n" + e + "</tr>\n"
    }, r.prototype.tablecell = function (e, t) {
        var r = t.header ? "th" : "td", n = t.align ? "<" + r + ' style="text-align:' + t.align + '">' : "<" + r + ">";
        return n + e + "</" + r + ">\n"
    }, r.prototype.strong = function (e) {
        return "<strong>" + e + "</strong>"
    }, r.prototype.em = function (e) {
        return "<em>" + e + "</em>"
    }, r.prototype.codespan = function (e) {
        return "<code>" + e + "</code>"
    }, r.prototype.br = function () {
        return this.options.xhtml ? "<br/>" : "<br>"
    }, r.prototype.del = function (e) {
        return "<del>" + e + "</del>"
    }, r.prototype.link = function (e, t, r) {
        if (this.options.sanitize) {
            try {
                var n = decodeURIComponent(o(e)).replace(/[^\w:]/g, "").toLowerCase()
            } catch (i) {
                return ""
            }
            if (0 === n.indexOf("javascript:") || 0 === n.indexOf("vbscript:")) return ""
        }
        var l = '<a href="' + e + '"';
        return t && (l += ' title="' + t + '"'), l += ">" + r + "</a>"
    }, r.prototype.image = function (e, t, r) {
        var n = '<img src="' + e + '" alt="' + r + '"';
        return t && (n += ' title="' + t + '"'), n += this.options.xhtml ? "/>" : ">"
    }, r.prototype.text = function (e) {
        return e
    }, n.parse = function (e, t, r) {
        var i = new n(t, r);
        return i.parse(e)
    }, n.prototype.parse = function (e) {
        this.inline = new t(e.links, this.options, this.renderer), this.tokens = e.reverse();
        for (var r = ""; this.next();) r += this.tok();
        return r
    }, n.prototype.next = function () {
        return this.token = this.tokens.pop()
    }, n.prototype.peek = function () {
        return this.tokens[this.tokens.length - 1] || 0
    }, n.prototype.parseText = function () {
        for (var e = this.token.text; "text" === this.peek().type;) e += "\n" + this.next().text;
        return this.inline.output(e)
    }, n.prototype.tok = function () {
        switch (this.token.type) {
            case"space":
                return "";
            case"hr":
                return this.renderer.hr();
            case"heading":
                return this.renderer.heading(this.inline.output(this.token.text), this.token.depth, this.token.text);
            case"code":
                return this.renderer.code(this.token.text, this.token.lang, this.token.escaped);
            case"table":
                var e, t, r, n, i, o = "", l = "";
                for (r = "", e = 0; e < this.token.header.length; e++) n = {
                    header: !0,
                    align: this.token.align[e]
                }, r += this.renderer.tablecell(this.inline.output(this.token.header[e]), {
                    header: !0,
                    align: this.token.align[e]
                });
                for (o += this.renderer.tablerow(r), e = 0; e < this.token.cells.length; e++) {
                    for (t = this.token.cells[e], r = "", i = 0; i < t.length; i++) r += this.renderer.tablecell(this.inline.output(t[i]), {
                        header: !1,
                        align: this.token.align[i]
                    });
                    l += this.renderer.tablerow(r)
                }
                return this.renderer.table(o, l);
            case"blockquote_start":
                for (var l = ""; "blockquote_end" !== this.next().type;) l += this.tok();
                return this.renderer.blockquote(l);
            case"list_start":
                for (var l = "", a = this.token.ordered; "list_end" !== this.next().type;) l += this.tok();
                return this.renderer.list(l, a);
            case"list_item_start":
                for (var l = ""; "list_item_end" !== this.next().type;) l += "text" === this.token.type ? this.parseText() : this.tok();
                return this.renderer.listitem(l);
            case"loose_item_start":
                for (var l = ""; "list_item_end" !== this.next().type;) l += this.tok();
                return this.renderer.listitem(l);
            case"html":
                var s = this.token.pre || this.options.pedantic ? this.token.text : this.inline.output(this.token.text);
                return this.renderer.html(s);
            case"paragraph":
                return this.renderer.paragraph(this.inline.output(this.token.text));
            case"text":
                return this.renderer.paragraph(this.parseText())
        }
    }, a.exec = a, u.options = u.setOptions = function (e) {
        return s(u.defaults, e), u
    }, u.defaults = {
        gfm: !0,
        tables: !0,
        breaks: !1,
        pedantic: !1,
        sanitize: !1,
        sanitizer: null,
        mangle: !0,
        smartLists: !1,
        silent: !1,
        highlight: null,
        langPrefix: "lang-",
        smartypants: !1,
        headerPrefix: "",
        renderer: new r,
        xhtml: !1
    }, u.Parser = n, u.parser = n.parse, u.Renderer = r, u.Lexer = e, u.lexer = e.lex, u.InlineLexer = t, u.inlineLexer = t.output, u.parse = u, "undefined" != typeof module && "object" == typeof exports ? module.exports = u : "function" == typeof define && define.amd ? define(function () {
        return u
    }) : this.marked = u
}.call(function () {
    return this || ("undefined" != typeof window ? window : global)
}());
var isMac = /Mac/.test(navigator.platform), shortcuts = {
        "Cmd-B": toggleBold,
        "Cmd-I": toggleItalic,
        "Cmd-K": drawLink,
        "Cmd-H": toggleHeadingSmaller,
        "Shift-Cmd-H": toggleHeadingBigger,
        "Cmd-Alt-I": drawImage,
        "Cmd-'": toggleBlockquote,
        "Cmd-Alt-L": toggleOrderedList,
        "Cmd-L": toggleUnorderedList,
        "Cmd-Alt-C": toggleCodeBlock,
        "Cmd-P": togglePreview
    }, saved_overflow = "", toolbarBuiltInButtons = {
        bold: {name: "bold", action: toggleBold, className: "fa fa-bold", title: "Bold (Ctrl+B)"},
        italic: {name: "italic", action: toggleItalic, className: "fa fa-italic", title: "Italic (Ctrl+I)"},
        strikethrough: {
            name: "strikethrough",
            action: toggleStrikethrough,
            className: "fa fa-strikethrough",
            title: "Strikethrough"
        },
        heading: {name: "heading", action: toggleHeadingSmaller, className: "fa fa-header", title: "Heading (Ctrl+H)"},
        "heading-smaller": {
            name: "heading-smaller",
            action: toggleHeadingSmaller,
            className: "fa fa-header fa-header-x fa-header-smaller",
            title: "Smaller Heading (Ctrl+H)"
        },
        "heading-bigger": {
            name: "heading-bigger",
            action: toggleHeadingBigger,
            className: "fa fa-header fa-header-x fa-header-bigger",
            title: "Bigger Heading (Shift+Ctrl+H)"
        },
        "heading-1": {
            name: "heading-1",
            action: toggleHeading1,
            className: "fa fa-header fa-header-x fa-header-1",
            title: "Big Heading"
        },
        "heading-2": {
            name: "heading-2",
            action: toggleHeading2,
            className: "fa fa-header fa-header-x fa-header-2",
            title: "Medium Heading"
        },
        "heading-3": {
            name: "heading-3",
            action: toggleHeading3,
            className: "fa fa-header fa-header-x fa-header-3",
            title: "Small Heading"
        },
        code: {name: "code", action: toggleCodeBlock, className: "fa fa-code", title: "Code (Ctrl+Alt+C)"},
        quote: {name: "quote", action: toggleBlockquote, className: "fa fa-quote-left", title: "Quote (Ctrl+')"},
        "unordered-list": {
            name: "unordered-list",
            action: toggleUnorderedList,
            className: "fa fa-list-ul",
            title: "Generic List (Ctrl+L)"
        },
        "ordered-list": {
            name: "ordered-list",
            action: toggleOrderedList,
            className: "fa fa-list-ol",
            title: "Numbered List (Ctrl+Alt+L)"
        },
        link: {name: "link", action: drawLink, className: "fa fa-link", title: "Create Link (Ctrl+K)"},
        image: {name: "image", action: drawImage, className: "fa fa-picture-o", title: "Insert Image (Ctrl+Alt+I)"},
        "horizontal-rule": {
            name: "horizontal-rule",
            action: drawHorizontalRule,
            className: "fa fa-minus",
            title: "Insert Horizontal Line"
        },
        preview: {name: "preview", action: togglePreview, className: "fa fa-eye", title: "Toggle Preview (Ctrl+P)"},
        "side-by-side": {
            name: "side-by-side",
            action: toggleSideBySide,
            className: "fa fa-columns",
            title: "Toggle Side by Side (F9)"
        },
        fullscreen: {
            name: "fullscreen",
            action: toggleFullScreen,
            className: "fa fa-arrows-alt",
            title: "Toggle Fullscreen (F11)"
        },
        guide: {
            name: "guide",
            action: "https://github.github.com/gfm/",
            className: "fa fa-question-circle",
            title: "Markdown Guide"
        }
    },
    toolbar = ["bold", "italic", "heading", "|", "quote", "unordered-list", "ordered-list", "|", "link", "image", "|", "preview", "side-by-side", "fullscreen", "guide"];
SimpleMDE.toolbar = toolbar, SimpleMDE.prototype.markdown = function (e) {
    return window.marked ? (this.options && this.options.singleLineBreaks !== !1 && marked.setOptions({breaks: !0}), marked(e)) : void 0
}, SimpleMDE.prototype.render = function (e) {
    if (e || (e = this.element || document.getElementsByTagName("textarea")[0]), !this._rendered || this._rendered !== e) {
        this.element = e;
        var t = this.options, r = this, n = {};
        for (var i in shortcuts) !function (e) {
            n[fixShortcut(e)] = function (t) {
                shortcuts[e](r)
            }
        }(i);
        n.Enter = "newlineAndIndentContinueMarkdownList", n.Tab = "tabAndIndentMarkdownList", n["Shift-Tab"] = "shiftTabAndUnindentMarkdownList", n.F11 = function (e) {
            toggleFullScreen(r)
        }, n.F9 = function (e) {
            toggleSideBySide(r)
        }, n.Esc = function (e) {
            e.getOption("fullScreen") && toggleFullScreen(r)
        };
        var o, l;
        t.spellChecker !== !1 ? (o = "spell-checker", l = t.parsingConfig, l.name = "gfm", l.gitHubSpice = !1) : (o = t.parsingConfig, o.name = "gfm", o.gitHubSpice = !1), this.codemirror = CodeMirror.fromTextArea(e, {
            mode: o,
            backdrop: l,
            theme: "paper",
            tabSize: void 0 != t.tabSize ? t.tabSize : 2,
            indentUnit: void 0 != t.tabSize ? t.tabSize : 2,
            indentWithTabs: t.indentWithTabs === !1 ? !1 : !0,
            lineNumbers: !1,
            autofocus: t.autofocus === !0 ? !0 : !1,
            extraKeys: n,
            lineWrapping: t.lineWrapping === !1 ? !1 : !0,
            allowDroppedFileTypes: ["text/plain"]
        }), t.toolbar !== !1 && this.createToolbar(), t.status !== !1 && this.createStatusbar(),t.upload !== undefined && this.createUpload(), void 0 != t.autosave && t.autosave.enabled === !0 && this.autosave(), this.createSideBySide(), this._rendered = this.element
    }
}, SimpleMDE.prototype.autosave = function () {
    var e = this.value(), t = this;
    if (void 0 == this.options.autosave.unique_id || "" == this.options.autosave.unique_id) return void console.log("SimpleMDE: You must set a unique_id to use the autosave feature");
    null != t.element.form && void 0 != t.element.form && t.element.form.addEventListener("submit", function () {
        localStorage.setItem(t.options.autosave.unique_id, "")
    }), this.options.autosave.loaded !== !0 && (null != localStorage.getItem(this.options.autosave.unique_id) && this.codemirror.setValue(localStorage.getItem(this.options.autosave.unique_id)), this.options.autosave.loaded = !0), localStorage && localStorage.setItem(this.options.autosave.unique_id, e);
    var r = document.getElementById("autosaved");
    if (null != r && void 0 != r && "" != r) {
        var n = new Date, i = n.getHours(), o = n.getMinutes(), l = "am", a = i;
        a >= 12 && (a = i - 12, l = "pm"), 0 == a && (a = 12), o = 10 > o ? "0" + o : o, r.innerHTML = "Autosaved: " + a + ":" + o + " " + l
    }
    setTimeout(function () {
        t.autosave()
    }, this.options.autosave.delay || 1e4)
}, SimpleMDE.prototype.createSideBySide = function () {
    var e = this.codemirror, t = e.getWrapperElement(), r = t.nextSibling;
    r && /editor-preview-side/.test(r.className) || (r = document.createElement("div"), r.className = "editor-preview-side", t.parentNode.insertBefore(r, t.nextSibling));
    var n = !1, i = !1;
    return e.on("scroll", function (e) {
        return n ? void (n = !1) : (i = !0, height = e.getScrollInfo().height - e.getScrollInfo().clientHeight, ratio = parseFloat(e.getScrollInfo().top) / height, move = (r.scrollHeight - r.clientHeight) * ratio, void (r.scrollTop = move))
    }), r.onscroll = function (t) {
        return i ? void (i = !1) : (n = !0, height = r.scrollHeight - r.clientHeight, ratio = parseFloat(r.scrollTop) / height, move = (e.getScrollInfo().height - e.getScrollInfo().clientHeight) * ratio, void e.scrollTo(0, move))
    }, !0
}, SimpleMDE.prototype.createToolbar = function (e) {
    if (e = e || this.options.toolbar, e && 0 !== e.length) {
        for (var t = 0; t < e.length; t++) void 0 != toolbarBuiltInButtons[e[t]] && (e[t] = toolbarBuiltInButtons[e[t]]);
        var r = document.createElement("div");
        r.className = "editor-toolbar";
        var n = this, i = {};
        n.toolbar = e;
        for (var t = 0; t < e.length; t++) ("guide" != e[t].name || n.options.toolbarGuideIcon !== !1) && (n.options.hideIcons && -1 != n.options.hideIcons.indexOf(e[t].name) || !function (e) {
            var t;
            t = "|" === e ? createSep() : createIcon(e, n.options.toolbarTips), e.action && ("function" == typeof e.action ? t.onclick = function (t) {
                e.action(n)
            } : "string" == typeof e.action && (t.href = e.action, t.target = "_blank")), i[e.name || e] = t, r.appendChild(t)
        }(e[t]));
        n.toolbarElements = i;
        var o = this.codemirror;
        o.on("cursorActivity", function () {
            var e = getState(o);
            for (var t in i) !function (t) {
                var r = i[t];
                e[t] ? r.className += " active" : "fullscreen" != t && "side-by-side" != t && (r.className = r.className.replace(/\s*active\s*/g, ""))
            }(t)
        });
        var l = o.getWrapperElement();
        return l.parentNode.insertBefore(r, l), r
    }
}, SimpleMDE.prototype.createStatusbar = function (e) {
    if (e = e || this.options.status, options = this.options, e && 0 !== e.length) {
        var t = document.createElement("div");
        t.className = "editor-statusbar";
        for (var r, n = this.codemirror, i = 0; i < e.length; i++) !function (e) {
            var i = document.createElement("span");
            i.className = e, "words" === e ? (i.innerHTML = "0", n.on("update", function () {
                i.innerHTML = wordCount(n.getValue())
            })) : "lines" === e ? (i.innerHTML = "0", n.on("update", function () {
                i.innerHTML = n.lineCount()
            })) : "cursor" === e ? (i.innerHTML = "0:0", n.on("cursorActivity", function () {
                r = n.getCursor(), i.innerHTML = r.line + ":" + r.ch
            })) : "autosave" === e && void 0 != options.autosave && options.autosave.enabled === !0 && i.setAttribute("id", "autosaved"), t.appendChild(i)
        }(e[i]);
        var o = this.codemirror.getWrapperElement();
        return o.parentNode.insertBefore(t, o.nextSibling), t
    }
}, SimpleMDE.prototype.createUpload = function (e) {
        var t = document.createElement("input");
        t.type = "file";
        t.id = "sme-upload";
        t.accept = "image/gif,image/jp2,image/jpeg,image/png,image/tiff,image/vnd.svf";
        t.style.cssText = "display:none !important";
        var o = this.codemirror.getWrapperElement();
        return o.parentNode.insertBefore(t, o.nextSibling), t
}, SimpleMDE.prototype.value = function (e) {
    return void 0 === e ? this.codemirror.getValue() : (this.codemirror.getDoc().setValue(e), this)
}, SimpleMDE.toggleBold = toggleBold, SimpleMDE.toggleItalic = toggleItalic, SimpleMDE.toggleStrikethrough = toggleStrikethrough, SimpleMDE.toggleBlockquote = toggleBlockquote, SimpleMDE.toggleHeadingSmaller = toggleHeadingSmaller, SimpleMDE.toggleHeadingBigger = toggleHeadingBigger, SimpleMDE.toggleHeading1 = toggleHeading1, SimpleMDE.toggleHeading2 = toggleHeading2, SimpleMDE.toggleHeading3 = toggleHeading3, SimpleMDE.toggleCodeBlock = toggleCodeBlock, SimpleMDE.toggleUnorderedList = toggleUnorderedList, SimpleMDE.toggleOrderedList = toggleOrderedList, SimpleMDE.drawLink = drawLink, SimpleMDE.drawImage = drawImage, SimpleMDE.drawHorizontalRule = drawHorizontalRule, SimpleMDE.undo = undo, SimpleMDE.redo = redo, SimpleMDE.togglePreview = togglePreview, SimpleMDE.toggleSideBySide = toggleSideBySide, SimpleMDE.toggleFullScreen = toggleFullScreen, SimpleMDE.prototype.toggleBold = function () {
    toggleBold(this)
}, SimpleMDE.prototype.toggleItalic = function () {
    toggleItalic(this)
}, SimpleMDE.prototype.toggleStrikethrough = function () {
    toggleStrikethrough(this)
}, SimpleMDE.prototype.toggleBlockquote = function () {
    toggleBlockquote(this)
}, SimpleMDE.prototype.toggleHeadingSmaller = function () {
    toggleHeadingSmaller(this)
}, SimpleMDE.prototype.toggleHeadingBigger = function () {
    toggleHeadingBigger(this)
}, SimpleMDE.prototype.toggleHeading1 = function () {
    toggleHeading1(this)
}, SimpleMDE.prototype.toggleHeading2 = function () {
    toggleHeading2(this)
}, SimpleMDE.prototype.toggleHeading3 = function () {
    toggleHeading3(this)
}, SimpleMDE.prototype.toggleCodeBlock = function () {
    toggleCodeBlock(this)
}, SimpleMDE.prototype.toggleUnorderedList = function () {
    toggleUnorderedList(this)
}, SimpleMDE.prototype.toggleOrderedList = function () {
    toggleOrderedList(this)
}, SimpleMDE.prototype.drawLink = function () {
    drawLink(this)
}, SimpleMDE.prototype.drawImage = function () {
    drawImage(this)
}, SimpleMDE.prototype.drawHorizontalRule = function () {
    drawHorizontalRule(this)
}, SimpleMDE.prototype.undo = function () {
    undo(this)
}, SimpleMDE.prototype.redo = function () {
    redo(this)
}, SimpleMDE.prototype.togglePreview = function () {
    togglePreview(this)
}, SimpleMDE.prototype.toggleSideBySide = function () {
    toggleSideBySide(this)
}, SimpleMDE.prototype.toggleFullScreen = function () {
    toggleFullScreen(this)
};