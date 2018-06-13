
/*
//------------------------------------------------------------------------------ 
//       时间： 2018-04-28
//       作者： 蔡捷 (2634691810@qq.com)   
//			 标签 
//       文件： tag.cshtml 页面文件 
//       文件： tag.js JS文件
//------------------------------------------------------------------------------
路径：~/Areas/dev/ViewJS/tag.js
说明：标签(tag)的js文件
*/
//当前页面对象
var km = {};
km.model = null;
km.parent_model = null;

km.init = function () {
    com.initbuttons($('#km_toolbar'), km.model.buttons);
    km.init_parent_model(); 
 //   km.template.init();
     tag_6_Init();
 
 
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
//       作者： 蔡捷 (2634691810@qq.com)   
//			   
//------------------------------------------------------------------------------  

function  tag_6_Init(){
	km.tag.init();
	if(	km.tag.LoadData!=undefined)	
		km.tag.LoadData(); 
}



function addtag(index) {
    
   
    km.toolbar.do_add();
}

function edittag(index) {
    $('#tag').datagrid('selectRow', index);// 关键在这里  
   
    km.toolbar.do_edit();
}
function deletetag(index) {
    $('#tag').datagrid('selectRow', index);// 关键在这里  
   
    km.toolbar.do_delete();
}



var selectedtagIndex = 0;



km.tag= {
    jq: null,
     	             	
    init: function () {
        this.jq = $("#tag").datagrid({
            fit: true, border: false, singleSelect: true, rownumbers: true, remoteSort: true, cache: false, method: 'get', idField: 'id',
             	            
            queryParams: { _t: com.settings.timestamp(), keyword: "" }, 
            url: km.model.urls["tag_pager"],
               	  

            pagination: true, pageList: [5, 10, 15, 20, 30, 50, 100], pageSize:  km.pageSize,fitColumns:true,
            columns: [[
   
              {
                  field: 'active_flag', title: gDictionary["enabled"], width: 80, align: 'left', sortable: true, formatter: function (value, row, index) {

                      return showValue(value, gDictionary["yes no"], 'radio');
                  }
              },
                { field: 'add_by', title: gDictionary["add_by"], width: 80, align: 'center', sortable: true },
                { field: 'add_date', title: gDictionary["add_on"], width: 80, align: 'center', sortable: true },
                { field: 'id', title: 'id', width: 80, align: 'center', sortable: true },
                { field: 'option_description', title: gDictionary["description"], width: 80, align: 'center', sortable: true },
                { field: 'tag_name', title: gDictionary["tag_name"], width: 80, align: 'center', sortable: true },
    // {
    //                            field: 'id', title: '<a href="#" onclick="addtag( )">增加</a>', width: 80, align: 'center', sortable: false, formatter: function (val, row, index) {
    //                                return '<a href="#" onclick="edittag(' + index + ')">修改</a>&nbsp;|&nbsp;<a href="#" onclick="deletetag(' + index + ')">删除</a>';
    //}  },
    
                 
            ]],
            onClickRow: function (index, row) {
            
                selectedtagIndex = index;
                km.tag.selectedIndex = index;
                km.tag.selectedRow = row; 
                
                if (km.tag.selectedRow)
                    km.set_mode_tag('show');
            },
            onLoadSuccess: function (data) {
            
             if (data.rows.length >0){
            
             	if (data.rows.length <= selectedtagIndex)
             		selectedtagIndex =0
              $("#tag").datagrid("selectRow", selectedtagIndex);
             }
                km.tag.selectedRow = km.tag.getSelectedRow(); 
            
                if (km.tag.selectedRow)
                  km.set_mode_tag('show');
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
    do_refresh: function () { km.tag.reload(); },
     do_add: function () {

        km.set_mode_tag('add');

    },
    do_edit: function () {

        if (km.tag.selectedRow == null) { layer.msg(gDictionary["please select one record"]); return; }
        km.set_mode_tag('edit');


    },
    do_delete: function () {
        var sRow = km.tag.getSelectedRow();
        if (sRow == null) { layer.msg(gDictionary["please select one record"]); return; }
        //if (km.model.loginer.IsSuperAdmin == 0 && sRow.AllowEdit == 0) { layer.msg(gDictionary["can not delete it"]); return; }
        var jsonParam = JSON.stringify(sRow);
        com.message('c', ' <b style="color:red">确定要删除【' + sRow.id + '】吗？ </b>', function (b) {
            if (b) {
                com.ajax({
                    url: km.model.urls["tag_delete"], data: jsonParam, success: function (result) {
                        if (result.s) {
                            com.message('s', result.message);
                            km.tag.reload();
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
                    var jsonObject = $("#tag_content").serializeJson();
                        
     
     
                  
     
                    var jsonStr =  jsonObject ;
                    	                       if (!$("#tag_content").form('validate')) {
                        layer.msg(gDictionary["data is incorrect, please try again"]);
                        return false;
                    }
        //添加自定义判断
                    //if (jsonObject.ParamCode == "" || jsonObject.ParamValue == "") { flagValid = false; com.message('e', gDictionary["the parameter can not be empty"]); return; }
                    if (flagValid) {
                        if (km.settings.op_mode == 'edit') {
                            com.ajax({
                                type: 'POST', url: km.model.urls["tag_update"], data: jsonStr, success: function (result) {
                                    AfterEdittag(result);
                                }
                            });
                        }
                        
                        if (km.settings.op_mode == 'add') {
                                com.ajax({
                                type: 'POST', url: km.model.urls["tag_insert"], data: jsonStr, success: function (result) {
                                    AfterEdittag(result);
                                }
                            });
                        }
                    }

 

    } 
    ,
    do_undo: function () {
        var op_mode = km.tag.selectedRow == null ? 'clear' : 'show';
        km.set_mode_tag(op_mode);
    }
};


function AfterEdittag(result) {
    if (result.s) {
        com.message('s', result.message);
        km.tag.reload();
        if (km.settings.op_mode == 'add') {
        //    km.tag.unselectAll();
            km.set_mode_tag('clear');
        }
        if (km.settings.op_mode == 'edit') {
            km.tag.selectRow(km.tag.selectedIndex);
            km.tag.selectedRow = $.extend(km.tag.selectedRow, jsonObject);
            km.set_mode_tag('show');
        }


    } else {
        com.message('e', result.message);
    }
}



/*显示：'show'  新增：'add'  编辑 'edit'  清空 'clear'*/
km.set_mode_tag = function (op_mode) {
    km.settings.op_mode = op_mode;
    $('#km_toolbar').show();
    $('#km_toolbar_2').hide();
    com.mask($('#west_panel'), false);
   // $('#user_tabs').tabs('enableTab', 1);
   // $('#user_tabs').tabs('enableTab', 2);
    $('#tag_content .easyui-combobox').combobox('readonly', true);
    $('#tag_content .easyui-combotree').combotree('readonly', true);
    $('#tag_content .easyui-textbox').textbox('readonly', true);
    $('#tag_content .easyui-numberbox').numberbox('readonly', true);

    $("#tag_content").find("input[type='radio']").attr("disabled", "true");//这
    $("#tag_content").find("input[type='checkbox']").attr("disabled", "true");//这
    if (op_mode == 'show') {
        //console.info(JSON.stringify(km.tag.selectedRow));
      var sRow = km.tag.selectedRow;
                   
        
        
        $('#tag_content').form('load', sRow);
     //   km.orgcombotree.jq.combotree('setValue', km.tag.selectedRow.DepartmentCode);
    } else if (op_mode == 'add') {
        $('#km_toolbar').hide();
        $('#km_toolbar_2').show();
        com.mask($('#west_panel'), true);
        
      //  $('#user_tabs').tabs('disableTab', 1);
      //  $('#user_tabs').tabs('disableTab', 2);
      //  $('#user_tabs').tabs('select', 0);
        
    $("#tag_content").find("input[type='radio']").removeAttr("disabled" ); 
    $("#tag_content").find("input[type='checkbox']").removeAttr("disabled" ); 
        
        $('#tag_content .easyui-combobox').combobox('readonly', false);
        $('#tag_content .easyui-combotree').combotree('readonly', false);
        $('#tag_content .easyui-textbox').textbox('readonly', false);
        $('#tag_content .easyui-numberbox').numberbox('readonly', false);
        
        $('#tag_content').form('clear');
        
        
      //  $('#TPL_id').val(0);
        //$('#TPL_Enabled').combobox('setValue', 1);
        //$('#TPL_UserType').combobox('setValue', 3);
        //$('#TPL_IsSingleLogin').combobox('setValue', 1);
        //$('#TPL_Sex').combobox('setValue', gDictionary["male"]);
        //$('#TPL_Sort').numberbox('setValue', 888);

    } else if (op_mode == 'edit') {
    	
    $("#tag_content").find("input[type='radio']").removeAttr("disabled" ); 
    $("#tag_content").find("input[type='checkbox']").removeAttr("disabled" ); 
        //alert($('#tag_content .easyui-text'));
        $('#tag_content .easyui-combobox').combobox('readonly', false);
        $('#tag_content .easyui-combotree').combotree('readonly', false);
        $('#tag_content .easyui-textbox').textbox('readonly', false);
        $('#tag_content .easyui-numberbox').numberbox('readonly', false);
        $('#km_toolbar').hide();
        $('#km_toolbar_2').show();
        com.mask($('#west_panel'), true);
                   $('#TPL_add_by').textbox('readonly', true);
                    $('#TPL_add_date').textbox('readonly', true);
               
        //$('#user_tabs').tabs('disableTab', 1);
        //$('#user_tabs').tabs('disableTab', 2);
        //$('#user_tabs').tabs('select', 0);
    } else if (op_mode == 'clear') {
        $('#tag_content').form('clear');
        
    }
}





