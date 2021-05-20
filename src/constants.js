//表示这是一个文本元素
export const ELEMENT_TEXT = Symbol.for('ELEMENT_TEXT')
//React需要一个根Fiber
export const TAG_ROOT = Symbol.for('TAG_ROOT')
//表示原生的元素 span div p h1 table
export const TAG_HOST = Symbol.for('TAG_HOST')
//表示一个文本节点
export const TAG_TEXT = Symbol.for('TAG_TEXT')
//表示一个类组件
export const TAG_CLASS = Symbol.for('TAG_CLASS')
//表示一个函数组件
export const TAG_FUNCTION = Symbol.for('TAG_FUNCTION')

//插入节点
export const PLACEMENT = Symbol.for('PLACEMENT')
//更新节点
export const UPDATE = Symbol.for('UPDATE')
//删除节点
export const DELETION = Symbol.for('DELETION')
