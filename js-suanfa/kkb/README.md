## 算法简述
1. 以工作业务，实际问题的解决为主，进行算法的定向练习
2.　刷题变为日常，平均每周三道以上;


### 概念描述
    var twoSum=function (nums,target){
        for(let i=0,len = nums.length;i<len;i++){
            for(let j=0,len = nums.length;j<len;j++){
                if(nums[i]+nums[j] === target && i !== j){
                    return [i,j]
                }
            }
        }
    }

1. 量级　成为O(n^2);
2. 空间复杂度  数组长度1000  大概占用了多少额外的空间 整个算法只有i,j这两个变量 常量级 O(1)

--------- 进一步解析>  空间换时间　　增加堆栈的扩展

var twoSum=function (nums,target){
    let obj = {};
    for(let i=0,len = nums.length;i<len;i++){
       const num = nums[i];
       if(num in obj){
         return [obj[num],i]　//返回数组的索引值
       }else{
        //没找到的话，对应值当key,value存储当前数组下标  9 [2,5,6,4,1]  {2:7,7:2}  正好的一一对应的关系，能够直接锁定
         obj[target - num] = i;
       }
    }
}
        
事件复杂度　O(n)    空间复杂度 O(n)


### 链表和树
＝

树: 天生适合递归

### 数据结构
> 这个数据结构的增删改查

### 算法思想
> 回溯　letcode
+ 标记　查找下一步　取消下一步
 
### 栈
> 主要用于jsx,html,function闭合,vue模版解析等结构是够正确的判定
