/**
 * 从根节点进行渲染和调度
 * 两个阶段
 * diff阶段（协调）：对比新旧虚拟DOM，进行增量更新或创建，render阶段，这个阶段比较耗时间，我们可以对任务进行拆分，拆分纬度虚拟DOM，此阶段可以暂停，有两个任务：1.根据虚拟DOM生成fiber树，2.收集effectList
 * cimmit阶段（提交阶段）：进行DOM更新创建阶段，此阶段不能暂停，一气呵成。
 * @param {*} rootFiber 
 */

import { ELEMENT_TEXT, TAG_HOST, TAG_ROOT, TAG_TEXT, PLACEMENT, UPDATE, DELETION, TAG_CLASS, TAG_FUNCTION } from "../constants";
import { setProps } from './utils'
import { Update, UpdateQueue } from "../React/updateQueue";

//下一个工作单元
let nextUnitOfWork = null;
//RootFiber应用的根，正在渲染的ROOT根fiber
let workInProgressRoot = null;
//渲染成功后的当前根TOOTFiber
let currentRoot = null;
//删除的节点我们并不放在effect list里，所以需要单独记录并执行
let deletions = []
/** Hooks 实现 */
//正在工作中的 Fiber
let workInProgressFiber = null;
//hooks 索引
let hookIndex = 0;

function scheduleRoot(rootFiber) {
    // if (currentRoot && currentRoot.alternate) {
    //     //第二次之后的渲染
        
    //     //第一次渲染出来的那个Fiber root
    //     workInProgressRoot = currentRoot.alternate;
    //     //让这个树的替身指向当前的currentRoot
    //     workInProgressRoot.alternate = currentRoot;
    //     if (rootFiber) {
    //         //让它的props更新成新的props
    //         workInProgressRoot.props = rootFiber.props;
    //     }
    // } else 
    if (currentRoot) {
        //说明至少已经渲染过一次
        if (rootFiber) {
            rootFiber.alternate = currentRoot
            workInProgressRoot = rootFiber
        } else {
            workInProgressRoot = {
                ...currentRoot,
                alternate: currentRoot
            }
        }
    } else {
        //第一次渲染
        workInProgressRoot = rootFiber
    }
    nextUnitOfWork = workInProgressRoot
}

function performUnitOfWork(currentFiber) {
    beginWork(currentFiber)
    if (currentFiber.child) {
        return currentFiber.child
    }
    while (currentFiber) {
        //没有儿子就让自己完成
        completeUnitOfWork(currentFiber)
        //看有没有弟弟，有弟弟返回弟弟
        if (currentFiber.sibling) {
            return currentFiber.sibling
        }
        //没有就回去找父亲，先让父亲完成，再去找父亲的弟弟（叔叔）
        currentFiber = currentFiber.return 
    }
}

function completeUnitOfWork(currentFiber) {
    //没有儿子就让自己完成
    //在完成的时候要收集有副作用的fiber，然后组成effect list
    //每个fiber有两个属性，firstEffect指向第一个有副作用的第一个子fiber，最后一个fiber指向最后一个完成的fiber
    //遍历链规则：看太子、后弟弟、再叔叔
    //完成链规则：所有儿子全完成则自己完成
    //effect链：等同于完成链
    let returnFiber = currentFiber.return;
    if (returnFiber) {
        //这一段是把自己儿子的effect链挂到自己父亲身上
        if (!returnFiber.firstEffect) {
            returnFiber.firstEffect = currentFiber.firstEffect
        }
        if (currentFiber.lastEffect) {
            if (returnFiber.lastEffect) {
                returnFiber.lastEffect.nextEffect = currentFiber.firstEffect
            }
            returnFiber.lastEffect = currentFiber.lastEffect
        }
        //把自己挂到父亲身上
        const effectTag = currentFiber.effectTag;
        if (effectTag) {
            if (returnFiber.lastEffect) {
                returnFiber.lastEffect.nextEffect = currentFiber
            }else{
                returnFiber.firstEffect = currentFiber
            }
            returnFiber.lastEffect = currentFiber
        }
    }
}

/**
 * currentFiber 任务：
 * 1、创建真实DOM元素
 * 2、创建子Fiber
 * @param {*} currentFiber 
 */
function beginWork(currentFiber) {
    if (currentFiber.tag === TAG_ROOT) {
        //根节点
        updateHostRoot(currentFiber)
    }else if(currentFiber.tag === TAG_TEXT) {
        //文本节点
        updateHostText(currentFiber)
    }else if(currentFiber.tag === TAG_HOST) {
        //原生dom节点
        updateHost(currentFiber)
    }else if(currentFiber.tag === TAG_CLASS) {
        //类组件
        updateClassComponent(currentFiber)
    }else if(currentFiber.tag === TAG_FUNCTION) {
        //函数组件
        updateFunctionComponent(currentFiber)
    }
}

function updateFunctionComponent(currentFiber) {
    /* Hooks 实现开始 */
    workInProgressFiber = currentFiber;
    hookIndex = 0;
    workInProgressFiber.hooks = [];
    /* Hooks 实现结束 */
    let newElement = currentFiber.type(currentFiber.props)
    let newChildren = [newElement]
    reconcileChildren(currentFiber, newChildren)
}

function updateClassComponent(currentFiber) {
    if (!currentFiber.stateNode) {
        //类组件 stateNode 为类组件的实例
        //类组件实例 和 fiber 双向指向
        currentFiber.stateNode = new currentFiber.type(currentFiber.props)
        currentFiber.stateNode.internalFiber = currentFiber
        currentFiber.updateQueue = new UpdateQueue()//更新队列初始化
    }

    //给组件实例的tate赋值
    //更新逻辑
    currentFiber.stateNode.state = currentFiber.updateQueue.forceUpdate(currentFiber.stateNode.state)
    let newElement = currentFiber.stateNode.render()
    let newChildren = [newElement]
    reconcileChildren(currentFiber, newChildren)
}

function updateHostRoot(currentFiber) {
    //先处理自己，如果是一个原生节点，创建真实dom节点
    //创建子Fiber
    let newChildren = currentFiber.props.children
    reconcileChildren(currentFiber, newChildren)
}

function  reconcileChildren(currentFiber, newChildren) {
    //TODO：把虚拟DOM转成Fiber节点
    //newChildren是一个虚拟DOM数组
    //如果currentFiber 有 alternate 并且 alternate 有 child 属性
    let oldFiber = currentFiber.alternate && currentFiber.alternate.child;
    if(oldFiber) {oldFiber.firstEffect = oldFiber.nextEffect = oldFiber.lastEffect = null;}
    let newChildIndex = 0;//新子节点的索引
    let prevSibling;//上一个新子fiber
    //遍历子虚拟dom元素数组，诶每个虚拟dom元素创建子fiber
    if (typeof newChildren === 'string' || typeof newChildren === 'number') {
        //这是一个文本节点
        const simpleType = oldFiber && String(newChildren) && oldFiber.type === ELEMENT_TEXT
        let newFiber = createTextFiber(currentFiber, newChildren, simpleType, oldFiber)
        if (newFiber) {
            currentFiber.child = newFiber
            prevSibling = newFiber
        }
    }else{
        console.log({newChildren});
        while (newChildIndex < newChildren.length || oldFiber) {
            let newChild =  newChildren[newChildIndex];
            let newFiber;
            if (newChild) {
                if (newChild.type === ELEMENT_TEXT || typeof newChild === 'string' || typeof newChild === 'number') {
                    //这是一个文本节点
                    const simpleType = oldFiber && newChild && oldFiber.type === ELEMENT_TEXT
                    newFiber = createTextFiber(currentFiber, newChild, simpleType, oldFiber)
                }else{
                    let tag;
                    if (typeof newChild.type === 'function' && newChild.type.prototype.isReactComponent) {
                        tag = TAG_CLASS
                    } else if (typeof newChild.type === 'function') {
                        tag = TAG_FUNCTION
                    } else if (typeof newChild.type === 'string') {
                        tag = TAG_HOST
                    }
                    const simpleType = oldFiber && newChild && oldFiber.type === newChild.type
                    //表示原生dom节点
                    if (simpleType) {
                        // if (oldFiber.alternate) {//说明至少已经更新过一次了
                        //     newFiber = oldFiber.alternate;//如果有上上次的Fiber，就拿过来作为这一席的Fiber
                        //     newFiber.props = newChild.props;
                        //     newFiber.alternate = oldFiber;
                        //     newFiber.effectTag = UPDATE;
                        //     newFiber.updateQueue = oldFiber.updateQueue || new UpdateQueue();
                        //     newFiber.nextEffect = null;
                        // } else {
                            newFiber = {
                                tag: oldFiber.tag,//TAG_HOST,
                                type: oldFiber.type,
                                props: newChild.props,
                                stateNode: oldFiber.stateNode,
                                return: currentFiber,
                                alternate: oldFiber,
                                updateQueue: oldFiber.updateQueue || new UpdateQueue(),
                                effectTag: UPDATE,//副作用标识，render我们要会收集副作用， 增加 删除 更新
                                nextEffect: null,//effect List也是一个单链表，顺序和完成顺序是完全一样的
                            }
                        // }
                    }else{
                        newFiber = {
                            tag,
                            type: newChild.type,
                            props: newChild.props,
                            stateNode: null,
                            return: currentFiber,
                            updateQueue: new UpdateQueue(),
                            effectTag: PLACEMENT,//副作用标识，render我们要会收集副作用， 增加 删除 更新
                            nextEffect: null,//effect List也是一个单链表，顺序和完成顺序是完全一样的
                        }
                        if (oldFiber) {
                            oldFiber.effectTag = DELETION
                            deletions.push(oldFiber)
                        }
                    }
                }
            }else{
                if (oldFiber) {
                    oldFiber.effectTag = DELETION
                    deletions.push(oldFiber)
                }
            }
            if (oldFiber) {
                //oldFiber指针向后移动一次
                oldFiber = oldFiber.sibling
            }
            if (newFiber) {
                if (newChildIndex == 0) {
                    //如果索引为零，说明这是太子
                    currentFiber.child = newFiber
                }else{
                    //让太子的Sibling弟弟指向二皇子  
                    prevSibling.sibling = newFiber
                }
                prevSibling = newFiber
            }
            newChildIndex++
        }
    }
}

function createTextFiber(currentFiber, newChildren, simpleType, oldFiber) {
    if (simpleType) {
        return {
            tag: oldFiber.tag,//TAG_TEXT,
            type: oldFiber.type,//ELEMENT_TEXT,
            props: {text: String(newChildren)},
            stateNode: oldFiber.stateNode,
            return: currentFiber,
            alternate: oldFiber,
            updateQueue: oldFiber.updateQueue || new UpdateQueue(),
            effectTag: UPDATE,//副作用标识，render我们要会收集副作用， 增加 删除 更新
            nextEffect: null,//effect List也是一个单链表，顺序和完成顺序是完全一样的
        }
    }
    return {
        tag: TAG_TEXT,
        type: ELEMENT_TEXT,
        props: {text: String(newChildren)},
        stateNode: null,
        return: currentFiber,
        updateQueue: new UpdateQueue(),
        effectTag: PLACEMENT,//副作用标识，render我们要会收集副作用， 增加 删除 更新
        nextEffect: null,//effect List也是一个单链表，顺序和完成顺序是完全一样的
    }
}

function updateHostText(currentFiber) {
    if (!currentFiber.stateNode) {
        //此fiber没有创建DOM节点
        currentFiber.stateNode = createDOM(currentFiber)
    } else {
        currentFiber.stateNode.textContent = currentFiber.props.text
    }
}

function updateHost(currentFiber) {
    if (!currentFiber.stateNode) {
        //此fiber没有创建DOM节点
        currentFiber.stateNode = createDOM(currentFiber)
    }
    const newChildren = currentFiber.props.children
    reconcileChildren(currentFiber, newChildren)
}

function createDOM(currentFiber) {
    if (currentFiber.tag === TAG_TEXT) {
        //说明是文本节点
        return document.createTextNode(currentFiber.props.text)
    }else if (currentFiber.tag === TAG_HOST) {
        //原生dom节点
        let stateNode = document.createElement(currentFiber.type)
        updateDOM(stateNode, {}, currentFiber.props)
        return stateNode
    }
}

function updateDOM(stateNode, oldProps, newProps) {
    if (stateNode.setAttribute) {
        setProps(stateNode, oldProps, newProps)
    }
}

function commitWork(currentFiber) {
    if (!currentFiber) return
    let returnFiber = currentFiber.return
    while (returnFiber.tag !== TAG_HOST && returnFiber.tag !== TAG_ROOT && returnFiber.tag !== TAG_TEXT) {
        //说明不是DOM节点
        returnFiber = returnFiber.return 
    }
    let domRender = returnFiber.stateNode
    if (currentFiber.effectTag === PLACEMENT) {
        //新增节点
        let nextFiber = currentFiber
        if (nextFiber.tag === TAG_CLASS || nextFiber.tag === TAG_FUNCTION) {
            //防止重复挂载（优化）
            return
        }
        while (nextFiber.tag !== TAG_HOST && nextFiber.tag !== TAG_ROOT && nextFiber.tag !== TAG_TEXT) {
            //如果要挂载的节点不是DOM节点，比如说是类组件，那么一直找第一个儿子，直到找到真实DOM节点为止。
            nextFiber = nextFiber.child
        }
        domRender.appendChild(nextFiber.stateNode)
    }else if(currentFiber.effectTag === DELETION) {
        //删除节点,如果是删除节点，就不需要往下走了
        return commitDeletion(currentFiber, domRender)
    }else if(currentFiber.effectTag === UPDATE) {
        //更新节点
        if (currentFiber.type === ELEMENT_TEXT || typeof newChild === 'string') {
            //文本节点更新
            if (currentFiber.alternate.props.text !== currentFiber.props.text) {
                currentFiber.stateNode.textContent = currentFiber.props.text
            }
        } else {
            updateDOM(currentFiber.stateNode, currentFiber.alternate.props, currentFiber.props)
        } 
    }
    currentFiber.effectTag = null
}

function commitDeletion(currentFiber, domRender) {
    if (!currentFiber) return
    if (currentFiber.tag === TAG_HOST || currentFiber.tag === TAG_ROOT || currentFiber.tag === TAG_TEXT) {
        //如果是DOM节点，直接删除
        domRender.removeChild(currentFiber.stateNode)
    } else {
        //非DOM节点，那么做一个递归
        commitDeletion(currentFiber.child, domRender)
    }
}

function commitRoot() {
    //执行effect list之前先把删除的元素删除
    deletions.forEach(commitWork)
    let currentFiber = workInProgressRoot.firstEffect;
    while (currentFiber && currentFiber.stateNode) {
        commitWork(currentFiber)
        currentFiber = currentFiber.nextEffect
    }
    //提交之后清空deletions数组
    deletions.length = 0;
    //把当前渲染成功的根Fiber赋给currentRoot
    currentRoot = workInProgressRoot
    workInProgressRoot = null
}

function workLoop(deadline) {
    //循环执行工作 nextUnitOfWork
    //是否要让出时间片或者控制权
    let shouldYield = false
    while (nextUnitOfWork && !shouldYield) {
        nextUnitOfWork = performUnitOfWork(nextUnitOfWork)
        shouldYield = deadline.timeRemaining() < 1 || deadline.timeout
    }

    if (!nextUnitOfWork && workInProgressRoot) {
        console.log('render 阶段结束')
        commitRoot()
    }

    //如果时间片用完后还有任务没有执行完，那么再次请求浏览器调度。
    window.requestIdleCallback(workLoop, {timeout: 500})
    
}

//react告诉浏览器，我现在有任务，请你在闲的时候执行我的任务
window.requestIdleCallback(workLoop, {timeout: 500})


/**
 * workInProgressFiber = currentFiber;
 * hookIndex = 0;
 * workInProgressFiber.hooks = [];
 * @param {*} reducer 
 * @param {*} initialValue 
 */

function useReducer(reducer, initialValue) {
    let oldHook = workInProgressFiber.alternate && workInProgressFiber.alternate.hooks
        && workInProgressFiber.alternate.hooks[hookIndex];
    let newHook = oldHook;
    if (oldHook) {
        //第二次渲染
        oldHook.state = oldHook.updateQueue.forceUpdate(oldHook.state)
    } else {
        //首次渲染
        newHook = {
            state: initialValue,
            updateQueue: new UpdateQueue(),//空的更新队列
        }
    }
    const dispatch = action => {
        let payload = reducer ? reducer(newHook.state, action) : action
        newHook.updateQueue.enqueueUpdate(
            new Update(payload)
        )
        scheduleRoot()
    }
    workInProgressFiber.hooks[hookIndex] = newHook
    hookIndex += 1
    return [newHook.state, dispatch]
}

function useState(initialValue) {
    return useReducer(null, initialValue)
}

export {
    scheduleRoot,
    useReducer,
    useState
}