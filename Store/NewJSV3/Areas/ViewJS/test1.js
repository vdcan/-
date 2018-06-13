
/*
//------------------------------------------------------------------------------ 
//        Date  2018-05-29
//        Author  polltek.com   
//			 For testing 
//        File  test1.cshtml  Page file  
//        File  test1.js JS
//------------------------------------------------------------------------------ 
*/
 
 // Current page object 
var km = {};
km.model = null; 
km.init = function () {
    
     };



$(function () { 
    $(km.init); 
});

 
 
//------------------------------------------------------------------------------ 
//        Date  2018-05-29
//        Author  polltek.com   
//			   
//------------------------------------------------------------------------------  

 $(function () {
     Load_MyCategoryData();
 })

 function Load_MyCategoryData(){
 	jsonObject={_t: com.settings.timestamp(),
					};
 	
com.ajax({

            type: 'POST', url: km.model.urls["MyCategory_list"], data: jsonObject, success: function (result) { 
            	
        var t = {};
        t.Table = result
            	   $("#template_MyCategory").tmpl(t)
                     .appendTo("#detail_div_MyCategory" );
                     
            }
    });
  }

