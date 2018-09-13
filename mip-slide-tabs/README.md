# mip-slide-tabs

mip-slide-tabs 双层tabs切换

标题|内容
----|----
类型|通用
支持布局|container
所需脚本|https://mipcache.bdstatic.com/static/v1/mip-slide-tabs/mip-slide-tabs.js

## 示例

### 基本用法
```html
<mip-slide-tabs>
<div class="goods-col" id="topTab">
   <div class="tabTitle">酒款</div>
   <div class="tabTitle">资料</div>
   <div class="tabTitle">评价</div>
</div>

<div class="tabContent" id="jiukuan">
酒款xinxi
</div>


<div class="tabContent" id="ziliao">

<div id="box">
       <div id="tabl" class="tabL">
           <a class="active">酒庄</a>
           <a>产区</a>
           <a>酿酒葡萄</a>
       </div>
       <ul id="tabr" class="tabR">
           <li class="tabr_li">
               <div class="tab1-tit">
                   <a class="active">简介</a>
                   <a>资料</a>
                   <a>酒庄酒款</a>
				   <a>扩展信息</a>
               </div>
               <ul class="tab1-con">
                   <li><div class='w-article'>位于法国波尔多梅多克产区（Medoc）的
				   
				   <a href="www.baidu.com">sdfhisdfiasdjlkasjdgka</a></div>
				   </li>
                   <li>赤霞珠（Cabernet Sauvignon）81%，梅洛（Merlot ）15%，品丽珠（Cabernet Franc）3%，味而多（Petit Verdot）1%</li>
                   <li>木桐酒庄红葡萄酒</li>
				   <li>地址：Chateau Mouton Rothschild 33250 Pauillac, France</li>
               </ul>
           </li>
           <li class="tabr_li" >
			  <div class="w-article">上岛咖啡<a href='www.baidu.com'>百度链接<span style="color:#0000ff">BAIDU</span><span style="color:red">阿里巴巴</span></a></div>
           </li>
           <li class="tabr_li" >
               <div class="tab1-tit">
                   <a class="active">赤霞珠</a>
                   <a>梅洛</a>
                   <a>吕丽珠</a>
               </div>
               <ul class="tab1-con">
                   <li>赤霞珠：作为世界上最著名的红葡萄品种，</li>
                   <li>梅洛：作为世界上最著名的红葡萄品种，</li>
                   <li>吕丽珠：作为世界上最著名的红葡萄品种，</li>
               </ul>
           </li>
       </ul>
</div>

</div>


<div class="tabContent" id="pingjia">
酒款评价
</div>
</mip-slide-tabs>
```

