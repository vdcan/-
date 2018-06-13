/** 
* 扩展tree getCheckedExt 获得选中节点+实心节点 getSolidExt 获取实心节点 
*/
$.extend($.fn.tree.methods, {
    getCheckedExt: function (jq) {
        var checked = [];
        var checkbox2 = $(jq).find("span.tree-checkbox1,span.tree-checkbox2").parent();
        $.each(checkbox2, function () {
            var thisData = {
                target: this,
                "checked": true
            };
            var node = $.extend({}, $.data(this, "tree-node"), thisData);
            checked.push(node);
        });
        return checked;
    },
    getSolidExt: function (jq) {
        var checked = [];
        var checkbox2 = $(jq).find("span.tree-checkbox2").parent();
        $.each(checkbox2, function () {
            var node = $.extend({}, $.data(this, "tree-node"), {
                target: this
            });
            checked.push(node);
        });
        return checked;
    }
});

/*
easyui Tree一直就没有提供这个方法,以前没有用到,所以一直没怎么在意,这次自己用到了,顺便扩展了一个方法,分享给大家.
用法:
var node = $().tree("getSelected");
var lv =  $().tree("getLevel",node.target);

*/
$.extend($.fn.tree.methods, {
    getLevel: function (jq, target) {
        var l = $(target).parentsUntil("ul.tree", "ul");
        return l.length + 1;
    }
});
/*
Easyui tree扩展tree方法获取一级子节点
*/
$.extend($.fn.tree.methods, {
    getLeafChildren: function (jq, params) {
        var nodes = [];
        $(params).next().children().children("div.tree-node").each(function () {
            nodes.push($(jq[0]).tree('getNode', this));
        });
        return nodes;
    }
});

/*
在tree的实现了有或获取选中getSelected方法和带单选的getChecked和uncheck。但是却少了一个unSelect方法。
其实这个方法很好扩展。扩展代码如下：
使用方法：
var node = $("#tt1").tree("getSelected");
$("#tt1").tree("unSelect",node.target);
*/
$.extend($.fn.tree.methods, {
    unSelect: function (jq, target) {
        return jq.each(function () {
            $(target).removeClass("tree-node-selected");
        });
    }
});