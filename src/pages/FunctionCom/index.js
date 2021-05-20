import { useReducer, useState } from '../../React'
const ADD = 'ADD'

function reducer(state, action) {
    switch (action.type) {
        case ADD:
            return {count: state.count + 5}
            break;
    
        default:
            return state
            break;
    }
}


function FunctionComponent(props) {
    const [numberState, setNumberState] = useState({number: 100})
    const [countState, dispatch] = useReducer(reducer, {count: 0})
    return (
        <div style={{margin: '10px'}}>
            <div>函数组件</div>
            <button onClick={() => dispatch({type: ADD})} style={{margin: '10px 0', display: 'block'}}>加 5</button>
            <div>{countState.count}</div>
            <button onClick={() => setNumberState({number: numberState.number--})} style={{margin: '10px 0', display: 'block'}}>减 1</button>
            <div>{numberState.number}</div>
        </div>
    )
}

export default FunctionComponent