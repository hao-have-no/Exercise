angular.module('infi-basic').controller('HealthyBodyController',['$scope','$location','$routeParams','$timeout',function($scope,$location,$routeParams,$timeout) {
    const humanPortrait=$('.lesion-group');

    //初始化人体图像
    $scope.specitalDiseaseMapping=[{
        url:"/styles/images/healthy/drink.png",
        alt:"饮酒",
        name: '',
        id: 'drink',
        title: '饮酒'

    },{
        url: '/styles/images/healthy/smoke.png',
        alt:"吸烟",
        name: '',
        id: 'smoke',
        title: '吸烟'
    },{
        url: '/styles/images/healthy/neuropathy.png',
        alt:"神经性疾病",
        name: '精神和行为障碍',
        id: 'neuropathy',
        title: '神经性疾病'
    },{
        url: '/styles/images/healthy/STD.png',
        alt:"性病",
        name: '',
        id: 'STD',
        title: '性病'
    }
    ];

    //人体部位对应
    $scope.bodyMapping=[
        {
            name: '心脏',
            class: 'heart',
            url:'/styles/images/healthy/heart_2.png'
        }, {
            name: '肺',
            class: 'lung',
            url:'/styles/images/healthy/lung_2.png'
        }, {
            name: '肾',
            class: 'kidney',
            url:'/styles/images/healthy/kidney_2.png'
        }, {
            name: '生殖器',
            class: 'prostate',
            url:'/styles/images/healthy/prostate_2.png'
        }, {
            name: '骨骼',
            class: 'bone',
            url:'/styles/images/healthy/bone_2.png'
        }, {
            name: '脑',
            class: 'brain',
            url:'/styles/images/healthy/brain_2.png'
        }, {
            name: '肝',
            class: 'liver',
            url:'/styles/images/healthy/liver_2.png'
        }, {
            name: '胃',
            class: 'stomach',
            url:'/styles/images/healthy/stomach_2.png'
        }, {
            name: '肠',
            class: 'small-intestine',
            url:'/styles/images/healthy/small-intestine_2.png'
        }, {
            name: '大肠',
            class: 'intestinal',
            url:'/styles/images/healthy/intestinal_2.png'
        }
    ]

    $(window).resize(function(){
        let currWidth=$('.lession-group').width();
         //默认的设计图是378px
        let prop=currWidth / 378;
        $('.lession-group').css('font-size', 16 * prop + 'px');
        //根据边距调整font-size，从而采用ｅｍ来完成响应式布局
    });


    const init = function () {
        // $scope.bodyPortrait();
        // 初始化 font-size 自适应比例
        $scope.contentWidth = $('.lession-group').width();
        let prop = $scope.contentWidth / 378;
        $('.lession-group').css('font-size', 16 * prop + 'px');
        // 初始化 charts 自适应宽度
    }
    init();


}]);
