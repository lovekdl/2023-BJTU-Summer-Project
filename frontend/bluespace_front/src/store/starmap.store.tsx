import {makeAutoObservable} from 'mobx'
import {http, setTokenFromLocalStorage, getTokenFromLocalStorage} from '../utils'

class StarMapStore {
	header = 'aa';
  message = ['bb','accc'];
  show = false
	constructor() {
		//mobx 设置响应式
		makeAutoObservable(this)
	}
  setHeader(newHeader:string) {
    this.header = newHeader
  }
  push(newMessage : string) {
    this.message.push(newMessage);
  }
  setMessage(newMessages:any) {
    this.message = newMessages
  }
	setShow(newShow :boolean) {
    this.show = newShow
  }
}

export default StarMapStore