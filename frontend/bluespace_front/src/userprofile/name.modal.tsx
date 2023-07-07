/*
  修改用户名
*/

import {Modal} from 'antd'
import { useEffect,useState } from 'react'
import { observer } from 'mobx-react-lite';
import { Checkbox ,Table} from 'antd';
import { useStore } from '../store';
import { motion } from 'framer-motion';

function NameModal (props : any) {
  // const {RankStore} = useStore()
  // const handleOk = ()=>{
  //   props.setVisible(false)
  // }
  // //每次props.visible改变时修改视图
  // useEffect(()=> {
  //   RankStore.getRanking()
  // },[props.visible])
  const handleOk = ()=>{
    props.setVisible(false)
  }

  return (
    <Modal title="Modify your name" open={props.visible} onCancel={handleOk} destroyOnClose={true} footer={null} >
      <br></br>
      <div className = 'ModalInnerDiv'>
        
        <span className = 'ModalSpan'>Old Name &nbsp;&nbsp;</span>
        <div className = 'Modal-purple-underline'> lovekdl</div>
      </div>
      
      
      <div className = 'ModalInnerDiv'>
        
        <span className = 'ModalSpan'>New Name &nbsp;&nbsp;</span>
        <input type="text" className="input-box" placeholder="Enter your new name"/>
        
      </div>
      
      <div className = 'ModalInnerButtonDiv'>
      <motion.button
          className="ModalChange" 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
        
        >
          Confirm
        </motion.button>
      </div>
    </Modal>
  )
}

export default observer(NameModal)
