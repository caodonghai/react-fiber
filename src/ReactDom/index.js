import { TAG_ROOT } from '../constants'
import { scheduleRoot } from './schedule'

/**
 * render 是把一个元素渲染到一个容器内部
 * @param {*} element 
 * @param {*} container 
 * @param {*} callback
 */

function render(element, container, callback) {
    console.log({element})
    let rootFiber = {
        //每个Fiber都会又一个tag标识，表示此元素的类型
        tag: TAG_ROOT,
        //一般情况下，如果这个元素是一个原生dom元素，stateNode指向真实DOM元素，
        stateNode: container,
        //props.children 是一个数组，里面放的是React元素（虚拟DOM），后面会根据每个React元素创建Fiber
        props: {
            children: [element]
        }
    }
    scheduleRoot(rootFiber)
}

const ReactDOM = {
    render
}

export default ReactDOM