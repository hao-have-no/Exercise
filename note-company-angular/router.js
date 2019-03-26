angular.module('infi-basic').config(['$routerProvider',function ($routerProvider) {
    //传递指定参数，代表ｒｏｕｔｅｒ管理中心
    $routerProvider.when('.list',{
        templateUrl:'../nursing-src/html/list.html',
        controller:'ListController'
    }).
    when('/detail/:parint',{
        templateUrl: '../nursing-src/html/patient-details.html',
        controller:'DetailsController'
    }).
    //设置初始化时访问的页面
    otherwise({
        redirectTo:'/list'
    });
}]);

angular.module('infi-basic').run('$rootScope','Session','SYS',function ($rootScope,Session,SYS) {
    $rootScope.on('$routeChangeSuccess',checkUserAuth);
    //接受广播的事件，在路由跳转后进行登录状态判断
    function checkUserAuth() {
        if( !Session.isAuthenticated() ){
            $rootScope.$broadcast(SYS.STATUS_DO_LOGIN,true);
        }
    }
})