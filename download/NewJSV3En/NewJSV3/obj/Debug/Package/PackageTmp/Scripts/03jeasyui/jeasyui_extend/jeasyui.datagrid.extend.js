/** 
 * 扩展 datagrid/treegrid 增加表头菜单，用于显示或隐藏列，注意：冻结列不在此菜单中 
 *  
 * @param e 
 * @param field 
 */
var createGridHeaderContextMenu = function (e, field) {
    e.preventDefault();
    var grid = $(this);/* grid本身 */
    var headerContextMenu = this.headerContextMenu;/* grid上的列头菜单对象 */
    if (!headerContextMenu) {
        var tmenu = $('<div style="width:150px;"></div>').appendTo('body');
        var fields = grid.datagrid('getColumnFields');
        for (var i = 0; i < fields.length; i++) {
            var fildOption = grid.datagrid('getColumnOption', fields[i]);
            if (!fildOption.hidden) {
                $('<div iconCls="icon-ok" field="' + fields[i] + '"/>').html(fildOption.title).appendTo(tmenu);
            } else {
                $('<div iconCls="icon-empty" field="' + fields[i] + '"/>').html(fildOption.title).appendTo(tmenu);
            }
        }
        headerContextMenu = this.headerContextMenu = tmenu.menu({
            onClick: function (item) {
                var field = $(item.target).attr('field');
                if (item.iconCls == 'icon-ok') {
                    grid.datagrid('hideColumn', field);
                    $(this).menu('setIcon', {
                        target: item.target,
                        iconCls: 'icon-empty'
                    });
                } else {
                    grid.datagrid('showColumn', field);
                    $(this).menu('setIcon', {
                        target: item.target,
                        iconCls: 'icon-ok'
                    });
                }
            }
        });
    }
    headerContextMenu.menu('show', {
        left: e.pageX,
        top: e.pageY
    });
};
$.fn.datagrid.defaults.onHeaderContextMenu = createGridHeaderContextMenu;
$.fn.treegrid.defaults.onHeaderContextMenu = createGridHeaderContextMenu;

/*
datagrid返回记录为0时显示“没有记录”，此问题的解决方案是扩展默认view视图。如下：
使用方法：
使用datagrid myview”和一个可选的属性(emptyMsg)。
$('#dg').datagrid({
  view: myview,
  emptyMsg: 'no records found'
});
*/
var km_datagrid_view = $.extend({}, $.fn.datagrid.defaults.view, {
    onAfterRender: function (target) {
        $.fn.datagrid.defaults.view.onAfterRender.call(this, target);
        var opts = $(target).datagrid('options');
        var vc = $(target).datagrid('getPanel').children('div.datagrid-view');
        vc.children('div.datagrid-empty').remove();
        if (!$(target).datagrid('getRows').length) {
            var d = $('<div class="datagrid-empty"></div>').html(opts.emptyMsg || 'no records').appendTo(vc);
            d.css({
                position: 'absolute',
                left: 0,
                top: 50,
                width: '100%',
                textAlign: 'center'
            });
        }
    }
});

/**
 * Datagrid扩展方法tooltip 基于Easyui 1.3.3，可用于Easyui1.3.3+
 * 简单实现，如需高级功能，可以自由修改
 * 使用说明:
 *   在easyui.min.js之后导入本js
 *   代码案例:
 *		$("#dg").datagrid({....}).datagrid('tooltip'); 所有列
 *		$("#dg").datagrid({....}).datagrid('tooltip',['productid','listprice']); 指定列
 * @author ____′↘夏悸
 */
$.extend($.fn.datagrid.methods, {
    tooltip: function (jq, fields) {
        return jq.each(function () {
            var panel = $(this).datagrid('getPanel');
            if (fields && typeof fields == 'object' && fields.sort) {
                $.each(fields, function () {
                    var field = this;
                    bindEvent($('.datagrid-body td[field=' + field + '] .datagrid-cell', panel));
                });
            } else {
                bindEvent($(".datagrid-body .datagrid-cell", panel));
            }
        });

        function bindEvent(jqs) {
            jqs.mouseover(function () {
                var content = $(this).text();
                $(this).tooltip({
                    content: content,
                    trackMouse: true,
                    onHide: function () {
                        $(this).tooltip('destroy');
                    }
                }).tooltip('show');
            });
        }
    },
    addEditor: function (jq, param) {
        return jq.each(function () {
            if (param instanceof Array) {
                $.each(param, function (index, item) {
                    var e = $(jq).datagrid('getColumnOption', item.field);
                    e.editor = item.editor;
                });
            } else {
                var e = $(jq).datagrid('getColumnOption', param.field);
                e.editor = param.editor;
            }
        });

    },
    removeEditor: function (jq, param) {
        return jq.each(function () {
            if (param instanceof Array) {
                $.each(param, function (index, item) {
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


/*
Datagrid扩展，动态设置列标题的的扩展方法
分类：扩展 发表于 2013-05-04 07:46 , 已有6387次阅读
使用方式：
$("#dt").datagrid("setColumnTitle",{field:'productid',text:'newTitle'});
*/
$.extend($.fn.datagrid.methods, {
    setColumnTitle: function (jq, option) {
        if (option.field) {
            return jq.each(function () {
                var $panel = $(this).datagrid("getPanel");
                var $field = $('td[field=' + option.field + ']', $panel);
                if ($field.length) {
                    var $span = $("span", $field).eq(0);
                    $span.html(option.text);
                }
            });
        }
        return jq;
    }
});

  

/** 
 * 扩展datagrid editor 增加带复选框的下拉树/增加日期时间组件/增加多选combobox组件 
 */
$.extend($.fn.datagrid.defaults.editors, {
    combocheckboxtree: {
        init: function (container, options) {
            var editor = $('<input />').appendTo(container);
            options.multiple = true;
            editor.combotree(options);
            return editor;
        },
        destroy: function (target) {
            $(target).combotree('destroy');
        },
        getValue: function (target) {
            return $(target).combotree('getValues').join(',');
        },
        setValue: function (target, value) {
            $(target).combotree('setValues', sy.getList(value));
        },
        resize: function (target, width) {
            $(target).combotree('resize', width);
        }
    },
    datetimebox: {
        init: function (container, options) {
            var editor = $('<input />').appendTo(container);
            editor.datetimebox(options);
            return editor;
        },
        destroy: function (target) {
            $(target).datetimebox('destroy');
        },
        getValue: function (target) {
            return $(target).datetimebox('getValue');
        },
        setValue: function (target, value) {
            $(target).datetimebox('setValue', value);
        },
        resize: function (target, width) {
            $(target).datetimebox('resize', width);
        }
    },
    multiplecombobox: {
        init: function (container, options) {
            var editor = $('<input />').appendTo(container);
            options.multiple = true;
            editor.combobox(options);
            return editor;
        },
        destroy: function (target) {
            $(target).combobox('destroy');
        },
        getValue: function (target) {
            return $(target).combobox('getValues').join(',');
        },
        setValue: function (target, value) {
            $(target).combobox('setValues', sy.getList(value));
        },
        resize: function (target, width) {
            $(target).combobox('resize', width);
        }
    }
});


/** 
 * 相同连续列合并扩展 
 */
$.extend($.fn.datagrid.methods, {
    autoMergeCells: function (jq, fields) {
        return jq.each(function () {
            var target = $(this);
            if (!fields) {
                fields = target.datagrid("getColumnFields");
            }
            var rows = target.datagrid("getRows");
            var i = 0, j = 0, temp = {};
            for (i; i < rows.length; i++) {
                var row = rows[i];
                j = 0;
                for (j; j < fields.length; j++) {
                    var field = fields[j];
                    var tf = temp[field];
                    if (!tf) {
                        tf = temp[field] = {};
                        tf[row[field]] = [i];
                    } else {
                        var tfv = tf[row[field]];
                        if (tfv) {
                            tfv.push(i);
                        } else {
                            tfv = tf[row[field]] = [i];
                        }
                    }
                }
            }
            $.each(temp, function (field, colunm) {
                $.each(colunm, function () {
                    var group = this;
                    if (group.length > 1) {
                        var before, after, megerIndex = group[0];
                        for (var i = 0; i < group.length; i++) {
                            before = group[i];
                            after = group[i + 1];
                            if (after && (after - before) == 1) {
                                continue;
                            }
                            var rowspan = before - megerIndex + 1;
                            if (rowspan > 1) {
                                target.datagrid('mergeCells', {
                                    index: megerIndex,
                                    field: field,
                                    rowspan: rowspan
                                });
                            }
                            if (after && (after - before) != 1) {
                                megerIndex = after;
                            }
                        }
                    }
                });
            });
        });
    }
});

/*
扩展easyui datagrid的两个方法.动态添加和删除toolbar的项(适用于1.3.0之后的版本)
使用：
$('#tt').datagrid("addToolbarItem",[{"text":"xxx"},"-",{"text":"xxxsss","iconCls":"icon-ok"}])
$('#tt').datagrid("removeToolbarItem","GetChanges")//根据btn的text删除
$('#tt').datagrid("removeToolbarItem",0)//根据下标删除

*/
$.extend($.fn.datagrid.methods, {
    addToolbarItem: function (jq, items) {
        return jq.each(function () {
            var dpanel = $(this).datagrid('getPanel');
            var toolbar = dpanel.children("div.datagrid-toolbar");
            if (!toolbar.length) {
                toolbar = $("<div class=\"datagrid-toolbar\"><table cellspacing=\"0\" cellpadding=\"0\"><tr></tr></table></div>").prependTo(dpanel);
                $(this).datagrid('resize');
            }
            var tr = toolbar.find("tr");
            for (var i = 0; i < items.length; i++) {
                var btn = items[i];
                if (btn == "-") {
                    $("<td><div class=\"datagrid-btn-separator\"></div></td>").appendTo(tr);
                } else {
                    var td = $("<td></td>").appendTo(tr);
                    var b = $("<a href=\"javascript:void(0)\"></a>").appendTo(td);
                    b[0].onclick = eval(btn.handler || function () { });
                    b.linkbutton($.extend({}, btn, {
                        plain: true
                    }));
                }
            }
        });
    },
    removeToolbarItem: function (jq, param) {
        return jq.each(function () {
            var dpanel = $(this).datagrid('getPanel');
            var toolbar = dpanel.children("div.datagrid-toolbar");
            var cbtn = null;
            if (typeof param == "number") {
                cbtn = toolbar.find("td").eq(param).find('span.l-btn-text');
            } else if (typeof param == "string") {
                cbtn = toolbar.find("span.l-btn-text:contains('" + param + "')");
            }
            if (cbtn && cbtn.length > 0) {
                cbtn.closest('td').remove();
                cbtn = null;
            }
        });
    }
});

/*
easyui datagrid 键盘上下控制选中行
使用方法：
在datagrid实例化之后调用这个方法。
$("#id").datagrid({}).datagrid("keyCtr");
 
*/
$.extend($.fn.datagrid.methods, {
    keyCtr: function (jq) {
        return jq.each(function () {
            var grid = $(this);
            grid.datagrid('getPanel').panel('panel').attr('tabindex', 1).bind('keydown', function (e) {
                switch (e.keyCode) {
                    case 38: // up
                        var selected = grid.datagrid('getSelected');
                        if (selected) {
                            var index = grid.datagrid('getRowIndex', selected);
                            grid.datagrid('selectRow', index - 1);
                        } else {
                            var rows = grid.datagrid('getRows');
                            grid.datagrid('selectRow', rows.length - 1);
                        }
                        break;
                    case 40: // down
                        var selected = grid.datagrid('getSelected');
                        if (selected) {
                            var index = grid.datagrid('getRowIndex', selected);
                            grid.datagrid('selectRow', index + 1);
                        } else {
                            grid.datagrid('selectRow', 0);
                        }
                        break;
                }
            });
        });
    }
});


/*
easyui datagrid editors扩展之combogrid
使用：
$('#dg').datagrid({
	columns:[[
		{field:'productid',name:'ProductId',width:100,
			editor:{
				type:'combogrid',
				options:{
					panelWidth:450,
					idField:'code',
					textField:'name',
					url:'datagrid_data.json',
					columns:[[
						{field:'code',title:'Code',width:60},
						{field:'name',title:'Name',width:100},
						{field:'addr',title:'Address',width:120},
						{field:'col4',title:'Col41',width:100}
					]]
				}
			}
		}
	]]
});
*/
$.extend($.fn.datagrid.defaults.editors, {
    combogrid: {
        init: function (container, options) {
            var input = $('<input type="text" class="datagrid-editable-input">').appendTo(container);
            input.combogrid(options);
            return input;
        },
        destroy: function (target) {
            $(target).combogrid('destroy');
        },
        getValue: function (target) {
            return $(target).combogrid('getValue');
        },
        setValue: function (target, value) {
            $(target).combogrid('setValue', value);
        },
        resize: function (target, width) {
            $(target).combogrid('resize', width);
        }
    }
});