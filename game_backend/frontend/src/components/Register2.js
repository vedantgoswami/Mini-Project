import React, {Component , useState, useEffect, useCallback } from 'react';
import { Avatar, Button, Grid, Paper, TextField } from '@material-ui/core';
import LockOutlinedIcon from '@material-ui/icons/LockOpenOutlined'
import Swal from 'sweetalert2';
import axios from 'axios';
// import createBrowserHistory from 'history/lib/createBrowserHistory'
import { useHistory } from 'react-router-dom';
const Register2=()=>{
    let history = useHistory();
    let selectedfile;
    const [userReg,setUserReg]=useState({
        name: "",
        username: "",
        email: "",
        password: "",
        confirm_password: ""
    });
    const state = {
        disabled: true,
        
    }
    const fileSelectedHandler=(event)=>{
        // console.log(event.target.files[0]);
        selectedfile = event.target.files[0];
    }
    const handleInput=(e)=>{
        const name = e.target.name;
        const value = e.target.value;
        console.log(name);
        
        setUserReg({...userReg,[name]: value})
    }
    const paperStyle={padding: "20px",height: "90vh",width: "350px"}
    const avatarStyle={ width:"60px" ,height:"60px"}
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
    const postuserdetails=async ()=>{
        let x = userReg.username;
        let y = userReg.name;
        let z = userReg.email;
        let u = userReg.password;
        let v = userReg.confirm_password;
        console.log(x,y,z,u,v);
        if(u == v)
        {
            if(x!="" && y!="" && z!="")
            {
                //sending image
                
                // const requestOption1 = {
                //     method: "POST",
                //     headers: {'Content-Type':'application/json'},
                //     body: JSON.stringify({
                //         image: selectedfile,
                //     })
                //   };
                console.log(selectedfile)
                console.log(selectedfile.name);
                let form_data = new FormData();
                form_data.append('image',selectedfile);
                form_data.append('username',x)
                const requestOption1 = {
                    method: "POST",
                    body: form_data,
                  };
                fetch('/api/image-state',requestOption1);
                // sending user details
                const requestOption = {
                method: "POST",
                headers: {'Content-Type':'application/json'},
                body: JSON.stringify({
                    username: x,
                    name: y,
                    email: z,
                    password: u
                })
              };
            
            fetch('/api/create-user',requestOption)
              .then((response)=>response.json());
            await Toast.fire({
                icon: 'success',
                title: 'Registered successfully'
              });
            //   browserHistory.push('/login');
            history.push("/login")
            }
            else
            {
                if(u!="")
                {
                Swal.fire({
                    title: 'Incompelete Details!',
                    icon: 'warning',
                    confirmButtonText: 'Reset'
                  });
                }
                else
                {
                    Swal.fire({
                        title: 'Empty Password',
                        icon: 'warning',
                        confirmButtonText: 'Reset'
                      });
                }        
            }
        }
        else{
            Swal.fire({
                title: 'Password Not Matching',
                icon: 'warning',
                confirmButtonText: 'Reset'
              });
        }
    }
    return(
        <div className="login">
            <Grid>
                <Paper  elevation={10} style={paperStyle}>
                 <Grid align="center">
                 <Avatar style={avatarStyle} src="./static/images/head.png">
                    </Avatar><link href="https://fonts.googleapis.com/css2?family=Balsamiq+Sans:ital@1&display=swap" rel="stylesheet"/>
                    <h1 className="headline" style={{fontSize: "45px"}}>Snake Game AI </h1>
                    <h2 className="headline">Register</h2>
                </Grid>
                <TextField name="name" label="First Name" placeholder="Enter First Name" value={userReg.name} onChange={handleInput} fullWidth required/>
                <TextField id="username" name="username" style={{marginTop: "20px"}} label="Username" placeholder="Enter UserName" value={userReg.username} fullWidth required
                onChange={handleInput}/>
                <TextField id="password" name="password" style={{marginTop: "20px"}} label="Password" placeholder="Enter Password" value={userReg.password} type="password" fullWidth required 
                onChange={handleInput}/>
                <TextField id="confirm_password" name="confirm_password" style={{marginTop: "20px"}} label="Confirm Password" placeholder="Confirm Password" type="password" value={userReg.confirm_password} fullWidth required
                onChange={handleInput}/>
                <TextField id="email" name="email" style={{marginTop: "20px",marginBottom: "20px"}} label="Email" placeholder="Enter Email Id" value={userReg.email}  fullWidth required
                onChange={handleInput}/>    
                <input  class="inputfile" type="file" name="file" onChange={fileSelectedHandler} webkitdirectory directory></input>
                <label for="file">Choose a file</label>
               
                <Grid align="center">
                <Button  id="reset" onClick={postuserdetails} className="reset" style={{marginTop: "20px",backgroundColor: 'yellowgreen', fontSize: '18px', width: '120px', height: '40px'}}  
                    fullWidth>
                        Register
                </Button>
                
                </Grid>
                <p style={{ fontWeight: "bold",marginTop: "30px",marginBottom: "0px",fontFamily: "monospace",fontSize:"15px"}}>Already registered <a href="/login">Login</a></p>
                </Paper>
            </Grid>
        </div>
    );

}
export default Register2;