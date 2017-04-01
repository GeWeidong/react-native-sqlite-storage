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
  WebView
} from 'react-native';

import Dimensions from 'Dimensions';

const {width, height} = Dimensions.get('window');  



export default class WebViewPage extends Component {

  constructor(props){
    super(props);
    this.state = {

    }
  }


  backStorage(){
    const {navigator} = this.props;
    if(navigator){
      navigator.pop();
    }
  }
 
  render() {

    const url = this.props.alt;

    
    return (  
        <View style={{flex:1}}>
          <View style={{height:30,backgroundColor:'#fff',justifyContent:'center',alignItems:'flex-start'}}>
              <Text style={{color:'orange',marginLeft:10,textDecorationLine:'underline'}} onPress={()=>this.backStorage()}>点击返回</Text>
          </View>

          <View style={{width:width,height:height-30,backgroundColor:'#fff'}}  >
            <WebView  
              
              source={{uri:url,method: 'GET'}}  
              javaScriptEnabled={true}  
              domStorageEnabled={true}  
              startInLoadingState={true}
              scalesPageToFit={false}  
              /> 

          </View>

        </View>
    );
  }
}

const styles = StyleSheet.create({
  
});

