

import {makeAutoObservable} from 'mobx'
import {http, setTokenFromLocalStorage, getTokenFromLocalStorage} from '../utils'
import { List } from 'echarts';
import i18n from '../index.tsx';
class PredictionStore {
	showEsi = 1
	showData = [1.0,1.0,1.0,0.0,1.0,1.0]
	constructor() {
		//mobx 设置响应式
		makeAutoObservable(this)
		
	}
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
			following:false,
			
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
			following:false,
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
			following:false,
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
			following:false,
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
			following:false,
		},
		
	];
	
	
	
  items: any[] = [];

  starMapLoading:boolean = true
	setShowEsi = (x :any) =>{
		this.showEsi = x;
	}
	setShowData = (x :any) => {
		this.showData = x;
	}
	setStarMapLoading = (x : boolean) => {
    this.starMapLoading = x
  }
  addItem = (newItem : any)=> {
    this.items.push(newItem);
  }
  setItems = (newItems : any)=> {
    this.items = newItems
  }
	
	

	
}

export default PredictionStore