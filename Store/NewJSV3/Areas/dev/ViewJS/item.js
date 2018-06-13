
/*
//------------------------------------------------------------------------------ 
//       时间： 2018-02-10
//       作者： 蔡捷 (2634691810@qq.com)2   
//			 菜品管理 
//       文件： item.cshtml 页面文件 
//       文件： item.js JS文件
//------------------------------------------------------------------------------
路径：~/Areas/dev/ViewJS/item.js
说明：菜品管理(item)的js文件
*/
//当前页面对象
var km = {};
km.model = null;
km.parent_model = null;

km.init = function () {
    com.initbuttons($('#km_toolbar'), km.model.buttons);
    km.init_parent_model();
    //   km.template.init(); 
    item_14_Init();
    item_specification_16_Init();
    item_options_10_Init();
    //item_specification_23_Init();
    item_search_15_Init();
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
//       时间： 2018-02-10
//       作者： 蔡捷 (2634691810@qq.com)2   
//			 照片  
//------------------------------------------------------------------------------  



//var row = 40;
var gPageSize;
var gPageNumber;

function LoadData(pageNumber, pageSize) {
    gPageSize = pageSize;
    gPageNumber = pageNumber;

    $('#item_image').html("");
    //var row = 40;
    //  options.queryParams = { _t: com.settings.timestamp(), image_type: 0, notice_id: km.notice.selectedRow.id };
    var jsonParam = { page: pageNumber, rows: pageSize, image_type: 0, item_id: km.item.selectedRow.id };
    //JSON.stringify(
    com.ajax2({
        type: 'GET', url: km.model.urls["item_photo_pager"], data: jsonParam, success: function (result) {


            for (var i = 0; i < result.rows.length; i++) {
                var r = result.rows[i];
                var tmps = "DeleteImage(" + r.id + ")";
                tmps = String.format("<div class='qrdiv'><a class='thumbnail'  href='{1}'  ><img class='image' src='{0}' /></a><div class='deletePhotoButton'> <img class='deletePhotoButton' src='/Scripts/03jeasyui/icons/icon-standard/16x16/bin-closed.png' onclick='DeleteImage({2})'/> </div> </div>", r.url_thumb, r.url, r.id);

                $('#item_image').append(tmps);
            }

            ///Dev/QRImage/GetImg?t=
            $('#pp').pagination({
                total: result.total,
                pageSize: 4,
                pageList: [4, 10, 20, 50, 100],
                onSelectPage: function (pageNumber, pageSize) {
                    LoadData(pageNumber, pageSize);
                    // $(this).pagination('loading');
                    //  alert('pageNumber:' + pageNumber + ',pageSize:' + pageSize);
                    // $(this).pagination('loaded');
                }
            });

            $('.thumbnail').viewbox();

        }
    });
}
function DeleteImage(id) {
    com.message('c', ' <b style="color:red">确定要删除图片吗？ </b>', function (b) {
        if (b) {

            var jsonParam = { id: id };
            var j = JSON.stringify(jsonParam);
            com.ajax({
                type: 'POST', url: km.model.urls["item_photo_delete"], data: j, success: function (result) {
                    LoadData(gPageNumber, gPageSize);
                }

            });
        }
    });
}




function SetUploadFile() {

    $("#imageDiv").show();
    $(".deletePhotoButton").show();

    $("#imageDiv").html('<input style="display: none;" id="TPL_picturefile" type="file" multiple="false" />');

    $('#TPL_picturefile').uploadifive({
        'auto': true, 'buttonText': gDictionary["upload"],
        'formData': {
            t: 0,
            item_id: km.item.selectedRow.id
        }, 'queueID': 'queue', 'uploadScript': km.model.urls["item_photo_insert"], 'onUploadComplete': function (file, data) {
            LoadData(gPageNumber, gPageSize);
            if (data.indexOf(";") >= 0) {
                var id = data.substring(0, data.indexOf(";"));

            }
        }
    });
}








//------------------------------------------------------------------------------ 
//       时间： 2018-02-10
//       作者： 蔡捷 (2634691810@qq.com)2   
//			 菜品表  
//------------------------------------------------------------------------------  

function item_14_Init() {
    km.item.init();
    km.item.LoadData();
}
var gfood_code = '';
var gcook_flag = -1;
var gactive_flag = -1;
var gcategories = '';
var goptions = '';
var gxml = '';
var selecteditemIndex = 0;
km.item = {
    jq: null,

    LoadData: function () {
        //var options = $('#item').datagrid('options')
        //options.queryParams = {
        //    _t: com.settings.timestamp(),
        //    store_id: 0,
        //};
        //options.url = km.model.urls["item_pager"];
        //$('#item').datagrid(options);

        var options = $('#item').datagrid('options')
        options.queryParams = {
            _t: com.settings.timestamp(),
            food_code: gfood_code, cook_flag: gcook_flag, active_flag: gactive_flag, categories: gcategories, options: goptions, xml: gxml,
        };
        options.url = km.model.urls["item_search_search_pager"];
        $('#item').datagrid(options);


    },

    init: function () {
        this.jq = $("#item").datagrid({
            fit: true, border: false, singleSelect: true, rownumbers: true, remoteSort: true, cache: false, method: 'get', idField: 'id',

            //queryParams: {
            //    _t: com.settings.timestamp(),
            //},


            pagination: true, pageList: [5, 10, 15, 20, 30, 50, 100], pageSize: km.pageSize, fitColumns: true,
            columns: [[


                { field: 'item_name', title: gDictionary["name"], width: 180, align: 'left', sortable: true },
 	             //   { field: 'store_id', title: gDictionary["store id"], width: 80, align: 'center', sortable: true },
               // { field: 'category_id', title: gDictionary["category"], width: 80, align: 'center', sortable: true },
                { field: 'price', title: gDictionary["price"], width: 80, align: 'right', sortable: true },
                { field: 'sort_number', title: gDictionary["sort"], width: 80, align: 'center', sortable: true },
                { field: 'add_date', title: gDictionary["add_on"], width: 80, align: 'center', sortable: true },
                { field: 'add_by', title: gDictionary["add_by"], width: 80, align: 'center', sortable: true },
              //  { field: 'description', title: gDictionary["description"], width: 80, align: 'center', sortable: true },
    //            { field: 'unit', title: gDictionary["unit"], width: 80, align: 'center', sortable: true },
    //            { field: 'food_code', title: gDictionary["code"], width: 80, align: 'center', sortable: true },
    //            { field: 'cook_flag', title: gDictionary["cook flag"], width: 80, align: 'left', sortable: true,formatter: function (value, row, index) {

    //                                return showValue(value,'1=加工 0=不加工','radio' );
    //                           }},
    //                                            { field: 'active_flag', title: gDictionary["active"], width: 80, align: 'left', sortable: true,formatter: function (value, row, index) {

    //                                return showValue(value,'1=启用 0=未启用','radio' );
    //                           }},
    //                                            { field: 'categories', title: gDictionary["category"], width: 80, align: 'center', sortable: true },
    //            { field: 'options', title: gDictionary["menu_name"], width: 80, align: 'center', sortable: true },
    //            { field: 'specifications', title: gDictionary["specification"], width: 80, align: 'center', sortable: true },
    //            { field: 'tags', title: gDictionary["flag"], width: 80, align: 'center', sortable: true },
    // {
    //                            field: 'id', title: '<a href="#" onclick="additem( )">增加</a>', width: 80, align: 'center', sortable: false, formatter: function (val, row, index) {
    //                                return '<a href="#" onclick="edititem(' + index + ')">修改</a>&nbsp;|&nbsp;<a href="#" onclick="deleteitem(' + index + ')">删除</a>';
    //}  },

            ]],
            onClickRow: function (index, row) {

                selecteditemIndex = index;
                km.item.selectedIndex = index;
                km.item.selectedRow = row;

                if (km.item.selectedRow)
                    km.set_mode_item('show');
            },
            onLoadSuccess: function (data) {

                if (data.rows.length > 0) {

                    if (data.rows.length <= selecteditemIndex)
                        selecteditemIndex = 0
                    $("#item").datagrid("selectRow", selecteditemIndex);
                }
                km.item.selectedRow = km.item.getSelectedRow();

                if (km.item.selectedRow)
                    km.set_mode_item('show');
            }
        });//end grid init
    },
    reload: function (queryParams) {

        this.LoadData();
    },
    getSelectedRow: function () { return this.jq.datagrid('getSelected'); }
};



/*工具栏权限按钮事件*/
km.toolbar = {
    do_refresh: function () {
   //     km.item.reload();


        $("[href]").addClass("selected");
        $("[href]").css("border", "solid 1px red");
        $("[onclick]").css("border", "solid 1px red");
       // console.log( $("[onclick]"));//.addClass("selected");
        $("textarea").parent().css("border", "solid 1px red");
        $("input").css("border", "solid 1px red");
        $("input[type=radio]").parent().css("border", "solid 1px red");
        $("input[type=checkbox]").parent().css("border", "solid 1px red");
        $(".layout-panel").css("border", "solid 1px green");

    },
    do_add: function () {

        km.set_mode_item('add');

    },
    do_edit: function () {

        if (km.item.selectedRow == null) { layer.msg(gDictionary["please select one record"]); return; }
        km.set_mode_item('edit');


    },
    do_delete: function () {
        var sRow = km.item.getSelectedRow();
        if (sRow == null) { layer.msg(gDictionary["please select one record"]); return; }
        //if (km.model.loginer.IsSuperAdmin == 0 && sRow.AllowEdit == 0) { layer.msg(gDictionary["can not delete it"]); return; }
        var jsonParam = JSON.stringify(sRow);
        com.message('c', ' <b style="color:red">确定要删除菜品表【' + sRow.id + '】吗？ </b>', function (b) {
            if (b) {
                com.ajax({
                    url: km.model.urls["item_delete"], data: jsonParam, success: function (result) {
                        if (result.s) {
                            com.message('s', result.message);
                            km.item.reload();
                        } else {
                            com.message('e', result.message);
                        }
                    }
                });
            }
        });
    },
    do_search: function () {


        $('#item_search_dialog').html($('#item_search_dialog').html().replaceAll("_easyui", "easyui"));

        $('#item_search_dialog').dialog_ext({
            title: gDictionary["button_name"], iconCls: 'icon-standard-zoom', top: 100, height: 500, width: 800,
            onOpenEx: function (win) {
                //win.find('#TPL_Enabled').combobox('setValue', 1);
                //win.find('#TPL_Sort').numberbox('setValue', 100);
                //   gWin = win;
                km.item_search_search.init(win);
                //  $(".easyui-textbox3").textbox();

                win.find(".form_content").find("input[type='radio']").removeAttr("disabled");
                win.find(".form_content").find("input[type='checkbox']").removeAttr("disabled");
            },
            onClickButton: function (win) { //保存操作  
                var data = win.find('#item_search_search').datagrid('getData');
                for (var i = 0; i < data.total; i++) {
                    if (!win.find('#item_search_search').datagrid('validateRow', i)) {
                        //  layer.msg(gDictionary["please input query condition"])
                        com.message('e', gDictionary["please input query condition"]);
                        //  alert(gDictionary["please input query condition"])
                        return;
                    }
                }

                var jsonObject = win.find("#item_search_content").serializeJson();





                accept_item_search_search(win);

                console.log(xml_json);
                var xml_json2 = CreateXML(xml_json, win);

                jsonObject.xml = xml_json2;


                jsonObject._t = com.settings.timestamp();



                gfood_code = jsonObject.food_code;
                gcook_flag = jsonObject.cook_flag;
                gactive_flag = jsonObject.active_flag;
                gcategories = jsonObject.categories;
                goptions = jsonObject.options;
                gxml = jsonObject.xml;

                //var options = $('#item').datagrid('options')
                //console.log(options)

                //options.url = km.model.urls["item_search_search_pager"];
                //options.queryParams = jsonObject;//{ _t: com.settings.timestamp(), crops_id: gcrops_id }; 
                //console.log(options)
                //$('#item').datagrid(options);
                km.item.LoadData();
                win.dialog('destroy');

            }
        });


    },

    do_save: function () {

        var flagValid = true;
        var jsonObject = $("#item_content").serializeJson();
        jsonObject.store_id = 0;//替换该值     



        if (jsonObject.categories == undefined)
            jsonObject.categories = "";




        if (jsonObject.options == undefined)
            jsonObject.options = "";




        if (jsonObject.tags == undefined)
            jsonObject.tags = "";

        jsonObject.item_category = 0;


        jsonObject.description = jsonObject.description.replaceAll(">", "&gt;").replaceAll("<", "&lt;");

        var jsonStr = JSON.stringify(jsonObject);
        if (!$("#item_content").form('validate')) {
            layer.msg(gDictionary["data is incorrect, please try again"]);
            return false;
        }
        //添加自定义判断
        //if (jsonObject.ParamCode == "" || jsonObject.ParamValue == "") { flagValid = false; com.message('e', gDictionary["the parameter can not be empty"]); return; }
        if (flagValid) {
            if (km.settings.op_mode == 'edit') {
                com.ajax({
                    type: 'POST', url: km.model.urls["item_update"], data: jsonStr, success: function (result) {
                        AfterEdititem(result);
                    }
                });
            }

            if (km.settings.op_mode == 'add') {
                com.ajax({
                    type: 'POST', url: km.model.urls["item_insert"], data: jsonStr, success: function (result) {
                        AfterEdititem(result);
                    }
                });
            }
        }



    },
    do_undo: function () {
        var op_mode = km.item.selectedRow == null ? 'clear' : 'show';
        km.set_mode_item(op_mode);
    }
};


function AfterEdititem(result) {
    if (result.s) {
        com.message('s', result.message);
        km.item.reload();
        if (km.settings.op_mode == 'add') {
            //   km.item.unselectAll();
            km.set_mode_item('clear');
        }
        if (km.settings.op_mode == 'edit') {
            //  km.item.selectRow(km.item.selectedIndex);
            //  km.item.selectedRow = $.extend(km.item.selectedRow, jsonObject);
            km.set_mode_item('show');
        }


    } else {
        com.message('e', result.message);
    }
}



/*显示：'show'  新增：'add'  编辑 'edit'  清空 'clear'*/
km.set_mode_item = function (op_mode) {
    km.settings.op_mode = op_mode;
    $('#km_toolbar').show();
    $('#km_toolbar_2').hide();
    com.mask($('#west_panel'), false);
    // $('#user_tabs').tabs('enableTab', 1);
    // $('#user_tabs').tabs('enableTab', 2);
    //  return;
    try {
        $('#item_content .easyui-combobox').combobox('readonly', true);
        $('#item_content .easyui-combotree').combotree('readonly', true);
        $('#item_content .easyui-textbox').textbox('readonly', true);
        $('#item_content.easyui-numberbox').numberbox('readonly', true);

        $("#item_content").find("input[type='radio']").attr("disabled", "true");//这
        $("#item_content").find("input[type='checkbox']").attr("disabled", "true");//这

    } catch (e) { }

    if (op_mode == 'show') {
        //console.info(JSON.stringify(km.item.selectedRow));
        var sRow = km.item.selectedRow;

        if (sRow.categories.indexOf(",") > 0)
            sRow.categories = sRow.categories.split(",");
        if (sRow.options.indexOf(",") > 0)
            sRow.options = sRow.options.split(",");
        if (sRow.tags.indexOf(",") > 0)
            sRow.tags = sRow.tags.split(",");
        $('#item_content').form('load', sRow);
        km.item_specification.LoadData();
        km.item_options.LoadData();

        LoadData(1, 20);




        $("#tdText").html('<textarea rows="3" style="width:100%;  " class="v_content" id="TPL_description" name="description" ></textarea>');

        //  description = jsonObject.description.replaceAll("<", "&gt;").replaceAll(">", "&lt;");
        $("#TPL_description").val(km.item.selectedRow.description.replaceAll("&gt;", ">").replaceAll("&lt;", "<"));


        var h = 500;// $("#main-panel_b").height();
        //  alert(h);
        editor = KindEditor.create('.v_content', {
            resizeType: 1, width: "100%;", height: h + "px",
            allowPreviewEmoticons: false,

            allowImageUpload: true,//允许上传图片

            allowFileManager: false, //允许对上传图片进行管理

            uploadJson:'/dev/titan/uploadImage', //上传图片的java代码，只不过放在jsp中

            //afterChange:function(){
            //this.sync();
            //},

            afterBlur: function () {
                this.sync();
            }
        });
      //  editor.readonly();

        //   km.orgcombotree.jq.combotree('setValue', km.item.selectedRow.DepartmentCode);
    } else if (op_mode == 'add') {
        $('#km_toolbar').hide();
        $('#km_toolbar_2').show();
        com.mask($('#west_panel'), true);

        //  $('#user_tabs').tabs('disableTab', 1);
        //  $('#user_tabs').tabs('disableTab', 2);
        //  $('#user_tabs').tabs('select', 0);

        $("#item_content").find("input[type='radio']").removeAttr("disabled");
        $("#item_content").find("input[type='checkbox']").removeAttr("disabled");

        $('#item_content .easyui-combobox').combobox('readonly', false);
        $('#item_content .easyui-combotree').combotree('readonly', false);
        $('#item_content .easyui-textbox').textbox('readonly', false);
        $('#item_content .easyui-numberbox').numberbox('readonly', false);

        $('#item_content').form('clear');

        $('#TPL_store_id').textbox('readonly', true);
        $('#TPL_add_date').textbox('readonly', true);
        $('#TPL_add_by').textbox('readonly', true);

        //  $('#TPL_id').val(0);
        //$('#TPL_Enabled').combobox('setValue', 1);
        //$('#TPL_UserType').combobox('setValue', 3);
        //$('#TPL_IsSingleLogin').combobox('setValue', 1);
        //$('#TPL_Sex').combobox('setValue', gDictionary["male"]);
        //$('#TPL_Sort').numberbox('setValue', 888);

    } else if (op_mode == 'edit') {

        $("#item_content").find("input[type='radio']").removeAttr("disabled");
        $("#item_content").find("input[type='checkbox']").removeAttr("disabled");
        //alert($('.form_content .easyui-text'));
        $('#item_content .easyui-combobox').combobox('readonly', false);
        $('#item_content .easyui-combotree').combotree('readonly', false);
        $('#item_content .easyui-textbox').textbox('readonly', false);
        $('#item_content .easyui-numberbox').numberbox('readonly', false);
        $('#km_toolbar').hide();
        $('#km_toolbar_2').show();
        com.mask($('#west_panel'), true);

        SetUploadFile();
        //$('#user_tabs').tabs('disableTab', 1);
        //$('#user_tabs').tabs('disableTab', 2);
        //$('#user_tabs').tabs('select', 0);
    } else if (op_mode == 'clear') {
        $('#item_content').form('clear');

    }
}







//------------------------------------------------------------------------------ 
//       时间： 2018-02-10
//       作者： 蔡捷 (2634691810@qq.com)2   
//			 商品参数对应表  
//------------------------------------------------------------------------------  

function item_specification_16_Init() {

    km.item_specification.init();
}

var selecteditem_specificationIndex = 0;
var gData = {};
km.item_specification = {
    jq: null,

    LoadData: function () {
        var options = $('#item_specification').datagrid('options')
        options.queryParams = {
            _t: com.settings.timestamp(),
            item_id: km.item.selectedRow.id,
        };
        options.url = km.model.urls["item_specification_pager_check"];
        $('#item_specification').datagrid(options);

    },

    init: function () {
        this.jq = $("#item_specification").datagrid({
            fit: true, border: false, singleSelect: true, rownumbers: true, remoteSort: true, cache: false, method: 'get', idField: 'id',

            queryParams: {
                _t: com.settings.timestamp(),
            },

            pagination: true, pageList: [5, 10, 15, 20, 30, 50, 100], pageSize: km.pageSize, fitColumns: true,
            columns: [[
            			{
            			    field: 'checked', title: ' ', width: 30,
            			    formatter: function (value, rec, rowIndex) {
            			        if (value == 0)
            			            return "<input type=\"checkbox\"  name=\"PDitem_specification\" value=\"" + rec.id + "\">";
            			        else
            			            return "<input type=\"checkbox\" checked='checked'  name=\"PDitem_specification\" value=\"" + rec.id + "\" >";
            			    }
            			},


 	         //       { field: 'item_id', title: gDictionary["goods id"], width: 80, align: 'center', sortable: true },
              //  { field: 'specification_id', title: gDictionary["specification"], width: 80, align: 'center', sortable: true },
              //  { field: 'add_date', title: gDictionary["add_on"], width: 80, align: 'center', sortable: true },
             //   { field: 'add_by', title: gDictionary["add_by"], width: 80, align: 'center', sortable: true },
              //  { field: 'specification_value', title: gDictionary["customize value"], width: 80, align: 'center', sortable: true },

                  {
                      field: 'name', title: gDictionary["button_name"], width: 300, align: 'left', sortable: false,
                      formatter: function (value, rec, rowIndex) {

                          return " <span id='div" + rec.checked + "' style='height: 20px;display: block; overflow: hidden'>" + rec.name + "</span>";
                      }
                  },
                   {
                       field: 'add_by', title: ' ', width: 50,
                       formatter: function (value, rec, rowIndex) {
                           if (rec.checked == 0)
                               return "";
                           else
                               return "<a href='javascript:;'  onclick='OpenSetSpecValueDialog(" + rowIndex + ") '>" + gDictionary["Setup"] + "</a>";
                           //  return "<a href='javascript:;'  onclick='OpenSetSpecValueDialog(\"" + rec.checked + "\", \"" + rec.value + "\") '>设置</a>";
                       }
                   },
     //{
     //    field: 'id', title: '<a href="#" onclick="additem_specification( )">增加</a>', width: 80, align: 'center', sortable: false, formatter: function (val, row, index) {
     //        return '<a href="#" onclick="edititem_specification(' + index + ')">修改</a>&nbsp;|&nbsp;<a href="#" onclick="deleteitem_specification(' + index + ')">删除</a>';
     //    }
     //},

            ]],
            onClickRow: function (index, row) {

                selecteditem_specificationIndex = index;
                km.item_specification.selectedIndex = index;
                km.item_specification.selectedRow = row;
                if (km.item_specification.selectedRow) {

                }
            },
            onLoadSuccess: function (data) {
                gData = data;
                $("input[name='PDitem_specification']").unbind().bind("click", function () {
                    // alert($(this).attr("value") + "," + ($(this).attr('checked')));

                    Setitem_specification($(this).attr("value"));
                    return;


                });


                if (data.rows.length > 0) {

                    if (data.rows.length <= selecteditem_specificationIndex)
                        selecteditem_specificationIndex = 0
                    $("#item_specification").datagrid("selectRow", selecteditem_specificationIndex);
                }
                km.item_specification.selectedRow = km.item_specification.getSelectedRow();
                if (km.item_specification.selectedRow) {

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

function Setitem_specification(id) {



    var jsonParam = JSON.stringify({ id: id, item_id: km.item.selectedRow.id });
    com.ajax({
        type: 'POST', url: km.model.urls["item_specification_check"], data: jsonParam, success: function (result) {
            //  alert(result);
            //  LoadOptions();
            km.item_specification.LoadData();
        }
    });
}










function SaveSpec() {


    var v = "";
    var aaa = $("#detailSpec input");

    aaa.each(function () {
        v += $(this).val() + ";";
    });

    $('#popupDialogSpec').dialog('close');
    var jsonParam = JSON.stringify({ item_id: km.item.selectedRow.id, id: gid, value: v });

    com.ajax({
        type: 'POST', url: km.model.urls["setspecvalues"], data: jsonParam, success: function (result) {

            km.item_specification.LoadData();
        }
    });
}
function CloseSpec() {


    $('#popupDialogSpec').dialog('close');
}


function OpenSetSpecValueDialog(index) {
    var h = gData.rows[index].detail;
    h = h.replaceAll("&gt;", ">").replaceAll("&lt;", "<");
    var v = gData.rows[index].value;
    //  console.log(h);
    gid = gData.rows[index].checked;
    $("#detailSpec").html("");

    $("#detailSpec").html($(h).html());

    var aaa = $("#detailSpec li")

    var i = 0;
    var arr = v.split(";");


    aaa.each(function () {
        var b = $(this).html();
        if (b.indexOf(":") > 0) {

            var a = b.split(":");//$(this).append(a[0]);
            if (v != "")
                $(this).html(a[0] + ":" + "<input type='text' style='width: 100px; z-index:20;' value='" + arr[i] + "' />");
            else
                $(this).html(a[0] + ":" + "<input type='text' style='width: 100px; z-index:20;' value='" + a[1] + "' />");
            i++;

        }
    });

    $("#popupDialogSpec").dialog("open");
}

var gDataOptions = {}
function OpenSetSpecValueDialog2(oid, v) {
    // data.rows
    // console.log(v);
    gid = oid;
    $("#detailSpec").html("");

    $("#detailSpec").html($("#div" + oid).html());

    var aaa = $("#detailSpec li")

    var i = 0;
    var arr = v.split(":");


    aaa.each(function () {
        var b = $(this).html();
        if (b.indexOf(":") > 0) {

            var a = b.split(":");//$(this).append(a[0]);
            if (v != "")
                $(this).html(a[0] + ":" + "<input type='text' style='width: 100px; z-index:20;' value='" + arr[i] + "' />");
            else
                $(this).html(a[0] + ":" + "<input type='text' style='width: 100px; z-index:20;' value='" + a[1] + "' />");
            i++;

        }
    });

    $("#popupDialogSpec").dialog("open");
}









//------------------------------------------------------------------------------ 
//       时间： 2018-02-10
//       作者： 蔡捷 (2634691810@qq.com)2   
//			 商品选项对应表  
//------------------------------------------------------------------------------  

function item_options_10_Init() {
    km.item_options.init();
}

var selecteditem_optionsIndex = 0;
km.item_options = {
    jq: null,

    LoadData: function () {
        var options = $('#item_options').datagrid('options')
        options.queryParams = {
            _t: com.settings.timestamp(),
            item_id: km.item.selectedRow.id,
        };
        options.url = km.model.urls["item_options_pager_check"];
        $('#item_options').datagrid(options);

    },

    init: function () {
        this.jq = $("#item_options").datagrid({
            fit: true, border: false, singleSelect: true, rownumbers: true, remoteSort: true, cache: false, method: 'get', idField: 'id',

            queryParams: {
                _t: com.settings.timestamp(),
            },

            pagination: true, pageList: [5, 10, 15, 20, 30, 50, 100], pageSize: km.pageSize, fitColumns: true,
            columns: [[
            			{
            			    field: 'checked', title: ' ', width: 30,
            			    formatter: function (value, rec, rowIndex) {
            			        if (value == 0)
            			            return "<input type=\"checkbox\"  name=\"PDitem_options\" value=\"" + rec.id + "\">";
            			        else
            			            return "<input type=\"checkbox\" checked='checked'  name=\"PDitem_options\" value=\"" + rec.id + "\" >";
            			    }
            			},


 	              { field: 'option_name', title: gDictionary["option name"], width: 80, align: 'left', sortable: true },
                { field: 'option_description', title: gDictionary["description"], width: 120, align: 'left', sortable: true },
                { field: 'option_detail', title: gDictionary["button_name"], width: 120, align: 'left', sortable: true },
                                            {
                                                field: 'mutil_flag', title: gDictionary["muti-selection"], width: 80, align: 'center', sortable: true, formatter: function (value, row, index) {
                                                    var h = gDictionary["undefined"];

                                                    if (value == '0') h = gDictionary["single-selection"];
                                                    if (value == '1') h = gDictionary["muti-selection"]; return h;
                                                }
                                            },
                //{ field: 'add_by', title: gDictionary["add_by"], width: 120, align: 'left', sortable: true },
	            //{ field: 'id', title: '', width: 80, align: 'left', sortable: true, visible:false },
                  {
                      field: 'add_by', title: ' ', width: 80,
                      formatter: function (value, rec, index) {
                          if (rec.checked == 0)
                              return "";
                          else
                              return "<a href='javascript:;'  onclick='OpenSetOptionsValueDialog(" + index + ") '>"+gDictionary["Setup"]+"</a>";
                      }
                  },

     //{
     //    field: 'id', title: '<a href="#" onclick="additem_options( )">增加</a>', width: 80, align: 'center', sortable: false, formatter: function (val, row, index) {
     //        return '<a href="#" onclick="edititem_options(' + index + ')">修改</a>&nbsp;|&nbsp;<a href="#" onclick="deleteitem_options(' + index + ')">删除</a>';
     //    }
     //},

            ]],
            onClickRow: function (index, row) {

                selecteditem_optionsIndex = index;
                km.item_options.selectedIndex = index;
                km.item_options.selectedRow = row;
                if (km.item_options.selectedRow) {

                }
            },
            onLoadSuccess: function (data) {
                gDataOptions = data;
                $("input[name='PDitem_options']").unbind().bind("click", function () {
                    // alert($(this).attr("value") + "," + ($(this).attr('checked')));

                    Setitem_options($(this).attr("value"));
                    return;


                });


                if (data.rows.length > 0) {

                    if (data.rows.length <= selecteditem_optionsIndex)
                        selecteditem_optionsIndex = 0
                    $("#item_options").datagrid("selectRow", selecteditem_optionsIndex);
                }
                km.item_options.selectedRow = km.item_options.getSelectedRow();
                if (km.item_options.selectedRow) {

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

function Setitem_options(id) {



    var jsonParam = JSON.stringify({ id: id, item_id: km.item.selectedRow.id });
    com.ajax({
        type: 'POST', url: km.model.urls["item_options_check"], data: jsonParam, success: function (result) {
            //  alert(result);
            //  LoadOptions();
            km.item_options.LoadData();
        }
    });
}




var gid = 0;
function SaveMe() {

    var values = "";

    $("input[name='deail']").each(
        function () {
            values = values + $(this).val() + ",";

        });

    $('#popupDialog').dialog('close');
    var jsonParam = JSON.stringify({ item_id: km.item.selectedRow.id, id: gid, value: values });

    com.ajax({
        type: 'POST', url: km.model.urls["setovalues"], data: jsonParam, success: function (result) {
            //  LoadOptions();

            km.item_options.LoadData();
        }
    });
}
function CloseMe() {


    $('#popupDialog').dialog('close');
}

function OpenSetOptionsValueDialog(index) {
    console.log(gDataOptions.rows[index]);
    var detail = gDataOptions.rows[index].option_detail;
    var values = gDataOptions.rows[index].value;
    //  console.log(h);
    gid = gDataOptions.rows[index].checked;
    $("#detailSpec").html("");

    $("#detail").html("");

    var a = detail.split(",");

    var b = values.split(",");
    $("#detail").append("<div class='detail' ><span class='title'>" + gDictionary["name"] + "</span><span class='value'  >" + gDictionary["price"] + "</span></div>");
    for (var i = 0; i != a.length; i++) {
        if (values != "")
            $("#detail").append("<div class='detail' ><span class='title'>" + a[i] + "</span><input  class='value' id='d" + i + "' name='deail' value='" + b[i] + "' /></div>");
        else
            $("#detail").append("<div class='detail' ><span class='title'>" + a[i] + "</span><input  class='value' id='d" + i + "' name='deail' /></div>");
    }

    //alert($("#detail").html());
    $("#popupDialog").dialog("open");


}
function SetOptions(oid, detail, values) {



    var jsonParam = JSON.stringify({ id: id, item_id: km.item.selectedRow.id });

    com.ajax({
        type: 'POST', url: km.model.urls["setoptions"], data: jsonParam, success: function (result) {
            //  alert(result);
            LoadOptions();
        }
    });
}





//------------------------------------------------------------------------------ 
//       时间： 2018-02-11
//       作者： 蔡捷 (2634691810@qq.com)2   
//			 菜品表  
//------------------------------------------------------------------------------  

function item_search_15_Init() {
    //km.item_search.init();
    //km.item_search.LoadData();
    $('._easyui-combobox').each(function (index, element) {
        var opstr1 = $(this).attr("data-options");
        var u = $(this).attr("url2")
        if (u != undefined) {
            $(this).attr("data-options", opstr1 + ",url:'" + km.model.urls[u] + "'");

        }

    });
    //	km.item_search_search.init();
    // search_item_search() ;
}


var gCompareData = [
                                                        { 'id': 'gt', 'text': '>' },
                                                        { 'id': 'lt', 'text': '<' },
                                                        { 'id': '=', 'text': '=' },

                                                        { 'id': 'like', 'text': gDictionary["include"] },
                                                        { 'id': 'not like', 'text': gDictionary["not include"] },
                                                        { 'id': '=', 'text': gDictionary["total include"] }
];



var gOrAndData = [
                                             { 'id': 'or', 'text': gDictionary["or"] },
                                             { 'id': 'and', 'text': gDictionary["and"] }
];


var gColumnData = [
{ 'id': 'id', 'text': gDictionary["id"], 'type': 'int' }
 , { 'id': 'store_id', 'text': gDictionary["store id"], 'type': 'int' }
 , { 'id': 'add_date', 'text': gDictionary["add_on"], 'type': 'datetime' }
 , { 'id': 'add_by', 'text': gDictionary["add_by"], 'type': 'int' }
 , { 'id': 'category_id', 'text': gDictionary["category"], 'type': 'int' }
 , { 'id': 'item_name', 'text': gDictionary["name"], 'type': 'nvarchar' }
 , { 'id': 'price', 'text': gDictionary["price"], 'type': 'decimal' }
 , { 'id': 'sort_number', 'text': gDictionary["sort"], 'type': 'int' }
 , { 'id': 'description', 'text': gDictionary["description"], 'type': 'nvarchar' }
 , { 'id': 'unit', 'text': gDictionary["unit"], 'type': 'nchar' }
 , { 'id': 'specifications', 'text': gDictionary["specification"], 'type': 'varchar' }
 , { 'id': 'tags', 'text': gDictionary["flag"], 'type': 'varchar' }
];

var selecteditem_searchIndex = 0;
km.item_search = {
    jq: null,

    LoadData: function () {
        var options = $('#item').datagrid('options')
        options.queryParams = {
            _t: com.settings.timestamp(),
            food_code: '', cook_flag: 0, active_flag: 0, categories: '', options: '', xml: '',
        };
        options.url = km.model.urls["item_search_search_pager"];
        $('#item').datagrid(options);

    }
};




/*
for searching
*/


var selecteditem_search_searchIndex = 0;
km.item_search_search = {
    jq: null,


    init: function (win) {
        this.jq = win.find("#item_search_search").datagrid({
            fit: false, border: false, singleSelect: true, rownumbers: true, remoteSort: true, cache: false, method: 'get', idField: 'id',
            //pagination: true, pageList: [5, 10, 15, 20, 30, 50, 100], pageSize:  km.pageSize,
            fitColumns: true,
            columns: [[

				{
				    field: 'orand', title: gDictionary["at same time"], width: 80, align: 'left', sortable: false,
				    formatter: function (value, row, index) {
				        for (var i = 0; i < gOrAndData.length; i++) {
				            if (gOrAndData[i].id == value)
				                return gOrAndData[i].text;
				        }
				        return "";
				    },
				    editor: {
				        type: 'combobox',
				        options: {
				            valueField: 'id', textField: 'text', editable: true, hasDownArrow: true, panelHeight: 200,
				            data: gOrAndData,
				        }
				    }
				},

				{
				    field: 'column_name', title: gDictionary["column_name"], width: 280, align: 'left', sortable: false,
				    formatter: function (value, row, index) {
				        for (var i = 0; i < gColumnData.length; i++) {
				            if (gColumnData[i].id == value)
				                return gColumnData[i].text;
				        }
				        return "";
				    },
				    editor: {
				        type: 'combobox',
				        options: {
				            valueField: 'id', textField: 'text', editable: true, hasDownArrow: true, panelHeight: 200,
				            data: gColumnData,
				        }
				    }
				},
				{
				    field: 'compare', title: gDictionary["compare"], width: 80, align: 'left', sortable: false,
				    formatter: function (value, row, index) {
				        for (var i = 0; i < gCompareData.length; i++) {
				            if (gCompareData[i].id == value)
				                return gCompareData[i].text;
				        }
				        return "";
				    },
				    editor: {
				        type: 'combobox',
				        options: {
				            valueField: 'id', textField: 'text', editable: true, hasDownArrow: true, panelHeight: 200,
				            data: gCompareData,
				        }
				    }
				},
			{
			    field: 'value', title: gDictionary["value"], width: 280, align: 'left', sortable: false,

			    editor: {
			        type: 'validatebox',
			        options: {
			            required: true
			        }
			    }
			}, {
			    field: 'value2', title: '', width: 80, align: 'left', sortable: false, formatter: function (v, r, i) {
			        return '<a href="javascript:removeit_item_search_search(' + i + ')">删除';
			    }
			},

            ]],
            onLoadSuccess: function () { }
        });//end grid init
    },
    getSelectedRow: function () { return this.jq.datagrid('getSelected'); }
};



var xml_json = '';

function accept_item_search_search(win) {
    xml_json = '';
    var data = win.find('#item_search_search').datagrid('getData');
    //alert('总数据量:'+data.total)
    for (var i = 0; i < data.total; i++) {

        win.find('#item_search_search').datagrid('endEdit', i);
    }

    var inserted = win.find('#item_search_search').datagrid('getRows');

    for (var i = 0; i < inserted.length; i++) {

        if (inserted[i].orand == "")
            inserted[i].orand = "and";
        xml_json += '<item column_name="' + inserted[i].column_name + '" value= "' + inserted[i].value + '" compare= "' + inserted[i].compare + '" orand= "' + inserted[i].orand + '"/>\r\n';

    }
}


function CreateXML(xml_sql) {

    var xml = "<root>";

    xml += xml_sql;
    xml += "</root>";
    xml = xml.replaceAll(">", "&gt").replaceAll("<", "&lt");
    return xml
}


