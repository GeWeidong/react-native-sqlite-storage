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
  Navigator,
  ListView,
  ActivityIndicator,
  TouchableOpacity ,
  RefreshControl,
  ToastAndroid,
  ScrollView
} from 'react-native';

const datas = [];
import SQLite from './db/SQLite';
var sqlite = new SQLite();

import WebViewPage from './WebViewPage';


export default class StorViewList extends Component {

  constructor(props){
    super(props);
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      dataSource: ds.cloneWithRows(datas),
      isLoading:true,
      refreshing:false,
      isRefreshing:false,
      isHasData:false  //是否存在数据，默认没有
    };
  }


  // 跳转到Webview页面
  gotoWebViewPage(data){
    const {navigator} = this.props;
    if(navigator){
      navigator.push({
        name:'WebViewPage',
        component:WebViewPage,
        params:{
          alt:data.alt
        }
      })
    }
  }

  renderRow(rowData){
    return (
      <View style={styles.wrapViewStyle}>
        <TouchableOpacity style={styles.wrapViewStyle} onPress={()=>this.gotoWebViewPage(rowData)}>
          <View style={styles.leftViewStyle}>
            <Image style={{width:60,height:60}} source={{uri:rowData.pic}}/>
            <Text>{rowData.name}</Text>
          </View>
          <View style={styles.rightViewStyle}>
            <Text style={styles.rightTxtStyle}>已浏览</Text>
            <Text onPress={()=>this.deleteHistory(rowData.name)} style={{color:'red',fontWeight:'bold',fontSize:10,marginLeft:7}}>删除本条记录</Text>
          </View>
        </TouchableOpacity>
      </View>
    )
  }

  // 删除本条记录
  deleteHistory(name){
    sqlite.deleteHistory(name).then(()=>{
      this._fetchData();
      ToastAndroid.show('已经删除'+name,ToastAndroid.SHORT);
    }).catch(()=>{
      alert(8)
    }).done();
  }

  componentDidMount(){
    this.setState({
      isLoading:true,
    });

    this._fetchData();
  }

  _fetchData(){

    sqlite.listHistory(20).then((results)=>{
        datas = results;
        // 如果存在数据
        if(results.length >0 ){
          this.setState({
              dataSource:this.state.dataSource.cloneWithRows(datas),
              isLoading:false,
              isRefreshing:false,
              isHasData:true
          });
        }else{
          // 如果不存在数据
          this.setState({
              dataSource:this.state.dataSource.cloneWithRows(datas),
              isLoading:false,
              isRefreshing:false,
              isHasData:false
          })

          ToastAndroid.show('没有浏览记录。',ToastAndroid.SHORT);
        }

    }).catch((err)=>{
        console.log(err);
    }).done();

  }

  // 下拉刷新
  _onRefresh(){
    this.setState({
      isRefreshing:true
    });

    this._fetchData();
    
  }

  _renderEmptyView(){
    return (
      <ScrollView
        refreshControl={
          <RefreshControl
              refreshing={this.state.isRefreshing}
              onRefresh={this._onRefresh.bind(this)}
              colors={['#f74c31', '#f74c31', '#f74c31', '#f74c31']}
              progressBackgroundColor='#ffffff'
          />
        }
      >
        <View style={{justifyContent:'center',alignItems:'center',flex:1}}>
          <Text>没有浏览记录。</Text>
        </View>
      </ScrollView>
      
    )
  }

  _renderContent(){

    let page = null;

    if(datas.length === 0){
      page = this._renderEmptyView();
    }else{
      page = (
        <ListView
              dataSource={this.state.dataSource}
              renderRow={(rowData)=>this.renderRow(rowData)}
              refreshControl={
                  <RefreshControl
                      refreshing={this.state.isRefreshing}
                      onRefresh={this._onRefresh.bind(this)}
                      colors={['#f74c31', '#f74c31', '#f74c31', '#f74c31']}
                      progressBackgroundColor='#ffffff'
                  />
                }
           />
      )
    }

    return page;

  }
 
  render() {
    return (
      <View style={{flex:1}}>
        <View style={styles.topViewStyle}>
          <Text style={styles.topTxtStyle}>浏览记录</Text>
        </View>
        {this._renderContent()}  
      </View>  
    )
  }



}

const styles = StyleSheet.create({
  topViewStyle:{
    flexDirection:'row',
    height:30,
    justifyContent:'center',
    alignItems:'center',
    backgroundColor:'#fff'
  },
  topTxtStyle:{
    fontSize:18,
    color:'orange',
    fontWeight:'bold'
  },
  indicatorStyle:{
    marginTop:30,
    justifyContent:'center',
    alignItems:'center'
  },
  wrapViewStyle:{
    flex:1,
    flexDirection: 'row',
    justifyContent:'space-between',
    alignItems: 'center',
    backgroundColor:'#fff',
    height: 60,
    paddingLeft:5,
    paddingRight:5,
    marginTop:3
  },
  leftViewStyle:{
    flexDirection:'row',
    alignItems:'center'
  },
  rightViewStyle:{
    flexDirection:'row',
    alignItems:'center',

  },
  rightTxtStyle:{
    color:'#888888',
    fontSize:12
  }
});

