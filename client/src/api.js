import axios from 'axios';

const storage = {
    TOKEN: 'AutoScorer-Token'
};

var server = "http://localhost:8000";
// var server = "https://fierce-citadel-47273.herokuapp.com";
if (process.env.NODE_ENV === 'production') {
    server =  'https://fierce-citadel-47273.herokuapp.com';
}

console.log("server url:", server, process.env.NODE_ENV);
server = server + "/api"

var headers = {
    // 'Content-Type': 'application/json',
    // "Access-Control-Allow-Origin": "*",
    // 'Access-Control-Allow-Credentials': 'true'
}

var set_token = function(token) {
    token = token || localStorage.getItem(storage.TOKEN);
    headers.Authorization = 'Token ' + token;
}

set_token(null);

axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
axios.defaults.xsrfCookieName = "csrftoken";


export async function loginReq(loginForm) {
    console.log("lolw", loginForm, server)
    try {
        let response = await axios.post(server + "/api-token-auth/", loginForm)
        if (response.status === 200 && response.data.token) {
            console.log(response);
            localStorage.setItem(storage.TOKEN, response.data.token);
            set_token(response.data.token);
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
        let response = await axios.post(server + "/create-user/", registerForm)
        if (response.data.token) {
            console.log("registerReq", response)
            localStorage.setItem(storage.TOKEN, response.data.token);
            set_token(response.data.token);
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

var selectionsToApi = function(selections) {
    let array = [];
    for (const [key, value] of Object.entries(selections)) {
        // console.log(key, value);
        array.push({
            'index': key,
            'score': value
        });
    }
    return array
}

var apiToSelections = function(api_data) {
    let result = {}
    // console.log("what I got", api_data);
    api_data.forEach((elem) => {
        result[elem.index] = elem.score;
    })
    // console.log("apitoSel", result)
    return result;
}

export async function sendQualificationsReq(name, size, selections) {
    let data = {
        'name': name,
        'size': size,
        'rows': selectionsToApi(selections)
    }
    console.log("api", data)
    try {
        let response = await axios.post(server + "/update-create-dataset/", data, {headers: headers})
        if (response.status >= 200 && response.status < 300)
            return true;
        console.log("send qualification failed? ", response.status)
        return false;
    } catch (e) {
        console.log("error", e);
        return false;
    }
}

export async function getQualifications(name) {
    try {
        let response = await axios.get(server + '/ds/' + name, {headers: headers})
        if (response.status >= 200 && response.status < 300) {
            // console.log(response.data)
            return apiToSelections(response.data.rows);
        }
        return false;
    } catch (e) {
        console.log("error", e);
        return false;
    }
}

export async function listQualifications() {
    try {
        let response = await axios.get(server + '/dataset_list/', {headers: headers})
        if (response.status >= 200 && response.status < 300) {
            // console.log(response.data)
            return response.data;
        }
        return false;
    } catch (e) {
        console.log("error", e);
        return false;
    }
}

