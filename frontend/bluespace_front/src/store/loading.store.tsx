import {makeAutoObservable} from 'mobx'
import {http, setTokenFromLocalStorage, getTokenFromLocalStorage} from '../utils'

class LoadingStore {
	
  starMapLoading:boolean = true

	constructor() {
		//mobx 设置响应式
		makeAutoObservable(this)
	}
	setStarMapLoading = (x : boolean) => {
    this.starMapLoading = x
  }
	
}

export default LoadingStore