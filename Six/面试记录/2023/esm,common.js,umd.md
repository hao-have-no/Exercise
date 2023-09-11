# 前端模块化

## 各种模式的简单解析

### CJS(common.js)
`

   const doSomething = require('./doSomething.js'); 

   module.exports = function doSomething(n) {

    //do something

  }
`

> 特点
+ node 环境常用，同步导入机制
+ 导入的是文件的副本  不能直接在浏览器中使用

### AMD
`

    define(['dep1', 'dep2'], function (dep1, dep2) {

    //Define the module value by returning a value.
    
    return function () {};
});
`
> 特点
+ AMD 是异步(asynchronously)导入模块的(因此得名)

### UMD
`

   (function (window, factory) {
    if (typeof exports === 'object') {  
        module.exports = factory();
    } else if (typeof define === 'function' && define.amd) {
    
        define(factory);
    } else {
    
        window.eventUtil = factory();
    }
})(this, function () {
    //module ...
})
`

> 特点
+ Jquery的机制
+ amd和cjs的规范合并
+ 当使用 Rollup/Webpack 之类的打包器时，UMD 通常用作备用模块

### ESM(ES module)
`

    import React from 'react';

    import {foo, bar} from './myLib';

    export default function() {
        // your Function
    };
    export const function1() {...};
`
> 特点
+ Javascript 提出的实现一个标准模块系统的方案
+ 浏览器兼容性比较好
+ 具有 CJS 的简单语法和 AMD 的异步
+ ES6 的静态模块结构，可以进行 Tree Shaking

## Commonjs 和 Es Module
+ Commonjs 和 Es Module 有什么区别 ？
+ Commonjs 如何解决的循环引用问题 ？
+ 既然有了 exports，为何又出了 module.exports
+ require 模块查找机制
+ Es Module 如何解决循环引用问题
+ exports = {} 这种写法为何无效
+ 关于 import() 的动态引入
+ Es Module 如何改变模块下的私有变量

###  为什么有模块化这个概念
+ 解决局污染和依赖管理混乱问题
+ 通常以匿名函数自执行，形成独立作用域（根据js执行栈的顺序，匿名函数会生成一个函数内部的作用域，外部无法访问，除非通过外部应用的方式，将参数传入函数内部，才能使用）的方案解决变量名污染
+ 依赖管理：下层可以调用上层的方案，反之不行


### Common.js
> 应用场景
+ node 是 common.js 在  服务端的表现
+ Browserify 是 CommonJS 在浏览器中的一种实现（browserify会根据入口文件中的require或者import(ES6,需要安装babel)自动完成依赖分析，并将依赖文件打包为一个单文件）
> 使用与原理
+  commonjs 中每一个 js 文件都是一个单独的模块，我们可以称之为 module
+ 该模块中，包含 CommonJS 规范的核心变量: exports、module.exports、require
+ exports 和 module.exports 可以负责对模块中的内容进行导出
+ require 函数可以帮助我们导入其他模块（自定义模块、系统模块、第三方库模块）中的内容
> 研究

`

// index.js
let name = '《React进阶实践指南》'

module.exports = function sayName  (){
    return name
}

// home.js

const sayName = require('./hello.js')

module.exports = function say(){

    return {
        name:sayName(),
        author:'我不是外星人'
    }
    
}
`
> 实现原理
+ 如何解决变量污染的问题
+ module.exports，exports，require 三者是如何工作的？又有什么关系？

>> 原理解析
+ module 记录当前模块信息
+ require 引入模块的方法
+ exports 当前模块导出的属性
+ 编译的过程中，实际 Commonjs 对 js 的代码块进行了首尾包装
    
代码如下

    (function(exports,require,module,__filename,__dirname){

    const sayName = require('./hello.js')
   
    module.exports = function say(){
        return {
            name:sayName(),
            author:'我不是外星人'
            }
        }
    })

+ 形成包装函数，代码作为包装函数的执行上下文
+ require，exports,module 都是通过形参传入到包装函数中
+ 包装函数的形式如下
    代码如下:

        function wrapper (script) {
            return '(function (exports, require, module, __filename, __dirname) { 
            '+script +'\n
        })'
}

    runInThisContext(modulefunction)(module.exports, require, module, __filename, __dirname)

+ 实际执行时，将上面的script 替换为 上面的处理过后的函数形式
+ 最后在模块加载的时候 通过runInThisContext （浏览器的eval函数） 执行modulefunction,传入require ，exports ，module 等参数。最终我们写的 nodejs 文件就这么执行了。

>> required 执行流程分析
+ require方法执行是，接受的是一个地址标识符，解析标识符得到路径，加载对应的模块
+ 解析标识符： 根据标识符，确认是否是核心模块；区分相对，绝对路径
+ 核心模块处理：核心模块的优先级仅次于缓存加载，在 Node 源码编译中，已被编译成二进制代码，所以加载核心模块，加载过程中速度最快。
+ 自定义模块解析流程
    ![image](https://qiniu.gxxsh.cn/liucheng.png)
+ require() 方法会将路径转换成真实路径，并以真实路径作为索引，将编译后的结果缓存起来，第二次加载的时候会更快
>> require 模块引入与处理
+ common.js 模块同步加载并执行模块文件，在执行阶段会分析模块的依赖情况，采用深度优先遍历（父-子-父）
>> require 加载原理
+ module和Module 的区分
+ module: 每一个js都看做一个module,module保存了exports等信息，还有一个loaded便是该模块是否加载过了
+ Module: 系统运行后，缓存每一个模块加载的信息
+ required 大致工作流程
    ![image](https://qiniu.gxxsh.cn/require.png)
    1. require 接受标识符，分析定位文件， 从Module查询是否有缓存文件，有的话直接返回缓存文件
    2. 没有缓存，创建module对象，缓存到Module，然后执行文件（runInThisContext），加载完文件，将 loaded 属性设置为 true ，然后返回 module.exports 对象。借此完成模块加载流程
    3. 模块导出的就是 return 这个变量的其实相当于 a=b 赋值流程，基本类型导出的是值，应用类型导出的是引用地址
    4. exports和module.exports持有相同引用,因为最后导出的是 module.exports,所以对exports进行赋值会导致exports操作的不再是module.exports的引用

>> required 是怎么避免重复加载和引用的
+ 例子如下:
![image](https://qiniu.gxxsh.cn/yinyong.png)
+ 不会重复：required在每次加载文件，都会存到Module里,判断是够有缓存
+ 避免循环引用：
1. 执行main.js, 执行第一行require('./a')
2. 首先判断a.js是否有缓存,无就加入缓存，然后执行a.js文件
3. 判断b.js是够有缓存，没有的话加入缓存，执行b.js文件内容
4. b文件第一行，引用了a文件并且Module有缓存,直接读值，接下来就是打印console.log('b'),导出方法
(执行b模块时，a模块还未导出方法，b.js同步上下文，还获取不到say)
5. b.js执行完毕，回到a.js 打印 console.log('a'),导出方法;
6. 回到main.js，打印console.log('node 入口文件')，完成整个流程
+ 流程图如下
![image](https://qiniu.gxxsh.cn/7a2084aa55764fa493a7b82dfe2f2d50~tplv-k3u1fbpfcp-zoom-in-crop-mark_1512_0_0_0.awebp)

+ 验证流程
![image](https://qiniu.gxxsh.cn/liucheng1.png)
1. 第一次打印 say 为空对象。
2. 第二次打印 say 才看到 b.js 导出的方法
3. 如何获取到 say 
4. 一是用动态加载 a.js 的方法
5. 二是如上放在异步中加载
6. a.js 是用export.say导出的，b.js使用module.exports 二者有什么区别，a.js改为module.js会不会不一样

>> require 动态加载
+ require 可以在任意上下文，动态加载模块
+ require 本质上就是一个函数，那么函数可以在任意上下文中执行，来自由地加载其他模块的属性方法

>> exports 和 module.exports 区别
+ exports 就是传入到当前模块内的一个对象，本质上就是 module.exports
+ exports ， module 和 require 作为形参的方式传入到 js 模块中。我们直接 exports = {} 修改 exports ，等于重新赋值了形参，那么会重新赋值一份，但是不会在引用原来的形参
+ module.exports 本质上就是 exports ，我们用 module.exports 来实现如上的导出
+ 不想在 commonjs 中导出对象，而是只导出一个类或者一个函数再或者其他属性的情况，那么 module.exports 就更方便了，如上我们知道 exports 会被初始化成一个对象，也就是我们只能在对象上绑定属性，但是我们可以通过 module.exports 自定义导出出对象外的其他类型元素
+ module.exports 当导出一些函数等非对象属性的时候，也有一些风险


### Es Module
+ export 用来导出模块，import 用来导入模块
+ 借助 Es Module 的静态导入导出的优势，实现了 tree shaking。
+ Es Module 还可以 import() 懒加载方式实现代码分割
+ 所有通过 export 导出的属性，在 import 中可以通过结构的方式，解构出来
+ 默认导出 export default

>> 静态语法
+ ES6 module 的引入和导出是静态的，import 会自动提升到代码的顶层 ，import , export 不能放在块级作用域或条件语句中。

>> 执行特性
+ ES6 module 和 Common.js 一样，对于相同的 js 文件，会保存静态属性
+ CommonJS 模块同步加载并执行模块文件，ES6 模块提前加载并执行模块文件，ES6 模块在预处理阶段分析模块依赖，在执行阶段执行模块

>> 导出绑定
+ 不能修改import导入的属性

>> 属性绑定
+ 导入的属性，可以借助对应的方法进行属性值的修改

>> import 属性作出总结
+ 使用 import 被导入的模块运行在严格模式下
+ 使用 import 被导入的变量是只读的，可以理解默认为 const 装饰，无法被赋值
+ 使用 import 被导入的变量是与原变量绑定/引用的，可以理解为 import 导入的变量无论是否为基本类型都是引用传递。

>> import() 动态引入
+ import() 返回一个 Promise 对象， 返回的 Promise 的 then 成功回调中，可以获取模块的加载成功信息
+ 动态加载:import() 动态加载一些内容，可以放在条件语句或者函数执行上下文中
+ import() 可以实现懒加载，举个例子 vue 中的路由懒加载
+ React.lazy 和 Suspense 配合一起用，能够有动态加载组件的效果。React.lazy 接受一个函数，这个函数需要动态调用 import() 。
+ tree shaking 实现


### 总结
> Common.js
+ CommonJS 模块由 JS 运行时实现。
+ CommonJs 是单个值导出，本质上导出的就是 exports 属性
+ CommonJS 是可以动态加载的，对每一个加载都存在缓存，可以有效的解决循环引用问题
+ CommonJS 模块同步加载并执行模块文件

> ESModule
+ ES6 Module 静态的，不能放在块级作用域内，代码发生在编译时。
+ ES6 Module 的值是动态绑定的，可以通过导出方法修改，可以直接访问修改结果。
+ ES6 Module 可以导出多个属性和方法，可以单个导入导出，混合导入导出。
+ ES6 模块提前加载并执行模块文件，
+ ES6 Module 导入模块在严格模式下。
+ ES6 Module 的特性可以很容易实现 Tree Shaking 和 Code Splitting。
