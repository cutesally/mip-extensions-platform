/**
* @file: mip-jjyy-pop.js
*
* @author:
* @date:
*/
define(function (require) {
    'use strict';
    // mip 组件开发支持 zepto
    var $ = require('zepto');
    var customElement = require('customElement').create();
    var fixedElement = require('fixed-element');
    var util = require('util');
    var Gesture = util.Gesture;
    var scrollTop = {
        body: 0,
        documentElement: 0,
        offset: 0
    };

    /**
     * render
     *
     */
    function render() {
        customElement.prototype.firstInviewCallback = function () {
            var self = this;
            self.open = false;
            self.id = this.element.id;
            self.scroll = this.element.hasAttribute('content-scroll');
            // 盒子ID
            var divId = this.element.getAttribute('divId');
            // 姓名Id
            var popContact = this.element.getAttribute('popContact');
            // 联系方式ID
            var popTel = this.element.getAttribute('popTel');
            // 留言内容id
            var popInfo = this.element.getAttribute('popInfo');
            // 提交按钮Id
            var popButton = this.element.getAttribute('popButton');
            var projectId = this.element.getAttribute('projectId');
            var popId = this.element.getAttribute('id');
            //  获取当前宽高比例
            var popWidth = this.element.getAttribute('Dwidth');
            // 获取当前的属性值
            var projectIdValue = '';
            // 获取联系方式的属性值
            var popTelValue = '';
            // 获取姓名的属性值
            var popContactValue = '';
            // 获取留言内容的属性值
            var popInfoValue = '';
            // bottom 不能为0，不然会覆盖遮盖曾，导致无法关闭lightbox
            var Ptop = 0;
            if ($(window).width() >= 640) {
                Ptop = 150;
            }
            else
            {
                Ptop = (($(window).height() - $(window).width() * popWidth) / 2);
            }
            util.css(self.element, {
                'position': 'fixed',
                'z-index': 10001,
                'top': Ptop,
                'right': 0,
                'left': 0,
                'transition': 'opacity 0.1s ease-in'
            });
            changeParentNode.call(self);
            // 事件注册
            self.addEventAction('close', function (event) {
                close.call(self, event);
            });
            self.addEventAction('open', function (event) {
                open.call(self, event);
            });
            self.addEventAction('toggle', function (event) {
                toggle.call(self, event);
            });
            // $('#' + popButton + '').click(function () {
            var popIdObject = $(this.element).find('#' + popId + '');
            var popTelObject = $(this.element).find('#' + popTel + '');
            var popInfoObject = null;
            var popContactObject = null;
            if (popInfo !== '') {
                popInfoObject = $(this.element).find('#' + popInfo + '');
            }
            if (popContact !== '') {
                popContactObject = $(this.element).find('#' + popContact + '');
            }
            $(this.element).find('#' + popButton + '').on('click', function (e) {
                var tval = popTelObject.text();
                var add = true;
                var reTel = /^1\d{10}$/;
                var reg = /^0\d{2,3}-\d{7,8}(-\d{1,6})?$/;
                // 判断名字是否为空
                if (popContact !== '') {
                    if ($.trim(popContactObject.text()) === '') {
                        // $('#' + popContact + '').attr('placeholder', '请输入你的姓名');
                        // $('#' + popContact + '').css('border-color', '#FF0000');
                        popContactObject.attr('placeholder', '请输入你的姓名');
                        popContactObject.css('border-color', '#FF0000');
                        alert('请输入你的姓名');
                        return;
                    }
                    else {
                        popContactObject.css('border-color', '#d2d2d2');
                        popContactValue = $.trim(popContactObject.text());
                    }
                }
                // 判断联系方式是否为空
                if ($.trim(tval) === '') {
                    popTelObject.css('border-color', '#FF0000');
                    popTelObject.attr('placeholder', '请输入你的手机号码');
                    alert('请输入你的手机号码');
                    return;
                }
                else if (reTel.test(tval) === false && reg.test(tval) === false) {
                    popTelObject.css('border-color', '#FF0000');
                    popTelObject.text('');
                    popTelObject.attr('placeholder', '输入的联系方式不正确');
                    alert('输入的联系方式不正确');
                    return;
                }
                else {
                    popTelObject.css('border-color', '#d2d2d2');
                    popTelValue = $.trim(tval);
                }
                if (popInfo !== '') {
                    popInfoValue = $.trim(popInfoObject.text());
                }
                var loginReqbody = {
                    'ProjectID': projectId,
                    'Tel': popTelValue,
                    'Message': popInfoValue,
                    'Name': popContactValue,
                    'MessageSource': 'MIP-POP001',
                    'URL': window.location.href,
                    'URLTitle': document.title
                };
                // 获取数据
                $.ajax({
                    url: 'https://mip.jjyy.cn/mipguestbook.jspx',
                    type: 'POST',
                    async: true,
                    // data: JSON.stringify(loginReqbody),
                    data: loginReqbody,
                    error: function () {
                        alert('留言失败');
                    },
                    success: function (data, status) {
                        if (status = '0' && data !== '') {
                            alert('我们会马上贺你电话取得联系！');
                            popTelObject.text('');
                            popIdObject.toggle();
                            $('.MIP-jjyy-pop-MASK').css('display', 'none');
                            // $('.MIP-jjyy-pop-MASK').style.display = 'none';
                            document.documentElement.classList.remove('mip-no-scroll');
                            self.open = false;
                        } else {
                            alert('留言失败');
                        }
                    }
                });
            });
        };
    }
        // 自动关闭弹层
    function autoClose() {
            var self = this;
            var count = self.element.getAttribute('autoclosetime');
            var seconds = self.element.querySelector('.mip-jjyy-pop-seconds');
            // 判断是否有 autoclose 和 seconds
            if (Number(count) && seconds) {
                // 取出用户自定义的 time 值
                var time = Math.abs(Math.ceil(count));
                // 倒计时
                seconds.innerHTML = time;
                this.interval = setInterval(function () {
                    time -= 1;
                    seconds.innerHTML = time;
                    if (time <= 0) {
                        close.call(self);
                    }
                }, 1000);
            }
        }
    function changeParentNode() {
            var self = this;
            var nodes = [];
            var index = 0;
            var CHILDRENS = self.element.childNodes;

            for (index = 0; index < CHILDRENS.length; index++) {
                if (CHILDRENS[index].nodeType === 1) {
                    nodes.push(CHILDRENS[index]);
                }
            }

            self.container = document.createElement('div');
            self.applyFillContent(self.container);
            self.element.appendChild(self.container);

            for (index = 0; index < nodes.length; index++) {
                self.container.appendChild(nodes[index]);
            }
        }

        /**
        * [toggle description]
        *
        * @param  {Object} event [事件对象]
        */
    function toggle(event) {
            isOpen.call(this) ? close.call(this, event) : open.call(this, event);
        }

        /**
        * [open 打开 sidebar]
        *
        * @param  {Object} event [事件对象]
        */
    function open(event) {
            var self = this;
            if (self.open) {
                return;
            }
            fixedElement.hideFixedLayer(fixedElement._fixedLayer);
            event.preventDefault();
            if (!self.scroll) {
                new Gesture(self.element, {
                    preventY: true
                });
            }
            self.open = true;
            util.css(self.element, {display: 'block'});
            // 保存页面当前滚动状态，因为设置overflow:hidden后页面会滚动到顶部
            scrollTop.body = document.body.scrollTop;
            scrollTop.documentElement = document.documentElement.scrollTop;
            scrollTop.offset = window.pageYOffset;
            document.documentElement.classList.add('mip-no-scroll');
            openMask.call(self);
            autoClose.call(self);
        }

        /**
        * [close 关闭 sidebar]
        *
        * @param  {Object} event [事件对象]
        */
    function close(event) {
            var self = this;
            if (!self.open) {
                return;
            }
            fixedElement.showFixedLayer(fixedElement._fixedLayer);
            if (event) {
                event.preventDefault();
            }
            self.open = false;
            closeMask.call(self);
            util.css(self.element, {display: 'none'});
            document.documentElement.classList.remove('mip-no-scroll');
            // 恢复页面滚动状态到lightbox打开之前
            if (typeof (document.body.scrollTo) === 'function') {
            // 先判断存在，因为safari浏览器没有document.body.scrollTo方法
                document.body.scrollTo(0, scrollTop.body);
            }
            if (typeof (document.documentElement.scrollTo) === 'function') {
            // 先判断存在，因为safari浏览器没有document.documentElement.scrollTo方法
                document.documentElement.scrollTo(0, scrollTop.documentElement);
            }
            window.scrollTo(0, scrollTop.offset);
        }

        /**
        * [isOpen description]
        *
        * @return {boolean} [是否打开标志]
        */
    function isOpen() {
            return this.open;
        }

        /**
         * [openMask 打开浮层]
         */
    function openMask() {
            var self = this;
            // 不存在遮盖层时先创建
            if (!self.maskElement) {
                var mask = document.createElement('div');
                mask.id = 'MIP-jjyy-pop-MASK';
                mask.className = 'MIP-jjyy-pop-MASK';
                mask.setAttribute('on', 'tap:' + self.id + '.close');
                mask.style.display = 'block';

                // 与mip-jjyy-pop 同级dom
                self.element.parentNode.appendChild(mask);
                if (!self.scroll) {
                    mask.addEventListener('touchmove', function (evt) {
                        evt.preventDefault();
                    }, false);
                }
                self.maskElement = mask;
            }

            // 样式设置
            util.css(self.maskElement, {display: 'block'});
        }

        /**
         * [closeMask 关闭遮盖层]
         *
        */
    function closeMask() {
            if (this.maskElement) {
                util.css(this.maskElement, {display: 'none'});
                clearInterval(this.interval);
            }
        }

        /**
         * 初始化
         *
         */
    customElement.prototype.build = render;
    customElement.prototype.detachedCallback = function () {
        clearInterval(this.interval);
        document.documentElement.classList.remove('mip-no-scroll');
    };
    return customElement;
});
