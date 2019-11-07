var myApp = angular.module("myApp", []);
myApp.controller("loopholeIntelCtrl", function ($scope, $http, $filter) {
    $scope.init = function () {
        $scope.searchTime = {
            startDate: moment().subtract(90, "days"),
            endDate: moment()
        };
        $scope.seach_data = {
            source: '全部',
            stauts: '',
            label_id: '',
            key_word: '',
            level: '',
            startDate: moment().subtract(90, "days").unix(),
            endDate: moment().unix(),
        };
        $scope.status_search = [{
                num: '',
                status: '全部'
            },
            {
                num: '1',
                status: '已发布'
            },
            {
                num: '0',
                status: '未发布'
            }
        ]
        $scope.search_level = [{
                num: '',
                status: '全部'
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
        ]
        $scope.add_level = [{
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
        ]

        $scope.add_startDate = moment().unix();
        $scope.picker_search();
        $scope.start_time_picker();
        $scope.get_loophole_source();
        $scope.get_tag_list();
        $scope.get_page();
        $scope.tag_list_if = false;
    }
    // 初始化时间
    $scope.start_time_picker = function () {
        $("#start_time_picker").daterangepicker({
                singleDatePicker: true,
                showDropdowns: true,
                timePicker: true,
                timePicker24Hour: true,
                drops: "down",
                opens: "center",
                startDate: moment(),
                locale: {
                    applyLabel: "确定",
                    cancelLabel: "取消",
                    format: "YYYY-MM-DD HH:mm:ss"
                }
            },
            function (start, end, label) {
                $scope.add_startDate = start.unix()
            }
        );
    };
    $scope.picker_search = function () {
        $("#picker_search").daterangepicker({
                showDropdowns: true,
                timePicker: true,
                timePicker24Hour: true,
                drops: "down",
                opens: "right",
                maxDate: $scope.searchTime.endDate,
                startDate: $scope.searchTime.startDate,
                endDate: $scope.searchTime.endDate,
                locale: {
                    applyLabel: "确定",
                    cancelLabel: "取消",
                    format: "YYYY-MM-DD HH:mm"
                }
            },
            function (start, end, label) {
                $scope.seach_data.startDate = start.unix();
                $scope.seach_data.endDate = end.unix();
            }
        );
    };
    $scope.picker_edit = function (startDate) {
        $("#picker_edit").daterangepicker({
                singleDatePicker: true,
                showDropdowns: true,
                timePicker: true,
                timePicker24Hour: true,
                drops: "down",
                opens: "center",
                startDate: startDate,
                locale: {
                    applyLabel: "确定",
                    cancelLabel: "取消",
                    format: "YYYY-MM-DD HH:mm:ss"
                }
            },
            function (start, end, label) {
                $scope.edit_time = start.unix()
            }
        );
    };
    // 漏洞来源
    $scope.get_loophole_source = function () {
        $http({
            method: "get",
            url: "/site/intelligence-sourse",
            params: {
                sourse: ''
            }
        }).then(
            function (data) {
                $scope.loop_source = [];
                $scope.loop_source_add = [];
                angular.forEach(data.data, function (item) {
                    $scope.loop_source.push(item.sourse);
                    $scope.loop_source_add.push(item.sourse);
                })
                $scope.loop_source.push('全部');
                $scope.loop_source_add.push('请选择');
            },
            function () {}
        );
    }
    // 获取列表
    $scope.get_page = function (pageNow) {
        pageNow = pageNow ? pageNow : 1;
        var loading = zeroModal.loading(4);
        var params_data = {
            source: '',
            label_id: [],
            label_id_box: [],
            label_id_str: '',
        }
        if ($scope.seach_data.source != '全部') {
            console.log('1231');
            params_data.source = $scope.seach_data.source
        }
        if ($scope.seach_data.label_id != '') {
            params_data.label_id.push($scope.seach_data.label_id * 1);
            params_data.label_id_box.push(params_data.label_id)
            params_data.label_id_str = JSON.stringify(params_data.label_id_box);
        } else {
            params_data.label_id_str = '[]'
        }
        console.log(params_data);
        $http({
            method: "get",
            url: "/vehicleintelligence/loophole-intelligence-list",
            params: {
                stime: $scope.seach_data.startDate,
                etime: $scope.seach_data.endDate,
                sourse: params_data.source,
                status: $scope.seach_data.stauts,
                level: $scope.seach_data.level,
                label_id: params_data.label_id_str,
                key_word: $scope.seach_data.key_word,
                page: pageNow,
                rows: 10,
            }
        }).then(
            function (data) {
                zeroModal.close(loading);
                $scope.pages = data.data;
            },
            function () {}
        );
    }

    // 情报录入-弹窗
    $scope.add_loop_box = function (item) {
        $scope.alert_item = {
            title: '',
            level: '高',
            first_seen_time: '',
            sourse: '请选择',
            detail: '',
            label_id: {
                exist: [],
                unexist: []
            },
            tag_list: [],
            add_new_tag: [],
            tag_list_str: '',
        }
        var W = 828;
        var H = 620;
        zeroModal.show({
            title: "情报录入",
            content: alert_time,
            width: W + "px",
            height: H + "px",
            ok: false,
            cancel: false,
            okFn: function () {},
            onCleanup: function () {
                alert_time_box.appendChild(alert_time);
            }
        });
    };
    //   取消弹窗
    $scope.add_cancel = function () {
        zeroModal.closeAll();
    };
    // 添加漏洞情报
    $scope.add_sure = function () {
        var label_id_exist = []
        if ($scope.alert_item.label_id.exist.length != 0) {
            angular.forEach($scope.alert_item.label_id.exist, function (item) {
                label_id_exist.push(item.id)
            })
        }
        if ($scope.alert_item.sourse == '请选择') {
            zeroModal.error('请选择情报来源')
            return false
        }
        if ($scope.alert_item.title == '') {
            zeroModal.error('请输入标题')
            return false
        }
        var loading = zeroModal.loading(4);

        $http({
            method: "post",
            url: "/seting/loophole-intelligence-add",
            data: {
                title: $scope.alert_item.title,
                level: $scope.alert_item.level,
                first_seen_time: $scope.add_startDate,
                sourse: $scope.alert_item.sourse,
                detail: $scope.alert_item.detail,
                label_id: {
                    exist: label_id_exist,
                    unexist: $scope.alert_item.add_new_tag
                }
            }
        }).then(
            function (data) {
                zeroModal.close(loading);
                if (data.data.status == 'success') {
                    zeroModal.success("添加成功");
                }
                setTimeout(zeroModal.closeAll(), 3000)
                $scope.get_page();
            },
            function () {}
        );
    };
    // 触发标签选择
    $scope.tag_focus = function () {
        $scope.tag_list_if = true;
        $scope.get_tag_list($scope.alert_item.tag_list_str);
    }
    $scope.tag_blur = function () {
        if ($scope.alert_item.tag_list_str == '') {
            return false;
        }
        $scope.alert_item.tag_list_str = '';
    }
    // 获取标签列表
    $scope.get_tag_list = function (name) {
        $http({
            method: "get",
            url: "/site/get-label",
            params: {
                label_name: name,
            }
        }).then(
            function (data) {
                $scope.search_tag_list = [];
                $scope.data_location = JSON.stringify(data.data);
                $scope.tag_list = JSON.parse($scope.data_location);
                $scope.search_tag_list_str = $scope.data_location;
                $scope.search_tag_list = JSON.parse($scope.search_tag_list_str);
                $scope.search_tag_list.push({
                    id: '',
                    label_name: '全部'
                })
            },
            function () {}
        );
    }
    $scope.tag_change = function (name) {
        $scope.get_tag_list(name);
    }
    // 选择标签
    $scope.tag_list_item = function (item) {
        $scope.alert_item.tag_list.push(item.label_name);
        $scope.alert_item.label_id.exist.push(item);
        $scope.tag_list_if = false;
    }
    // 删除标签
    $scope.tag_del = function (name, index) {
        angular.forEach($scope.alert_item.add_new_tag, function (value, key) {
            if ($scope.alert_item.tag_list[index] == value) {
                $scope.alert_item.add_new_tag.splice(key, 1);
            }
        })
        angular.forEach($scope.alert_item.label_id.exist, function (item, key) {
            if ($scope.alert_item.tag_list[index] == item.label_name) {
                $scope.alert_item.label_id.exist.splice(key, 1);
            }
        })
        $scope.alert_item.tag_list.splice(index, 1);
    }
    $scope.mykey = function (e) {
        var keycode = window.event ? e.keyCode : e.which; //获取按键编码
        if (keycode == 13) {
            if ($scope.alert_item.tag_list_str == '') {
                $scope.tag_list_if = false;
                setTimeout("$('.tag_input')[0].blur()", 500);
                return false;
            }
            $scope.alert_item.tag_list.push($scope.alert_item.tag_list_str);
            $scope.alert_item.add_new_tag.push($scope.alert_item.tag_list_str);
            $scope.alert_item.tag_list_str = '';
            $scope.tag_list_if = false;
            setTimeout("$('.tag_input')[0].blur()", 500);
        }
    }
    // 发布漏洞情报
    $scope.release = function (id) {
        var loading = zeroModal.loading(4);
        $http({
            method: "put",
            url: "/seting/loophole-intelligence-publish",
            data: {
                id: id
            }
        }).then(
            function (data) {
                zeroModal.close(loading);
                if (data.data.status == 'success') {
                    zeroModal.success("发布成功");
                }
                $scope.get_page();
            },
            function () {}
        );
    }
    // 删除漏洞情报
    $scope.delete = function (id) {
        var loading = zeroModal.loading(4);
        $http({
            method: "delete",
            url: "/seting/special-intelligence-del",
            data: {
                id: id
            }
        }).then(
            function (data) {
                zeroModal.close(loading);
                if (data.data.status == 'success') {
                    zeroModal.success("删除成功");
                }
                $scope.get_page();
            },
            function () {}
        );
    }
    // 打开编辑框
    $scope.edit_loop_box = function (item) {
        $scope.picker_edit(moment(new Date(item.first_seen_time * 1000)));
        console.log(item);
        $scope.edit_time = item.first_seen_time;
        $scope.edit_item = {
            id: item.id,
            title: item.title,
            level: item.level,
            first_seen_time: item.first_seen_time,
            sourse: item.sourse,
            detail: item.detail,
            label_name: item.label_name,
            tag_list: item.label_name,
            tag_list_str: '',
            status: item.status
        }
        var W = 828;
        var H = 620;
        zeroModal.show({
            title: "情报编辑",
            content: edit,
            width: W + "px",
            height: H + "px",
            ok: false,
            cancel: false,
            okFn: function () {},
            onCleanup: function () {
                edit_box.appendChild(edit);
            }
        });
    };
    // 触发标签选择
    $scope.edit_tag_focus = function () {
        $scope.edit_tag_list_if = true;
        $scope.get_tag_list($scope.edit_item.tag_list_str);
    }
    $scope.edit_tag_blur = function () {
        if ($scope.edit_item.tag_list_str == '') {
            return false;
        }
        $scope.edit_item.tag_list_str = '';
    }
    // 编辑选择标签
    $scope.edit_tag_list_item = function (item) {
        $scope.edit_item.tag_list.push(item.label_name);
        $scope.edit_tag_list_if = false;
    }
    $scope.edit_mykey = function (e) {
        var keycode = window.event ? e.keyCode : e.which; //获取按键编码
        if (keycode == 13) {
            if ($scope.edit_item.tag_list_str == '') {
                $scope.edit_tag_list_if = false;
                setTimeout("$('.tag_input')[0].blur()", 500);
                return false;
            }
            $scope.edit_item.tag_list.push($scope.edit_item.tag_list_str);
            $scope.edit_item.tag_list_str = '';
            $scope.edit_tag_list_if = false;
            setTimeout("$('.tag_input')[0].blur()", 500);
        }
    }
    // 编辑删除标签
    $scope.edit_tag_del = function (name, index) {
        $scope.edit_item.tag_list.splice(index, 1);
    }
    $scope.edit_tag_change = function (name) {
        $scope.get_tag_list(name);
    }

    $scope.edit_sure = function () {
        if ($scope.edit_item.sourse == '请选择') {
            zeroModal.error('请选择情报来源')
            return false
        }
        if ($scope.edit_item.title == '') {
            zeroModal.error('请输入标题')
            return false
        }
        var loading = zeroModal.loading(4);
        $http({
            method: "put",
            url: "/seting/loophole-intelligence-edit",
            data: {
                id: $scope.edit_item.id,
                title: $scope.edit_item.title,
                level: $scope.edit_item.level,
                first_seen_time: $scope.edit_time,
                sourse: $scope.edit_item.sourse,
                detail: $scope.edit_item.detail,
                label_name: $scope.edit_item.label_name,
                status: $scope.edit_item.status,
            }
        }).then(
            function (data) {
                zeroModal.close(loading);
                if (data.data.status == 'success') {
                    zeroModal.success("修改成功");
                }
                setTimeout(zeroModal.closeAll(), 3000)
                $scope.get_page();
            },
            function () {}
        );

    }
    $scope.init();

});