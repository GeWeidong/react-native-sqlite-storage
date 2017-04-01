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
  ListView,
  ActivityIndicator,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ToastAndroid,
  BackAndroid
} from 'react-native';

const URL = 'https://api.douban.com/v2/movie/in_theaters';

import MovieDetial from './MovieDetial';

// 引入数据库操作和Movie类
import SQLite from './db/SQLite';
import Storages from './db/Storages';

const sqlite = new SQLite();


export default class Movies extends Component {

  constructor(props){
    super(props);
    this.state = {
      dataSource:null,
      isLoadingTail:true,
      isCollection:false
    }
  }

  componentDidMount(){
    this.setState({
      isLoadingTail:true
    })
    this._fetchData();

  }

  _fetchData(){
    let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    fetch(URL)
      .then((data) => data.json())
      .then((response) => {
        var dataList = response.subjects;

        this.setState({
          isLoadingTail:false,
          dataSource:ds.cloneWithRows(dataList)
        })

      })
      .catch((err) => {
        console.log(err)
        this.setState({
          isLoadingTail:true
        })
      })
      .done()
  }


  _gotoDetialPage(data){

    // 保存浏览记录
    var storage = new Storages();
    storage.setName(data.title);
    storage.setPic(data.images.large);
    storage.setAlt(data.alt);

    sqlite.saveStorage(storage).then(()=>{
      console.log('浏览记录保存成功');
    }).catch((e)=>{
      console.log(e)
      console.log('浏览记录保存失败');
    }).done();


    const { navigator } = this.props;
    if (navigator) {
      navigator.push({
        name: 'MovieDetial',
        component: MovieDetial,
        params: {
          data:data,
          
        }
      })
    };


    
  }
  
  render() {
    return (
      <View style={styles.container}>
        {!this.state.isLoadingTail ?

          <ListView 
            dataSource={this.state.dataSource}
            onEndReachedThreshold={10}
            renderRow={(rowData)=>this.renderListView(rowData)}
          />
          :
          <View style={styles.indicatorStyle}>
            <ActivityIndicator color='gray' size='large'/>
          </View>
        }
      </View>
    );
  }

  //移除监听
  _removeBackAndroidListener(){
    BackAndroid.removeEventListener('hardwareBackPress');  
  }

  renderListView(rowData){

    //这里把数据存入内存中


    // var src = require('../img/icon_collection_true.png')
    let src = this.state.isCollection?require('../img/icon_collection_true.png'):require('../img/icon_collection_normal.png');
    // 模拟的数据data
      return (
        <View style={styles.wrapViewStyle}>
          <TouchableOpacity style={styles.wrapViewStyle} onPress={()=>this._gotoDetialPage(rowData)}>
            <View style={styles.leftViewStyle}>
              <Image style={{width:60,height:60}} source={{uri:rowData.images.large}}/>
              <Text>{rowData.title}</Text>
            </View>
            <View style={styles.rightViewStyle}>
              <Text style={styles.rightTxtStyle}>点击查看</Text>
            </View>
          </TouchableOpacity>
        </View>
      )

  }


}

const styles = StyleSheet.create({
  container:{
    flex: 1,
    backgroundColor: '#efeff4',
    flexDirection: 'column',
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

