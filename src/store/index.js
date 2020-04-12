import Vue  from 'vue'
import Vuex from 'vuex'
import {getRequest} from '../util/api'
import Stomp from 'stompjs'
import SockJS from 'sockjs-client'
import { Notification } from 'element-ui';

Vue.use(Vuex)

const now = new Date();

const store = new Vuex.Store({
    state: {
        routes: [],
        sessions:{},
        hrs: [],
        currentHr: JSON.parse(window.sessionStorage.getItem('user')),
        // currentSessionId:-1,
        currentSession: null,
        filterKey:'',
        stomp: null,
        isdot: {}
    },
    mutations: {
        INIT_CURRENTHR(state,hr) {
            state.currentHr = hr;
        },
        initRoutes(state,data) {
            // console.log("---"+data)
            state.routes = data;
        },
        // changeCurrentSessionId (state,id) {
		// 	state.currentSessionId = id;
        // },
        changeCurrentSession (state,session) {
            Vue.set(state.isdot,state.currentHr.username+'-'+session.username,false);
			state.currentSession = session;
		},
		addMessage (state,msg) {
            let key = state.currentHr.username+'-'+msg.to;
            if(!state.sessions[key]) {
                //这样给session添加属性，vue无法检测到,因为sessions本身为空，其中所有属性以及值都是在此刻添加的，Vue无法检测
                // state.sessions[key] = []; 
                //利用vue.set是属性被vue检测
                Vue.set(state.sessions,key,[]);
            }
            state.sessions[key].push({
                message: msg.message,
                date: now,
                isSelf: msg.isSelf == null?true:false
            })
			// state.sessions[state.currentSessionId-1].messages.push({
			// 	content:msg,
			// 	date: new Date(),
			// 	self:true
			// })
		},
        INIT_DATA (state) {
            let data = localStorage.getItem('chat-sessions');
            if (data) {
                state.sessions = JSON.parse(data);
            }
        },
        INIT_HR (state,data) {
            state.hrs = data;
        },
        INIT_ISDOT(state,data) {
            Vue.set(state.isdot,state.currentHr.username+'-'+data,true);
        }
    },
    actions: {
        connectWS(context) {
            context.state.stomp = Stomp.over(new SockJS('/ws/ep'));
            context.state.stomp.connect({},success=> {
                context.state.stomp.subscribe('/user/queue/chat',msg => {
                    let receiverMsg = JSON.parse(msg.body);
                    if(!context.state.currentSession || context.state.currentSession.username != receiverMsg.from) {
                        Notification.info({
                            title: '有一条【'+receiverMsg.fromNickName+'】发来消息',
                            message: receiverMsg.message.length > 10 ? receiverMsg.message.substring(0,10)+'...':receiverMsg.message,
                            position: 'bottom-right'
                        })
                        context.commit('INIT_ISDOT',receiverMsg.from);
                    }
                    receiverMsg.isSelf = false;
                    receiverMsg.to = receiverMsg.from;
                    context.commit('addMessage',receiverMsg);
                })
            },error=> {
                
            })
        },
        initData (context) {
            context.commit('INIT_DATA');
            getRequest('/chat/hrs').then(resp => {
                if(resp.object) {
                    context.commit('INIT_HR',resp.object);
                }
            })
        }
    }
})

store.watch(function (state) {
    return state.sessions;
  },function (val) {
      console.log("val >>>>>>>>");
      console.log(val);
      localStorage.setItem('chat-sessions', JSON.stringify(val));
  },{
    deep:true/*这个貌似是开启watch监测的判断,官方说明也比较模糊*/
  })
  
  
  export default store;