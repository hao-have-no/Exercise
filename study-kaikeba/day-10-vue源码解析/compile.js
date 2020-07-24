//new compile(el＜dom元素＞,vm＜vue实例＞)

class Compile{
    constructor(el,vm){
        //当前只做选择器

        this.$el=document.querySelector(el);//遍历的宿主节点

        this.$vm=vm;

        //开始编译,判断是否有节点数据
        if (this.$el){
            //转化内容为片段
            this.$fragment=this.node2Fragment(this.$el);
            //执行编译
            this.compile(this.$fragment);//有内容的html片段
            //将编译完的结果追加到$el
            this.$el.appendChild(this.$fragment);//存在的问题：新的和原有的会出现冲突？
        }
    }

    //将宿主元素中的代码提出便利，比较高效
    node2Fragment(el){
        const frag=document.createDocumentFragment();//建立ｄｏｍ节点
        //将el所有元素搬家至frag
        let child;
        while(child = el.firstChild){
            frag.appendChild(child);//对之前的el操作,el会越来越少,不会存在冲突
        }
        console.log("片段",frag);
        return frag;
    }

    //编译过程如图
    compile(el){
        const childNode=el.childNodes;
        console.log('元素',el,childNode);
        Array.from(childNode).forEach(node=>{
            if (this.isElement(node)){
               //元素，查找k-,:
                const nodeAttrs=node.attributes;
                console.log('类型',nodeAttrs)
                Array.from(nodeAttrs).forEach(attr=>{
                    const attrName=attr.name;
                    const exp=attr.value;
                    if (this.isDirective(attrName)){
                        // k-text
                        const dir=attrName.substring(2);
                        //执行指令
                        this[dir]&&this[dir](node,this.$vm,exp);
                    }
                    if (this.isEvent(attrName)){
                        const dir=attrName.substring(1);
                        this.eventHandler(node,this.$vm,exp,dir);
                    }
                })
               //  console.log('编译元素'+node.nodeName);
            }else if (this.isInterpolation(node)){
                //对于在html中的静态文字，必须过滤
                //文本
                // console.log('编译文本'+node.textContent);
                this.compileText(node);
            }
            //递归子节点
            if (node.childNodes&&node.childNodes.length>0){
                this.compile(node);
            }
        })
    }

    //更新函数，动态变化进行数据的搜集与改变
    //dir代表跟新的内容类型
    update(node,vm,exp,dir){
        const updateFn=this[dir+'Updater'];//当前类组合函数名
        //初始化做第一次更新
        updateFn&&updateFn(node,vm[exp]); //判断是否存在,后期做了代理，vm.$data[exp] ->vm[exp]

        //进行依赖收集
        new Watch(vm,exp,function (value) {
            updateFn&&updateFn(node,value); //判断是否存在
        });
        //实例化监听器　
        //vm,exp(当前属性),function(属性更新后的方法)
    }

    //各种类型的更新器
    textUpdater(node,value){
        node.textContent=value;//在当前代码下，该方法只会执行一次
    }

    modelUpdater(node,value){
        node.value = value;
    }

    htmlUpdater(node,value){
        node.innerHTML = value;
    }

    //判断节点类型
    isElement(node){
        return node.nodeType === 1;
    }

    isInterpolation(node){
        return node.nodeType === 3 && /\{\{(.*)\}\}/.test(node.textContent);
        //{(.*)结果分组，RegExp是分组的结果集
    }

    isDirective(attr){
        return attr.indexOf("k-") === 0;
    }

    isEvent(attr){
        return attr.indexOf("@") === 0;
    }

    text(node,vm,exp){
        console.log('指令',node,vm,exp)
        this.update(node,this.$vm,exp,'text');
    }

    //事件处理器
    eventHandler(node,vm,exp,dir){
        console.log(node.vm,exp,dir);
        let fn=vm.$options && vm.$options.methods[exp];
        if (fn&&dir){
            node.addEventListener(dir,fn.bind(vm));
        }
    }

    //双向绑定
    model(node,vm,exp){
        //指定input的value属性
        this.update(node,vm,exp,"model");

        //视图对应的模型相应
        node.addEventListener("input",e=>{
            vm[exp]=e.target.value;
        })
    }

    html(node,vm,exp){
        //指定input的value属性
        this.update(node,vm,exp,"html");
    }

    compileText(node){
        //RegExp.$1相当于是第一个正则匹配的结果
        // console.log(RegExp.$1);
        // node.textContent=this.$vm.$data[RegExp.$1];//在当前代码下，该方法只会执行一次

        //增加依赖收集后
        this.update(node,this.$vm,RegExp.$1,'text');
    }


    //什么是编译？
    //进行依赖收集,data中数据模型和视图绑定
    //数据变化，通知依赖进行变更空

    //双向绑定
    //set函数会通知所有的依赖产生变化
}
