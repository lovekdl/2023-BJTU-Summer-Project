

import {makeAutoObservable} from 'mobx'
import {http, setTokenFromLocalStorage, getTokenFromLocalStorage} from '../utils'
import { List } from 'echarts';
import i18n from '../index.tsx';
class StatisticsStore {


	DataSource = [
		{
			key: '1',
			Planet_name: "erth",
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
	  this.getSource()
	}
  setDataSource(data:any) {
    this.DataSource = data;
  }
	getSource =async() => {
      try {
        const ret = await http.post('api/resource',{
          
        })
        if(ret.data.state == 'success') {
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
      }
      catch(e:any) {
        console.log('catch : ',e)
        if(e.response) console.log(e.response.data.error_message)
        else console.log(e.message)
      }
  }
	
}

export default StatisticsStore