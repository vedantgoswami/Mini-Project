import React, { Component , useState, useEffect, useCallback } from 'react';
import { Avatar, Button, Grid, Paper, TextField } from '@material-ui/core';
import LockOutlinedIcon from '@material-ui/icons/LockOpenOutlined'
import{
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    Redirect,
    HashRouter
} from "react-router-dom";
export default class Register extends Component{
    

    renderRegisterPage(){
        const paperStyle={padding: "20px",height: "90vh",width: "350px"}
        const avatarStyle={backgroundColor:'red', width:"60px" ,height:"60px"}
        const state = {
            value : "",
        }
        const handleusername=(e)=>{this.setState({
            value: e.target.value
        });
        console.log(e.target.value);
    }
        return (
        <div className="login">
            <Grid>
                <Paper  elevation={10} style={paperStyle}>
                 <Grid align="center">
                    <Avatar style={avatarStyle}><LockOutlinedIcon/></Avatar>
                    <link href="https://fonts.googleapis.com/css2?family=Balsamiq+Sans:ital@1&display=swap" rel="stylesheet"/>
                    <h1 className="headline" style={{fontSize: "45px"}}>Snake Game AI </h1>
                    <h2 className="headline">Register</h2>
                </Grid>
                <TextField label="First Name" placeholder="Enter First Name" fullWidth required/>
                <TextField style={{marginTop: "20px"}} label="Username" placeholder="Enter UserName" fullWidth required value={state.value}  onChange={handleusername}/>
                <TextField style={{marginTop: "20px"}} label="Password" placeholder="Enter Password" type="password" fullWidth required />
                <TextField style={{marginTop: "20px"}} label="Confirm Password" placeholder="Confirm Password" type="password" fullWidth required/>
                
                <Grid align="center">
                <Button className="reset" style={{marginTop: "20px",backgroundColor: 'yellowgreen', fontSize: '18px', width: '120px', height: '40px'}}  
                    fullWidth>
                        Register
                </Button>
                
                </Grid>
                </Paper>
            </Grid>
        </div>
        );
    }

    render()
    {
        return(<Router>
            <Switch>
              <Route exact path="/register" render={()=>{
                return this.renderRegisterPage()
              }}/>
            </Switch>
        </Router>);
    }
}