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
  ListView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  ScrollView
} from 'react-native';

const index = 1;
const datas = [];

import SQLite from './db/SQLite';
var sqlite = new SQLite();
import Storages from './db/Storages';

import MovieDetial from './MovieDetial';

export default class History extends Component {

  constructor(props){
    super(props);
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      dataSource: ds.cloneWithRows(datas),
      isRefreshing:false
    };
  }

  componentDidMount(){
    datas = [];
    this._queryData();
  }

  gotoMovieDetial(rowData){

    // 保存浏览记录
    var storage = new Storages();
    storage.setName(rowData.name);
    storage.setPic(rowData.pic);
    storage.setAlt(rowData.alt);

    sqlite.saveStorage(storage).then(()=>{
      console.log('浏览记录保存成功');
    }).catch((e)=>{
      console.log(e)
      console.log('浏览记录保存失败');
    }).done();

    const {navigator} = this.props;
    if(navigator){
      navigator.push({
        name:'MovieDetial',
        component:MovieDetial,
        params:{
          data:{
            images:{
              large:rowData.pic
            },
            title:rowData.name
          }
        }
      })
    }
  }

  renderRow(rowData){
    //渲染每一行
    return (
      <View style={styles.wrapViewStyle}>
        <TouchableOpacity style={styles.wrapViewStyle} onPress={()=>this.gotoMovieDetial(rowData)}>
          <View style={styles.leftViewStyle}>
            <Image style={{width:60,height:60}} source={{uri:rowData.pic}}/>
            <Text>{rowData.name}</Text>
          </View>
          <View style={styles.rightViewStyle}>
            <Text style={styles.rightTxtStyle}>已收藏</Text>
          </View>
        </TouchableOpacity>
      </View>
    )

  }

  _queryData(){
    sqlite.listCollection(20,index).then((results)=>{
        console.log('results是：'+results);

        // datas = datas.concat(results);
        datas = results;

        this.setState({
            dataSource:this.state.dataSource.cloneWithRows(datas),
            isRefreshing:false
        });


    }).catch((err)=>{

    }).done();
  }

  _onRefresh(){
    this.setState({
      isRefreshing:true
    });

    // datas = [];
    index = 1;
    this._queryData();
  }

  _renderEmpty(){
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
            <Text>没有收藏记录。</Text>
          </View>
        </ScrollView>
    )
  }

  _renderContent(){

    let page = null;

    if(datas.length === 0){
      page = this._renderEmpty();
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
          
          <Text style={styles.topTxtStyle}>收藏列表</Text>
        </View>

        {this._renderContent()}

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container:{
    flex: 1,
    backgroundColor: '#efeff4',
    flexDirection: 'column',
  },
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
  },
  indicatorStyle:{
    marginTop:30,
    justifyContent:'center',
    alignItems:'center'
  }
});

