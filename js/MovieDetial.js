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
  TouchableWithoutFeedback,
  ToastAndroid
} from 'react-native';

// 引入数据库操作和Movie类
import SQLite from './db/SQLite';
import Movie from './db/Movie';

import Dimensions from 'Dimensions';

const sqlite = new SQLite();

const {height, width} = Dimensions.get('window');

export default class MovieDetial extends Component {

  constructor(props){
    super(props);
    this.state = {
      isCollection:false
    }
  }

  componentDidMount(){
    // 判断是否收藏
    sqlite.findCollectionByName(this.props.data.title).then((result)=>{
        if(result){
            this.setState({
                isCollection:true,
            });
        }
    }).catch((e)=>{
      console.log('出错了')
    }).done();
  }

  _onCollectionPress(movie){
    this.setState({
      isCollection:!this.state.isCollection
    })

    if(this.state.isCollection){
      ToastAndroid.show('取消收藏',ToastAndroid.SHORT);
      // 删除收藏条目
      sqlite.deleteCollectionByName(this.props.data.title).then(()=>{
        this.setState({
          isCollection:false
        })
      }).catch((e)=>{}).done();
    }else{
      // 保存收藏条目
      var coll = new Movie();
      coll.setName(movie.title);
      coll.setPic(movie.images.large);
      // var date = new Date();
      // var time=date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate()+' ';
      // var hours = date.getHours();
      // if(hours < 9){
      //     time = time+'0'+hours+':';
      // }else {
      //     time = time+hours+':';
      // }
      // var minutes = date.getMinutes();
      // if(minutes < 9){
      //     time = time+'0'+minutes+':';
      // }else {
      //     time = time+minutes+':';
      // }
      // var sec = date.getSeconds();
      // if(sec < 9){
      //     time = time+'0'+sec;
      // }else {
      //     time = time+sec;
      // }
      // coll.setTime(time);
      sqlite.saveCollection(coll).then(()=>{
          
      }).catch((e)=>{}).done();


      ToastAndroid.show('已经收藏',ToastAndroid.SHORT);
    }

  }

  gotoMovie(){
    const {navigator} = this.props;
    if(navigator){
      navigator.pop();
    }
  }

  render() {

    let src = this.state.isCollection?require('../img/icon_collection_true.png'):require('../img/icon_collection_normal.png');

    return (
      <View style={styles.container}>
        <View style={styles.topBackTxt} >
          <Text style={{color:'orange',textDecorationLine:'underline'}} onPress={()=>this.gotoMovie()}>点击返回</Text>
        </View>
        <View style={{justifyContent:'center',alignItems:'center'}}>
          <Text style={{fontSize:18,color:'red'}}>{this.props.data.title}</Text>
          <Image style={{width:300,height:450}} source={{uri:this.props.data.images.large}} />
          <View>
            <Text>点击收藏</Text>
            <TouchableWithoutFeedback onPress={()=>this._onCollectionPress(this.props.data)}>
              <Image style={{width:40,height:40}} source={src} />
            </TouchableWithoutFeedback>
          </View>
        </View>
      </View>
    )
  }

}

const styles = StyleSheet.create({
  container:{
    // flex:1,
    justifyContent:'center',
    alignItems:'center'
  },
  topBackTxt:{
    // flex:1,
    width:width,
    height:40,
    paddingLeft:10,
    justifyContent:'center',
    backgroundColor:'#fff',
    borderBottomWidth:1,
    borderBottomColor:'gray'
  }
});