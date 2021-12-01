import React, { Component, Suspense, useEffect } from 'react';
import Homepage from './Homepage';
import Score from './Score'
import Login from './Login';
import { Avatar } from '@material-ui/core';
import { Grid, Button, ButtonGroup, Typography, TextareaAutosize} from '@material-ui/core'
import { useHistory } from "react-router-dom";
import {useLocation, withRouter} from 'react-router';

import{
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    Redirect,
    HashRouter
} from "react-router-dom";
import Register2 from './Register2';
import Login2 from './Login2';
const avatarStyle={
                   width:"90px" ,
                   height:"90px",

}

export default class Startup extends Component{
  
    constructor(props){
      
      super(props);
      this.state={
        username: "User",
        buttonName: "Login",
        userimg: "./frontend/static/Download/avatar1.png"
      }
      this.getname.bind(this);
    }
   
    componentDidMount(){
      
      this.getname();
    }
    componentDidUpdate(prevProps, prevState){
      // this.getname();
      if(prevState.username !=this.state.username )
        this.getname();
    }
    // componentWillReceiveProps = (nextProps) => {
    //   if (this.props.params != nextProps.params) {
    //     console.log("change route");
    //     loadSearch(nextProps.params);
    //   }
    // }
//  withMyHook(Component) {
//       return function WrappedComponent(props) {
//         const myHookValue = useMyHook();
//         return <Component {...props} myHookValue={myHookValue} />;
//       }
//     }
logout=async()=>{
  const requestOption = {
    method: "POST",
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({
        name: "start",

    })
  };
  console.log("Calling Logout...");
  await fetch('/api/logout',requestOption).then((response)=>response.json())
  .then((data)=>{console.log(data.status)} 
  );
  window.location.reload();
}
getname=()=>{
  // useEffect=()=>{
  // console.log("StartUp page");
    const requestOption = {
      method: "POST",
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({
          name: "start",

      })
    };
     fetch('/api/login-getname',requestOption)
      .then((response)=>response.json())
    .then((data)=>( 
      console.log(data.path),
      this.setState({
        username: data.name,
        userimg: data.path
      })
      
    ));
    if(this.state.username!="User")
      this.state.buttonName= "Logout";
      
    else  
      this.state.buttonName= "Login";
      
    // console.log(this.state.username);
    // console.log(this.username);
    
    // return this.renderMainpage();
}

renderMainpage=()=>{
  // const name = location.state.details;
  // this.getname();
  // useEffect=()=>{
    // useEffect=()=>{
      // console.log("StartUp page");

        // }
    
      //window.location.reload();
  // }src= 'url("/static/images/avatar1.png")'
  
 
    return (
        
        <Grid container spacing={3}>
        <Grid item xs={12} align="right"> 
        <Grid item xs={12} align="center">
        <div className="loginname" style={{ fontSize: "24px", fontWeight: "bold" , borderBlock: "5px"}}>
        <Avatar style={avatarStyle} src={this.state.userimg}>
        </Avatar>
        {this.state.username} 
        </div>
        </Grid>
        </Grid>
        <Grid item xs={12} align="center">
          <Typography variant="h3" compact="h3">
          <link href="https://fonts.googleapis.com/css2?family=Balsamiq+Sans:ital@1&display=swap" rel="stylesheet"/>
            <p className="headline" style={{fontSize: "124px"}}>
            SNAKE GAME AI</p>
          {/* </font> */}
          </Typography>
        </Grid>
        <Grid item xs={12} align="center">
          <ButtonGroup disableElevation variant="contained" color="primary">
            <Button className="buttonW" style={{borderRadius: '50px',height: '60px', width : '200px' ,backgroundColor: "#FF4500",marginRight: "40px"}} variant="contained" target="_blank"  to="/game" component={Link}>
                Join the Race
            </Button>
            
            {this.state.buttonName=="Login" && <Button style={{borderRadius: '50px',height: '60px', width : '200px' ,backgroundColor: "amber"}} className="buttonW" variant="contained" to="/login" component={Link}>
                Login
            </Button>}
            
            {
              this.state.buttonName=="Logout" && <Button style={{color: "black", fontWeight: "bold",borderRadius: '50px',height: '60px', width : '200px' ,backgroundColor: "white"}} className="buttonW" variant="contained" onClick={this.logout} >
              Logout
              </Button>
            }
            {
              this.state.username!="User" && <Button style={{marginLeft: "40px",color: "white", fontWeight: "bold",borderRadius: '50px',height: '60px', width : '200px' ,backgroundColor: "#ff9800"}} className="buttonW" variant="contained" to="/score" component={Link}>
              Score
              </Button>
            }
            {/* <Button style={{color: "black", fontWeight: "bold",borderRadius: '50px',height: '60px', width : '200px' ,backgroundColor: "white"}} className="buttonW" variant="contained" onClick={this.getname} >
              Update
              </Button> */}
          </ButtonGroup>
        </Grid>
      </Grid>
      );
}
renderHomePage()
{
  return <Homepage/>
}
renderLoginPage()
{
  return <Login2/>
}
renderRegisterPage()
{
  return <Register2/>
}

render(){
    return(
        <Router forceRefresh={true}>
            <Switch>
            <Route exact path="/game" render={()=>{
              return this.renderHomePage()
            }}/>
                <Route exact path="/"
                  render={()=>{
                    // this.getname();
                    // setTimeout(function() {return this.renderMainpage()}.bind(this),1000);
                    
                    return this.renderMainpage()
                  }}
                />
              <Route exact path="/login" render={()=>{
                return this.renderLoginPage()
              }}/>
              <Route exact path="/register" render={()=>{
                return this.renderRegisterPage()
              }}/>
              <Route exact path="/score" render={()=>{
                return <Score/>
              }}/>
            </Switch>
        </Router>
        
    );
  }
}