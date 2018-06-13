
/*
//------------------------------------------------------------------------------ 
//       时间： 2018-05-01
//       作者： 蔡捷 (2634691810@qq.com)   
//			 products 
//       文件： products.cshtml 页面文件 
//       文件： products.js JS文件
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
//       时间： 2018-05-01
//       作者： 蔡捷 (2634691810@qq.com)   
//			   
//------------------------------------------------------------------------------  

 $(function () {
     Load_categoryData();
 })

 function Load_categoryData(){
 	jsonObject={_t: com.settings.timestamp(),
					};
 	
com.ajax({

            type: 'POST', url: vd.model.urls["category_list"], data: jsonObject, success: function (result) { 
            	
        var t = {};
        t.Table = result
            	   $("#template_category").tmpl(t)
                     .appendTo("#detail_div_category" );
                     
            }
    });
  }
