<?php
/* @var $this yii\web\View */
$this->title = '漏洞情报';
?>
<link rel="stylesheet" href="/css/vehicleintelligence/loophole.css">
<section class="vehicle_loophole_container" ng-app="myApp" ng-controller="vehicleTelLoopholeCtrl" ng-cloak>
  <div class="vehicle_loophole">
    <div class="vehicle_box_top">
      <!-- 输入关键字 -->
      <span class="vehicle_icon_box">
        <img src="/images/alert/search_icon.png" class="search_icon" alt="">
        <input autocomplete="off" type="text" style="padding-left:34px;" class="vehicle_search_input"
          placeholder="情报标题/情报描述" ng-model="seach_data.key_word" ng-keyup="vehicle_key_up($event)">
      </span>
      <!-- 获取时间 -->
      <div class="vehicle_search_time">
        <img src="/images/report/time.png" class="time_icon_search" alt="">
        <input autocomplete="off" class="input_box" autocomplete="off" id="picker_search" type="text"
          placeholder="公开日期">
      </div>
      <!-- 漏洞来源 -->
      <div class="vehicle_icon_box" style="width:180px" >
        <img src="/images/set/label_triangle_down.png" class="select_down_icon" alt="">
        <input autocomplete="off" type="text" placeholder="情报来源" style="width:180px"  ng-model="seach_data.source"
          ng-focus="search_focus('source')" ng-blur="search_blur('source');" class="search_input" readonly>
        <ul class="select_list_box select_list_box_height" ng-if="search_box_ul.source">
          <li  title={{item}} ng-mousedown="search_choose_item(item,$index,'source');" ng-repeat="item in loop_source track by $index">
            {{item}}
          </li>
        </ul>
      </div>
      <!-- 漏洞级别 -->
      <div class="vehicle_icon_box">
        <img src="/images/set/label_triangle_down.png" class="select_down_icon" alt="">
        <input autocomplete="off" type="text" placeholder="情报级别" ng-model="seach_data.level"
          ng-focus="search_focus('level')" ng-blur="search_blur('level');" class="search_input" readonly>
        <ul class="select_list_box" ng-if="search_box_ul.level">
          <li ng-mousedown="search_choose_item(item.status, $index, 'level');"
            ng-repeat="item in search_level track by $index">
            {{item.status}}
          </li>
        </ul>
      </div>
      <!-- 标签选择 -->
      <!--<select class="vehicle_search_select source_input" ng-model="seach_data.label_id"
                   ng-options="x.id as x.label_name for x in search_tag_list">
                </select>-->

      <!-- 搜索 -->
      <button class="button_search" ng-click="get_page()" ng-keyup="label_keyup($event)">搜索</button>
    </div>

    <!-- 选中标签列表 -->
    <!--<div class="vehicle_item_box">
       <div class="tag_add_box">
         <p class="tag_tip" ng-show="label_checked_list.length == 0">标签</p>
         <ul class="tag_box_ul">
             <li ng-repeat="item in label_checked_list track by $index">
                 <span>{{item.label_name}}</span>
                 <img src="/images/set/tag_del.png" alt="" class="tag_icon" ng-click="label_tag_del($event,item,$index)">
             </li>
         </ul>
       </div>
    </div>-->
  </div>

  <!-- 标签列表展示 -->
  <div class="vehicle_search_country">
    <ul class="search_country">
      <li class="search_country_item" ng-repeat="item in label_data" ng-hide="$index>toggleCount">
        <span class="title">{{item.name}}：</span>
        <span class="lists">
          <span class="item" ng-repeat="it in item.label"
            ng-click="tog_change_status($event,item,it);">{{it.label_name}}</span>
        </span>
      </li>
    </ul>
    <div class="search_toggle" ng-show="label_data.length > 0">
      <a class="toggle" ng-class="{'active':toggleStatus}" ng-click="tog_count_change($event);">
        <span class="caret"></span>
        <span ng-show="!toggleStatus">展开</span><span ng-show="toggleStatus">收起</span>更多
      </a>
    </div>
  </div>
  <p>
    <span class="loophole_result_length">共有<span ng-bind="pages.count"></span>条结果</span>
  </p>

  <div class="loophole_table_content">
    <table class="table table-striped  table_th ng-cloak">
      <tr class="loophole_table_tr">
        <th></th>
        <th style="width:180px;">漏洞标题</th>
        <th style="width:200px;">漏洞描述</th>
        <th style="width:180px;">情报来源</th>
        <th>标签类型</th>
        <th  style="width:120px;">公开日期</th>
      </tr>
      <tr class="loophole_table_tr" style="cursor: pointer;" ng-repeat="item in pages.data"
        ng-click="list_item_click($event,item);">
        <td>
          <div ng-if="item.level === '高'" class="th_id_img">
            <img src="/images/alert/h.png" alt="">
          </div>
          <div ng-if="item.level === '中'" class="th_id_img">
            <img src="/images/alert/m.png" alt="">
          </div>
          <div ng-if="item.level === '低'" class="th_id_img">
            <img src="/images/alert/l.png" alt="">
          </div>
          <div ng-if="item.level === ''" class="th_id_img">
          </div>
        </td>
        <td  style="width:150px;color: #0070ff;">
          <span ng-bind="item.title"></span>
        </td>
        <td style="width:200px;" ng-bind="item.detail"></td>
        <td style="width:180px;" ng-bind="item.sourse"></td>
        <td class="td_operation" style="white-space: nowrap;text-overflow: ellipsis;">
          <button class="btn_loophole" ng-class="{'active':it.status}" ng-repeat="it in item.label_name">
            <span ng-attr-title={{it}}>{{it}}</span>
            <img class="loop_img" src="/images/loophole/tick.png" alt="" ng-show="it.status">
          </button>
        </td>
        <td style="width:120px;">{{item.open_time*1000 | date : 'yyyy-MM-dd'}}</td>
      </tr>
    </table>
    <div class="pagination_info">
      <p class="leave_page" ng-show="pages.maxPage>1">前往<input autocomplete="off" type="number" class="leave_page_num"
          ng-model="page_num" ng-blur="get_page(page_num)">页</p>
      <ul class="pagination pagination-sm  pull-right ng-cloak" style="margin-right:36px;">
        <li><a href="javascript:void(0);" ng-click="get_page(pages.pageNow-1)" ng-if="pages.pageNow>1">上一页</a></li>
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
  <!-- sasss -->
  <div class="pop_box" ng-if="pop_show">
    <div class="pop_contnet">
      <div class="contnet_title_box">
        <p class="pop_contnet_title">{{label_item_data.title}}</p>
        <img src="/images/set/closed_pop.png" ng-click="pop_cancel()" class="closed_img" alt="">
      </div>
      <div class="pop_box_container">
        <div class="contnet">
          <div class="contnet_item">
            <div class="contnet_item_left">
              <img src="/images/set/add_icon_2.png" alt="">
              <span>漏洞等级:</span>
            </div>
            <div>
              <span>{{label_item_data.level}}</span><span ng-hide="label_item_data.level==''">危</span>
            </div>
          </div>
          <div class="contnet_item bg_item">
            <div class="contnet_item_left">
              <img src="/images/set/add_icon_3.png" alt="">
              <span>公开日期:</span>
            </div>
            <div class="contnet_item_right">
              <span>{{label_item_data.open_time*1000 | date : 'yyyy-MM-dd'}}</span>
            </div>
          </div>
          <div class="contnet_item">
            <div class="contnet_item_left">
              <img src="/images/set/add_icon_4.png" alt="">
              <span>情报来源:</span>
            </div>
            <div class="contnet_item_right">
              <span class="stance">{{label_item_data.sourse}}</span>
            </div>
          </div>
          <div class="contnet_item bg_item">
            <div class="contnet_item_left">
              <img src="/images/loophole/sp4.png" alt="">
              <span>影响产品:</span>
            </div>
            <div class="contnet_item_right" style="flex-direction: column;">
              <div class="info_mation" style="flex-direction: column;">
                <div class="info_mation_item" ng-repeat="item in label_item_data.affected_products">
                  <p>{{item}}</p>
                </div>
              </div>
            </div>
          </div>
          <div class="contnet_item">
            <div class="contnet_item_left">
              <img src="/images/set/add_icon_6.png" alt="">
              <span>漏洞描述:</span>
            </div>
            <div class="contnet_item_right">
              <div class="detail_box">
                <p>{{label_item_data.detail}}</p>
              </div>
            </div>
          </div>
          <div class="contnet_item bg_item">
            <div class="contnet_item_left">
              <img src="/images/loophole/sp8.png" alt="">
              <span>建议处理措施:</span>
            </div>
            <div class="contnet_item_right">
              <div class="detail_box">
                <p>{{label_item_data.treatment_measures}}</p>
              </div>
            </div>
          </div>
          <div class="contnet_item">
            <div class="contnet_item_left">
              <img src="/images/set/add_icon_8.png" alt="">
              <span>参考信息:</span>
            </div>
            <div class="contnet_item_right" style="flex-direction: column;">
              <div class="info_mation" style="flex-direction: column;">
                <div class="info_mation_item" ng-repeat="item in label_item_data.reference_information">
                  <p>{{item}}</p>
                </div>
              </div>
            </div>
          </div>
          <div class="contnet_item bg_item">
            <div class="contnet_item_left">
              <img src="/images/set/add_icon_9.png" alt="">
              <span>标签:</span>
            </div>
            <div class="contnet_item_right" style="flex-direction: column;">
              <div ng-repeat="item in  label_item_data.label_new_name" class="tag_box">
                <div class="tag_box_left">
                  <span>{{item.name}}</span>
                </div>
                <div class="tag_box_right">
                  <span ng-repeat='key in item.value' class="tag_box_right_tag">{{key.label_name}}</span>
                </div>
              </div>
            </div>
          </div>
          <div class="contnet_item">
            <div class="contnet_item_left">
              <img src="/images/set/add_icon_10.png" alt="">
              <span>NVD关联:</span>
            </div>
            <div class="contnet_item_right" style="flex-direction: column;">
              <div class="info_mation" style="flex-direction: column;">
                <div class="info_mation_item" ng-repeat="item in label_item_data.nvd">
                  <a class="info_mation_nvd" ng-click="list_item_click_nvd($event,item.cve)">{{item.cve}}</a>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  </div>
  <!-- NVD详情弹窗 -->
  <div style="display:none;" id="vehicle_loophole_box_nvd">
    <div id="vehicle_loophole_nvd">
      <ul class="l_nvd_mid">
        <li class="item">
          <img class="i_img" src="/images/loophole/sp9.png" alt="" />
          <h4 class="title">CVEID：</h4>
          <span class="stance" ng-bind="base_data.cve"></span>
        </li>
        <li class="item">
          <img class="i_img" src="/images/loophole/sp10.png" alt="" />
          <h4 class="title">CVSS v2：</h4>
          <span class="stance">{{base_data.cvss_v2==''?'N/A':base_data.cvss_v2}}<span style="margin-left:10px;"
              ng-hide="base_data.cvss_v2== ''"></span></span>
        </li>
        <li class="item">
          <img class="i_img" src="/images/loophole/sp10.png" alt="" />
          <h4 class="title">CVSS v3：</h4>
          <span class="stance">{{base_data.cvss_v3==''?'N/A':base_data.cvss_v3}}<span style="margin-left:10px;"
              ng-hide="base_data.cvss_v3== ''"></span></span>
        </li>
        <li class="item">
          <img class="i_img" src="/images/loophole/sp1.png" alt="" />
          <h4 class="title">漏洞情报级别：</h4>
          <span class="stance">{{base_data.level}}<span ng-hide="base_data.level== ''">危</span></span>
        </li>
        <li class="item">
          <img class="i_img" src="/images/loophole/sp2.png" alt="" />
          <h4 class="title">发现时间：</h4>
          <span class="stance">{{base_data.publishedDate.substring(0,10)}}</span>
        </li>
        <li class="item">
          <img class="i_img" src="/images/loophole/sp2.png" alt="" />
          <h4 class="title">更新时间：</h4>
          <span class="stance">{{base_data.lastModifiedDate.substring(0,10)}}</span>
        </li>
        <li class="item">
          <img class="i_img" src="/images/loophole/sp4.png" alt="" />
          <h4 class="title">关联地址：</h4>
          <a class="stance s_active" target="_blank" ng-href="https://nvd.nist.gov/vuln/detail/{{base_data.cve}}">
            https://nvd.nist.gov/vuln/detail/{{base_data.cve}}
          </a>
        </li>
        <li class="item">
          <img class="i_img" src="/images/loophole/sp5.png" alt="" />
          <h4 class="title">漏洞描述：</h4>
          <span class="stance s_content" ng-bind="base_data.detail" ng-attr-title="{{base_data.detail}}"></span>
        </li>

      </ul>
    </div>
  </div>
</section>
<script src="/js/controllers/vehicleintelligence/vehicle_tel_loophole.js"></script>
