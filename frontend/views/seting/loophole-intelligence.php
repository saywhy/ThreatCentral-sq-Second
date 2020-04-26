<?php
/* @var $this yii\web\View */
$this->title = '漏洞情报管理';
?>
<style>
</style>
<link rel="stylesheet" href="/css/set/loophole.css">
<section class="special_intel_container" ng-app="myApp" ng-controller="loopholeIntelCtrl" ng-cloak>
  <div class="loophole_intel">
  </div>
  <div class="intel_loophole">
    <div class="intel_box_top">
      <div class="search_input_box" style="width: 165px;">
        <img src="/images/alert/search_icon.png" class="search_icon" alt="">
        <input type="text" autocomplete="off" class="intel_search_input" ng-focus="get_intel_search_focus()"
          ng-blur="get_intel_search_blur()" ng-keyup="myKeyup_intel_search(seach_data.client_ip)"
          placeholder="情报标题/情报描述" ng-model="seach_data.key_word">
      </div>
      <div class="intel_search_time ">
        <img src="/images/report/time.png" class="time_icon_search" alt="">
        <input autocomplete="off" class="input_box" id="picker_search" type="text" placeholder="公开日期">
      </div>
      <!-- 来源 -->
      <div class="search_input_box"  style="width:180px">
        <img src="/images/set/label_triangle_down.png" class="select_down_icon" alt="">
        <input autocomplete="off" type="text" placeholder="漏洞来源" ng-model="seach_data.source"
          ng-focus="search_focus('source')" ng-blur="search_blur('source');" class="search_input"  style="width:180px" readonly>
        <ul class="select_list_box select_list_box_height" ng-if="search_box_ul.source">
          <li  title={{item.name}} ng-mousedown="search_choose_item(item.name,$index,'source');"
            ng-repeat="item in loop_source track by $index">
            {{item.name}}
          </li>
        </ul>
      </div>
      <!-- 状态 -->
      <div class="search_input_box">
        <img src="/images/set/label_triangle_down.png" class="select_down_icon" alt="">
        <input autocomplete="off" type="text" placeholder="状态" ng-model="seach_data.stauts"
          ng-focus="search_focus('stauts')" ng-blur="search_blur('stauts');" class="search_input" readonly>
        <ul class="select_list_box" ng-if="search_box_ul.stauts">
          <li ng-mousedown="search_choose_item(item.status,$index,'stauts');"
            ng-repeat="item in status_search track by $index">
            {{item.status}}
          </li>
        </ul>
      </div>
      <!-- 情报级别 -->
      <div class="search_input_box">
        <img src="/images/set/label_triangle_down.png" class="select_down_icon" alt="">
        <input autocomplete="off" type="text" placeholder="漏洞级别" ng-model="seach_data.level"
          ng-focus="search_focus('level')" ng-blur="search_blur('level');" class="search_input" readonly>
        <ul class="select_list_box" ng-if="search_box_ul.level">
          <li ng-mousedown="search_choose_item(item.status,$index,'level');"
            ng-repeat="item in search_level track by $index">
            {{item.status}}
          </li>
        </ul>
      </div>

      <button class="button_search" ng-click="get_page()">搜索</button>
      <button class="button_add" ng-click="add_loop_box()">情报录入</button>
    </div>
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
    <div class="search_toggle" ng-show="label_data.length > 0" style="width:140px;">
      <a class="toggle" ng-class="{'active':toggleStatus}"  style="cursor:pointer;" ng-click="tog_count_change($event);">
        <span class="caret"></span>
        <span ng-show="!toggleStatus">展开</span><span ng-show="toggleStatus">收起</span>更多
      </a>
    </div>
  </div>
  <div class="loophole_table_content" ng-click="blur_input()">
    <table class="table table-striped table_th ng-cloak">
      <tr class="loophole_table_tr">
        <th></th>
        <th>情报标题</th>
        <th>情报来源</th>
        <th class="tag_th">标签</th>
        <th style="width:150px" class="th_time">公开日期</th>
        <th style="width:100px">状态</th>
        <th class="td_operation th_id">操作</th>
      </tr>
      <tr class="loophole_table_tr" style="cursor: pointer;" ng-repeat="item in pages.data track by $index"
        ng-click="detail(item)">
        <td>
          <img src="/images/alert/h.png" ng-if="item.level === '高'" alt="">
          <img src="/images/alert/m.png" ng-if="item.level === '中'" alt="">
          <img src="/images/alert/l.png" ng-if="item.level === '低'" alt="">
        </td>
        <td>
          <span ng-bind="item.title" ng-attr-title="{{item.detail}}" ng-click="edit_loop_box(item)"> </span>
        </td>
        <td ng-bind="item.sourse"></td>
        <td ng-attr-title="{{item.label_title}}">
          <button class="btn_loophole" ng-repeat="it in item.label_name">
            {{it}}
            <!-- <img class="loop_img" src="/images/loophole/tick.png" alt="" ng-show="it.status"> -->
          </button>
        </td>
        <td style="width:150px">{{item.open_time*1000 | date : 'yyyy-MM-dd'}}</td>
        <td style="width:100px">{{item.status=='0'? '未发布':'已发布'}}</td>
        <td class="td_operation th_id">
          <img class="set_img_icon" ng-if="item.status=='0'" ng-click="release(item.id,'1')" title="发布"
            src="/images/set/sq_release_i.png" alt="" alt="">
          <img class="set_img_icon" ng-if="item.status!='0'" title="发布" src="/images/set/sq_release_o.png" alt=""
            alt="">
          <!-- <img src="" class="loop_img" src="/images/set/sq_release_o.png" alt="" alt=""> -->
          <img class="set_img_icon" ng-if="item.status!='0'" ng-click="release(item.id,'0')" title="撤回"
            src="/images/set/sq_recall_i.png" alt="" alt="">
          <img class="set_img_icon" ng-if="item.status=='0'" title="撤回" src="/images/set/sq_recall_o.png" alt="" alt="">
          <img class="set_img_icon" ng-click="edit_loop_box(item)" title="编辑" src="/images/set/sq_edit_i.png" alt=""
            alt="">
          <img class="set_img_icon" ng-click="delete(item.id)" title="删除" src="/images/set/sq_del_i.png" alt="" alt="">
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
  <!-- 添加新增弹窗 -->
  <div class="pop_box" ng-show="pop_show.add">
    <div class="pop_contnet">
      <div class="contnet_title_box">
        <p class="pop_contnet_title">漏洞情报录入</p>
        <img src="/images/set/closed_pop.png" ng-click="add_cancel()" class="closed_img" alt="">
      </div>
      <div class="pop_box_container">
        <div class="contnet">
          <div class="contnet_item">
            <div class="contnet_item_left">
              <img src="/images/set/add_icon_1.png" alt="">
              <span>情报标题:</span>
            </div>
            <div class="contnet_item_right">
              <input autocomplete="off" type="text" placeholder="请输入情报标题" ng-model="add_item.title"
                class="item_right_input">
            </div>
          </div>
          <div class="contnet_item">
            <div class="contnet_item_left">
              <img src="/images/set/add_icon_2.png" alt="">
              <span>漏洞等级:</span>
            </div>
            <div class="contnet_item_right">
              <div class="tag_item" style="margin:0">
                <img src="/images/set/label_triangle_down.png" class="select_down_icon" alt="">
                <input autocomplete="off" type="text" placeholder="请选择漏洞等级" ng-model="add_item.level"
                  ng-focus="add_focus('level')" ng-blur="add_blur('level');" class="item_right_input" readonly>
              </div>
              <ul class="select_list_box select_list_margin" ng-if="pop_show.add_level_list">
                <li ng-mousedown="choose_item(item.name,$index,'level');"
                  ng-class="{'add_bg':tag_key_add.active_index == $index}"
                  ng-repeat="item in add_item.level_list track by $index">
                  {{item.name}}
                </li>
              </ul>
            </div>
          </div>
          <div class="contnet_item">
            <div class="contnet_item_left">
              <img src="/images/set/add_icon_3.png" alt="">
              <span>公开日期:</span>
            </div>
            <div class="contnet_item_right">
              <img src="/images/report/time.png" alt="" class="item_right_time_icon">
              <img src="/images/set/closed_pop.png" alt="" ng-click="picker_add_cancel()"
                class="item_right_time_icon_cancel">
              <input autocomplete="off" class="item_right_input" type="text" placeholder="请选择公开日期"
                id="start_time_picker">
            </div>
          </div>
          <!-- 情报来源 -->
          <div class="contnet_item">
            <div class="contnet_item_left">
              <img src="/images/set/add_icon_4.png" alt="">
              <span>情报来源:</span>
            </div>
            <div class="contnet_item_right">
              <img src="/images/set/label_triangle_down.png" class="select_down_icon" alt="">
              <input autocomplete="off" class="item_right_input" id="input_source_add" ng-model="add_item.sourse"
                placeholder="请选择来源或按Enter键添加新来源" ng-keyup="add_source_mykey($event)" ng-focus="add_focus('source')"
                ng-blur="add_blur('source');" ng-change="add_source_change(add_item.sourse)" type="text">
              <ul class="select_list_box select_list_box_height select_list_margin" ng-if="pop_show.add_source_list" id="loop_source_add">
                <li ng-mousedown="choose_item(item.name,index,'source');"
                  ng-class="{'add_bg':tag_key_add.active_index == $index}"
                  ng-repeat="item in loop_source_add track by $index">
                  {{item.name}}
                </li>
              </ul>
            </div>
          </div>
          <!-- 影响产品 -->
          <div class="contnet_item">
            <div class="contnet_item_left">
              <img src="/images/set/loop_icon_5.png" alt="">
              <span>影响产品:</span>
            </div>
            <div class="contnet_item_right" style="flex-direction: column;">
              <div ng-repeat="(index,item) in add_item.affected" style="flex:1; display:flex;margin-bottom:10px;">
                <div class="tag_item" style="flex:1;">
                  <input autocomplete="off" type="text" placeholder="请输入影响产品" ng-model='item.name'
                    class="item_right_input">
                </div>
                <div class="add_icon_box">
                  <img src="/images/set/add_input_icon.png" ng-click="add_input_list('affected',index)" class="add_icon"
                    alt="">

                  <img src="/images/set/cel_icon.png" ng-if="add_item.affected.length!=1"
                    ng-click="delete_input_list('affected',index)" class="add_icon" alt="">
                  <img src="/images/set/del_grey.png" style="cursor:not-allowed"
                    ng-if="add_item.affected.length==1&&item.name==''" class="add_icon" alt="">
                  <img src="/images/set/cel_icon.png" ng-if="add_item.affected.length==1&&item.name!=''"
                    ng-click="delete_input_list('affected',index)" class="add_icon" alt="">


                </div>
              </div>
            </div>
          </div>
          <!-- 漏洞描述 -->
          <div class="contnet_item">
            <div class="contnet_item_left">
              <img src="/images/set/add_icon_6.png" alt="">
              <span>漏洞描述:</span>
            </div>
            <div class="contnet_item_right">
              <textarea class="item_right_input" style="resize:none;line-height:2.0" placeholder="请输入漏洞描述"
                ng-model="add_item.detail" name="" id="" cols="30" rows="3"></textarea>
            </div>
          </div>
          <!-- 建议处理措施 -->
          <div class="contnet_item">
            <div class="contnet_item_left">
              <img src="/images/set/loop_icon_7.png" alt="">
              <span>建议处理措施:</span>
            </div>
            <div class="contnet_item_right">
              <textarea class="item_right_input" style="resize:none;line-height:2.0" placeholder="请输入建议处理措施"
                ng-model="add_item.treatment_measures" name="" id="" cols="30" rows="3"></textarea>
            </div>
          </div>

          <!-- 参考信息 -->
          <div class="contnet_item">
            <div class="contnet_item_left">
              <img src="/images/set/add_icon_8.png" alt="">
              <span>参考信息:</span>
            </div>
            <div class="contnet_item_right" style="flex-direction: column;">
              <div ng-repeat="(index,item) in add_item.reference" style="flex:1; display:flex;margin-bottom:10px;">
                <div class="tag_item" style="flex:1;">
                  <input autocomplete="off" type="text" placeholder="请输入参考信息" ng-model='item.name'
                    class="item_right_input">
                </div>
                <div class="add_icon_box">
                  <img src="/images/set/add_input_icon.png" ng-click="add_input_list('reference',index)"
                    class="add_icon" alt="">
                  <img src="/images/set/cel_icon.png" ng-if="add_item.reference.length!=1"
                    ng-click="delete_input_list('reference',index)" class="add_icon" alt="">
                  <img src="/images/set/del_grey.png" style="cursor:not-allowed"
                    ng-if="add_item.reference.length==1&&item.name==''" class="add_icon" alt="">
                  <img src="/images/set/cel_icon.png" ng-if="add_item.reference.length==1&&item.name!=''"
                    ng-click="delete_input_list('reference',index)" class="add_icon" alt="">
                </div>
              </div>
            </div>
          </div>
          <!-- 标签 -->
          <div class="contnet_item">
            <div class="contnet_item_left">
              <img src="/images/set/add_icon_9.png" alt="">
              <span>标签:</span>
            </div>
            <div class="contnet_item_right" style="flex-direction: column;">
              <div style="flex:1; display:flex;margin-bottom:10px;"
                ng-repeat="(index,item) in add_item.tag track by $index">
                <div class="tag_item">
                  <input autocomplete="off" type="text" placeholder="请选择标签类别" ng-model="item.category"
                    ng-focus="add_focus('tag_category',index)" ng-blur="add_blur('tag_category',index);"
                    class="item_right_input" readonly>
                  <img src="/images/set/label_triangle_down.png" class="select_down_icon" alt="">
                  <ul class="select_list_box select_list_box_height" ng-if="item.category_ul">
                    <li ng-mousedown="choose_item(key.name,index,'tag_category');"
                      ng-repeat="key in label_data track by $index">
                      {{key.name}}
                    </li>
                  </ul>
                </div>
                <!--<div class="tag_item">
                  <input type="text" placeholder="请选择标签名称" ng-focus="add_focus('tag_name',index)"
                    ng-blur="add_blur('tag_name',index);" ng-disabled="item.category==''" ng-model="item.name"
                    class="item_right_input" readonly>
                  <img src="/images/set/label_triangle_down.png" class="select_down_icon" alt="">
                  <ul class="select_list_box" style="margin-top:0" ng-if="item.name_ul">
                    <li ng-repeat="key in item.tag_name_list" ng-mousedown="choose_item(key,index,'tag_name');">
                      {{key.label_name}}
                    </li>
                  </ul>
                </div>-->

                <div class="tag_item tag_item_{{$index}}">
                  <input autocomplete="off" type="text" placeholder="请选择标签名称" ng-model="item.name"
                    class="item_right_input label_auto_complate" id="label_auto_complate_{{$index}}">
                  <!--<img src="/images/set/label_triangle_down.png" class="select_down_icon" alt="" />-->
                </div>

                <div class="add_icon_box">
                  <img src="/images/set/add_input_icon.png" ng-click="add_input_list('tag',index)" class="add_icon"
                    alt="">
                  <img src="/images/set/cel_icon.png" ng-if="add_item.tag.length!=1"
                    ng-click="delete_input_list('tag',index)" class="add_icon" alt="">
                  <img src="/images/set/del_grey.png" style="cursor:not-allowed"
                    ng-if="add_item.tag.length==1&&item.name==''" class="add_icon" alt="">
                  <img src="/images/set/cel_icon.png" ng-if="add_item.tag.length==1&&item.name!=''"
                    ng-click="delete_input_list('tag',index)" class="add_icon" alt="">
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
              <div ng-repeat="(index,item) in add_item.NVD" style="flex:1; display:flex;margin-bottom:10px;">
                <div class="tag_item" style="flex:1;">
                  <input autocomplete="off" type="text" placeholder="请选择NVD关联" id="{{'input'+index}}"
                    ng-change="add_nvd_change(item.name)" ng-keyup="add_nvd_mykey($event,item,index)"
                    ng-model='item.name' ng-focus="add_nvd_focus(index,item)" ng-blur="add_blur('NVD',index);"
                    class="item_right_input">
                  <img src="/images/set/label_triangle_down.png" class="select_down_icon" alt="">
                  <ul class="select_list_box select_list_box_height" style="margin-bottom:10px;"  id="{{'nvd'+index}}" ng-if="item.nvd_ul">
                    <li ng-repeat="key in nvd_list" ng-class="{'add_bg':tag_key_add.active_index == $index}"
                      ng-mousedown="choose_nvd_item(key,index);">
                      {{key.cve}}
                    </li>
                  </ul>
                </div>
                <div class="add_icon_box">
                  <img src="/images/set/add_input_icon.png" ng-click="add_input_list('NVD',index)" class="add_icon"
                    alt="">
                  <img src="/images/set/cel_icon.png" ng-if="add_item.NVD.length!=1"
                    ng-click="delete_input_list('NVD',index)" class="add_icon" alt="">
                  <img src="/images/set/del_grey.png" style="cursor:not-allowed"
                    ng-if="add_item.NVD.length==1&&item.name==''" class="add_icon" alt="">
                  <img src="/images/set/cel_icon.png" ng-if="add_item.NVD.length==1&&item.name!=''"
                    ng-click="delete_input_list('NVD',index)" class="add_icon" alt="">
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="alert_btn_box">
        <button class="alert_btn_ok" ng-click="add_sure()">保存</button>
        <button class="alert_btn_cancel" ng-click="add_cancel()">取消</button>
      </div>
    </div>
  </div>
  <!-- 编辑弹窗 -->
  <div class="pop_box" ng-show="pop_show.edit">
    <div class="pop_contnet">
      <div class="contnet_title_box">
        <p class="pop_contnet_title">漏洞情报编辑</p>
        <img src="/images/set/closed_pop.png" ng-click="edit_cancel()" class="closed_img" alt="">
      </div>
      <div class="pop_box_container">
        <div class="contnet">
          <div class="contnet_item">
            <div class="contnet_item_left">
              <img src="/images/set/add_icon_1.png" alt="">
              <span>情报标题:</span>
            </div>
            <div class="contnet_item_right">
              <input autocomplete="off" type="text" placeholder="请输入情报标题" ng-model="edit_item.title"
                class="item_right_input">
            </div>
          </div>
          <div class="contnet_item">
            <div class="contnet_item_left">
              <img src="/images/set/add_icon_2.png" alt="">
              <span>漏洞等级:</span>
            </div>
            <div class="contnet_item_right">
              <div class="tag_item" style="margin:0">
                <img src="/images/set/label_triangle_down.png" class="select_down_icon" alt="">
                <input autocomplete="off" type="text" placeholder="请选择漏洞等级" ng-model="edit_item.level"
                  ng-focus="edit_focus('level')" ng-blur="edit_blur('level');" class="item_right_input" readonly>
              </div>
              <ul class="select_list_box select_list_margin" ng-if="pop_show.edit_level_list" >
                <li ng-mousedown="choose_item_edit(item.name,$index,'level');"
                  ng-class="{'add_bg':tag_key_add.active_index == $index}"
                  ng-repeat="item in edit_item.level_list track by $index">
                  {{item.name}}
                </li>
              </ul>
            </div>
          </div>
          <div class="contnet_item">
            <div class="contnet_item_left">
              <img src="/images/set/add_icon_3.png" alt="">
              <span>公开日期:</span>
            </div>
            <div class="contnet_item_right">
              <img src="/images/report/time.png" alt="" class="item_right_time_icon">
              <img src="/images/set/closed_pop.png" alt="" ng-click="picker_edit_cancel()"
                class="item_right_time_icon_cancel">
              <input autocomplete="off" class="item_right_input" type="text" placeholder="请选择公开日期" id="picker_edit">
            </div>
          </div>
          <!-- 情报来源 -->
          <div class="contnet_item">
            <div class="contnet_item_left">
              <img src="/images/set/add_icon_4.png" alt="">
              <span>情报来源:</span>
            </div>
            <div class="contnet_item_right">
              <img src="/images/set/label_triangle_down.png" class="select_down_icon" alt="">
              <input autocomplete="off" class="item_right_input" id="input_source_edit" ng-model="edit_item.sourse"
                placeholder="请选择来源或按Enter键添加新来源" ng-keyup="edit_source_mykey($event)" ng-focus="edit_focus('source')"
                ng-blur="edit_blur('source');" ng-change="edit_source_change(edit_item.sourse)" type="text">
              <ul class="select_list_box select_list_box_height select_list_margin" ng-if="pop_show.edit_source_list" id="loop_source_edit">
                <li ng-mousedown="choose_item_edit(item.name,index,'source');"
                  ng-class="{'add_bg':tag_key_add.active_index == $index}"
                  ng-repeat="item in loop_source_add track by $index">
                  {{item.name}}
                </li>
              </ul>
            </div>
          </div>
          <!-- 影响产品 -->
          <div class="contnet_item">
            <div class="contnet_item_left">
              <img src="/images/set/add_icon_8.png" alt="">
              <span>影响产品:</span>
            </div>
            <div class="contnet_item_right" style="flex-direction: column;">
              <div ng-repeat="(index,item) in edit_item.affected" style="flex:1; display:flex;margin-bottom:10px;">
                <div class="tag_item" style="flex:1;">
                  <input autocomplete="off" type="text" placeholder="请输入影响产品" ng-model='item.name'
                    class="item_right_input">
                </div>
                <div class="add_icon_box">
                  <img src="/images/set/add_input_icon.png" ng-click="edit_add_input_list('affected',index)"
                    class="add_icon" alt="">

                  <img src="/images/set/cel_icon.png" ng-if="edit_item.affected.length!=1"
                    ng-click="edit_delete_input_list('affected',index)" class="add_icon" alt="">
                  <img src="/images/set/del_grey.png" style="cursor:not-allowed"
                    ng-if="edit_item.affected.length==1&&item.name==''" class="add_icon" alt="">
                  <img src="/images/set/cel_icon.png" ng-if="edit_item.affected.length==1&&item.name!=''"
                    ng-click="edit_delete_input_list('affected',index)" class="add_icon" alt="">
                </div>
              </div>
            </div>
          </div>
          <!-- 漏洞描述 -->
          <div class="contnet_item">
            <div class="contnet_item_left">
              <img src="/images/set/add_icon_6.png" alt="">
              <span>漏洞描述:</span>
            </div>
            <div class="contnet_item_right">
              <textarea class="item_right_input" style="resize:none;line-height:2.0" placeholder="请输入漏洞描述"
                ng-model="edit_item.detail" name="" id="" cols="30" rows="3"></textarea>
            </div>
          </div>
          <!-- 建议处理措施 -->
          <div class="contnet_item">
            <div class="contnet_item_left">
              <img src="/images/set/loop_icon_7.png" alt="">
              <span>建议处理措施:</span>
            </div>
            <div class="contnet_item_right">
              <textarea class="item_right_input" style="resize:none;line-height:2.0" placeholder="请输入建议处理措施"
                ng-model="edit_item.treatment_measures" name="" id="" cols="30" rows="3"></textarea>
            </div>
          </div>
          <!-- 参考信息 -->
          <div class="contnet_item">
            <div class="contnet_item_left">
              <img src="/images/set/add_icon_8.png" alt="">
              <span>参考信息:</span>
            </div>
            <div class="contnet_item_right" style="flex-direction: column;">
              <div ng-repeat="(index,item) in edit_item.reference" style="flex:1; display:flex;margin-bottom:10px;">
                <div class="tag_item" style="flex:1;">
                  <input autocomplete="off" type="text" placeholder="请输入参考信息" ng-model='item.name'
                    class="item_right_input">
                </div>
                <div class="add_icon_box">
                  <img src="/images/set/add_input_icon.png" ng-click="edit_add_input_list('reference',index)"
                    class="add_icon" alt="">
                  <img src="/images/set/cel_icon.png" ng-if="edit_item.reference.length!=1"
                    ng-click="edit_delete_input_list('reference',index)" class="add_icon" alt="">
                  <img src="/images/set/del_grey.png" style="cursor:not-allowed"
                    ng-if="edit_item.reference.length==1&&item.name==''" class="add_icon" alt="">
                  <img src="/images/set/cel_icon.png" ng-if="edit_item.reference.length==1&&item.name!=''"
                    ng-click="edit_delete_input_list('reference',index)" class="add_icon" alt="">
                </div>
              </div>
            </div>
          </div>
          <!-- 标签 -->
          <div class="contnet_item">
            <div class="contnet_item_left">
              <img src="/images/set/add_icon_9.png" alt="">
              <span>标签:</span>
            </div>
            <div class="contnet_item_right" style="flex-direction: column;">
              <div style="flex:1; display:flex;margin-bottom:10px;" ng-repeat="(index,item) in edit_item.tag">
                <div class="tag_item">
                  <input autocomplete="off" type="text" placeholder="请选择标签类别" ng-model="item.category"
                    ng-focus="edit_focus('tag_category',index)" ng-blur="edit_blur('tag_category',index);"
                    class="item_right_input" readonly>
                  <img src="/images/set/label_triangle_down.png" class="select_down_icon" alt="">
                  <ul class="select_list_box select_list_box_height" ng-if="item.category_ul">
                    <li ng-mousedown="choose_item_edit(key.name,index,'tag_category');"
                      ng-repeat="key in label_data track by $index">
                      {{key.name}}
                    </li>
                  </ul>
                </div>
                <!-- <div class="tag_item">
                  <input type="text" placeholder="请选择标签名称" ng-focus="edit_focus('tag_name',index)"
                    ng-blur="edit_blur('tag_name',index);" ng-disabled="item.category==''" ng-model="item.name"
                    class="item_right_input" readonly>
                  <img src="/images/set/label_triangle_down.png" class="select_down_icon" alt="">
                  <ul class="select_list_box" style="margin-top:0" ng-if="item.name_ul">
                    <li ng-repeat="key in item.tag_name_list" ng-mousedown="choose_item_edit(key,index,'tag_name');">
                      {{key.label_name}}
                    </li>
                  </ul>
                </div>-->

                <div class="tag_item edit_item_{{$index}}">
                  <input autocomplete="off" type="text" placeholder="请选择标签名称" ng-model="item.name"
                    class="item_right_input label_edit_complate" id="edit_auto_complate_{{$index}}">
                  <!--<img src="/images/set/label_triangle_down.png" class="select_down_icon" alt="" />-->
                </div>

                <div class="add_icon_box">
                  <img src="/images/set/add_input_icon.png" ng-click="edit_add_input_list('tag',index)" class="add_icon"
                    alt="">
                  <img src="/images/set/cel_icon.png" ng-if="edit_item.tag.length!=1"
                    ng-click="edit_delete_input_list('tag',index)" class="add_icon" alt="">
                  <img src="/images/set/del_grey.png" style="cursor:not-allowed"
                    ng-if="edit_item.tag.length==1&&item.name==''" class="add_icon" alt="">
                  <img src="/images/set/cel_icon.png" ng-if="edit_item.tag.length==1&&item.name!=''"
                    ng-click="edit_delete_input_list('tag',index)" class="add_icon" alt="">
                </div>
              </div>
            </div>
          </div>
          <!-- nvd -->
          <div class="contnet_item">
            <div class="contnet_item_left">
              <img src="/images/set/add_icon_10.png" alt="">
              <span>NVD关联:</span>
            </div>
            <div class="contnet_item_right" style="flex-direction: column;">
              <div ng-repeat="(index,item) in edit_item.NVD" style="flex:1; display:flex;margin-bottom:10px;">
                <div class="tag_item" style="flex:1;">
                  <input type="text" autocomplete="off" placeholder="请选择NVD关联" id="{{'input_edit'+index}}"
                    ng-change="edit_nvd_change(item.name)" ng-keyup="edit_nvd_mykey($event,item,index)"
                    ng-model='item.name' ng-model='item.name' ng-focus="edit_nvd_focus(index,item)"
                    ng-blur="edit_blur('NVD',index);" class="item_right_input">
                  <img src="/images/set/label_triangle_down.png" class="select_down_icon" alt="">
                  <ul class="select_list_box select_list_box_height" style="margin-bottom:10px;" id="{{'nvd_edit'+index}}" ng-if="item.nvd_ul">
                    <li ng-repeat="key in nvd_list" ng-class="{'add_bg':tag_key_add.active_index == $index}"
                      ng-mousedown="choose_nvd_item_edit(key,index);">
                      {{key.cve}}
                    </li>
                  </ul>
                </div>
                <div class="add_icon_box">
                  <img src="/images/set/add_input_icon.png" ng-click="edit_add_input_list('NVD',index)" class="add_icon"
                    alt="">
                  <img src="/images/set/cel_icon.png" ng-if="edit_item.NVD.length!=1"
                    ng-click="edit_delete_input_list('NVD',index)" class="add_icon" alt="">
                  <img src="/images/set/del_grey.png" style="cursor:not-allowed"
                    ng-if="edit_item.NVD.length==1&&item.name==''" class="add_icon" alt="">
                  <img src="/images/set/cel_icon.png" ng-if="edit_item.NVD.length==1&&item.name!=''"
                    ng-click="edit_delete_input_list('NVD',index)" class="add_icon" alt="">

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="alert_btn_box">
        <button class="alert_btn_ok" ng-click="edit_sure()">保存</button>
        <button class="alert_btn_cancel" ng-click="edit_cancel()">取消</button>
      </div>
    </div>
  </div>
  <!-- 删除 -->
  <div style="display: none;" id="cate_delete_box_2">
    <div id="cate_delete_2">
      <div class="cate_content">
        <p class="cate_tip">请确认是否删除此情报？</p>
      </div>
      <div class="cate_btn_delete_box">
        <button class="cate_btn_ok" ng-click="cate_delete_ok()">确认</button>
        <button class="cate_btn_cancel" ng-click="cate_delete_cancel();">取消</button>
      </div>
    </div>
  </div>


</section>
<script src="/js/controllers/loophole_intel.js"></script>
