<template>
 <div v-loading="loading">
    <div style="display:flex;justify-content:space-between">
      <el-button type="primary" icon="el-icon-plus" @click="showAddDialog">添加工资账套</el-button>
      <el-button type="success" icon="el-icon-refresh" @click="initSalaies"></el-button>
    </div>
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      width="50%"
      @close="closeModal">
      <div style="display:flex;justify-content:space-between">
        <el-steps direction="vertical" :active="activeItemIndex">
          <el-step :title="item" v-for="(item,index) in activeItems" :key="index"></el-step>
        </el-steps>
        <div style="width:400px;margin-top:100px">
          <el-form>
            <el-form-item :label="activeItems[index]+':'" v-for="(value,title,index) in salary" :key="index" v-show="activeItemIndex == index">
              <el-input :placeholder="'请输入'+activeItems[index]+'.....'" type="text" style="width:200px" v-model="salary[title]"></el-input>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="preStep" v-show="activeItemIndex > 0">上一步</el-button>
        <el-button type="primary" @click="nextStep" :disabled="activeItemIndex == 11">{{activeItemIndex >= 10 ? '完成' : '下一步'}}</el-button>
      </span>
    </el-dialog>
    <div style="margin-top:10px">
      <el-table :data="salaries" size="mini" border style="width:100%">
        <el-table-column align="center" type="selection" width="50"></el-table-column>
        <el-table-column align="center" prop="name" label="账套名称" width="150"></el-table-column>
        <el-table-column align="center" prop="basicSalary" label="基本工资" width="80"></el-table-column>
        <el-table-column align="center" prop="trafficSalary" label="交通补助" width="80"></el-table-column>
        <el-table-column align="center" prop="lunchSalary" label="午餐补助" width="80"></el-table-column>
        <el-table-column align="center" prop="bonus" label="奖金" width="80"></el-table-column>
        <el-table-column align="center" prop="createDate" label="启用时间" width="120"></el-table-column>
        <el-table-column align="center" label="养老金">
          <el-table-column align="center" prop="pensionPer" label="比率" width="70"></el-table-column>
          <el-table-column align="center" prop="pensionBase" label="基数" width="70"></el-table-column>  
        </el-table-column>
        <el-table-column align="center" label="医疗保险">
          <el-table-column align="center" prop="medicalPer" label="比率" width="70"></el-table-column>
          <el-table-column align="center" prop="medicalBase" label="基数" width="70"></el-table-column>  
        </el-table-column>
        <el-table-column align="center" label="公积金">
          <el-table-column align="center" prop="accumulationFundPer" label="比率" width="70"></el-table-column>
          <el-table-column align="center" prop="accumulationFundBase" label="基数" width="70"></el-table-column>  
        </el-table-column>
        <el-table-column align="center" label="操作">
          <el-table-column align="center" prop="" label="编辑">
            <template slot-scope="scope">
            <el-button size="mini" @click="showUpdatedDialog(scope.row)">编辑</el-button>
            </template>
          </el-table-column>
          <el-table-column align="center" label="删除">
            <template slot-scope="scope">
              <el-button size="mini" type="danger" @click="deleteSalary(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table-column>
      </el-table>
    </div>
 </div>
</template>

<script>
 export default {
   name: 'SalSob',
   data () {
     return {
       loading: false,
       salaries: [],
       dialogTitle: '', 
       dialogVisible: false,
       activeItemIndex: 0,
       activeItems: [
          '账套名称',
          '基本工资',
          '交通补助',
          '午餐补助',
          '奖金',
          '养老金比率',
          '养老金基数',
          '医疗保险比率',
          '医疗保险基数',
          '公积金比率',
          '公积金基数',
       ],
       salary: {
        name:'',
        basicSalary:'',
        trafficSalary:'',
        lunchSalary:'',
        bonus: '',
        pensionPer:'',
        pensionBase:'',
        medicalPer:'',
        medicalBase:'',
        accumulationFundPer:'',
        accumulationFundBase:''
       }
     }
   },
   directives: {
  // 注册一个局部的自定义指令 v-focus
      focus: {
        // 指令的定义
        inserted: function (el) {
          // 聚焦元素
          el.querySelector('input').focus()
        }
      }
    },
   mounted: function() {
     this.initSalaies();
   },
   methods: {
     initSalaies() {
       this.loading = true;
       this.getRequest('/salary/sob/').then(resp => {
         if(resp.object) {
           this.salaries = resp.object;
         }
         this.loading = false;
       })
     },
     initSalary() {
       this.salary = {
        name:'',
        basicSalary:'',
        trafficSalary:'',
        lunchSalary:'',
        bonus: '',
        pensionPer:'',
        pensionBase:'',
        medicalPer:'',
        medicalBase:'',
        accumulationFundPer:'',
        accumulationFundBase:''
       }
     },
     showAddDialog() {
       this.initSalary();
       this.dialogVisible = true;
       this.dialogTitle = '添加工资账套';
     },
     preStep() {
       this.activeItemIndex--;
     },
     nextStep() {
       if(this.activeItemIndex == 10) {
         if(this.salary.id) {
            this.updateSalary();
          } else {
            this.addSalary();
          }
          return;
       }
       this.activeItemIndex++;
     },
     addSalary() {
       this.loading = true;
       this.postRequest('/salary/sob/',this.salary).then(() => {
         this.activeItemIndex = 0;
         this.initSalaies();
         this.dialogVisible = false;
         this.loading = false;
       })
     },
     closeModal() {
       this.activeItemIndex = 0;
       this.initSalary();
     },
     showUpdatedDialog(row) {
       this.dialogVisible = true;
       this.dialogTitle = '修改工资账套';
       this.salary.id = row.id;
       this.salary.name=row.name;
       this.salary.basicSalary=row.basicSalary
       this.salary.trafficSalary=row.trafficSalary
       this.salary.lunchSalary=row.lunchSalary
       this.salary.bonus=row.bonus
       this.salary.pensionPer=row.pensionPer
       this.salary.pensionBase=row.pensionBase
       this.salary.medicalPer=row.medicalPer
       this.salary.medicalBase=row.medicalBase
       this.salary.accumulationFundPer=row.accumulationFundPer
       this.salary.accumulationFundBase=row.accumulationFundBase
     },
     updateSalary() {
       this.putRequest('/salary/sob/',this.salary).then(resp => {
         this.activeItemIndex = 0;
         this.initSalaies();
         this.dialogVisible = false;
         this.loading = false;
       })
     },
     deleteSalary(row) {
       this.$confirm('此操作将永久删除【'+row.name+'】此账套','提示',{
         cancelButtonText: '取消',
         confirmButtonText: '确定',
         type: 'warning'
       }).then(() => {
         this.loading = true
         this.deleteRequest('/salary/sob/'+row.id).then(resp => {
           this.initSalaies();
           this.loading = false;
         })
       }).catch(() => {
         this.$message.info('已取消操作')
       })
     }
   }
 }
</script>

<style>

 
</style>
