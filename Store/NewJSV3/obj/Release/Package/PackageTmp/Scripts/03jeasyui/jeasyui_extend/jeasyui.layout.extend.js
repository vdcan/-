/*
这个功能是对easyui方法的扩展。其主要是扩展了full和unFull两个。原理就是利用panel的maximeze方法和调整center的z-index使其最大化置顶。
使用方法：
$("").layout("full");
$("").layout("unFull");
*/
$.extend($.fn.layout.methods, {
    full: function (jq) {
        return jq.each(function () {
            var layout = $(this);
            var center = layout.layout('panel', 'center');
            center.panel('maximize');
            center.parent().css('z-index', 10);

            $(window).on('resize.full', function () {
                layout.layout('unFull').layout('resize');
            });
        });
    },
    unFull: function (jq) {
        return jq.each(function () {
            var center = $(this).layout('panel', 'center');
            center.parent().css('z-index', 'inherit');
            center.panel('restore');
            $(window).off('resize.full');
        });
    }
});