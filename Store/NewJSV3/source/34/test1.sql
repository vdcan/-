
 
		 exec sys_add_menu_web  'test1','Test page','','/home'  ,' For testing '  


        go
 
 
 
/*
//------------------------------------------------------------------------------ 
//        Date  2018-06-06
//        Author  Jerry cai   
//			  
//        data table MyCategory column 
//------------------------------------------------------------------------------

*/


 CREATE  PROCEDURE [dbo].[usp_MyCategory_list] 
  	AS
    BEGIN 
          select 
           [active_flag]
,[add_by]
,[add_date]
,[category_description]
,[category_name]
,[delete_flag]
,[sort_number]
From  [category]
        
    	       
        
    
    END 
    





    
  go
     
       
   exec sys_add_proc_old @menu_code = 'test1', @action_name = 'MyCategory_list', @button_name='refresh', @proc_name = 'usp_MyCategory_list', @action_type='listdta',@comments=' get data list category() column '
   
	 


        go

        go
