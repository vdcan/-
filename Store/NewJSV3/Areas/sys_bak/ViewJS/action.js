﻿
/*
//------------------------------------------------------------------------------
//       时间： 2017-03-27 14:26:40
//       作者： 蔡捷     
//			  
//       文件： Base_Action.js JS文件
//------------------------------------------------------------------------------
路径：~/Areas/Dev/ViewJS/Base_Action.js
说明：动作表(Base_Action)的js文件
*/
//当前页面对象
var km = {};
km.model = null;
km.parent_model = null;

km.init = function () {
    com.initbuttons($('#km_toolbar'), km.model.buttons);
    km.init_parent_model();
    km.template.init();
    km.Base_Actiongrid.init();
    km.Base_Menugrid.init();


    $('.easyui-combobox').each(function (index, element) {
        var options = $(this).combobox('options')
        var u = $(this).attr("url2")



        //  actionddl
        //url: '/Combobox/GetProductDDL'
        if (u != undefined) {
            //$.ajax({  
            //    type: "GET",  
            //    url:'/Combobox/GetProductDDL',//  km.model.urls[u],  
            //    cache: false,  
            //    dataType : "text",  
            //    success: function (data) {
            //        options.data = data;
            //        $("this").combobox(options).combobox("loadData", data);
            //    }  
            //});  

            //  options.url = km.model.urls[options.url2];

            options.url = km.model.urls[u];
            $(this).combobox(options);
        }

    });
}

/*初始化iframe父页面的model对象，即：访问app.index.js文件中的客户端对象*/
km.init_parent_model = function () {
    //只有当前页面有父页面时，可以获取到父页面的model对象 parent.wrapper.model
    if (window != parent) {
        if (parent.wrapper) {
            km.parent_model = parent.wrapper.model;
            //com.message('s', '获取到父页面的model对象：<br>' + JSON.stringify(km.parent_model));
        } else {
            com.showcenter('提示', "存在父页面，但未能获取到parent.wrapper对象");
        }
    } else {
        com.showcenter('提示', "当前页面已经脱离iframe，无法获得parent.wrapper对象！");
    }
}

$(km.init);

//页面对象参数设置
km.settings = {};

//格式化数据
km.gridformat = {};

//百度模板引擎使用 详情：http://tangram.baidu.com/BaiduTemplate/
km.template = {
    tpl_add_html: '',
    jq_add: null,
    initTemplate: function () {
        var data = { title: 'baiduTemplate', list: ['test data 1', 'test data 2', 'test data3'] };
        this.tpl_add_html = baidu.template('tpl_add', data);//使用baidu.template命名空间
        this.jq_add = $(this.tpl_add_html);
    },
    init: function () { this.initTemplate(); }
};




var selectedBase_MenuIndex = 0;
km.Base_Menugrid = {
    jq: null,
    init: function () {
        this.jq = $("#Base_Menugrid").datagrid({
            fit: true, border: false, singleSelect: true, rownumbers: true, remoteSort: true, cache: false, method: 'get', idField: '{IdentityField}',
            queryParams: { _t: com.settings.timestamp(), keyword: "" }, url: km.model.urls["mainpagelist"],
            pagination: true, pageList: [5, 10, 15, 20, 30, 50, 100], pageSize: km.pageSize, fitColumns: true,
            columns: [[

 	                { field: 'id', title: '编号', width: 40, align: 'center', sortable: true },
                            { field: 'MenuName', title: '菜单名', width: 60, align: 'left', sortable: true },
 	                { field: 'MenuCode', title: '菜单代码', width: 120, align: 'left', sortable: true },
                       //     { field: 'ParentCode', title: '', width: 80, align: 'center', sortable: true },
                         //   { field: 'MenuType', title: '', width: 80, align: 'center', sortable: true },
                            { field: 'Url', title: 'URL', width: 80, align: 'left', sortable: true },

            ]],
            onClickRow: function (index, row) {

                selectedBase_MenuIndex = index;
                km.Base_Menugrid.selectedIndex = index;
                km.Base_Menugrid.selectedRow = row;

                selectedBase_ActionIndex = 0;
                $('#Base_Actiongrid').datagrid('load', { pMenuCode: km.Base_Menugrid.selectedRow.MenuCode });
            },
            onLoadSuccess: function () {

                $("#Base_Menugrid").datagrid("selectRow", selectedBase_MenuIndex);
                km.Base_Menugrid.selectedRow = km.Base_Menugrid.getSelectedRow();
                selectedBase_ActionIndex = 0;

                var options = $('#Base_Actiongrid').datagrid('options')
                options.queryParams = { pMenuCode: km.Base_Menugrid.selectedRow.MenuCode };
                options.url = km.model.urls["pagelist"];
                $('#Base_Actiongrid').datagrid(options);

            }
        });//end grid init
    },
    reload: function (queryParams) {
        var defaults = { _t: com.settings.timestamp() };
        if (queryParams) { defaults = $.extend(defaults, queryParams); }
        this.jq.datagrid('reload', defaults);
    },
    getSelectedRow: function () { return this.jq.datagrid('getSelected'); }
};



var selectedBase_ActionIndex = 0;
km.Base_Actiongrid = {
    jq: null,
    init: function () {
        this.jq = $("#Base_Actiongrid").datagrid({
            fit: true, border: false, singleSelect: true, rownumbers: true, remoteSort: true, cache: false, method: 'get', idField: '{IdentityField}',
            queryParams: { _t: com.settings.timestamp(), keyword: "" },// url: km.model.urls["pagelist"],
            pagination: true, pageList: [5, 10, 15, 20, 30, 50, 100], pageSize: km.pageSize, fitColumns: true,
            columns: [[

 	                { field: 'id', title: '编号', width: 40, align: 'center', sortable: true },
                            { field: 'menu_code', title: '菜单码', width: 80, align: 'center', sortable: true },
                            {
                                field: 'action_url_name', title: '动作名', width: 120, align: 'left', sortable: true, formatter: function (value, row, index) {
                                    var h = value;

                                    if (value == 'delete') h = 'delete';
                                    if (value == 'add') h = 'add';
                                    if (value == 'edit') h = 'edit';
                                    if (value == 'pagelist') h = 'pagelist'; return h;
                                }
                            },
                                                {
                                                    field: 'button_name', title: '按钮名', width: 60, align: 'center', sortable: true, formatter: function (value, row, index) {
                                                        var h = '未定义';

                                                        if (value == 'delete') h = '删除';
                                                        if (value == 'add') h = '增加';
                                                        if (value == 'edit') h = '编辑';
                                                        if (value == 'refresh') h = '刷新'; return h;
                                                    }
                                                },
                                                { field: 'procedure_name', title: '存贮过程名', width: 120, align: 'left', sortable: true },
                            {
                                field: 'action_type', title: '动作对应函数', width: 80, align: 'left', sortable: true, formatter: function (value, row, index) {
                                    var h = '未定义';

                                    if (value == 'pager') h = 'Pager';
                                    if (value == 'runProc') h = 'RunProc';
                                    if (value == 'ListDT') h = 'ListDT';
                                    if (value == 'ListDS') h = 'ListDS'; return h;
                                }
                            },

            ]],
            onClickRow: function (index, row) {

                selectedBase_ActionIndex = index;
                km.Base_Actiongrid.selectedIndex = index;
                km.Base_Actiongrid.selectedRow = row;
                //  km.rolegrid.setUserRoles(row);
                if (km.Base_Actiongrid.selectedRow)
                    km.set_mode('show');
            },
            onLoadSuccess: function () {

                //  $("#Base_Actiongrid").datagrid("selectRow", 0);

                km.Base_Actiongrid.selectedRow = km.Base_Actiongrid.getSelectedRow();
                km.set_mode('show');
            }
        });//end grid init
    },
    reload: function (queryParams) {
        var defaults = { _t: com.settings.timestamp() };
        //if (queryParams) { defaults = $.extend(defaults, queryParams); }
       // this.jq.datagrid('reload', defaults);
        this.jq.datagrid('load', { pMenuCode: km.Base_Menugrid.selectedRow.MenuCode });
    },
    getSelectedRow: function () { return this.jq.datagrid('getSelected'); }
};

/*工具栏权限按钮事件*/
km.toolbar = {
    do_refresh: function () {
       // km.Base_Actiongrid.reload();


        $('#Base_Actiongrid').datagrid('load', { pMenuCode: km.Base_Menugrid.selectedRow.MenuCode });
    },
    do_add: function () {

        km.set_mode('add');

    },
    do_edit: function () {

        if (km.Base_Actiongrid.selectedRow == null) { layer.msg('请选择一条记录！'); return; }
        km.set_mode('edit');


    },
    do_delete: function () {
        var sRow = km.Base_Actiongrid.getSelectedRow();
        if (sRow == null) { layer.msg('请选择一条记录！'); return; }
        //if (km.model.loginer.IsSuperAdmin == 0 && sRow.AllowEdit == 0) { layer.msg('此参数不可删除！'); return; }
        var jsonParam = JSON.stringify(sRow);
        com.message('c', ' <b style="color:red">确定要删除动作表【' + sRow.id + '】吗？ </b>', function (b) {
            if (b) {
                com.ajax({
                    url: km.model.urls["delete"], data: jsonParam, success: function (result) {
                        if (result.s) {
                            com.message('s', result.message);
                            km.Base_Actiongrid.reload();
                        } else {
                            com.message('e', result.message);
                        }
                    }
                });
            }
        });
    },
    do_search: function () { },

    do_save: function () {

        var flagValid = true;
        var jsonObject = $("#Base_Action_content").serializeJson();
        jsonObject.menu_code = km.Base_Menugrid.getSelectedRow().MenuCode;
        var jsonStr = JSON.stringify(jsonObject);
        //添加自定义判断
        //if (jsonObject.ParamCode == "" || jsonObject.ParamValue == "") { flagValid = false; com.message('e', '参数代码或参数名称不能为空！'); return; }
        if (flagValid) {
            if (km.settings.op_mode == 'edit') {
                com.ajax({
                    type: 'POST', url: km.model.urls["edit"], data: jsonStr, success: function (result) {
                        AfterEditBase_Action(result);
                    }
                });
            }

            if (km.settings.op_mode == 'add') {
                com.ajax({
                    type: 'POST', url: km.model.urls["add"], data: jsonStr, success: function (result) {
                        AfterEditBase_Action(result);
                    }
                });
            }
        }


        //var op_mode = km.Base_Actiongrid.selectedRow == null ? 'clear' : 'show';
        //km.set_mode(op_mode);

    },
    do_search: function () {

    }
    ,
    do_undo: function () {
        var op_mode = km.Base_Actiongrid.selectedRow == null ? 'clear' : 'show';
        km.set_mode(op_mode);
    }
};


function AfterEditBase_Action(result) {
    if (result.s) {
        com.message('s', result.message);
        km.Base_Actiongrid.reload();
        if (km.settings.op_mode == 'add') {
            km.Base_Actiongrid.unselectAll();
            km.set_mode('clear');
        }
        if (km.settings.op_mode == 'edit') {
            km.Base_Actiongrid.selectRow(km.Base_Actiongrid.selectedIndex);
            km.Base_Actiongrid.selectedRow = $.extend(km.Base_Actiongrid.selectedRow, jsonObject);
            km.set_mode('show');
        }

        
        //com.ajax({
        //    type: 'POST', url: km.model.urls["reload"],  success: function (result) {
        //        AfterEditBase_Action(result);
        //    }
        //});
        
    } else {
        com.message('e', result.message);
    }
}

function convert_code() { 
    var jsonStr ={procedure_name:km.Base_Actiongrid.selectedRow.procedure_name ,conn_str:km.Base_Actiongrid.selectedRow.conn_str }
      com.ajax({
          type: 'POST', url: "/sys/sysbase/GetProcParamters", data: jsonStr, success: function (result) {
              var d = {};
              for (var i = 0; i < result.length; i++) {
                   //console.log(result[i].name);
                 result[i].name = result[i].name.substring(1);
              }
              d.data = result;
              console.log(result);

              d.action_url_name = km.Base_Actiongrid.selectedRow.action_url_name
              d.js_event = km.Base_Actiongrid.selectedRow.js_event.replaceAll("\\(\\)", "");
              $("#tmpl1").tmpl(d).appendTo('#code_div');
             // $("#tbCode").val($('#code_div').text());

          }
      });

}

function Load(id) {


              $('#code_div').html(""); 
              $("#template").load("/Areas/sys/ViewJS/" + id + ".html?t=" + com.settings.timestamp(), (function () {
      //  $("#item_data").tmpl(data).appendTo('#div_item_data');

        convert_code();
    }));
}


/*显示：'show'  新增：'add'  编辑 'edit'  清空 'clear'*/
km.set_mode = function (op_mode) {
    km.settings.op_mode = op_mode;
    $('#km_toolbar').show();
    $('#km_toolbar_2').hide();
    com.mask($('#west_panel'), false);
    $('#user_tabs').tabs('enableTab', 1);
    $('#user_tabs').tabs('enableTab', 2);
    $('.form_content .easyui-combobox').combobox('readonly', true);
    $('.form_content .easyui-combotree').combotree('readonly', true);
    $('.form_content .easyui-textbox').textbox('readonly', true);
    $('.form_content .easyui-numberbox').numberbox('readonly', true);


    // $('.easyui-combobox')


    if (op_mode == 'show') {
        //console.info(JSON.stringify(km.Base_Actiongrid.selectedRow));
        $('#Base_Action_content').form('load', km.Base_Actiongrid.selectedRow);
        $('#Base_Action_content_other').form('load', km.Base_Actiongrid.selectedRow);
        //   $("#template").text(km.Base_Actiongrid.selectedRow.code_help)
        if (km.Base_Actiongrid.selectedRow)
        Load(km.Base_Actiongrid.selectedRow.action_type);

        //   km.orgcombotree.jq.combotree('setValue', km.Base_Actiongrid.selectedRow.DepartmentCode);
    } else if (op_mode == 'add') {
        $('#km_toolbar').hide();
        $('#km_toolbar_2').show();
        com.mask($('#west_panel'), true);

        $('#TPL_menu_code').textbox('readonly', true);
        $('#user_tabs').tabs('disableTab', 1);
        $('#user_tabs').tabs('disableTab', 2);
        $('#user_tabs').tabs('select', 0);


        $('.form_content .easyui-combobox').combobox('readonly', false);
        $('.form_content .easyui-combotree').combotree('readonly', false);
        $('.form_content .easyui-textbox').textbox('readonly', false);
        $('.form_content .easyui-numberbox').numberbox('readonly', false);

        $('#Base_Action_content').form('clear');

        $('#TPL_menu_code').textbox('setValue', km.Base_Menugrid.getSelectedRow().MenuCode);
      //  jsonObject.menu_code = km.Base_Menugrid.getSelectedRow().MenuCode;
        //  $('#TPL_id').val(0);
        //$('#TPL_Enabled').combobox('setValue', 1);
        //$('#TPL_UserType').combobox('setValue', 3);
        //$('#TPL_IsSingleLogin').combobox('setValue', 1);
        //$('#TPL_Sex').combobox('setValue', '男');
        //$('#TPL_Sort').numberbox('setValue', 888);

    } else if (op_mode == 'edit') {
        //alert($('.form_content .easyui-text'));
        $('.form_content .easyui-combobox').combobox('readonly', false);
        $('.form_content .easyui-combotree').combotree('readonly', false);
        $('.form_content .easyui-textbox').textbox('readonly', false);
        $('.form_content .easyui-numberbox').numberbox('readonly', false);
        $('#km_toolbar').hide();
        $('#km_toolbar_2').show();
        com.mask($('#west_panel'), true);
        $('#TPL_menu_code').textbox('readonly', true);

        //$('#user_tabs').tabs('disableTab', 1);
        //$('#user_tabs').tabs('disableTab', 2);
        //$('#user_tabs').tabs('select', 0);
    } else if (op_mode == 'clear') {
        $('#Base_Action_content').form('clear');

    }
}



