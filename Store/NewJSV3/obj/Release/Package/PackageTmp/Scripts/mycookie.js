 
function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function changeLanguage() {
    var v = $("#TPL_language").val();
   // $.cookie.raw = true;
   // $.cookie('language', v, { expires: 365, path: '/', domain: '.domain.com' });
    setCookie('language', v, 365);
    window.location.reload();
    //   console.log($.cookie('language'));
}
$(function () {
    for (i = 0; i < gLanguageList.length; i++) {
        $("#TPL_language").append(new Option(gLanguageList[i].text, gLanguageList[i].id));
        //$('#TPL_language').append($('<option>',
        //{
        //    value: gDictionary[i].id,
        //    text : gDictionary[i].text 

        //}));

    }
    //  $.cookie.raw = true;
    var v = getCookie("language")
    $("#TPL_language").val(v);//$.cookie('language', { path: '/', domain: '.domain.com' }));
  //  var r = $.cookie('language',{ path: '/'});
    console.log(v);

});