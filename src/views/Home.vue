<template>
    <div>
        <el-container>
            <el-header class="homeHeader">
                <div class="title">微人事</div>
                <div>
                    <el-button type="text" icon="el-icon-bell" style="margin-right:20px;color:#000000;" @click="goChat"></el-button>
                    <el-dropdown class="userInfo" @command="commandHandler">
                        <span class="el-dropdown-link">
                            {{user.username}}<i><img :src="user.userface" alt=""></i>
                        </span>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item command="userInfo">个人中心</el-dropdown-item>
                            <el-dropdown-item command="setting">设置</el-dropdown-item>
                            <el-dropdown-item command="logout" divided>注销登录</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </div>
            </el-header>
            <el-container>
                <el-aside width="200px">
                    <el-menu router unique-opened>
                        <el-submenu :index="index+''" v-for="(item,index) in routes" :key="index" >
                            <template slot="title"  v-if="!item.hidden">
                                <i style="color: #409eff;margin-right:5px" :class="item.iconCls"></i>
                                <span>{{item.name}}</span>
                            </template>
                            <el-menu-item-group  v-if="!item.hidden">
                                <el-menu-item :index="child.path" v-for="(child,i) in item.children" :key="i">{{child.name}}</el-menu-item>
                            </el-menu-item-group>
                        </el-submenu>
                    </el-menu>
                </el-aside>
                <el-main>
                    <el-breadcrumb separator-class="el-icon-arrow-right" v-if="this.$router.currentRoute.path != '/home'">
                        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
                        <el-breadcrumb-item>{{this.$router.currentRoute.name}}</el-breadcrumb-item>
                    </el-breadcrumb>
                    <div class="welcomeHome" v-if="this.$router.currentRoute.path == '/home'">
                        欢迎来到微人事！
                    </div>
                    <router-view class="viewContent"/>
                </el-main>
            </el-container>
        </el-container>
    </div>
</template>

<script>
export default {
    name: 'Home',
    computed: {
        user: function() {
            return JSON.parse(window.sessionStorage.getItem('user'));
        },
        routes() {
            return this.$store.state.routes;
        }
    },
    data() {
        return {
            
        }
    },
    mounted: function() {
        this.$store.dispatch('connectWS');
    },
    methods: {
        goChat() {
            this.$router.push('/chat');
        },
        commandHandler(cmd) {
            if(cmd == 'logout') {
                this.$confirm('你将注销登录, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.getRequest('/logout');
                    window.sessionStorage.removeItem('user');
                    this.$store.commit('initRoutes',[])
                    this.$router.replace('/');
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消注销'
                    });          
                });
            }
        }
    },  
}
</script>

<style>
.homeHeader {
    background-color: #409eff;
    display: flex;
    align-items: center;
    justify-content: space-between;;
    padding: 0px 15px;
    box-sizing: border-box;
}   
.homeHeader .title {
    font-size: 30px;
    font-family: "华文行楷";
    color: #fff; 
}
.homeHeader .userInfo {
    cursor: pointer;
}
.el-dropdown-link img {
    width: 48px;
    height: 48px;
    border-radius: 24px;
    margin-left: 8px;
}
.el-dropdown-link {
    display: flex;
    align-items: center;
}
.welcomeHome {
    text-align: center;
    font-size: 30px;
    font-family: Arial, Helvetica, sans-serif;
    color: #409eff;
    padding-top: 50px;
}
.viewContent {
    margin-top: 15px;
}
</style>