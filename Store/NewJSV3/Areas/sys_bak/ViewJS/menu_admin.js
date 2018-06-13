
/*
//------------------------------------------------------------------------------ 
//       时间： 2017-09-19
//       作者： 蔡捷   
//			 新页面管理，使用新的程序生成器。 
//       文件： menu_admin.cshtml 页面文件 
//       文件： menu_admin.js JS文件
//------------------------------------------------------------------------------
路径：~/Areas/sys/ViewJS/menu_admin.js
说明：页面管理(menu_admin)的js文件
*/
//当前页面对象
var km = {};
km.model = null;
km.parent_model = null;

km.init = function () {
    com.initbuttons($('#km_toolbar'), km.model.buttons);
    km.init_parent_model(); 
    km.template.init();
     menu_6_Init();
MenuButton_12_Init();
button_15_Init();

//km.xx_Role.init();

km.xx_MenuButton.init();
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
    tpl_add_html: '',//tpl_add模板的html
    tpl_icon_html: '',
    jq_add: null,
    jq_icon: null,
    initTemplate: function () {
        var data = { title: 'baiduTemplate', list: ['test data 1', 'test data 2', 'test data3'] };
        this.tpl_add_html = baidu.template('tpl_add', data);//使用baidu.template命名空间
        this.jq_add = $(this.tpl_add_html);

        var data16 = $.kmui.icons.all;
        var listData = { "title": 'icon16x16', "list": data16 }
        this.tpl_icon_html = baidu.template('tpl_icon', listData);
        this.jq_icon = $(this.tpl_icon_html);
    },
    init: function () {
        this.initTemplate();
    }
};
 
 
//------------------------------------------------------------------------------ 
//       时间： 2017-09-19
//       作者： 蔡捷   
//			 菜单管理  
//------------------------------------------------------------------------------  
var gMenuData;
function  menu_6_Init(){
    km.menu.init();

   

    var icon = 'icon-standard-bricks';
    $('#TPL_IconClass').textbox({
        buttonText: '选择图标', buttonIcon: '', editable: false, value: icon, onClickButton: function () {
            km.initIcon();
        }
    });

}


/*菜单datagrid*/
km.menu = {
    jq: null,
    selectedIndex: 0,
    selectedRow: null,
    init: function () {
        this.jq = $("#menu").treegrid({
            fit: true, border: false, singleSelect: true, rownumbers: true, remoteSort: false, cache: false, method: 'get', idField: 'id', treeField: 'MenuName',
            queryParams: { _t: com.settings.timestamp() }, url: km.model.urls["tree"],fitColumns:true,
            rowStyler: function (row) {
                if (row.Enabled == 0) {
                    return 'color:red;';
                }
            },
            columns: [[
	            { field: 'MenuCode', title: '菜单代码', width: 110, align: 'left' },
                { field: 'MenuName', title: '菜单名称', width: 130, align: 'left' },
                { field: 'Url', title: '菜单URL', width: 180, align: 'left' },
                {
                    field: 'MenuType', title: '菜单类型', width: 55, align: 'center', formatter: function (value, row, index) {
                        //菜单类型：0=未定义 1=目录 2=页面 7=备用1 8=备用2 9=备用3   
                        var h = '未定义';
                        if (value == 1) { h = '目录'; } else if (value == 2) { h = '页面'; }
                        else if (value == 7) { h = '备用1'; } else if (value == 8) { h = '备用2'; } else if (value == 9) { h = '备用3'; }
                        return h;
                    }
                },
                {
                    field: 'ButtonMode', title: '按钮模式', width: 55, align: 'center', formatter: function (value, row, index) {
                        //按钮模式：0=未定义 1=动态按钮 2=静态按钮 3=无按钮
                        var h = '未定义';
                        if (value == 1) { h = '动态按钮'; } else if (value == 2) { h = '静态按钮'; } else if (value == 3) { h = '无按钮'; }
                        return h;
                    }
                },
                { field: 'Sort', title: '排序', width: 50, align: 'center' },
                { field: 'Enabled', title: '启用', width: 50, align: 'center', formatter: com.html_formatter.yesno },
                { field: 'Remark', title: '备注', width: 50, align: 'left' },
                { field: 'id', title: '', width: 50, align: 'left' ,formatter: function (value, row, index) {
                            return "<a href='javascript:set_role("+row.id+")' >设置权限</a>";
                    }}
                //{
                //    field: 'OP', title: '操作', width: 80, formatter: function (value, row, index) {
                //        var title = '菜单[' + row.MenuName + ']按钮';
                //        var html = '<a href="javascript:void(0);" title=' + title + ' onclick="km.loadMenuButtons(\'' + row.MenuCode + '\');"><span class="icon icon-standard-page">&nbsp;&nbsp;</span>菜单按钮</a>';
                //        return html;
                //    }
                //}
            ]],
            loadFilter: function (data) {
                var d = utils.copyProperty(data.rows || data, ["id", "IconClass"], ["_id", "iconCls"], false);
                var resultData = utils.toTreeData(d, '_id', 'ParentID', "children");
                return resultData;
            },
            onClickRow: function (row) {
                //点击行行事件，将当前选中行的的索引和行数据存储起来
                //km.maingrid.selectedIndex = index;
                km.menu.selectedRow = row;
                if (km.menu.selectedRow)
                    km.set_mode_menu('show');
               // km.loadMenuButtons(row);
                //com.message('s', JSON.stringify(km.maingrid.selectedRow));
            },
            onLoadSuccess: function (row, data) {
                //alert('load data successfully!');
                gMenuData = data; 
            
                //if (data.length > 0)
                //    $("#menu").datagrid("selectRow", 0);
                InitMenuTree();
                if (km.menu.selectedIndex > 0) {
                    km.menu.selectRow();
                }
                if (km.menu.selectedRow)
                                  km.set_mode_menu('show');
            }
        });//end grid init
    },
    refreshRow: function () { this.jq.treegrid('refreshRow', this.selectedIndex);/*刷新当前选中的行*/ },
    reload: function () { this.jq.treegrid('reload', { _t: com.settings.timestamp() }); },
    selectRow: function () { this.jq.treegrid('selectRow', this.selectedIndex);/*选择一行，行索引从0开始*/ },
    selectRecord: function (idValue) { this.jq.treegrid('selectRecord', idValue);/*选中当前选中的行*/ },
    deleteRow: function () { this.jq.treegrid('deleteRow', this.selectedIndex);/*删除当前选中的行*/ },
    getSelectedRow: function () { return this.jq.treegrid('getSelected'); /*获取当前选中的行*/ }
};
function InitMenuTree() {
    $('#TPL_ParentID').combotree({
       url: km.model.urls["tree"], editable: false, loadFilter: function (data) {
     //   data: gMenuData, editable: false, loadFilter: function (data) {
            var d = utils.copyProperty(data.rows || data, ["id", "IconClass", "MenuName"], ["id", "iconCls", "text"], false);
            var resultData = utils.toTreeData(d, 'id', 'ParentID', "children");
            return resultData;
        }
    });
}
//var selectedmenuIndex = 0;
//km.menu= {
//    jq: null,
     	             	
//    init: function () {
//        this.jq = $("#menu").datagrid({
//            fit: true, border: false, singleSelect: true, rownumbers: true, remoteSort: true, cache: false, method: 'get', idField: 'id',
             	            
//            queryParams: { _t: com.settings.timestamp(), keyword: "" }, 
//            url: km.model.urls["menu_pager"],
//               	            pagination: true, pageList: [5, 10, 15, 20, 30, 50, 100], pageSize:  km.pageSize,fitColumns:true,
//            columns: [[
            
// 	                { field: 'MenuCode', title: '菜单代码', width: 80, align: 'center', sortable: true },
//                            { field: 'MenuName', title: '菜单名', width: 80, align: 'center', sortable: true },
//                            { field: 'ParentID', title: '父菜单编号', width: 80, align: 'center', sortable: true },
//                            { field: 'MenuType', title: '菜单类型', width: 80, align: 'center', sortable: true },
//                            { field: 'ButtonMode', title: '按钮模式', width: 80, align: 'left', sortable: true,formatter: function (value, row, index) {
//                 var h = '未定义';
             
//                                    if(value=='0') h ='动态按钮'; 
//                                    if(value=='1') h ='静态按钮'; 
//                                    if(value=='2') h ='无按钮';                                    return h;
//                               } 
//                                 },
//                                                { field: 'Url', title: 'URL', width: 80, align: 'center', sortable: true },
//                            { field: 'IconClass', title: '图标类', width: 80, align: 'center', sortable: true },
//                            { field: 'Sort', title: '排序', width: 80, align: 'center', sortable: true },
//                            { field: 'Enabled', title: '启用', width: 80, align: 'left', sortable: true,formatter: function (value, row, index) {
//                 var h = '未定义';
             
//                                    if(value=='1') h ='启用'; 
//                                    if(value=='0') h ='禁用';                                    return h;
//                               } 
//                                 },
//                                                { field: 'Remark', title: '备注', width: 80, align: 'center', sortable: true },
                 
//            ]],
//            onClickRow: function (index, row) {
            
//                selectedmenuIndex = index;
//                km.menu.selectedIndex = index;
//                km.menu.selectedRow = row; 
                
//                if (km.menu.selectedRow)
//                    km.set_mode_menu('show');
//            },
//            onLoadSuccess: function (data) {
            
//             if (data.rows.length >0){
            
//             	if (data.rows.length <= selectedmenuIndex)
//             		selectedmenuIndex =0
//              $("#menu").datagrid("selectRow", selectedmenuIndex);
//             }
//                km.menu.selectedRow = km.menu.getSelectedRow(); 
            
//                if (km.menu.selectedRow)
//                  km.set_mode_menu('show');
//                  }
//        });//end grid init
//    },
//    reload: function (queryParams) {
//    		         var defaults = { _t: com.settings.timestamp() };
//       if (queryParams) { defaults = $.extend(defaults, queryParams); }
//     this.jq.datagrid('reload', defaults);
//      	    },
//    getSelectedRow: function () { return this.jq.datagrid('getSelected'); }
//};



/*工具栏权限按钮事件*/
km.toolbar = {
    do_refresh: function () { km.menu.reload(); },
    do_rolerights: function () {  $('#selectRoles').dialog('close'); },
     do_add: function () {

        km.set_mode_menu('add');

    },
    do_edit: function () {

        if (km.menu.selectedRow == null) { layer.msg('请选择一条记录！'); return; }
        km.set_mode_menu('edit');


    },
    do_delete: function () {
        var sRow = km.menu.getSelectedRow();
        if (sRow == null) { layer.msg('请选择一条记录！'); return; }
        //if (km.model.loginer.IsSuperAdmin == 0 && sRow.AllowEdit == 0) { layer.msg('此参数不可删除！'); return; }
        var jsonParam = JSON.stringify(sRow);
        com.message('c', ' <b style="color:red">确定要删除菜单【' + sRow.id + '】吗？ </b>', function (b) {
            if (b) {
                com.ajax({
                    url: km.model.urls["menu_delete"], data: jsonParam, success: function (result) {
                        if (result.s) {
                            com.message('s', result.message);
                            km.menu.reload();
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
                    var jsonObject = $("#menu_content").serializeJson();
                        
                    var jsonStr = JSON.stringify(jsonObject);
                       if (!$("#menu_content").form('validate')) {
                        layer.msg('输入数据有错误，请纠正后再存。');
                        return false;
                    }
        //添加自定义判断
                    //if (jsonObject.ParamCode == "" || jsonObject.ParamValue == "") { flagValid = false; com.message('e', '参数代码或参数名称不能为空！'); return; }
                    if (flagValid) {
                        if (km.settings.op_mode == 'edit') {
                            com.ajax({
                                type: 'POST', url: km.model.urls["menu_update"], data: jsonStr, success: function (result) {
                                    AfterEditmenu(result);
                                }
                            });
                        }
                        
                        if (km.settings.op_mode == 'add') {
                                com.ajax({
                                type: 'POST', url: km.model.urls["menu_insert"], data: jsonStr, success: function (result) {
                                    AfterEditmenu(result);
                                }
                            });
                        }
                    }


        var op_mode = km.menu.selectedRow == null ? 'clear' : 'show';
        km.set_mode_menu(op_mode);

    },
    do_search: function () {

    }
    ,
    do_undo: function () {
        var op_mode = km.menu.selectedRow == null ? 'clear' : 'show';
        km.set_mode_menu(op_mode);
    }
};


function AfterEditmenu(result) {
    if (result.s) {
        com.message('s', result.message);
        km.menu.reload();
        if (km.settings.op_mode == 'add') {
            km.menu.unselectAll();
            km.set_mode_menu('clear');
        }
        if (km.settings.op_mode == 'edit') {
            km.menu.selectRow(km.menu.selectedIndex);
            km.menu.selectedRow = $.extend(km.menu.selectedRow, jsonObject);
            km.set_mode_menu('show');
        }


    } else {
        com.message('e', result.message);
    }
}



/*显示：'show'  新增：'add'  编辑 'edit'  清空 'clear'*/
km.set_mode_menu = function (op_mode) {
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
        //console.info(JSON.stringify(km.menu.selectedRow));
        $('#menu_content').form('load', km.menu.selectedRow);
        km.MenuButton.reload();
     //   km.orgcombotree.jq.combotree('setValue', km.menu.selectedRow.DepartmentCode);
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
        
        $('#menu_content').form('clear');
        
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
        $('#menu_content').form('clear');
        
    }
}






 
//------------------------------------------------------------------------------ 
//       时间： 2017-09-19
//       作者： 蔡捷   
//			 按钮设置  
//------------------------------------------------------------------------------  

function  MenuButton_12_Init(){
	km.MenuButton.init();
}
var gMenuButtonData;
var selectedMenuButtonIndex = 0;
km.MenuButton= {
    jq: null,
    LoadData: function () {
        var options = $('#MenuButton').datagrid('options')

        options.url = km.model.urls["MenuButton_pager"];
        options.queryParams = { _t: com.settings.timestamp(), MemuID: km.menu.selectedRow.id };
        $('#MenuButton').datagrid(options);

    },
    init: function () {
        this.jq = $("#MenuButton").datagrid({
            fit: true, border: false, singleSelect: true, rownumbers: true, remoteSort: true, cache: false, method: 'get', idField: 'id',
             	            
            queryParams: { _t: com.settings.timestamp(), keyword: "" }, 
          //  url: km.model.urls["MenuButton_pager"],
               	            pagination: true, pageList: [5, 10, 15, 20, 30, 50, 100], pageSize:  km.pageSize,fitColumns:true,toolbar: '#tbMenuButton',onClickRow: onClickRow_MenuButton,
            columns: [[
               	 
                              //{ field: 'MenuID', title: '菜单编号', width: 100, align: 'center', sortable: true ,editor:{type:'textbox',options:{}}},
                        
                             
                              //{ field: 'ButtonID', title: '按钮编号', width: 100, align: 'center', sortable: true ,editor:{type:'textbox',options:{}}},
                        
                        {
                            field: 'ButtonID', title: '按钮名称', width: 150, align: 'left', sortable: true, formatter: function (value, row, index) {
                                return '&nbsp;&nbsp;<a href="#"><span class="icon ' + row.IconClass + '">&nbsp;</span>&nbsp;' + row.ButtonName + '</a>';
                            }
                        },
                             
                              { field: 'ButtonSort', title: '排序', width: 100, align: 'center', sortable: true ,editor:{type:'textbox',options:{}}},
                        
                             
                          { field: 'ButtonText', title: '按钮文字', width: 280, align: 'center', sortable: true ,editor:{type:'textbox',options:{}}},
                          
                                 
            ]],
            onLoadSuccess: function (  data) {
                //alert('load data successfully!');
                gMenuButtonData = data;
            }
        });//end grid init
    },
    reload: function (queryParams) {
     // 	         var defaults = { _t: com.settings.timestamp() };
     //  if (queryParams) { defaults = $.extend(defaults, queryParams); }
        //this.jq.datagrid('reload', defaults);
        this.LoadData();
      	    },
    getSelectedRow: function () { return this.jq.datagrid('getSelected'); }
};


		var editIndexMenuButton = undefined;
		function MenuButtonendEditing(){
			if (editIndexMenuButton == undefined){return true}
			if ($('#MenuButton').datagrid('validateRow', editIndexMenuButton)){
			
			//需要手工修改
			//	var ed = $('#MenuButton').datagrid('getEditor', {index:editIndexMenuButton,field:'productid'});
			//	var productname = $(ed.target).combobox('getText');
			//	$('#MenuButton').datagrid('getRows')[editIndexMenuButton]['productname'] = productname;
				$('#MenuButton').datagrid('endEdit', editIndexMenuButton);
				
				
				editIndexMenuButton = undefined;
				return true;
			} else {
				return false;
			}
		}
		function onClickRow_MenuButton(index){
			if (editIndexMenuButton != index){
				if (MenuButtonendEditing()){
					$('#MenuButton').datagrid('selectRow', index)
							.datagrid('beginEdit', index);
					editIndexMenuButton = index;
				} else {
					$('#MenuButton').datagrid('selectRow', editIndexMenuButton);
				}
			}
		}
		function append_MenuButton(){
			//if (MenuButtonendEditing()){
			//	$('#MenuButton').datagrid('appendRow',{status:'P'});
			//	editIndexMenuButton = $('#MenuButton').datagrid('getRows').length-1;
			//	$('#MenuButton').datagrid('selectRow', editIndexMenuButton)
			//			.datagrid('beginEdit', editIndexMenuButton);
		    //}
		    $('#selectButton').dialog('open');
		}
		function removeit_MenuButton(){
			if (editIndexMenuButton == undefined){layer.msg('请选择一条记录！'); return; }
			
			 var sRow = km.MenuButton.getSelectedRow();
        if (sRow == null) { layer.msg('请选择一条记录！'); return; }
        //if (km.model.loginer.IsSuperAdmin == 0 && sRow.AllowEdit == 0) { layer.msg('此参数不可删除！'); return; }
        var jsonParam = JSON.stringify(sRow);
        com.message('c', ' <b style="color:red">确定要删除菜单按钮【' + sRow.id + '】吗？ </b>', function (b) {
            if (b) {
                com.ajax({
                    url: km.model.urls["MenuButton_delete"], data: jsonParam, success: function (result) {
                        if (result.s) {
                            com.message('s', result.message);
			
			$('#MenuButton').datagrid('cancelEdit', editIndexMenuButton)
					.datagrid('deleteRow', editIndexMenuButton);
			editIndexMenuButton = undefined;
			
                        km.MenuButton.reload();
                            
                        } else {
                            com.message('e', result.message);
                        }
                    }
                });
            }
        });
        
		}
		function accept_MenuButton(){
			if (MenuButtonendEditing()){
			
			
			  if ($("#MenuButton").datagrid('getChanges').length) {
            ////获取插入更改的行的集合
            var inserted = $("#MenuButton").datagrid('getChanges', "inserted");
            
            
            
            for (var i = 0; i < inserted.length; i++) {


                var jsonStr = JSON.stringify(inserted[i]);

            com.ajax({
                type: 'POST', url: km.model.urls["MenuButton_insert"], data: jsonStr, success: function (result) {
               //     AfterEdit(result);
               
                        km.MenuButton.reload();
                }
            });
            }
            
            ////获取删除更改的行的集合
            //var deleted = $("#MenuButton").datagrid('getChanges', "deleted");
            //获取更新更改的行的集合
            var updated = $("#MenuButton").datagrid('getChanges', "updated");

            if(updated.length == 0)
                return;

          //  alert(updated.length);


            for (var i = 0; i < updated.length; i++) {


                var jsonStr = JSON.stringify(updated[i]);

            com.ajax({
                type: 'POST', url: km.model.urls["MenuButton_update"], data: jsonStr, success: function (result) {
               //     AfterEdit(result);
               
                        km.MenuButton.reload();
                }
            });
            }

            return;
			
			}
			
				$('#MenuButton').datagrid('acceptChanges');
			}
		}
		function reject_MenuButton(){
			$('#MenuButton').datagrid('rejectChanges');
			editIndexMenuButton = undefined;
		}
		function getChanges_MenuButton(){
			var rows = $('#MenuButton').datagrid('getChanges');
			alert(rows.length+' rows are changed!');
		}


 
 

 
//------------------------------------------------------------------------------ 
//       时间： 2017-09-19
//       作者： 蔡捷   
//			 按钮  
//------------------------------------------------------------------------------  

function  button_15_Init(){
	km.button.init();
}

var selectedbuttonIndex = 0;
km.button= {
    jq: null,
     	             	
    init: function () {
        this.jq = $("#button").datagrid({
            fit: true, border: false, singleSelect: true, rownumbers: true, remoteSort: true, cache: false, method: 'get', idField: 'id',
             	            
            queryParams: { _t: com.settings.timestamp(), keyword: "" }, 
            url: km.model.urls["button_pager"],
               	            pagination: true, pageList: [5, 10, 15, 20, 30, 50, 100], pageSize:  km.pageSize,fitColumns:true,
            columns: [[

 	                {
 	                    field: 'id', title: '', width: 20, align: 'center', sortable: false, formatter: function (value, row, index) {
 	                        return "<input type='checkbox' name='cbButton' id='b" + value + "' value=\"" + value + "\"/>";
 	                    }
 	                },
 	                { field: 'ButtonCode', title: '按钮代码', width: 80, align: 'center', sortable: true }, {
 	                    field: 'ButtonName', title: '按钮名称', width: 150, align: 'left', sortable: true, formatter: function (value, row, index) {
 	                        return '&nbsp;&nbsp;<a href="#"><span class="icon ' + row.IconClass + '">&nbsp;</span>&nbsp;' + value + '</a>';
 	                    }
 	                },
                        //    { field: 'ButtonType', title: '按钮类型', width: 80, align: 'center', sortable: true },
                         //   { field: 'IconClass', title: '图标类', width: 80, align: 'center', sortable: true },
                            { field: 'Remark', title: '备注', width: 80, align: 'center', sortable: true },

                              { field: 'Sort', title: '排序', width: 100, align: 'center', sortable: true, editor: { type: 'textbox', options: {} } },

                 
            ]],
            onClickRow: function (index, row) {
            
                selectedbuttonIndex = index;
                km.button.selectedIndex = index;
                km.button.selectedRow = row;  
                if(                km.button.selectedRow ){
                	
                }
            },
            onLoadSuccess: function (data) {
            
             if (data.rows.length >0){
            
             	if (data.rows.length <= selectedbuttonIndex)
             		selectedbuttonIndex =0
              $("#button").datagrid("selectRow", selectedbuttonIndex);
             }
                km.button.selectedRow = km.button.getSelectedRow(); 
                if(                km.button.selectedRow ){
                	
                }
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
function SaveSelectedButtons() {


    $('#selectButton').dialog('close');




    var ids = "";
    $("input[name='cbButton']:checked").each(function () {
        ids = $(this).val() + "," + ids;
        if ($(this).attr('checked')) {
            ids = $(this).val() + "," + ids;

        }
    });

    var jsonParam = JSON.stringify({ MenuID: km.menu.selectedRow.id, ids: ids });
    // alert(jsonParam);
    // return;
    com.ajax({
        type: 'POST', url: km.model.urls["MenuButton_insert"], data: jsonParam, success: function (result) {
            // Raiserror('Name 不可为空 ...',16,1)  
            if (result.s) {
                com.message('s', result.message);
                km.MenuButton.reload();
                //km.breedgrid_application.reload();
                //km.breedgrid_history.reload();
                //km.breed_experimentgrid.reload();
                //km.breedgrid_select.reload();
                //km.comparisongrid_select.reload();
            } else {
                com.message('e', result.message);
            }
            //  alert(result);
            //  LoadOptions();
        }
    });
}

//初始化图标选择
km.initIcon = function () {
    //addwin.find('#TPL_IconClass').textbox({
    //    buttonText: '选择',
    //    buttonIcon: '', editable: false,
    //    onClickButton: function () {
    //        km.initIcon(win);
    //    }
    //});
    var $this = $('#TPL_IconClass').textbox();
    var $spanicon = $('#span_icon');
    // var win = $('#button_content');
    km.showIconSelector(km.template.tpl_icon_html, function (win) {
        var hwin = win.html();
        win.find("span").click(function () {
            //alert($(this)[0].id);
            var old_icontext = win.find("#icontext").text();
            if (old_icontext != "") {
                win.find("#" + old_icontext).removeClass("icon_selected");
            }
            var new_icontext = $(this)[0].id;
            $(this).addClass("icon_selected");
            win.find("#icontext").text(new_icontext);
            win.find("#span_selected_icon").removeClass();
            win.find("#span_selected_icon").addClass("icon ").addClass(new_icontext).addClass("iconbox");

        });
    }, function (win) {
        var selected_icontext = win.find("#icontext").text();
        if (selected_icontext == "") {
            com.message('w', '请选择一个图标');
            return;
        }
        //console.info($this);
        $this.textbox('setValue', selected_icontext);
        $spanicon.removeClass().addClass("icon").addClass(selected_icontext);
        $spanicon.attr('title', selected_icontext);
        parent.$(win).dialog('destroy');
        //alert(selected_icontext);
    });
}
//显示图标选择对话框
km.showIconSelector = function (html, before, dosave) {
    com.dialog({
        title: '图标选择',
        html: html, resizable: true, maximizable: true, width: 600,
        height: 400, btntext: '确定选择'
    }, before, dosave);
}
var gMenuID = 0;
function set_role(id) {
    $('#selectRoles').dialog('open');
    gMenuID = id;
    km.xx_Role.init();
}






function xx_MenuButton_2_Init() {
    km.xx_MenuButton.init();

}

var selectedxx_MenuButtonIndex = 0;
km.xx_MenuButton = {
    jq: null,
    LoadData: function (mid, rid) {
        var options = $('#xx_MenuButton').datagrid('options')

        options.url = km.model.urls["MenuButton_list_check"]; //MemuID: km.menu.selectedRow.id
        options.queryParams = { _t: com.settings.timestamp(), MenuID: mid , RoleID: rid};
        $('#xx_MenuButton').datagrid(options);

    },
    init: function () {
        this.jq = $("#xx_MenuButton").datagrid({
            fit: true, border: false, singleSelect: true, rownumbers: false, remoteSort: true, cache: false, method: 'get', idField: 'id',

            queryParams: { _t: com.settings.timestamp(), keyword: "" },
         //   url: km.model.urls["MenuButton_list_check"],
           // data: gMenuButtonData,
            pagination: false,// pageList: [5, 10, 15, 20, 30, 50, 100], pageSize:  km.pageSize,
            fitColumns: true,
            columns: [[
            			{
            			    field: 'checked', title: ' ', width: 30,
            			    formatter: function (value, rec, rowIndex) {
            			        if (value == 0)
            			            return "<input type=\"checkbox\"  name=\"PD\" value=\"" + rec.id + "\">";
            			        else
            			            return "<input type=\"checkbox\" checked='checked'  name=\"PD\" value=\"" + rec.id + "\" >";
            			    }
            			},
                      {
 	                      field: 'ButtonName', title: '按钮名称', width: 150, align: 'left', sortable: true, formatter: function (value, row, index) {
 	                          return '&nbsp;&nbsp;<a href="#"><span class="icon ' + row.IconClass + '">&nbsp;</span>&nbsp;' + value + '</a>';
 	                      }
 	                  },
 	                  { field: 'ButtonCode', title: '按钮代码', width: 80, align: 'left', sortable: true },

            ]],
            onClickRow: function (index, row) {

                selectedxx_MenuButtonIndex = index;
                km.xx_MenuButton.selectedIndex = index;
                km.xx_MenuButton.selectedRow = row;
                if (km.xx_MenuButton.selectedRow) {

                }
            },
            onLoadSuccess: function (data) {

                $("input[name='PD']").unbind().bind("click", function () {
                    // alert($(this).attr("value") + "," + ($(this).attr('checked')));

                    Setxx_MenuButton($(this).attr("value"));
                    return;


                });


                if (data.rows.length > 0) {

                    if (data.rows.length <= selectedxx_MenuButtonIndex)
                        selectedxx_MenuButtonIndex = 0
                    $("#xx_MenuButton").datagrid("selectRow", selectedxx_MenuButtonIndex);
                }
                km.xx_MenuButton.selectedRow = km.xx_MenuButton.getSelectedRow();
                if (km.xx_MenuButton.selectedRow) {

                }
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

function Setxx_MenuButton(id) {



    var jsonParam = JSON.stringify({ id: id, MenuID:gMenuID, RoleID: km.xx_Role.selectedRow.id  });
    com.ajax({
        type: 'POST', url: km.model.urls["MenuButton_check"], data: jsonParam, success: function (result) {
            //  alert(result);
            //  LoadOptions();
        }
    });
}


//------------------------------------------------------------------------------ 
//       时间： 2017-09-19
//       作者： 蔡捷   
//			   
//------------------------------------------------------------------------------  

function xx_Role_6_Init() {
    km.xx_Role.init();
}

var selectedxx_RoleIndex = 0;
km.xx_Role = {
    jq: null,

    init: function () {
        this.jq = $("#xx_Role").datagrid({
            fit: true, border: false, singleSelect: true,
            rownumbers: false, remoteSort: false, cache: false, method: 'get', idField: 'id',

            queryParams: { _t: com.settings.timestamp(), keyword: "" },
            url: km.model.urls["Role_list"],
            pagination: false, pageList: [5, 10, 15, 20, 30, 50, 100], pageSize: km.pageSize,
            fitColumns: true,
            columns: [[

 	                { field: 'RoleCode', title: '角色代码', width: 80, align: 'center', sortable: true },
                            { field: 'RoleName', title: '角色名', width: 80, align: 'center', sortable: true },

            ]],
            onClickRow: function (index, row) {

                selectedxx_RoleIndex = index;
                km.xx_Role.selectedIndex = index;
                km.xx_Role.selectedRow = row;
                if (km.xx_Role.selectedRow) {

                    km.xx_MenuButton.LoadData(gMenuID, km.xx_Role.selectedRow.id);
                }
            },
            onLoadSuccess: function (data) {

                if (data.rows.length > 0) {

                    if (data.rows.length <= selectedxx_RoleIndex)
                        selectedxx_RoleIndex = 0
                    $("#xx_Role").datagrid("selectRow", selectedxx_RoleIndex);
                }
                km.xx_Role.selectedRow = km.xx_Role.getSelectedRow();
                if (km.xx_Role.selectedRow) {

                    km.xx_MenuButton.LoadData(gMenuID, km.xx_Role.selectedRow.id);
                }
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




