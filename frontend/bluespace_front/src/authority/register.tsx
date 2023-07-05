import {useEffect, useState} from 'react'
import "./authority.style.css"
import logo from '../assets/logo.png'
import { useStore } from '../store';
import { useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import qq from '../assets/QQ.png'
import wechat from '../assets/WeChat.png'
function RegisterForm  ()  {


  return (
    <div className="content">
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
            <div className="right-login-form">
                <div className="form-wrapper">
                    <h1>Log in</h1>
                    <div className="input-items">
                        <span className="input-tips">
                            Email Address
                        </span>
                        <input type="text" className="inputs" placeholder="Enter your email"/>
                    </div>
                    <div className="input-items">
                        <span className="input-tips">
                            Password
                        </span>
                        <input type="password" className="inputs" placeholder="Enter password"/>
                        <span className="forgot">Forgot Password</span>
                    </div>
                    <button className="btn">Log in</button>
                    <div className="siginup-tips">
                        <span>Don't Have An Account?</span>
                        <span>Signup</span>
                    </div>
                    <div className="other-login">
                        <div className="divider">
                            <span className="line"></span>
                            <span className="divider-text">or</span>
                            <span className="line"></span>
                        </div>
                        <div className="other-login-wrapper">
                            <div className="other-login-item">
                                <img src={qq}alt="QQ"/>
                            </div>
                            <div className="other-login-item">
                                <img src={wechat} alt="WeChat"/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );


};

export default observer(RegisterForm);
