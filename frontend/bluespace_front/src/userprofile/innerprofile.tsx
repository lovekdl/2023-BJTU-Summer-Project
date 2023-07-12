import { observer } from "mobx-react-lite";
import React,{useRef,useState,useEffect} from 'react';
import {motion} from "framer-motion";
import {Avatar} from 'antd'
import { UploadOutlined, VideoCameraOutlined } from '@ant-design/icons';
import { useStore } from '../store';
import {message} from 'antd'
import {
  UserOutlined
} from "@ant-design/icons";
import NameModal from "./name.modal";
import PasswordModal from "./password.modal";
import { useNavigate } from "react-router-dom";
import '../index.tsx';
import {useTranslation} from 'react-i18next'
import {getTokenFromLocalStorage, http} from '../utils'

function InnerProfile() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [nameVisible, setNameVisible] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const {ProfileStore,loginStore} = useStore();
  const {t,i18n} = useTranslation()
  const navigate = useNavigate();
  const handleUploadClicked = ()=> {
    console.log('hahaha')
    if(fileInputRef.current)
    fileInputRef.current.click();
  }
  const handleModifyName = ()=> {
    setNameVisible(!nameVisible)
  }
  const handleModifyPassword = ()=> {
    setPasswordVisible(!nameVisible)
  }
  const handleFileChange = (event:any) => {
    const imgfile = event.target.files[0];
    console.log(imgfile);
    var reader = new FileReader();
    reader.onload=function(){
      var fileurl = reader.result
      // ProfileStore.setAvatar(fileurl)
      // console.log('fileurl is ' + fileurl); 
      // console.log('type is '+typeof fileurl)
      async function SaveAvatar() {
        try {
          const ret = await http.post('api/avatar',{
            avatar : fileurl
          })
          if(ret.data.state == 'success') {
            message.success(t('uploaded'))
            loginStore.resetWaiting();
            ProfileStore.getAvatar();
          }
          else message.error(ret.data.error_message)
        }
        catch(e:any) {
          console.log('catch : ',e)
          if(e.response) message.error(e.response.data.error_message)
          else message.error(e.message)
        }
      }
      SaveAvatar()
    }
    reader.readAsDataURL(imgfile)

  };
  const handleLogoutClicked = () => {
    loginStore.setToken('')
    navigate('/',{replace:false})
  }
  return (
  <div>
    <NameModal visible = {nameVisible} setVisible={setNameVisible}></NameModal>
    <PasswordModal visible = {passwordVisible} setVisible={setPasswordVisible}></PasswordModal>
    <div className = 'HeadPicture'>
      {ProfileStore.avatar===''? <Avatar size={128} icon={<UserOutlined />} /> : <Avatar size={128} src={<img src={ProfileStore.avatar}  alt="avatar" />} />}
      
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
      <motion.button
        className="ProfileBox" 
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 400, damping: 20 }}
        onClick={handleUploadClicked}
      >
        {t("Upload")}
      </motion.button>
    </div >
    <div className = 'InnerDiv'>
      <span className = 'ProfileSpan'>{t('Name')} &nbsp;&nbsp;</span>
      <div className = 'purple-underline'> {ProfileStore.username}</div>&nbsp;&nbsp;&nbsp;&nbsp;
      <motion.button
        className="ProfileChange" 
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 400, damping: 20 }}
        onClick={handleModifyName}
      >
        {t('Modify')}
      </motion.button>
      {/* <input type="text" readOnly placeholder="Enter your email"></input> */}
    </div>
    <div className = 'InnerDiv'>
      <span className = 'ProfileSpan'>{t('Email')} &nbsp;&nbsp;</span>
      <div className = 'purple-underline'> {ProfileStore.email}</div>&nbsp;&nbsp;&nbsp;&nbsp;
      {/* <input type="text" readOnly placeholder="Enter your email"></input> */}
    </div>
    <div className = 'InnerDiv'>
      <span className = 'ProfileSpan'>{t('Password')} &nbsp;&nbsp;</span>
      <div className = 'purple-underline'> ********</div>&nbsp;&nbsp;&nbsp;&nbsp;
      <motion.button
        className="ProfileChange" 
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 400, damping: 20 }}
        onClick={handleModifyPassword}
      >
        {t('Modify')}
      </motion.button>
      {/* <input type="text" readOnly placeholder="Enter your email"></input> */}
    </div>
    <br></br><br></br><br></br>
    <div className = 'InnerDiv'>
      
      <div className = 'hahaplace'></div>&nbsp;&nbsp;&nbsp;&nbsp;
      <motion.button
        className="LogoutButton" 
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 400, damping: 20 }}
        onClick={handleLogoutClicked}
      >
        {t('Log out')}
      </motion.button>
    </div>
    {/* <div className = 'InnerDiv'>
    <span className = 'ProfileSpan'>Email Address &nbsp;&nbsp;<br></br></span>
      <br></br>
      <div className = 'purple-underline'> haha</div>&nbsp;&nbsp;&nbsp;&nbsp;
        <motion.button
          className="ProfileChange" 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
          onClick={handleUploadClicked}
        >
          Modify
        </motion.button>
    </div> */}
  </div>
  )
}

export default observer(InnerProfile)