import {makeAutoObservable} from 'mobx'
import {http, setTokenFromLocalStorage, getTokenFromLocalStorage} from '../utils'

class ProfileStore {
	token = getTokenFromLocalStorage()||''
  avatar:any = '';

	likesDataSource = [
		{
			key: '1',
			name: 'drj',
			age: 20,
			address: 'BJTU',
		},
		{
			key: '2',
			name: 'guuu',
			age: 10000,
			address: '北京交通大学',
		},
	];
	
	likesColumns = [
		{
			title: 'Planet name',
			dataIndex: 'Planet_name',
			key: 'Planet_name',
		},
		{
			title: 'Orbit Semi-Major Axis',
			dataIndex: 'Semi_major_axis',
			key: 'Semi_major_axis',
		},
		{
			title: 'Planet Mass',
			dataIndex: 'Mass',
			key: 'Mass',
		},
		{
			title: 'Planet Radius',
			dataIndex: 'Radius',
			key: 'Radius',
		},
		{
			title: 'Stellar Luminosity',
			dataIndex: 'Stellar_luminosity',
			key: 'Stellar_luminosity',
		},
		{
			title: 'Stellar Mass',
			dataIndex: 'Stellar_mass',
			key: 'Stellar_mass',
		},
		{
			title: 'Stellar Radius',
			dataIndex: 'Stellar_radius',
			key: 'Stellar_radius',
		},
	];

	constructor() {
		//mobx 设置响应式
		makeAutoObservable(this)
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