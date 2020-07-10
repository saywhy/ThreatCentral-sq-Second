<?php
/* @var $this yii\web\View */

$this->title = '漏洞情报详情';
?>
<link rel="stylesheet" href="/css/intelligence/detail.css">
 <style>
     .high_color {
        color: #EB883B;
    }
    .fatal_color{
color: #E34F4F;
    }

    .mid_color {
        color: #F4D352;
    }

    .low_color {
        color: #4588F4
    }
    .img_icon{
      margin:0;
    }
    .detail_box_top{
      padding:0 5px;
    }
    .detail_box_bom{
      padding:24px 36px;
    }
 </style>
<section class="intelligence_content" ng-app="myApp" ng-controller="IntelligenceDetailCtrl" ng-cloak>
    <div class="detail_box">
        <div class="detail_box_top">
             <img src="/images/intelligence_detail/fatal.png" ng-if="detail.degree == '严重'"
             width="20" class="img_icon" alt="">
             <img src="/images/intelligence_detail/high.png" ng-if="detail.degree == '高危'"
              width="20"  class="img_icon" alt="">
                <img src="/images/intelligence_detail/middle.png" ng-if="detail.degree == '中危'"
                  width="20"  class="img_icon"  alt="">
                <img src="/images/intelligence_detail/low.png"ng-if="detail.degree == '低危'"
                 width="20"  class="img_icon"  alt="">
                 <span class="fatal_color"  ng-if="detail.degree == '严重'" style="font-size: 16px;">严重</span>
                 <span class="high_color"  ng-if="detail.degree == '高危'" style="font-size: 16px;">高危</span>
                 <span class="mid_color"  ng-if="detail.degree == '中危'" style="font-size: 16px;">中危</span>
                 <span class="low_color"  ng-if="detail.degree == '低危'" style="font-size: 16px;">低危</span>
            <span style="vertical-align: middle;" >{{detail.title}}</span>
        </div>
        <div class="detail_box_bom">
              <div ng-bind-html='html_content'> </div>
        </div>
    </div>
</section>
<script src="/js/controllers/intelligence_detail.js"></script>
