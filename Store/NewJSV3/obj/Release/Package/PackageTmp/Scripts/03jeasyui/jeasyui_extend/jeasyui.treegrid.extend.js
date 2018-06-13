/**
 * @author {yxz} treegrid扩展
 */
$.extend($.fn.treegrid.methods, {
    diyload: function (jq, param) {//扩展treegrid diyload treegrid查询功能 
        return jq.each(function () {
            var opts = $(this).treegrid("options");
            diyRequest(this, param);
        });
    }
});



function diyRequest(jq, param) {
    var opts = $.data(jq, "treegrid").options;
    if (param) {
        opts.queryParams = param;
    }
    if (!opts.url) {
        return;
    }
    var param = $.extend({}, opts.queryParams);
    if (opts.onBeforeLoad.call(jq, param) == false) {
        return;
    }
    setTimeout(function () {
        doRequest();
    }, 0);
    function doRequest() {
        $.ajax({
            type: opts.method,
            url: opts.url,
            data: param,
            dataType: "json",
            success: function (data) {
                $(jq).treegrid('loadData', data)
            },
            error: function () {
                if (opts.onLoadError) {
                    opts.onLoadError.apply(jq, arguments);
                }
            }
        });
    }
}