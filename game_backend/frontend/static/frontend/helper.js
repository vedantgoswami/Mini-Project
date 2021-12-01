import React, {Component} from 'react';
import Snake from './snake';
import Food from './Food';
import Arraylist from './Arraylist';

const getRandomCoordinate = () =>{
  let min = 1;
  let max = 90;
  let x = Math.floor((Math.random()*(max-min+1)+min)/2)*2;
  let y = Math.floor((Math.random()*(max-min+1)+min)/2)*2;
  return [x,y]
}
const initialState={
  food: getRandomCoordinate(),
    direction: 'RIGHT',
    speed: 100,
    snakeDots:[
      [50,50],
      [52,50],
      [54,50]
    ],
    done: false
    
}
class App extends Component{

  state=initialState;
  componentDidMount() {
    setInterval(this.moveSnake, this.state.speed);
    document.onkeydown = this.onKeyDown;
  }
  componentDidUpdate(){
    this.checkIfOutBorder();
    this.checkIfCollapsed();
    this.checkIfEat();
    // this.updateScore();
  }
  onKeyDown = (e) => {
    e = e || window.event;
    switch (e.keyCode) {
      case 38:
        this.setState({direction: 'UP'});
        break;
      case 40:
        this.setState({direction: 'DOWN'});
        break;
      case 37:
        this.setState({direction: 'LEFT'});
        break;
      case 39:
        this.setState({direction: 'RIGHT'});
        break;
    }
  }
  moveSnake = () => {
    let dots = [...this.state.snakeDots];
    let head = dots[dots.length - 1];

    switch (this.state.direction) {
      case 'RIGHT':
        head = [head[0] + 2, head[1]];
        break;
      case 'LEFT':
        head = [head[0] - 2, head[1]];
        break;
      case 'DOWN':
        head = [head[0], head[1] + 2];
        break;
      case 'UP':
        head = [head[0], head[1] - 2];
        break;
    }
    dots.push(head);
    dots.shift();
    this.setState({
      snakeDots: dots
    })
  }
  checkIfOutBorder(){
    let head = this.state.snakeDots[this.state.snakeDots.length-1]
    if(head[0]>=100 || head[1]>=100 || head[0]<0 || head[1]<0)
      {
        this.setState({
          done: true
        })
        this.onGameOver();
      }
  }
  checkIfCollapsed(){
    let snake = [...this.state.snakeDots];
    let head = snake[snake.length-1];
    snake.pop();
    snake.forEach(dot=>{
      if(head[0] == dot[0] && head[1] == dot[1])
      {
        this.onGameOver();
      }
    })
  }
  checkIfEat()
  {
      let head = this.state.snakeDots[this.state.snakeDots.length-1]
      let food = this.state.food;
      if(head[0] == food[0] && head[1] == food[1])
      {
        this.setState({
          food: getRandomCoordinate()
        })
        this.enlargeSnake();
      }
  }
  enlargeSnake()
  {
    let newsnake = [...this.state.snakeDots];
    newsnake.unshift([]);
    this.setState({
      snakeDots: newsnake
    })
  }
  onGameOver()
  {
   // alert(`Game Over. Snake Length is ${this.state.snakeDots.length}`);
    this.setState(initialState)
  }}