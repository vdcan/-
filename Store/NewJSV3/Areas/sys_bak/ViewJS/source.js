
/*
//------------------------------------------------------------------------------
//       时间： 2017-09-15
//       作者： 蔡捷     
//			  
//       文件： xx_Source.js JS文件
//------------------------------------------------------------------------------
路径：~/Areas/Dev/ViewJS/xx_Source.js
说明：源码(xx_Source)的js文件
*/
//当前页面对象
var km = {};
km.model = null;
km.parent_model = null;

km.init = function () {
    com.initbuttons($('#km_toolbar'), km.model.buttons);
    km.init_parent_model();
    km.template.init();
    km.xx_Sourcegrid.init();
    
    
   //如果没有动态combobox可删除
     $('.easyui-combobox').each(function (index, element) {
       var options = $(this).combobox('options')
          var u = $(this).attr("url2")
      
        if (u!= undefined) { 
         
            options.url =  km.model.urls[u];
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

var selectedxx_SourceIndex = 0;
km.xx_Sourcegrid = {
    jq: null,
    init: function () {
        this.jq = $("#xx_Sourcegrid").datagrid({
            fit: true, border: false, singleSelect: true, rownumbers: false, remoteSort: false, cache: false, method: 'get', idField: '{id}',
            queryParams: { _t: com.settings.timestamp(), page_id: gPageID }, url: km.model.urls["pagelist"],
            pagination: true, pageList: [5, 10, 15, 20, 30, 50, 100], pageSize:  km.pageSize,fitColumns:true,
            columns: [[
            
 	             //   { field: 'id', title: '编号', width: 80, align: 'center', sortable: true },
                            { field: 'file_name', title: '文件名', width: 180, align: 'left', sortable: false },
                            { field: 'file_type', title: '文件类型', width: 80, align: 'left', sortable: false },
                 //           { field: 'add_by', title: '创建人', width: 80, align: 'center', sortable: true },
                 //           { field: 'add_on', title: '创建日期', width: 80, align: 'center', sortable: true },
                            {
                                field: 'publish_flag', title: '发布标志', width: 40, align: 'center', sortable: false, formatter: function (value, row, index) {
                 var h = '未定义';
             
                                    if(value=='0') h ='未发布'; 
                                    if(value=='1') h ='已发布';                                    return h;
                               } 
                                },
                 //                               { field: 'page_id', title: '页面', width: 80, align: 'center', sortable: true },
                 
            ]],
            onClickRow: function (index, row) {
            
                selectedxx_SourceIndex = index;
                km.xx_Sourcegrid.selectedIndex = index;
                km.xx_Sourcegrid.selectedRow = row;
              //  km.rolegrid.setUserRoles(row);
                if (km.xx_Sourcegrid.selectedRow)
                    km.set_mode('show');
            },
            onLoadSuccess: function (data) {
            
             if (data.rows.length > selectedxx_SourceIndex)
                $("#xx_Sourcegrid").datagrid("selectRow", selectedxx_SourceIndex);
              
             km.xx_Sourcegrid.selectedRow = km.xx_Sourcegrid.getSelectedRow();
             if (km.xx_Sourcegrid.selectedRow)
                    km.set_mode('show');
             }
        });//end grid init
    },
    reload: function (queryParams) {
        var defaults = { _t: com.settings.timestamp(), page_id: gPageID };
        if (queryParams) { defaults = $.extend(defaults, queryParams); }
        this.jq.datagrid('reload', defaults);
    },
    getSelectedRow: function () { return this.jq.datagrid('getSelected'); }
};

/*工具栏权限按钮事件*/
km.toolbar = {

    do_publish: function () {
        var jsonStr = JSON.stringify({ file_name: km.xx_Sourcegrid.selectedRow.file_name, page_id: km.xx_Sourcegrid.selectedRow.page_id  });
        // alert(jsonStr);
        com.ajax({
            type: 'POST', url: '/sys/SysBase/publish', data: jsonStr, success: function (result) {

                if (result.s) {
                    com.message('s', result.message);
                } else {
                    com.message('e', result.message);
                }
            }
        });

    },
    do_back: function () { window.history.go(-1); },
    do_refresh: function () { km.xx_Sourcegrid.reload(); },
     do_add: function () {

        km.set_mode('add');

    },
    do_edit: function () {

        if (km.xx_Sourcegrid.selectedRow == null) { layer.msg('请选择一条记录！'); return; }
        km.set_mode('edit');


    },
    do_delete: function () {
        var sRow = km.xx_Sourcegrid.getSelectedRow();
        if (sRow == null) { layer.msg('请选择一条记录！'); return; }
        //if (km.model.loginer.IsSuperAdmin == 0 && sRow.AllowEdit == 0) { layer.msg('此参数不可删除！'); return; }
        var jsonParam = JSON.stringify(sRow);
        com.message('c', ' <b style="color:red">确定要删除源码【' + sRow.id + '】吗？ </b>', function (b) {
            if (b) {
                com.ajax({
                    url: km.model.urls["delete"], data: jsonParam, success: function (result) {
                        if (result.s) {
                            com.message('s', result.message);
                            km.xx_Sourcegrid.reload();
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
                    var jsonObject = $("#xx_Source_content").serializeJson();
                    var jsonStr = JSON.stringify(jsonObject);
        //添加自定义判断
                    //if (jsonObject.ParamCode == "" || jsonObject.ParamValue == "") { flagValid = false; com.message('e', '参数代码或参数名称不能为空！'); return; }
                    if (flagValid) {
                        if (km.settings.op_mode == 'edit') {
                            //com.ajax({
                            //    type: 'POST', url: km.model.urls["edit"], data: jsonStr, success: function (result) {
                            //        AfterEditxx_Source(result);
                            //    }
                            //});

                            var html = $("#TPL_source").textbox("getValue");
                            html = html.replaceAll(">", "&gt;").replaceAll("<", "&lt;");
                            html = html.replaceAll("\\]", "&g1;").replaceAll("\\[", "&l1;");
                            var jsonStr = JSON.stringify({ file_name: km.xx_Sourcegrid.selectedRow.file_name, page_id: km.xx_Sourcegrid.selectedRow.page_id, source: html });
                            // alert(jsonStr);
                            com.ajax({
                                type: 'POST', url: '/sys/SysBase/save', data: jsonStr, success: function (result) {

                                    if (result.s) {
                                        com.message('s', result.message);
                                    } else {
                                        com.message('e', result.message);
                                    }
                                }
                            });

                        }
                        
                        if (km.settings.op_mode == 'add') {
                                com.ajax({
                                type: 'POST', url: km.model.urls["add"], data: jsonStr, success: function (result) {
                                    AfterEditxx_Source(result);
                                }
                            });
                        }
                    }


        var op_mode = km.xx_Sourcegrid.selectedRow == null ? 'clear' : 'show';
        km.set_mode(op_mode);

    },
    do_search: function () {

    }
    ,
    do_undo: function () {
        var op_mode = km.xx_Sourcegrid.selectedRow == null ? 'clear' : 'show';
        km.set_mode(op_mode);
    }
};


function AfterEditxx_Source(result) {
    if (result.s) {
        com.message('s', result.message);
        km.xx_Sourcegrid.reload();
        if (km.settings.op_mode == 'add') {
            km.xx_Sourcegrid.unselectAll();
            km.set_mode('clear');
        }
        if (km.settings.op_mode == 'edit') {
            km.xx_Sourcegrid.selectRow(km.xx_Sourcegrid.selectedIndex);
            km.xx_Sourcegrid.selectedRow = $.extend(km.xx_Sourcegrid.selectedRow, jsonObject);
            km.set_mode('show');
        }


    } else {
        com.message('e', result.message);
    }
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

    if (op_mode == 'show') {
        //console.info(JSON.stringify(km.xx_Sourcegrid.selectedRow));
        $('#xx_Source_content').form('load', km.xx_Sourcegrid.selectedRow);
     //   $('#xx_Source_content_other').form('load', km.xx_Sourcegrid.selectedRow);
        //   km.orgcombotree.jq.combotree('setValue', km.xx_Sourcegrid.selectedRow.DepartmentCode);



        var jsonStr = JSON.stringify({ file_name: km.xx_Sourcegrid.selectedRow.file_name, page_id: km.xx_Sourcegrid.selectedRow.page_id });
        // alert(jsonStr);
        com.ajax({
            type: 'POST', url: '/sys/SysBase/open', data: jsonStr, success: function (result) {

                var html = result.source.replaceAll("&gt;", ">").replaceAll("&lt;", "<");//km.experimentgrid.selectedRow.experiment_plan.replaceAll("&gt;", ">").replaceAll("&lt;", "<")  

                html = html.replaceAll("&amp;", "&");//km.experimentgrid.selectedRow.experiment_plan.replaceAll("&gt;", ">").replaceAll("&lt;", "<")  

               // alert(html);
                $("#TPL_source").textbox("setValue", html);
            }
        });

    } else if (op_mode == 'add') {
        $('#km_toolbar').hide();
        $('#km_toolbar_2').show();
        com.mask($('#west_panel'), true);
        
        $('#user_tabs').tabs('disableTab', 1);
        $('#user_tabs').tabs('disableTab', 2);
        $('#user_tabs').tabs('select', 0);
        
        
        $('.form_content .easyui-combobox').combobox('readonly', false);
        $('.form_content .easyui-combotree').combotree('readonly', false);
        $('.form_content .easyui-textbox').textbox('readonly', false);
        $('.form_content .easyui-numberbox').numberbox('readonly', false);
        
        $('#xx_Source_content').form('clear');
        
                  $('#TPL_file_name').textbox('readonly', true);
                    $('#TPL_file_type').textbox('readonly', true);
                    $('#TPL_add_by').textbox('readonly', true);
                    $('#TPL_add_on').textbox('readonly', true);
                    $('#TPL_page_id').textbox('readonly', true);
          
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

        $('#TPL_file_name').textbox('readonly', true);
        $('#TPL_file_type').textbox('readonly', true);
        $('#TPL_add_by').textbox('readonly', true);
        $('#TPL_add_on').textbox('readonly', true);
        $('#TPL_page_id').textbox('readonly', true);
        $('#TPL_publish_flag').textbox('readonly', true);

              
        //$('#user_tabs').tabs('disableTab', 1);
        //$('#user_tabs').tabs('disableTab', 2);
        //$('#user_tabs').tabs('select', 0);
    } else if (op_mode == 'clear') {
        $('#xx_Source_content').form('clear');
        
    }
}



