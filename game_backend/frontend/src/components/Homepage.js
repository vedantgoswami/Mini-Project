import React, { Component , useState, useEffect, useCallback } from 'react';

import Snake from './snake';
import Food from './Food';
import Arraylist from './Arraylist';
import Modal from './Modal';
// import { confirmAlert } from './alert';
import Swal from 'sweetalert2';
// import renderHomePage from Startup;
import Signup from './Login';
import {  useHistory} from "react-router-dom";
import { render, unmountComponentAtNode } from 'react-dom';
import { faMinusSquare, faPlusSquare } from "@fortawesome/free-solid-svg-icons";
// import FontAwesome from 'react-fontawesome';
import{
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
  HashRouter
} from "react-router-dom";
import styled from "styled-components";
import { clamp } from "./clamp";
import purple from '@material-ui/core/colors/purple';
import ReactStoreIndicator from 'react-score-indicator';
// import PropTypes from 'prop-types';
// import { confirmAlert } from 'react-confirm-alert'; 
// import 'react-confirm-alert/src/react-confirm-alert.css';
// import Popup from 'reactjs-popup';
// import { confirmAlert } from 'react-confirm-alert';
// import 'react-confirm-alert/src/react-confirm-alert.css';
import { Grid,
   Button,
    ButtonGroup,
     Typography,
      TextareaAutosize,
        Paper,
        container,
        FormLabel,
        Container
    }
from '@material-ui/core';
import {withStyles} from '@material-ui/core/styles';
import { FormHelperText } from '@material-ui/core';
import { FormControl } from '@material-ui/core';
import { Radio } from '@material-ui/core';
import { RadioGroup } from '@material-ui/core';
import { FormControlLabel } from '@material-ui/core';
import {grey, lightBlue, orange} from '@material-ui/core/colors';
import {green} from '@material-ui/core/colors';
import Startup from './startup';
var intervalid=0;
var block_size=2;
const getRandomCoordinate = () =>{
  let min = 1;
  let max = 90;
  let x = Math.floor((Math.random()*(max-min+1)+min)/2)*2;
  let y = Math.floor((Math.random()*(max-min+1)+min)/2)*2;
  return [x,y]
}
// const history = useHistory();
var reset = false;
const GreenRadio = withStyles({
  root: {
      //color: green[400],
      '&$disabled': {
        color:'#CDCDCD'
      },
      '&$checked': {
          color: green[600],
      },
      
  },
  checked: {},
})((props) => <Radio className="radio" color="default" {...props} />);
const LightBlue = withStyles({
  root: {
      //color: orange[400],
      '&$disabled': {
        color:'#CDCDCD'
      },
      '&$checked': {
          color: orange[600],
      },
      
  },
  checked: {},
})((props) => <Radio color="default" {...props} />);
const initialState={
  food: getRandomCoordinate(),
    direction: 'RIGHT',
    snakeDots:[
      [50,50],
      [53,50],
      [56,50]
    ],
    done: false,
   score: 0,
   speed: 100,
   value: 1,
   mode: 'M',
   eat: false,
   frame_iteration: 0,
   move: 'DOWN',
   dtime: 'Starting...',
   en: false,
   smode: "P",
   isModalOpen: "false",
   user: "User",
   reset: "false",
   username: ""
  }
export default class Homepage extends Component{

  
  constructor(props){
    
    super(props);
    this.state=initialState;
    this.onGameOver = this.onGameOver.bind(this);
    this.doDecrement = this.doDecrement.bind(this);
    this.doIncrement = this.doIncrement.bind(this);
    this.callUpdate = this.callUpdate.bind(this);
    this.speed= 100;
    this.speed1= 100;
    this.speed2= 80;
    this.speed3= 50;
    this.val1=1;
    this.val2=2;
    this.val3=3;
    this.move="RIGHT";
    this.reward=0;
  }
  
  componentDidMount() {
    
    intervalid = setInterval(this.moveSnake, this.state.speed);
    document.onkeydown = this.onKeyDown;
    document.addEventListener('keydown', this.keyboardClose, false);
    document.removeEventListener('keydown', this.keyboardClose, false);
    // this.props.willUnmount();
    
  }
  componentWillUnmount() {
    clearInterval(intervalid);
  }

  componentDidUpdate(prevProps, prevState){
    this.checkIfOutBorder();
    this.checkIfCollapsed();
    this.checkIfEat(prevProps,prevState);
    this.checkifModeChange(prevProps,prevState);
    // console.log(this.state.mode);
    
    // this.updateScore();
  }
  checkifModeChange(prevProps,prevState)
  {
    // if(this.state.mode=="A" && prevState.mode!=this.state.mode)
    // {
    //   clearInterval(intervalid);
    //   intervalid=setInterval(this.moveSnake,this.state.speed);
    // }
    // else if (this.state.mode=="M" && prevState.mode!=this.state.mode){
    //   intervalid=setInterval(this.moveSnake,this.state.speed);
    // }
    if(prevState.mode == "A" && this.state.mode == "M")
      {
        this.state.en = false;
        
      }
      if(prevState.mode == "M" && this.state.mode == "A")
      {
        this.state.en = true;
        const requestOption = {
          method: "POST",
          headers: {'Content-Type':'application/json'},
          body: JSON.stringify({
              select: this.state.smode
          })
        };
        
        fetch('/api/selection',requestOption)
        .then((response)=>response.json());
      }

  }
 handleselection = e => 
  {
    const {value} =e.target;
    this.setState({
      smode: value
    });
    const requestOption = {
      method: "POST",
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({
          select: this.state.smode
      })
    };
    
    fetch('/api/selection',requestOption)
    .then((response)=>response.json());
  }
  onKeyDown = (e) => {
    e = e || window.event;
    if(this.state.mode=="M")
    {
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
    }}
  }
 moveSnake=async()=>{
    
  await this.handlenextState();
    
    // console.log(this.state.move);
    if(this.state.mode=="A")
    {
    var temp = this.state.frame_iteration+1;
    this.setState({
      eat: false,
      frame_iteration: temp
    });
  }
    let dots = [...this.state.snakeDots];
    let head = dots[dots.length - 1];
    
    if(this.state.mode=="A")
    {
      var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();  
    var temp=this.state.move;
    // console.log(date+' '+time,this.state.direction,this.state.move,this.state.dtime);
      
      this.setState({direction: temp});
    
  }
    
    switch (this.state.direction) {
      case 'RIGHT':
        head = [head[0] + block_size, head[1]];
        break;
      case 'LEFT':
        head = [head[0] - block_size, head[1]];
        break;
      case 'DOWN':
        head = [head[0], head[1] + block_size];
        break;
      case 'UP':
        head = [head[0], head[1] - block_size];
        break;
    }
    dots.push(head);
    dots.shift();
    this.setState({
      snakeDots: dots
    });
    this.checkIfCollapsed();
    this.checkIfOutBorder();
    this.checkIfEat();
    var head_x2 = head[0];
    var head_y2 = head[1];
    var d_s2 =this.state.done;
    var f_x2 = this.state.food[0];
    var f_y2 = this.state.food[1];
    var dir_s2 =this.state.direction;
    var collision2 = this.is_collision();
    var reward2 = 0;
    var score_s2=this.state.score;
    var game_over2 = this.state.eat;
    if(game_over2==true)
      {reward2 = 10;
      
      }
    else if(d_s2)
      reward2 = -10;
      // var today = new Date();
      // var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
      // var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();  
      // console.log(date+' '+time," reward: ",reward2);
    await this.handlereward(head_x2,head_y2,d_s2,f_x2,f_y2,dir_s2,collision2,reward2,score_s2);
    // head = this.state.snakeDots[this.state.snakeDots.length-1]
    //   let food = this.state.food;
      
    //   if(head[0] == food[0] && head[1] == food[1])
    //   {
    //     game_over=true;
    //     console.log("Food Eaten...")
    //   }
    //if(this.state.mode=="A")
    // head_x2,head_y2,d_s2,f_x2,f_y2,dir_s2,collision2,reward2,score_s2
    this.setState({
      eat: false
    });
  }
  checkIfOutBorder(){
    let head = this.state.snakeDots[this.state.snakeDots.length-1]
    
    if(head[0]>=100 || head[1]>=100 || 
      head[0]<0 || head[1]<0 || 
      this.state.frame_iteration>100*this.state.snakeDots.length)
      {//console.log(head[0],head[1]);
        this.setState({
          done: true
        })
        this.onGameOver();
      //   if(this.state.frame_iteration>100*this.state.snakeDots.length)
      //   console.log("Iteration Exceed...");
      // else  
      //   console.log("Out of Boundary...");
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
        // console.log("Bit itself...");
      }
    })
    
  }
  checkIfEat()
  {
      let head = this.state.snakeDots[this.state.snakeDots.length-1]
      let food = this.state.food;
      let snake = [...this.state.snakeDots];
      var temp = getRandomCoordinate();
      if(head[0] == food[0] && head[1] == food[1])
      {
        

        this.setState({
          food: temp,
          eat: true
        })
        this.enlargeSnake();
        this.increment();
      }
      
  }
  increment(){
    this.setState({
      score: this.state.score+1
    })
  }
  
  enlargeSnake()
  {
    let newsnake = [...this.state.snakeDots];
    newsnake.unshift([]);
    this.setState({
      snakeDots: newsnake
    })
  }
  callUpdate()
  {
   
    intervalid = setInterval(this.moveSnake,this.state.speed);
  }
  

  OnResetClick=()=>
  {
    console.log("Onclick called");
      reset = true;
      this.onGameOver();
  }
 
  onGameOver=async()=>
  {
    // alert(`Game Over. Snake Length is ${this.state.snakeDots.length}`);
    // console.log("Game Over");
    var temp = this.state.score;
    this.setState(initialState);
    let s = this.state.mode;
    let p = this.state.speed;
    let q = this.state.value;
    let r = this.state.smode;
    let e= this.state.en;
    this.setState({done: true});
    this.setState({speed: p,value:  q});
    this.setState({mode: s});
    this.setState({
      smode: r,
      en: e,
      food: getRandomCoordinate()
    });
    
    clearInterval(intervalid);
    console.log("Game over");
    var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();  
    // const history = useHistory();
    const requestOption = {
      method: "POST",
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({
          username: this.state.username,
          score: this.state.score,
      })
    };
    
    fetch('/api/gameover',requestOption)
    .then((response)=>response.json());
    // await Swal.fire({
    //   template : '#my-template'
    // })
    // alert("Hello ");
    console.log(reset);
    if(this.state.mode=='M' || this.state.smode=='P' || reset){
      console.log("Manual");
      reset=false;
      if(temp<10)
        await Swal.fire({
          title: 'Your Score\n '+String(temp),
          icon: 'warning',
          showDenyButton: true,
          confirmButtonText: 'Restart',
          denyButtonText: 'Return'
        }).then((result)=>{
          if(result.isDenied)
          window.close();
        })
        
      else if(temp<50)
        await Swal.fire({
          title: 'Your Score\n '+String(temp),
          icon: 'info',
          showDenyButton: true,
          confirmButtonText: 'Restart',
          denyButtonText: 'Return'
          
         
        }).then((result)=>{
          if(result.isDenied)
          window.close();
        })
      else
        await Swal.fire({
          title: 'Your Score\n '+String(temp),
          icon: 'success',
          showDenyButton: true,
          confirmButtonText: 'Restart',
          denyButtonText: 'Return'
          
        }).then((result)=>{
          if(result.isDenied)
          window.close();
        })
    }
    
    this.callUpdate();
    
    //setInterval(this.moveSnake,this.speed);
  }

  

  // a,b,c,d,e,f,g,h,i
  handlereward(head_x2,head_y2,d_s,f_x,f_y,dir_s,collision,reward,score){
    // console.log("called Reward...")"Head: (",head_x2,",",head_y2,")  done: (",d_s,") food: (",f_x,",",f_y,") "
    // if(score!=0)
      // console.log("Reward: ",reward," score: ",score);   
    const requestOption = {
      method: "POST",
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({
          head_x: head_x2,
          head_y: head_y2,
          food_x: f_x,
          food_y: f_y,
          direction_s: dir_s,
          done_s: d_s,
          reward_s: reward,
          score_s: score,
          col_l: collision[0],
          col_r: collision[1],
          col_u: collision[2],
          col_d: collision[3],
          frame_iteration: 0,
          mode_s: this.state.smode
      })
    };
    
    fetch('/api/reward-state',requestOption)
    .then((response)=>response.json());
    this.setState({done: false});
  }
  handlenextState=()=>{

    let dots = [...this.state.snakeDots];
    let head = dots[dots.length - 1];
    let d_s=this.state.done;
    let f_x = this.state.food[0];
    let f_y = this.state.food[1];
    let dir_s =this.state.direction;
    //console.log(dir_s," ",d_s);
    let collision = this.is_collision();
    let reward = 0;
    let game_over = this.state.eat;
    if(game_over == true)
      reward = 10;
    else if(d_s)
      reward = -10;
    //console.log(reward," ",this.state.score);
    const requestOption = {
      method: "POST",
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({
          head_x: head[0],
          head_y: head[1],
          food_x: f_x,
          food_y: f_y,
          direction_s: dir_s,
          done_s: d_s,
          reward_s: reward,
          score_s: this.state.score,
          col_l: collision[0],
          col_r: collision[1],
          col_u: collision[2],
          col_d: collision[3],
          frame_iteration: 0,
          mode_s: this.state.smode
      })
    };
    var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();  
    // console.log(date+' ');
    // console.log("Head:(",head[0],",",head[1],"), Food:(",f_x,",",f_y,"), dir: ",dir_s,
    //             "Reward: ", reward,"col:(",collision[0],collision[1],collision[2],collision[3],")");
    var datas = fetch('/api/create-state',requestOption)
    .then((response)=>response.json())
   .then((data)=>(this.setState({move: data.next,
                                dtime: date+' '+time,
                                user: data.user,
                                username: data.username
  })));
    //  this.setState({done: false});
    return datas;
  }

  // HandleResetClick(){
  //   console.log("Reset Click");
  //   this.setState(initialState);
  // }
  doDecrement(){
    
    if(this.state.value==2) {
      clearInterval(intervalid);
      intervalid = null;
      this.setState({speed: this.speed1, value: this.val1});
      setTimeout( this.callUpdate, 50);
    }
    else if(this.state.value==3)
    {
      
        clearInterval(intervalid);
        intervalid = null;
        this.setState({speed: this.speed2,value: this.val2});
        setTimeout( this.callUpdate, 50);
      }
    //console.log(this.speed," ",this.intervalid);

  }
  
  doIncrement() {
    
    if(this.state.value==1) {
      clearInterval(intervalid);
      intervalid = null;
      this.setState({speed: this.speed2,value: this.val2});
    setTimeout( this.callUpdate, 50);
    } 
    else if(this.state.value==2) {
      clearInterval(intervalid);
      intervalid = null;
      this.setState({speed: this.speed3, value: this.val3});
      setTimeout( this.callUpdate, 50);
     
    }
    //console.log(this.speed," ",this.intervalid);
    }
  handleMode = e =>
  {
    const {value} =e.target;
    this.setState({
      mode: value
    });
  }
  is_collision()
  {
    let dots = [...this.state.snakeDots];
    let head = dots[dots.length - 1];
    let point_l = [head[0] - block_size, head[1]];
    let point_r = [head[0] + block_size, head[1]];
    let point_u = [head[0], head[1] - block_size];
    let point_d = [head[0], head[1] + block_size];
    let collision =[false,false,false,false];

    if(point_l[0]>=100 || point_l[0]<0 || point_l[1]>=100 || point_l<0 )
      collision[0] = true;
    if(point_r[0]>=100 || point_r[0]<0 || point_r[1]>=100 || point_r<0 )
      collision[1] = true;
    if(point_u[0]>=100 || point_u[0]<0 || point_u[1]>=100 || point_u<0 )
      collision[2] = true;
    if(point_d[0]>=100 || point_d[0]<0 || point_d[1]>=100 || point_d<0 )
      collision[3] = true;
    for(var i=0;i<dots.length-1;i++)
      {
        if(dots[i][0]==point_l[0] && dots[i][1]==point_l[1])
          collision[0]=true;
        if(dots[i][0]==point_r[0] && dots[i][1]==point_r[1])
          collision[1]=true;  
        if(dots[i][0]==point_u[0] && dots[i][1]==point_u[1])
          collision[2]=true;
        if(dots[i][0]==point_d[0] && dots[i][1]==point_d[1])
          collision[3]=true;
      }
      return collision;
  }

  renderHomepage(){
    return (<div className="split">
        
    <div className="split left" >
      <div className="game-area" > 
        <Snake snakeDots={this.state.snakeDots}/>
        <Food dot={this.state.food}/>
      </div>
      
    </div>
    <div className="split right" style={{backgroundColor : "#FFFFFF"}}>
      <Grid container spacing={1}>
        <Grid item xs={12} align="center">
        <link href="https://fonts.googleapis.com/css2?family=Rampart+One&display=swap" rel="stylesheet"/>
          <Typography compact="h4" variant="h4" style={{fontFamily: 'Rampart One', fontSize: 56, fontWeight: 'bold', color: "black"}}>
              Snake Game AI
          </Typography>
        </Grid>
        <Grid item xs={12} align="center">
        {/* <div className="score" style={{backgroundColor:'greenyellow' ,border:'1px solid black', borderRadius:'5px!important'}}>{this.state.score}</div> */}
        
            <ReactStoreIndicator
            value={this.state.score}
            maxValue={100}
            width={200}
            lineWidth={8}
            textStyle={{fontSize: "45px"}}
            stepsColors={[
              '#d12000',
              '#ed8d00',
              '#f1bc00',
              '#84c42b',
              '#53b83a',
              '#3da940',
              '#3da940',
              '#3da940',
            ]}
           />
           
        </Grid>
        <Grid item xs={12} align="center">
        <Typography compact="h4" variant="h4" style={{fontFamily: 'Rampart One', fontSize: 24, fontWeight: 'bold', color: "black"}}>
              {this.state.user}
          </Typography>
          </Grid>
          <Grid item xs={12} align="center">
            <FormControl component="fieldset">
             <RadioGroup className="Master" row defaultValue="M" onChange={this.handleMode} style={{marginTop:20, marginBottom:20}}>
                <FormControlLabel
                  value="M"
                  control={<Radio  color="primary" width="50px" height="50px"
                  />}
                  label={<Typography style={{fontWeight: 'bold'}}>Manual</Typography>}
                  labelPlacement="bottom"
                  fontWeight="bold"
                  style={{marginRight: 60}}
                />
                <FormControlLabel
                  value="A"
                  control={<Radio color="secondary" />}
                  label={<Typography style={{fontWeight: 'bold'}}>AI</Typography>}
                  labelPlacement="bottom"
                />
             </RadioGroup>
            </FormControl>
          </Grid>
          <Grid item xs={12} align="center">
            <FormControl component="fieldset">
             <RadioGroup disabled={!this.state.en} row defaultValue="P" onChange={this.handleselection} style={{marginTop:10, marginBottom:25}}>
                <FormControlLabel
                  value="T"
                  control={<GreenRadio/>}
                  label={<Typography style={{fontWeight: 'bold'}}>Training</Typography>}
                  labelPlacement="bottom"
                  style={{marginRight: 60,marginLeft:60}}
                  disabled={!this.state.en}
                />
                <FormControlLabel
                  value="P"
                  control={<LightBlue/>}
                  label={<Typography style={{fontWeight: 'bold'}}>Trained</Typography>}
                  labelPlacement="bottom"
                  style={{marginRight: 60}}
                  disabled={!this.state.en}
                />
             </RadioGroup>
            </FormControl>
          </Grid>
          <Grid xs={12} align="center" style={{marginBottom: 5}}>
          <Typography style={{fontWeight: 'bold', fontFamily: 'sans-serif'}}>Speed</Typography>
          <div className="container">
            <span className="next" onClick={this.doIncrement}></span>
            <span className="prev" onClick={this.doDecrement}></span>
            <div id="box">
              <span>{this.state.value}</span>
              </div>
          </div>
          
      
      </Grid>
          <Grid xs={12} align="center">
            <ButtonGroup disableElevation variant="contained" color="primary">
           
                
                <Button id="returnbtn" className="reset" style={{marginRight: "5px",backgroundColor: 'yellowgreen', fontSize: '24px', width: '120px', height: '60px'}}  
                onClick={this.OnResetClick}>
                    Reset
                </Button>
                
            <Button className="reset" style={{backgroundColor: 'red', fontSize: '24px', width: '120px', height: '60px'}} onClick={this.OnResetClick} ref={Button=>this.ButtonElement=Button}>
                    Return 
                </Button>
               
                </ButtonGroup>
          </Grid>
          
      </Grid>
    </div>
    
  </div>
);
  }
  rendermainPage(){
    return <Startup/>
  }
  render(){
    
    
    return(
      <Router forceRefresh={true}>
      <Switch>
      <Route exact path="/game" render={()=>{
        return this.renderHomepage()
      }}/>
      <Route exact path="/score" render={()=>{
        return <Score/>
      }}/>
          <Route exact path="/"
            render={()=>{
              // this.getname();
              // setTimeout(function() {return this.renderMainpage()}.bind(this),1000);
              return this.rendermainPage()
            }}
          />
        
      </Switch>
  </Router>
            
    );
  }
}
