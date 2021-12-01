import { Button } from '@material-ui/core';
import React from 'react';

function Modal(){
    return (<div className="modelbackground">
            <div className="modelcontainer">
                <button>X</button>
                <div className="title">
                <h1>Game Over</h1>
                <h2>Are You Sure You Want To Continue?</h2>
                </div>   
                <div className="body">
                    Your Score: 100
                </div>
                <div className="footer">
                    <button>Quit</button>
                    <button>Continue</button>
                </div>
            </div>
    </div>
    )
}
export default Modal; 
