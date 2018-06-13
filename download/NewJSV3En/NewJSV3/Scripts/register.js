var role = {
    UserCode: "",
    description: "",
    store_name: "",
    address: "",
    city: "",
    province: "",
    phone: "",
    password: "",
    email: ""
}
 
var flag = false;
var flag1 = false;
$(function () {
    $('#TPL_user_name').change(function () {
        var json = {};
        json.UserName = $('#TPL_user_name').val();
        var data = JSON.stringify(json);
        com.ajax({
            url: "/Register/ExistUserName", data: data, success: function (result) {
                if (result != "") {
                    $(".demo1").text("该账号已注册！！").css("color", "red");
                    flag1 = false;
                } else {
                    $(".demo1").text("该账号可以注册").css("color", "green");
                    flag1 = true;
                }
            }, error: function () { alert("查询账号是否重名出现错误"); }
        })

    });
    $('#TPL_user_name').blur(function () {
        if ($('#TPL_user_name').val() == "") {
            $(".demo1").hide();
        }
        else {
            $(".demo1").show();
        }
    });
    $('#TPL_phone').change(function () {
        var value = $('#TPL_phone').val();
        if (/^((\(\d{2,3}\))|(\d{3}\-))?(\(0\d{2,3}\)|0\d{2,3}-)?[1-9]\d{6,7}(\-\d{1,4})?$/i.test(value) || /^(13|15|18)\d{9}$/i.test(value)) {
            $(".demo2").text("电话号码或手机号码格式符合规范").css("color", "green");
        } else {
            $(".demo2").text("电话号码或手机号码格式不正确").css("color", "red");
        }
    });
    $('#TPL_phone').blur(function () {
        if ($('#BuyerTel').val() == "") {
            $(".demo2").hide();
        }
        else {
            $(".demo2").show();
        }
    });
    $('#TPL_email').change(function () {
        var json = {};
        json.Email = $('#TPL_email').val(); 
        var data = JSON.stringify(json);
        com.ajax({
            url: "/Register/ExistEmail", data: data, success: function (result) {
                if (result != "") {
                    $(".demo3").text("该电子邮件已被使用！！").css("color", "red");
                    flag = false;
                } else {
                    $(".demo3").text("该电子邮件可以使用！").css("color", "green");
                    flag = true;
                }
            }, error: function () { alert("查询电子邮件是否重复出现错误"); }
        })

    });
    $('#TPL_email').blur(function () {
        if ($('#TPL_email').val() == "") {
            $(".demo3").hide();
        }
        else {
            $(".demo3").show();
        }
    });
});


var doRegist = function () {
    role.UserCode = $("#TPL_user_name").val();
    role.description = $("#TPL_description").val();
    role.store_name = $('#TPL_store_name').val();
    role.address = $("#TPL_address").val();
    role.city = $('#TPL_city').val();
    role.province = $('#TPL_province').val();
    role.phone = $('#TPL_phone').val();
    role.password = $('#TPL_password').val();
    role.email = $('#TPL_email').val();

    if (role.UserCode == "") { layer.msg('请输入账号'); return; }
    if (role.phone == "") { layer.msg('请输入电话'); return; }
    if (role.address == "") { layer.msg('请输入收货地址'); return; }
    if (role.store_name == "") { layer.msg('请输入单位名称'); return; }
    if (role.city == "") { layer.msg('请输入城市'); return; }
    if (role.province == "") { layer.msg('请输入省'); return; }
    if (role.email == "") { layer.msg('请输入电子邮件'); return; }
     

    if (flag && flag1) {
        $(".login_msg").html('<span style="color:red; font-weight:bold"><img src="/Content/images/ajax-loader.gif" />正在注册帐号，请稍等</span>');
        com.ajax({
            url: '/Register/Register', data: JSON.stringify(role), showLoading: false, success: function (result) {
                if (result.s) {
                    $('.login_msg').html('<span style="color:red; font-weight:bold"><img src="/Content/images/ajax-loader.gif" />注册成功，正在跳转到登录页面</span>')
                    window.setTimeout("window.location.href = '/Login'", 1000);
                } else {
                    layer.msg(result.emsg);
                }
            }, error: function () {
                alert("注册失败");
            }
        })
    }
    else {
        alert("单位名称或账号已注册过,请联系管理员！！");
        return;
    }
}