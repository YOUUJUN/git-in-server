var fs = require("fs");

var {exec} = require("child_process");
const { spawn } = require('child_process');
const { execFile } = require('child_process');


function traverseDir(callback){
    fs.readdir(__dirname,function(err, files){
        if (err) {
            return console.error(err);
        }
        files.forEach( function (file){
            console.log("file",file);
            fs.stat(file,function (err,stats) {
                if(stats.isDirectory()){
                    callback(file);
                }
            })
        });
    });
}


function initGit(path,callback) {

    execFile("git",['init'],{cwd : path},function(err, stdout, stderr){
        if(err){
            return console.log("err",err);
        }
        console.log("stdout:",stdout);
        console.log("stderr",stderr);

        if(callback){
            callback(path);
        }
    });
}


function dealPushIssue(path,callback) {
    execFile("git",['config','receive.denyCurrentBranch','ignore'],{cwd : path},function(err, stdout, stderr){
        if(err){
            console.log("push issue err!");
            return console.log("err",err);
        }
        console.log("stdout:",stdout);
        console.log("stderr",stderr);

        console.log("push issue solved!");

        if(callback){
            callback();
        }
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


traverseDir(function (path) {
    initGit(path,function (path) {
        dealPushIssue(path);
    })
});
















