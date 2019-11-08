var myApp = angular.module("myApp", []);
myApp.controller("labelCtrl", function($scope, $http, $filter) {

    $scope.init = function () {

        $scope.label_data = [];
        $scope.label_category_select = {
            category: [],
            status: false
        };

        $scope.category_id = "";
        //$scope.category_status = false;

        $scope.label_name = "";
        $scope.intelligence = 0;

        $scope.label_name_list = [];

        $scope.label_data_info = {
            category_name: "",
            label_name: "",
            detail: ""
        };

        $scope.get_label_list();

        $scope.get_label_name_list();

    }

    //标签搜索按钮
    $scope.label_search = function () {
        $scope.get_label_list();
    }

    //新增标签弹窗
    $scope.label_add = function (name,$event) {

        $event.stopPropagation();

        var W = 552;
        var H = 483;
        var loading = zeroModal.loading(4);

        $http({
            method: "get",
            url: "/seting/label-category-list",
            params:{
                category_name:$scope.label_data_info.category_name
            }
        }).then(function successCallback(resp) {

                zeroModal.close(loading);

                if(resp.status === 200){

                    $scope.label_category_select.category = resp.data.data;

                    zeroModal.show({
                        title: "新增标签",
                        content: lab_add,
                        width: W + "px",
                        height: H + "px",
                        ok: false,
                        cancel: false,
                        okFn: function () {},
                        onOpen: function () {
                            if(name == '自定义标签' || name == undefined){
                                $scope.label_data_info.category_name = '';
                            }else {
                                $scope.label_data_info.category_name = name;
                            }
                        },
                        onCleanup: function () {
                            lab_add_box.appendChild(lab_add);
                        },
                        onClosed: function () {
                            $scope.category_id = "";
                            //$scope.category_status = false;
                            $scope.label_category_select.status = false;
                            $scope.label_data_info = {
                                category_name: "",
                                label_name: "",
                                detail: "",
                            };
                        }
                    });
                }
            },
            function errorCallback(data) {}
        );
    };

    //保存标签按钮
    $scope.lab_save = function () {

        if($scope.label_data_info.label_name == ""){
            zeroModal.alert("标签名称不能为空。");
        } else {

            var loading = zeroModal.loading(4);

            $http({
                method: "post",
                url: "/seting/label-add",
                data: $scope.label_data_info
            }).then(function successCallback(resp) {

                    zeroModal.close(loading);
                    if (resp.data.status == "success") {
                        zeroModal.success("保存标签成功！");
                        zeroModal.closeAll();

                        //标签列表更新
                        $scope.get_label_list();

                        //标签名称列表更新
                        $scope.get_label_name_list();

                    }else if(resp.data.status == "fail"){
                        zeroModal.error(resp.data.errorMessage);
                    }
                },
                function errorCallback(data) {}
            );
        }
    };

    //关闭弹窗按钮
    $scope.lab_cancel = function () {
        zeroModal.closeAll();
    };

    //编辑标签弹窗
    $scope.label_edit = function (item,$event) {

        $event.stopPropagation();

        $scope.category_id = item.id;
        $scope.label_data_info = {
            category_name: item.category_name || '',
            label_name: item.label_name,
            detail: item.detail,
        };

        //编辑时如果为原始值 不弹出合并弹框
        window.originalName = item.label_name;

        var W = 552;
        var H = 483;

        var loading = zeroModal.loading(4);

        $http({
            method: "get",
            url: "/seting/label-category-list",
        }).then(function successCallback(resp) {

            zeroModal.close(loading);

            if(resp.status === 200){

                    $scope.label_category_select.category = resp.data.data;

                    zeroModal.show({
                        title: "编辑标签",
                        content: lab_edit,
                        width: W + "px",
                        height: H + "px",
                        ok: false,
                        cancel: false,
                        okFn: function () {},
                        onOpen:function () {
                           // $scope.category_status = true;
                        },
                        onCleanup: function () {
                            lab_edit_box.appendChild(lab_edit);
                        },
                        onClosed: function () {
                            $scope.category_id = "";
                            //$scope.category_status = false;
                            $scope.label_data_info = {
                                category_name: "",
                                label_name: "",
                                detail: "",
                            };
                        }
                    });
                }
            },
            function errorCallback(data) {}
        );
    };

    //更新标签（编辑弹窗保存）
    $scope.lab_edit_save = function () {

        if($scope.label_data_info.label_name == ""){
            zeroModal.alert("标签名称不能为空。");
        } else if($scope.label_name_list.indexOf($scope.label_data_info.label_name) > -1
        && $scope.label_data_info.label_name != window.originalName){
            var W = 552;
            var H = 248;

            zeroModal.show({
                title: "合并标签",
                content: lab_merge,
                width: W + "px",
                height: H + "px",
                ok: false,
                cancel: false,
                okFn: function () {},
                onOpen:function () {
                },
                onCleanup: function () {
                    lab_merge_box.appendChild(lab_merge);
                },
                onClosed: function () {}
            });
        } else {
            $scope.label_name_merge();
        }
    };

    //删除标签按钮点击弹窗
    $scope.lab_edit_delete = function () {

        var W = 552;
        var H = 248;

        var loading = zeroModal.loading(4);
        $http({
            method: "get",
            url: "/site/get-effected-intelligence",
        }).then(function successCallback(resp) {
                zeroModal.close(loading);

                if(resp.status === 200){
                    $scope.intelligence = resp.data;

                     zeroModal.show({
                        title: "删除标签",
                        content: lab_delete,
                        width: W + "px",
                        height: H + "px",
                        ok: false,
                        cancel: false,
                        okFn: function () {},
                        onCleanup: function () {
                            lab_delete_box.appendChild(lab_delete);
                        },
                    });
                }
            },
            function errorCallback(data) {}
        );

    };

    //删除弹框确定按钮
    $scope.lab_delete_ok = function () {
        $http({
            method: "delete",
            url: "/seting/label-del",
            data: {id: $scope.category_id}
        }).then(function successCallback(resp) {

                if(resp.status == 200){

                    zeroModal.closeAll();
                    //标签列表更新
                    $scope.get_label_list();
                    //标签名称列表更新
                    $scope.get_label_name_list();
                }
            },
            function errorCallback(data) {}
        );
    };

    //删除弹窗取消按钮
    $scope.lab_delete_cancel = function () {
        //zeroModal.close(window.deletePopup);
        zeroModal.closeAll();
    }

    //合并弹窗确定按钮
    $scope.lab_merge_ok = function () {
        $scope.label_name_merge();
    }

    //合并弹窗取消按钮
    $scope.lab_merge_cancel = function () {
        zeroModal.closeAll();
    };

    //编辑更新或者合并
    $scope.label_name_merge = function () {

        var loading = zeroModal.loading(4);

        let updateData = Object.assign($scope.label_data_info,{id:$scope.category_id});

        $http({
            method: "put",
            url: "/seting/label-edit",
            data: updateData
        }).then(function successCallback(resp) {

                zeroModal.close(loading);

                if (resp.data.status == "success") {

                    zeroModal.success("保存标签成功！");
                    zeroModal.closeAll();

                    //标签列表更新
                    $scope.get_label_list();
                    //标签名称列表更新
                    $scope.get_label_name_list();

                }else if (resp.data.status == "fail") {
                    zeroModal.error(resp.data.errorMessage);
                }
            },
            function errorCallback(data) {}
        );

    }

    //标签类别列表点击事件
    $scope.category_click = function (name) {
        $scope.label_data_info.category_name = name;
        $scope.label_category_select.status = false;
    };

    //标签类别change事件
    $scope.label_category_click = function(){
        var loading = zeroModal.loading(5);
        $http({
            method: "get",
            url: "/seting/label-category-list",
            params:{
                category_name:$scope.label_data_info.category_name
            }
        }).then(function successCallback(resp) {
                zeroModal.close(loading);

                let cate = resp.data.data;

                if(resp.status === 200){
                    $scope.label_category_select.category = cate;
                    if(cate.length == 0){
                        $scope.label_category_select.status = false;
                    }else {
                        $scope.label_category_select.status = true;
                    }
                }
            }
        );
    };

    //标签管理搜索enter事件
    $scope.label_keyup = function($event){
        var keycode = window.event?$event.keyCode:$event.which;
        if(keycode==13){
            $scope.get_label_list();
        }
    };

    //获取标签名称列表
    $scope.get_label_name_list = function () {
        var loading = zeroModal.loading(4);

        $http({
            method: "get",
            url: "/site/get-label",
            params: {
                label_name: '',
            }
        }).then(function (resp) {

                zeroModal.close(loading);

                let labelAttr = [];

                angular.forEach(resp.data, function (value,key) {
                    labelAttr.push(value.label_name);
                });
                $scope.label_name_list = labelAttr;

            },
            function () {}
        );
    };

    //获取列表
    $scope.get_label_list = function () {

        var loading = zeroModal.loading(4);

        $http({
            method: "get",
            url: "/seting/label-list",
            params: {
                label_name:$scope.label_name
            }
        }).then(function successCallback(resp) {

                zeroModal.close(loading);

                if(resp.status == 200){

                    let labelAttr = [];

                    angular.forEach(JSON.parse(resp.data), function (key,value) {
                        if(value === '' || value === null){
                            value = '自定义标签';
                        }
                        labelAttr.push({name:value,label:key,status:false});
                    });

                    $scope.label_data = labelAttr;
                }
            },
            function errorCallback(data) {}
        );
    };


    $scope.init();

});

myApp.filter('labelNull',function(){
    return function(arr){
        if(arr == '' || arr == null){
            return '自定义标签';
        }else {
            return arr;
        }
    }
});
