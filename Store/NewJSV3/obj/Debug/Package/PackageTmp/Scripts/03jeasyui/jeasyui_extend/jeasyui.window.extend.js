
/*
Easyui 窗口抖动的扩展
function shake() {
    //$('#window').window("shake", {extent:1,interval:100});
    $('#window').window("shake");
}
*/
$.extend($.fn.window.methods, {
    shake: function (jq, params) {
        return jq.each(function () {
            var extent = params && params['extent'] ? params['extent'] : 1;
            var interval = params && params['interval'] ? params['interval'] : 13;
            var style = $(this).closest('div.window')[0].style;
            if ($(this).data("window").shadow) {
                var shadowStyle = $(this).data("window").shadow[0].style;
            }
            _p = [4 * extent, 6 * extent, 8 * extent, 6 * extent, 4 * extent, 0, -4 * extent, -6 * extent, -8 * extent, -6 * extent, -4 * extent, 0],
            _fx = function () {
                style.marginLeft = _p.shift() + 'px';
                if (shadowStyle) shadowStyle.marginTop = 0;

                if (_p.length <= 0) {
                    style.marginLeft = 0;
                    if (shadowStyle) shadowStyle.marginLeft = 0;

                    clearInterval(_timerId);
                    _timerId = null, _p = null, _fx = null;
                };
            };
            _p = _p.concat(_p.concat(_p));
            _timerId = setInterval(_fx, interval);
        });
    }
});

