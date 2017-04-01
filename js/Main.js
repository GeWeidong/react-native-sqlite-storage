/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Image,
  BackAndroid,
  ToastAndroid
} from 'react-native';

import SQLite from './db/SQLite';
let sqLite = new SQLite();

import ScrollableTabView,{DefaultTabBar} from 'react-native-scrollable-tab-view';

import Movies from './Movies';
import History from './History';
// 引入缓存列表
import StorViewList from './StorViewList';


export default class Main extends Component {

  //省略其它代码
  componentDidMount(){
      sqLite.createTable();

      this._addBackAndroidListener(this.props.navigator);
  }

  componentWillUnmount(){
      sqLite.close();

      this._removeBackAndroidListener();
  }

  //移除监听
  _removeBackAndroidListener(){
    BackAndroid.removeEventListener('hardwareBackPress');  
  }

  //监听Android返回键
  _addBackAndroidListener(navigator){
      var currTime = 0;
      BackAndroid.addEventListener('hardwareBackPress',()=>{
        if(!navigator){return false;}

        const routers = navigator.getCurrentRoutes();

        if(routers.length == 1){
          var nowTime = (new Date()).valueOf();
                if(nowTime - currTime > 2000){
                    currTime = nowTime;
                    ToastAndroid.show('再按一次退出',ToastAndroid.SHORT);
                    return true;
                }
          return false;
        }else{//在其他子页面
          navigator.pop();
          return true;
        }
      });
  }

  render() {
    return (
      <ScrollableTabView
        tabBarPosition='bottom'
        renderTabBar={() => <DefaultTabBar/>}>
        

        <Movies navigator={this.props.navigator} tabLabel="电影列表"/>        
        <History navigator={this.props.navigator} tabLabel="已收藏列表"/>    
        <StorViewList navigator={this.props.navigator} tabLabel="浏览记录"/>    


      </ScrollableTabView>
    );
  }
}

const styles = StyleSheet.create({
  
});

