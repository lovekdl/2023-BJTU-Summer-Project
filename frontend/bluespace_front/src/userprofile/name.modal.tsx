/*
  修改用户名
*/

import {Modal} from 'antd'
import { useEffect,useState ,RefObject,useRef} from 'react'
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
function NameModal (props : any) {
  const nameRef = useRef<InputRef>(null) as RefObject<HTMLInputElement>;
  const {t,i18n} = useTranslation()
  const handleOk = ()=>{
    props.setVisible(false)
  }

  const handleSubmitted = () => {
    if(!nameRef.current?.value) {
      message.error(t('inputs can not be empty'));
      return ;
    }
    async function changePassword() {
      try {
        const ret = await http.post('api/modify/username',{
          new_username:nameRef.current?.value,
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
    <Modal title={t("Modify your name")} open={props.visible} onCancel={handleOk} destroyOnClose={true} footer={null} >
      <br></br>
      <div className = 'ModalInnerDiv'>
        
        <span className = 'ModalSpan'>{t('Old name')} &nbsp;&nbsp;</span>
        <div className = 'Modal-purple-underline'> lovekdl</div>
      </div>
      
      
      <div className = 'ModalInnerDiv'>
        
        <span className = 'ModalSpan'>{t('New name')} &nbsp;&nbsp;</span>
        <input type="text" className="input-box" placeholder={t("Enter your new name")} ref={nameRef}/>
        
      </div>
      
      <div className = 'ModalInnerButtonDiv'>
      <motion.button
          className="ModalChange" 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
          onClick={handleSubmitted}
        >
          {t('Confirm')}
        </motion.button>
      </div>
    </Modal>
  )
}

export default observer(NameModal)
