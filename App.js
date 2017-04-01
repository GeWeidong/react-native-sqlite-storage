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
  Navigator
} from 'react-native';

import Main from './js/Main';

export default class App extends Component {

 
  render() {
    var defaultName = 'Main';  
    var defaultComponent = Main;  
    return (  
        <Navigator  
            initialRoute={{ name: defaultName, component: defaultComponent }}  
            configureScene={(route) => {  
            return Navigator.SceneConfigs.HorizontalSwipeJump;  
        }}  
        renderScene={(route, navigator) => {  
            let Component = route.component;  
            return <Component {...route.params} navigator={navigator} />  
        }}/>  
    );
  }
}

const styles = StyleSheet.create({
  
});

