<?php
/* @var $this yii\web\View */
$this->title = '基础情报管理';
?>
<style>
</style>
<link rel="stylesheet" href="/css/set/base.css">
<section class="base_intel_container" ng-app="myApp" ng-controller="baseIntelCtrl" ng-cloak>
    <div class="intel_loophole">
        <div class="intel_box_top">
            <!-- 输入关键字 -->
            <div class="search_input_box" style="width:260px;">
                <img src="/images/alert/search_icon.png" class="search_icon" alt="">
                <input type="text" class="intel_search_input" ng-keyup="search_keyup($event)"
                    placeholder="漏洞关键字" ng-model="seach_data.key_word">
            </div>
              <!-- 发现时间 -->
            <div class="intel_search_time ">
                 <img src="/images/report/time.png" class="time_icon_search" alt="">
          <input class="input_box" autocomplete="off" id="picker_search" type="text" placeholder="发现时间">
            </div>
            <!-- 漏洞级别 -->
            <div class="search_input_box">
                <img src="/images/set/label_triangle_down.png" class="select_down_icon" alt="">
                <input type="text" placeholder="漏洞级别" ng-model="seach_data.level" ng-focus="search_focus('level')"
                    ng-blur="search_blur('level');" class="search_input" readonly>
                <ul class="select_list_box" ng-if="search_box_ul.level" style="height:170px;margin:0">
                    <li ng-mousedown="search_choose_item(item.status,'level');"
                        ng-repeat="item in search_level track by $index">
                        {{item.status}}
                    </li>
                </ul>
            </div>
            <button class="button_search" ng-click="get_page()">搜索</button>
        </div>
    </div>

    <!-- 基础列表展示 -->
    <div class="loophole_table_content" ng-click="blur_input()">
        <table class="table table-striped  table_th  ng-cloak">
            <tr class="loophole_table_tr">
              <th></th>
                <th class="th_id" style="padding-left:40px;">CVEID</th>
                <th class="td_detail">漏洞描述</th>
                <th style="width:100px;">发现时间</th>
                <th style="width:100px;">更新时间</th>
                <th style="width:120px;" class="td_operation">查看原始情报</th>
            </tr>
            <tr class="loophole_table_tr" ng-repeat="item in pages.data track by $index"
                ng-click="detail(item)">
                <td>
                   <div ng-if="item.level === '高'" class="th_id_img">
                    <img src="/images/alert/h.png"  alt="">
                   </div>
                   <div ng-if="item.level === '中'" class="th_id_img">
                    <img src="/images/alert/m.png"  alt="">
                   </div>
                   <div ng-if="item.level === '低'" class="th_id_img">
                    <img src="/images/alert/l.png"  alt="">
                   </div>
                   <div ng-if="item.level === ''" class="th_id_img">
                   </div>
                </td>
                <td class="th_id" style="padding-left:10px;">
                   <span class="th_id_cav" ng-bind="item.cve" ng-click="list_item_click($event,item)"></span>
                </td>
                <td class="td_detail">
                  <span class="th_id_detail" ng-bind="item.detail" ng-attr-title="{{item.detail}}"
                  ng-click="list_item_click($event,item)"></span>
                </td>
                <td>{{item.publishedDate.substring(0,10)}}</td>
                <td>{{item.lastModifiedDate.substring(0,10)}}</td>
                <td class="td_operation">
                    <button class="btn_operation" ng-click="list_item_click($event,item)">查看详情</button>
                </td>
            </tr>
        </table>
        <p>
            <span class="loophole_result_length">共有<span ng-bind="pages.count"></span>条结果</span>
        </p>
        <div class="pagination_info">
            <p class="leave_page" ng-show="pages.maxPage>1">前往<input type="number" class="leave_page_num" ng-model="page_num"
            ng-blur="get_page(page_num)">页</p>
            <ul class="pagination pagination-sm ng-cloak" style="margin-right:36px;">
                <li><a href="javascript:void(0);" ng-click="get_page(pages.pageNow-1)" ng-if="pages.pageNow>1">上一页</a>
                </li>
                <li><a href="javascript:void(0);" ng-click="get_page(1)" ng-if="pages.pageNow>1">1</a>
                </li>
                <li><a href="javascript:void(0);" ng-if="pages.pageNow>4">...</a></li>
                <li><a href="javascript:void(0);" ng-click="get_page(pages.pageNow-2)" ng-bind="pages.pageNow-2"
                        ng-if="pages.pageNow>3"></a></li>
                <li><a href="javascript:void(0);" ng-click="get_page(pages.pageNow-1)" ng-bind="pages.pageNow-1"
                        ng-if="pages.pageNow>2"></a></li>
                <li class="active"><a href="javascript:void(0);" ng-bind="pages.pageNow"></a></li>
                <li><a href="javascript:void(0);" ng-click="get_page(pages.pageNow+1)" ng-bind="pages.pageNow+1"
                        ng-if="pages.pageNow<pages.maxPage-1"></a></li>
                <li><a href="javascript:void(0);" ng-click="get_page(pages.pageNow+2)" ng-bind="pages.pageNow+2"
                        ng-if="pages.pageNow<pages.maxPage-2"></a></li>
                <li><a href="javascript:void(0);" ng-if="pages.pageNow<pages.maxPage-3">...</a></li>

                <li><a href="javascript:void(0);" ng-click="get_page(pages.maxPage)" ng-bind="pages.maxPage"
                        ng-if="pages.pageNow<pages.maxPage"></a></li>
                <li><a href="javascript:void(0);" ng-click="get_page(pages.pageNow+1)"
                        ng-if="pages.pageNow<pages.maxPage">下一页</a></li>
            </ul>
        </div>
    </div>
    <!-- 基础情报详情弹窗 -->
    <div style="display:none;" id="vehicle_loophole_box">
        <div id="vehicle_loophole">
            <ul class="l_mid">
              <li class="item">
                    <img class="i_img" src="/images/loophole/sp9.png" alt=""/>
                    <h4 class="title">CVEID：</h4>
                    <span class="stance" ng-bind="base_data.cve"></span>
              </li>
              <li class="item">
                    <img class="i_img" src="/images/loophole/sp10.png" alt=""/>
                    <h4 class="title">CVSS v2：</h4>
                    <span class="stance">{{base_data.cvss_v2==''?'N/A':base_data.cvss_v2}}<span style="margin-left:10px;" ng-hide="base_data.cvss_v2== ''"></span></span>
              </li>
               <li class="item">
                    <img class="i_img" src="/images/loophole/sp10.png" alt=""/>
                    <h4 class="title">CVSS v3：</h4>
                    <span class="stance">{{base_data.cvss_v3==''?'N/A':base_data.cvss_v3}}<span style="margin-left:10px;" ng-hide="base_data.cvss_v3== ''"></span></span>
                </li>
                <li class="item">
                    <img class="i_img" src="/images/loophole/sp1.png" alt=""/>
                    <h4 class="title">漏洞情报级别：</h4>
                    <span class="stance">{{base_data.level}}<span ng-hide="base_data.level== ''">危</span></span>
                </li>
                 <li class="item">
                    <img class="i_img" src="/images/loophole/sp2.png" alt=""/>
                    <h4 class="title">发现时间：</h4>
                    <span class="stance">{{base_data.publishedDate.substring(0,10)}}</span>
                </li>
                <li class="item">
                    <img class="i_img" src="/images/loophole/sp2.png" alt=""/>
                    <h4 class="title">更新时间：</h4>
                    <span class="stance">{{base_data.lastModifiedDate.substring(0,10)}}</span>
                </li>
                <li class="item">
                    <img class="i_img" src="/images/loophole/sp4.png" alt=""/>
                    <h4 class="title">关联地址：</h4>
                    <a class="stance s_active" target="_blank" ng-href="https://nvd.nist.gov/vuln/detail/{{base_data.cve}}">
                      https://nvd.nist.gov/vuln/detail/{{base_data.cve}}
                    </a>
                </li>
                <li class="item">
                    <img class="i_img" src="/images/loophole/sp5.png" alt=""/>
                    <h4 class="title">漏洞描述：</h4>
                    <span class="stance s_content" ng-bind="base_data.detail"  ng-attr-title="{{base_data.detail}}"></span>
                </li>

            </ul>
        </div>
    </div>
</section>
<script src="/js/controllers/base_intel.js"></script>
