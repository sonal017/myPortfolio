import React from "react";
import './style.css'
import About from "./about";
import Contact from "./contact";

export default function Main(){
    return(
        <div className="main-body">
            {/* <About /> */}
            <Contact />
        </div>
    )
}