/**
 * @file mip-fetch-comment 组件
 * @author
 */

define(function (require) {
    var customElement = require('customElement').create();
    customElement.prototype.firstInviewCallback = function () {
        var element = this.element;
        var wineId = element.querySelector('#wineId').value;
        loadData(wineId, '');
        var arr = element.querySelectorAll('.nianfen');
        for (var i = 0; i < arr.length; i++) {
            arr[i].onclick = function () {
                loadData(wineId, this.dataset.vintage);
                for (var j = 0; j < arr.length; j++) {
                    arr[j].className = 'nianfen';
                    if (arr[j].dataset.yvalue === this.dataset.yvalue) {
                        arr[j].className = 'nianfen currVintage';
                    }
                };
                var lightbox = element.querySelector('#MIP-LLIGTBOX-MASK');
                lightbox.style.display = 'none';
                var miplightbox = element.querySelector('#pjyear-lightbox');
                miplightbox.style.display = 'none';
            };
        };
        element.querySelector('#allyears').addEventListener('click', function () {
            var lightbox = element.querySelector('#MIP-LLIGTBOX-MASK');
            lightbox.style.display = 'block';
            var miplightbox = element.querySelector('#pjyear-lightbox');
            miplightbox.style.display = 'block';
        });
        function loadData(wineid, year) {
            var url = 'https://mip-test.wine-world.com/wine/GetWineInfo?wineid=' + wineid + '&vintageid=' + year;
            fetch(url, {
                method: 'POST',
                header: {
                    'Content-type': 'application/json'
                }
            }).then(function (res) {
                return res.json();
            }).then(function (json) {
                if (json.hj.length > 0) {
                    var awardsContent = element.querySelector('#awardsContent');
                    awardsContent.style = 'display:block';
                    var awardsHtml = element.querySelector('#pjawards');
                    awardsHtml.innerHTML = '';
                    var pjhjLightboxhtml = element.querySelector('#pjhjLightbox');
                    pjhjLightboxhtml.innerHTML = '';
                    var pjhjHtml = '';
                    var hjhtml = '';
                    for (var i = 0; i < json.hj.length; i++) {
                        hjhtml += '<div class="scores bdb-t-1px"><div class="scoreVal"><div class="score-r"> 获奖时间：'
                        + json.hj[i].year + '</div><div class="score-l"><div class="score-i"><span class="scoreV">'
                        + json.hj[i].grade
                        + '</span></div></div></div><div class="scoreVal"><div class="wine-nf">葡萄酒年份：'
                        + json.hj[i].year + '</div><div class="wineOrg"><div class="org-t">颁奖组织：'
                        + json.hj[i].agency + '</div><i class="rater" on="tap:pjhj-'
                        + i + '-lightbox.toggle">?</i></div></div></div>';
                        pjhjHtml += '<mip-lightbox id="pjhj-' + i + '-lightbox" layout="nodisplay" '
                        + 'class="mip-hidden"> <div class="lightbox"> <div class="downPop popvt">'
                        + ' <span class="close-pop iconfont icon-toclosed" on="tap:pjhj-'
                        + i + '-lightbox.toggle"></span><div class="rater-nm" id="raterName">'
                        + json.hj[i].agency + '</div><div class="rater-info" id="raterSummary">'
                        + json.hj[i].agencySummary + '</div></div></div></mip-lightbox>';
                    }
                    awardsHtml.innerHTML += hjhtml;
                    pjhjLightboxhtml.innerHTML += pjhjHtml;
                }
                else {
                    var awardsContent = element.querySelector('#awardsContent');
                    awardsContent.style = 'display:none';
                }
                if (json.pf.length > 0) {
                    var gradeContent = element.querySelector('#gradeContent');
                    gradeContent.style = 'display:block';
                    var gradeHtml = element.querySelector('#pjgrade');
                    gradeHtml.innerHTML = '';
                    var pfhtml = '';
                    var pjpfLightboxhtml = element.querySelector('#pjpfLightbox');
                    pjpfLightboxhtml.innerHTML = '';
                    var pjpfHtml = '';
                    for (var i = 0; i < json.pf.length; i++) {
                        var showStr = '';
                        if (json.pf[i].score.indexOf('/100') > -1) {
                            showStr = '<span class=\"scoreV\">' + json.pf[i].score.replace('/100', '')
                            + '</span><span class=\"score-zf\">/100</span><br />';
                        } else if (json.pf[i].score.indexOf('/20') > -1) {
                            showStr = '<span class=\"scoreV\">' + json.pf[i].score.replace('/20', '')
                            + '</span><span class=\"score-zf\">/20</span><br />';
                        } else if (json.pf[i].score.indexOf('/5') > -1) {
                            showStr = '<span class=\"scoreV\">' + json.pf[i].score.replace('/5', '')
                            + '</span><span class=\"score-zf\">/5</span><br />';
                        } else {
                            showStr = '<span class=\"scoreV\">' + json.pf[i].score + '</span><br />';
                        }
                        pfhtml += '<div class="scores bdb-t-1px"><div class="scoreVal"><div class="score-r"> 适饮时间：'
                        + json.pf[i].date
                        + '</div><div class="score-l"><div class="score-i">'
                        + showStr + '</div></div></div><div class="scoreVal"><div class="wine-nf">葡萄酒年份：'
                        + json.pf[i].year + '</div><div class="wineOrg"><div class="org-t">评分者：'
                        + json.pf[i].critic + '</div> <i class="rater" on="tap:pjpf-'
						+ i + '-lightbox.toggle" >?</i></div></div></div>';
                        pjpfHtml += '<mip-lightbox id="pjpf-' + i + '-lightbox" layout="nodisplay" '
                        + 'class="mip-hidden"> <div class="lightbox"> <div class="downPop popvt">'
                        + ' <span class="close-pop iconfont icon-toclosed" on="tap:pjpf-'
                        + i + '-lightbox.toggle"></span><div class="rater-nm" id="raterName">'
                        + json.pf[i].critic + '</div><div class="rater-info" id="raterSummary">'
                        + json.pf[i].criticSummary + '</div></div></div></mip-lightbox>';
                    }
                    gradeHtml.innerHTML += pfhtml;
                    pjpfLightboxhtml.innerHTML += pjpfHtml;
                } else {
                    var gradeContent = element.querySelector('#gradeContent');
                    gradeContent.style = 'display:none';
                }
                if (json.taste.length > 0) {
                    var wineContent = element.querySelector('#wineContent');
                    wineContent.style = 'display:block';
                    var jiupingHtml = element.querySelector('#pjjiuping');
                    jiupingHtml.innerHTML = '';
                    var jphtml = '';
                    for (var i = 0; i < json.taste.length; i++) {
                        jphtml += '<li class=\"bdb-t-1px\">' + json.taste[i].tastenote + '<span class=\"jpOrg\">——  '
                        + json.taste[i].critic + '</span></li>';
                    }
                    jiupingHtml.innerHTML += jphtml;
                } else {
                    var wineContent = element.querySelector('#wineContent');
                    wineContent.style = 'display:none';
                }
            });
        }
    };
    return customElement;
});
