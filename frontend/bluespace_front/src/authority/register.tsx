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
import '../index.tsx';
import {useTranslation} from 'react-i18next'
import {http} from '../utils'
import {message} from 'antd'
interface InputRef {
  value: string;
}

function RegisterForm  (prop:any)  {
  const usernameRef = useRef<InputRef>(null) as RefObject<HTMLInputElement>;
  const passwordRef = useRef<InputRef>(null) as RefObject<HTMLInputElement>;
  const emailRef = useRef<InputRef>(null) as RefObject<HTMLInputElement>;
  const confirmedPasswordRef = useRef<InputRef>(null) as RefObject<HTMLInputElement>;
  const codeRef = useRef<InputRef>(null) as RefObject<HTMLInputElement>;
  const {loginStore} = useStore();
  const {t,i18n} = useTranslation()
  const handleLoginOnClicked = () => {
    prop.setCurrentPage('login')
  }
  async function handleRegisterSubmit(event:any) {
    event.preventDefault();
    const [coordinates, setCoordinates] = useState({ x: 0, y: 0 });
  
    if(!usernameRef.current || ! passwordRef.current || !emailRef.current || !confirmedPasswordRef.current || !codeRef.current) {
      message.error(t('inputs can not be empty'))
      return;}
    const username = usernameRef.current.value;
    const email = emailRef.current.value;
    const password = passwordRef.current.value;
    const confirmedPassword = confirmedPasswordRef.current.value;
    const code = codeRef.current.value;
    async function register() {
      try {
        const ret = await http.post('api/send',{
          username : usernameRef.current?.value,
          email : emailRef.current?.value,
        })
        if(ret.data.state == 'success') {
          message.success('email has been sent.')
          loginStore.resetWaiting();
        }
        else message.error('unknown error.')
      }
      catch(e:any) {
        console.log('catch : ',e)
        if(e.response) message.error(e.response.data.error_message)
        else message.error(e.message)
      }
    }
    register()
  }
  const handleSendClicked = () => {
    async function send() {
      try {
        const ret = await http.post('api/send',{
          username : usernameRef.current?.value,
          email : emailRef.current?.value,
        })
        if(ret.data.state == 'success') {
          message.success('email has been sent.')
          loginStore.resetWaiting();
        }
        else message.success('unknown error.')
      }
      catch(e:any) {
        console.log('catch : ',e)
        if(e.response) message.error(e.response.data.error_message)
        else message.error(e.message)
      }
    }
    send()
    
  }
  return (
    
    <div className="right-login-form">
      
      <div className="form-wrapper">
        
      <form onSubmit={handleRegisterSubmit}>
        <h1>{t('Sign up')}</h1>
        <div className="input-items">
            <span className="input-tips">
                {t('Username')}
                
            </span>
            <input type="text" className="inputs" placeholder={t("Enter") + t("username")} ref={usernameRef}></input>
        
            
        
          <span className="input-tips">
              {t('Password')}
          </span>
          
          <input type="password" className="inputs" placeholder={t("Enter") + t("password")} ref={passwordRef}/>
          <span className="input-tips">
              {t('Confirm your password')}
          </span>
          <input type="password" className="inputs" placeholder={t("Enter") + t("password")} ref={confirmedPasswordRef}/>
          
          <span className="input-tips">
                {t('Email Address')}
            </span>
            
            
            <input type="text" className="inputs" placeholder={t("Enter") + t("email")}  ref={emailRef}></input>
            <div className='vertification' >
            <input type="password" className="inputs2" placeholder={t("Enter") + t("verification code")}  ref={codeRef}/>
            {loginStore.waiting <= 0? <motion.div
              className='box3'
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSendClicked}
            >
                {t('Send')}
            </motion.div> : <motion.div
              
              className='box2'
            >
                {loginStore.waiting}
            </motion.div>} 
            </div>
          
          
          
              
          
        </div>
        {/* <button className="btn">Log in</button> */}
        <motion.button
          className="box" 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
          type='submit'
        >
          {t('Register')}
        </motion.button>
        </form>
        <div className="siginup-tips">
          <span>{t('Already Have An Account?')}</span>
          <span onClick={handleLoginOnClicked}>Login</span>
        </div>
        
        
      </div>
      </div>
    
  );


};

export default observer(RegisterForm);
