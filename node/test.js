
// testUser.js

var user = require('./bean/user');

// 添加用户
user.addUser('test4','qwertasd','','1').then(function(user) {
    console.log('****************************');
    console.log('user nae: ',user.name);
});
