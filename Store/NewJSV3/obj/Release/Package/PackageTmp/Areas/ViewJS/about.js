
/*
//------------------------------------------------------------------------------ 
//       时间： 2018-04-29
//       作者： 蔡捷   
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
//       作者： 蔡捷   
//			   
//------------------------------------------------------------------------------  
   function g_item_id(){
 //  console.log("replace this value");
   return 1;
   	}

 $(function () {
     Load_itemData();
 })

 function Load_itemData(){
 	jsonObject={_t: com.settings.timestamp(),
					id:g_item_id(),};
 	
com.ajax({

    type: 'POST', url: vd.model.urls["context_detail"], data: jsonObject, success: function (result) {
        $("#abountDiv").html("<h4>" + result[0].title + "</h4>" + result[0].context.replaceAll("&gt;", ">").replaceAll("&lt;", "<"));
    }
    });
 }

  