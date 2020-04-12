<template>
 <div v-loading="loading">
    <div style="margin-top: 10px;display:flex;justify-content:center">
      <el-input v-model="keywords" placeholder="通过用户名搜索..." prefix-icon="el-icon-search" style="width: 400px;margin-right:10px" @keydown.enter.native="searchHrs"></el-input>
      <el-button icon="el-icon-search" type="primary" @click="searchHrs">搜索</el-button>
    </div>
    <div class="hrContain">
      <el-card class="box-card" v-for="(hr,index) in hrs" :key="index"> 
        <div slot="header" class="clearfix">
          <span>{{hr.name}}</span>
          <el-button style="float: right; padding: 3px 0;color:red" type="text" icon="el-icon-delete" @click="deleteHr(hr.id)"></el-button>
        </div>
        <div>
          <div class="img-contain">
            <img src="../../assets/myLogo.jpg" :alt="hr.name" :title="hr.name" class="userface-img">
          </div>
        </div>
        <div class="userinfo">
          <div>用户名：{{hr.name}}</div>
          <div>手机号码{{hr.phone}}</div>
          <div>电话号码：{{hr.telephone}}</div>
          <div>地址：{{hr.address}}</div>
          <div>用户状态：<el-switch
                        @change="updateHrStatus(hr)"
                        v-model="hr.enabled"
                        active-color="#13ce66"
                        inactive-color="#ff4949"
                        active-text="启用"
                        inactive-text="禁用">
                      </el-switch>
          </div>
          <div>用户名：{{hr.username}}</div>
          <div>用户角色：<el-tag style="margin-left:4px" type="success" v-for="(hrole,hrindex) in hr.roles" :key="hrindex">{{hrole.nameZh}}</el-tag>
                        <el-popover
                          @show="showRoles(hr)"
                          @hide="doUpdateHrRoles(hr)"
                          placement="right"
                          title="角色列表"
                          width="200"
                          trigger="click">
                          <el-select v-model="hrRoles" multiple placeholder="请选择">
                            <el-option
                              v-for="(role,rindex) in computedRoles"
                              :key="rindex"
                              :label="role.nameZh"
                              :value="role.id">
                            </el-option>
                          </el-select>
                          <el-button slot="reference" icon="el-icon-more" type="text" style="color:#409eff"></el-button>
                        </el-popover>
                        
          </div>
          <div>备注{{hr.remark}}</div>
        </div>
      </el-card>
    </div>
 </div>
</template>

<script>
 export default {
   name: 'SysHr',
   data () {
     return {
       keywords: '',
       hrs: [],
       hrRoles: [],
       roles: [],
       loading: false
     }
   },
   computed: {
     computedRoles() {
       return this.roles;
     }
   },
   mounted: function() {
     this.initHrs();
     this.initRoles();
   },
   methods: {
     initHrs() {
       this.loading = true;
       this.getRequest('/system/hr/?keyword='+this.keywords).then(resp => {
         this.loading = false;
         if(resp.object) {
          //  console.log(resp);
           this.hrs = resp.object;
         }
       })
     },
     initRoles() {
       this.getRequest('/system/hr/role/').then(resp => {
         if(resp.object) {
          //  console.log(resp.object);
           this.roles = resp.object;
         }
       })
     },
     searchHrs() {
       this.initHrs();
     },
     showRoles(hr) {
       this.hrRoles = [];
       hr.roles.forEach(role => {
         this.hrRoles.push(role.id);
       });
      },
      updateHrStatus(hr) {
        let updateHr = {};
        Object.assign(updateHr,hr);
        delete updateHr.roles;
        // delete hr.roles;
        this.putRequest('/system/hr/',updateHr).then(resp => {
          this.initHrs();
        })
      },
      checkHrRolesIsChange(hr) {
        let roles = [];
        Object.assign(roles,hr.roles);
        let flag = false;
        if(this.hrRoles.length != roles.length) {
          flag = true;
        } else {
          for(let i = 0; i < roles.length; i++) {
            let role = roles[i];
            for(let j = 0; j < this.hrRoles.length; j++) {
              if(role.id == this.hrRoles[j]) {
                roles.splice(i,1);
                i--;
                break;
              }
            }
          }
          if(roles.length > 0) {
            flag = true;
          }
        }
        return flag;
      },
      doUpdateHrRoles(hr) {
        if(this.checkHrRolesIsChange(hr)) {
          let rids = '';
          this.hrRoles.forEach(id => {
            rids += '&rids=' + id;
          });
          this.putRequest('/system/hr/role?hid='+hr.id+rids).then(resp => {
            this.initHrs();
          })
        }
      },
      deleteHr(id) {
        this.$confirm('此操作将永久删除该hr, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.deleteRequest('/system/hr/'+id).then(resp => {
            this.initHrs();
          })
        }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            });  
        });
      }
   }
 }
</script>

<style scoped>
.img-contain {
  width: 100%;
  display: flex;
  justify-content: center;
}
.userinfo {
  margin-top: 20px;
}
.userinfo div {
  font-size: 12px;
  color: #409eff;
}
.hrContain {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
} 
.box-card {
  margin-top: 20px;
  width: 350px;
}
.userface-img {
  width: 70px;
  height: 70px;
  border-radius: 35px;
}
</style>
