/*
说明：easyui扩展/常用的方法 
*/

// 定义全局对象  
var kmui = $.extend({}, kmui);


/** 
 * 扩展 用于datagrid/treegrid/tree/combogrid/combobox/form加载数据出错时的操作 
 *  
 * @param XMLHttpRequest 
 */
var easyuiErrorFunction = function (XMLHttpRequest) {
    $.messager.progress('close');
 //   $.messager.alert('easyui组件加载错误', XMLHttpRequest.responseText);
};
$.fn.datagrid.defaults.onLoadError = easyuiErrorFunction;
$.fn.treegrid.defaults.onLoadError = easyuiErrorFunction;
$.fn.tree.defaults.onLoadError = easyuiErrorFunction;
$.fn.combogrid.defaults.onLoadError = easyuiErrorFunction;
$.fn.combobox.defaults.onLoadError = easyuiErrorFunction;
$.fn.form.defaults.onLoadError = easyuiErrorFunction;

/** 
 * 防止panel/window/dialog组件超出浏览器边界 
 *  
 * @param left 
 * @param top 
 */
var easyuiPanelOnMove = function (left, top) {
    var l = left;
    var t = top;
    if (l < 1) {
        l = 1;
    }
    if (t < 1) {
        t = 1;
    }
    var width = parseInt($(this).parent().css('width')) + 14;
    var height = parseInt($(this).parent().css('height')) + 14;
    var right = l + width;
    var buttom = t + height;
    var browserWidth = $(window).width();
    var browserHeight = $(window).height();
    if (right > browserWidth) {
        l = browserWidth - width;
    }
    if (buttom > browserHeight) {
        t = browserHeight - height;
    }
    $(this).parent().css({/* 修正面板位置 */
        left: l,
        top: t
    });
};
$.fn.dialog.defaults.onMove = easyuiPanelOnMove;
$.fn.window.defaults.onMove = easyuiPanelOnMove;
$.fn.panel.defaults.onMove = easyuiPanelOnMove;

/** 
 * 扩展easyui的validator插件rules，支持更多类型验证 
 */
$.extend($.fn.validatebox.defaults.rules, {
    minLength: { // 判断最小长度  
        validator: function (value, param) {
            return value.length >= param[0];
        },
        message: '最少输入 {0} 个字符'
    },
    length: { // 长度  
        validator: function (value, param) {
            var len = $.trim(value).length;
            return len >= param[0] && len <= param[1];
        },
        message: "输入内容长度必须介于{0}和{1}之间"
    },
    phone: {// 验证电话号码  
        validator: function (value) {
            return /^((\(\d{2,3}\))|(\d{3}\-))?(\(0\d{2,3}\)|0\d{2,3}-)?[1-9]\d{6,7}(\-\d{1,4})?$/i.test(value);
        },
        message: '格式不正确,请使用下面格式:020-88888888'
    },
    mobile: {// 验证手机号码  
        validator: function (value) {
            return /^(13|15|18)\d{9}$/i.test(value);
        },
        message: '手机号码格式不正确'
    },
    phoneAndMobile: {// 电话号码或手机号码  
        validator: function (value) {
            return /^((\(\d{2,3}\))|(\d{3}\-))?(\(0\d{2,3}\)|0\d{2,3}-)?[1-9]\d{6,7}(\-\d{1,4})?$/i.test(value) || /^(13|15|18)\d{9}$/i.test(value);
        },
        message: '电话号码或手机号码格式不正确'
    },
    idcard: {// 验证身份证  
        validator: function (value) {
            return /^\d{15}(\d{2}[A-Za-z0-9])?$/i.test(value) || /^\d{18}(\d{2}[A-Za-z0-9])?$/i.test(value);
        },
        message: '身份证号码格式不正确'
    },
    intOrFloat: {// 验证整数或小数  
        validator: function (value) {
            return /^\d+(\.\d+)?$/i.test(value);
        },
        message: '请输入数字，并确保格式正确'
    },
    currency: {// 验证货币  
        validator: function (value) {
            return /^\d+(\.\d+)?$/i.test(value);
        },
        message: '货币格式不正确'
    },
    qq: {// 验证QQ,从10000开始  
        validator: function (value) {
            return /^[1-9]\d{4,9}$/i.test(value);
        },
        message: 'QQ号码格式不正确'
    },
    integer: {// 验证整数  
        validator: function (value) {
            return /^[+]?[1-9]+\d*$/i.test(value);
        },
        message: '请输入整数'
    },
    chinese: {// 验证中文  
        validator: function (value) {
            return /^[\u0391-\uFFE5]+$/i.test(value);
        },
        message: '请输入中文'
    },
    chineseAndLength: {// 验证中文及长度  
        validator: function (value) {
            var len = $.trim(value).length;
            if (len >= param[0] && len <= param[1]) {
                return /^[\u0391-\uFFE5]+$/i.test(value);
            }
        },
        message: '请输入中文'
    },
    english: {// 验证英语  
        validator: function (value) {
            return /^[A-Za-z]+$/i.test(value);
        },
        message: '请输入英文'
    },
    englishAndLength: {// 验证英语及长度  
        validator: function (value, param) {
            var len = $.trim(value).length;
            if (len >= param[0] && len <= param[1]) {
                return /^[A-Za-z]+$/i.test(value);
            }
        },
        message: '请输入英文'
    },
    englishUpperCase: {// 验证英语大写  
        validator: function (value) {
            return /^[A-Z]+$/.test(value);
        },
        message: '请输入大写英文'
    },
    unnormal: {// 验证是否包含空格和非法字符  
        validator: function (value) {
            return /.+/i.test(value);
        },
        message: '输入值不能为空和包含其他非法字符'
    },
    username: {// 验证用户名  
        validator: function (value) {
            return /^[a-zA-Z][a-zA-Z0-9_]{5,15}$/i.test(value);
        },
        message: '用户名不合法（字母开头，允许6-16字节，允许字母数字下划线）'
    },
    faxno: {// 验证传真  
        validator: function (value) {
            return /^((\(\d{2,3}\))|(\d{3}\-))?(\(0\d{2,3}\)|0\d{2,3}-)?[1-9]\d{6,7}(\-\d{1,4})?$/i.test(value);
        },
        message: '传真号码不正确'
    },
    zip: {// 验证邮政编码  
        validator: function (value) {
            return /^[1-9]\d{5}$/i.test(value);
        },
        message: '邮政编码格式不正确'
    },
    ip: {// 验证IP地址  
        validator: function (value) {
            return /d+.d+.d+.d+/i.test(value);
        },
        message: 'IP地址格式不正确'
    },
    name: {// 验证姓名，可以是中文或英文  
        validator: function (value) {
            return /^[\u0391-\uFFE5]+$/i.test(value) | /^\w+[\w\s]+\w+$/i.test(value);
        },
        message: '请输入姓名'
    },
    engOrChinese: {// 可以是中文或英文  
        validator: function (value) {
            return /^[\u0391-\uFFE5]+$/i.test(value) | /^\w+[\w\s]+\w+$/i.test(value);
        },
        message: '请输入中文'
    },
    engOrChineseAndLength: {// 可以是中文或英文  
        validator: function (value) {
            var len = $.trim(value).length;
            if (len >= param[0] && len <= param[1]) {
                return /^[\u0391-\uFFE5]+$/i.test(value) | /^\w+[\w\s]+\w+$/i.test(value);
            }
        },
        message: '请输入中文或英文'
    },
    carNo: {
        validator: function (value) {
            return /^[\u4E00-\u9FA5][\da-zA-Z]{6}$/.test(value);
        },
        message: '车牌号码无效（例：粤B12350）'
    },
    carenergin: {
        validator: function (value) {
            return /^[a-zA-Z0-9]{16}$/.test(value);
        },
        message: '发动机型号无效(例：FG6H012345654584)'
    },
    same: {
        validator: function (value, param) {
            if ($("#" + param[0]).val() != "" && value != "") {
                return $("#" + param[0]).val() == value;
            } else {
                return true;
            }
        },
        message: '两次输入的密码不一致!'
    }
});

/** 
 * 扩展easyui validatebox的两个方法.移除验证和还原验证 
 */
$.extend($.fn.validatebox.methods, {
    remove: function (jq, newposition) {
        return jq.each(function () {
            $(this).removeClass("validatebox-text validatebox-invalid").unbind('focus.validatebox').unbind('blur.validatebox');
            // remove tip  
            // $(this).validatebox('hideTip', this);  
        });
    },
    reduce: function (jq, newposition) {
        return jq.each(function () {
            var opt = $(this).data().validatebox.options;
            $(this).addClass("validatebox-text").validatebox(opt);
            // $(this).validatebox('validateTip', this);  
        });
    },
    validateTip: function (jq) {
        jq = jq[0];
        var opts = $.data(jq, "validatebox").options;
        var tip = $.data(jq, "validatebox").tip;
        var box = $(jq);
        var value = box.val();
        function setTipMessage(msg) {
            $.data(jq, "validatebox").message = msg;
        };
        var disabled = box.attr("disabled");
        if (disabled == true || disabled == "true") {
            return true;
        }
        if (opts.required) {
            if (value == "") {
                box.addClass("validatebox-invalid");
                setTipMessage(opts.missingMessage);
                $(jq).validatebox('showTip', jq);
                return false;
            }
        }
        if (opts.validType) {
            var result = /([a-zA-Z_]+)(.*)/.exec(opts.validType);
            var rule = opts.rules[result[1]];
            if (value && rule) {
                var param = eval(result[2]);
                if (!rule["validator"](value, param)) {
                    box.addClass("validatebox-invalid");
                    var message = rule["message"];
                    if (param) {
                        for (var i = 0; i < param.length; i++) {
                            message = message.replace(new RegExp("\\{" + i + "\\}", "g"), param[i]);
                        }
                    }
                    setTipMessage(opts.invalidMessage || message);
                    $(jq).validatebox('showTip', jq);
                    return false;
                }
            }
        }
        box.removeClass("validatebox-invalid");
        $(jq).validatebox('hideTip', jq);
        return true;
    },
    showTip: function (jq) {
        jq = jq[0];
        var box = $(jq);
        var msg = $.data(jq, "validatebox").message
        var tip = $.data(jq, "validatebox").tip;
        if (!tip) {
            tip = $("<div class=\"validatebox-tip\">" + "<span class=\"validatebox-tip-content\">" + "</span>" + "<span class=\"validatebox-tip-pointer\">" + "</span>" + "</div>").appendTo("body");
            $.data(jq, "validatebox").tip = tip;
        }
        tip.find(".validatebox-tip-content").html(msg);
        tip.css({
            display: "block",
            left: box.offset().left + box.outerWidth(),
            top: box.offset().top
        });
    },
    hideTip: function (jq) {
        jq = jq[0];
        var tip = $.data(jq, "validatebox").tip;
        if (tip) {
            tip.remove;
            $.data(jq, "validatebox").tip = null;
        }
    }
});

/** 
 * 对easyui dialog 封装 
 */
kmui.dialog = function (options) {
    var opts = $.extend({
        modal: true,
        onClose: function () {
            $(this).dialog('destroy');
        }
    }, options);
    return $('<div/>').dialog(opts);
};


/** 
 * 扩展easyui-dialog插件  适合iframe页面使用，会在顶层弹出对话框 yxz 23:49 2015-12-17
 */
$.fn.dialog_ext = function (opts) {
    var query = parent.$;
    var self = this;
    //query.parser.parse($(this));
    var defaults = {
        title: '对话框标题',
        iconCls: '',
        //width: 600,
        //height: 400,
        cache: false,
        modal: true,
        html: '',
        url: '', top: 20,
        btnText: '确定',
        btnIconCls: 'icon-ok',
        onClickButton: function (win) { alert('点击了确定按钮.'); },
        onOpenEx: function (win) { alert('对话框打开前执行.'); }
    }
    opts = query.extend(defaults, opts);
    if (parent.Cleandialog!=  undefined)
        parent.Cleandialog();
    var win = query('<div></div>').appendTo('#dialog').html(self.html());
    var btns = {
        onLoad: function () {
            alert('ok');
        },
        onBeforeOpen: function () {
             
        },
        onOpen: function () {
            opts.onOpenEx(win);
        },
        buttons: [{
            text: opts.btnText, iconCls: opts.btnIconCls, handler: function () { opts.onClickButton(win); }
        }, {
            text: '取消', iconCls: 'icon-cancel', handler: function () { win.dialog('destroy'); }
        }]
    }
    opts = query.extend(btns, opts);
    query.parser.parse(win);
    win.dialog(opts);
    return win;
}




/** 
 * 扩展easyui-dialog插件  适合iframe页面使用，会在顶层弹出对话框 yxz 23:49 2015-12-17
 */
$.fn.dialog_iframe = function (opts) {
    var query = parent.$;
    var self = this;
    //query.parser.parse($(this));
    var defaults = {
        title: '对话框标题',
        iconCls: '',
        //width: 600,
        //height: 400,
        cache: false,
        modal: true,
        html: '',
        url: '', top: 20,
        btnText: '确定',
        btnIconCls: 'icon-ok',
        onClickButton: function (win) { alert('点击了确定按钮.'); },
        onOpenEx: function (win) { alert('对话框打开前执行.'); }
    }
    opts = query.extend(defaults, opts);
    if (parent.Cleandialog != undefined)
        parent.Cleandialog();
    var win = query('<div></div>').appendTo('#dialog').html("<iframe src='" + opts.url+ "'> </iframe>");
    var btns = {
        onLoad: function () {
            alert('ok');
        },
        onBeforeOpen: function () {

        },
        onOpen: function () {
            opts.onOpenEx(win);
        },
        buttons: [{
            text: opts.btnText, iconCls: opts.btnIconCls, handler: function () { opts.onClickButton(win); }
        }, {
            text: '取消', iconCls: 'icon-cancel', handler: function () { win.dialog('destroy'); }
        }]
    }
    opts = query.extend(btns, opts);
    query.parser.parse(win);
    win.dialog(opts);
    return win;
}

/*当前页面弹出对话框*/
$.fn.dialog_page = function (opts) {
    var self = this;
    var defaults = {
        title: '对话框标题',
        iconCls: '',
        top: 5,
        cache: false,
        modal: true,
        html: '',
        url: '',
        btnText: '确定',
        btnIconCls: 'icon-ok',
        onClickButton: function (self) { alert('点击了确定按钮.'); }
    }
    opts = $.extend(defaults, opts);
    var btns = {
        buttons: [{
            text: opts.btnText, iconCls: opts.btnIconCls, handler: function () { opts.onClickButton(self); }
        }, {
            text: '取消', iconCls: 'icon-cancel', handler: function () { self.dialog('close'); }
        }]
    }
    opts = $.extend(btns, opts);
    //$.parser.parse(self);
    self.dialog(opts);
    return self;
}

