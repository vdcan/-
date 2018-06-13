
/*
//------------------------------------------------------------------------------ 
//       时间： 2018-04-28
//       作者： 蔡捷   
//			 商品类型 
//       文件： category.cshtml 页面文件 
//       文件： category.js JS文件
//------------------------------------------------------------------------------
路径：~/Areas/dev/ViewJS/category.js
说明：商品类型(category)的js文件
*/
//当前页面对象
var km = {};
km.model = null;
km.parent_model = null;

km.init = function () {
    com.initbuttons($('#km_toolbar'), km.model.buttons);
    km.init_parent_model(); 
 //   km.template.init();
     category_6_Init();
 
 
    //如果没有动态combobox可删除
     $('.easyui-combobox').each(function (index, element) {
       var options = $(this).combobox('options')
          var u = $(this).attr("url2")
      
        if (u!= undefined) { 
         
            options.url = km.model.urls[u];
            if (options.multiple == true) {

                options.formatter= function (row) { //formatter方法就是实现了在每个下拉选项前面增加checkbox框的方法  
                    var opts = $(this).combobox('options');  
                    return '<input type="checkbox" class="combobox-checkbox">' + row[opts.textField]  
                };
            options.onLoadSuccess = function () {  //下拉框数据加载成功调用  
                var opts = $(this).combobox('options');  
                var target = this;  
                var values = $(target).combobox('getValues');//获取选中的值的values  
                $.map(values, function (value) {  
                    var el = opts.finder.getEl(target, value);  
                    el.find('input.combobox-checkbox')._propAttr('checked', true);   
                })  
            };
            options.onSelect = function (row) { //选中一个选项时调用  
                var opts = $(this).combobox('options');  
                //获取选中的值的values  
                //$("#"+id).val($(this).combobox('getValues'));  
                     
                //设置选中值所对应的复选框为选中状态  
                var el = opts.finder.getEl(this, row[opts.valueField]);  
                el.find('input.combobox-checkbox')._propAttr('checked', true);  
            }
            options.onUnselect =function (row) {//不选中一个选项时调用  
                var opts = $(this).combobox('options');  
                //获取选中的值的values  
            //    $("#"+id).val($(this).combobox('getValues'));  
                    
                var el = opts.finder.getEl(this, row[opts.valueField]);  
                el.find('input.combobox-checkbox')._propAttr('checked', false);  
            }
            }
            $(this).combobox(options);

        } 
        
        
        // <input id='test' class='easyui-combobox' loader="ttn" name='test' type='text' data-options="valueField:'text',textField:'text',mode : 'remote' " style='width:100px' />
        var loader = $(this).attr("loader");
        if (loader != undefined) {
            options.loader = function (param, success, error) {
                var q = param.q || "";
                if (q.length <= 0) {
                    console.log("q.length <= 0");
                    return false;
                }
                var jsonParam = { loader: loader, value: q }
                com.ajax({
                    url: km.model.urls["loader"], data: jsonParam, success: function (result) {
                        success(result);
                    }
                });
            };
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
            com.showcenter(gDictionary["message"], gDictionary["no_wrapper"]);
        }
    } else {
        com.showcenter(gDictionary["message"], gDictionary["out_iframe"]);
    }
}

$(km.init);

//页面对象参数设置
km.settings = {};

//格式化数据
km.gridformat = {};


function showValue(value, data, type) {

    var tmp = "";
    var a = data.split(" ");
    for (var i = 0; i < a.length; i++) {

        var v= a[i].split("=")[0];
        var  t = a[i].split("=")[1];
        if (type == "checkbox") {

            if ( (","+value+",").indexOf  (","+v+",")>=0)
                tmp += "&nbsp;<input type='checkbox' checked  disabled='true'  >&nbsp;" + t;
            else
                tmp += "&nbsp;<input type='checkbox' disabled='true' >&nbsp;" + t;


        } else if (type == "radio") {
            if (value ==v)
                tmp += "&nbsp;<input type='radio' checked disabled='true' >&nbsp;" + t;
            else
                tmp += "&nbsp;<input type='radio' disabled='true' >&nbsp;" + t;
        } else {
            if (value ==v)
                return t;
        }
    }
    return tmp;
} 

 
 
//------------------------------------------------------------------------------ 
//       时间： 2018-04-28
//       作者： 蔡捷   
//			   
//------------------------------------------------------------------------------  

function  category_6_Init(){
	km.category.init();
	if(	km.category.LoadData!=undefined)	
		km.category.LoadData(); 
}



function addcategory(index) {
    
   
    km.toolbar.do_add();
}

function editcategory(index) {
    $('#category').datagrid('selectRow', index);// 关键在这里  
   
    km.toolbar.do_edit();
}
function deletecategory(index) {
    $('#category').datagrid('selectRow', index);// 关键在这里  
   
    km.toolbar.do_delete();
}



var selectedcategoryIndex = 0;



km.category= {
    jq: null,
     	             	
    init: function () {
        this.jq = $("#category").datagrid({
            fit: true, border: false, singleSelect: true, rownumbers: true, remoteSort: true, cache: false, method: 'get', idField: 'id',
             	            
            queryParams: { _t: com.settings.timestamp(), keyword: "" }, 
            url: km.model.urls["category_pager"],
               	  

            pagination: true, pageList: [5, 10, 15, 20, 30, 50, 100], pageSize:  km.pageSize,fitColumns:true,
            columns: [[
   
            
 	                { field: 'active_flag', title: gDictionary["enabled"], width: 80, align: 'left', sortable: true,formatter: function (value, row, index) {
              
 	                    return showValue(value,gDictionary["yes no"] ,'radio' );
                               }},
                                                { field: 'add_by', title: gDictionary["add_by"], width: 80, align: 'center', sortable: true },
                { field: 'add_date', title: gDictionary["add_on"], width: 80, align: 'center', sortable: true },
                { field: 'category_description', title: gDictionary["description"], width: 80, align: 'center', sortable: true },
                { field: 'category_name', title: gDictionary["class name"], width: 80, align: 'center', sortable: true },
                { field: 'delete_flag', title: gDictionary["delete flag"], width: 80, align: 'left', sortable: true,formatter: function (value, row, index) {
              
                    return showValue(value, gDictionary["yes no"], 'radio');
                               }},
                                                { field: 'id', title: gDictionary["id"], width: 80, align: 'center', sortable: true },
                { field: 'sort_number', title: gDictionary["sort"], width: 80, align: 'center', sortable: true },
    // {
    //                            field: 'id', title: '<a href="#" onclick="addcategory( )">增加</a>', width: 80, align: 'center', sortable: false, formatter: function (val, row, index) {
    //                                return '<a href="#" onclick="editcategory(' + index + ')">修改</a>&nbsp;|&nbsp;<a href="#" onclick="deletecategory(' + index + ')">删除</a>';
    //}  },
    
                 
            ]],
            onClickRow: function (index, row) {
            
                selectedcategoryIndex = index;
                km.category.selectedIndex = index;
                km.category.selectedRow = row; 
                
                if (km.category.selectedRow)
                    km.set_mode_category('show');
            },
            onLoadSuccess: function (data) {
            
             if (data.rows.length >0){
            
             	if (data.rows.length <= selectedcategoryIndex)
             		selectedcategoryIndex =0
              $("#category").datagrid("selectRow", selectedcategoryIndex);
             }
                km.category.selectedRow = km.category.getSelectedRow(); 
            
                if (km.category.selectedRow)
                  km.set_mode_category('show');
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
    do_refresh: function () { km.category.reload(); },
     do_add: function () {

        km.set_mode_category('add');

    },
    do_edit: function () {

        if (km.category.selectedRow == null) { layer.msg(gDictionary["please select one record"]); return; }
        km.set_mode_category('edit');


    },
    do_delete: function () {
        var sRow = km.category.getSelectedRow();
        if (sRow == null) { layer.msg(gDictionary["please select one record"]); return; }
        //if (km.model.loginer.IsSuperAdmin == 0 && sRow.AllowEdit == 0) { layer.msg(gDictionary["can not delete it"]); return; }
        var jsonParam = JSON.stringify(sRow);
        com.message('c', ' <b style="color:red">确定要删除【' + sRow.id + '】吗？ </b>', function (b) {
            if (b) {
                com.ajax({
                    url: km.model.urls["category_delete"], data: jsonParam, success: function (result) {
                        if (result.s) {
                            com.message('s', result.message);
                            km.category.reload();
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
                    var jsonObject = $("#category_content").serializeJson();
                        
     
     
                  
     
                    var jsonStr =  jsonObject ;
                    	                       if (!$("#category_content").form('validate')) {
                        layer.msg(gDictionary["data is incorrect, please try again"]);
                        return false;
                    }
        //添加自定义判断
                    //if (jsonObject.ParamCode == "" || jsonObject.ParamValue == "") { flagValid = false; com.message('e', gDictionary["the parameter can not be empty"]); return; }
                    if (flagValid) {
                        if (km.settings.op_mode == 'edit') {
                            com.ajax({
                                type: 'POST', url: km.model.urls["category_update"], data: jsonStr, success: function (result) {
                                    AfterEditcategory(result);
                                }
                            });
                        }
                        
                        if (km.settings.op_mode == 'add') {
                                com.ajax({
                                type: 'POST', url: km.model.urls["category_insert"], data: jsonStr, success: function (result) {
                                    AfterEditcategory(result);
                                }
                            });
                        }
                    }

 

    } 
    ,
    do_undo: function () {
        var op_mode = km.category.selectedRow == null ? 'clear' : 'show';
        km.set_mode_category(op_mode);
    }
};


function AfterEditcategory(result) {
    if (result.s) {
        com.message('s', result.message);
        km.category.reload();
        if (km.settings.op_mode == 'add') {
        //    km.category.unselectAll();
            km.set_mode_category('clear');
        }
        if (km.settings.op_mode == 'edit') {
            km.category.selectRow(km.category.selectedIndex);
            km.category.selectedRow = $.extend(km.category.selectedRow, jsonObject);
            km.set_mode_category('show');
        }


    } else {
        com.message('e', result.message);
    }
}



/*显示：'show'  新增：'add'  编辑 'edit'  清空 'clear'*/
km.set_mode_category = function (op_mode) {
    km.settings.op_mode = op_mode;
    $('#km_toolbar').show();
    $('#km_toolbar_2').hide();
    com.mask($('#west_panel'), false);
   // $('#user_tabs').tabs('enableTab', 1);
   // $('#user_tabs').tabs('enableTab', 2);
    $('#category_content .easyui-combobox').combobox('readonly', true);
    $('#category_content .easyui-combotree').combotree('readonly', true);
    $('#category_content .easyui-textbox').textbox('readonly', true);
    $('#category_content .easyui-numberbox').numberbox('readonly', true);

    $("#category_content").find("input[type='radio']").attr("disabled", "true");//这
    $("#category_content").find("input[type='checkbox']").attr("disabled", "true");//这
    if (op_mode == 'show') {
        //console.info(JSON.stringify(km.category.selectedRow));
      var sRow = km.category.selectedRow;
                   
        
        
        $('#category_content').form('load', sRow);
     //   km.orgcombotree.jq.combotree('setValue', km.category.selectedRow.DepartmentCode);
    } else if (op_mode == 'add') {
        $('#km_toolbar').hide();
        $('#km_toolbar_2').show();
        com.mask($('#west_panel'), true);
        
      //  $('#user_tabs').tabs('disableTab', 1);
      //  $('#user_tabs').tabs('disableTab', 2);
      //  $('#user_tabs').tabs('select', 0);
        
    $("#category_content").find("input[type='radio']").removeAttr("disabled" ); 
    $("#category_content").find("input[type='checkbox']").removeAttr("disabled" ); 
        
        $('#category_content .easyui-combobox').combobox('readonly', false);
        $('#category_content .easyui-combotree').combotree('readonly', false);
        $('#category_content .easyui-textbox').textbox('readonly', false);
        $('#category_content .easyui-numberbox').numberbox('readonly', false);
        
        $('#category_content').form('clear');
        
        
      //  $('#TPL_id').val(0);
        //$('#TPL_Enabled').combobox('setValue', 1);
        //$('#TPL_UserType').combobox('setValue', 3);
        //$('#TPL_IsSingleLogin').combobox('setValue', 1);
        //$('#TPL_Sex').combobox('setValue', gDictionary["male"]);
        //$('#TPL_Sort').numberbox('setValue', 888);

    } else if (op_mode == 'edit') {
    	
    $("#category_content").find("input[type='radio']").removeAttr("disabled" ); 
    $("#category_content").find("input[type='checkbox']").removeAttr("disabled" ); 
        //alert($('#category_content .easyui-text'));
        $('#category_content .easyui-combobox').combobox('readonly', false);
        $('#category_content .easyui-combotree').combotree('readonly', false);
        $('#category_content .easyui-textbox').textbox('readonly', false);
        $('#category_content .easyui-numberbox').numberbox('readonly', false);
        $('#km_toolbar').hide();
        $('#km_toolbar_2').show();
        com.mask($('#west_panel'), true);
                   $('#TPL_add_by').textbox('readonly', true);
                    $('#TPL_add_date').textbox('readonly', true);
               
        //$('#user_tabs').tabs('disableTab', 1);
        //$('#user_tabs').tabs('disableTab', 2);
        //$('#user_tabs').tabs('select', 0);
    } else if (op_mode == 'clear') {
        $('#category_content').form('clear');
        
    }
}





