// import Message from './Message'

import React, { useState, useCallback, useMemo, memo } from 'react'

function APP() {

    const [value, setValue] = useState(123)
    const [otherValue, setOtherValue] = useState(999)

    const changeValue = useCallback(() => {
        setValue(value => value+1)
    }, [])
    
    console.log('APP');

    return (
        <div>
            <div>与Message渲染无关的数据==={otherValue}</div>
            <br />
            <button onClick={() => setOtherValue(value => value-=5)}>改变无关的数据</button>
            <br />
            <br />
            <Message value={value} changeValue={changeValue} />
        </div>
    )
}

const Message = memo(
    function Message({value, changeValue}) {
    
        console.log('Message');
    
        return (
            <div>
                <button onClick={changeValue}>改变有关数据</button>
                <p>与Message渲染有关的数据{value}</p>
            </div>
        )
    }
)



export default APP
