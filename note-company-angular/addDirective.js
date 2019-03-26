//新增页面
angular.module('infi-basic').directive('infiPatient',[function () {
    return {
        restrict: 'A',
        templateUrl:'add-patient.html'
    }
}]);
//由ｄｉｓｅａｓｅ．ｉｎｄｅｘ．ｈｔｍｌ进行相关的引用