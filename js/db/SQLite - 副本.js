/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React from 'react';
import SQLiteStorage from 'react-native-sqlite-storage';

SQLiteStorage.DEBUG(true);
var database_name = "demo.db";
var database_version = "1.0";
var database_displayname = "MySQLite";
var database_size = -1;
var db;
const Collection_TABLE_NAME = "Collection";//收藏表
const Storage_TABLE_NAME    = "Storages";//缓存表

const SQLite = React.createClass({

    render(){
        return null;
    },

    componentWillUnmount(){
        if(db){
            this._successCB('close');
            db.close();
        }else {
            console.log("SQLiteStorage not open");
        }
    },

    open(){
        db = SQLiteStorage.openDatabase(
            database_name,
            database_version,
            database_displayname,
            database_size,
            ()=>{
                this._successCB('open');
            },
            (err)=>{
                this._errorCB('open',err);
            });
    },

    createTable(){
        if (!db) {
            this.open();
        }
        //创建收藏表
        db.transaction((tx)=> {
            tx.executeSql('CREATE TABLE IF NOT EXISTS ' + Collection_TABLE_NAME + '(' +//收藏列表
                'id INTEGER PRIMARY KEY NOT NULL,' +      //id作为主键
                'name VARCHAR,' +
                'pic VARCHAR' 
                + ');'
                , [], ()=> {
                    this._successCB('收藏executeSql');
                }, (err)=> {
                    this._errorCB('收藏executeSql', err);
                });


            tx.executeSql('CREATE TABLE IF NOT EXISTS ' + Storage_TABLE_NAME + '(' +//缓存列表
                'id INTEGER PRIMARY KEY NOT NULL,' +      //id作为主键
                'name VARCHAR,' + //名字
                'pic VARCHAR,' +  //图片
                'alt VARCHAR'  //链接
                + ');'
                , [], ()=> {
                    this._successCB('缓存executeSql');
                }, (err)=> {
                    this._errorCB('缓存executeSql', err);
                });


        }, (err)=> {
            this._errorCB('transaction', err);
        }, ()=> {
            this._successCB('transaction');
        })



    },

    close(){
        if(db){
            this._successCB('close');
            db.close();
        }else {
            console.log("SQLiteStorage 打不开了");
        }
        db = null;
    },
    _successCB(name){
        console.log("SQLite 存储 "+name+" 成功！");
    },
    _errorCB(name, err){
        console.log("SQLite 存储 "+name+" 失败:"+err);
    },

    saveCollection(movie){//保存收藏记录

        return new Promise( (resolve,reject) => {
            if(db){
                db.executeSql(
                    'INSERT INTO '+Collection_TABLE_NAME+' (name,pic) VALUES(?,?)',
                    [movie.getName(),movie.getPic()],

                    ()=>{
                        this._successCB('saveCollection');
                        resolve();
                    },

                    (err)=>{
                        this._errorCB('saveCollection',err);
                        reject();
                    })

            }else {
                reject('db not open');
            }
        } )
    },

    findCollectionByName(name){//获取收藏记录
        return new Promise((resolve, reject)=>{
            if(db){
                db.executeSql('SELECT * FROM '+Collection_TABLE_NAME +' WHERE name=? LIMIT 1',[name],
                    (results)=>{
                        if(results.rows.length > 0){   //如果查到的表的行数大于0
                            resolve(results.rows.item(0));
                        }else {
                            reject('not find item');
                        }

                        this._successCB('findCollectionByName')
                    },(err)=>{
                        reject(err);
                        this._errorCB('findCollectionByName',err)
                    });
            }else {
                reject('db not open');
            }
        });

    },

    deleteCollectionByName(name){//删除收藏记录
        return new Promise((resolve, reject)=>{
            if(db){
                db.executeSql('DELETE FROM '+Collection_TABLE_NAME +' WHERE name=?',[name],
                    ()=>{
                        resolve();
                        this._successCB('deleteCollectionByName');
                    },(err)=>{
                        reject(err);
                        this._errorCB('deleteCollectionByName',err);
                    });
            }else {
                reject('db not open');
            }
        });

    },

    listCollection(pageSize,index){//获取收藏记录列表
        return new Promise((resolve, reject)=>{
            if(db){
                db.executeSql('SELECT * FROM '+Collection_TABLE_NAME +' LIMIT '+pageSize+' OFFSET '+((index-1)*pageSize),[],
                    (results)=>{
                        var len = results.rows.length;
                        var datas = [];
                        for(let i=0;i<len;i++){
                            datas.push(results.rows.item(i));
                        }
                        // 把datas传出去
                        resolve(datas);
                        this._successCB('listCollection');
                    },(err)=>{
                        reject(err);
                        this._errorCB('listCollection',err);
                    });
            }else {
                reject('db not open');
            }
        });
    },

    saveStorage(storage){//保存浏览历史记录
        return new Promise((resolve, reject)=>{

            if(db){
                this.findHistoryByName(storage.getName()).then(()=>{
                    // 找到了，那么应该做更新的操作

                }).catch((err){
                    if(err == 0){
                        // 证明没有找到相同的
                        // 插入新的纪录
                        db.executeSql(
                            'INSERT INTO '+Storage_TABLE_NAME+' (name,pic,alt) VALUES(?,?,?)',
                            [storage.getName(),storage.getPic(),storage.getAlt()],

                            ()=>{
                                this._successCB('saveHistory');
                                resolve();
                            },
                            (err)=>{
                                this._errorCB('saveHistory',err);
                                reject(err);
                        });
                    }
                })
            }else{
                reject('db not open');
            }
        });

    },

    findHistoryByName(name){  // 获取浏览记录
        return new Promise( (resolve,reject) => {
            if(db){
                db.executeSql('SELECT * FROM '+Storage_TABLE_NAME +' WHERE name=? LIMIT 1',[name],
                    (results)=>{
                        if(results.rows.length > 0){
                            resolve(results.rows.item(0));
                        }else {
                            reject(0);   // err === 0
                        }

                        this._successCB('findHistoryByName')
                    },(err)=>{
                        reject(err);
                        this._errorCB('findHistoryByName',err)
                    });
            }else{
                reject('打开失败');
            }
        } )
    },

    listHistory(pageSize){//获取观看浏览记录列表
        return new Promise((resolve, reject)=>{
            if(db){
                db.executeSql('SELECT * FROM '+Storage_TABLE_NAME +' LIMIT '+pageSize,[],
                    (results)=>{
                        var len = results.rows.length;
                        var datas = [];
                        for(let i=0;i<len;i++){
                            datas.push(results.rows.item(i));
                        }
                        resolve(datas);
                        this._successCB('listHistory');
                    },(err)=>{
                        reject(err);
                        this._errorCB('listHistory',err);
                    });
            }else {
                reject('db not open');
            }
        });
    },

});

module.exports = SQLite;



/*{
    "dbargs": {
        "dbname": "demo.db"
    },
    "executes": [
        {
            "qid": 1111,
            "sql": "BEGIN",
            "params": []
        },
        {
            "qid": 1111,
            "sql": "CREATE TABLE IF NOT EXISTS Collection(id INTEGER PRIMARY KEY NOT NULL,name VARCHAR,actor VARCHAR,time VARCHAR,pic VARCHAR,url VARCHAR,title VARCHAR);",
            "params": []
        }
    ]
}*/


/*
{
    "dbargs": {
        "dbname": "demo.db"
    },
    "executes": [
        {
            "qid": 1111,
            "sql": "SELECT 1",
            "params": []
        },
        {
            "qid": 1111,
            "sql": "INSERT INTO Collection (name,pic) VALUES(?,?)",
            "params": [
                "美女与野兽",
                "https://img3.doubanio.com/view/movie_poster_cover/lpst/public/p2417948644.jpg"
            ]
        }
    ]
}
*/