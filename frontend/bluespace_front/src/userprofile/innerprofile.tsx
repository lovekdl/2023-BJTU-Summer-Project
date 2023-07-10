import { observer } from "mobx-react-lite";
import React,{useRef,useState,useEffect} from 'react';
import {motion} from "framer-motion";
import {Avatar} from 'antd'
import { UploadOutlined, VideoCameraOutlined } from '@ant-design/icons';
import { useStore } from '../store';
import {
  UserOutlined
} from "@ant-design/icons";
import NameModal from "./name.modal";
import PasswordModal from "./password.modal";
import { useNavigate } from "react-router-dom";
function InnerProfile() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [nameVisible, setNameVisible] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const {ProfileStore,loginStore} = useStore();
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
      ProfileStore.setAvatar(fileurl)
      console.log('fileurl is ' + fileurl);
      console.log('type is '+typeof fileurl)
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
        Upload
      </motion.button>
    </div >
    <div className = 'InnerDiv'>
      <span className = 'ProfileSpan'>Name &nbsp;&nbsp;</span>
      <div className = 'purple-underline'> lovekdl</div>&nbsp;&nbsp;&nbsp;&nbsp;
      <motion.button
        className="ProfileChange" 
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 400, damping: 20 }}
        onClick={handleModifyName}
      >
        Modify
      </motion.button>
      {/* <input type="text" readOnly placeholder="Enter your email"></input> */}
    </div>
    <div className = 'InnerDiv'>
      <span className = 'ProfileSpan'>Email &nbsp;&nbsp;</span>
      <div className = 'purple-underline'> 2412162744@qq.com</div>&nbsp;&nbsp;&nbsp;&nbsp;
      {/* <input type="text" readOnly placeholder="Enter your email"></input> */}
    </div>
    <div className = 'InnerDiv'>
      <span className = 'ProfileSpan'>Password &nbsp;&nbsp;</span>
      <div className = 'purple-underline'> ********</div>&nbsp;&nbsp;&nbsp;&nbsp;
      <motion.button
        className="ProfileChange" 
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 400, damping: 20 }}
        onClick={handleModifyPassword}
      >
        Modify
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
        Log Out
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