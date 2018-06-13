/*
扩展easyui dialog的两个方法.动态添加和删除toolbar的项(适用于1.3.0之后的版本)
*/
$.extend($.fn.dialog.methods, {
    addToolbarItem: function (jq, items) {
        return jq.each(function () {
            var dpanel = $(this);
            var toolbar = dpanel.children("div.dialog-toolbar");
            if (!toolbar.length) {
                toolbar = $("<div class=\"dialog-toolbar\"><table cellspacing=\"0\" cellpadding=\"0\"><tr></tr></table></div>").prependTo(dpanel);
                $(this).dialog('resize');
            }
            var tr = toolbar.find("tr");
            for (var i = 0; i < items.length; i++) {
                var btn = items[i];
                if (btn == "-") {
                    $("<td><div class=\"dialog-tool-separator\"></div></td>").appendTo(tr);
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
            var dpanel = $(this);
            var toolbar = dpanel.children("div.dialog-toolbar");
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
easyui dialog 扩展load 
使用：
 $('#dlg').dialog('showMask', 'Loading...');  // display the loading message
 $('#dlg').dialog('hideMask');  // hide the loading message
*/
$.extend($.fn.panel.methods, {
    showMask: function (jq, msg) {
        return jq.each(function () {
            var pal = $(this).panel('panel');
            if (pal.css('position').toLowerCase() != 'absolute') {
                pal.css('position', 'relative');
            }
            var borderSize = parseInt(pal.css('padding')) + 1;
            var m = pal.children('div.panel-mask');
            if (!m.length) {
                m = $('<div class="panel-mask"></div>').appendTo(pal);
            }
            m.css({
                background: '#fff',
                left: borderSize,
                top: (borderSize + pal.children('.panel-header')._outerHeight()),
                right: borderSize,
                bottom: borderSize
            });
            m.children('div.panel-mask-msg').remove();
            var mm = $('<div class="panel-mask-msg"></div>').appendTo(m);
            mm.html(msg).css({ position: 'absolute' }).css({
                position: 'absolute',
                top: '50%',
                left: '50%',
                marginTop: -mm._outerHeight() / 2,
                marginLeft: -mm._outerWidth() / 2
            })
        });
    },
    hideMask: function (jq) {
        return jq.each(function () {
            $(this).panel('panel').children('div.panel-mask').remove();
        })
    }
});





