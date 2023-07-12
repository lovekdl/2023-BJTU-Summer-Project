/*
  修改用户名
*/

import {Modal} from 'antd'
import { useEffect,useState,RefObject,useRef } from 'react'
import { observer } from 'mobx-react-lite';
import { Checkbox ,Table} from 'antd';
import { useStore } from '../store';
import { motion } from 'framer-motion';
import '../index.tsx';
import {useTranslation} from 'react-i18next'
import {message} from 'antd'
import { http } from '../utils/http.tsx';
interface InputRef {
  value: string;
}
function PasswordModal (props : any) {
  const oldPasswordRef = useRef<InputRef>(null) as RefObject<HTMLInputElement>;
  const passwordRef = useRef<InputRef>(null) as RefObject<HTMLInputElement>;
  const confirmedPasswordRef = useRef<InputRef>(null) as RefObject<HTMLInputElement>;
  const {t,i18n} = useTranslation()
  const handleOk = ()=>{
    props.setVisible(false)
  }
  const handleSubmitted = () => {
    if(!oldPasswordRef.current?.value || !passwordRef.current?.value || !confirmedPasswordRef.current?.value) {
      message.error(t('inputs can not be empty'));
      return;
    }
    if(passwordRef.current?.value !== confirmedPasswordRef.current?.value) {
      message.error(t('The two passwords are different'));
      return;
    }
    async function changePassword() {
      try {
        const ret = await http.post('api/modify/password',{
          old_password:oldPasswordRef.current?.value,
          new_password:passwordRef.current?.value
        })
        if(ret.data.state == 'success') {
          message.success('Success')
        }
        else message.error('unknown error.')
      }
      catch(e:any) {
        console.log('catch : ',e)
        if(e.response) message.error(e.response.data.error_message)
        else message.error(e.message)
      }
    }
    changePassword()
  }
  return (
    <Modal title="Modify your name" open={props.visible} onCancel={handleOk} destroyOnClose={true} footer={null} >
      <br></br>
      <div className = 'ModalInnerDiv'>
        <span className = 'ModalSpan2'>{t('Old password')} &nbsp;&nbsp;</span>
      </div>
      <div className = 'ModalInnerDiv'>
        
        <input type="text" className="input-box" placeholder={t("Enter your old password")} ref = {oldPasswordRef}/>
      </div>
      
      
      
      



      <div className = 'ModalInnerDiv'>
        <span className = 'ModalSpan2'>{t('New password')} &nbsp;&nbsp;</span>
      </div>
      <div className = 'ModalInnerDiv'>
        
        <input type="text" className="input-box" placeholder={t("Enter your new password")}ref = {passwordRef}/>
      </div>   
      <div className = 'ModalInnerDiv'>
        
        <input type="password" className="input-box" placeholder={t("Repeat your new password")} ref = {confirmedPasswordRef}/>
        
      </div>   
      <div className = 'ModalInnerButtonDiv'>
      <motion.button
          className="ModalChange" 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
          onClick={handleSubmitted}
        >
          Confirm
        </motion.button>
      </div>
    </Modal>
  )
}

export default observer(PasswordModal)
