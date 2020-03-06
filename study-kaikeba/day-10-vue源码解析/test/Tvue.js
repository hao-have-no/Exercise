class Tvue{
    constructor(options){
        this.$options = options;//获取实例化对象
        this.$data=options.data;//获取实例化对象所携带的值数组

        console.log(options);

        this.observe(this.$data);
    }

    //观察数据变化
    observe(value){
        //判断value的值和对象,从而进行对处理
        if (!value || typeof value !== 'object'){
            return;
        }

        //遍历,根据对象检测函数(Object.defineProperty),
        //赋予每个对象对应的方法
        Object.keys(value).forEach(key =>{
            this.defineReactive(value,key,value[key]);
        })
    }

    //数据监听-通过数据劫持策略
    defineReactive(obj,key,value){
        Object.defineProperty(obj,key,{
            set:function(newVal){
                if (newVal === value){
                    return
                }
                value = newVal;
                console.log('key发生变化,属性更新,新值为',value)
            },
            get:function(){
                return value;
            }
        })
    }
}
