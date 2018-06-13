
 
		 exec sys_add_menu  'test22','test22','my_test','/dev/titan2'  ,' test '  


        go
 
 
 
/*
//------------------------------------------------------------------------------ 
//        Date  2018-05-29
//        Author  polltek.com   
//			  
//			@page_index  page number 
//			@page_size   rows per page  
//			@total_row   total rows  
//			@Sort 			 sort by  
//			@Desc  sort asc or desc
//------------------------------------------------------------------------------

*/


 CREATE  PROCEDURE [dbo].[usp_address_test_pager]
    @page_index INT = 0 ,-- page number 
    @page_size INT = 5 , -- rows per page 
    @total_row INT OUTPUT , --  total rows  
    @Sort VARCHAR(40) , --  sort by 
    @Desc VARCHAR(10) -- sort asc or desc
    	 AS
    BEGIN 
        DECLARE @start_index INT 
        --EasyUI  page number from 1 start index, add one  
				set @page_index = @page_index -1
        SET @start_index = @page_size * @page_index
        DECLARE @table TABLE
            (
              new_index INT IDENTITY(1, 1) NOT NULL ,
id int--id
) 
	
        SELECT  @total_row = COUNT(*)
        FROM    [address] WITH ( NOLOCK ) 
        	       
        INSERT  INTO @table
                ( id
		        )
                SELECT TOP ( @start_index + @page_size )
                       id 
                FROM    [address] WITH ( NOLOCK ) 
                	         
                ORDER BY 
                									CASE WHEN @Sort = 'add_on' AND @Desc = 'desc' THEN [add_on] END DESC , CASE WHEN @Sort = 'add_on' AND @Desc = 'asc' THEN [add_on] END ASC ,
									CASE WHEN @Sort = 'address' AND @Desc = 'desc' THEN [address] END DESC , CASE WHEN @Sort = 'address' AND @Desc = 'asc' THEN [address] END ASC ,
									CASE WHEN @Sort = 'address_type' AND @Desc = 'desc' THEN [address_type] END DESC , CASE WHEN @Sort = 'address_type' AND @Desc = 'asc' THEN [address_type] END ASC ,
									CASE WHEN @Sort = 'cell' AND @Desc = 'desc' THEN [cell] END DESC , CASE WHEN @Sort = 'cell' AND @Desc = 'asc' THEN [cell] END ASC ,
									CASE WHEN @Sort = 'city' AND @Desc = 'desc' THEN [city] END DESC , CASE WHEN @Sort = 'city' AND @Desc = 'asc' THEN [city] END ASC ,
									CASE WHEN @Sort = 'email' AND @Desc = 'desc' THEN [email] END DESC , CASE WHEN @Sort = 'email' AND @Desc = 'asc' THEN [email] END ASC ,
									CASE WHEN @Sort = 'id' AND @Desc = 'desc' THEN [id] END DESC , CASE WHEN @Sort = 'id' AND @Desc = 'asc' THEN [id] END ASC ,
									CASE WHEN @Sort = 'name' AND @Desc = 'desc' THEN [name] END DESC , CASE WHEN @Sort = 'name' AND @Desc = 'asc' THEN [name] END ASC ,
									CASE WHEN @Sort = 'postal_code' AND @Desc = 'desc' THEN [postal_code] END DESC , CASE WHEN @Sort = 'postal_code' AND @Desc = 'asc' THEN [postal_code] END ASC ,
									CASE WHEN @Sort = 'province' AND @Desc = 'desc' THEN [province] END DESC , CASE WHEN @Sort = 'province' AND @Desc = 'asc' THEN [province] END ASC ,
									CASE WHEN @Sort = 'user_id' AND @Desc = 'desc' THEN [user_id] END DESC , CASE WHEN @Sort = 'user_id' AND @Desc = 'asc' THEN [user_id] END ASC ,
            
                        CASE WHEN @Sort = ' '  THEN id
                        END desc  
		
        DELETE  @table
        WHERE   new_index <= @start_index
         
        SELECT  c.*
        FROM    [address] c WITH ( NOLOCK ) 
                JOIN @table o ON c.id = o.id
        ORDER BY o.new_index 
    
    END 
    



    
  go
     
       
   exec sys_add_proc_old @menu_code = 'test22', @action_name = 'address_test_pager', @button_name='refresh', @proc_name = 'usp_address_test_pager', @action_type='pager',@comments=' get data list address() paging list '
   
	


        go

        go
