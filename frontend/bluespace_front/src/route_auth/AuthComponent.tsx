import { getTokenFromLocalStorage } from "../utils";
import { Navigate } from "react-router";
//权限导航
function AuthComponent({children} : any) {
	const isToken = getTokenFromLocalStorage()
	if(isToken) {
		console.log('cookie is ' + getTokenFromLocalStorage())
		return <>{children}</>
	}
	return <Navigate to = '/login' replace></Navigate>
}

export {AuthComponent}