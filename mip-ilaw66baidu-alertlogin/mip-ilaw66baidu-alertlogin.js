/**
 * @file mip-ilaw66baidu-alertlogin 组件
 * @author
 */

define(function (require) {
    var $ = require('zepto');
    var customElement = require('customElement').create();

    /**
     * build说明: 登录组件，在首屏展示前，需要尽快加载
	 */

    customElement.prototype.firstInviewCallback = function () {
        var $el = $(this.element);
        var MIP = window.MIP;
        this.addEventAction('login', function (event) {
            console.log('授权成功');
            var sessid = event.sessionId;
            var islogin = parseInt(event.userInfo.isLogin, 10);

            if (!islogin) { // 未注册
                //              window.top.location.href = 'toLogin?channel=baidusearch';
                if (MIP.viewer.isIframed) {
                    MIP.viewer.sendMessage('loadiframe', {
                        title: '登录',
                        click: '',
                        url: 'https://www.ilaw66.com/jasmine/toLogin?channel=baidusearch'
                    });
                }
                else {
                    location.assign('https://www.ilaw66.com/jasmine/toLogin?channel=baidusearch');
                    // 					window.top.location.href = 'toLogin?channel=baidusearch';
                }
            }
            else {
                console.log('登录成功');
                $el.find('#sesiid').html(sessid);
                //              var thishostname = location.hostname;
                //              var name = 'mip-login-xzh:sessionId:https://' + thishostname + '/jasmine/baidusearch/authorize2';
                //              localStorage.setItem(name, sessid);
            }

        });
        this.addEventAction('error', function (event) {
            console.log('登录错误');
        });

    };

    return customElement;
});
