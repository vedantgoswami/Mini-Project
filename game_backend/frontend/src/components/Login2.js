import React, { Component , useState, useEffect, useCallback } from 'react';
import { Avatar, Button, Grid, Paper, TextField } from '@material-ui/core';
import LockOutlinedIcon from '@material-ui/icons/LockOpenOutlined';
import Register from './Register';
import Register2 from './Register2';
import { Link, useHistory } from "react-router-dom";
import Swal from 'sweetalert2';

const Login2=()=>{
  
    const paperStyle={padding: "20px",height: "80vh",width: "300px"}
    // let history = useHistory();    
    const [userLogin,setUserlogin] = useState({
                username: "",
                password: ""
        });
        const [state, setState] = useState({
            username: '',
            
          });
        
        const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            didOpen: (toast) => {
              toast.addEventListener('mouseenter', Swal.stopTimer)
              toast.addEventListener('mouseleave', Swal.resumeTimer)
            }
          });
        const handlechange=(e)=>{
            const name = e.target.name;
            const value = e.target.value;
            // console.log(name);
            setUserlogin({...userLogin,[name]: value})
        }
        const history = useHistory();
        const avatarStyle={  width:"60px" ,height:"60px"}
        const login=async()=>{
            let x=userLogin.username;
            let y=userLogin.password; 
            const requestOption = {
                method: "POST",
                headers: {'Content-Type':'application/json'},
                body: JSON.stringify({
                    username: x,
                    password: y,
                })
              };
            let status;
            let name;
            
            await fetch('/api/login-user',requestOption)
              .then((response)=>response.json())
              .then((data)=>{status = data.status,name = data.name});
            if(status=="verified"){
                setState({username: x});
                history.push({pathname: `/`,state:{username: x}});
                // this.props.parentCallback({details: name});
              }
            else
            {
                await Toast.fire({
                    icon: 'warning',
                    title: 'Incorrect Username or Password'
                  });
                window.location.reload();
            }
            
        }
        return (
        <div className="login">
            <Grid>
                <Paper  elevation={10} style={paperStyle}>
                 <Grid align="center">
                 <Avatar style={avatarStyle} src="./static/images/head.png">
                    </Avatar>
                    <link href="https://fonts.googleapis.com/css2?family=Balsamiq+Sans:ital@1&display=swap" rel="stylesheet"/>
                    <h1 className="headline" style={{fontSize: "45px"}}>Snake Game AI </h1>
                    <h2 className="headline">Login</h2>
                </Grid>
                <TextField value={userLogin.username} name="username" id="username" label="Username" placeholder="Enter UserName" onChange={handlechange} fullWidth required/>
                <TextField value={userLogin.password} name="password" id="password" style={{marginTop: "20px"}} label="Password" onChange={handlechange} placeholder="Enter Password" type="password" fullWidth required/>
                <Grid align="center">
                <Button className="reset" onClick={login} style={{marginTop: "20px",backgroundColor: 'yellowgreen', fontSize: '18px', width: '120px', height: '40px'}}  
                    fullWidth>
                        Login
                </Button>
                </Grid>
                <p style={{marginTop: "30px",marginBottom: "0px",fontFamily: "monospace",fontSize:"15px"}}><b>Not yet Registered?</b></p>
                <p><Button to="/register" component={Link} style={{color: "blue"}} >Create an Account</Button></p>
                </Paper>
            </Grid>
        </div>
        );

}
export default Login2;