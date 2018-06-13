//https://www.cnblogs.com/gccbuaa/p/7073184.html

/*

$("#dg").datagrid('removeEditor','cardNo');//这里的cardNo是须要移除editor的列的field值

加入：

$("#dg").datagrid('addEditor',[ //加入cardNo列editor
            {field:'cardNo',editor:{
                type:'textbox',
                options:{
                    required:true,
                    validType:'length[3,3]', 
                    invalidMessage:'请输入3位号码!'
                }
            }
        }]
*/
$.extend($.fn.datagrid.methods, {
    addEditor: function (jq, param) {
        return jq.each(function () {
            if (param instanceof Array) {
                $.each(param, function (index, item) {
                    var e = $(jq).datagrid('getColumnOption', item.field);
                    e.editor = item.editor;
                });
            } else {
                var e = $(jq).datagrid('getColumnOption', param.field);
                e.editor = param.editor;
            }
        });

    },
    removeEditor: function (jq, param) {
        return jq.each(function () {
            if (param instanceof Array) {
                $.each(param, function (index, item) {
                    var e = $(jq).datagrid('getColumnOption', item);
                    e.editor = {};
                });
            } else {
                var e = $(jq).datagrid('getColumnOption', param);
                e.editor = {};
            }
        });
    }
});

$(function () {
    //设置text需要验证
    $('input[type=text]').validatebox();
    //自定义validator.js
    //扩展easyui表单的验证


   

    $.extend($.fn.validatebox.defaults.rules, {


        //1.验证汉字
        CHS: {
            validator: function (value) {
                return /^[\u0391-\uFFE5]+$/.test(value);
            },
            message: '只能输入汉字'
        },


        //2.移动手机号码验证
        mobile: {//value值为文本框中的值
            validator: function (value) {
                var reg = /^1[3|4|5|8|9]\d{9}$/;
                return reg.test(value);
            },
            message: '输入手机号码格式不准确?'
        },


        //3.电话号码验证

        phone: {// 验证电话号码

            validator: function (value) {
                return /^((\d{2,3})|(\d{3}\-))?(0\d{2,3}|0\d{2,3}-)?[1-9]\d{6,7}(\-\d{1,4})?$/i.test(value);
            },
            message: '格式不正确,请使用下面格式:020-88888888'
        },



        //4.验证IP

        ip: {// 验证IP地址
            validator: function (value) {
                return /\d+\.\d+\.\d+\.\d+/.test(value);
            },
            message: 'IP地址格式不正确'
        },



        // 5.验证姓名，可以是中文或英文

        name: {
            validator: function (value) {
                return /^[\Α-\￥]+$/i.test(value) | /^\w+[\w\s]+\w+$/i.test(value);
            },
            message: '请输入姓名'
        },


        // 6.验证用户名，可以是中文或英文
        username: {// 验证用户名
            validator: function (value) {
                return /^[a-zA-Z][a-zA-Z0-9_]{5,15}$/i.test(value);
            },
            message: '用户名不合法（字母开头，允许6-16字节，允许字母数字下划线）'
        },



        // 7.验证日期
        date: {// 验证日期
            validator: function (value) {
                //格式yyyy-MM-dd或yyyy-M-d
                return /^(?:(?!0000)[0-9]{4}([-]?)(?:(?:0?[1-9]|1[0-2])\1(?:0?[1-9]|1[0-9]|2[0-8])|(?:0?[13-9]|1[0-2])\1(?:29|30)|(?:0?[13578]|1[02])\1(?:31))|(?:[0-9]{2}(?:0[48]|[2468][048]|[13579][26])|(?:0[48]|[2468][048]|[13579][26])00)([-]?)0?2\2(?:29))$/i.test(value);
            },
            message: '清输入合适的日期格式'
        },



        // 8.验证英语

        english: {// 验证英语
            validator: function (value) {
                return /^[A-Za-z]+$/i.test(value);
            },
            message: '请输入英文'
        },


        //9.国内邮编验证
        zipcode: {
            validator: function (value) {
                var reg = /^[1-9]\d{5}$/;
                return reg.test(value);
            },
            message: '邮编必须是非0开始的6位数字.'
        },

        // 10.验证身份证
        idcard: {// 验证身份证
            validator: function (value) {
                return /^\d{15}(\d{2}[A-Za-z0-9])?$/i.test(value);
            },
            message: '身份证号码格式不正确'
        },

        // 11.验证最小长度
        minLength: {
            validator: function (value, param) {
                return value.length >= param[0];
            },
            message: '请输入至少（2）个字符.'
        },

        // 12.验证整数还是小数
        intOrFloat: {// 验证整数或小数
            validator: function (value) {
                return /^\d+(\.\d+)?$/i.test(value);
            },
            message: '请输入数字，并确保格式正确'
        },

        // 13.验证QQ
        qq: {// 验证QQ,从10000开始
            validator: function (value) {
                return /^[1-9]\d{4,9}$/i.test(value);
            },
            message: 'QQ号码格式不正确'
        },
        // 14.验证整数 可正负数
        integer: {// 验证整数 可正负数
            validator: function (value) {
                return /^[+]?[1-9]+\d*$/i.test(value);

                //return /^([+]?[0-9])|([-]?[0-9])+\d*$/i.test(value);
            },
            message: '请输入整数'
        },

        // 15.验证年龄
        age: {// 验证年龄
            validator: function (value) {
                return /^(?:[1-9][0-9]?|1[01][0-9]|120)$/i.test(value);
            },
            message: '年龄必须是0到120之间的整数'
        },


        //16.验证是否包含非法字符
        unnormal: {// 验证是否包含空格和非法字符
            validator: function (value) {
                return /.+/i.test(value);
            },
            message: '输入值不能为空和包含其他非法字符'
        },

        //17.验证传真
        faxno: {// 验证传真
            validator: function (value) {
                // return /^[+]{0,1}(\d){1,3}[ ]?([-]?((\d)|[ ]){1,12})+$/i.test(value);
                return /^((\d{2,3})|(\d{3}\-))?(0\d{2,3}|0\d{2,3}-)?[1-9]\d{6,7}(\-\d{1,4})?$/i.test(value);
            },
            message: '传真号码不正确'
        },

        //18.验证数字

        number: {
            validator: function (value, param) {
                return /^[0-9]+.?[0-9]*$/.test(value);
            },
            message: '请输入数字'
        },

        //19.验证密码两次的输入是否相同
        same: {
            validator: function (value, param) {
                if ($("#" + param[0]).val() != "" && value != "") {
                    return $("#" + param[0]).val() == value;
                } else {
                    return true;
                }
            },
            message: '两次输入的密码不一致！'
        },


        //20.验证车牌号码
        carNo: {
            validator: function (value) {
                return /^[\u4E00-\u9FA5][\da-zA-Z]{6}$/.test(value);
            },
            message: '车牌号码无效（例：粤B12350）'
        },


        //21.用户账号验证(只能包括 _ 数字 字母)
        account: {//param的值为[]中值
            validator: function (value, param) {
                if (value.length < param[0] || value.length > param[1]) {
                    $.fn.validatebox.defaults.rules.account.message = '用户名长度必须在' + param[0] + '至' + param[1] + '范围';
                    return false;
                }
                else {
                    if (!/^[\w]+$/.test(value)) {
                        $.fn.validatebox.defaults.rules.account.message = '用户名只能数字、字母、下划线组成.';
                        return false;
                    }
                    else {
                        return true;
                    }
                }
            },
            message: ''
        }
    });
});


function swapOutSource(url, p, v) {
    if (url.indexOf(p + "=") > 0) {
        //  url = url.replace(new RegExp(p + "=", 'g'), p + "=" + v);
        url = changeURI(url, p, v);
    } else if (url.indexOf("?") > 0) {
        url = url + "&" + p + "=" + v;
    } else {
        url = url + "?" + p + "=" + v;
    }

    return url;
}

function changeURI(url, key, value) {
    key = escape(key); value = escape(value);
    var kvp = url.split('&');
    var i = kvp.length; var x; while (i--) {
        x = kvp[i].split('=');
        if (x[0] == key) {
            x[1] = value;
            kvp[i] = x.join('=');
            break;
        }
    }
    if (i < 0) {
        kvp[kvp.length] = [key, value].join('=');
    } else {
        //this will reload the page, it's likely better to store this until finished
        url = kvp.join('&');
    }

    return url;
}
function getURLParameters(paramName) {
    var sURL = window.document.URL.toString();
    if (sURL.indexOf("?") > 0) {
        var arrParams = sURL.split("?");
        var arrURLParams = arrParams[1].split("&");
        var arrParamNames = new Array(arrURLParams.length);
        var arrParamValues = new Array(arrURLParams.length);
        var i = 0;
        for (i = 0; i < arrURLParams.length; i++) {
            var sParam = arrURLParams[i].split("=");
            arrParamNames[i] = sParam[0];
            if (sParam[1] != "")
                arrParamValues[i] = unescape(sParam[1]);
            else
                arrParamValues[i] = "No Value";
        }

        for (i = 0; i < arrURLParams.length; i++) {
            if (arrParamNames[i] == paramName) {
                //alert("Param:"+arrParamValues[i]);
                return arrParamValues[i];
            }
        }
        return "No Parameters Found";
    }

}
 