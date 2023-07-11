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
import '../index.tsx';
import {useTranslation} from 'react-i18next'

interface InputRef {
  value: string;
}

function LoginForm  ()  {
  const [coordinates, setCoordinates] = useState({ x: 0, y: 0 });
  const {t,i18n} = useTranslation()
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
    setCurrentPage('register')
  }
  
  async function handleLoginSubmit(event:any) {
    if(!usernameRef.current || !passwordRef.current) return;
    event.preventDefault();


    try {
      await loginStore.getTokenByLogin({
        username: usernameRef.current.value,
        password: passwordRef.current.value
      })
      message.success(t('Success'))
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
              <span>{t('explore the universe.')}</span>
              <span>{t('try to find your planet.')}</span>
            </div>
          </div>
        </div>
        {current_page === 'login'? <div className="right-login-form">
          <div className="form-wrapper">
            
          
            <h1>{t('Log in')}</h1>
            <form onSubmit={handleLoginSubmit}>
              <div className="input-items">
                  <span className="input-tips">
                      {t('Username')}
                  </span>
                  <input type="text"  className="inputs" placeholder={t("Enter")+ t('username')} ref={usernameRef}  ></input>
                  
              </div>
              <div className="input-items">
                <span className="input-tips">
                    {t('Password')}
                </span>
                
                <input type="password" className="inputs" placeholder={t("Enter")+ t('password')} ref={passwordRef}/>
                
                <span className="forgot">{t('Forgot Password')}</span>
              </div>
              
              <motion.button
                className="box" 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
                // onClick={handleOnClicked}
                type = 'submit'
              >
                {t('Log in')}
              </motion.button>
            </form>
            {/* <button className="btn">Log in</button> */}
            
            <div className="siginup-tips">
              <span>{t("Don't Have An Account?")}</span>
              <span onClick={handleSignUpOnClicked}>{t('Signup')}</span>
            </div>
            <div className="other-login">
              <div className="divider">
                <span className="line"></span>
                <span className="divider-text">{t('About us')}</span>
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
