import axios from 'axios';

const storage = {
    TOKEN: 'AutoScorer-Token'
};

var server = 'https://fierce-citadel-47273.herokuapp.com'|| "http://localhost:8000";
console.log("server url:", server, process.env.NODE_ENV, process.env.MY_API_URL);
server = server + "/api"

const headers = {
    // 'Content-Type': 'application/json',
    // "Access-Control-Allow-Origin": "*",
    // 'Access-Control-Allow-Credentials': 'true'
}

axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
axios.defaults.xsrfCookieName = "csrftoken";


export async function loginReq(loginForm) {
    console.log("lolw", loginForm, server)
    try {
        let response = await axios.post(server + "/api-token-auth/", loginForm, { headers: headers})
        if (response.status === 200 && response.data.token) {
            console.log(response);
            localStorage.setItem(storage.TOKEN, response.data.token);
            return true;
        }
        console.log("Response not ok", response)
        return false;
    } catch (err) {
        console.log("error", err);
        return false;
    }
}

export async function registerReq(registerForm) {
    try {
        let response = await axios.post(server + "/create-user/", registerForm, { headers: headers})
        if (response.data.token) {
            console.log("registerReq", response)
            localStorage.setItem(storage.TOKEN, response.data.token);
            return true;
        } else if (response.data.Error) {
            return response.data.Error;
        }
        console.log("Response not ok", response)
        return false;
    } catch (err) {
        console.log("error", err);
        return false;
    }
}
