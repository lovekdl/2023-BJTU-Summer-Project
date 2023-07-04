/*
	存储模块
	用于数据管理和响应式更新
*/
import LoginStore from "./login.store"
import React from "react"
class RootStore {
	constructor() {
		this.loginStore = new LoginStore()
	}
}

const rootStore = new RootStore()
const context = React.createContext(rootStore)
const useStore = () => React.useContext(context)

export {useStore}