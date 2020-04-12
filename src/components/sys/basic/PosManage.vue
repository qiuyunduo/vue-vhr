<template>
 <div v-loading="loading">
     <div class="contentTop">
       <el-input
       size="middle"
        placeholder="添加职位..."
        prefix-icon="el-icon-plus"
        v-model="pos.name">
      </el-input>
      <el-button type="primary" style="margin-left:10px" @click="addPos"><i class="el-icon-plus"></i> 添加</el-button>
     </div>
     <div class="content">
      <el-table
          :data="positions"
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
            prop="createDate"
            width="200"
            label="创建日期">
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
          title="编辑职位"
          :visible.sync="dialogVisible"
          width="30%">
          <div class="updateLine">
            <el-tag>名称</el-tag>
            <el-input v-model="updatePos.name" placeholder="请输入职位名称" size="small" class="updateItem"></el-input>
          </div>
          <div class="updateLine">
            <el-tag>状态</el-tag>
            <el-select v-model="updatePos.enabled" placeholder="请选择" size="small" class="updateItem">
              <el-option
                v-for="item in statusMaps"
                :key="item.value"
                :label="item.lable"
                :value="item.value">
              </el-option>
            </el-select>
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
   name: 'PosManage',
   data () {
     return {
       pos: {
         name: ''
       },
       updatePos: {
         name: '',
         enabled: true
       },
       positions: [],
       dialogVisible: false,
       multipleSelection: [],
       loading: false,
       statusMaps: [
         {
           lable: '禁用',
           value: false
         },
         {
           lable: '启用',
           value: true
         }
       ]
     }
   },
   components: {

   },
   mounted: function () {
     this.initPos();
   },
   methods: {
     initPos() {
       this.loading = true;
       getRequest('/system/basic/pos/').then(resp => {
         this.loading = false;
         this.positions = resp.object;
        //  console.log(this.positions)
       })
     },
     addPos() {
       if(this.pos.name == '') {
           this.$message.error({message:'请输入需要添加的职位名称',showClose:true});
        } else {
          this.loading = true;
          postRequest('/system/basic/pos/',this.pos).then(resp => {
            this.loading = false;
            this.pos.name='';
            this.initPos();
          })
        }
     },
     showDialog(index,data) {
      Object.assign(this.updatePos,data)
      this.dialogVisible = true;   
     },
     doUpdate() {
       putRequest('/system/basic/pos/',this.updatePos).then(resp => {
         this.dialogVisible = false;
         this.initPos();
       })
     },
     handleDelete(index,data) {
      //  console.log(index);
      //  console.log(data);
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
      }).then(() => {
          deleteRequest('/system/basic/pos/'+data.id).then(resp => {
            this.initPos();
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
      this.$confirm('此操作将永久删除【'+this.multipleSelection.length+'】个文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
          let ids = "?";
          this.multipleSelection.forEach(item => {
            ids += 'ids=' +item.id + "&";
          })
          // console.log(ids)
          deleteRequest('/system/basic/pos/batch'+ids).then(resp => {
            if(resp) {
              this.initPos();
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
.contentTop {
  display: flex;
  width: 400px;
}
.content {
  margin-top: 10px;
  width: 700px;
}
.updateLine {
  margin-top: 10px;
}
.updateItem{
  width: 200px;
  margin-left: 10px;

}
</style>
