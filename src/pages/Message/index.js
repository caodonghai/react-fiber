import React from '../../React'

class Message extends React.MyComponent {
    constructor(props) {
        super(props)
        this.state = {
            number: 1,
        }
    }

    changeValue = () => {
        this.setState((state) => ({number: state.number + 1}))
    }

    render() {
        return (
            <div id='container'>
                <button style={{display: 'block', margin: '10px 0'}} onClick={this.changeValue}>加 1</button>
                <span>数据：</span>
                <span>{this.state.number}</span>
            </div>
        )
    }
}

export default Message
