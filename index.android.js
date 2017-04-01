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
  Image
} from 'react-native';

import App from './App';

export default class gewd extends Component {


  render() {
    return (
      <App />
    );
  }
}

const styles = StyleSheet.create({
  
});

AppRegistry.registerComponent('gewd', () => gewd);
