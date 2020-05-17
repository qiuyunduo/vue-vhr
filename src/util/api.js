import axios from 'axios';
import { Message } from 'element-ui';
import router from '../router'

axios.interceptors.response.use(success => {
    // console.log(success);
    if(success.status && success.status == 200 && success.data.status == 500) {
        //这是我的业务错误
        Message.error({message: success.data.msg, showClose:true});
        return;
    }

    if(success.data.msg) {
        Message.success({message: success.data.msg});
    }
    //登录成功消息提示可写可不写，不写合适点

    return success.data;
},error => {
    if(error.response.status == 504 || error.response.status == 404) {
        Message.error({message: "服务器被吃了o(╯□╰)o"});
    } else if(error.response.status == 403) {
        Message.error({message: "权限不足，请联系管理员"})
    } else if(error.response.status == 401) {
        Message.error({message: "尚未登录，请登录"});
        router.replace('/');
    } else {
        if(error.response.data.msg) {
            Message.error({message: error.response.data.msg});
        } else {
            Message.error({message: "未知错误"});
        }
    }

    return;
})

const base = '/api'; //生产环境，在nginx配置中要用到

// const base = '';  //开发环境

export const postKeyValueRequest = (url,params) => {
    return axios({
        method: 'post',
        url: `${base}${url}`, // `符号 是1旁边的符号不是单引号
        data: params,
        transformRequest: [function(data){
            let newParam = '';
            for (let i in data) {
                newParam += encodeURIComponent(i)+"="+encodeURIComponent(data[i])+"&"
            }
            // console.log(newParam);
            return newParam;
        }],
        headers: {
            'Content-Type':'application/x-www-form-urlencoded'
        }

    });
}

export const postRequest = (url,params) => {
    return axios({
        method: 'post',
        url: `${base}${url}`, 
        data: params
    })
}

export const getRequest = (url,params) => {
    return axios({
        method: 'get',
        url: `${base}${url}`, 
        data: params
    })
}

export const putRequest = (url,params) => {
    return axios({
        method: 'put',
        url: `${base}${url}`, 
        data: params
    })
}

export const deleteRequest = (url,params) => {
    return axios({
        method: 'delete',
        url: `${base}${url}`, 
        data: params
    })
}