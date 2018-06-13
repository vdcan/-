
/*
//------------------------------------------------------------------------------ 
//       时间： 2018-04-30
//       作者： 蔡捷 (2634691810@qq.com)   
//			  
//       文件： checkout.cshtml 页面文件 
//       文件： checkout.js JS文件
//------------------------------------------------------------------------------ 
*/
 
 //当前页面对象
var vd = {};
vd.model = null; 
vd.init = function () {
    
     orders_detail_1_Init();
     address_4_Init();
     openFlow();

     $("#simpleCart_items").prependTo("#detail_div_orders_detail");
  //   GetTotal();

};

//function GetTotal() {
  

//    var total = 0;
//    simpleCart.each(function (item) {
//        console.log(item);
//     //   ids += item.get("id") + ",";
//        //  price += item.get("price") + ",";
//        total += parseFloat(item.get("total"));
//    });
//    $("#simpleCart_input").html(total);
//}
var gNodes = [];
var gStepsArray = [];
var gStep = 0;
function GoToStep(gf_id, direction) {

    for (var i = 0; i < gStepsArray.length; i++) {

        $("#" + gStepsArray[i] + "_dialog").dialog('close');
    }

    for (var i = 0; i < gNodes.length; i++) {
        if (gNodes[i].gf_id == gf_id) {
            gStep = i + 1;
            console.log(gStep + direction);
            $(".ystep2").setStep(gStep + direction);
            $("#" + gf_id + "_dialog").dialog('open');
            return;
        }
    }
}


$(function () {
    //$$.init();
    $(vd.init); 
});


function openFlow( ) {
  //  gNodes = result.Table;

    var max = 0;
    var current = 0;
    var gSteps = {
        size: "large",
        color: "blue",
        steps: []
    }
    //for (var i = 0; i < result.Table.length; i++) {

    //    gSteps.steps.push({
    //        title: result.Table[i]["name"]
    //        , content: ""
    //    })
    //}

    gStepsArray.push("shipping_address");
   // gStepsArray.push("contact_address");
    gStepsArray.push("order");
    gStepsArray.push("finish");

    gNodes.push({ "gf_id": "shipping_address" });
   // gNodes.push({ "gf_id": "contact_address" });
    gNodes.push({ "gf_id": "order" });
    gNodes.push({ "gf_id": "finish" }); 

    gSteps.steps.push({
        title: "Shipping "
          , content: ""
    });
    //gSteps.steps.push({
    //    title: "Contact "
    //      , content: ""
    //});
    gSteps.steps.push({
        title: "Order "
          , content: ""
    });
    gSteps.steps.push({
        title: "Finish "
          , content: ""
    });

    $(".ystep2").loadStep(gSteps);
    $(".ystep2").css("width", $(".ystep2").find(".ystep-container").css("width"))
    for (var i = 0; i < gStepsArray.length; i++) {

        $("#" + gStepsArray[i] + "_dialog").dialog('close');
    }
    $("#shipping_address_dialog").dialog('open');
   // setTimeout("GetStatus()", 100);
}
 
 
//------------------------------------------------------------------------------ 
//       时间： 2018-04-30
//       作者： 蔡捷 (2634691810@qq.com)   
//			   
//------------------------------------------------------------------------------  

   
function  orders_detail_1_Init(){ 
	  gFlowID = 0;
     // addStep("");
}
  
function SaveOrder(){
    var ids = "";
    var quantity = 0;
    var total = 0;
    var x = "<r>";
    console.log(simpleCart.ids());
    simpleCart.each(function (item) {
         console.log(item);
         ids += item.get("id") + ",";
         ids += item.get("options") + ",";
         ids += item.get("pid") + ",";
        //  price += item.get("price") + ",";
        total += parseFloat(item.get("total"));
        quantity += parseInt(item.get("quantity"));

        x = x + '<i  id="' + item.get("pid") + '" o="' + item.get("options") + '" c="' + item.get("opt_prices") + '"  q="' + item.get("quantity") + '"/>';

    });
      x =x+ "</r>";
      //console.log(x);

      var jsonObject = { xml: x, address_id: $("#TPL_address_id").val(), id: $("#TPL_order_id").val() }
      console.log(jsonObject);
      com.ajax({

          type: 'POST', url: vd.model.urls["orders_detail_save"], data: jsonObject, success: function (result) {
              if (result instanceof Array) {

                  jsonObject.id = result[0]["id"];
                  // $("#orders_detail_content").form('load', jsonObject);
                 simpleCart.empty();

                  GoToStep('finish', 1);
              } else {
                  com.message('e', result.message);
              }
          }
      });

  //  GoToStep('finish',0);
}
function Done() {
    window.location = "/";
}
  
function Saveorders_detail() {


    var flagValid = true;
    var jsonObject = $("#orders_detail_content").serializeJson();
      
    if (!$("#orders_detail_content").form('validate')) {
       // com.message('e', '输入数据有错误，请纠正后再存。');
        com.message('e', gDictionary["data is incorrect, please try again"]);
        return false;
    }
    //添加自定义判断
    //if (jsonObject.ParamCode == "" || jsonObject.ParamValue == "") { flagValid = false; com.message('e', '参数代码或参数名称不能为空！'); return; }
    if (flagValid) { 
        com.ajax({

            type: 'POST', url: vd.model.urls["orders_detail_save"], data: jsonObject, success: function (result) {
                if (result instanceof Array) {

                    jsonObject.id = result[0]["id"];
                    $("#orders_detail_content").form('load', jsonObject);
                    GoToStep('',1);
                } else {
                    com.message('e', result.message);
                }
            }
        });
            
    }
}

 

 
//------------------------------------------------------------------------------ 
//       时间： 2018-04-30
//       作者： 蔡捷 (2634691810@qq.com)   
//			   
//------------------------------------------------------------------------------  

   
function  address_4_Init(){ 
	  gFlowID = 0;
   //   addStep("");
}
  
  
  
function Saveaddress_shipping() {


    var flagValid = true;
    var jsonObject = $("#address_shipping_content").serializeJson();
      
    if (!$("#address_shipping_content").form('validate')) { 
        com.message('e', gDictionary["data is incorrect, please try again"]);
        return false;
    }
    jsonObject.address_type = 1;
    //添加自定义判断
    //if (jsonObject.ParamCode == "" || jsonObject.ParamValue == "") { flagValid = false; com.message('e', '参数代码或参数名称不能为空！'); return; }
    if (flagValid) { 
        com.ajax({

            type: 'POST', url: vd.model.urls["address_save"], data: jsonObject, success: function (result) {
                if (result instanceof Array) {

                    jsonObject.id = result[0]["id"];
                    $("#address_shipping_content").form('load', jsonObject);
                    GoToStep('order',0);
                } else {
                    com.message('e', result.message);
                }
            }
        });
            
    }
}

 
