import {useEffect, useState,useRef, RefObject} from 'react'
import "./authority.style.css"
import logo from '../assets/logo.png'
import { useStore } from '../store';
import { useNavigate } from 'react-router-dom';
import Scrolls from "./scroll";
import { motion } from "framer-motion";
import { observer } from 'mobx-react-lite';
import qq from '../assets/QQ.png'
import wechat from '../assets/WeChat.png'
import Stars from './stars';

interface InputRef {
  value: string;
}

function RegisterForm  (prop:any)  {
  const usernameRef = useRef<InputRef>(null) as RefObject<HTMLInputElement>;
  const passwordRef = useRef<InputRef>(null) as RefObject<HTMLInputElement>;
  const emailRef = useRef<InputRef>(null) as RefObject<HTMLInputElement>;
  const confirmedPasswordRef = useRef<InputRef>(null) as RefObject<HTMLInputElement>;
  const codeRef = useRef<InputRef>(null) as RefObject<HTMLInputElement>;

  const handleLoginOnClicked = () => {
    prop.setCurrentPage('login')
  }
  async function handleRegisterSubmit(event:any) {
    event.preventDefault();
    console.log('aaa')
    if(!usernameRef.current || ! passwordRef.current || !emailRef.current || !confirmedPasswordRef.current || !codeRef.current) return;
    const username = usernameRef.current.value;
    const email = emailRef.current.value;
    const password = passwordRef.current.value;
    const confirmedPassword = confirmedPasswordRef.current.value;
    const code = codeRef.current.value;
    console.log(username,email,password,confirmedPassword,code);
  }
  return (
    
    <div className="right-login-form">
      
      <div className="form-wrapper">
        
      <form onSubmit={handleRegisterSubmit}>
        <h1>Sign up</h1>
        <div className="input-items">
            <span className="input-tips">
                Username
            </span>
            <input type="text" className="inputs" placeholder="Enter your username" ref={usernameRef}></input>
        
            
        
          <span className="input-tips">
              Password
          </span>
          
          <input type="password" className="inputs" placeholder="Enter password" ref={passwordRef}/>
          <span className="input-tips">
              Confirm your password
          </span>
          <input type="password" className="inputs" placeholder="Enter password" ref={confirmedPasswordRef}/>
          
          <span className="input-tips">
                Email Address
            </span>
            <input type="text" className="inputs" placeholder="Enter your email" ref={emailRef}></input>
          
          <span className="input-tips">
              Verification code
          </span>
          <input type="password" className="inputs" placeholder="Verification code you received" ref={codeRef}/>
          
        </div>
        {/* <button className="btn">Log in</button> */}
        <motion.button
          className="box" 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
          type='submit'
        >
          Register
        </motion.button>
        </form>
        <div className="siginup-tips">
          <span>Already Have An Account?</span>
          <span onClick={handleLoginOnClicked}>Login</span>
        </div>
        <div className="other-login">
          <div className="divider">
            <span className="line"></span>
            <span className="divider-text">About us</span>
            <span className="line"></span>
          </div>
          <div className="other-login-wrapper">
            <div className="other-login-item">
              <img src={qq} alt="QQ"/>
            </div>
            <div className="other-login-item">
              <img src={wechat} alt="WeChat"/>
            </div>
          </div>
            
        </div>
        
      </div>
      </div>
    
  );


};

export default observer(RegisterForm);
