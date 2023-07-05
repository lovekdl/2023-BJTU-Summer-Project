// Photos from https://citizenofnowhe.re

import { useState,useEffect } from "react";
import { useAnimate, stagger,motion } from "framer-motion";
import { ButtonAppBar, Menu, MenuToggle} from "./menu/index";
import { LoginForm } from "./authority";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { MainComponent } from "./main/index";

export default function App() {
  return (
    <Router>

      <Routes>
      
        <Route path = "/" element={
          <div>
            <ButtonAppBar ></ButtonAppBar>
            {[1, 2].map((image) => (
              <MainComponent id={image} />
            ))}
          </div>} 
        />

      <Route path = "/login" element={<LoginForm />} />
      </Routes>

      

      {/* <nav className="menu">
        <ul>
          <li>Portfolio</li>
          <li>About</li>
          <li>Contact</li>
          <li>Search</li>
        </ul>
      </nav> */}
      
    </Router>
  );
}
