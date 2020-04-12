<template>
 <div>
    <div style="margin-top:10px">
      <el-table stripe border :data="employees" size="mini" style="width:100%">
        <el-table-column type="selection" width="50"></el-table-column>
        <el-table-column align="center" label="姓名" prop="name" width="150"></el-table-column>
        <el-table-column align="center" label="工号" prop="workID" width="150"></el-table-column>
        <el-table-column align="center" label="电子邮件" prop="email" width="150"></el-table-column>
        <el-table-column align="center" label="电话号码" prop="phone" width="150"></el-table-column>
        <el-table-column align="center" label="所属部门" width="150">
          <template slot-scope="scope">
            {{scope.row.department.name}}
          </template>
        </el-table-column>
        <el-table-column align="center" label="工资账套" width="200">
          <template slot-scope="scope">
            <el-tooltip placement="right">
              <div slot="content">
                <table v-if="scope.row.salary != null">
                  <tr>
                    <td>基本工资</td>
                    <td>￥{{scope.row.salary.basicSalary}}</td>
                  </tr>
                  <tr>
                    <td>奖金</td>
                    <td>￥{{scope.row.salary.bonus}}</td>
                  </tr>
                  <tr>
                    <td>午餐补助</td>
                    <td>￥{{scope.row.salary.lunchSalary}}</td>
                  </tr>
                  <tr>
                    <td>交通补助</td>
                    <td>￥{{scope.row.salary.trafficSalary}}</td>
                  </tr>
                  <tr>
                    <td>养老金基数</td>
                    <td>￥{{scope.row.salary.pensionBase}}</td>
                  </tr>
                  <tr>
                    <td>养老金比率</td>
                    <td>￥{{scope.row.salary.pensionPer}}</td>
                  </tr>
                  <tr>
                    <td>医疗保险基数</td>
                    <td>￥{{scope.row.salary.medicalBase}}</td>
                  </tr>
                  <tr>
                    <td>医疗保险比率</td>
                    <td>￥{{scope.row.salary.medicalPer}}</td>
                  </tr>
                  <tr>
                    <td>公积金基数</td>
                    <td>￥{{scope.row.salary.accumulationFundBase}}</td>
                  </tr>
                  <tr>
                    <td>公积金比率</td>
                    <td>￥{{scope.row.salary.accumulationFundPer}}</td>
                  </tr>
                </table>
              </div>
              <el-tag>{{scope.row.salary== null ? '暂未设置' : scope.row.salary.name}}</el-tag>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <el-popover
              placement="left"
              title="修改员工工资账套"
              width="150"
              @show="beforeShowPop(scope.row)"
              @hide="beforeHidePop(scope.row)"
              trigger="click">
              <el-select v-model="currentSalaryId" placeholder="请选择">
                <el-option
                  v-for="item in salaries"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
              <span style="color:red;font-size:5px">提示：点击弹窗外确认修改</span>
              <el-button slot="reference" size="mini" type="danger">修改账套</el-button>
            </el-popover>
          </template>
        </el-table-column>
      </el-table>
      <div style="display:flex;justify-content:flex-end">
        <el-pagination
          background
          layout="sizes, prev, pager, next, jumper, ->, total, slot"
          @size-change="sizeChange"
          @current-change="currentChange"
          :total="total">
        </el-pagination>
      </div>
    </div>
 </div>
</template>

<script>
 export default {
   name: 'SalSobCfg',
   data () {
     return {
       employees: [],
       salaries: [],
       total: 0,
       page: 1,
       size: 10,
       currentSalaryId: null
     }
   },
   mounted: function() {
     this.initEmployees();
     this.initSalaries();
   },
   methods: {
     initEmployees() {
       let url = '?page='+this.page+'&size='+this.size;
       this.getRequest('/salary/sobcfg/'+url).then(resp => {
         if(resp) {
           this.total = resp.total;
           this.employees = resp.objects;
         }
       })
     },
     initSalaries() {
       this.getRequest('/salary/sobcfg/salaries').then(resp => {
         if(resp.object) {
           this.salaries = resp.object;
         }
       })
     },
     beforeShowPop(row) {
       if(row.salary) {
         this.currentSalaryId = row.salary.id;
       } else {
         this.currentSalaryId = null;
       }
     },
     beforeHidePop(row) {
       if(this.currentSalaryId) {
        this.putRequest('/salary/sobcfg/?eid='+row.id+'&sid='+this.currentSalaryId).then(resp => {
          this.initEmployees();
        })
       }
     },
     sizeChange(size) {
       this.size = size;
       this.initEmployees();
     },
     currentChange(page) {
       this.page = page;
       this.initEmployees();
     }
   }
 }
</script>

<style>

 
</style>
