var {exec} = require("child_process");
const { spawn } = require('child_process');
const { execFile } = require('child_process');

function git() {

}

git.prototype = {

    /*---git clone---*/
    clone : function (originPath, workPath, callback){
        if(callback){
            callback = callback;
        }
        execFile('git',['clone', originPath],{cwd : workPath}, function (err, stdout, stderr) {
            if(err){
                callback(err);
                return console.log("git clone err!",err);
            }

            if(stdout){
                console.log("stdout:",stdout);
            }

            if(stderr){
                console.log("stderr",stderr);
            }


            callback(null);
            console.log("git clone done at :",originPath);
        })
    },

    /*---deal git push unsuccessful*/
    dealPushIssue : function(path,callback) {
        if(callback){
            callback = callback;
        }
        execFile("git",['config','receive.denyCurrentBranch','ignore'],{cwd : path},function(err, stdout, stderr){
            if(err){
                callback(err);
                return console.log("push issue err!",err);
            }
            console.log("stdout:",stdout);
            console.log("stderr",stderr);

            console.log("push issue solved!");

            if(callback){
                callback(null);
            }
        });
    },

    /*---git add---*/
    add : function(target, path, callback){
        if(callback){
            callback = callback;
        }
        execFile("git",['add',target],{cwd : path},function(err, stdout, stderr){
            if(err){
                callback(err);
                return console.log("提交路径错误!",err);
            }
            console.log("stdout:",stdout);
            console.log("stderr",stderr);

            if(callback){
                callback(path);
            }
        });
    },

    /*---git commit ---*/
    commit : function(path, message, callback){
        if(callback){
            callback = callback;
        }
        execFile("git",['commit','-m',message],{cwd : path},function(err, stdout, stderr){
            if(err){
                callback(err);
                return console.log("无需提交内容!",err);
            }
            console.log("stdout:",stdout);
            console.log("stderr",stderr);

            console.log("提交成功！",message);

            callback(null);

        });
    },

    /*---git commit all ---*/
    commitAll : function(path,message,callback) {
        if(callback){
            callback = callback;
        }
        execFile("git",['commit','-a','-m',message],{cwd : path},function(err, stdout, stderr){
            if(err){
                callback(err);
                return console.log("提交所有内容失败!",err);
            }
            console.log("stdout:",stdout);
            console.log("stderr",stderr);

            console.log("提交所有成功！",message);

            callback(null);

        });
    },

    /*---git push ---*/
    push : function (remote, path, callback) {
        if(callback){
            callback = callback;
        }

        if(!remote){
            remote = "";
        }

        execFile("git",['push', remote],{cwd: path},function (err, stdout, stderr) {
            if(err){
                callback(err);
                return console.log("push 到远程版本库发生冲突!",err);
            }

            console.log("stdout:",stdout);
            console.log("stderr",stderr);

            console.log("push 到远程版本库成功！");

            callback(null);
        })
    }

    /*---git push ---*/
    pushForce : function (remote, path, callback) {
        if(callback){
            callback = callback;
        }

        if(!remote){
            remote = "";
        }

        execFile("git",['push', '--force', remote],{cwd: path},function (err, stdout, stderr) {
            if(err){
                callback(err);
                return console.log("push 到远程版本库发生冲突!",err);
            }

            console.log("stdout:",stdout);
            console.log("stderr",stderr);

            console.log("push 到远程版本库成功！");

            callback(null);
        })
    }

};


var Git = new git;

module.exports = Git;





