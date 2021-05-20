import React from './React';
import ReactDOM from './ReactDom';
import './index.css';
import Message from './pages/Message';
import FunctionCom from './pages/FunctionCom';

let element = (
  <div style={{border: '2px solid red', margin: '10px', padding: '10px'}} id='A1'>
    A1
    <div style={{border: '2px solid red', margin: '10px', padding: '10px'}} id='B1'>
      B1
      <div style={{border: '2px solid red', margin: '10px', padding: '10px'}} id='C1'>C1</div>
      <div style={{border: '2px solid red', margin: '10px', padding: '10px'}} id='C2'>C2</div>
    </div>
    <div style={{border: '2px solid red', margin: '10px', padding: '10px'}} id='B2'>B2</div>
  </div>
)

let update1 = document.getElementById('update1')
update1.addEventListener('click', () => {
  let elementUpdate1 = (
    <div style={{border: '2px solid red', margin: '10px', padding: '10px'}} id='A1-update1'>
      A1-update1
      <div style={{border: '2px solid red', margin: '10px', padding: '10px'}} id='B1-update1'>
        B1-update1
        <div style={{border: '2px solid red', margin: '10px', padding: '10px'}} id='C1-update1'>C1-update1</div>
        <div style={{border: '2px solid red', margin: '10px', padding: '10px'}} id='C2-update1'>C2-update1</div>
      </div>
      <div style={{border: '2px solid red', margin: '10px', padding: '10px'}} id='B2-update1'>B2-update1</div>
      <div style={{border: '2px solid red', margin: '10px', padding: '10px'}} id='B3'>B3</div>
    </div>
  )
  ReactDOM.render(
    elementUpdate1,
    document.getElementById('root')
  );
})


let update2 = document.getElementById('update2')
update2.addEventListener('click', () => {
  let elementUpdate2 = (
    <div style={{border: '2px solid red', margin: '10px', padding: '10px'}} id='A1-update2'>
      A1-update2
      <div style={{border: '2px solid red', margin: '10px', padding: '10px'}} id='B1-update2'>
        B1-update2
        <div style={{border: '2px solid red', margin: '10px', padding: '10px'}} id='C1-update2'>C1-update2</div>
        <div style={{border: '2px solid red', margin: '10px', padding: '10px'}} id='C2-update2'>C2-update2</div>
      </div>
      <div style={{border: '2px solid red', margin: '10px', padding: '10px'}} id='B2-update2'>B2-update2</div>
    </div>
  )
  ReactDOM.render(
    elementUpdate2,
    document.getElementById('root')
  );
})


let show_component = document.getElementById('show_component')
show_component.addEventListener('click', () => {
  let elementShowComponent = <Message />
  ReactDOM.render(
    elementShowComponent,
    document.getElementById('root')
  );
})


let show_function = document.getElementById('show_function')
show_function.addEventListener('click', () => {
  let elementShowFunction = <FunctionCom />
  ReactDOM.render(
    elementShowFunction,
    document.getElementById('root')
  );
})

ReactDOM.render(
  element,
  document.getElementById('root')
);
