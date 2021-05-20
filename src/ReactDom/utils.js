/**
 * 给真实DOM设置属性
 * @param {*} dom 
 * @param {*} oldProps 
 * @param {*} newProps 
 */

function setProps(dom, oldProps, newProps) {
    for (const key in oldProps) {
        if (key !== 'children') {
            if (newProps.hasOwnProperty(key)) {
                //oldProps有属性，newProps也有的属性更新
                setProp(dom, key, newProps[key])
            } else {
                //oldProps有属性，newProps没有的属性删掉
                dom.removeAttribute(key)
            }
        }
    }

    for (const key in newProps) {
        if (key !== 'children') {
            if (!oldProps.hasOwnProperty(key)) {
                //newProps有属性，oldProps没有有的属性新增
                setProp(dom, key, newProps[key])
            }
        }
    }
}

function setProp(dom, key, value) {
    if (/^on/.test(key)) {
        //如果是事件  onClick
        dom[key.toLowerCase()] = value;//没有用合成事件
    }else if(key === 'style') {
        if (value) {
            for (const styleName in value) {
                dom.style[styleName] = value[styleName];
            }
        }
    }else{
        dom.setAttribute(key, value)
    }
}

export {
    setProps,
}