var fs = require("fs");

var {exec} = require("child_process");
const { spawn } = require('child_process');
const { execFile } = require('child_process');
const noop = require('lodash/noop');


function traverseDir(callback){
    callback = callback || noop;
    fs.readdir(__dirname,function(err, files){
        if (err) {
            callback(err);
            return console.error(err);
        }
        files.forEach( function (file){
            console.log("file",file);
            fs.stat(file,function (err,stats) {
                if (err) {
                    callback(err);
                    return console.error(err);
                }

                if(stats.isDirectory()){
                    callback(null,file);
                }
            })
        });
    });
}


function initGit(path,callback) {
    callback = callback || noop;
    execFile("git",['init'],{cwd : path},function(err, stdout, stderr){
        if(err){
            callback(err);
            return console.log("err",err);
        }
        console.log("stdout:",stdout);
        console.log("stderr",stderr);

        callback(err, path);
    });
}


function dealPushIssue(path,callback) {
    callback = callback || noop;
    execFile("git",['config','receive.denyCurrentBranch','ignore'],{cwd : path},function(err, stdout, stderr){
        if(err){
            callback(err);
            return console.log("push issue err!",err);
        }
        console.log("stdout:",stdout);
        console.log("stderr",stderr);

        console.log("push issue solved!");

        callback();
    });
}



function addUserName(path,name,email){
    execFile("git",['config','user.name',name],{cwd : path},function(err, stdout, stderr){
        if(err){
            return console.log("err",err);
        }
        console.log("stdout:",stdout);
        console.log("stderr",stderr);

        console.log("successfully set user name!");

        execFile("git",['config','user.email',email],{cwd : path},function(err, stdout, stderr){
            if(err){
                return console.log("err",err);
            }
            console.log("stdout:",stdout);
            console.log("stderr",stderr);

            console.log("successfully set user email!");

        });

    });

}


traverseDir(function (err, path) {
    if(err){
        return;
    }
    initGit(path,function (err, path) {
        if(err){
            return;
        }
        dealPushIssue(path);
    })
});

















