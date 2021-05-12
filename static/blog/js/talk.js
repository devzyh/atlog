layui.define(['element', 'form', 'laypage', 'jquery', 'laytpl', 'layer'], function (exports) {
    var $ = layui.jquery;
    var laypage = layui.laypage;
    var laytpl = layui.laytpl;
    var layer = layui.layer;
    var view = $('#talk-item').html();
    var callID = 0;
    var msgCount = 0;

    // 留言列表
    if (nid != "undefined") {
        $.ajax({
            type: "GET",
            async: false,
            url: "/rest/message/" + nid + "/1",
            contentType: 'application/json;charset=utf-8',
            dataType: "json",
            success: function (res) {
                msgCount = res.Nav.PageSize * res.Nav.PageCount;
                $('#msg-box').empty();
                for (var i in res.Data) {
                    laytpl(view).render(res.Data[i], function (html) {
                        $('#msg-box').append(html);
                    });
                }
                ;
            }
        });
    }
    // 评论
    laypage.render({
        elem: 'talk-nav-div',
        count: msgCount,
        theme: '#1e9fff',
        jump: function (obj, first) {
            if (!first) {
                $.ajax({
                    type: "GET",
                    url: "/rest/message/" + nid + "/" + obj.curr,
                    contentType: 'application/json;charset=utf-8',
                    dataType: "json",
                    success: function (res) {
                        $('#msg-box').empty();
                        for (var i = 0; i < res.Data.length; i++) {
                            laytpl(view).render(res.Data[i], function (html) {
                                $('#msg-box').append(html);
                            });
                        }
                    }
                });
            }
        }
    });

    if (msgCount == 0) {
        $("#talk-nav-div").remove();
    }

    // 回复
    $("#msg-box").on("click", "#at-msg", function () {
        var obj = $(this);
        callID = parseInt(obj.attr("data-id").trim());
        $("#txt-msg").val("回复 " + obj.prev().text() + ":\n");
        var target_top = $("#comment").offset().top;
        $("html,body").scrollTop(target_top);
        $("#txt-msg").focus();
    });


    // 留言
    $('#btnTalk').on('click', function () {
        if (!$("#txt-nick").val().trim()) {
            layer.msg("请输入您的昵称!");
            return;
        }
        if (!$("#txt-msg").val().trim()) {
            layer.msg("请输入评论内容!");
            return;
        }

        var data = {
            "NID": nid,
            "MCALL": callID,
            "MNick": $("#txt-nick").val().trim(),
            "MMark": $("#txt-mark").val().trim(),
            "MText": $("#txt-msg").val().trim()
        };

        $.ajax({
            type: "POST",
            url: "/rest/message",
            contentType: 'application/json;charset=utf-8',
            dataType: "json",
            data: JSON.stringify(data),
            success: function (data) {
                if (data.Status) {
                    if (data.Data == "AUTH") {
                        window.location.reload()
                    } else {
                        layer.msg("您的评论已提交,请耐心等待审核!");
                        $("#txt-nick").val("");
                        $("#txt-mark").val("");
                        $("#txt-msg").val("");
                    }
                } else {
                    layer.msg(data.Message);
                }
            }
        });
    });

    // 获取目录
    var pageDirID;
    $(".markdown-body h2").each(function (index, elem) {
        pageDirID = "page-dir-" + index;
        $(elem).attr("id", pageDirID);
        $(".page-dir").append('<li><a href="#' + pageDirID + '"><cite>' +(index+1)+'. '+ $(elem).text() + '</cite></a></li>');
    });

    // 渲染目录
    var pageDir = $('.page-dir');
    if (pageDir.html() != '' && $(window).width() > 750) {
        layer.ready(function () {
            layer.open({
                type: 1
                , content: pageDir
                , skin: 'layui-layer-dir'
                , area: '180px'
                , maxHeight: $(window).height() - 300
                , title: '页面目录'
                , offset: 'r'
                , shade: false
				,cancel:function () {
					pageDir.empty();
				}
            });
        });
    }
    exports('talk', {});
});
