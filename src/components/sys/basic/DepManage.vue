<template>
 <div v-loading="loading">
     <div>
       <el-input size="small" placeholder="输入部门名称搜索部门" class="depAddInput" v-model="filterText"></el-input>
     </div>
     <div class="depContent">
       <el-tree :data="deps"
                :props="depProps" 
                ref="tree"
                :expand-on-click-node="false"
                :filter-node-method="filterNode">
        <span class="custom-tree-node" slot-scope="{ node,data }">
          <span>{{ node.label }}</span>
          <span>
            <el-button
              type="primary"
              size="mini" @click="showAddDialog(data)"
              style="padding:3px">
              添加部门
            </el-button>
            <el-button
              type="danger"
              size="mini" @click="deleteDep(data)"
              style="padding:3px">
              删除部门
            </el-button>
          </span>
        </span>
       </el-tree>
      </div>
      <el-dialog
        title="添加部门"
        :visible.sync="dialogVisible"
        width="30%">
        <table>
          <tr>
            <td><el-tag>上级部门</el-tag></td>
            <td>{{pDepName}}</td>
          </tr>
          <tr>
            <td><el-tag>部门名称</el-tag></td>
            <td><el-input placeholder="新部门名称" size="small" v-model="dep.name"></el-input></el-tag></td>
          </tr>
        </table>
        <span slot="footer" class="dialog-footer">
          <el-button @click="cancalAdd">取 消</el-button>
          <el-button type="primary" @click="doAdd">确 定</el-button>
        </span>
      </el-dialog>
 </div>
</template>

<script>
import {getRequest,postRequest,deleteRequest} from '../../../util/api'
  export default {
   name: 'DepManage',
   data () {
     return {
      deps: [],
      dep: {
        name: '',
        parentId: 0
      },
      pDepName: '',
      depProps: {
        children: 'children',
        label: 'name'
      },
      dialogVisible: false,
      filterText: '',
      loading: false
     }
   },
   mounted: function() {
     this.initDeps();
   },
   watch: {
      filterText(val) {
        this.$refs.tree.filter(val);
      }
    },
   methods: {
     initDep() {
        this.dep = {
          name: '',
          parentId: 0 
        }
        this.pDepName = '';
     },
     filterNode(value, data) {
        if (!value) return true;
        return data.name.indexOf(value) !== -1;
      },
     initDeps() {
       this.loading = true;
       getRequest('/system/basic/dep/').then(resp => {
         this.loading = false;
         if(resp.object) {
           this.deps = resp.object;
         }
       })
     },
     showAddDialog(data) {
       this.dialogVisible = true;
       this.dep.parentId = data.id;
       this.pDepName = data.name;
     },
     cancalAdd() {
        this.initDep();
        this.dialogVisible = false;
     },
     addDepTODeps(deps,dep) {
        deps.forEach(item => {
          if(item.id == dep.parentId) {
           item.children = item.children.concat(dep);
           item.isParent = true;
           return;
          } else {
            this.addDepTODeps(item.children,dep);
          }
        })
     },
     doAdd() {
       if(this.dep.name) {
         postRequest('/system/basic/dep/',this.dep).then(resp => {
           if(resp.object) {
             this.addDepTODeps(this.deps,resp.object);
           }
           this.initDep();
           this.dialogVisible = false;
         })
       } else {
         this.$message.error({message: '请输入部门名称'});
       }
     },
     removeDepFromDeps(deps,dep) {
       for(let i = 0; i < deps.length; i++) {
         let item = deps[i];
         if(item.id == dep.id) {
           deps.splice(i,1); //从deps中删除从i开始的前一个元素
           return;
         } else {
           this.removeDepFromDeps(item.children,dep);
         }
         if(item.children.length == 0) {
           item.isParent = false;
         }
       }
     },
     deleteDep(data) {
       console.log(data);
       if(data.isParent) {
         this.$message.error("该部门下有子部门,无法删除");
         return;
       }
       this.$confirm('此操作将永久删除【'+data.name+'】部门, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
            deleteRequest('/system/basic/dep/'+data.id).then(resp => {
              if(resp.object) {
                this.removeDepFromDeps(this.deps,resp.object);
              }
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
.custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }
.depAddInput {
  width: 450px;
}
.depContent {
  margin-top: 10px;
  width: 450px;
}
</style>
