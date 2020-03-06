class Kvue{
   constructor(options){
       this.$options = options;
   }
}



// class KVue{
//     constructor(options){
//         this.$options = options;
//
//         //数据响应化
//         this.$data = options.data;
//
//         //对数据进行get,set设置，后期响应化
//         this.observe(this.$data);//观察和监听
//
//
//         // //模拟watch操作
//         // new Watch();//ｔｈｉｓ指向dep.target
//         // this.$data.test;//defineReactive执行，get方法执行，dep加入改依赖
//         // new Watch();
//         // this.$data.foo.bar;
//         //每一次的ｗａｔｃｈ声明后，赋予的操作会执行数据响应，在响应中对应ｋｅｙ的变化触发了ｄｅｐ.add（依赖收集）
//         //每一次的watch会覆盖前面的，从而进行对整个数据的监听
//
//         new Compile(options.el,this);//准备编译
//
//         //判断是够创建
//         if (options.created){
//             //ｃｒｅａｔｅｄ对ｔｈｉｓ做了绑定
//             options.created.call(this);
//         }
//
//     }
//
//     //成员方法
//     observe(value){
//         if (!value || typeof value !== 'object'){
//             return;
//         }
//
//         //遍历该对象，通过get和set对对象进行操作
//         Object.keys(value).forEach(key=>{
//             this.defineReactive(value,key,value[key]);
//
//             //代理data中的属性到vue的实例上
//             this.proxyData(key);
//         })
//     }
//
//     //数据响应化
//     defineReactive(obj,key,val){
//         this.observe(val);//解决数据层级的嵌套
//
//         const dep=new Dep();//这个是独立的声明，为的是当前传入的key
//
//         Object.defineProperty(obj,key,{
//             get:function(){
//                 Dep.target&&dep.addDep(Dep.target);
//                 //相当于是给key增加了一个独立的watch,而dep.target指向的就是单独的watch.
//                 console.log(Dep.target);
//                 return val;
//             },
//             set:function(newVal) {
//                 if (newVal === val){
//                     return;
//                 }
//                 val = newVal;
//                 dep.notify();
//                 //由于属性变化，会执行set数据更改方法，在该方法中进行广播，比较差异，进行更新
//
//
//                 // console.log(`${key}属性更新了：${val}`)
//                 //在index中的测试下，更改只输出了一套，需要进行递归操作
//             }
//         })
//     }
//
//     proxyData(key){
//         Object.defineProperty(this,key,{
//             get(){
//                 return this.$data[key];
//             },
//             set(newVal){
//                 this.$data[key]= newVal;
//             }
//         })
//     }
// }
//
//
// //用来管理watch，通知所有watch进行更新
// class Dep{
//     constructor(){
//         this.deps=[];//存放若干依赖，ｗａｔｃｈ集合，每个watch对应一个属性
//     }
//
//     addDep(dep){
//         this.deps.push(dep);
//     }
//
//     notify(){
//         //调用deps提供给我们的调用方法,
//         //通知所有依赖更新(证明了前面dep是watch的管理，且dep.target指向watch,所有直接有update方法)
//         this.deps.forEach(dep => dep.update());//通知监控进行更新
//     }
// }
//
// //watch:负责更新视图，有多少个属性就有多少个watch（见图分解）
// class Watch{
//     constructor(vm,key,cb) {
//         this.vm=vm;
//         this.key=key;
//         this.cb=cb;
//
//         Dep.target = this; //将当前watch实例指向dep静态属性target．作用：通信，静态属性每一次操作都会进行覆盖前面的
//         //在constructor中模拟watch操作
//         //第一个watch声明后,watch的实例指向了dep.target,读了属性后触发get方法，相当于Dep加入了dep，形成自己的作用域
//         //而在defineReactive执行中的ｋｅｙ指向的是测试中的test，相当于是在test上加了一个监听器
//         //第二个watch生命后覆盖之前的dep.target，相当于又独立增加了一个关于bar的监听
//
//
//         //读属性，触发get,添加依赖
//         this.vm[key];//不是$data，所以需要参数进行代理
//         Dep.target=null;
//     }
//
//     update(){
//         console.log('属性更新了');
//         this.cb.call(this.vm,this.vm[this.key]);//重新改变作用域的指向
//     }
// }
