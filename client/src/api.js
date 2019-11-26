import axios from 'axios';

var server = 'http://localhost:8044';


export async function loginReq (loginForm){
    console.log("lolw",loginForm.username)
    // localStorage.setItem("usernameA", loginForm.username);
    let response = await axios.post(server+"/login", loginForm);
    console.log("loginReq", response);

    if(response.status === 200 && response.data.jwt && response.data.expireAt){
        let jwt = response.data.jwt;
        let expire_at = response.data.expireAt;

        localStorage.setItem("access_token", jwt);
        localStorage.setItem("expire_at", expire_at);
        return true
    }
    return false
}

export async function registerReq (registerForm){
    let response = await axios.post(server+"/register", registerForm);
    console.log("registerReq", response)
    return false
}
