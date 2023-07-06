import {useEffect, useState} from 'react'
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


function LoginForm  ()  {
  const navigate = useNavigate()
  const [ current_page , setCurrentPage ] = useState('login');
  const handleOnClicked = () => {
    console.log('okokok')
  }
  const handleSignUpOnClicked = () => {
    console.log('ck')
    setCurrentPage('register')
  }
  const handleLoginOnClicked = () => {
    setCurrentPage('login')
  }

  return (
    
    <div className="content">
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
            
            <div className="input-items">
                <span className="input-tips">
                    Email Address
                </span>
                <input type="text" className="inputs" placeholder="Enter your email"></input>
                
            </div>
            <div className="input-items">
              <span className="input-tips">
                  Password
              </span>
              
              <input type="password" className="inputs" placeholder="Enter password"/>
              
              <span className="forgot">Forgot Password</span>
            </div>
            {/* <button className="btn">Log in</button> */}
            <motion.div
              className="box" 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
              onClick={handleOnClicked}
            >
              Log in
            </motion.div>
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
                  <img src={qq} alt="QQ"/>
                </div>
                <div className="other-login-item">
                  <img src={wechat} alt="WeChat"/>
                </div>
              </div>
                
            </div>
            
          </div>
          
        </div>:
        <div className="right-login-form">
          <div className="form-wrapper">
            
          
            <h1>Sign up</h1>
            
            <div className="input-items">
                <span className="input-tips">
                    Email Address
                </span>
                <input type="text" className="inputs" placeholder="Enter your email"></input>
                
            </div>
            <div className="input-items">
              <span className="input-tips">
                  Password
              </span>
              
              <input type="password" className="inputs" placeholder="Enter password"/>
              <span className="input-tips">
                  Confirm your password
              </span>
              
              <input type="password" className="inputs" placeholder="Enter password"/>
              
            </div>
            {/* <button className="btn">Log in</button> */}
            <motion.div
              className="box" 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
              onClick={handleOnClicked}
            >
              Register
            </motion.div>
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
          
        </div>}
      </div>
    </div>
  );


};

export default observer(LoginForm);
