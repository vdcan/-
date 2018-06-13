var wrapper = {};

//首页设置对象
wrapper.settings = {
    homeTabTitle: gDictionary["my_desk"],
    homeTabUrl: '/Home/Portal',
    navigation: $('#hd_navigation').val(),
    maxTabCount: 10
};
 
      


wrapper.model = null;
wrapper.maintabs = $('#tabs');

//初始化
wrapper.init = function () {
    wrapper.checklogin();

    //每间隔10秒 检测登录信息
    setInterval(function () {
        $('#span_checklogin').html( gDictionary["checking_login_status"]  );
        wrapper.checklogin();
    }, 10000);

    //加载当前用户拥有权限的模块菜单数据
    //com.ajax({ type: 'GET', url: '/Home/UserMenu' + com.settings.ajax_timestamp(), showLoading: false, success: wrapper.initMenu });
    wrapper.initMenu(wrapper.model.UserMenus);

    //设置信息
    wrapper.settings.navigation = $('#hd_navigation').val();
    $("#div-password-edit").dialog_page({}).dialog('close');
    $('.loginOut').click(wrapper.logout);
    $('.changepwd').click(wrapper.changePassword);
    // $('.myconfig').click(wrapper.mysettings);
    $('.myself').click(wrapper.myself);


    //初始化jnotify组件显示
    $('#notity').jnotifyInizialize({ oneAtTime: true, appendType: 'append' }).css({ 'position': 'absolute', '*top': '5px', 'left': '30%', 'right': '30%', 'margin': '5px 0px 0px 0px', '*margin': '0px 0px 0px 0px', 'word-wrap': 'break-word', 'width': 'auto', 'height': 'auto', 'z-index': '99999', 'border-radius': '5px' });
    //初始化Tab标签选项卡标题右键事件处理
    $('#closeMenu').menu({ onClick: wrapper.rightMenuClick });
    //初始化main_panel中的tabs
    wrapper.maintabs.tabs({
        border: false,
        onContextMenu: wrapper.tabContextMenu
    });

    //添加我的桌面tab页 【使用jeasyui.tabs.extend.js扩展】
    wrapper.addIframeTab(wrapper.settings.homeTabTitle, 'portal', wrapper.settings.homeTabUrl, 'icon-hamburg-home', false);

    //初始化Tab标签选项卡双击关闭tab事件 【使用jeasyui.tabs.extend.js扩展】
    //wrapper.maintabs.tabs('bindDblclick', function (index, title) {
    //    if (title != wrapper.settings.homeTabTitle)
    //        wrapper.maintabs.tabs('close', title);
    //});
};

//检测登录状态
wrapper.checklogin = function () {
    com.ajax({
        type: 'GET', url: '/Login/CheckLogin' + com.settings.ajax_timestamp(), showLoading: false, success: function (result) {
            if (result.s == false) {
                com.alert(gDictionary["timeout"] );
                window.location.href = '/Login';
            } else {
                $('#span_checklogin').html('[ok]');
            }
        }
    });
}

//初始化配置对象
wrapper.initSettings = function (settings) {
    wrapper.settings = $.extend(wrapper.settings, settings);
};
wrapper.ShowMask = function (settings) {
    $('<div class="window-mask" id="mask1" style="display: block; z-index: 9003; width:4000px; height: 4008px;"></div>').appendTo("body");
    // $("<div class=\"datagrid-mask\"></div>").css({ display: "block", width: "100%", height: $(window).height() }).appendTo("body");
};
wrapper.HideMask = function (settings) {
    $("#mask1").remove();
};

//新增tab选项卡页面 【使用jeasyui.tabs.extend.js扩展】
/*
参数说明：title:tab标题   menu_code：自定义值(这里用来存储菜单代码) icon：图标  closable：是否显示关闭按钮
*/
wrapper.addIframeTab = function (title, menu_code, url, icon, closable) {
    if (!closable) closable = false;//默认值是false，不显示关闭按钮
    if (!menu_code) menu_code = '';
    console.log(menu_code);
    wrapper.maintabs.tabs('addIframeTab', {
        //tab参数为一对象，其属性同于原生add方法参数
        opts_ext: {
            title: title, menu_code: menu_code, closable: closable, icon: icon,
            tools: [{
                iconCls: 'icon-mini-refresh',
                handler: function (e) {
                    var temp_title = $(e.target).parent().parent().text();
                    wrapper.maintabs.tabs('updateIframeTab', { 'which': temp_title });
                }
            }]
        }, 
        /*iframe参数用于设置iframe信息，包含属性有：
        src：iframe地址
        frameBorder：iframe边框,，默认值为0
        delay：淡入淡出效果时间
        height：iframe高度，默认值为100%
        width：iframe宽度，默认值为100%
        */
        iframe: { src: url, delay: 10, message: gDictionary["loading"] }
    });
    wrapper.maintabs.tabs('addEventParam');
}

//初始化权限菜单
wrapper.initMenu = function (menuData) {
    if (!menuData || !menuData.length) {
        $.messager.alert(  gDictionary["message"]  , "<font color=red><b>" + gDictionary["noright"] + "</b></font>", "warning", function () {
            // location.href = '/login';
            wrapper.logout();
        });
        return;
    }

    //.data() 方法允许我们安全地将任何类型的数据附加到DOM元素上而不用担心循环引用和内存泄露之类的问题
    //$('body').data('menulist', menuData);

    //将菜单数据转换成treedata格式。
    //var visibleMenu = $.grep(menuData, function (row) { return row.Enabled; });
    var menus = utils.toTreeData(menuData, 'id', 'parent_id', 'children');

    //根据当前用户菜单风格配置，来初始化不同的菜单风格
    switch (wrapper.settings.navigation) {
        case "tree"://树状菜单，使用zTree初始化
            wrapper.menuTree(menus);
            //wrapper.menuButton(menus);
            break;
        case "menubutton":
            wrapper.menuButton(menus);
            break;
        case "accordion"://手风琴菜单，子菜单使用树状呈现
            wrapper.menuAccordion(menus);
            //wrapper.huadong(menus);
            // wrapper.huadong(menus);
            break;
        default:
            wrapper.menuAccordion(menus);
            break;
    }
    //wrapper.initLocationHash(menuData);
};

wrapper.initLocationHash = function (data) {
    var subUrl = location.hash.replace('#!', '');
    $.each(data, function () {
        var s = this.Url.replace('.aspx', '');
        if (this.Url && this.Url != '#' && (subUrl == s || subUrl.indexOf(s + "/") > -1))
            wrapper.addTab(this.menu_name, this.menu_code, subUrl, this.icon_class);
    });
};

//tabContextMenu事件
wrapper.tabContextMenu = function (e, title) {
    $('#closeMenu').menu('show', { left: e.pageX, top: e.pageY });
    wrapper.maintabs.tabs('select', title);
    e.preventDefault();
};

wrapper.changePassword = function () {
    $("#div-password-edit").dialog_page({
        title: gDictionary["changepassword"]  , iconCls: 'icon-standard-key', resizable: true, maximizable: true, inline: true, width: 400, height: 200, top: 200,
        onClickButton: function (self) { //保存操作
            var confirmPassword = $("#confirmpassword").val();
            var newPassword = $("#newpassword").val();
            if (newPassword == "") { return com.message('warning', gDictionary["passwordnull"]   ); return; }
            if (confirmPassword == "") { return com.message('warning', gDictionary["cpasswordnull"]  ); return; }
            if (confirmPassword != confirmPassword) { return com.message('warning', gDictionary["cpasswordfailed"]   ); return; }

            var jsonParam = JSON.stringify({ pwd: newPassword });
            com.ajax({
                type: 'POST', url: '/sys/sysbase/ResetPasswrod', data: jsonParam, success: function (result) {
                    if (result.s) {
                        com.message('s', result.message);
                        self.dialog('close');
                    } else {
                        com.message('e', result.message);
                    }
                }
            });// end ajax  
        }
    });// end $("#div-password-edit").dialog_page
};

//wrapper.mysettings = function () {
//    wrapper.addTab("个性化设置", '', "/Sys/Config/?menu_code=" + token, "icon-standard-cog");
//};

wrapper.myself = function () {
    wrapper.addTab(   gDictionary["user_info"]  , '', "/sys/sysbase/?menucode=" + guser_info, "icon-standard-cog");
};
wrapper.logout = function () {
    $.messager.confirm( gDictionary["messgae"] ,   '<b style="color:red">'+ gDictionary["sure_logout"] +' </b>', function (r) {
        if (r) location.href = '/Login/LogOff' + com.settings.ajax_timestamp();
    });
};

//全屏事件
wrapper.setFullScreen = function (target) {
    var that = $(target);
    if (that.find('.icon-standard-arrow-out').length) {
        that.find('.icon-standard-arrow-out').removeClass('icon-standard-arrow-out').addClass('icon-standard-arrow-in');
        $('#homebody').layout('panel', 'north').panel('close');
        $('#homebody').layout('panel', 'south').panel('close');
        $('#homebody').layout('panel', 'west').panel('close');
        $('#homebody').layout('resize');
    } else if ($(target).find('.icon-standard-arrow-in').length) {
        that.find('.icon-standard-arrow-in').removeClass('icon-standard-arrow-in').addClass('icon-standard-arrow-out');
        $('#homebody').layout('panel', 'north').panel('open');
        $('#homebody').layout('panel', 'south').panel('open');
        $('#homebody').layout('panel', 'west').panel('open');
        $('#homebody').layout('resize');
    }
};

//在新页面打开选项卡
wrapper.jumpOpen = function () {
    var currentTab = wrapper.maintabs.tabs('getSelected');
    var currtab_title = currentTab.panel('options').title;
    if (currtab_title == wrapper.settings.homeTabTitle) {
        com.message('w', gDictionary["can not open"] );
        return;
    }
    var url = wrapper.maintabs.tabs('getIframeTabUrl', { 'which': currtab_title });
    if (url) {
        window.open(url, "_blank");
    } else {
        var msgText = "\"" + opts.title + "\" " + gDictionary["can not open"] ;
        $.messager.show({ title:   gDictionary["message"], msg: msgText, showType: 'show' });
    }
}

//Tab标签选项卡最右侧菜单按钮点击事件
wrapper.rightMenuClick = function (item) {
    var $tab = wrapper.maintabs;
    var currentTab = $tab.tabs('getSelected');
    var titles = wrapper.getTabTitles($tab);

    switch (item.id) {
        case "refresh":
            var currtab_title = currentTab.panel('options').title;
            $tab.tabs('updateIframeTab', { 'which': currtab_title });
            break;
        case "close":
            var currtab_title = currentTab.panel('options').title;
            $tab.tabs('close', currtab_title);
            break;
        case "closeall":
            $.each(titles, function () {
                if (this != wrapper.settings.homeTabTitle)
                    $tab.tabs('close', this);
            });
            break;
        case "closeother":
            var currtab_title = currentTab.panel('options').title;
            $.each(titles, function () {
                if (this != currtab_title && this != wrapper.settings.homeTabTitle)
                    $tab.tabs('close', this);
            });
            break;
        //case "closeright":
        //    var tabIndex = $tab.tabs('getTabIndex', currentTab);
        //    if (tabIndex == titles.length - 1) {
        //        alert('亲，后边没有啦 ^@^!!');
        //        return false;
        //    }
        //    $.each(titles, function (i) {
        //        if (i > tabIndex && this != wrapper.settings.homeTabTitle)
        //            $tab.tabs('close', this);
        //    });

        //    break;
        //case "closeleft":
        //    var tabIndex = $tab.tabs('getTabIndex', currentTab);
        //    if (tabIndex == 1) {
        //        alert('亲，前边那个上头有人，咱惹不起哦。 ^@^!!');
        //        return false;
        //    }
        //    $.each(titles, function (i) {
        //        if (i < tabIndex && this != wrapper.settings.homeTabTitle)
        //            $tab.tabs('close', this);
        //    });
        //    break;
        case "exit":
            $('#closeMenu').menu('hide');
            break;
    }

};



//刷新当前打开的Tab标签选项卡
wrapper.tabRefresh = function () {
    var currentTab = wrapper.maintabs.tabs('getSelected');
    var currtab_title = currentTab.panel('options').title;
    wrapper.maintabs.tabs('updateIframeTab', { 'which': currtab_title });
};
//关闭当前打开的Tab标签选项卡
wrapper.tabClose = function () { wrapper.rightMenuClick({ id: 'close' }); };
//关闭所有Tab标签选项卡close_all
wrapper.tabCloseAll = function () { com.message('c',  gDictionary["close_all"]  , function (ok) { if (ok) { wrapper.rightMenuClick({ id: 'closeall' }); } }); };

//创建iframe页面
wrapper.createFrame = function (url) {
    return '<iframe scrolling="no" frameborder="0" style="width:100%;height:100%; padding:0;" src="' + url + '" ></iframe>';
}

//打开Tab标签页面
wrapper.openTabHandler = function ($tab, hasTab, subtitle, menu_code, url, icon) {
    if (!hasTab) {
        console.log(menu_code);
        console.log(url);
        if (url.indexOf("?menucode=") >= 0)
            wrapper.addIframeTab(subtitle, menu_code, url  , icon, true);//使用tabs扩展方法新增tab
            else
        wrapper.addIframeTab(subtitle, menu_code, url + "?menucode=" + menu_code, icon, true);//使用tabs扩展方法新增tab
    } else {
        $tab.tabs('select', subtitle); //选中Tab页面
        //$tab.tabs('updateIframeTab', { 'which': subtitle });//选择TAB时刷新页面
    }
    //$('#homebody').layout('collapse', 'west');
};

wrapper.getTabTitles = function ($tab) {
    var titles = [];
    var tabs = $tab.tabs('tabs');
    $.each(tabs, function () { titles.push($(this).panel('options').title); });
    return titles;
};

//新增Tab标签页面
wrapper.addTab = function (subtitle, menu_code, url, icon) {
    if (!url || url == '#') return false;
    console.log(menu_code);
    var $tab = wrapper.maintabs;
    var tabCount = $tab.tabs('tabs').length;
    var hasTab = $tab.tabs('exists', subtitle);
    if ((tabCount <= wrapper.settings.maxTabCount) || hasTab)
        wrapper.openTabHandler($tab, hasTab, subtitle, menu_code, url, icon);
    else
        com.message("confirm", '<b style="color:red">' + gDictionary["opened_too_much"] + '</b>', function (b) {
            if (b)
                wrapper.openTabHandler($tab, hasTab, subtitle, menu_code, url, icon);//键盘男 15:44 2016-05-14
        });
};


//新增Tab标签页面
wrapper.addTabNew = function (subtitle, menu_code, url, icon) {
    if (!url || url == '#') return false;
    var $tab = wrapper.maintabs;
    var tabCount = $tab.tabs('tabs').length;
    var hasTab = $tab.tabs('exists', subtitle);
    if (hasTab) {
        $tab.tabs('close', subtitle);
        hasTab = false;
    }
    if ((tabCount <= wrapper.settings.maxTabCount) || hasTab)
        wrapper.openTabHandler($tab, hasTab, subtitle, menu_code, url, icon);
    else
        com.message("confirm", '<b style="color:red">' + gDictionary["opened_too_much"] + '</b>', function (b) {
            if (b)
                wrapper.openTabHandler($tab, hasTab, subtitle, menu_code, url, icon);//键盘男 15:44 2016-05-14
        });
};

//导航菜单样式：生成Accordion样式的导航菜单，里面是树状菜单
wrapper.menuAccordion = function (menus) {
    var wnav = $('#wnav');
    wnav.accordion({ animate: true, fit: true, border: false });
    $.each(menus, function (i, item) {
        var c_id = 'tree_' + item.menu_code
        wnav.accordion('add', {
            title: item.menu_name,
            content: '<ul id="' + c_id + '"></ul>',
            iconCls: 'icon ' + item.icon_class,
            border: false
        });
        //$.parser.parse(); //其中$.parser.parse(); 是再次加载Easyui
        var ztree = $('#' + c_id).addClass("ztree");
        var settings = {
            data: { key: { name: "menu_name", url: "javascript:void(0);" } }, callback: {
                onClick: function (event, treeId, node) { wrapper.addTab(node.menu_name, node.menu_token, node.url, node.icon_class); }
            }
        }
        if (typeof (item.children) != "undefined") {
            if (item.children.length > 0) item.open = true;
            $.fn.zTree.init(ztree, settings, item.children);
        }
    });//end $.each
};

//导航菜单样式：生成ZTree样式的导航菜单
wrapper.menuTree = function (menus) {
    var settings = {
        data: { key: { name: "menu_name", url: "javascript:void(0);" } }, callback: {
            onClick: function (event, treeId, node) { wrapper.addTab(node.menu_name, node.menu_token, node.url, node.icon_class); }
        }
    };
    var ztree = $('#wnav').addClass("ztree");
    if (menus.length > 0) menus[0].open = true;
    $.fn.zTree.init(ztree, settings, menus);
};

//导航菜单样式：生成横向下拉样式的导航菜单
wrapper.menuButtonChild = function (s, n) {
    var str = '';
    $.each(n.children, function (j, o) {
        if (o.children) {
            str += '<div>';
            str += '<span iconCls="' + o.icon_class + '" menucode="' + o.menu_code + '">' + o.menu_name + '</span><div style="width:120px;">';
            str = wrapper.menuButtonChild(str, o);
            str += '</div></div>';
        } else
            str += '<div iconCls="' + o.icon_class + '" url="' + o.url + '"  menucode="' + o.menu_code + '">' + o.menu_name + '</div>';
    });
    return s + str;
}
wrapper.menuButton = function (menus) {
    var menulist = "";
    var childMenu = '';
    //遍历一级菜单
    $.each(menus, function (i, n) {
        menulist += utils.formatString('<a href="javascript:void(0)" id="mb{0}" class="easyui-menubutton" menu="#mm{0}" iconCls="{1}">{2}</a>',
            (i + 1), n.icon_class, n.menu_name);

        if ((n.children || []).length > 0) {
            childMenu += '<div id="mm' + (i + 1) + '" style="min-width:120px;">';
            childMenu += wrapper.menuButtonChild('', n);//针对每一个一级菜单 再进行递归遍历所有子菜单
            childMenu += '</div>';
        }
    });
    //将生成的menubutton html字符串添加到导航元素wnav中
    $('#wnav').append(menulist).append(childMenu);
    //初始化menubutton按钮事件
    var mb = $('#wnav .easyui-menubutton').menubutton();
    $.each(mb, function (i, n) {
        $($(n).menubutton('options').menu).menu({
            onClick: function (item) {
                var tabTitle = item.text;
                var menu_code = $(item.target).attr("menucode");// item.menu_code; edit by yxz 10:27 2016-04-05
                var url = $(item.target).attr("url");// item.url;edit by yxz 10:27 2016-04-05
                var icon = item.iconCls;
                wrapper.addTab(tabTitle, menu_code, url, icon);
                return false;
            }
        });
    });
};







//动态加载导航菜单
var _html = "";
var index = 0;
wrapper.huadong = function (menus) {
    var sum = [];
    var sub_sum = [];
    $("#wnav").append($('<ul id="nav"></ul>'));
    $.each(menus, function (i) {

        var row = menus[i];
        index++;
        _html += '<li class="item">';
        _html += '    <a href="javascript:void(0);" class="main-nav">';
        _html += '        <div class="main-nav-icon"><i class="fa"><img src=" ' + row.icon + '"></i></div>';
        _html += '        <div class="main-nav-text">' + row.menu_name + '</div>';
        _html += '        <span class="arrow"></span>';
        _html += '    </a>';
        _html += getsubnav(row);
        // console.log(_html);
        _html += '</li>';
        $("#nav").html(_html);

    });


    $(".sub-nav>.sub_item").each(function () {

        $(this).click(function () {
            var index = $(".sub-nav>.sub_item").index($(this));
            wrapper.addTab(sum[index][0], sum[index][1], sum[index][2], sum[index][3])

        })
    })
    $(".sub-child .sub_item").each(function (e) {

        $(this).click(function (e) {
            e.stopPropagation();//阻止事件冒泡 
            var index = $(".sub-child>ul>.sub_item").index($(this));
            wrapper.addTab(sub_sum[index][0], sub_sum[index][1], sub_sum[index][2], sub_sum[index][3])

        })
    })
    $("#nav li.item").hover(function (e) {
        var $sub = $(this).find('.sub-nav-wrap');
        var length = $sub.find('.sub-nav').find('li').length;
        if (length > 0) {
            $(this).addClass('on');
            $sub.show();
            var sub_top = $sub.offset().top + $sub.height();
            var body_height = $(window).height();
            if (sub_top > body_height) {
                $sub.css('bottom', '0px');
            }
        }
    }, function (e) {
        $(this).removeClass('on');
        $(this).find('.sub-nav-wrap').hide();
    });
    $("#nav li.sub").hover(function (e) {
        var $ul = $(this).find('ul');
        $ul.show();
        var top = $(this).find('ul').offset().top;
        var height = $ul.height();
        var wheight = $(window).height();
        if (top + height > wheight) {
            $ul.css('top', parseInt('-' + (height - 11))).css('left', '130px')
        } else {
            $ul.css('top', '0px').css('left', '130px');
        }
    }, function (e) {
        $(this).find('ul').hide();
        $(this).find('ul').css('top', '0px');
    });

    //二级导航
    function getsubnav(row) {

        if (row.children == undefined)
            return "";
        var _html = '<div class="sub-nav-wrap">';
        _html += '<ul class="sub-nav">';
        $.each(row.children, function (i) {
            var rows = row.children[i]
          //  console.log(rows);
            if (rows.children == undefined) {
                _html += '<li class="sub_item"><a><img src="' + rows.icon + '" /><i class="fa "></i>' + rows.menu_name + '</a></li>';

            } else {
                _html += '<li class="sub_item sub"><a> <img src="' + rows.icon + '" /> <i class="fa ' + rows.icon + '"></i>' + rows.menu_name + '</a>';
                _html += getchildnav(rows.children);
                _html += '</li>'; //sub
            }
            sum.push([rows.menu_name, rows.menu_token, rows.url, rows.icon_class])

        });
        _html += '</ul>';
        _html += '</div>';
        return _html;
    }
    //导航三菜单
    function getchildnav(subChildRows) {
        if (subChildRows.children == undefined)
            return "";
        var _html = '<div class="sub-child"><ul>';
        $.each(subChildRows, function (i) {
            var rows = subChildRows[i];

            _html += '<li class="sub_item"><a><img src="' + rows.icon + '" /><i class="fa ' + rows.icon + '"></i>' + rows.menu_name + '</a></li>';
            sub_sum.push([rows.menu_name, rows.menu_token, rows.url, rows.icon_class])

        });
        _html += '</ul></div>';
        return _html;
    }

}

