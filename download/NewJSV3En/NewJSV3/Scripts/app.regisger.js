
/*
//------------------------------------------------------------------------------
//       时间： 2017-09-25
//       作者： 蔡捷     
//			   
*/
//当前页面对象
var km = {};
km.model = null;
km.parent_model = null;

km.init = function () {
     
    //如果没有动态combobox可删除
    $('.easyui-combobox').each(function (index, element) {
        var options = $(this).combobox('options')
        var u = $(this).attr("url2")

        if (u != undefined) {

            options.url = km.model.urls[u];
            $(this).combobox(options);
        }

    });
    $('#breed_application_content').show();


}
 
$(km.init);

//页面对象参数设置
km.settings = {};

//格式化数据
km.gridformat = {};

 
var gCropsID = 0;
var selectedbreed_applicationIndex = 0; 


/*工具栏权限按钮事件*/
km.toolbar = {
    do_refresh: function () { km.breed_applicationgrid.reload(); },
    do_add: function () {

        km.set_mode('add');

    },
    do_register: function () {

        var jsonObject = $("#breed_application_content").serializeJson();
        jsonObject.Sex = gDictionary["male"];
        var jsonStr = JSON.stringify(jsonObject);
        console.log(jsonStr);
        if (!$("#breed_application_content").form('validate')) {
            layer.msg(gDictionary["data is incorrect, please try again"]);
            return false;
        }
        com.ajax({
            type: 'POST', url: "/home/RegisterMe", data: jsonStr, success: function (result) {
                if (result.s) {

                    $.messager.alert(gDictionary["register success"],  gDictionary["register_message"], "warning", function () {
                       // doLogin(jsonStr);
                      window.location.href = '/Login'
                    });



                } else {
                    com.message('e', result.message);
                }
            }
        });




    } 
};
 

function doLogin(jsonStr) {
    var obj = eval("(" + jsonStr + ")");

    obj.usercode = obj.UserCode;
    obj.password = '123456'
    obj.ip = ''
    obj.city = ''

    com.ajax({
        url: '/Login/Login', data: JSON.stringify(obj), showLoading: false, success: function (result) {
            if (result.s) {
                //com.message('s', result.message);
                $(".login_msg").html('<span style="color:green; font-weight:bold"><img src="/Content/images/ajax-loader.gif" />' + gDictionary["login success"] + '</span>');
                window.location.href = '/home/admin';//+ com.settings.ajax_timestamp();
            } else {
                layer.msg(result.message); window.location.href = '/home/admin';//+ com.settings.ajax_timestamp();
            }
        }
    })
}
