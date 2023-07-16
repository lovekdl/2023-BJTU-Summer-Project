// Photos from https://citizenofnowhe.re

import { useState,useEffect } from "react";
import { useAnimate, stagger,motion } from "framer-motion";
import { ButtonAppBar} from "./menu/index";
import { LoginForm } from "./authority";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { MainComponent } from "./main/index";
import "./App.css"
import {Prediction} from "./forecast/index";
import { Profile } from "./userprofile/index";
import { AuthComponent } from "./route_auth/AuthComponent";
import InnerPrediction from "./forecast/innerprediction";
import {setLanguageFromLocalStorage,getLanguageFromLocalStorage} from "./utils/token"
import './index.tsx';
import {useTranslation} from 'react-i18next'
import  { observer } from 'mobx-react-lite';

export default function App() {
  const {t,i18n} = useTranslation()
  useEffect(()=> {
    const language = getLanguageFromLocalStorage() || ''
    if(language == '') {
      setLanguageFromLocalStorage("zh")
      i18n.changeLanguage("zh")
    }
    else (
      i18n.changeLanguage(language)
    )
  },[])
  return (
    <Router>

      <Routes>
      
        <Route path = "/" element={
          <div className = 'black-background'>
            <ButtonAppBar ></ButtonAppBar>
            
              <MainComponent/>
           
          </div>} 
        />
        <Route path="/prediction" element={
          <AuthComponent>
            <div>
            <ButtonAppBar></ButtonAppBar>
            <Prediction></Prediction>
            </div>
          </AuthComponent>
        }></Route>
        <Route path = "/login" element={<LoginForm />} />
        <Route path = "/profile" element={<div>
          <ButtonAppBar></ButtonAppBar>
          <Profile></Profile>
        </div>} />

        <Route path = "/test" element = {<InnerPrediction></InnerPrediction>}></Route>
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
