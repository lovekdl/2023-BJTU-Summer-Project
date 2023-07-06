import {makeAutoObservable} from 'mobx'
import {http, setTokenFromLocalStorage, getTokenFromLocalStorage} from '../utils'

class ProfileStore {
	token = getTokenFromLocalStorage()||''
  avatar:any = '';

	constructor() {
		//mobx 设置响应式
		makeAutoObservable(this)
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
	setAvatar = (avatar: any) => {
		this.avatar = avatar
	}
	setToken = (token:string)=> {
		this.token = token
		setTokenFromLocalStorage(this.token)
	}
}

export default ProfileStore