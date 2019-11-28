var express = require('express');
var router = express.Router();
var app = express();
var fs = require("fs");

var path = require("path");

const git = require("../git_function/git_tools");


/*--store builder--*/
/*
*
* 操作成功返回工作路径;
*
* */

function createWorkSpace(origin, name, callback){
    if(callback){
        callback = callback;
    }

    var headPath = path.resolve('./public/workspaces');
    var createPath = path.join(headPath,name);

    try{
        fs.mkdir(createPath,function(err){
            if(err) {
                throw err;
                return console.log("创建用户工作区功能失败!",err);
            }
            console.log("用户目录创建成功！名称为",createPath);

            git.clone(origin,createPath,function (err) {
                if(err){
                    throw err;
                    return console.log("Git clone 用户工作区功能失败!",err);
                }

                git.dealPushIssue();

                git.add("*",createPath ,function (err) {
                    if(err){
                        throw err;
                        return;
                    }

                    git.commit(createPath,"用户工作空间git初始化成功!",function (err) {
                        if(err){
                            throw err;
                            return;
                        }
                    });

                });
            });

        });

        callback(null, createPath);

    }catch (err) {
        destroyWorkSpace(createPath);
        callback(err);
    }

}


/*--store destroyer--*/

function destroyWorkSpace(path){

    fs.rmdir(path,function(err){
        if(err) {
            throw err;
            return console.log("销毁用户工作区功能失败!",err);
        }
        console.log("用户目录销毁成功！名称为",path);
    });
}


/*--修改、保存并提交文件--*/

function saveChanges(fileNames, userPath, callback) {



}



/*--路径生成器--*/
/*
* fileName : 格式为  bill.new.free;
*
*
* */

function pathGenerator(fileName, dirName, username){



}













