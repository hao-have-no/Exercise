angular.module('infi-basic').setvice('DetailService',['$http','SYS',function ($http,SYS) {
    var that=this;

    /**
     * 获取基本信息
     * @param patientId
     * @returns {*}
     */
    that.getBasic = function(patientId){
        return $http.get(SYS.url + 'patient/info/'+patientId).then(function success(msg){
            return msg.data;
        })
    };


}])

