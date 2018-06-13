
/*
//------------------------------------------------------------------------------ 
//       时间： 2018-05-01
//       作者： 蔡捷 (2634691810@qq.com)   
//			 订单 
//       文件： orders.cshtml 页面文件 
//       文件： orders.js JS文件
//------------------------------------------------------------------------------
路径：~/Areas/dev/ViewJS/orders.js
说明：订单(orders)的js文件
*/
//当前页面对象
var km = {};
km.model = null;
km.parent_model = null;

km.init = function () {
    com.initbuttons($('#km_toolbar'), km.model.buttons);
    km.init_parent_model();
    //   km.template.init();
    address_6_Init();
    orders_detail_12_Init();


    //如果没有动态combobox可删除
    $('.easyui-combobox').each(function (index, element) {
        var options = $(this).combobox('options')
        var u = $(this).attr("url2")

        if (u != undefined) {

            options.url = km.model.urls[u];
            if (options.multiple == true) {

                options.formatter = function (row) { //formatter方法就是实现了在每个下拉选项前面增加checkbox框的方法  
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
                options.onUnselect = function (row) {//不选中一个选项时调用  
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

        var v = a[i].split("=")[0];
        var t = a[i].split("=")[1];
        if (type == "checkbox") {

            if (("," + value + ",").indexOf("," + v + ",") >= 0)
                tmp += "&nbsp;<input type='checkbox' checked  disabled='true'  >&nbsp;" + t;
            else
                tmp += "&nbsp;<input type='checkbox' disabled='true' >&nbsp;" + t;


        } else if (type == "radio") {
            if (value == v)
                tmp += "&nbsp;<input type='radio' checked disabled='true' >&nbsp;" + t;
            else
                tmp += "&nbsp;<input type='radio' disabled='true' >&nbsp;" + t;
        } else {
            if (value == v)
                return t;
        }
    }
    return tmp;
}



//------------------------------------------------------------------------------ 
//       时间： 2018-05-01
//       作者： 蔡捷 (2634691810@qq.com)   
//			   
//------------------------------------------------------------------------------  

function address_6_Init() {
    km.address.init();
    if (km.address.LoadData != undefined)
        km.address.LoadData();
}



function addaddress(index) {


    km.toolbar.do_add();
}

function editaddress(index) {
    $('#address').datagrid('selectRow', index);// 关键在这里  

    km.toolbar.do_edit();
}
function deleteaddress(index) {
    $('#address').datagrid('selectRow', index);// 关键在这里  

    km.toolbar.do_delete();
}



var selectedaddressIndex = 0;



km.address = {
    jq: null,

    init: function () {
        this.jq = $("#address").datagrid({
            fit: true, border: false, singleSelect: true, rownumbers: true, remoteSort: true, cache: false, method: 'get', idField: 'id',

            queryParams: { _t: com.settings.timestamp(), keyword: "" },
            url: km.model.urls["address_pager"],


            pagination: true, pageList: [5, 10, 15, 20, 30, 50, 100], pageSize: km.pageSize, fitColumns: true,
            columns: [[


 	                { field: 'add_on', title: gDictionary["add_on"], width: 80, align: 'center', sortable: true },
                { field: 'address', title: gDictionary["address"], width: 80, align: 'center', sortable: true },
                //{ field: 'address_type', title: 'address_type', width: 80, align: 'center', sortable: true },
               // { field: 'cell', title: 'cell', width: 80, align: 'center', sortable: true },
                { field: 'city', title: gDictionary["city"], width: 80, align: 'center', sortable: true },
                { field: 'email', title: gDictionary["email"], width: 80, align: 'center', sortable: true },
                //{ field: 'id', title: 'id', width: 80, align: 'center', sortable: true },
                { field: 'name', title: gDictionary["name"], width: 80, align: 'center', sortable: true },
               // { field: 'postal_code', title: 'postal_code', width: 80, align: 'center', sortable: true },
                { field: 'province', title: gDictionary["prov"], width: 80, align: 'center', sortable: true },
               // { field: 'user_id', title: 'user_id', width: 80, align: 'center', sortable: true },
    // {
    //                            field: 'id', title: '<a href="#" onclick="addaddress( )">增加</a>', width: 80, align: 'center', sortable: false, formatter: function (val, row, index) {
    //                                return '<a href="#" onclick="editaddress(' + index + ')">修改</a>&nbsp;|&nbsp;<a href="#" onclick="deleteaddress(' + index + ')">删除</a>';
    //}  },


            ]],
            onClickRow: function (index, row) {

                selectedaddressIndex = index;
                km.address.selectedIndex = index;
                km.address.selectedRow = row;

                if (km.address.selectedRow)
                    km.set_mode_address('show');
            },
            onLoadSuccess: function (data) {

                if (data.rows.length > 0) {

                    if (data.rows.length <= selectedaddressIndex)
                        selectedaddressIndex = 0
                    $("#address").datagrid("selectRow", selectedaddressIndex);
                }
                km.address.selectedRow = km.address.getSelectedRow();

                if (km.address.selectedRow)
                    km.set_mode_address('show');
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
    do_refresh: function () { km.address.reload(); },
    do_add: function () {

        km.set_mode_address('add');

    },
    do_edit: function () {

        if (km.address.selectedRow == null) { layer.msg(gDictionary["please select one record"]); return; }
        km.set_mode_address('edit');


    },
    do_delete: function () {
        var sRow = km.address.getSelectedRow();
        if (sRow == null) { layer.msg(gDictionary["please select one record"]); return; }
        //if (km.model.loginer.IsSuperAdmin == 0 && sRow.AllowEdit == 0) { layer.msg(gDictionary["can not delete it"]); return; }
        var jsonParam = JSON.stringify(sRow);
        com.message('c', ' <b style="color:red">确定要删除【' + sRow.id + '】吗？ </b>', function (b) {
            if (b) {
                com.ajax({
                    url: km.model.urls["address_delete"], data: jsonParam, success: function (result) {
                        if (result.s) {
                            com.message('s', result.message);
                            km.address.reload();
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
        var jsonObject = $("#address_content").serializeJson();





        var jsonStr = jsonObject;
        if (!$("#address_content").form('validate')) {
            layer.msg(gDictionary["data is incorrect, please try again"]);
            return false;
        }
        //添加自定义判断
        //if (jsonObject.ParamCode == "" || jsonObject.ParamValue == "") { flagValid = false; com.message('e', gDictionary["the parameter can not be empty"]); return; }
        if (flagValid) {
            if (km.settings.op_mode == 'edit') {
                com.ajax({
                    type: 'POST', url: km.model.urls["address_update"], data: jsonStr, success: function (result) {
                        AfterEditaddress(result);
                    }
                });
            }

            if (km.settings.op_mode == 'add') {
                com.ajax({
                    type: 'POST', url: km.model.urls["address_insert"], data: jsonStr, success: function (result) {
                        AfterEditaddress(result);
                    }
                });
            }
        }



    }
    ,
    do_undo: function () {
        var op_mode = km.address.selectedRow == null ? 'clear' : 'show';
        km.set_mode_address(op_mode);
    }
};


function AfterEditaddress(result) {
    if (result.s) {
        com.message('s', result.message);
        km.address.reload();
        if (km.settings.op_mode == 'add') {
            //    km.address.unselectAll();
            km.set_mode_address('clear');
        }
        if (km.settings.op_mode == 'edit') {
            km.address.selectRow(km.address.selectedIndex);
            km.address.selectedRow = $.extend(km.address.selectedRow, jsonObject);
            km.set_mode_address('show');
        }


    } else {
        com.message('e', result.message);
    }
}



/*显示：'show'  新增：'add'  编辑 'edit'  清空 'clear'*/
km.set_mode_address = function (op_mode) {
    km.settings.op_mode = op_mode;
    $('#km_toolbar').show();
    $('#km_toolbar_2').hide();
    com.mask($('#west_panel'), false);
    // $('#user_tabs').tabs('enableTab', 1);
    // $('#user_tabs').tabs('enableTab', 2);
    $('#address_content .easyui-combobox').combobox('readonly', true);
    $('#address_content .easyui-combotree').combotree('readonly', true);
    $('#address_content .easyui-textbox').textbox('readonly', true);
    $('#address_content .easyui-numberbox').numberbox('readonly', true);

    $("#address_content").find("input[type='radio']").attr("disabled", "true");//这
    $("#address_content").find("input[type='checkbox']").attr("disabled", "true");//这
    if (op_mode == 'show') {
        //console.info(JSON.stringify(km.address.selectedRow));
        var sRow = km.address.selectedRow;

        km.orders_detail.LoadData();

        $('#address_content').form('load', sRow);
        //   km.orgcombotree.jq.combotree('setValue', km.address.selectedRow.DepartmentCode);
    } else if (op_mode == 'add') {
        $('#km_toolbar').hide();
        $('#km_toolbar_2').show();
        com.mask($('#west_panel'), true);

        //  $('#user_tabs').tabs('disableTab', 1);
        //  $('#user_tabs').tabs('disableTab', 2);
        //  $('#user_tabs').tabs('select', 0);

        $("#address_content").find("input[type='radio']").removeAttr("disabled");
        $("#address_content").find("input[type='checkbox']").removeAttr("disabled");

        $('#address_content .easyui-combobox').combobox('readonly', false);
        $('#address_content .easyui-combotree').combotree('readonly', false);
        $('#address_content .easyui-textbox').textbox('readonly', false);
        $('#address_content .easyui-numberbox').numberbox('readonly', false);

        $('#address_content').form('clear');


        //  $('#TPL_id').val(0);
        //$('#TPL_Enabled').combobox('setValue', 1);
        //$('#TPL_UserType').combobox('setValue', 3);
        //$('#TPL_IsSingleLogin').combobox('setValue', 1);
        //$('#TPL_Sex').combobox('setValue', gDictionary["male"]);
        //$('#TPL_Sort').numberbox('setValue', 888);

    } else if (op_mode == 'edit') {

        $("#address_content").find("input[type='radio']").removeAttr("disabled");
        $("#address_content").find("input[type='checkbox']").removeAttr("disabled");
        //alert($('#address_content .easyui-text'));
        $('#address_content .easyui-combobox').combobox('readonly', false);
        $('#address_content .easyui-combotree').combotree('readonly', false);
        $('#address_content .easyui-textbox').textbox('readonly', false);
        $('#address_content .easyui-numberbox').numberbox('readonly', false);
        $('#km_toolbar').hide();
        $('#km_toolbar_2').show();
        com.mask($('#west_panel'), true);
        $('#TPL_add_on').textbox('readonly', true);

        //$('#user_tabs').tabs('disableTab', 1);
        //$('#user_tabs').tabs('disableTab', 2);
        //$('#user_tabs').tabs('select', 0);
    } else if (op_mode == 'clear') {
        $('#address_content').form('clear');

    }
}







//------------------------------------------------------------------------------ 
//       时间： 2018-05-01
//       作者： 蔡捷 (2634691810@qq.com)   
//			   
//------------------------------------------------------------------------------  



var orders_detailupdatedRows = new Array();



function orders_detailshowValue(value, data, type, index, col) {
    var tmp = "";
    var a = data.split(" ");
    for (var i = 0; i < a.length; i++) {

        var v = a[i].split("=")[0];
        var t = a[i].split("=")[1];
        if (type == "checkbox") {

            var str = "orders_detailChangeValue2(this,\"" + col + "\"," + index + ",\"" + v + "\")";
            if (("," + value + ",").indexOf("," + v + ",") >= 0)
                tmp += "&nbsp;<input type='checkbox'  name='" + col + index + "'  id='" + col + index + i + "' value=\'" + v + "\' onchange='" + str + "' checked >&nbsp;" + t;
            else
                tmp += "&nbsp;<input type='checkbox'  name='" + col + index + "'  id='" + col + index + i + "' value=\'" + v + "\'  onchange='" + str + "' >&nbsp;" + t;


        } else if (type == "radio") {

            var str = "orders_detailChangeValue(this,\"" + col + "\"," + index + ",\"" + v + "\")";
            if (value == undefined && i == 0) {
                console.log(index);
                orders_detailChangeValue(null, col, index, v);
            }
            if (value == v || (value == undefined && i == 0))
                tmp += "&nbsp;<input type='radio' name='" + col + index + "'  id='" + col + index + i + "' onchange='" + str + "' checked >&nbsp;" + t;
            else
                tmp += "&nbsp;<input type='radio' name='" + col + index + "'  id='" + col + index + i + "'  onchange='" + str + "' >&nbsp;" + t;
        } else {
            if (value == v)
                return t;
        }
    }
    return tmp;
}

function orders_detailChangeValue2(me, col, index, v) {
    // var row = km.orders_detail.getSelectedRow();

    var data = $('#orders_detail').datagrid('getData');
    // var k = orders_detailupdatedRows[j];
    var row = data.rows[index]

    var cs = $("input[name='" + col + index + "']:checked");
    var p = [];
    cs.each(function () {
        //  console.log(this.value);
        p.push(this.value);
    });

    row[col] = p;

    orders_detailpushChangedRow(index);
    // console.log(km.orders_detail.getSelectedRow());
}
function orders_detailpushChangedRow(index) {
    for (var i = 0; i < orders_detailupdatedRows.length; i++) {
        if (orders_detailupdatedRows[i] == index)
            return;
    }
    orders_detailupdatedRows.push(index)
}

function orders_detailChangeValue(me, col, index, v) {
    // var row = km.orders_detail.getSelectedRow();

    var data = $('#orders_detail').datagrid('getData');
    // var k = orders_detailupdatedRows[j];
    var row = data.rows[index]
    row[col] = v;
    orders_detailpushChangedRow(index);
}


function orders_detail_12_Init() {
    km.orders_detail.init();
    //if(	km.orders_detail.LoadData!=undefined)	
    //	km.orders_detail.LoadData(); 
}

function g_orders_detail_order_id() {

    return km.address.selectedRow.oid;
}

var selectedorders_detailIndex = 0;



km.orders_detail = {
    jq: null,

    LoadData: function () {
        var options = $('#orders_detail').datagrid('options')
        options.queryParams = {
            _t: com.settings.timestamp(),
            order_id: g_orders_detail_order_id(),
        };
        options.url = km.model.urls["orders_detail_pager"];
        $('#orders_detail').datagrid(options);

    },

    init: function () {
        this.jq = $("#orders_detail").datagrid({
            fit: true, border: false, singleSelect: true, rownumbers: true, remoteSort: true, cache: false, method: 'get', idField: 'id',



            pagination: true, pageList: [5, 10, 15, 20, 30, 50, 100], pageSize: km.pageSize, fitColumns: true, toolbar: '#tborders_detail', onClickRow: onClickRow_orders_detail,
            columns: [[

                        //      { field: 'add_on', title: gDictionary["add_on"], width: 130, align: 'center', sortable: true, editor: { type: 'textbox', options: {} } },




                          { field: 'comments', title: gDictionary["comments"], width: 80, align: 'center', sortable: true, editor: { type: 'textbox', options: {} } },
                          { field: 'options', title: gDictionary["options"], width: 80, align: 'center', sortable: true, editor: { type: 'textbox', options: {} } },
                          { field: 'options_price', title: gDictionary["options_price"], width: 80, align: 'center', sortable: true, editor: { type: 'textbox', options: {} } },

                                                  //   { field: 'id', title: 'id', width: 80, align: 'center', sortable: true },


                              {
                                  field: 'item_id', title: gDictionary["item"], width: 200, align: 'left', sortable: true, formatter: function (v, r, i) {
                                      return r.item_name;
                                  },  

                                  editor: {
                                      type: 'combobox',
                                      options: {
                                          valueField: 'id', textField: 'item_name', editable: true, hasDownArrow: true, panelHeight: 200,
                                          data: gitem_list
                                      }
                                  } },


                            //  { field: 'order_id', title: 'order_id', width: 100, align: 'center', sortable: true ,editor:{type:'textbox',options:{}}},


{ field: 'price', title: gDictionary["price"], width: 20, align: 'right', sortable: true, editor: { type: 'textbox', options: {} } },
{ field: 'amount', title: gDictionary["amount"], width: 20, align: 'right', sortable: true, editor: { type: 'textbox', options: {} } },


{ field: 'total', title: gDictionary["total"], width: 20, align: 'right', sortable: true },


            ]],
            onLoadSuccess: function () { }
        });//end grid init
    },
    reload: function (queryParams) {

        this.LoadData();
    },
    getSelectedRow: function () { return this.jq.datagrid('getSelected'); }
};


var editIndexorders_detail = undefined;
function orders_detailendEditing() {
    if (editIndexorders_detail == undefined) { return true }
    if ($('#orders_detail').datagrid('validateRow', editIndexorders_detail)) {

        //需要手工修改
        //	var ed = $('#orders_detail').datagrid('getEditor', {index:editIndexorders_detail,field:'productid'});
        //	var productname = $(ed.target).combobox('getText');
        //	$('#orders_detail').datagrid('getRows')[editIndexorders_detail]['productname'] = productname;
        $('#orders_detail').datagrid('endEdit', editIndexorders_detail);


        editIndexorders_detail = undefined;
        return true;
    } else {
        return false;
    }
}
function onClickRow_orders_detail(index) {
    if (editIndexorders_detail != index) {
        if (orders_detailendEditing()) {
            $('#orders_detail').datagrid('selectRow', index)
                    .datagrid('beginEdit', index);
            editIndexorders_detail = index;
        } else {
            $('#orders_detail').datagrid('selectRow', editIndexorders_detail);
        }
    }
}
function append_orders_detail() {
    if (orders_detailendEditing()) {
        $('#orders_detail').datagrid('appendRow', { status: 'P' });
        editIndexorders_detail = $('#orders_detail').datagrid('getRows').length - 1;
        $('#orders_detail').datagrid('selectRow', editIndexorders_detail)
                .datagrid('beginEdit', editIndexorders_detail);
    }
}
function removeit_orders_detail() {
    if (editIndexorders_detail == undefined) { layer.msg(gDictionary["please select one record"]); return; }

    var sRow = km.orders_detail.getSelectedRow();
    if (sRow == null) { layer.msg(gDictionary["please select one record"]); return; }
    //if (km.model.loginer.IsSuperAdmin == 0 && sRow.AllowEdit == 0) { layer.msg(gDictionary["can not delete it"]); return; }
    var jsonParam = JSON.stringify(sRow);
    com.message('c', ' <b style="color:red">确定要删除【' + sRow.id + '】吗？ </b>', function (b) {


        for (var j = orders_detailupdatedRows.length - 1; j > 0  ; j--) {
            var data = $('#orders_detail').datagrid('getData');
            var k = orders_detailupdatedRows[j];
            var tmpstr = JSON.stringify(data.rows[k])
            if (jsonParam == tmpstr)
                orders_detailupdatedRows.splice(j, 1);
        }

        if (b) {
            com.ajax({
                url: km.model.urls["orders_detail_delete"], data: sRow, success: function (result) {
                    if (result.s) {
                        com.message('s', result.message);

                        $('#orders_detail').datagrid('cancelEdit', editIndexorders_detail)
                                .datagrid('deleteRow', editIndexorders_detail);
                        editIndexorders_detail = undefined;

                        km.orders_detail.reload();

                    } else {
                        com.message('e', result.message);
                    }
                }
            });
        }
    });

}

function orders_detailSubmitChanges(rows, url) {

    for (var i = 0; i < rows.length; i++) {



        rows[i].order_id = g_orders_detail_order_id();
        var jsonStr = JSON.stringify(rows[i]);

        com.ajax({
            type: 'POST', url: km.model.urls[url], data: rows[i], success: function (result) {

                if (i == rows.length - 1)
                    km.orders_detail.reload();
            }
        });

        for (var j = orders_detailupdatedRows.length - 1; j > 0  ; j--) {
            var data = $('#orders_detail').datagrid('getData');
            var k = orders_detailupdatedRows[j];
            var tmpstr = JSON.stringify(data.rows[k])
            if (jsonStr == tmpstr)
                orders_detailupdatedRows.splice(j, 1);
        }

    }
}

function accept_orders_detail() {
    if (orders_detailendEditing()) {


        if ($("#orders_detail").datagrid('getChanges').length) {
            ////获取插入更改的行的集合
            var inserted = $("#orders_detail").datagrid('getChanges', "inserted");

            orders_detailSubmitChanges(inserted, "orders_detail_insert");

            var updated = $("#orders_detail").datagrid('getChanges', "updated");

            orders_detailSubmitChanges(updated, "orders_detail_update");

        }
        for (var j = orders_detailupdatedRows.length - 1; j >= 0  ; j--) {

            var data = $('#orders_detail').datagrid('getData');
            var k = orders_detailupdatedRows[j];
            var rows = data.rows;




            data.rows[k].order_id = g_orders_detail_order_id();
            var tmpstr = JSON.stringify(data.rows[k])
            com.ajax({
                type: 'POST', url: km.model.urls["orders_detail_update"], data: data.rows[k], success: function (result) {
                    //     AfterEdit(result);

                    if (j == 0)
                        km.orders_detail.reload();
                }
            });
            orders_detailupdatedRows = new Array();
        }

        return;

    }

    $('#orders_detail').datagrid('acceptChanges');

}
function reject_orders_detail() {
    $('#orders_detail').datagrid('rejectChanges');
    editIndexorders_detail = undefined;
}
function getChanges_orders_detail() {
    var rows = $('#orders_detail').datagrid('getChanges');
    alert(rows.length + ' rows are changed!');
}




