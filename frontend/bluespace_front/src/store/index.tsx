/*
	存储模块
	用于数据管理和响应式更新
*/
import LoginStore from "./login.store"
import ProfileStore from "./profile.store"
import LoadingStore from "./loading.store"
import React from "react"
class RootStore {
  loginStore: LoginStore 
	ProfileStore: ProfileStore
	LoadingStore : LoadingStore
	constructor() {
		this.loginStore = new LoginStore()
		this.ProfileStore = new ProfileStore()
		this.LoadingStore = new LoadingStore()
	}
}

const rootStore = new RootStore()
const context = React.createContext(rootStore)
const useStore = () => React.useContext(context)

export {useStore}