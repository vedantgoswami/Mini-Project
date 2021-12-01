import React, { Component , useState, useEffect, useCallback } from 'react';
import { Avatar, Button, Grid, Paper, TextField } from '@material-ui/core';
import LockOutlinedIcon from '@material-ui/icons/LockOpenOutlined';
import Register from './Register';
import Register2 from './Register2';
import { Link, useHistory } from "react-router-dom";
import Swal from 'sweetalert2';
// import { useTable } from 'react-table';
// import backimg from './download.jpg'


const Score=()=>{
    
    const [player] = useState([]);
    const [username,setusername] = useState("User");
    const [highest,sethighest] = useState(0);
    const styletr={border: "1px solid black",
        padding: "0.5rem",
        align: "center",
        fontSize: "20px",
        backgroundColor: "white"
        }
   
        useEffect(()=>{
            const requestOption = {
                method: "POST",
                headers: {'Content-Type':'application/json'},
                body: JSON.stringify({
                    username: "x",
                    
                })
              };
            if(player.length==0)
            fetch('/api/user-score',requestOption)
            .then((response)=>response.json())
            .then((data)=>{
                for (var i = 0; i < data.list.length; i++) {
                    var counter = data.list[i];
                    // console.log(counter.score,counter.time);
                    player.push(counter);
                }
                // username = data.username;
                setusername(data.username);
                sethighest(data.highest);
                console.log(data.username);
            });
    },[]);
    const RenderTable=(player,index)=>{
        
        return (
            <tr key={index} style={styletr}>
                <td style={styletr}>{player.score}</td>
                <td style={styletr}>{player.time}</td>
            </tr>
        )
    }
    const paperStyle={
        padding: "20px",
        height: "90vh",
        width: "650px", 
    }
    
        return (
        <div className="score">
            <Grid> 
                
                {/* <img  src={"download.jpg"}/>  */}
                <Paper style={{
                    padding: "20px",
                    height: "90vh",
                    width: "650px",
                    backgroundImage: 'url("/static/images/new2.jpg") ',
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: 'cover',
                    overflow: "auto"
                    }} elevation={10} >
                <Grid align="center">
                    <link href="https://fonts.googleapis.com/css2?family=Balsamiq+Sans:ital@1&display=swap" rel="stylesheet"/>
                    <h1 className="headline" style={{fontSize: "55px"}}>Snake Game AI </h1>
                    <h2 className="headline">******** History ********</h2>
                </Grid>
                <Grid align="left">
                <h2 className="heading-score" style={{fontSize: "20px",alignSelf: "left"}}><b>User:</b> {username}</h2>
                    </Grid>
                    <Grid align="left">
                <h2 className="heading-score" style={{fontSize: "20px",alignSelf: "left"}}><b>Highest Score:</b> {highest}</h2>
                    </Grid>
                
                <Grid>
                
                    {/* {console.log(player)} */}
                    
                    <table style={{width: "100%" ,
                                   border: "2px solid black",
                                   alignItems: "center",
                                   
                                   position: "-webkit-sticky"}}>
                    <thead>
                        <tr className="headline" style={styletr}>
                        <th style={styletr}>Score</th>
                        <th style={styletr}>Time</th>
                        </tr>
                    </thead>
                    
                    <tbody>
                        {player.map(RenderTable)}
                        
                    </tbody>
                    </table>
                </Grid>
                </Paper>
            </Grid>
        </div>
        );

}
export default Score;