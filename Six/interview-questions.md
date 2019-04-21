一.vue-父子组件通信方式<br/>
1.props-属性传递<br/>
父组件
<children :content="message"></children>
data: {
    message: 'from parent'
  }
<br/>子组件:
props:{
    content:{
    type:String,
    default:()=>{return 'from children'}
    }
}<br/>
2.$emit事件发布与订阅<br/>
子组件可以向父组件传输数据
子组件:
this.$emit('greet',"hello)<br/>
父组件
 <my-button @greet="sayHi"></my-button><br/>
 methods: {
     sayHi (val) {
       alert('Hi, ' + val) // 'Hi,hello!'
     }<br/>
 3.$attrs 和 $listeners,监听属性和方法<br/>
 父组件
  <child
     :foo="foo"
     :bar="bar"
     @one.native="triggerOne"
     @two="triggerTwo">
   </child><br/>
 子组件
  console.log(this.$attrs, this.$listeners),输入的内容是父组件定义好的
     // -> {bar: "parent bar"}
     // -> {two: fn}<br/>
 4.vuex,状态管理,通过commit和getter
 
 二:vue中路由拆分懒加载<br/>
 主路由:<br/>
 export default new Router({
   routes: [
     {
       path: '/home',
       name: 'Home',
       component:home
     },
     ...modArr,
     ...modList,
     {
       path: '*',
       redirect: '/home'
     }
   ]
 })<br/>
 子路由:<br/>
 export default [
   {
     path: '/modArrOne',
     component: resolve => require(['../../component/modArr/modArrOne'],resolve)
   },
   {
     path: '/modArrOne/detail',
     component: resolve => require(['../../component/modArr/modArrTwo'],resolve)
   }
 ]
 
 
 文章记录:
 1.前端攻城狮自检清单和深入知识点
 https://segmentfault.com/a/1190000018873042
 
 2.前端进阶,更为深入的优化和处理思路与问题
 https://segmentfault.com/a/1190000018869555
 
 3.javascript常见知识点
 https://segmentfault.com/a/1190000018854431