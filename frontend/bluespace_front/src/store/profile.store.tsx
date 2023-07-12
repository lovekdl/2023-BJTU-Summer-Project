import {makeAutoObservable} from 'mobx'
import {http, setTokenFromLocalStorage, getTokenFromLocalStorage} from '../utils'

class ProfileStore {
	token = getTokenFromLocalStorage()||''
  avatar:any = '';

	likesDataSource = [
		{
			key: '1',
			Planet_name: 'earth',
			Semi_major_axis	: 20,
			Mass: 100,
			Radius : 100,
			Stellar_luminosity:50,
			Stellar_mass:50,
			Stellar_radius:60,
		},
		{
			key: '2',
			Planet_name: 'earth',
			Semi_major_axis	: 20,
			Mass: 100,
			Radius : 100,
			Stellar_luminosity:50,
			Stellar_mass:50,
			Stellar_radius:60,
		},
		{
			key: '3',
			Planet_name: 'earth',
			Semi_major_axis	: 20,
			Mass: 100,
			Radius : 100,
			Stellar_luminosity:50,
			Stellar_mass:50,
			Stellar_radius:60,
		},
		{
			key: '4',
			Planet_name: 'earth',
			Semi_major_axis	: 20,
			Mass: 100,
			Radius : 100,
			Stellar_luminosity:50,
			Stellar_mass:50,
			Stellar_radius:60,
		},
		{
			key: '5',
			Planet_name: 'earth',
			Semi_major_axis	: 20,
			Mass: 100,
			Radius : 100,
			Stellar_luminosity:50,
			Stellar_mass:50,
			Stellar_radius:60,
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
		this.getAvatar();
	}
	
	setAvatar = (avatar: any) => {
		this.avatar = avatar
	}
	
	setToken = (token:string)=> {
		this.token = token
		setTokenFromLocalStorage(this.token)
	}

	getAvatar = async() => {
		const ret = await http.post('/api/getAvatar', {
			
		})
		this.setAvatar(ret.data.avatar)
	}
}

export default ProfileStore