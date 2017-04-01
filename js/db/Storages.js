/**
 * 以面向对象的思想来说，我们需要为收藏表的字段创建一个实体类对象Storage
 */

import React, { Component } from 'react';

let id;            // 电影ID
let name = '';     // 电影标题
let pic = '';      // 电影海报
let alt = '';      // 电影链接


export default class Storages extends Component {

  render(){
    return null;
  }

  setId(id){
    this.id = id;
  }

  getId(id){
    return this.id;
  }

  setName(name){
    this.name = name;
  }

  getName(name){
    return this.name;
  }

  setPic(pic){
    this.pic = pic;
  }

  getPic(pic){
    return this.pic;
  }

  setAlt(alt){
    this.alt = alt;
  }

  getAlt(alt){
    return this.alt;
  }
  
};

