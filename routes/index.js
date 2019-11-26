var express = require('express');
var router = express.Router();
var app = express();
var fs = require("fs");

var nodeCmd = require('node-cmd');
var {exec} = require("child_process");
const { spawn } = require('child_process');
const { execFile } = require('child_process');

global.pathStore = {};
const headPath = "C:\\Users\\Administrator\\learn_git\\public\\workspaces\\";
const gitOriginPath = "C:\\Users\\Administrator\\learn_git\\public\\source";

/* GET home page. */
router.get('/', function (req, res, next) {

    var name = nameCreater();

    initWorkspace(name);

    res.render('index', {name: name});
});


/* file manager!. */
router.post("/getFile",function(req, res, next){
    var fileName = gitOriginPath + "\\demo.txt";

    getFile(fileName, function (data) {
        res.json(data);
    });

});


function getFile(name, callback){

    fs.readFile(name, "utf-8", function (err, data) {
        if (err) {
            return console.error(err);
        }

        var results = data;

        callback(results);
    });


}



function modifyFileAt(value, path, callback){

    fs.writeFile(path, value, function (err) {
        if (err) {
            return console.error(err);
        }

        console.log("数据写入成功！");
        callback();

    });

}







/* add commit at workspace . */
router.post("/commit",function(req,res,next){
    var name = req.body.username;
    var value = req.body.value;

    var files = req.body["filenames[]"];

    var createPath = headPath + name;
    // var modifyPath = headPath + name + "\\source\\" + fileName;

    var commitInfo = "YOUJUN提交了修改";

    var msg = {
        stat : ""
    };

    // modifyFileAt(value, modifyPath, function () {
    //     var pushPath = headPath + name + "\\" + "source";
    //     console.log("pushPath=-======================",pushPath);
    //     addChangesWith(files,pushPath,function () {
    //
    //         commitChanges(commitInfo);
    //
    //         res.json(msg);
    //     });
    // });

    var pushPath = headPath + name + "\\" + "source";
    console.log("pushPath=-======================",pushPath);
    addChangesWith(files,pushPath,function () {

        commitChanges(commitInfo,pushPath);

        res.json(msg);
    });

});


/* compare workspace with repository . */
router.post("/push",function(req,res,next){
    var name = req.body.username;
    var files = req.body.files;

    var pushPath = headPath + name + "\\" + "source";

    var msg = {
        stat : ""
    };
    pushModifiedData(pushPath,function(flow, info){

        if(flow){
            msg.stat = "conflict-free"
        }else{
            msg.stat = "conflict"
        }

        if(info){
            console.log("info-----",info);
            msg.files = info;
        }

        res.json(msg);

    });

});




/* GET name when logout . */
router.post('/logout',function (req,res,next) {
    var status = req.body.status;
    var name = req.body.username;
    console.log("logoutName--------------------------------------------",name);
    if(status == '1'){
        console.log("refresh now!");
    }else if(status == '2'){
        console.log("log out now!");
    }

    res.json("msg");

    // destroyWorkspace(name);

});


/*--workspace builder!--*/

global.nameIndex = 1;
global.nameList = [];

function nameCreater() {
    var nameList = global.nameList;
    nameIndex = global.nameIndex + 1;
    var name = "branch" + nameIndex;
    nameList.push(name);
    return name;
}


function initWorkspace(name) {

    createWorkSpaceFor(name);

}


function destroyWorkspace(name){
    var path = global.pathStore[name];
    console.log("destroyPath",path);
    fs.rmdir(path,function (err) {
        if(err){
            return console.log("err",err);
        }

        console.log("用户目录销毁成功！名称为",path);
    })
}



/*--store builder--*/

function createWorkSpaceFor(name){
    var headPath = "C:\\Users\\Administrator\\learn_git\\public\\workspaces\\";

    var createPath = headPath + name;
    fs.mkdir(createPath,function(err){
        if(err) {
            return console.log(err);
        }
        console.log("用户目录创建成功！名称为",createPath);
        global.pathStore[name.toString()] = createPath;
        console.log("pathStore",global.pathStore);

        exec("git clone " + gitOriginPath,{cwd : createPath},function(err, stdout, stderr){
            if(err){
                return console.log("err",err);
            }
            console.log("cd:",stdout);
            console.log("stderr",stderr);
        })

    });
}


/*--git manager!--*/


/*git 添加到暂存库!*/
function addChangesWith(files, path, callback) {
    console.log("files",files);

    for(var i =0;i<files.length;i++){
        var name = files[i];
        console.log("name",name);

        execFile("git",['add',name],{cwd : path},function(err, stdout, stderr){
            if(err){
                return console.log("err",err);
            }
            console.log("stdout:",stdout);
            console.log("stderr",stderr);
        })

    }

    callback();
}


/*git commit!*/

function commitChanges(info, path) {
    execFile("git",['commit','-m',info],{cwd : path},function(err, stdout, stderr){
        if(err){
            return console.log("err",err);
        }
        console.log("stdout:",stdout);
        console.log("stderr",stderr);
    });
}


/*git push!*/
function pushModifiedData(path, callback){

    exec("git push",{cwd: path},function (err, stdout, stderr) {
        var ifFlow = true;
        console.log("err--------------------",err);
        if(err){
            console.log("we got a issue!---------------------");
            cloneFetchAt(path,function(){
                ifFlow = false;

                returnDiffInfo(path,function (info) {

                    callback(ifFlow,info);

                });
                return;
            });

            return;
        }

        console.log("stdout????:",stdout);
        console.log("stderr？？？？",stderr);
        console.log("All ----------------------------- set!");

        originGatherMerge();
        callback(ifFlow);
    })

}


/*git clone-mate fetch!*/
function cloneFetchAt(path, fetchcallback){

    exec("git fetch",{cwd: path},function (err, stdout, stderr) {
        if(err){
            console.log("err",err);
        }

        console.log("stdout:",stdout);
        console.log("stderr",stderr);
        console.log("fetch ----------------------------- set!");

        var files = [];

        fetchcallback(files);
    })

}

/*git clone mate return diff files!*/
function returnDiffInfo(path, returncallback){

    const ls = spawn('git',['diff','FETCH_HEAD','HEAD'],{cwd: path});

    ls.stdout.on('data', (data) => {
        console.log("stdout: ",data);
        returncallback(data.toString());
    });

    ls.stderr.on('data', (data) => {
        console.error("stderr: ",data);
    });

    ls.on('close', (code) => {
        console.log(`处理 FETCH_HEAD HEAD 差异信息子进程退出，退出码 ${code}`);
    });

}





/*git origin master get push data!*/
function originGatherMerge(){
    exec("git status",{cwd: gitOriginPath},function (err, stdout, stderr) {
        if(err){
            return console.log("status err",err);
        }
        console.log("status stdout:",stdout);
        console.log("status stderr",stderr);

        exec("git reset --hard Head^",{cwd: gitOriginPath},function (err, stdout, stderr) {
            if(err){
                return console.log("reset err",err);
            }
            console.log("reset stdout:",stdout);
            console.log("reset stderr",stderr);

        })

    })
}



/*--deal with conflict tools!--*/

/*deal with new*/
function addNewRepositoryFile(fileName){
    execFile("git",['checkout','FETCH_HEAD','--',fileName],{cwd : ""},function (err, stdout, stderr) {
        if(err){
            return console.log("err",err);
        }
    })
}








/*--设置cmd机制--*/

function runCmdTest() {
    nodeCmd.get(
        'ipconfig',
        function (err, data, stderr) {
            console.log(data);
        }
    );

    nodeCmd.run('ipconfig');
}


var setupcmd = function () {

};

setupcmd.prototype = {

    getResults: function () {
        var nameList = global.nameList;
        nodeCmd.get('git init', function (err, data, stderr) {
            console.log("success,alright, it just go for once!");
        });

        nameList.forEach(function (value, index, array) {
            nodeCmd.get(value, function (err, data, stderr) {
                console.log("分支",value,"生成成功");
            });
        });

        // nodeCmd.get("git clone learn_git/public/source", function (err, data, stderr) {
        //     if(err){
        //         console.log("err",err);
        //     }
        //     console.log("success,alright, it just go for once!",data);
        // });

    },

    fire: function (ammo) {
        nodeCmd.run(ammo);
    }

};


var setUpCMD = new setupcmd;


module.exports = router;
