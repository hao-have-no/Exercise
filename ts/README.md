# TS系统复习学习
> https://www.bilibili.com/video/BV1Xy4y1v7S2?p=3&vd_source=6313b986ba2a02db2c79b5072c6b6de8

## TyeScript的静态类型

## 复杂类型的声明
+ type 只能通过&合并 支持持所有的类型
+ interface 同步自动合并，extends扩展 只能表达object/funtion/class  
---
    const helloWorld = { first: 'Hello', last: 'World' } 
    // 此时helloWorld的类型自动推导为object，无法约束对象内部的数据类型

    // 通过自定义类型来约束
    interface IHelloWorld {
        first: string
        last: string
    }

    type IHelloWorld {
        first: string
        last: string
    }
---