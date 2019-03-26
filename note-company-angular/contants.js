angular.module('infi-basic').value('SYS',{
    url:'http://192.168.1.21:8080/picc-care/',
    // url:'http://192.168.1.161:28002/picc-care/',
    // url:'http://182.92.1.121:28002/picc-care/',
    jsonUrl:'data/',
    STATUS_SUCCESS: 'ok',
    STATUS_BLANK: 'blank',
    STATUS_AUTH_PASSED: "AUTH_PASSED",
    STATUS_AUTH_FAIL: 'AUTH_FAIL',
    STATUS_DO_LOGIN: 'doLogin',
    STATUS_QUERYING: 'querying',
    STATUS_ERROR:'error',

    DEFAULT_PAGE_NUMBER:1,
    DEFAULT_PAGE_SIZE:10,
    //六类表单是新增还是修改还是详情
    ADD:'add',
    EDIT:'edit',
    DETAILS:'details',
    imgBack:'eu=21232f297a57a5a743894a0e4a801fc3&ep=21232f297a57a5a743894a0e4a801fc3'
});

angular.module('infi-basic').constant('config',{
    parameter:'eu=21232f297a57a5a743894a0e4a801fc3&ep=21232f297a57a5a743894a0e4a801fc3'
});
