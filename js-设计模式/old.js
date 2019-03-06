"use strict"

var meara = {};

(function(){

    var m=meara;

    m.Find=function(el,opt){
        console.log("chanjian"+el+opt);
    }

    Find.prototype.say=function(name){
        alert(name);
    }


    //兼容CommonJs规范
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = Find;
    };

    //兼容AMD/CMD规范
    if (typeof define === 'function') define(function() {
        return Find;
    });

    corp.Find=Find;

}).call(this || (typeof window !== 'undefined' ? window : global));

