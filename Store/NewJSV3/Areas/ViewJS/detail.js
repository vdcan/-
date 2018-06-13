
/*
//------------------------------------------------------------------------------ 
//       时间： 2018-04-29
//       作者： 蔡捷 (2634691810@qq.com)   
//			 show item detail info 
//       文件： detail.cshtml 页面文件 
//       文件： detail.js JS文件
//------------------------------------------------------------------------------ 
*/
 
 //当前页面对象
var vd = {};
vd.model = null; 
vd.init = function () {
    
     };



$(function () {
    //$$.init();
    $(vd.init); 
});

 
 
//------------------------------------------------------------------------------ 
//       时间： 2018-04-29
//       作者： 蔡捷 (2634691810@qq.com)   
//			   
//------------------------------------------------------------------------------  
   function g_item_id(){
 //  console.log("replace this value");
   return getURLParameters("id");
   	}

 $(function () {
     Load_itemData();
 })

 function Load_itemData(){
 	jsonObject={_t: com.settings.timestamp(),
					id:g_item_id(),};
 	
com.ajax({

            type: 'POST', url: vd.model.urls["item_list"], data: jsonObject, success: function (result) { 
            	
        var t = {};
        t = result
            	   $("#template_item").tmpl(t)
                     .appendTo("#detail_div_item");

                $("#template_spec").tmpl(t)
                  .appendTo("#specDiv");

                //$("#template_options").tmpl(t)
                //  .appendTo("#options");
                AddOptions(result);
                CalculatorTotalPrices();

                console.log(GetSelectedOptionText());
                $("#template_image").tmpl(t)
                     .appendTo("#imagesDiv"); 
                for (var i = 0; i < result.Table1.length; i ++)
                    SetSpec("spec_" + i, result.Table1[i].specification_value);

            	   $('.thumbnail2').viewbox(); 
            }
    });
 }


 function SelectOption(me, id, i) {
     console.log("SelectOption");
     //$('.l' + id).css({ "background-color": "#c8c8c8" });
     $('.d' + i).removeClass("Selected");
     if (me != null) {


      //   $(me).css({ "background-color": "black" });
         $(me).addClass("Selected");
     }
     CalculatorTotalPrices();
   //  SetSelectedOptionText();

   
 }

 function CalculatorTotalPrices() {
  var oprice = 0.0;
     var OptionsPrice = GetSelectedOptionPrice();
     if (OptionsPrice != "") {
         var a = OptionsPrice.split(" ");
         console.log(a);
         for (var j = 0; j != a.length; j++) {

             if (a[j].trim() != "") {

                 oprice += parseFloat(a[j]);
             }
         }
     }

     var p = parseFloat($("#price").text());
     p = p + oprice;
     $("#spanPrice").html(p.toFixed(2));

 }

 function GetPrice() {
     CalculatorTotalPrices();
     return $("#spanPrice").html();
 }

 function GetItemName() {
     return $("#itemName").html() + " "+GetSelectedOptionText()
 }

 function SetSelectedOptionText() {
     var tmpStr = "";
     $(".note").html("");
     var aaa = $("#options .Selected");
     aaa.each(function () {
         tmpStr += $(this).text().trim() + " ";
     });

     $(".note").html(tmpStr);
     //  return tmpStr;
 }

 function GetSelectedOptionText() {
     var tmpStr = "";

     var aaa = $("#options .Selected");
     aaa.each(function () {
         tmpStr += $(this).attr("label")+":"+$(this).text().trim() + " ";
     });

     //  $(".note").html(tmpStr);
     return tmpStr;
 }


 function GetSelectedOptionText2() {
     var tmpStr = "";

     var aaa = $("#options .Selected");
     aaa.each(function () {
         tmpStr += $(this).attr("label") + ":" + $(this).text().trim() + " ";
     });

     //  $(".note").html(tmpStr);
     return tmpStr.replace(/ *\([^)]*\) */g, " ");;
 }

 function GetSelectedOptionPrice() {
     var tmpStr = "";

     var aaa = $("#options .Selected");
     aaa.each(function () {
         tmpStr += $(this).attr("price").trim() + " ";
     });

   console.log(tmpStr);
     //  $(".note").html(tmpStr);
     return tmpStr;
 } 
 function AddOptions(result) {
     if (result.Table3.length > 0) {
         for (var i = 0; i < result.Table3.length; i++) {
             var row = result.Table3[i];


             var j = 0;
             var str = String.format(" <div class='btn-group cleaner' data-toggle='buttons'><p class='name'>{0}</p> ", row.option_name);
             var str2 = "";
             var a = row.option_detail.split(",");

             var b = row.options_value.split(",");

             var priceInfo = "";
             var priceInfoText = "";

             console.log(b);
             for (j = 0; j < a.length; j++) {

                 if (b[j] != "0" && b[j] != "") {
                     var p = parseFloat(b[j]);
                // var p = p.toFixed(2);
                 priceInfo = p.toFixed(2);
                 priceInfoText = "(" + priceInfo + ")";
                 } else {
                     priceInfo = "0";
                     priceInfoText = "";
                 }
                 if (j == 0)
                     str2 = str2 + String.format(" <label class='btn btn-primary active d{4} Selected'  value='{0}' id='l{1}' onclick='SelectOption(this, {1},{4});'  price='{3}' label='{5}' checked id='reg{1}_{2}'  > <input type='radio' name='size{1}' autocomplete='on' checked> {0}  </label>   ", a[j] + priceInfoText, row.id, j, priceInfo, i, row.option_name);
                 else
                     str2 = str2 + String.format(" <label class='btn btn-primary   d{4}'  value='{0}' id='l{1}'  onclick='SelectOption(this, {1},{4});'  price='{3}' label='{5}' checked id='reg{1}_{2}'  > <input type='radio' name='size{1}' autocomplete='on'  > {0}  </label>   ", a[j] + priceInfoText, row.id, j, priceInfo, i, row.option_name);
                 //str2 = str2 + String.format("<input type='radio' value='{0}' name='size{1}' id='reg{1}_{2}'  onclick='SelectOption(this, {1});'   price='{3}'  >{0}</label> ", a[j] + priceInfoText, row.id, j, priceInfo);

             }
             $("#options").append(str + str2 + "</div>");
         }
     }

 }


 function SetSpec(name, v) {

     if (v == "")
         return;

     var aaa = $("#" + name + " li")

     var i = 0;
     var arr = v.split(";");


     aaa.each(function () {
         var b = $(this).html();

         if (b.indexOf(":") > 0) {

             var a = b.split(":");//$(this).append(a[0]);
             if (arr[i] != "")
                 $(this).html(a[0] + ":" + arr[i]);
             else
                 $(this).hide()
             i++;

         }
     });
 }

