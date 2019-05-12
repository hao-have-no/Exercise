var mysql=require("mysql");
var db={};

var pool = mysql.createPool({
    host :'localhost',
    user:'root',
    password:'123456',
    database:'person'
})

db.query=function(sql,callback){
    if (!sql){
        callback();
        return;
    }

    pool.query(sql,function (err,rows,fields) {
        if (err){
            console.log(err);
            callback(err,null);
            return;
        }
        callback(null,rows,fields);
    })

}

module.exports =db;