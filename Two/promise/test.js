//验证promise
const MyPromise = require('./promise.js')

const promise = new MyPromise((resolve, reject) => {
    resolve('success');
    reject('err')
});

promise.then(value=>{
    console.log('resolve', value)
}, reason => {
    console.log('reject', reason)
});
