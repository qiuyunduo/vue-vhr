<template>
 <div>
    <el-tabs v-model="activeName2" type="card" @tab-click="handleClick">
      <el-tab-pane label="部门管理" name="first"><DepManage/></el-tab-pane>
      <el-tab-pane label="职位管理" name="second"><PosManage/></el-tab-pane>
      <el-tab-pane label="职称管理" name="third"><JobLevelManage/></el-tab-pane>
      <el-tab-pane label="奖惩规则" name="fourth"><EcManage/></el-tab-pane>
      <el-tab-pane label="权限组" name="five"><PermissionManage/></el-tab-pane>
   </el-tabs>
 </div>
</template>

<script>
import { DepManage,PosManage,EcManage,JobLevelManage,PermissionManage } from '../../components/sys/basic'
 export default {
   name: 'SysBasic',
   data () {
     return {
      activeName2: 'first'
     }
   },
   components: {
     DepManage,
     PosManage,
     EcManage,
     JobLevelManage,
     PermissionManage
   },
   methods: {
      handleClick(tab, event) {
        // console.log(tab, event);
      }
    }
 }
</script>

<style>

 
</style>
