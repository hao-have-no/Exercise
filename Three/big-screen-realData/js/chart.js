/**
 * 
 * 年龄 报表
 * 
 */
const ageChartOption = {
    tooltip : {
        trigger: 'item',
        formatter: "{a} <br/>{b} : {c} ({d}%)"
    },
    color: ['#bf4d42', '#61a0a8', '#d48265', '#91c7ae','#749f83',  '#ca8622', '#bda29a','#6e7074', '#546570', '#c4ccd3'],
    toolbox: {
        show : false,
    },
    calculable : true,
    series : [
        {
            name:'年龄',
            type:'pie',
            radius : [50, '80%'],
            center : ['50%', '50%'],
            roseType : 'area',
            label: {
                normal: {
                    show: true,
                    textStyle: {
                        fontSize: '12',
                        fontWeight: 'bold'
                    },
                    formatter: '{b}:{c}' + '\n\r' + '({d}%)'
                },
                emphasis: {
                    show: false,
                    textStyle: {
                        fontSize: '12',
                        fontWeight: 'bold'
                    }
                }
            },
            data:[
                {value:10, name:'婴儿（1-3岁）'},
                {value:15, name:'少儿（4-10岁）'},
                {value:20, name:'少年（10-18岁）'},
                {value:30, name:'青年（18-45岁）'},
                {value:100, name:'中年（45-60岁）'},
                {value:175, name:'老年（60岁以上）'},
            ]
        },
    ]
};
const ageData = [];
getData(4).then(res => {
    res.forEach(sex => {
        ageData.push({
            value: sex.con,
            name: sex.type
        })
    })
    ageChartOption.series[0].data = ageData;
    const ageChart = echarts.init(document.getElementById('ageChart'));
    ageChart.setOption(ageChartOption)
    highlight(ageChart, ageChartOption)
})

/**
 * 
 * 性别 报表
 * 
 */
const sexChartOption = {
    tooltip : {
        trigger: 'item',
        formatter: "{a} <br/>{b} : {c} ({d}%)"
    },
    color: ['#bf4d42', '#61a0a8', '#d48265', '#91c7ae','#749f83',  '#ca8622', '#bda29a','#6e7074', '#546570', '#c4ccd3'],
    toolbox: {
        show : false,
    },
    calculable : true,
    series : [
        {
            name:'性别',
            type:'pie',
            radius: ['50%', '70%'],
            center : ['50%', '55%'],
            avoidLabelOverlap: false,
            label: {
                normal: {
                    show: true,
                    textStyle: {
                        fontSize: '14',
                        fontWeight: 'bold'
                    },
                    formatter: '{b}:{c}' + '\n\r' + '({d}%)'
                },
                emphasis: {
                    show: false,
                    textStyle: {
                        fontSize: '14',
                        fontWeight: 'bold'
                    }
                }
            },
            labelLine: {
                normal: {
                    show: false
                }
            },
        }
    ]
};
const sexData = [];
getData(3).then(res => {
    res.forEach(sex => {
        sexData.push({
            value: sex.con,
            name: sex.xingbiemc
        })
    })
    sexChartOption.series[0].data = sexData;
    const sexChart = echarts.init(document.getElementById('sexChart'));
    sexChart.setOption(sexChartOption)
    highlight(sexChart, sexChartOption)
})

/**
 * 
 * 医生工作量趋势 报表
 * 
 */
let workloadOption = {
    tooltip : {
        trigger: 'axis',
        axisPointer: {
            type: 'cross',
            label: {
                backgroundColor: '#6a7985'
            }
        }
    },
    color: ['#bf4d42', '#61a0a8', '#d48265', '#91c7ae','#749f83',  '#ca8622', '#bda29a','#6e7074', '#546570', '#c4ccd3'],
    legend: {
        data:['门诊','住院','体检'],
        right: 10,
        top: 10,
        bottom: 20,
        textStyle: {
            color: "#fff"
        }
    },
    textStyle: {
        color: '#fff'
    },
    toolbox: {
        show: false
    },
    grid: {
        left: '5%',
        right: '5%',
        bottom: '2%',
        containLabel: true
    },
    xAxis : [
        {
            type : 'category',
            boundaryGap : false,
            data : ['周一','周二','周三','周四','周五','周六','周日'],
            axisLine: {
                lineStyle: {
                    color: '#fff'
                }
            }
        }
    ],
    yAxis : [
        {
            type : 'value',
            axisLine: {
                lineStyle: {
                    color: '#fff'
                }
            },
        },
        {
            type : 'value',
            axisLine: {
                lineStyle: {
                    color: '#fff'
                }
            }
        },
    ],
};
let workloadData = [];
getData(8).then(res => {
    cfgObj = {
        mz: [],
        tj: [],
        zy: []
    }
    date = [];
    res.forEach(work => {
        cfgObj.mz.push(work.mz)
        cfgObj.tj.push(work.tj)
        cfgObj.zy.push(work.zy)
        date.push(work.record_day)
    })
    workloadData = [
        {
            name:'门诊',
            type:'line',
            stack: '总量',
            areaStyle: {},
            data:cfgObj.mz,
            yAxisIndex: 1,
        },
        {
            name:'住院',
            type:'line',
            data:cfgObj.zy,
        },
        {
            name:'体检',
            type:'line',
            data:cfgObj.tj,
        },
    ]
    workloadOption.series = workloadData;
    workloadOption.xAxis[0].data = date;
    const workloadChart = echarts.init(document.getElementById('workloadChart'));
    workloadChart.setOption(workloadOption)
    highlight(workloadChart, workloadOption)
})

/**
 * 
 * 医疗分布 报表
 * 
 */
let allergicOption = {
    tooltip : {
        trigger: 'item',
        formatter: "{a} <br/>{b} : {c} ({d}%)"
    },
    legend: {
        type: 'scroll',
        orient: 'vertical',
        right: 10,
        top: 'middle',
        selected: {
            '鸡蛋': true, '面粉': true, "花生": true, '牛奶': true, "鱼虾": true, "大豆": true
        },
        textStyle: {
            color: "#fff"
        }
    },
    color: ['#bf4d42', '#61a0a8', '#d48265', '#91c7ae','#749f83',  '#ca8622', '#bda29a','#6e7074', '#546570', '#c4ccd3'],
    textStyle: {
        color: '#fff'
    },
    series : [
        {
            name: '医疗分布',
            type: 'pie',
            radius : '70%',
            center: ['40%', '53%'],
        }
    ]
};
let allergicData = [];
let allergicNames = ['三级甲', '三级乙', "二级甲", "二级乙", "社区医院，卫生院"];
getData(9).then(res => {
    res.forEach(item => {
        allergicData.push({
            name: item.level,
            value: item.total
        })
    })
    allergicOption.legend.data = allergicNames;
    allergicOption.series[0].data = allergicData;
    const allergicChart = echarts.init(document.getElementById('allergicChart'));
    allergicChart.setOption(allergicOption)
    highlight(allergicChart, allergicOption)
})
/**
 * 
 * 疾病合并症 报表
 * 
 */
diseaseOption = {
    title : {
        text: '测试数据',
        subtext: 'From d3.js',
        x:'right',
        y:'bottom'
    },
    tooltip : {
        trigger: 'item',
        formatter: function (params) {
            if (params.indicator2) { // is edge
                return params.value.weight;
            } else {// is node
                return params.name
            }
        }
    },
    toolbox: {
        show : true,
        feature : {
            restore : {show: true},
            magicType: {show: true, type: ['force', 'chord']},
            saveAsImage : {show: true}
        }
    },
    legend: {
        x: 'left',
        data:['group1','group2', 'group3', 'group4']
    },
    series : [
        {
            type:'',
            sort : 'ascending',
            sortSub : 'descending',
            showScale : true,
            showScaleText : true,
            data : [
                {name : 'group1'},
                {name : 'group2'},
                {name : 'group3'},
                {name : 'group4'}
            ],
            itemStyle : {
                normal : {
                    label : {
                        show : false
                    }
                }
            },
            matrix : [
                [11975,  5871, 8916, 2868],
                [ 1951, 10048, 2060, 6171],
                [ 8010, 16145, 8090, 8045],
                [ 1013,   990,  940, 6907]
            ]
        }
    ]
};
// const diseaseChart = echarts.init(document.getElementById('diseaseChart'));
// diseaseChart.setOption(diseaseOption)

/**
 * 饼状图 循环高亮
 * @param {*} myChart 实例化的 Echarts 对象
 * @param {*} option 配置
 */
function highlight(myChart, option) {
    var app = {
        currentIndex: -1
    };
   
    setInterval(function () {
        var dataLen = option.series[0].data.length;
        // 取消之前高亮的图形
        myChart.dispatchAction({
            type: 'downplay',
            seriesIndex: 0,
            dataIndex: app.currentIndex
        });
        app.currentIndex = (app.currentIndex + 1) % dataLen;
        // 高亮当前图形
        myChart.dispatchAction({
            type: 'highlight',
            seriesIndex: 0,
            dataIndex: app.currentIndex
        });
        // 显示 tooltip
        myChart.dispatchAction({
            type: 'showTip',
            seriesIndex: 0,
            dataIndex: app.currentIndex
        });
    }, 3000);
}