var myApp = angular.module("asideApp", []);

myApp.controller("asideCtrl", function($scope,$http) {

    $scope.indexCode = 0;
    $scope.alertDetail = false;

    $scope.menu_aside_flag = {
        site: {
            system: false,
            vehicle: false
        },
        search: {
            system: false,
            vehicle: false
        },
        assets: {
            system: false,
            vehicle: false
        },
        alert: {
            system: false,
            vehicle: false
        },
        report: {
            system: false,
            vehicle: false
        },
        seting: {
            system: false,
            vehicle: false,
            manage:{
                set: false
            }
        }

    }

    $scope.menu_aside = {
        site: {
            system: true,
            vehicle: true
        },
        search: {
            system: true,
            vehicle: true
        },
        assets: {
            system: true,
            vehicle: true
        },
        alert: {
            system: true,
            vehicle: true
        },
        report: {
            system: true,
            vehicle: true
        },
        seting: {
            system: true,
            vehicle: true,
            manage:{
                set: true
            }
        }
    };
    $scope.menu_list = {
        //首页
        index: false,
        index_overview: false,
        index_BigScreen: false,
        // 情报
        intelligence: false,
        intelligence_query: false,
        intelligence_extract: false,
        intelligence_share: false,
        intelligence_sourceAdmin: false,
        intelligence_apt: false,
        intelligence_special: false,
        intelligence_loophole: false,

        // 资产
        assets: false,
        assets_admin: false,
        assets_risk: false,
        assets_vehicle: false,
        assets_accessory: false,

        // 预警
        warning: false,
        warning_threat: false,
        warning_loophole: false,
        warning_drakNet: false,
        warning_vehicle: false,

        // 报表
        report: false,
        report_creat: false,
        report_send: false,
        // 设置
        set: false,
        set_sys: false,
        set_notice: false,
        set_loopholeRelation: false,
        set_admin: false,
        set_user: false,
        set_log: false,
        api: false,
        set_label:false,
        set_special:false,
        set_loophole:false,
        set_base:false
    };



    //通过权限控制显隐
    $scope.init_aside_flag = function(){
        let per_id = JSON.parse(localStorage.getItem('pemission_id'));
        let icd = $scope.indexCode;

        //console.log(icd)
        if(icd == 1){
            if(per_id.includes('16')
                || per_id.includes('24')
                || per_id.includes('29')
                || per_id.includes('46')
                || per_id.includes('50')){
                $scope.menu_aside_flag.search.system = true;
            }

            if(per_id.includes('186') || per_id.includes('187')){
                $scope.menu_aside_flag.search.vehicle = true;
            }

        }else if(icd == 2){

            if(per_id.includes('55') || per_id.includes('72')){
                $scope.menu_aside_flag.assets.system = true;
            }

            if(per_id.includes('184') || per_id.includes('185')){
                $scope.menu_aside_flag.assets.vehicle = true;
            }

        }else if(icd == 3){

            if(per_id.includes('78') || per_id.includes('85') || per_id.includes('90')){
                $scope.menu_aside_flag.alert.system = true;
            }

            /*if(per_id.includes('205')){
                $scope.menu_aside_flag.alert.vehicle = true;
            }*/

        }else if(icd == 5){

            if(per_id.includes('94')
                || per_id.includes('97')
                || per_id.includes('104')
                || per_id.includes('110')
                || per_id.includes('126')
                || per_id.includes('130')
                || per_id.includes('151')){
                $scope.menu_aside_flag.seting.system = true;
            }

            if(per_id.includes('181')
                || per_id.includes('182')
                || per_id.includes('183')
                || per_id.includes('209')){
                $scope.menu_aside_flag.seting.vehicle = true;
            }

            if(per_id.includes('182')
                || per_id.includes('183')
                || per_id.includes('209')){
                $scope.menu_aside_flag.seting.manage.set = true;
            }
        }

    }

    $scope.get_status = function() {
        var name = window.document.location.pathname;
        switch (name) {
            case '':
            case '/':
            case '/site/index':
            case '/map.html':
                $scope.menu_aside.site.system = true;
                break;
            case '/search/index':
            case '/agent/index':
            case '/share/index':
            case '/intelligence/source-management':
            case '/search/apt-lib':
                $scope.menu_aside.search.system = true;
                break;
            case '/vehicleintelligence/special':
            case '/vehicleintelligence/loophole':
                $scope.menu_aside.search.vehicle = true;
                break;

            case '/assets/asset-management':
            case '/assets/asset-risky':
                $scope.menu_aside.assets.system = true;
                break;

            case '/assets/vehicle':
            case '/assets/accessory':
                $scope.menu_aside.assets.vehicle = true;
                break;

            case '/alert/index':
            case '/alert/loophole':
            case '/alert/darknet':
                $scope.menu_aside.alert.system = true;
                break;

            case '/report/index':
            case '/report/send':
                $scope.menu_aside.report.system = true;
                break;
            /*配置*/
            case '/seting/network':
            case '/seting/systemnotice':
            case '/seting/custom-information-search':
            case '/seting/centralmanager':
            case '/seting/user':
            case '/seting/log':
            case '/api/index':
                $scope.menu_aside.seting.system = true;
                break;
            case '/seting/label-manage':
                $scope.menu_aside.seting.vehicle = true;
                break;
            case '/seting/special-intelligence':
            case '/seting/loophole-intelligence':
            case '/seting/base-intelligence':
                $scope.menu_aside.seting.vehicle = true;
                $scope.menu_aside.seting.manage.set = true;
                break;
        }
    }

    $scope.init_code = function(){

        //获取主机地址之后的目录
        var pathName = window.document.location.pathname;

        //预警详情去掉侧边栏
        if(pathName === '/alert/detail'
            || pathName === '/alert/loophole-detail'
            || pathName === '/alert/darknet-detail'
            || pathName === '/vehiclealert/detail'
            || pathName === '/user/adduser-page'
            || pathName === '/user/addrole-page'){
            $scope.alertDetail = true;
            return false;
        }else {
            $scope.alertDetail = false;
        }
        var names = pathName.substring(1, pathName.substr(1).indexOf('/')+1);

        if(names === 'site' || names == null || names== '/'){
            $scope.indexCode = 0;
        }else if(names === 'search' || names === 'agent' || names === 'share'
            || names === 'intelligence'|| names === 'vehicleintelligence'){
            $scope.indexCode = 1;
        }else if(names === 'assets'){
            $scope.indexCode = 2;
        }else if(names === 'alert' || names === 'vehiclealert'){
            $scope.indexCode = 3;
        }else if(names === 'report'){
            $scope.indexCode = 4;
        }else if(names === 'seting' || names === 'api'){
            $scope.indexCode = 5;
        }

        $scope.init_aside_flag();
    }

    $scope.get_menu = function() {

        let per_id = JSON.parse(localStorage.getItem('pemission_id'));
        //首页
        if(per_id.includes('1')){
            if (per_id.includes('2')) {
                $scope.menu_list.index_overview = true;
            }
            if (per_id.includes('14')) {
                $scope.menu_list.index_BigScreen = true;
            }
        }
        //情报
        if(per_id.includes('15')){
            if (per_id.includes('16')) {
                $scope.menu_list.intelligence_query = true;
            }
            if (per_id.includes('24')) {
                $scope.menu_list.intelligence_extract = true;
            }
            if (per_id.includes('29')) {
                $scope.menu_list.intelligence_share = true;
            }
            if (per_id.includes('46')) {
                $scope.menu_list.intelligence_sourceAdmin = true;
            }
            if (per_id.includes('50')) {
                $scope.menu_list.intelligence_apt = true;
            }
            if (per_id.includes('186')) {
                $scope.menu_list.intelligence_special = true;
            }
            if (per_id.includes('187')) {
                $scope.menu_list.intelligence_loophole = true;
            }
        }
        //资产
        if(per_id.includes('54')){
            if (per_id.includes('55')) {
                $scope.menu_list.assets_admin = true;
            }
            if (per_id.includes('72')) {
                $scope.menu_list.assets_risk = true;
            }
            if (per_id.includes('184')) {
                $scope.menu_list.assets_vehicle = true;
            }
            if (per_id.includes('185')) {
                $scope.menu_list.assets_accessory = true;
            }
        }
        //预警
        if(per_id.includes('77')){
            if (per_id.includes('78')) {
                $scope.menu_list.warning_threat = true;
            }
            if (per_id.includes('85')) {
                $scope.menu_list.warning_loophole = true;
            }
            if (per_id.includes('90')) {
                $scope.menu_list.warning_drakNet = true;
            }
            if (per_id.includes('205')) {
                $scope.menu_list.warning_vehicle = true;
            }
        }
        //报表
        if(per_id.includes('127')){
            if (per_id.includes('128')) {
                $scope.menu_list.report_creat = true;
            }
            if (per_id.includes('129')) {
                $scope.menu_list.report_send = true;
            }
        }
        //配置
        if(per_id.includes('93')){
            if (per_id.includes('94')) {
                $scope.menu_list.set_sys = true;
            }
            if (per_id.includes('97')) {
                $scope.menu_list.set_notice = true;
            }
            if (per_id.includes('104')) {
                $scope.menu_list.set_loopholeRelation = true;
            }
            if (per_id.includes('130')) {
                $scope.menu_list.set_admin = true;
            }
            if (per_id.includes('110')) {
                $scope.menu_list.set_user = true;
            }
            if (per_id.includes('126')) {
                $scope.menu_list.set_log = true;
            }
            if (per_id.includes('151')) {
                $scope.menu_list.api = true;
            }
            if (per_id.includes('181')) {
                $scope.menu_list.set_label = true;
            }
            if (per_id.includes('182')) {
                $scope.menu_list.set_special = true;
            }
            if (per_id.includes('183')) {
                $scope.menu_list.set_loophole = true;
            }
            if (per_id.includes('209')) {
                $scope.menu_list.set_base = true;
            }
        }
        /*$http.get('/site/menu').then(function (resp) {

            let permission = resp.data;

            if (permission.status == "success") {

                angular.forEach(permission.data, function(item) {
                    // 首页
                    if (item.permissions_id == "1") {
                        //$scope.menu_list.index = true;
                        angular.forEach(item.child_menu, function(child) {
                            if (child.permissions_id == "2") {
                                $scope.menu_list.index_overview = true;
                            }
                            if (child.permissions_id == "14") {
                                $scope.menu_list.index_BigScreen = true;
                            }
                        });
                    }
                    // 情报
                    if (item.permissions_id == "15") {
                        //$scope.menu_list.intelligence = true;
                        angular.forEach(item.child_menu, function(child) {
                            if (child.permissions_id == "16") {
                                $scope.menu_list.intelligence_query = true;
                            }
                            if (child.permissions_id == "24") {
                                $scope.menu_list.intelligence_extract = true;
                            }
                            if (child.permissions_id == "29") {
                                $scope.menu_list.intelligence_share = true;
                            }
                            if (child.permissions_id == "46") {
                                $scope.menu_list.intelligence_sourceAdmin = true;
                            }
                            if (child.permissions_id == "50") {
                                $scope.menu_list.intelligence_apt = true;
                            }
                            if (child.permissions_id == "186") {
                                $scope.menu_list.intelligence_special = true;
                            }
                            if (child.permissions_id == "187") {
                                $scope.menu_list.intelligence_loophole = true;
                            }
                        });
                    }
                    // 资产
                    if (item.permissions_id == "54") {
                        //$scope.menu_list.assets = true;
                        angular.forEach(item.child_menu, function(child) {
                            if (child.permissions_id == "55") {
                                $scope.menu_list.assets_admin = true;
                            }
                            if (child.permissions_id == "72") {
                                $scope.menu_list.assets_risk = true;
                            }

                            if (child.permissions_id == "184") {
                                $scope.menu_list.assets_vehicle = true;
                            }
                            if (child.permissions_id == "185") {
                                $scope.menu_list.assets_accessory = true;
                            }
                        });
                    }
                    // 预警
                    if (item.permissions_id == "77") {
                        //$scope.menu_list.warning = true;
                        angular.forEach(item.child_menu, function(child) {
                            if (child.permissions_id == "78") {
                                $scope.menu_list.warning_threat = true;
                            }
                            if (child.permissions_id == "85") {
                                $scope.menu_list.warning_loophole = true;
                            }
                            if (child.permissions_id == "90") {
                                $scope.menu_list.warning_drakNet = true;
                            }
                            if (child.permissions_id == "205") {
                                $scope.menu_list.warning_vehicle = true;
                            }
                        });
                    }
                    // 报表
                    if (item.permissions_id == "127") {
                        //$scope.menu_list.report = true;
                        angular.forEach(item.child_menu, function(child) {
                            if (child.permissions_id == "128") {
                                $scope.menu_list.report_creat = true;
                            }
                            if (child.permissions_id == "129") {
                                $scope.menu_list.report_send = true;
                            }
                        });
                    }
                    // 设置
                    if (item.permissions_id == "93") {
                        //$scope.menu_list.set = true;
                        angular.forEach(item.child_menu, function(child) {
                            if (child.permissions_id == "94") {
                                $scope.menu_list.set_sys = true;
                            }
                            if (child.permissions_id == "97") {
                                $scope.menu_list.set_notice = true;
                            }
                            if (child.permissions_id == "104") {
                                $scope.menu_list.set_loopholeRelation = true;
                            }
                            if (child.permissions_id == "130") {
                                $scope.menu_list.set_admin = true;
                            }
                            if (child.permissions_id == "110") {
                                $scope.menu_list.set_user = true;
                            }
                            if (child.permissions_id == "126") {
                                $scope.menu_list.set_log = true;
                            }
                            if (child.permissions_id == "151") {
                                $scope.menu_list.api = true;
                            }

                            if (child.permissions_id == "181") {
                                $scope.menu_list.set_label = true;
                            }
                            if (child.permissions_id == "182") {
                                $scope.menu_list.set_special = true;
                            }
                            if (child.permissions_id == "183") {
                                $scope.menu_list.set_loophole = true;
                            }
                            if (child.permissions_id == "209") {
                                $scope.menu_list.set_base = true;
                            }
                        });
                    }
                });
            }
        })*/
    };

    $scope.init = function() {



        //左侧栏显示设置
        $scope.init_code();
        //左侧栏权限设置
        $scope.get_menu();
        //左侧栏三角状态
       // $scope.get_status();

    };

    $scope.init();

});

angular.element(document).ready(function() {
    angular.bootstrap(document.getElementById("asideApp"), ['asideApp']);
});
