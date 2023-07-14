import {makeAutoObservable} from 'mobx'
import {http, setTokenFromLocalStorage, getTokenFromLocalStorage} from '../utils'

class ProfileStore {
	token = getTokenFromLocalStorage()||''
  avatar:any = '';
	username:any = '';
	email : any = '';
	DataSource = [
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
	

	constructor() {
		//mobx 设置响应式
		makeAutoObservable(this)
		this.getProfile();
		this.getAvatar();
		this.getSource();
	}
	
	setAvatar = (avatar: any) => {
		this.avatar = avatar
	}
	
	setToken = (token:string)=> {
		this.token = token
		setTokenFromLocalStorage(this.token)
	}
	setUsername = (username:any) => {
		this.username=username
	}
	setEmail = (email:any) => {
		this.email=email
	}


	getAvatar = async() => {
		const ret = await http.post('/api/getAvatar', {
			
		})
		this.setAvatar(ret.data.avatar)
	}
	getProfile = async() => {
		try{
			const ret = await http.post('/api/getProfile', {
				
			})
			this.setEmail(ret.data.email)
			this.setUsername(ret.data.username)
		}
		catch (e:any) {
			console.log(e);
		}
	}

	setDataSource(data:any) {
    this.DataSource = data;
  }
	getSource =async() => {
      try {
        const ret = await http.post('api/view/save',{
          
        })
          const newData = [];
          console.log(ret.data)
          for (let key in ret.data) {
            if (typeof ret.data[key] === 'object' && ret.data[key] !== null) {
              const item = ret.data[key];
              item.key = item.UID
              newData.push(item);
              console.log(item);
            }
          }
          this.setDataSource(newData);

      }
      catch(e:any) {
        console.log('catch : ',e)
        if(e.response) console.log(e.response.data.error_message)
        else console.log(e.message)
      }
  }
}

export default ProfileStore