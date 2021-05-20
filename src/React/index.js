import { Component } from 'react';
import { UpdateQueue, Update } from './updateQueue'
import { scheduleRoot, useReducer, useState } from '../ReactDom/schedule';

/**
 * 创建元素(虚拟DOM)的方法
 * @param {*} type   元素的类型 div p span
 * @param {*} config   配置对象， 属性 key ref
 * @param  {...any} children   放着所有的儿子，这里会统一做成一个数组
 */


function createElement(type, config, ...children) {
    console.log({type, config});
    delete config._self;
    delete console._source; //表示这个元素是在哪行哪列哪个文件生成的
    return {
        type,
        props: {
            ...config,
            //做了一个兼容处理，如果是React元素的话返回自己，如果是文本类型，返回元素对象
            // children: children.map(child => {
            //     console.log({child}, typeof child)
            //     return typeof child === 'object' ? child : {
            //         type: ELEMENT_TEXT,
            //         props: { text: child, children: [] }
            //     }
            // })

            //不做兼容处理
            children: [...children]
        }
    }
}

class MyComponent {
    constructor(props){
        this.props = props
        // this.updateQueue = new UpdateQueue()
    }
    setState(plyLoad) {
        //plyLoad 可能是个对象，也可能是个函数
        let update = new Update(plyLoad)
        //updateQueue其实是放在此类组件对应的fiber节点的 internalFiber
        this.internalFiber.updateQueue.enqueueUpdate(update)
        // this.updateQueue.enqueueUpdate(update)
        scheduleRoot()//从根节点开始调度
    }
}
MyComponent.prototype.isReactComponent = {};//类组件

const React = {
    createElement,
    MyComponent,
    useReducer,
    useState,
}

export {
    createElement,
    MyComponent,
    useReducer,
    useState,
}

export default React