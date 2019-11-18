var myApp = angular.module("myApp", []);
myApp.controller("labelCtrl", function($scope, $http, $timeout) {

    $scope.init = function () {

        $scope.label_data = [];
        $scope.intelligence = 0;

        //类别参数
        $scope.category = {
            active_index: -1,
            name:'',
            id:'',
            lists:[],
            status:false,
            /*编辑标签类别下拉框高度*/
            listHeight:102,
            listItemHeight: 34
        };

        //标签参数
        $scope.label = {
            active_index: -1,
            category_name:'',
            label_name:'',
            detail:'',
            id:'',
            lists:[],
            label_name_list:[],
            status:false,
            /*编辑标签类别下拉框高度*/
            listHeight:170,
            listItemHeight: 34
        };

        $scope.get_label_list();

    }

    /**********************************新增编辑***********************************/
    //新增标签弹窗
    $scope.label_add = function ($event,name) {

        $event.stopPropagation();

        var W = 552;
        var H = 483;
        var loading = zeroModal.loading(4);

        $http({
            method: "get",
            url: "/seting/label-category-list",
            params:{
                category_name: $scope.label.category_name
            }
        }).then(function successCallback(resp) {

                zeroModal.close(loading);

                if(resp.status === 200){

                    $scope.label.lists = resp.data.data;

                    zeroModal.show({
                        title: "新增标签",
                        content: lab_add,
                        width: W + "px",
                        height: H + "px",
                        ok: false,
                        cancel: false,
                        okFn: function () {},
                        onOpen: function () {
                            if(name == '未分类标签' || name == undefined){
                                $scope.label.category_name = '';
                            }else {
                                $scope.label.category_name = name;
                            }
                        },
                        onCleanup: function () {
                            lab_add_box.appendChild(lab_add);
                        },
                        onClosed: function () {
                            $scope.label = {
                                active_index: -1,
                                category_name:'',
                                label_name:'',
                                detail:'',
                                id:'',
                                lists:[],
                                label_name_list:[],
                                status:false
                            }
                        }
                    });
                }
            },
            function errorCallback(data) {}
        );
    };

    //保存标签按钮
    $scope.lab_save = function () {

        if($scope.label.label_name == ""){
            zeroModal.alert("标签名称不能为空。");
        } else {

            var loading = zeroModal.loading(4);

            let params = {
                category_name:$scope.label.category_name,
                label_name:$scope.label.label_name,
                detail:$scope.label.detail
            }

            $http({
                method: "post",
                url: "/seting/label-add",
                data: params
            }).then(function successCallback(resp) {

                    zeroModal.close(loading);

                    if (resp.data.status == "success") {
                        zeroModal.success("保存标签成功！");
                        zeroModal.closeAll();

                        //标签列表更新
                        $scope.get_label_list();

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

    /**********************************标签编辑***********************************/

    //标签编辑弹窗
    $scope.label_edit = function ($event,item) {

        $event.stopPropagation();

        $scope.label.category_name = item.category_name || '';
        $scope.label.label_name = item.label_name;
        $scope.label.detail = item.detail;
        $scope.label.id = item.id;

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

                    $scope.label.lists = resp.data.data;

                    angular.forEach($scope.label.lists,function (value,key) {
                        //编辑时标签类型下拉框高亮
                        if(value.category_name == $scope.label.category_name){
                            $scope.label.active_index = key;
                        }
                    });

                    zeroModal.show({
                        title: "编辑标签",
                        content: lab_edit,
                        width: W + "px",
                        height: H + "px",
                        ok: false,
                        cancel: false,
                        okFn: function () {},
                        onCleanup: function () {
                            lab_edit_box.appendChild(lab_edit);
                        },
                        onClosed: function () {
                            $scope.label = {
                                active_index: -1,
                                category_name:'',
                                label_name:'',
                                detail:'',
                                id:'',
                                lists:[],
                                status:false,
                                listHeight:170,
                                listItemHeight: 34
                            }
                        }
                    });
                }
            },
            function errorCallback(data) {}
        );
    };

    //类别编辑标签类别input打开下拉框
    $scope.lab_click_open = function () {

        $scope.label.status = true;

        if($scope.label.listHeight < $scope.label.listItemHeight *
            ($scope.label.active_index + 1)){
             var scrollTop = $scope.label.listItemHeight *
                ($scope.label.active_index + 1) - $scope.label.listHeight;
        }

        $timeout(function () {
            document.getElementById('lab_top_list').scrollTop = scrollTop;
            $scope.$apply();
        },20)

    };

    //标签编辑标签类别输入框change事件
    $scope.lab_change_func = function() {

        $scope.label.active_index = 0;
        var loading = zeroModal.loading(5);

        $http({
            method: "get",
            url: "/seting/label-category-list",
            params:{
                category_name:$scope.label.category_name
            }
        }).then(function successCallback(resp) {

                zeroModal.close(loading);

                let cate = resp.data.data;

                if(resp.status === 200){
                    $scope.label.lists = cate;

                    if(cate.length == 0){
                        $scope.label.status = false;
                    }else {
                        $scope.label.status = true;
                    }
                }
            }
        );
    };

    //标签编辑标签类别列表鼠标事件
    $scope.lab_down_func = function (name,index) {
        $scope.label.category_name = name;
        $scope.label.status = false;
        $scope.label.active_index = index;
    };

    //标签编辑标签类别enter点击
    $scope.lab_key_func = function (e) {

        let length = $scope.label.lists.length;
        var keycode = window.event ? e.keyCode : e.which; //获取按键编码

        if (keycode == 13) {

            $scope.label.status = !$scope.label.status;
            $scope.label.category_name = $scope.label.lists[$scope.label.active_index].category_name;

        }else if(keycode == 40){

            if($scope.label.active_index === length - 1){
                $scope.label.active_index = length - 1;
                return false;
            }else {
                $scope.label.active_index ++;
            }
            $scope.label.category_name = $scope.label.lists[$scope.label.active_index].category_name;
        }else if(keycode == 38) {

            if ($scope.label.active_index === 0) {
                $scope.label.active_index = 0;
                return false;
            } else {
                $scope.label.active_index--;
            }

            $scope.label.category_name = $scope.label.lists[$scope.label.active_index].category_name;
        }


        var scrollTop = 0;

        if($scope.label.listHeight < $scope.label.listItemHeight *
            ($scope.label.active_index + 1)){
            scrollTop = $scope.label.listItemHeight *
                ($scope.label.active_index + 1) - $scope.label.listHeight;
        }

        document.getElementById('lab_top_list').scrollTop = scrollTop;

    }

    //标签编辑保存
    $scope.lab_edit_save = function () {
        /*
        * 获取标签名称列表
        * */
        $http({
            method: "get",
            url: "/site/get-label",
            params: {
                label_name: '',
            }
        }).then(function (resp) {
                let attr = [];
                angular.forEach(resp.data, function (value, key) {
                    attr.push(value.label_name);
                });
                $scope.label.label_name_list = attr;

                if ($scope.label.label_name == "" ||
                    $scope.label.label_name == undefined ||
                    $scope.label.label_name == null) {

                    zeroModal.alert("标签名称不能为空。");

                } else if ($scope.label.label_name_list.indexOf($scope.label.label_name) > -1
                    && $scope.label.label_name != window.originalName) {

                    var W = 552;
                    var H = 248;

                    zeroModal.show({
                        title: "合并标签",
                        content: lab_merge,
                        width: W + "px",
                        height: H + "px",
                        ok: false,
                        cancel: false,
                        okFn: function () {
                        },
                        onOpen: function () {
                        },
                        onCleanup: function () {
                            lab_merge_box.appendChild(lab_merge);
                        },
                        onClosed: function () {
                        }
                    });
                } else {
                    $scope.label_name_merge();
                }
            },
            function () {
            }
        );
    };

    //标签编辑取消
    $scope.lab_edit_cancel = function () {
        //zeroModal.close(window.deletePopup);
        zeroModal.closeAll();
    };

    //标签编辑删除
    $scope.lab_edit_delete = function () {

        var W = 552;
        var H = 248;

        var loading = zeroModal.loading(4);
        $http({
            method: "get",
            url: "/site/get-effected-intelligence",
            params:{
                label_id: $scope.label.id
            },
        }).then(function successCallback(resp) {
                zeroModal.close(loading);

                if(resp.status === 200){
                    $scope.intelligence = resp.data;

                    $scope.delEditModal = zeroModal.show({
                        title: "删除标签",
                        content: lab_delete,
                        width: W + "px",
                        height: H + "px",
                        ok: true,
                        cancel: true,
                        cancelTitle:'取消',
                        okFn: function () {
                            $scope.lab_delete_ok();
                        },
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
            data: {id: $scope.label.id}
        }).then(function successCallback(resp) {

                if(resp.status == 200){
                    zeroModal.closeAll();
                    //标签列表更新
                    $scope.get_label_list();
                }
            },
            function errorCallback(data) {}
        );
    };

    //合并弹窗确定按钮
    $scope.lab_merge_ok = function () {
        $scope.label_name_merge();
    };

    //合并弹窗取消按钮
    $scope.lab_merge_cancel = function () {
        zeroModal.closeAll();
    };

    //编辑更新或者合并
    $scope.label_name_merge = function () {

        var loading = zeroModal.loading(4);

        //let updateData = Object.assign($scope.label_data_info,{id:$scope.label_id});
        let params = {
            category_name: $scope.label.category_name,
            label_name:$scope.label.label_name,
            detail:$scope.label.detail,
            id:$scope.label.id
        }

        $http({
            method: "put",
            url: "/seting/label-edit",
            data: params
        }).then(function successCallback(resp) {

                zeroModal.close(loading);

                if (resp.data.status == "success") {

                    zeroModal.success("保存标签成功！");
                    zeroModal.closeAll();

                    //标签列表更新
                    $scope.get_label_list();

                }else if (resp.data.status == "fail") {
                    zeroModal.error(resp.data.errorMessage);
                }
            },
            function errorCallback(data) {}
        );

    };

    /**********************************类别处理***********************************/

    //类别编辑弹窗
    $scope.category_edit = function ($event,item) {

        $event.stopPropagation();

        //长度一定大于0
        $scope.category.id = item.label[0].category_id;
        $scope.category.name = item.name;

        var W = 552;
        var H = 248;

        var loading = zeroModal.loading(4);

        $http({
            method: "get",
            url: "/seting/label-category-list",
        }).then(function successCallback(resp) {

                zeroModal.close(loading);

                if(resp.status === 200){

                    $scope.category.lists = resp.data.data;

                    angular.forEach($scope.category.lists,function (value,key) {
                        //编辑标签类别下拉框高亮
                        if(value.category_name == $scope.category.name){
                            $scope.category.active_index = key;
                        }
                    });

                    zeroModal.show({
                        title: "编辑标签类别",
                        content: cate_edit,
                        width: W + "px",
                        height: H + "px",
                        ok: false,
                        cancel: false,
                        okFn: function () {},
                        onOpen:function () {},
                        onCleanup: function () {
                            cate_edit_box.appendChild(cate_edit);
                        },
                        onClosed: function () {
                            $scope.category = {
                                active_index:-1,
                                name:'',
                                id:'',
                                lists:[],
                                status:false,
                                listHeight: 102,
                                listItemHeight: 34
                            }
                        }
                    });
                }
            },
            function errorCallback(data) {}
        );
    };

    //类别编辑标签类别input打开下拉框
    $scope.cate_click_open = function () {

        $scope.category.status = true;

        var scrollTop = 0;

        if($scope.category.listHeight < $scope.category.listItemHeight *
            ($scope.category.active_index + 1)){
            scrollTop = $scope.category.listItemHeight *
                ($scope.category.active_index + 1) - $scope.category.listHeight;
        }

        $timeout(function () {
            document.getElementById('cate_top_list').scrollTop = scrollTop;
            $scope.$apply();
        },20)
    };

    //类别编辑标签类别输入框change事件
    $scope.cate_change_func = function () {

        $scope.category.active_index = 0;
        var loading = zeroModal.loading(5);

        $http({
            method: "get",
            url: "/seting/label-category-list",
            params:{
                category_name:$scope.category.name
            }
        }).then(function successCallback(resp) {

                zeroModal.close(loading);

                let cate = resp.data.data;

                if(resp.status === 200){
                    $scope.category.lists = cate;

                    if(cate.length == 0){
                        $scope.category.status = false;
                    }else {
                        $scope.category.status = true;
                    }
                }
            }
        );
    };

    //类别编辑标签类别列表点击事件
    $scope.cate_down_func = function (name,index) {
        $scope.category.name = name;
        $scope.category.status = false;
        $scope.category.active_index = index;
    };

    //类别编辑标签类别enter点击
    $scope.cate_key_func = function (e) {

        let length = $scope.category.lists.length;
        var keycode = window.event ? e.keyCode : e.which; //获取按键编码

        if (keycode == 13) {

            $scope.category.status = !$scope.category.status;
            $scope.category.name = $scope.category.lists[$scope.category.active_index].category_name;

        }else if(keycode == 40){

            if($scope.category.active_index === length - 1){
                $scope.category.active_index = length - 1;
                return false;
            }else {
                $scope.category.active_index ++;
            }
            $scope.category.name = $scope.category.lists[$scope.category.active_index].category_name;
        }else if(keycode == 38) {

            if ($scope.category.active_index === 0) {
                $scope.category.active_index = 0;
                return false;
            } else {
                $scope.category.active_index--;
            }
            $scope.category.name = $scope.category.lists[$scope.category.active_index].category_name;
        }

        var scrollTop = 0;

        if($scope.category.listHeight < $scope.category.listItemHeight *
            ($scope.category.active_index + 1)){
            scrollTop = $scope.category.listItemHeight *
                ($scope.category.active_index + 1) - $scope.category.listHeight;
        }

        document.getElementById('cate_top_list').scrollTop = scrollTop;

    }

    //编辑标签类别保存点击
    $scope.cate_edit_save = function () {

        var loading = zeroModal.loading(5);

        $http({
            method: "put",
            url: "/seting/category-edit",
            data: {
                id: $scope.category.id,
                category_name: $scope.category.name
            }
        }).then(function successCallback(resp) {

                zeroModal.close(loading);

                if(resp.status == 200){

                    zeroModal.closeAll();

                    //更新列表
                    $scope.get_label_list();
                }
            },
            function errorCallback(data) {}
        );
    };

    //编辑标签类别取消点击
    $scope.cate_edit_cancel = function () {
        zeroModal.closeAll();
    };

    //编辑标签类别删除按钮弹窗
    $scope.cate_edit_delete = function () {

        var W = 552;
        var H = 248;

        if($scope.category.id != null ||
            $scope.category.id != '' ||
            $scope.category.id != undefined){
            zeroModal.show({
                title: "删除标签类别",
                content: cate_delete_1,
                width: W + "px",
                height: H + "px",
                ok: false,
                cancel: false,
                okFn: function () {},
                onCleanup: function () {
                    cate_delete_box_1.appendChild(cate_delete_1);
                },
            });
        }else {
            zeroModal.show({
                title: "删除标签类别",
                content: cate_delete_2,
                width: W + "px",
                height: H + "px",
                ok: false,
                cancel: false,
                okFn: function () {},
                onCleanup: function () {
                    cate_delete_box_2.appendChild(cate_delete_2);
                }
            });
        }
    };

    //知道了点击事件
    $scope.cate_delete_aware = function () {
        zeroModal.closeAll();
    };

    //删除弹窗确认事件
    $scope.cate_delete_ok = function () {
        var loading = zeroModal.loading(5);

        $http({
            method: "DELETE",
            url: "/seting/category-del",
            data: {
                id: $scope.category.id
            }
        }).then(function successCallback(resp) {

                zeroModal.close(loading);

                if(resp.status == 200){

                    zeroModal.closeAll();
                    //更新列表
                    $scope.get_label_list();
                }
            },
            function errorCallback(data) {}
        );
    };

    //删除弹窗取消事件
    $scope.cate_delete_cancel = function () {
        zeroModal.closeAll();
    };

    /**********************************其他***************************************/

    //标签管理搜索enter事件
    $scope.label_keyup = function($event){
        var keycode = window.event?$event.keyCode:$event.which;
        if(keycode==13){
            $scope.get_label_list();
        }
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
                        labelAttr.push({name:value,label:key,status:true});
                    });

                    $scope.label_data = labelAttr;

                   // console.log(labelAttr);
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
            return '未分类标签';
        }else {
            return arr;
        }
    }
});

myApp.directive('onBlankHide',function(){
    return{
        restrict:'A',
        link: function(scope,element,attr){

            console.log(element)

            element.on('click',function (e) {

                console.log(scope.label_category_select.status)
                //e.stopPropagation();
                scope.label_category_select.status = false;
            })
            element.on('click',function(e){
                //阻止底层冒泡
                e.stopPropagation();
                angular.element('#'+scope.pop).show();
            });
            angular.element('body').click(function(){
                angular.element('#'+scope.pop).hide();
            });
            angular.element('#'+scope.pop).click(function(e){
                //阻止底层冒泡
                e.stopPropagation();
            })
        }
    }
});
