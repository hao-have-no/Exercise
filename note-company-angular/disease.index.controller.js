angular.module('infi-basic').controller('diseaseIndex',['$scope','SYS','DiseaseListServices',
    'BasicServices','$routeParams',
function ($scope, SYS,DiseaseListServices,BasicServices,$routeParams) {
    //预制表格组件中的按钮组件
    $scope.operation={
        "btns":[
            {"label":'治疗方案',
            'type':'plan'}
        ],
        "label":'操作'
    }
    //初始化筛选条件
    $scope.params={
        startTime:'',
        endTime:'',
        search:'',
        disease:{
            'value':'100059',
            'opt':[]
        },
        ward:{
            'value':'',
            'opt':[]
        },
        diagType:{
            'value':'10003'
        }
    }

    //获取表头
    BasicServices.getData({
        'data':'',
        'url':'../diseases-plan-src/data/diseaseList.columns.json',
        'method':'get'
    }).then(function (msg) {
        $scope.tableColumns=msg.data;
    })

    //页面初始化获取数据
    getListData=(pageNo,pageSize)=>{
        DiseaseListServices.getListData(pageNo,pageSize,$scope.params).then(function (msg) {
            $scope.tableData=msg;
        })
    }
    getListData(1,10);

    //筛选查询
    $scope.refleshList=()=>{
        $scope.params.diagType.value == '10003'?$scope.tableColumns.columns[6].label='入院诊断':$scope.tableColumns.columns[6].label='出院诊断';
        $scope.tableData=null;
        getListData(1,10);
    }

    //获取疾病数据集
    BasicServices.getData({
        'data':'',
        'url':SYS.url+'disease/list',
        'method':'get'
    }).then(function success(msg) {
        $scope.params.disease.opt = msg.data;
    });

    //时间插件   这个不是公共的，可抽可不抽
    $scope.timePlugin = function(tagName){
        var that = this;
        $('input[name="'+tagName+'"]').datetimepicker({
            format: 'yyyy-mm-dd',
            language:"zh-CN",
            minView :2,
            autoclose: true,
            forceParse:true,
            todayBtn: true
        }).trigger('focus')
    }

}])