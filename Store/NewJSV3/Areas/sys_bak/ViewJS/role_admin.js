
/*
//------------------------------------------------------------------------------ 
//       时间： 2017-09-19
//       作者： 蔡捷   
//			 新角色管理，使用新的程序生成器 
//       文件： role_admin.cshtml 页面文件 
//       文件： role_admin.js JS文件
//------------------------------------------------------------------------------
路径：~/Areas/sys/ViewJS/role_admin.js
说明：角色管理(role_admin)的js文件
*/
//当前页面对象
var km = {};
km.model = null;
km.parent_model = null;

km.init = function () {
    com.initbuttons($('#km_toolbar'), km.model.buttons);
    km.init_parent_model(); 
 //   km.template.init();
    role_6_Init();
    LoadMenuData();
    
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



 
 
//------------------------------------------------------------------------------ 
//       时间： 2017-09-19
//       作者： 蔡捷   
//			 角色管理  
//------------------------------------------------------------------------------  

function  role_6_Init(){
	km.role.init();
}

var gRoleMenu ;//= @Html.Raw(ViewData["RoleMenu"]);
var gRoleMenuButton;// = @Html.Raw(ViewData["RoleMenuButton"]);

function LoadMenuData() {

    com.ajax({
        type: 'POST', url: km.model.urls["RoleMenu"],   showLoading: false, success: function (result) {
            gRoleMenu = result;
        }
    });// end ajax  
    com.ajax({
        type: 'POST', url: km.model.urls["RoleMenuButton"], showLoading: false, success: function (result) {
            gRoleMenuButton = result;
        }
    });// end ajax  
}

var selectedroleIndex = 0;
km.role= {
    jq: null,
     	             	
    init: function () {
        this.jq = $("#role").datagrid({
            fit: true, border: false, singleSelect: true, rownumbers: true, remoteSort: true, cache: false, method: 'get', idField: 'id',
             	            
            queryParams: { _t: com.settings.timestamp(), keyword: "" }, 
            url: km.model.urls["role_pager"],
               	            pagination: true, pageList: [5, 10, 15, 20, 30, 50, 100], pageSize:  km.pageSize,fitColumns:true,
            columns: [[
            
 	                { field: 'RoleCode', title: '角色代码', width: 80, align: 'center', sortable: true },
                            { field: 'RoleName', title: '角色名', width: 80, align: 'left', sortable: true },
                            { field: 'RoleType', title: '角色类型', width: 80, align: 'left', sortable: true,formatter: function (value, row, index) {
                 var h = '未定义';
             
                                    if(value=='0') h ='未定义'; 
                                    if(value=='1') h ='系统角色'; 
                                    if(value=='2') h ='业务角色'; 
                                    if(value=='3') h ='其他';                                    return h;
                               } 
                                 },
                                                { field: 'Sort', title: '排序', width: 80, align: 'center', sortable: true },
                            { field: 'Enabled', title: '启用', width: 80, align: 'left', sortable: true,formatter: function (value, row, index) {
                 var h = '未定义';
             
                                    if(value=='0') h ='禁用'; 
                                    if(value=='1') h ='启用';                                    return h;
                               } 
                                 },
                                                { field: 'Remark', title: '备注', width: 180, align: 'left', sortable: true },
                                                 {
                                                     field: 'id', title: '', width: 50, align: 'left', formatter: function (value, row, index) {
                                                         return "<a href='javascript:set_role(" + row.id + ")' >设置权限</a>";
                                                     }
                                                 }
                 
            ]],
            onClickRow: function (index, row) {
            
                selectedroleIndex = index;
                km.role.selectedIndex = index;
                km.role.selectedRow = row; 
                
                if (km.role.selectedRow)
                    km.set_mode_role('show');
            },
            onLoadSuccess: function (data) {
            
             if (data.rows.length >0){
            
             	if (data.rows.length <= selectedroleIndex)
             		selectedroleIndex =0
              $("#role").datagrid("selectRow", selectedroleIndex);
             }
                km.role.selectedRow = km.role.getSelectedRow(); 
            
                if (km.role.selectedRow)
                  km.set_mode_role('show');
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



/*工具栏权限按钮事件*/
km.toolbar = {
    do_refresh: function () { km.role.reload(); },
     do_add: function () {

        km.set_mode_role('add');

    },
    do_edit: function () {

        if (km.role.selectedRow == null) { layer.msg('请选择一条记录！'); return; }
        km.set_mode_role('edit');


    },
    do_delete: function () {
        var sRow = km.role.getSelectedRow();
        if (sRow == null) { layer.msg('请选择一条记录！'); return; }
        //if (km.model.loginer.IsSuperAdmin == 0 && sRow.AllowEdit == 0) { layer.msg('此参数不可删除！'); return; }
        var jsonParam = JSON.stringify(sRow);
        com.message('c', ' <b style="color:red">确定要删除角色【' + sRow.id + '】吗？ </b>', function (b) {
            if (b) {
                com.ajax({
                    url: km.model.urls["role_delete"], data: jsonParam, success: function (result) {
                        if (result.s) {
                            com.message('s', result.message);
                            km.role.reload();
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
                    var jsonObject = $("#role_content").serializeJson();
                        
                    var jsonStr = JSON.stringify(jsonObject);
                       if (!$("#role_content").form('validate')) {
                        layer.msg('输入数据有错误，请纠正后再存。');
                        return false;
                    }
        //添加自定义判断
                    //if (jsonObject.ParamCode == "" || jsonObject.ParamValue == "") { flagValid = false; com.message('e', '参数代码或参数名称不能为空！'); return; }
                    if (flagValid) {
                        if (km.settings.op_mode == 'edit') {
                            com.ajax({
                                type: 'POST', url: km.model.urls["role_update"], data: jsonStr, success: function (result) {
                                    AfterEditrole(result);
                                }
                            });
                        }
                        
                        if (km.settings.op_mode == 'add') {
                                com.ajax({
                                type: 'POST', url: km.model.urls["role_insert"], data: jsonStr, success: function (result) {
                                    AfterEditrole(result);
                                }
                            });
                        }
                    }


        var op_mode = km.role.selectedRow == null ? 'clear' : 'show';
        km.set_mode_role(op_mode);

    },
    do_search: function () {

    }
    ,
    do_undo: function () {
        var op_mode = km.role.selectedRow == null ? 'clear' : 'show';
        km.set_mode_role(op_mode);
    }
};


function AfterEditrole(result) {
    if (result.s) {
        com.message('s', result.message);
        km.role.reload();
        if (km.settings.op_mode == 'add') {
            km.role.unselectAll();
            km.set_mode_role('clear');
        }
        if (km.settings.op_mode == 'edit') {
            km.role.selectRow(km.role.selectedIndex);
            km.role.selectedRow = $.extend(km.role.selectedRow, jsonObject);
            km.set_mode_role('show');
        }


    } else {
        com.message('e', result.message);
    }
}



/*显示：'show'  新增：'add'  编辑 'edit'  清空 'clear'*/
km.set_mode_role = function (op_mode) {
    km.settings.op_mode = op_mode;
    $('#km_toolbar').show();
    $('#km_toolbar_2').hide();
    com.mask($('#west_panel'), false);
   // $('#user_tabs').tabs('enableTab', 1);
   // $('#user_tabs').tabs('enableTab', 2);
    $('.form_content .easyui-combobox').combobox('readonly', true);
    $('.form_content .easyui-combotree').combotree('readonly', true);
    $('.form_content .easyui-textbox').textbox('readonly', true);
    $('.form_content .easyui-numberbox').numberbox('readonly', true);

    if (op_mode == 'show') {
        //console.info(JSON.stringify(km.role.selectedRow));
        $('#role_content').form('load', km.role.selectedRow);
     //   km.orgcombotree.jq.combotree('setValue', km.role.selectedRow.DepartmentCode);
    } else if (op_mode == 'add') {
        $('#km_toolbar').hide();
        $('#km_toolbar_2').show();
        com.mask($('#west_panel'), true);
        
      //  $('#user_tabs').tabs('disableTab', 1);
      //  $('#user_tabs').tabs('disableTab', 2);
      //  $('#user_tabs').tabs('select', 0);
        
        
        $('.form_content .easyui-combobox').combobox('readonly', false);
        $('.form_content .easyui-combotree').combotree('readonly', false);
        $('.form_content .easyui-textbox').textbox('readonly', false);
        $('.form_content .easyui-numberbox').numberbox('readonly', false);
        
        $('#role_content').form('clear');
        
                  $('#TPL_AddBy').textbox('readonly', true);
                    $('#TPL_AddOn').textbox('readonly', true);
          
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
              
        //$('#user_tabs').tabs('disableTab', 1);
        //$('#user_tabs').tabs('disableTab', 2);
        //$('#user_tabs').tabs('select', 0);
    } else if (op_mode == 'clear') {
        $('#role_content').form('clear');
        
    }
}


var gRoleID = 0;
function set_role(id) {
    gRoleID = id;
    $('#selectRoles').dialog('open');
    km.maingrid.init();
}


/*菜单treegrid*/
km.maingrid = {
    jq: null,
    selectedIndex: 0,
    selectedRow: null,
    init: function () {
        this.jq = $("#maingrid").treegrid({
            fit: true, border: false, singleSelect: true, rownumbers: false, nowrap: false, remoteSort: false, cache: false, striped: false, showHeader: false, scrollbarSize: 5,
            method: 'get', idField: 'id', treeField: 'MenuName',
            queryParams: { _t: com.settings.timestamp() }, url: km.model.urls["menulist"], selectOnCheck: false,
            checkOnSelect: false, animate: true, checkbox: true,
        //  fitColumns:true,
            columns: [[
                {
                    field: 'MenuName', title: '菜单名称', width: 180, align: 'left', formatter: function (value, row, index) {
                        var h = value;
                        if (row.MenuType == 1) {
                            h = com.html_formatter.get_color_html(value, 'blue');
                        }
                        var h_input_checkbox = '<input type="checkbox" id="ckmenu-' + row.id + '" name="ckmenu" onclick="km.maingrid.menuCheckboxClick(this,\'' + row.id + '\')"/>  ';
                        return h_input_checkbox + h;
                    }
                },
                //{
                //    field: 'MenuType', title: '菜单说明', width: 100, align: 'left', formatter: function (value, row, index) {
                //        //菜单类型：0=未定义 1=目录 2=页面 7=备用1 8=备用2 9=备用3   
                //        var h = '未定义';
                //        if (value == 1) { h = com.html_formatter.get_color_html('目录', '#514B51'); } else if (value == 2) { h = com.html_formatter.get_color_html('页面', 'green'); }
                //        else if (value == 7) { h = '备用1'; } else if (value == 8) { h = '备用2'; } else if (value == 9) { h = '备用3'; }

                //        //按钮模式：0=未定义 1=动态按钮 2=静态按钮 3=无按钮
                //        var h2 = '未定义';
                //        if (row.ButtonMode == 1) { h2 = '动态按钮'; } else if (row.ButtonMode == 2) { h2 = '静态按钮'; } else if (row.ButtonMode == 3) { h2 = '无按钮'; }
                //        var html = h + ' | ' + h2;
                //        return html;
                //    }
                //},
                {
                    field: 'Rights', title: '按钮权限', width: 900, align: 'left', formatter: function (value, row, index) {
                    //    if (row.MenuType == 2 && row.ButtonMode == 1) {
                           return km.maingrid.initMenuButtons(row);
                       // } else {
                      //      return '';
                      //  }
                    }
                }
            ]],
            loadFilter: function (data) {
                var d = utils.copyProperty(data.rows || data, ["id", "IconClass"], ["_id", "iconCls"], false);
                var resultData = utils.toTreeData(d, '_id', 'ParentID', "children");
                return resultData;
            },
            onClickRow: function (row) {
                km.maingrid.selectedRow = row;
                //com.message('s', JSON.stringify(km.maingrid.selectedRow));
            },
            onLoadSuccess: function (data) {


                var currentRoleMenu = $.array.filter(gRoleMenu, function callbackfn(value, index, array) {
                    return value.RoleID == gRoleID;
                });
                var currentRoleMenuButton = $.array.filter(gRoleMenuButton, function callbackfn(value, index, array) {
                    return value.RoleID == gRoleID;
                });

            //    //alert('load data successfully!');
                //加载完成后，设置当前角色的菜单权限，是否勾选
                //var checkboxs_menus = $("input[name=ckmenu]");
                //console.info('gRoleMenu：' + JSON.stringify(gRoleMenu));
                if (currentRoleMenu.length > 0) {
                    for (var i = 0; i < currentRoleMenu.length; i++) {
                        var cid = '#ckmenu-' + currentRoleMenu[i].MenuID;
                        //console.info('length：' + gRoleMenu.length + '，序号：' + i + '，cid：' + cid);
                        if ($(cid)[0]) { $(cid)[0].checked = true; }
                    }
                }
                //var checkboxs_actions = $("input[name=ckaction]");
                //console.info('gRoleMenuButton：' + gRoleMenuButton);
                if (currentRoleMenuButton.length > 0) {
                    for (var i = 0; i < currentRoleMenuButton.length; i++) {
                        var aid = '#ck-' + currentRoleMenuButton[i].MenuID + '-' + currentRoleMenuButton[i].ButtonID;
                        //console.info('length：' + gRoleMenuButton.length + '，序号：xx' + i + 'aid：' + aid);
                        if ($(aid)[0]) { $(aid)[0].checked = true; }
                    }
                }
            }
        });//end grid init
    },
    reload: function () { this.jq.treegrid('reload', { _t: com.settings.timestamp() }); },
    selectRow: function (index) { this.jq.treegrid('selectRow', index);/*选择一行，行索引从0开始*/ },
    selectRecord: function (idValue) { this.jq.treegrid('selectRecord', idValue);/*选中当前选中的行*/ },
    deleteRow: function () { this.jq.treegrid('deleteRow', this.selectedIndex);/*删除当前选中的行*/ },
    getSelectedRow: function () { return this.jq.treegrid('getSelected'); /*获取当前选中的行*/ },
    initMenuButtons: function (row) {
        /*
         list_menu_buttons=listMenuButtons,
         list_role_menus = listRoleMenus,
         list_role_menu_buttons = listRoleMenuButtons 
        */
        //alert($.array.isArray(km.model.list_menu_buttons));
        var h = com.html_formatter.get_color_html('此菜单未配置权限按钮', 'red');
        var currentMenuButtons = $.array.filter(gButtons, function callbackfn(value, index, array) {
            return value.MenuID == row.id;
        });
      //  alert(JSON.stringify(currentMenuButtons));
        //layer.msg(km.model.list_menu_buttons.length);

        var h_input_checkbox = '';
        if (currentMenuButtons.length > 0) {
            //layer.msg(currentMenuButtons.length);
            for (var i = 0; i < currentMenuButtons.length; i++) {
                //var btnname = currentMenuButtons[i].ButtonText == '' ? currentMenuButtons[i].ButtonName : currentMenuButtons[i].ButtonText;
                var checkbox_id = 'ck-' + currentMenuButtons[i].MenuID + '-' + currentMenuButtons[i].id;
                var span_icon = '<span class="icon ' + currentMenuButtons[i].IconClass + '" style=" position:relative;top:5px"></span>' + currentMenuButtons[i].ButtonText;
                var h_input = '<input type="checkbox" id="' + checkbox_id + '" name="ck-' + currentMenuButtons[i].MenuID + '"  menucode="' + currentMenuButtons[i].MenuID + '"  buttoncode="' + currentMenuButtons[i].id + '"  onclick="km.maingrid.actionCheckboxClick(this)"/>' + span_icon + ' ';
                h_input_checkbox += '&nbsp;&nbsp;' + h_input;
            }
            var h_input_checkbox_all = '<input type="checkbox" id="allck-' + row.id + '"  menucode="' + row.id + '" onclick="km.maingrid.allActionCheckboxClick(this,\'' + row.id + '\')"/>' + com.html_formatter.get_color_html('全选', '#6C1899') + '&nbsp;&nbsp;|';
            h = h_input_checkbox_all + h_input_checkbox;
        }

        return h;
    },
    menuCheckboxClick: function (target, menucode) {
        var menuStrs = menucode;//当前勾选的菜单代码字符串，使用逗号拼接起来
        var target_input_id = '#ckmenu_' + menucode;
        //console.info($(target)[0].checked);
        var childNodes = km.maingrid.jq.treegrid('getChildren', menucode);
        //com.message('s', JSON.stringify(childNodes));

        //点击节点处理子节点的勾选与反选
        if (childNodes.length > 0) {//存在子节点
            for (var i = 0; i < childNodes.length; i++) {
                var child_item = '#ckmenu-' + childNodes[i].id;//console.info(taget_item); 
                $(child_item)[0].checked = $(target)[0].checked;
                menuStrs += ',' + childNodes[i].id;
            }
        }

        //点击节点处理上级节点的勾选与反选
        if ($(target)[0].checked == true) {
            var parent = km.maingrid.jq.treegrid('getParent', menucode);
            if (parent != null) {
                $('#ckmenu-' + parent.id)[0].checked = true;
                menuStrs += ',' + parent.id;
            }
            while (parent) {
                parent = km.maingrid.jq.treegrid('getParent', parent.id);
                if (parent != null) {
                    $('#ckmenu-' + parent.id)[0].checked = true;
                    menuStrs += ',' + parent.id;
                }
            }
        }
        var mymsg = $(target)[0].checked == true ? '菜单权限【设置】成功' : '菜单权限【取消】成功';
        //alert('执行操作：' + $(target)[0].checked + '    关联菜单代码：' + menuStrs);
        var jsonParam = { flag: $(target)[0].checked, RoleID: gRoleID, MenuID: menucode, id: 0 };
        com.ajax({
            type: 'POST', url: km.model.urls["check"], data: JSON.stringify(jsonParam), showLoading: false, success: function (result) {
                if (result.s) {
                    layer.msg(mymsg);
                    LoadMenuData();
                } else {
                    layer.msg(result.message);
                }
            }
        });// end ajax  
    },
    actionCheckboxClick: function (target) {
        //alert($(target).attr("menucode"));
        var menu_input_name = '#ckmenu-' + $(target).attr("menucode");
        if ($(menu_input_name)[0].checked == false) {
            $(target)[0].checked = false;
            layer.msg('请先设置菜单权限');
            return;
        }
        var mymsg = $(target)[0].checked == true ? '按钮权限【设置】成功' : '按钮权限【取消】成功';
       // var rolecode = km.model.data.rolecode;
        var menucode = $(target).attr("menucode");
        var buttoncode = $(target).attr("buttoncode");
        var jsonParam = { flagadd: $(target)[0].checked, RoleID: gRoleID, MenuID: menucode, id: buttoncode };
        com.ajax({
            type: 'POST', url: km.model.urls["check"], data: JSON.stringify(jsonParam), showLoading: false, success: function (result) {
                if (result.s) {
                    layer.msg(mymsg);
                    LoadMenuData();
                } else {
                    layer.msg(result.message);
                }
            }
        });// end ajax  
    },
    allActionCheckboxClick: function (target, menucode) {
        var action_input_name = 'ck-' + menucode;
        var checkboxs = $("input[name=" + action_input_name + "]");
        var menu_input_name = '#ckmenu-' + menucode;
        if ($(menu_input_name)[0].checked == false) {
            $(target)[0].checked = false;
            layer.msg('请先设置菜单权限');
            return;
        }
        for (var i = 0; i < checkboxs.length; i++) {
            checkboxs[i].checked = target.checked;
        }
        //alert(all_checkbox_id); 
        var mymsg = $(target)[0].checked == true ? '按钮权限批量【设置】成功' : '按钮权限批量【取消】成功';
      //  var rolecode = km.model.data.rolecode;
        //   var jsonParam = { flagadd: $(target)[0].checked, rolecode: rolecode, menucode: menucode };
        var flag =0;
        if($(target)[0].checked)
            flag = 1;
        var jsonParam = { flag:flag , RoleID: gRoleID, MenuID: menucode  };
        com.ajax({
            type: 'POST', url: km.model.urls["check_all"], data: JSON.stringify(jsonParam), showLoading: false, success: function (result) {
                if (result.s) {
                    layer.msg(mymsg);
                    LoadMenuData();
                } else {
                    layer.msg(result.message);
                }
            }
        });// end ajax  

    }
};







