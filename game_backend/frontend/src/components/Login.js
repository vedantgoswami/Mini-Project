import React, { Component , useState, useEffect, useCallback } from 'react';
import { Avatar, Button, Grid, Paper, TextField } from '@material-ui/core';
import LockOutlinedIcon from '@material-ui/icons/LockOpenOutlined';
import Register from './Register';
import Register2 from './Register2';
import { useHistory } from "react-router-dom";
// import {Route, withRouter} from 'react-router';
import{
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    Redirect,
    HashRouter
} from "react-router-dom";
export default class Login extends Component{
    renderLoginPage(){
        const paperStyle={padding: "20px",height: "80vh",width: "300px"}
        const avatarStyle={backgroundColor:'red', width:"60px" ,height:"60px"}
        return (
        <div className="login">
            <Grid>
                <Paper  elevation={10} style={paperStyle}>
                 <Grid align="center">
                    <Avatar style={avatarStyle}><LockOutlinedIcon/></Avatar>
                    <link href="https://fonts.googleapis.com/css2?family=Balsamiq+Sans:ital@1&display=swap" rel="stylesheet"/>
                    <h1 className="headline" style={{fontSize: "45px"}}>Snake Game AI </h1>
                    <h2 className="headline">Login</h2>
                </Grid>
                <TextField label="Username" placeholder="Enter UserName" fullWidth required/>
                <TextField style={{marginTop: "20px"}} label="Password" placeholder="Enter Password" type="password" fullWidth required/>
                <Grid align="center">
                <Button className="reset" style={{marginTop: "20px",backgroundColor: 'yellowgreen', fontSize: '18px', width: '120px', height: '40px'}}  
                    fullWidth>
                        Login
                </Button>
                </Grid>
                <p style={{marginTop: "30px",marginBottom: "0px",fontFamily: "monospace",fontSize:"15px"}}><b>Not yet Registered?</b></p>
                <p><Button to="/register" style={{color: "blue"}} component={Link}>Create an Account</Button></p>
                </Paper>
            </Grid>
        </div>
        
        );
    }
    renderRegisterPage(){
        return <Register2/>
    }
    render()
    {
        return(<Router>
            <Switch>
                <Route exact path="/register">
                    {this.renderRegisterPage()}
                </Route>
              <Route exact path="/login" render={()=>{
                return this.renderLoginPage()
              }}/>
            </Switch>
        </Router>);
    }
}