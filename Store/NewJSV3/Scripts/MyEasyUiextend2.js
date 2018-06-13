$.extend($.fn.datagrid.defaults.editors, {
	my97: {
		init: function(container, options) {
			var input = $('<input class="Wdate" type="text" onclick="WdatePicker({dateFmt:\'yyyy-MM-dd HH:mm:ss\',readOnly:true});"  />').appendTo(container);
			return input;
		},
		getValue: function(target) {
			return $(target).val();
		},
		setValue: function(target, value) {
			$(target).val(value);
		},
		resize: function(target, width) {
			var input = $(target);
			if($.boxModel == true) {
				input.width(width - (input.outerWidth() - input.width()));
			} else {
				input.width(width);
			}
		}
	}
});
$.extend($.fn.datagrid.methods, {
    addEditor : function(jq, param) {
        return jq.each(function(){
            if (param instanceof Array) {
                $.each(param, function(index, item) {
                    var e = $(jq).datagrid('getColumnOption', item.field);
                    e.editor = item.editor;
                });
            } else {
                var e = $(jq).datagrid('getColumnOption', param.field);
                e.editor = param.editor;
            }
        });
        
    },
    removeEditor : function(jq, param) {
        return jq.each(function(){
            if (param instanceof Array) {
                $.each(param, function(index, item) {
                    var e = $(jq).datagrid('getColumnOption', item);
                    e.editor = {};
                });
            } else {
                var e = $(jq).datagrid('getColumnOption', param);
                e.editor = {};
            }
        });
    }
});
$.extend($.fn.validatebox.defaults.rules, {
	mobile: {
		validator: function(value, param) {
			return /^((\(\d{2,3}\))|(\d{3}\-))?13\d{9}$/.test(value);
		},
		message: '手机号码不正确'
	}
});
var products = [
	{productid: 'FI-SW-01', name: '郑和墓'}, 
	{productid: 'K9-DL-01', name: '十三钗'}, 
	{productid: 'RP-SN-01', name: '夜秦淮'}, 
	{productid: 'RP-LI-02', name: '美猴王'}, 
	{productid: 'FL-DSH-01', name: '牛首山'}, 
	{productid: 'FL-DLH-02', name: '石塘竹'}, 
	{productid: 'AV-CB-01', name: '南唐陵'} 
];
var regions = [
	{id: 'NJ',name: '南京市',parentid: '-1',grade: "1"}, 
	{id: 'LYG',name: '连云港市',parentid: '-1',grade: "1"}, 
	{id: 'JNQ',name: '江宁区',parentid: 'NJ',grade: "2"}, 
	{id: 'XLQ', name: '仙林区', parentid: 'NJ', grade: "2"}, 
	{id: 'PKQ', name: '浦口区', parentid: 'NJ', grade: "2"}, 
	{id: 'GLQ', name: '鼓楼区', parentid: 'NJ', grade: "2"}, 
	{id: 'XWQ', name: '玄武区', parentid: 'NJ', grade: "2"}, 
	{id: 'JYQ', name: '建邺区', parentid: 'NJ', grade: "2"}, 
	{id: 'QHQ', name: '秦淮区', parentid: 'NJ', grade: "2"}, 
	{id: 'BXQ', name: '白下区', parentid: 'NJ', grade: "2"}, 
	{id: 'LHQ', name: '六合区', parentid: 'NJ', grade: "2"}, 
	{id: 'YHTQ', name: '雨花台区', parentid: 'NJ', grade: "2"}, 
	{id: 'QXQ', name: '栖霞区', parentid: 'NJ', grade: "2"}, 
	{id: 'GCQ', name: '高淳县', parentid: 'NJ', grade: "2"}, 
	{id: 'LSX', name: '溧水县', parentid: 'NJ', grade: "2"}, 
	{id: 'GYX', name: '灌云县', parentid: 'LYG', grade: "2"}, 
	{id: 'GNX', name: '灌南县', parentid: 'LYG', grade: "2"}, 
	{id: 'DHX', name: '东海县', parentid: 'LYG', grade: "2"}, 
	{id: 'XPQ', name: '新浦区', parentid: 'LYG', grade: "2"},
	{id: 'HZQ',name: '海州区',parentid: 'LYG',grade: "2"}
];
function initData(dataList, type) {
	var rtnArray = [];
	var obj;
	if(type == 'product') {
		obj = {
			productid: '',
			name: '----请选择----'
		};
	}
	if(type == 'region') {
		obj = {
			id: "",
			name: "----请选择----",
			grade: "0"
		};
	}
	rtnArray.push(obj);
	for(var i = 0; i < dataList.length; i++) {
		rtnArray.push(dataList[i]);
	}
	return rtnArray;
}

function getRegions(parentid) {
	var rtnArray = [];
	rtnArray.push({
		id: "",
		name: "----请选择----",
		grade: "0"
	});
	for(var i = 0; i < regions.length; i++) {
		if(regions[i].parentid == parentid) {
			rtnArray[rtnArray.length] = regions[i];
		}
	}
	return rtnArray;
}


function productFormatter(value) {
	for(var i = 0; i < products.length; i++) {
		if(products[i].productid == value) return products[i].name;
	}
	return value;
}

function regionFormatter(value) {
	for(var i = 0; i < regions.length; i++) {
		if(regions[i].id == value) return regions[i].name;
	}
	return value;
}

function statusFormatter(value) {
	if(value == 1) {
		return "<div style='font-weight:700;color:yellow;background-color:green;margin:0px;padding:0px;'>有效</div>";
	} else {
		return "<div style='font-weight:700;color:red;background-color:#CCCCCC;text-decoration:line-through'>无效</div>";
	}
}

function refreshCellsStyle(tr) {
	tr.each(function() {
		var tds = $(this).children('td');
		tds.each(function() {
			if($(this).attr("field") == "email") {
				var text = $(this).text();
				var cssObj = {
					"text-align": "left"
				};
				if(text == "caoguanghuicgh@163.com") {
					cssObj["color"] = "green";
					cssObj["font-weight"] = "700";
					cssObj["font-size"] = "16px";
				}
				if(text == "juqian19881022@163.com") {
					cssObj["color"] = "red";
					cssObj["font-weight"] = "700";
					cssObj["font-size"] = "16px";
				}
				$(this).children("div").css(cssObj);
			}
			if($(this).attr("field") == "listprice") {
				var text = $(this).text();
				if(text >= 100) {
					$(this).children("div").css({
						"background-color": "#CD0000",
						"text-align": "right",
						"font-weight": "700",
						"font-size": "16px"
					});
				} else if(text < 100 && text > 50) {
					$(this).children("div").css({
						"background-color": "#CD950C",
						"text-align": "center"
					});
				} else {
					$(this).children("div").css({
						"background-color": "#008B00",
						"text-align": "left"
					});
				}
			}
		});
	});
}
$(function() {
	function bindDateTime(rowIndex){
		var startTimeEditor = $('#tt').datagrid('getEditor',{index:rowIndex,field:"startTime"});
        var endTimeEditor = $('#tt').datagrid('getEditor',{index:rowIndex,field:"endTime"});
        if(startTimeEditor){
            startTimeEditor.target.attr("onclick","");
            startTimeEditor.target.unbind("click.myNameSpace").bind("click.myNameSpace",function(e){
                var initObj = {dateFmt:'yyyy-MM-dd',readOnly:true};
                if(endTimeEditor.target.val() != "") initObj["maxDate"] = endTimeEditor.target.val();
                WdatePicker(initObj);
            });
        }
        if(endTimeEditor){
            endTimeEditor.target.attr("onclick","");
            endTimeEditor.target.unbind("click.myNameSpace").bind("click.myNameSpace",function(e){
                var initObj = {dateFmt:'yyyy-MM-dd',readOnly:true};
                if(startTimeEditor.target.val() != "") initObj["minDate"] = startTimeEditor.target.val();
                WdatePicker(initObj);
            });	
        }
	};
	
	
	var i = 1;
	$('#tt').datagrid({
		toolbar: [{
			text: '增加',
			iconCls: 'icon-add',
			handler: function() {
				$('#tt').datagrid('appendRow', {
					itemid: ++i,
					city: "",
					county: "",
					productid: ""
				});
				var newEditIndex = $('#tt').datagrid('getRows').length - 1;
				$('#tt').datagrid('selectRow', newEditIndex);
				$('#tt').datagrid('beginEdit', newEditIndex);
				
				bindDateTime(newEditIndex);
			}
		}, '-',
		{
			text: '删除',
			iconCls: 'icon-remove',
			handler: function() {
				var row = $('#tt').datagrid('getSelected');
				if(row) {
					var index = $('#tt').datagrid('getRowIndex', row);
					$('#tt').datagrid('deleteRow', index);
				}
			}
		}, '-',
		{
			text: '提交',
			iconCls: 'icon-save',
			handler: function() {
				var allRows = $('#tt').datagrid('getRows');
				for(var j = 0; j < allRows.length; j++) {
					var rowIndex = $('#tt').datagrid('getRowIndex', allRows[j]);
					$('#tt').datagrid('endEdit', rowIndex);
				}
				var rows = $('#tt').datagrid('getChanges');
				if(rows.length > 0) {
					$.messager.progress({
						title: '请耐心等待',
						msg: ' '
					});
					var totalChange = 0;
					var successNum = 0;
					totalChange = rows.length;
					for(var i = 0; i < rows.length; i++) {
						var email = rows[i].email;
						$.ajax({
							type: 'get',
							url: '' + '064.json',
							dataType: "json",
							success: function(data) {
								successNum++;
								//alert(successNum);
								//alert(success==totalChange);
								if(successNum == totalChange) {
									$.messager.progress('close');

								} else {
									$('.messager-p-msg').text(rows[successNum].linkname + '----保存完成');
								}
							},
							error: function() {
								//
							}
						});
					};
					$('#tt').datagrid('acceptChanges');
					var originalRows = $('#tt').data('datagrid').originalRows;
				}
			}
		}, '-',
		{
			text: '回滚',
			iconCls: 'icon-undo',
			handler: function() {
				$('#tt').datagrid('rejectChanges');
			}
		}, '-',
		{
			text: '获取变更',
			iconCls: 'icon-search',
			handler: function() {
				var rows = $('#tt').datagrid('getChanges');
				alert('changed rows: ' + rows.length + ' lines');
			}
		}, '-',
		{
			text: '增加编辑器(编号字段)',
			iconCls: 'icon-add',
			handler: function() {
				$('#tt').datagrid('addEditor',{field:"itemid",editor:{type:"text"}});
			}
		}, '-',
		{
			text: '删除编辑器(城市字段)',
			iconCls: 'icon-remove',
			handler: function() {
				$('#tt').datagrid('removeEditor','city');
			}
		}],
		onBeforeLoad: function() {
			$(this).datagrid('rejectChanges');
		},
		onClickRow: function(rowIndex) {
			$(this).datagrid('beginEdit', rowIndex);
			bindDateTime(rowIndex);
		},
		onAfterEdit: function(rowIndex, rowData, chanages) {
			//刷新单元格样式
			var index = $(this).datagrid('getRowIndex', rowData);
			var panel = $(this).datagrid('getPanel');
			var tr = panel.find('div.datagrid-body tr[datagrid-row-index="' + index + '"]');
			refreshCellsStyle(tr);
		},
		onLoadSuccess: function(data) {
			var panel = $(this).datagrid('getPanel');
			var tr = panel.find('div.datagrid-body tr');
			refreshCellsStyle(tr);
			var trHead = panel.find('div.datagrid-header tr');
			trHead.each(function() {
				var tds = $(this).children('td');
				tds.each(function() {
					$(this).find('span,div').css({
						"font-size": "14px"
					});
					//$(this).find('div').css({"font-size":"14px"});
				});
			});
		}
	});
});