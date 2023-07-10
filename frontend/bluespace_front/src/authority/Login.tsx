import {RefObject, useEffect, useState} from 'react'
import "./authority.style.css"
import logo from '../assets/logo.png'
import React, { useRef } from 'react';
import { useStore } from '../store';
import { useNavigate } from 'react-router-dom';
import Scrolls from "./scroll";
import { motion } from "framer-motion";
import { observer } from 'mobx-react-lite';
import qq from '../assets/QQ.png'
import wechat from '../assets/WeChat.png'
import Stars from './stars';
import { RegisterForm } from '.';
import {message} from 'antd'


interface InputRef {
  value: string;
}

function LoginForm  ()  {
  const [coordinates, setCoordinates] = useState({ x: 0, y: 0 });

  const handleMouseMove = (event:any) => {
    const { clientX, clientY } = event;
    setCoordinates({ x: clientX, y: clientY });
    console.log(coordinates)
  };
  const navigate = useNavigate()
  const usernameRef = useRef<InputRef>(null) as RefObject<HTMLInputElement>;
  const passwordRef = useRef<InputRef>(null) as RefObject<HTMLInputElement>;
  const [ current_page , setCurrentPage ] = useState('login');
  
  const {loginStore} = useStore();
  

  const handleSignUpOnClicked = () => {
    console.log('ck')
    setCurrentPage('register')
  }
  
  async function handleLoginSubmit(event:any) {
    if(!usernameRef.current || !passwordRef.current) return;
    console.log('Uername is:', usernameRef.current.value);
    console.log('Password:', passwordRef.current.value);
    event.preventDefault();


    try {
      await loginStore.getTokenByLogin({
        username: usernameRef.current.value,
        password: passwordRef.current.value
      })
      message.success('登录成功')
      navigate('/', {replace:true})
      window.location.reload()
    } catch(e:any) {
      console.log(e)
      if(e.response)
        message.error(e.response.data.error_message)
      else message.error(e.message)
    }
  }

  const handleGithubClicked = () => {
    window.open('https://github.com/lovekdl/2023-BJTU-Summer-Project', '_blank');
  }
  const handleBilibiliClicked = () => {
    window.open('https://space.bilibili.com/99798809', '_blank');
  }
  return (
    
    
    <div className="content" >
    <Stars></Stars>
      
      {/* <Scrolls></Scrolls> */}
      <div className="login-wrapper">
        <div className="left-img">
          <div className="glass">
            <div className="tips">
              <h1>BLUE SPACE</h1>
              <span>explore the universe.</span>
              <span>try to find your planet.</span>
            </div>
          </div>
        </div>
        {current_page === 'login'? <div className="right-login-form">
          <div className="form-wrapper">
            
          
            <h1>Log in</h1>
            <form onSubmit={handleLoginSubmit}>
              <div className="input-items">
                  <span className="input-tips">
                      Username
                  </span>
                  <input type="text"  className="inputs" placeholder="Enter your username" ref={usernameRef}  ></input>
                  
              </div>
              <div className="input-items">
                <span className="input-tips">
                    Password
                </span>
                
                <input type="password" className="inputs" placeholder="Enter password" ref={passwordRef}/>
                
                <span className="forgot">Forgot Password</span>
              </div>
              
              <motion.button
                className="box" 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
                // onClick={handleOnClicked}
                type = 'submit'
              >
                Log in
              </motion.button>
            </form>
            {/* <button className="btn">Log in</button> */}
            
            <div className="siginup-tips">
              <span>Don't Have An Account?</span>
              <span onClick={handleSignUpOnClicked}>Signup</span>
            </div>
            <div className="other-login">
              <div className="divider">
                <span className="line"></span>
                <span className="divider-text">About us</span>
                <span className="line"></span>
              </div>
              <div className="other-login-wrapper">
                <div className="other-login-item">
                  <img src={qq} alt="QQ" onClick={handleGithubClicked}/>
                </div>
                <div className="other-login-item">
                  <img src={wechat} alt="WeChat" onClick = {handleBilibiliClicked}/>
                </div>
              </div>
                
            </div>
            
          </div>
          
        </div>:
        <RegisterForm setCurrentPage ={setCurrentPage}></RegisterForm>
        }
      </div>
    </div>
  );


};

export default observer(LoginForm);
