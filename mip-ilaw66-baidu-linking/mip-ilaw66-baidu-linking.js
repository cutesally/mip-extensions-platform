/**
 * @file mip-ilaw66-baidu-linking 组件
 * @author
 */

define(function (require) {
    var $ = require('zepto');
    //  var templates = require('templates');
    var customElement = require('customElement').create();

    /**
     * 备注：部分地方存在全局选择因为部分地方规则限定
     */
    customElement.prototype.firstInviewCallback = function () {
        var $el = $(this.element);
        var countTimeInSec = 0;
        var dateTime = new Date();
        var begin = dateTime.getHours();
        var min = dateTime.getMinutes();
        var sec = dateTime.getSeconds();
        var fromRoute = getQueryString('fromRoute');
        var lawyerId = getQueryString('lawyerId');
        var tel = getQueryString('tel');
        var timerRequestId = getQueryString('requestId');
        var timerQuestionType = getQueryString('questionType');
        var flag = 0;
        var isback = true;
        $el.find('#requestId').val(timerRequestId);
        $el.find('#questionType').val(timerQuestionType);
        //      var thishostname = location.hostname;
        //      var name = 'mip-login-xzh:sessionId:https://' + thishostname + '/jasmine/baidusearch/authorize2';
        //      var sessionId = localStorage.getItem(name);
        var sessionId = getQueryString('sessionId');
        var MIP = window.MIP;
        setTimeout(function () {
            sessionId = $el.find('#sesiid').html();
            console.log(sessionId);
        }, 1000);
        var hosturl = 'https://www.ilaw66.com/jasmine/';
        function returhostname() {
            var hostweb = location.protocol;
            var hostname = location.hostname;
            console.log(hostname);
            if (hostname === 'www-ilaw66-com.mipcdn.com' || hostname === 'www.ilaw66.com') {
                hosturl = 'https://www.ilaw66.com/jasmine/';
            }
            else if (hostname === 'localhost') {
                var hostport = location.port;
                hosturl = 'http://' + hostname + ':' + hostport + '/jasmine/';
            }
            else if (hostname === 'test-ilaw66-com.mipcdn.com') {
                hosturl = 'https://test.ilaw66.com/jasmine/';
            }
            else {
                hosturl = 'https://' + hostname + '/jasmine/';
            }
        }
        returhostname();
        console.log(hosturl);
        function locahost(topsurl, toptitle) {
            if (topsurl === './') {
                topsurl = 'baidusearch';
            }

            var topurl = hosturl + topsurl;
            if (MIP.viewer.isIframed) {
                MIP.viewer.sendMessage('loadiframe', {
                    title: toptitle,
                    click: '',
                    url: topurl
                });
            }
            else {
                location.assign(topurl);
            }
        }
        var t1 = setInterval(function () {
            fnDate();
        }, 1000);

        if (tel) {
            // 加载的时候显示号码
            $('title').text('等待接通');
            $el.find('.div_header').text('等待接通');
            $el.find('.link_phone span').html(tel);
        }
        else {
            backToUnusual();
        }

        $el.find('.outOfUnusual').show();
        $el.find('.inOfUnusual').hide();
        getInfo(); // 加载头像等

        $el.find('.glyphicon').click(function () {
            backLinkingOr();
        });
        $el.find('.js-gotoPay').click(function () { // 点击去支付按钮
            // 调用接口判断合并支付，传递requestId
            checkTalking(timerRequestId, timerQuestionType);
        });

        $el.find('.end_unusual').click(function () { // 通话异常按钮事件
            // window._hmt && window._hmt.push(['_trackEvent', "telUnusual", 'click']);
            $el.find('.pop_unusual').show();
        });
        $el.find('.unusual_wrapper').click(function () { // 点击遮罩层事件
            $el.find('.pop_unusual').hide();
        });
        $el.find('.type_dropline, .type_nocall, .type_disconnect').click(function () {
            $el.find('.pop_unusual').hide();
            $el.find('.toast_txt').text('感谢反馈，我们会尽快改进服务');
            $el.find('.toast_div').show();
            setTimeout(function () {
                $el.find('.toast_div').hide();
                //              window.top.location.href = './';
                locahost('./', '电话咨询');
            }, 2000);
        });
        $el.find('.type_cancell').click(function () { // 取消
            $el.find('.pop_unusual').hide();
        });

        function getInfo() {
            $.ajax({
                type: 'GET',
                url: hosturl + 'timer?id=' + timerRequestId + '&lawyerId=' + lawyerId + '&sessionId=' + sessionId,
                dataType: 'json',
                success: function (data) {
                    if (!data || data.status === 'ERROR') {
                        alert(data.status);
                        return;
                    }

                    timerRequestId = data.requestId;
                    // 未上传头像则选择默认头像
                    if (!data.avatar) {
                        if (data.sex === 'male') {
                            $el.find('.link_avatar').attr('src', 'images/bg_touxaingnan.png');
                            $el.find('.end_avatar').attr('src', 'images/bg_touxaingnan.png');
                            sessionStorage.setItem('matchAvatar', 'images/bg_touxaingnan.png');
                        }
                        else if (data.sex === 'female') {
                            $el.find('.link_avatar').attr('src', 'images/bg_touxiangnv.png');
                            $el.find('.end_avatar').attr('src', 'images/bg_touxiangnv.png');
                            sessionStorage.setItem('matchAvatar', 'images/bg_touxiangnv.png');
                        }
                    }
                    else {
                        $el.find('.link_avatar').attr('src', data.avatar);
                        $el.find('.end_avatar').attr('src', data.avatar);
                        sessionStorage.setItem('matchAvatar', data.avatar);
                    }
                    var temp = {
                        avatar: data.avatar,
                        lawyerName: data.lawyerName,
                        lawyerField: data.lawyerField,
                        serviceTimes: data.serviceTimes,
                        lightStar: data.lightStar,
                        grayStar: data.grayStar,
                        authorizedNo: data.authorizedNo
                    };
                    $el.find('.linking_avatar').attr('src', temp.avatar);
                    $el.find('.linking_lawyerName').text(temp.lawyerName);
                    var questionType = $el.find('#questionType').val();
                    var tp = getType(questionType);
                    if (tp && temp.lawyerField.indexOf(tp) >= 0) {
                        $el.find('.linking_lawyerField').text(tp);
                    }
                    else {
                        $el.find('.linking_lawyerFieldTxt').hide();
                        $el.find('.linking_lawyerField').hide();
                    }
                    if (!temp.serviceTimes || temp.serviceTimes === 0) {
                        $el.find('.linking_serviceTimesTxt').hide();
                        $el.find('.linking_serviceTimes').hide();
                    }
                    else {
                        $el.find('.linking_serviceTimes').text(temp.serviceTimes + '次');
                    }

                    if (temp.authorizedNo) {
                        $el.find('.linkingconntent_lawyerid').text('律师执业证号：' + temp.authorizedNo);
                    }
                    else {
                        $el.find('.linkingconntent_lawyerid').hide();
                    }
                    var starHtml = '';
                    starHtml += '<span class="star_blockindex">';
                    temp.lightStar.forEach(function () {
                        starHtml += '<mip-img src="./images/icon_star_c_c.png"></mip-img>';
                    });
                    temp.grayStar.forEach(function () {
                        starHtml += '<mip-img src="./images/icon_star.png"></mip-img>';
                    });
                    starHtml += ' ' + temp.lightStar.length + '.0';
                    starHtml += '<input type="hidden" class="common_arg" name="score" value="'
                        + temp.lightStar.length + '" readonly="readonly"/>';
                    starHtml += '</span>';
                    $el.find('.linking_star').html(starHtml);
                },
                error: function (jqXHR) {
                    if (jqXHR.status === 403) {
                        window.location.reload();
                    }

                }
            });
        }
        function getQueryString(name) {
            var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
            var r = window.location.search.substr(1).match(reg);
            if (r != null) {
                return unescape(r[2]);
            }

            return null;
        }
        function fnDate() {
            var date = new Date();
            countTimeInSec = (date.getHours() - begin) * 3600
                + (date.getMinutes() - min) * 60 + (date.getSeconds() - sec);
            getPhoneStatus();
        }
        function startConsulting(questionType) {
            $.ajax({
                url: hosturl + 'greeting?questionType='
                    + questionType + '&_csrf='
                    + $el.find('#_csrf').val() + '&sessionId=' + sessionId + '&channel=baidusearch',
                type: 'POST',
                success: function (indexmessage) {
                    var requesturl = 'mipilaw66baidu'
                        + '_request?data=' + indexmessage + '&questionType=' + questionType
                        + '&sessionId=' + sessionId;
                    locahost(requesturl, '匹配律师');
                },
                error: function () {
                    //                  window.location.reload();
                }
            });
        }
        function getPhoneStatus() {
            var questionType = $el.find('#questionType').val();
            var askingType = $el.find('#askingType').val();

            if (countTimeInSec % 5 === 0) {
                $.ajax({
                    type: 'GET',
                    url: hosturl + 'timer?id=' + timerRequestId + '&lawyerId=' + lawyerId + '&sessionId=' + sessionId,
                    dataType: 'json',
                    success: function (data) {
                        //                      console.log(data);
                        localStorage.setItem('reAskAvatar', data.avatar);
                        localStorage.setItem('reAskSex', data.sex);
                        localStorage.setItem('reAskName', data.lawyerName);
                        localStorage.setItem('lawyerField', data.lawyerField);
                        localStorage.setItem('goodCommentRate', data.goodCommentRate);
                        var dataStatus = data.status;
                        timerRequestId = data.requestId;
                        // 重新显示后台返回的呼叫中心号码，防止是因律师未接电话又下了一个单，然后调用的不同的呼叫中心
                        $el.find('.link_phone span').html(data.tel);
                        if (dataStatus === 3 || dataStatus === 4 || dataStatus === 7) {
                            // 弹出律师未接提示
                            clearInterval(t1);
                            var title = '';
                            var main = '抱歉，' + data.lawyerName + '临时有事，无法为您服务系统可以为您推荐其他律师';
                            var yes = '退出本页';
                            var no = '推荐其他律师';
                            $el.find('.backOr_div .back__popLayer span:nth-of-type(1)').text(title);
                            $el.find('.backOr_div .back__popLayer span:nth-of-type(2)').text(main);
                            $el.find('.backOr_div .back__popLayer .back-leave').text(yes);
                            $el.find('.backOr_div .back__popLayer .back-continue').text(no);
                            $el.find('.backOr_div').show();
                            $el.find('.backOr_div .back__popLayer .back-leave').click(function () {
                                $el.find('.backOr_div').hide();
                                gobackHandle();
                            });
                            $el.find('.backOr_div .back__popLayer .back-continue').click(function () {
                                $el.find('.backOr_div').hide();
                                //                              var  = 'baidusearch/authorize?questionType='
                                //                                  + questionType + '&urlstring=mipilaw66baidu_request&sessionId=' + sessionId;
                                //                                  locahost('./', '电话咨询');
                                startConsulting(questionType);

                            });
                        }
                        else {
                            if (dataStatus === 8 || dataStatus === 6 || dataStatus === 10 || dataStatus === 13) {
                                clearInterval(t1);
                                settime();
                            }
                            else if (dataStatus === 5) {
                                if (flag === 0) {
                                    flag = 1;
                                    clearInterval(t1);
                                    setTimeout(function () {
                                        settime();
                                    }, 20000);
                                    isback = false;
                                }
                            }
                        }
                    },
                    error: function (jqXHR) {
                        if (jqXHR.status === 403) {
                            window.location.reload();
                        }

                    }

                });
            }
        }
        function backLinkingOr() {
            var title = '';
            var main = '';
            var yes = '离开本页';
            var no = '';
            if ($el.find('#pop_consulationEnd').css('display') !== 'none') {
                main = '请支付律师辛苦费，若不支付费用则无法再次咨询律师';
                no = '我知道了';
                popBackOrMsg(title, main, yes, no, 0);
            }
            else {
                main = '律师正在联系你，若不想咨询，可接通后礼貌告知律师，1分钟内结束咨询不计费。';
                no = '礼貌等待';
                $.ajax({
                    type: 'GET',
                    url: hosturl + 'timer?id=' + timerRequestId + '&lawyerId=' + lawyerId + '&sessionId=' + sessionId,
                    dataType: 'json',
                    success: function (data) {
                        if (!data || data.status === 'ERROR') {
                            alert(data.status);
                            return;
                        }

                        var dataStatus = data.status;
                        if (dataStatus === 8) { // 无需付费
                            gobackHandle();
                        }
                        else if (dataStatus === 6) { // >=60
                            backToUnusual();
                        }
                        else {
                            popBackOrMsg(title, main, yes, no, dataStatus);
                        }

                    },
                    error: function (jqXHR) {
                        if (jqXHR.status === 403) {
                            window.location.reload();
                        }

                    }
                });
            }
        }
        function popBackOrMsg(title, main, yes, no, status) {
            $el.find('.backOr_div .back__popLayer span:nth-of-type(1)').text(title);
            $el.find('.backOr_div .back__popLayer span:nth-of-type(2)').text(main);
            $el.find('.backOr_div .back__popLayer .back-leave').text(yes);
            $el.find('.backOr_div .back__popLayer .back-continue').text(no);
            $el.find('.backOr_div').show();
            $el.find('.backOr_div .back__popLayer .back-leave').click(function () {
                $el.find('.backOr_div').hide();
                if (status === 5) {
                    gobackHandle();
                }
                else {
                    //                  window.top.location.href = './';
                    locahost('./', '电话咨询');
                }
            });
            $el.find('.backOr_div .back__popLayer .back-continue').click(function () {
                $el.find('.backOr_div').hide();
            });
        }
        function backToUnusual() {
            $el.find('.link_middle').hide();
            $el.find('.link_bottom').hide();
            $('title').text('服务完成');
            $el.find('.div_header').text('服务完成');
            $el.find('#pop_consulationEnd').show();
            $el.find('.outOfUnusual').show();
            $el.find('.inOfUnusual').hide();
        }
        function settime() {
            $el.find('.linkingDom').hide();
            $('title').text('服务完成');
            $el.find('.div_header').text('服务完成');
            $el.find('#pop_consulationEnd').show();
        }
        function gobackHandle() {
            if (!parseInt(sessionStorage.getItem('loginFlg'), 10) && sessionStorage.getItem('loginFlg') === '0') {
                //              window.top.location.href = 'login';
                locahost('mipilaw66baidu_login?channel=baidusearch&sessionId=' + sessionId, '准备咨询');
            }
            else {
                //              window.top.location.href = './';
                locahost('./', '电话咨询');
            }
        }
        function checkTalking(checkRequestId, questionType) {
            $.ajax({
                type: 'GET',
                url: hosturl + 'checkTalkingOrder?requestId=' + checkRequestId + '&sessionId=' + sessionId,
                success: function (data) {
                    var state = data.result.state;
                    if (state === 6) {
                        $el.find('.toast_txt').text('通话不足60秒，无需支付');
                        $el.find('.toast_div').show();
                        setTimeout(function () {
                            $el.find('.toast_div').hide();
                            //                          window.top.location.href = './';
                            locahost('./', '电话咨询');
                        }, 2000);
                    }
                    else if (state === 7) {
                        $el.find('.toast_txt').text('通话异常，未接通电话');
                        $el.find('.toast_div').show();
                        setTimeout(function () {
                            $el.find('.toast_div').hide();
                            locahost('./', '电话咨询');
                        }, 2000);
                    }
                    else if (state === 4) {
                        // 表示您和律师还在通话中，请咨询结束后，再支付律师辛苦费
                        $el.find('.toast_txt').text(data.result.error);
                        $el.find('.toast_div').show();
                        setTimeout(function () {
                            $el.find('.toast_div').hide();
                        }, 2000);
                        localStorage.setItem('linkingOrding', 'linkingOrding');
                    }
                    else {
                        $.ajax({
                            type: 'get',
                            url: hosturl + 'getRequestId?requestId=' + checkRequestId + '&sessionId=' + sessionId,
                            async: false,
                            success: function (data) {
                                console.log('是否合并支付单号：' + data);
                                var payulr = 'mipilaw66baidu_couponPay?requestId='
                                    + data + '&questionType=' + questionType + '&sessionId=' + sessionId;
                                locahost(payulr, '支付详情');
                                localStorage.setItem('linkingOrding', 'linkingOrdingGone');
                            },
                            error: function () {
                                window.location.reload();
                            }
                        });
                    }
                },
                error: function () {
                    window.location.reload();
                }
            });
        }
        function getType(questionType) {
            switch (questionType) {
                case 'CT001':
                    return '婚姻家庭';
                case 'CT002':
                    return '房产物业';
                case 'CT003':
                    return '交通意外';
                case 'CT006':
                    return '民间借贷';
                case 'CT004':
                    return '劳动用工';
                case 'CT008':
                    return '合同纠纷';
                case 'CT007':
                    return '其他问题';
                default:
                    return false;
                    break;
            }
        }
    };

    return customElement;
});
