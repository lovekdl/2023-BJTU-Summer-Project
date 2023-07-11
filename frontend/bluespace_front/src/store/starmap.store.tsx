import {makeAutoObservable} from 'mobx'
import {http, setTokenFromLocalStorage, getTokenFromLocalStorage} from '../utils'

class StarMapStore {
	header = 'aa';
  message = 'bb';
  show = false
	constructor() {
		//mobx 设置响应式
		makeAutoObservable(this)
	}
  setHeader(newHeader:string) {
    this.header = newHeader
  }
  setMessage(newMessage:string) {
    this.message = newMessage
  }
	setShow(newShow :boolean) {
    this.show = newShow
  }
}

export default StarMapStore