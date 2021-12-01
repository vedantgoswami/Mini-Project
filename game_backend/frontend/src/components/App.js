import React, { Component } from "react";
import { render } from "react-dom";
import Startup from "./Startup";
import Homepage from "./Homepage";
export default class App extends Component {
  constructor(props) {
    super(props);
    
  }
  
  render() {
    
    return(
      <div className="center">
        <Startup />
      </div>
    );
  }
}

const appDiv = document.getElementById("app");
render(<App />, appDiv);