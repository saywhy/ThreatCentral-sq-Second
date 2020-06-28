var myApp = angular.module("myApp", []);
myApp.controller("vehicleTelLoopholeCtrl", function ($scope, $http, $filter, $document) {

    $scope.init = function () {
        $scope.label_data = [];

        //展开\折叠更多
        $scope.toggleCount = 2;
        $scope.toggleStatus = false;

        //漏洞来源、级别下拉框显隐状态
        $scope.search_box_ul = {
            source: false,
            level: false
        }

        //前端选中标签展示列表
        $scope.label_checked_list = [];

        $scope.searchTime = {
            startDate: '',
            endDate: ''
        };

        $scope.seach_data = {
            source: '',
            status: '',
            label_id: [],
            key_word: '',
            level: '全部',
            startDate: '',
            endDate: '',
        };

        //漏洞级别
        $scope.search_level = [{
                num: '全部',
                status: '全部'
            },
            {
                num: '',
                status: '暂缺'
            },
            {
                num: '高',
                status: '高'
            },
            {
                num: '中',
                status: '中'
            },
            {
                num: '低',
                status: '低'
            }
        ];

        $scope.page_num = 1;
        $scope.pop_show = false;

        $scope.picker_search();
        $scope.get_loophole_source();
        $scope.get_lab_list();
        $scope.get_page();
    }

    //初始化时间
    $scope.picker_search = function () {
        $("#picker_search").daterangepicker({
                autoUpdateInput: false,
                'locale': {
                    "format": 'YYYY/MM/DD',
                    "separator": " - ",
                    "applyLabel": "确定",
                    "cancelLabel": "清空",
                    "fromLabel": "起始时间",
                    "customRangeLabel": "自定义",
                    "toLabel": "结束时间'",
                    "weekLabel": "W",
                    "daysOfWeek": ["日", "一", "二", "三", "四", "五", "六"],
                    "monthNames": ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
                    "firstDay": 1
                },
                showDropdowns: true,
                "alwaysShowCalendars": true,
                timePickerSeconds: false,
                drops: "down",
                opens: "right",
                ranges: {
                    '最近7天': [moment().subtract(6, 'days'), moment()],
                    '最近30天': [moment().subtract(29, 'days'), moment()],
                    '今年': [moment().startOf('year'), moment()],
                    '去年': [moment().subtract(1, 'year').startOf('year'), moment().subtract(1, 'year')
                        .endOf('year')
                    ],
                },
            },
            function (start, end, label) {
                $scope.seach_data.startDate = start.unix();
                $scope.seach_data.endDate = end.unix();
            },
        )
        $('#picker_search').on('apply.daterangepicker', function (ev, picker) {
            $(this).val(picker.startDate.format('YYYY/MM/DD') + ' - ' + picker.endDate.format('YYYY/MM/DD'));
            $scope.seach_data.startDate = picker.startDate.unix()
            $scope.seach_data.endDate = picker.endDate.unix()
        });
        $('#picker_search').on('cancel.daterangepicker', function (ev, picker) {
            $(this).val('');
            $scope.seach_data.startDate = ''
            $scope.seach_data.endDate = ''
        });
    };
    // 漏洞来源下拉框
    $scope.get_loophole_source = function () {
        $http({
            method: "get",
            url: "/site/loophole-intelligence-sourse",
            params: {
                sourse: '',
                status: 1
            }
        }).then(function (resp) {
                $scope.loop_source = [];
                angular.forEach(resp.data, function (item) {
                    $scope.loop_source.push($scope.escape2Html(item.sourse));
                })
                $scope.loop_source.unshift('全部');
            },
            function () {}
        );
    }
    $scope.escape2Html = function (str) {
        var arrEntities = {
            'lt': '<',
            'gt': '>',
            'nbsp': ' ',
            'amp': '&',
            'quot': '"'
        };
        return str.replace(/&(lt|gt|nbsp|amp|quot);/ig, function (all, t) {
            return arrEntities[t];
        });
    }
    // 获取标签列表
    $scope.get_lab_list = function () {

        var loading = zeroModal.loading(4);

        $http({
            method: "get",
            url: "/site/label-list",
        }).then(function (resp) {

                zeroModal.close(loading);

                if (resp.status == 200) {

                    let result = JSON.parse(resp.data);

                    let labelAttr = [];

                    angular.forEach(result, function (key, value) {

                        if (value === '' || value === null) {
                            value = '未分类标签';
                        } else {
                            value = value.substring(0, value.length - 10);
                        }

                        labelAttr.push({
                            name: value,
                            label: key,
                            label_attr_id: []
                        });
                    });

                    $scope.label_data = labelAttr;
                    angular.forEach($scope.label_data, function (item) {
                        item.name = $scope.escape2Html(item.name)
                        angular.forEach(item.label, function (key) {
                            if (key.label_name) {
                                key.label_name = $scope.escape2Html(key.label_name)
                            }
                            if (key.category_name) {
                                key.category_name = $scope.escape2Html(key.category_name)
                            }
                            if (key.detail) {
                                key.detail = $scope.escape2Html(key.detail)
                            }
                        });
                    });
                }
            },
            function () {}
        );
    }

    //展开、收起按钮切换事件
    $scope.tog_count_change = function (e) {

        e.preventDefault();

        let length = $scope.label_data.length;

        if (length <= 3) {
            $scope.toggleCount = length;
            $scope.toggleStatus = !$scope.toggleStatus;
        } else {
            let toggle = $scope.toggleCount += 3;
            let tog = Math.ceil(toggle / 3);
            let label = Math.ceil($scope.label_data.length / 3);
            $scope.toggleCount = tog > label ? 2 : toggle;
            $scope.toggleStatus = tog == label ? true : false;
        }
    }

    //标签列表事件高亮切换
    $scope.tog_change_status = function (e, item, it) {

        $(e.target).toggleClass('active');

        let isActive = $(e.target).hasClass('active');

        if (isActive) {

            angular.forEach($scope.label_data, function (value, key) {

                if (value.name == item.name) {
                    //每个类别的id数组（后端需要）
                    value.label_attr_id.push(it.id);
                    //前端展示的列表数据
                    $scope.label_checked_list.push(it);
                }
            });

        } else {

            angular.forEach($scope.label_data, function (value, key) {
                if (value.name == item.name) {
                    for (let i = 0; i < value.label_attr_id.length; i++) {
                        if (value.label_attr_id[i] == it.id) {
                            value.label_attr_id.splice(i, 1);
                        }
                    }
                    for (let j = 0; j < $scope.label_checked_list.length; j++) {
                        if ($scope.label_checked_list[j].id == it.id) {
                            $scope.label_checked_list.splice(j, 1);
                        }
                    }
                }
            });
        }

        //向后端传递label_id的数组拼接
        var attr = [];
        angular.forEach($scope.label_data, function (value, key) {
            if (value.label_attr_id.length > 0) {
                attr.push(value.label_attr_id);
            }
        });
        //向后端传递的label_id（每个类别的id数组的组合）
        $scope.seach_data.label_id = attr;

        $scope.get_page();
    };

    //漏洞情报事件详情
    $scope.list_item_click = function (e, item) {

        e.preventDefault();
        item.label_new_name = [];
        angular.forEach(item.label_name_ext, function (value, key) {
            item.label_new_name.push({
                name: key.substring(0, key.length - 10),
                value: value
            })
        });

        $scope.label_item_data = item;
        console.log($scope.label_item_data);

        $scope.label_item_data.detail = $scope.label_item_data.detail.trim();
        $scope.label_item_data.detail = $scope.label_item_data.detail.replace(/[\r\n]/g, "");;
        $scope.pop_show = true;

        // var W = 740;
        // var H = 593;

        // zeroModal.show({
        //     title: "",
        //     content: vehicle_loophole,
        //     width: W + "px",
        //     height: H + "px",
        //   /*  width: W + "px",
        //     height: "90%",*/
        //     ok: false,
        //     cancel: false,
        //     drag: false,
        //     okFn: function () {},
        //     onOpen: function () {},
        //     onCleanup: function () {
        //         vehicle_loophole_box.appendChild(vehicle_loophole);
        //     }
        // });
    }
    $scope.pop_cancel = function () {
        $scope.pop_show = false;
    }
    //标签管理搜索enter事件
    $scope.vehicle_key_up = function ($event) {

        var keycode = window.event ? $event.keyCode : $event.which;

        if (keycode == 13) {
            $scope.get_page();
        }
    };

    /*修改搜索框*/
    // 搜索框获取焦点
    $scope.search_focus = function (name) {
        switch (name) {
            case 'source':
                $scope.search_box_ul.source = true;
                break;
            case 'level':
                $scope.search_box_ul.level = true;
                break;
            default:
                break;
        }

    }

    // 搜索框失去焦点
    $scope.search_blur = function (name) {
        switch (name) {
            case 'source':
                $scope.search_box_ul.source = false;
                break;
            case 'level':
                $scope.search_box_ul.level = false;
                break;
            default:
                break;
        }
    }

    // 搜索栏选择
    $scope.search_choose_item = function (data, index, name) {
        switch (name) {
            case 'source':
                $scope.seach_data.source = data
                break;
            case 'stauts':
                $scope.seach_data.stauts = data
                break;
            case 'level':
                $scope.seach_data.level = data
                break;
            default:
                break;
        }
    }


    //nvd详情
    $scope.list_item_click_nvd = function (e, items) {

        e.preventDefault();

        $http({
            method: "get",
            url: "/site/cve-list",
            params: {
                cve: items,
            }
        }).then(function (resp) {
                $scope.base_data = resp.data[0];
                var W = 740;
                var H = 484;

                zeroModal.show({
                    title: "",
                    content: vehicle_loophole_nvd,
                    width: W + "px",
                    height: H + "px",
                    ok: false,
                    cancel: false,
                    drag: false,
                    okFn: function () {},
                    onOpen: function () {},
                    onCleanup: function () {
                        vehicle_loophole_box_nvd.appendChild(vehicle_loophole_nvd);
                    }
                });
            },
            function () {}
        );



    };

    // 获取列表
    $scope.get_page = function (pageNow) {
        pageNow = pageNow ? pageNow : 1;
        var loading = zeroModal.loading(4);
        var params_data = {
            source: '',
            level: '',
            label_id: []
        }

        if (pageNow < 1) {
            pageNow = 1;
            $scope.page_num = 1;
        }

        if ($scope.pages && pageNow > $scope.pages.maxPage) {
            pageNow = 1;
            $scope.page_num = 1;
        }

        if ($scope.seach_data.source != '全部') {
            params_data.source = $scope.seach_data.source
        }

        if ($scope.seach_data.level == '全部') {
            params_data.level = 'all';
        } else if ($scope.seach_data.level == '暂缺') {
            params_data.level = '';
        } else {
            params_data.level = $scope.seach_data.level;
        }

        $http({
            method: "get",
            url: "/vehicleintelligence/loophole-intelligence-list",
            params: {
                stime: $scope.seach_data.startDate,
                etime: $scope.seach_data.endDate,
                sourse: params_data.source,
                status: '1',
                level: params_data.level,
                //label_id: params_data.label_id_str,
                label_id: JSON.stringify($scope.seach_data.label_id),
                key_word: $scope.seach_data.key_word,
                page: pageNow,
                rows: 10,
            }
        }).then(function (data) {
                zeroModal.close(loading);
                $scope.pages = data.data;
                $scope.pages.pageNow = $scope.pages.pageNow * 1
                angular.forEach($scope.pages.data, function (item) {

                    item.nvd_name = item.nvd.map(its => {return its.cve})

                    if(item.nvd_name.length == 0){
                        item.new_nvd_name = '';
                        item.new_nvd_name_title = '';
                    }else if(item.nvd_name.length == 1){
                        item.new_nvd_name = item.nvd_name[0];
                        item.new_nvd_name_title = item.nvd_name[0];
                    }else {
                        item.new_nvd_name = item.nvd_name[0] + '...';
                        item.new_nvd_name_title = item.nvd_name.join(',');
                    }

                    item.title = $scope.escape2Html(item.title)
                    item.detail = $scope.escape2Html(item.detail)
                    item.sourse = $scope.escape2Html(item.sourse)
                    item.treatment_measures = $scope.escape2Html(item.treatment_measures)
                    angular.forEach(item.affected_products, function (key, index) {
                        item.affected_products[index] = $scope.escape2Html(key)
                    })
                    angular.forEach(item.reference_information, function (key, index) {
                        item.reference_information[index] = $scope.escape2Html(key)
                    })
                })
            },
            function () {}
        );
    }

    $scope.init();
});
