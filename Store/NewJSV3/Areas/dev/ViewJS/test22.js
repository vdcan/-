
/*
//------------------------------------------------------------------------------ 
//        Date  2018-05-29
//        Author  polltek.com   
//			 				test 
//        File  test22.cshtml  Page file  
//        File  test22.js JS File 
//------------------------------------------------------------------------------
 Path ~/Areas/dev/ViewJS/test22.js
 Description test22(test22)  js File 
*/
// Current page object 
var km = {};
km.model = null;
km.parent_model = null;

km.init = function () {
    com.initbuttons($('#km_toolbar'), km.model.buttons);
    km.init_parent_model(); 
 //   km.template.init();
     address_test_2_Init();
 
 
    // if it is static combobox can be deleted 
     $('.easyui-combobox').each(function (index, element) {
       var options = $(this).combobox('options')
          var u = $(this).attr("url2")
      
        if (u!= undefined) { 
         
            options.url = km.model.urls[u];
            if (options.multiple == true) {

                options.formatter= function (row) { //formatter this method is used to add options checkbox select method   
                    var opts = $(this).combobox('options');  
                    return '<input type="checkbox" class="combobox-checkbox">' + row[opts.textField]  
                };
            options.onLoadSuccess = function () {  // after select load successfuly   
                var opts = $(this).combobox('options');  
                var target = this;  
                var values = $(target).combobox('getValues');// get selected value values  
                $.map(values, function (value) {  
                    var el = opts.finder.getEl(target, value);  
                    el.find('input.combobox-checkbox')._propAttr('checked', true);   
                })  
            };
            options.onSelect = function (row) { // when select an option   
                var opts = $(this).combobox('options');  
                // get selected value values  
                //$("#"+id).val($(this).combobox('getValues'));  
                     
                // set check box in combobox   
                var el = opts.finder.getEl(this, row[opts.valueField]);  
                el.find('input.combobox-checkbox')._propAttr('checked', true);  
            }
            options.onUnselect =function (row) {// nothing selected   
                var opts = $(this).combobox('options');  
                // get selected value values  
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

/* Init iframe parent page model object app.index.js client object */
km.init_parent_model = function () {
    // Only in child page, it can get parent page model object  parent.wrapper.model
    if (window != parent) {
        if (parent.wrapper) {
            km.parent_model = parent.wrapper.model;
            //com.message('s', ' Got parent page model object <br>' + JSON.stringify(km.parent_model));
        } else {
            com.showcenter(' message ', " exist parent page, but can not get it parent.wrapper object ");
        }
    } else {
        com.showcenter(' message ', " the cureent page is out of iframe ，can not get parent.wrapper Object ");
    }
}

$(km.init);

// page object parameters 
km.settings = {};

// Data format 
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
//        Date  2018-05-29
//        Author  polltek.com   
//			   
//------------------------------------------------------------------------------  

function  address_test_2_Init(){
	km.address_test.init();
	
	if(	km.address_test.LoadData!=undefined)	
		km.address_test.LoadData(); 
}



function addaddress_test(index) {
    
   
    km.toolbar.do_add();
}

function editaddress_test(index) {
    $('#address_test').datagrid('selectRow', index);//  the key is   
   
    km.toolbar.do_edit();
}
function deleteaddress_test(index) {
    $('#address_test').datagrid('selectRow', index);//  the key is   
   
    km.toolbar.do_delete();
}


var selectedaddress_testIndex = 0;



km.address_test= {
    jq: null,
     	             	
    init: function () {
        this.jq = $("#address_test").datagrid({
            fit: true, border: false, singleSelect: true, rownumbers: true, remoteSort: true, cache: false, method: 'get', idField: 'id',
             	            
            queryParams: { _t: com.settings.timestamp(), keyword: "" }, 
            url: km.model.urls["address_test_pager"],
               	 
 

            pagination: true, pageList: [5, 10, 15, 20, 30, 50, 100], pageSize:  km.pageSize,fitColumns:true,
            columns: [[
   
            
 	                { field: 'add_on', title: 'add_on', width: 80, align: 'center', sortable: true },
                { field: 'address', title: 'address', width: 80, align: 'center', sortable: true },
                { field: 'address_type', title: 'address_type', width: 80, align: 'center', sortable: true },
                { field: 'cell', title: 'cell', width: 80, align: 'center', sortable: true },
                { field: 'city', title: 'city', width: 80, align: 'center', sortable: true },
                { field: 'email', title: 'email', width: 80, align: 'center', sortable: true },
                { field: 'id', title: 'id', width: 80, align: 'center', sortable: true },
                { field: 'name', title: 'name', width: 80, align: 'center', sortable: true },
                { field: 'postal_code', title: 'postal_code', width: 80, align: 'center', sortable: true },
                { field: 'province', title: 'province', width: 80, align: 'center', sortable: true },
                { field: 'user_id', title: 'user_id', width: 80, align: 'center', sortable: true },
     {
                                field: 'id', title: '<a href="#" onclick="addaddress_test( )"> increase </a>', width: 80, align: 'center', sortable: false, formatter: function (val, row, index) {
                                    return '<a href="#" onclick="editaddress_test(' + index + ')"> modifiy </a>&nbsp;|&nbsp;<a href="#" onclick="deleteaddress_test(' + index + ')"> delete </a>';
    }  },
    
                
 
            ]],
            onClickRow: function (index, row) {
            
                selectedaddress_testIndex = index;
                km.address_test.selectedIndex = index;
                km.address_test.selectedRow = row;  
                if(                km.address_test.selectedRow ){
                	
                	address_test_selected();
                }
            },
            onLoadSuccess: function (data) {
            
             if (data.rows.length >0){
            
             	if (data.rows.length <= selectedaddress_testIndex)
             		selectedaddress_testIndex =0
              $("#address_test").datagrid("selectRow", selectedaddress_testIndex);
             }
                km.address_test.selectedRow = km.address_test.getSelectedRow(); 
                if(                km.address_test.selectedRow ){
                	
                	address_test_selected();
                }
             }
        });//end grid init
    },
    reload: function (queryParams) {	         var defaults = { _t: com.settings.timestamp() };
       if (queryParams) { defaults = $.extend(defaults, queryParams); }
     this.jq.datagrid('reload', defaults);
      	    },
    getSelectedRow: function () { return this.jq.datagrid('getSelected'); }
};


function address_test_selected(){
// km.address_test.selectedRow 

      	
console.log("address_test selected");
   

}


