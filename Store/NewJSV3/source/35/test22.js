
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

 
