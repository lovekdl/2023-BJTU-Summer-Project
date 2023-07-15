import {makeAutoObservable} from 'mobx'
import {http, setTokenFromLocalStorage, getTokenFromLocalStorage} from '../utils'
class LoginStore {
	token = getTokenFromLocalStorage()||''
	waiting:number = -1;
	interval:any = 0
	constructor() {
		
		//mobx 设置响应式
		makeAutoObservable(this)
		this.interval = setInterval(() => {
			this.waiting -= 1;
		},1000)
	}
	getTokenByLogin = async ({ username, password }: { username: string; password: string }) => {
		//调用登录接口
		console.log('password is ' + password)
		const ret = await http.post('api/login',{
			username : username,
			password : password,
		})
		console.log('hahahaha')
		console.log(ret)
		this.setToken(ret.data.token)
			
	}
	
	getTokenByRegister = async ({username, password} : { username: string; password: string }) => {
		//调用注册接口
		const ret = await http.post('/api/register', {
			username,
			password
		})
		this.setToken(ret.data.token)
	}
	setToken = (token:string)=> {
		this.token = token
		setTokenFromLocalStorage(this.token)
	}

	setWaiting = (x : number) => {
		this.waiting = x
	}
	resetWaiting = () => {
		clearInterval(this.interval);
		this.setWaiting(60);
		this.interval = setInterval(() => {
			this.waiting -= 1;
		},1000)
	}
}

export default LoginStore