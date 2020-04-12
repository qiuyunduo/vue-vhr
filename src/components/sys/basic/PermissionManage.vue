<template>
 <div v-loading="loading">
    <div class="permissionTop">
      <el-input placeholder="请输入角色英文名" v-model="role.name" size="small" class="addInput">
        <template slot="prepend">ROLE_</template>
      </el-input>
      <el-input placeholder="请输入角色中文名" v-model="role.nameZh" size="small" class="addInput" @keydown.enter.native="addRole">
      </el-input>
      <el-button type="primary" @click="addRole" size="small"><i class="el-icon-plus"></i>添加角色</el-button>
    </div>
    <div class="permissionContent">
      <el-collapse accordion v-model="activeNames" @change="change" v-loading="loading">
        <el-collapse-item :title="role.nameZh" :name="role.id" v-for="(role,index) in roles" :key="index">
          <div>
            <el-card class="box-card">
              <div slot="header" class="clearfix">
                <span>可访问的资源</span>
                <el-button style="float: right; padding: 3px 0;color: red" icon="el-icon-delete" type="text" @click="deleteRole(role.id)"></el-button>
              </div>
                <el-tree
                  :data="treeMenu"
                  :props="menuProps"
                  node-key="id"
                  :key="index"
                  ref="tree"
                  :default-checked-keys="defaultSelectedMenus"
                  show-checkbox>
                </el-tree>
                <div style="display:flex;justify-content:flex-end">
                  <el-button @click="canalUpdate" size="small">取消修改</el-button>
                  <el-button type="primary" @click="doUpdate(role.id,index)" size="small">确认修改</el-button>
                </div>
            </el-card>
          </div>
          <div>

          </div>
        </el-collapse-item>
      </el-collapse>
    </div>
 </div>
</template>

<script>
import { getRequest,postRequest,deleteRequest, putRequest} from '../../../util/api'
 export default {
   name: 'PermissionManage',
   data () {
     return {
       role: {
         name: '',
         nameZh: ''
       },
       roles: [],
       treeMenu: [],
       defaultSelectedMenus: [],
       loading: false,
       menuProps: {
          children: 'children',
          label: 'name'
       },
       activeNames: -1
     }
   },
   mounted: function() {
     this.initRoles();
   },
   methods: {
     addRole() {
       if(this.role.name && this.role.nameZh){
        this.loading = true;
        postRequest('/system/basic/permission/',this.role).then(resp => {
          this.loading = false;
          this.role = {
            name: '',
            nameZh: ''
          }
          this.initRoles();
        })
       } else {
         this.$message.error({message:'添加字段不能为空'});
       }
     },
     deleteRole(rid) {
       this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
            deleteRequest('/system/basic/permission/'+rid).then(resp => {
              this.initRoles();
            })
        }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            });  
        });   
     },
     change(rid) {
       this.defaultSelectedMenus = [];
       if(rid) {
          this.initTreeMenu();
          this.getMenusByRid(rid);
       }
     },
     getMenusByRid(rid) {
       getRequest('/system/basic/permission/'+rid).then(resp => {
         if(resp.object) {
           this.defaultSelectedMenus = resp.object;
         }
       })
     },
     initRoles() {
       getRequest('/system/basic/permission/').then(resp => {
         if(resp.object) {
           this.roles = resp.object
         }
       })
     },
     initTreeMenu() {
       this.loading = true;
       getRequest('/system/basic/permission/menus').then(resp => {
         this.loading = false;
         if(resp.object) {
           this.treeMenu = resp.object;
         }
       })
     },
    canalUpdate() {
      this.activeNames = -1;
    },
    doUpdate(rid,index) {
      let selectedMenus = this.$refs.tree[index].getCheckedKeys(true); //getCheckedKeys方法接受参数true表明只返回叶子节点，默认false
      let mids = '';
      selectedMenus.forEach(mid => {
        mids += '&mids=' + mid;
      })
      putRequest('/system/basic/permission/?rid='+rid+mids).then(resp => {
        this.activeNames = -1;
      })
    }
   }
 }
</script>

<style scoped>
.permissionTop {
  display: flex;
}
.addInput {
  width: 300px;
  margin-right: 10px;
}
.permissionContent {
  margin-top: 10px;
  width: 700px;
}
</style>
