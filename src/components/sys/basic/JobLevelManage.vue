<template>
 <div v-loading="loading">
   <div>
      <el-input v-model="jobLevel.name" placeholder="添加职称" prefix-icon="el-icon-plus" size="small" class="addInput"></el-input>
      <el-select v-model="jobLevel.titleLevel" placeholder="请选择" size="small" class="addSelect">
        <el-option
          v-for="item in titleLevels"
          :key="item"
          :label="item"
          :value="item">
        </el-option>
      </el-select>
      <el-button size="small" type="primary" style="margin-left:10px" @click="addJobLevel"><i class="el-icon-plus"></i>添加</el-button>
    </div>
     <div class="content">
      <el-table
          :data="jobLevels"
          border
          style="width: 100%"
          @selection-change="handleSelectionChange">
          <el-table-column
            type="selection"
            width="40">
          </el-table-column>
          <el-table-column
            prop="id"
            label="编号"
            width="60">
          </el-table-column>
          <el-table-column
            prop="name"
            label="职位名称"
            width="140">
          </el-table-column>
          <el-table-column
            prop="titleLevel"
            label="职位名称"
            width="140">
          </el-table-column>
          <el-table-column
            prop="createDate"
            width="200"
            label="创建日期">
            <template slot-scope="scope">
              {{scope.row.createDate}}
            </template>
          </el-table-column>
          <el-table-column
            prop="enabled"
            width="100"
            label="状态">
            <template slot-scope="scope">
              <el-tag
                :type="scope.row.enabled ? 'primary' : 'danger'"
                disable-transitions>{{scope.row.enabled ? '启用' : '禁用'}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                size="small"
                @click="showDialog(scope.$index, scope.row)">编辑</el-button>
              <el-button
                size="small"
                type="danger"
                @click="handleDelete(scope.$index, scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-button type="danger" @click="batchDelete" :disabled="multipleSelection.length == 0">批量删除</el-button>
        <el-dialog
          title="编辑职称"
          :visible.sync="dialogVisible"
          width="30%">
          <div class="updateLine">
            <el-tag>职称名称</el-tag>
            <el-input v-model="updateJobLevel.name" placeholder="请输入职称名称" size="small" class="updateItem"></el-input>
          </div>
          <div class="updateLine">
            <el-tag>职称级别 </el-tag>
            <el-select v-model="updateJobLevel.titleLevel" placeholder="请选择" size="small" class="updateItem">
              <el-option
                v-for="item in titleLevels"
                :key="item"
                :label="item"
                :value="item">
              </el-option>
            </el-select>
          </div>
          <div class="updateLine">
            <el-tag>职称状态</el-tag>
            <el-switch class="updateItem"
              v-model="updateJobLevel.enabled"
              active-text="启用"
              inactive-text="禁用">
            </el-switch>
          </div>
          <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false" size="small">取 消</el-button>
            <el-button type="primary" @click="doUpdate" size="small">确 定</el-button>
          </span>
        </el-dialog>
    </div>
 </div>
</template>

<script>
import { getRequest,postRequest,putRequest,deleteRequest } from '../../../util/api'
 export default {
   name: 'JobLevelManage',
   data () {
     return {
       jobLevels: [],
       jobLevel: {
         name: '',
         titleLevel: '',
         enabled: true
       },
       updateJobLevel: {
         name: '',
         titleLevel: '',
         enabled: true
       },
       multipleSelection: [],
       dialogVisible: false,
       loading: false,
       titleLevels: [
         "正高级",
         "副高级",
         "中级",
         "初级",
         "员级",
       ]
     }
   },
   components: {

   },
   mounted: function () {
     this.initJobLevels();
   },
   methods: {
     initJobLevels() {
       this.loading = true;
       getRequest('/system/basic/joblevel/').then(resp => {
         this.loading = false;
         if(resp.object) {
           this.jobLevels = resp.object;
         }
       })
     },
     addJobLevel() {
       if(this.jobLevel.name && this.jobLevel.titleLevel) {
         this.loading = true;
         postRequest('/system/basic/joblevel/',this.jobLevel).then(resp => {
           this.loading = false;
           this.initJobLevels();
           this.jobLevel = {
             name: '',
             titleLevel: ''
           }
         })
       } else {
         this.$message.error({message:'添加字段不能为空'})
       }
     },
     showDialog(index,data) {
      Object.assign(this.updateJobLevel,data)
      this.dialogVisible = true;   
     },
     doUpdate() {
       putRequest('/system/basic/joblevel/',this.updateJobLevel).then(resp => {
         this.dialogVisible = false;
         this.initJobLevels();
       })
     },
     handleDelete(index,data) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
      }).then(() => {
          deleteRequest('/system/basic/joblevel/'+data.id).then(resp => {
            this.initJobLevels();
          })
      }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });  
      });   
     },
     handleSelectionChange(val) {
       this.multipleSelection = val;
      //  console.log(this.multipleSelection)
     },
     batchDelete() {
       this.$confirm('此操作将永久删除【'+this.multipleSelection.length+'】条记录, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
      }).then(() => {
          let ids = '?';
          this.multipleSelection.forEach(item => {
            ids += 'ids=' + item.id + '&';
          })
          deleteRequest('/system/basic/joblevel/batch'+ids).then(resp => {
            this.initJobLevels();
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
.content {
  margin-top: 10px;
  width: 900px;
}
.addInput {
  width: 200px;
}

.addSelect {
  margin-left: 10px;
}
.updateLine {
  margin-top: 10px;
}
.updateItem{
  width: 200px;
  margin-left: 10px;

}
</style>
