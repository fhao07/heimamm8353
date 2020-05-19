let KEY = 'heima_Token'
let setToken = token => {
    localStorage.setItem(KEY, token)
}
let getToken = () => {
    return localStorage.getItem(KEY)
}
let removeToken = () => {
    localStorage.removeItem(KEY)
}
//按需导出 ，，导出对象
export { setToken, getToken, removeToken }