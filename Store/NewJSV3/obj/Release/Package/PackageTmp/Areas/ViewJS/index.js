
/*
//------------------------------------------------------------------------------ 
//       时间： 2018-04-28
//       作者： 蔡捷   
//			 主页 
//       文件： index.cshtml 页面文件 
//       文件： index.js JS文件
//------------------------------------------------------------------------------ 
*/
 
 //当前页面对象
var vd = {};
vd.model = null; 
vd.init = function () {
    
     };



$(function () {
  //  $$.init();
    $(vd.init); 
});

 
 
//------------------------------------------------------------------------------ 
//       时间： 2018-04-28
//       作者： 蔡捷   
//			   
//------------------------------------------------------------------------------  

 $(function () {
     Load_itemData(1);
 })

 function Load_itemData(id) {
     $("#detail_div_item").html("");
 	jsonObject={_t: com.settings.timestamp(),
 	    category_id: id
 	};
 	
com.ajax({

    type: 'POST', url: vd.model.urls["item_list"], data: jsonObject, success: function (result) {
            	
        var t = {};
        t.Table = result
            	   $("#template_item").tmpl(t)
                     .appendTo("#detail_div_item" );
                     
            }
    });
  }
