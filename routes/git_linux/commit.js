var fs = require("fs");
const readline = require('readline');

var {exec} = require("child_process");
const { spawn } = require('child_process');
const { execFile } = require('child_process');


function addAll(path,callback) {
    execFile("git",['add','*'],{cwd : path},function(err, stdout, stderr){
        if(err){
            return console.log("提交路径错误!",err);
        }
        console.log("stdout:",stdout);
        console.log("stderr",stderr);

        if(callback){
            callback(path);
        }
    });
}


function commitAll(path,message) {
    execFile("git",['commit','-a','-m',message],{cwd : path},function(err, stdout, stderr){
        if(err){
            return console.log("无需提交内容!",err);
        }
        console.log("stdout:",stdout);
        console.log("stderr",stderr);

        console.log("提交成功！",message);
    });
}


function readSyncByRl(tips) {
    tips = tips || '> ';

    return new Promise((resolve) => {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        rl.question(tips, (answer) => {
            rl.close();
            resolve(answer.trim());
        });
    });
}

readSyncByRl('请输入提交目录绝对路径：').then((res) => {
    console.log("提交目录为：",res);
    addAll(res,function(path) {
        readSyncByRl('请输入提交信息：').then((res) => {
            commitAll(path,res);
        });
    });
});










