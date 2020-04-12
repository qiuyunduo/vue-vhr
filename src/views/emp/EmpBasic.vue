<template>
 <div v-loading="loading">
   <div>
    <div style="display:flex;justify-content:space-between">
      <div>
        <el-input size="small" v-model="keyword" :clearable="true" placeholder="请输入员工名搜索员工，记得回车..." :disabled="nurmalDisabled" @clear="initEmps('')" prefix-icon="el-icon-search" style="width:300px" @keydown.enter.native="nurmalSearch"></el-input>
        <el-button size="small" type="primary" icon="el-icon-search" style="margin-left:10px" @click="nurmalSearch" :disabled="nurmalDisabled">搜索</el-button>
        <el-button size="small" type="primary" @click="showAdvanceSearch">
          <i :class="advanceSearchIcon" aria-hidden="true"></i>高级搜索
        </el-button>
      </div>
      <div>
        <el-upload
          style="display:inline-flex;margin-right:10px"
          :show-file-list="false"
          :before-upload="beforeUpload"
          :on-success="onSuccess"
          :on-error="onError"
          :disabled="uploadDataDisabled"
          action="/employee/basic/import">
          <!-- <i class="fa fa-level-up"></i> -->
          <el-button size="small" type="success" :disabled="uploadDataDisabled" :icon="uploadDataBtnIcon">{{uploadDataBtnText}}</el-button>
        </el-upload>
        <!-- <i class="fa fa-level-down"></i> -->
        <el-button size="small" type="success"  @click="exportData" icon="el-icon-download">导出数据</el-button>
        <el-button size="small" type="primary" icon="el-icon-plus" @click="showAddDialog">添加员工</el-button>
      </div>
    </div>
    <el-collapse-transition>
    <div style="border:1px solid #409eff;border-radius:5px;box-sizing:border-box;padding:5px 20px;margin:10px 0" v-show="advanceSearchShow">
      <el-row justify="space-around">
        <el-col :span="5">
          政治面貌: 
          <el-select clearable v-model="searchModel.politicId" placeholder="政治面貌" size="mini" style="width:130px">
            <el-option
              v-for="item in politicsStatus"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="4">
          民族: 
          <el-select clearable v-model="searchModel.nationId" style="width:130px" placeholder="请选择民族" size="mini">
            <el-option
              v-for="item in nations"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="4">
          职位: 
          <el-select clearable v-model="searchModel.posId" style="width:130px" placeholder="请选择职位" size="mini">
            <el-option
              v-for="item in positions"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="4">
          职称: 
          <el-select clearable v-model="searchModel.jobLevelId" style="width:130px" placeholder="请选择职称" size="mini">
            <el-option
              v-for="item in joblevels"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="7">
            聘用形式:
            <el-radio-group v-model="searchModel.engageForm">
              <el-radio :label="'劳动合同'">劳动合同</el-radio>
              <el-radio :label="'劳务合同'">劳务合同</el-radio>
            </el-radio-group>
        </el-col>
      </el-row>
      <el-row style="margin-top:10px">
        <el-col :span="5" style="display:flex">
          <span style="padding-top:2px;box-sizing:border-box">所属部门:</span>
          <el-popover
            placement="right"
            title="所属部门"
            v-model="popVisiable2"
            width="200"
            trigger="manual">
            <el-tree :default-expand-all="true" :data="deps" :props="defaultProps" @node-click="handleNodeClick2"></el-tree>
            <div @click="showPop2" style="font-size:13px;margin-left:5px;width:130px;border:1px solid #dedede;display:inline-flex;height:26px;border-radius:5px;cursor:pointer;align-items:center;padding-left:20px;box-sizing: border-box" slot="reference">{{department}}</div>
          </el-popover>
        </el-col>
        <el-col :span="10">
          入职日期:
          <el-date-picker
            size="mini"
            v-model="searchModel.b2eDate"
            type="daterange"
            value-format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-col>
        <el-col :span="4" :offset="5">
          <el-button size="mini" @click="showAdvanceSearch">取消</el-button>
          <el-button type="primary" icon="el-icon-search" size="mini" @click="advanceSearch">搜索</el-button>
        </el-col>
      </el-row>
    </div>
    </el-collapse-transition>
   </div>
    <div style="margin-top:10px">
      <el-table
        :data="emps"
        size="mini"
        border
        stripe
        style="width: 100%">
          <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column
          prop="name"
          align="center"
          label="姓名"
          fixed
          width="120">
        </el-table-column>
        <el-table-column
          prop="workID"
          align="center"
          label="工号"
          width="100">
        </el-table-column>
        <el-table-column
          prop="gender"
          align="center"
          label="性别"
          width="50">
        </el-table-column>
        <el-table-column
          prop="birthday"
          align="center"
          width="100"
          label="出生日期">
          <template slot-scope="scope">
            {{scope.row.birthday | simpleDateFormat}}
          </template>
        </el-table-column>
        <el-table-column
          prop="idCard"
          align="center"
          width="180"
          label="身份证号码">
        </el-table-column>
        <el-table-column
          prop="wedlock"
          align="center"
          width="80"
          label="婚姻状况">
        </el-table-column>
        <el-table-column
          prop="nation.name"
          align="center"
          width="70"
          label="民族">
        </el-table-column>
        <el-table-column
          prop="nativePlace"
          align="center"
          width="80"
          label="籍贯">
        </el-table-column>
        <el-table-column
          prop="politicsStatus.name"
          align="center"
          label="政治面貌">
        </el-table-column>
        <el-table-column
          prop="email"
          align="center"
          width="170"
          label="电子邮件">
        </el-table-column>
        <el-table-column
          prop="phone"
          align="center"
          width="120"
          label="电话号码">
        </el-table-column>
        <el-table-column
          prop="address"
          align="center"
          width="200"
          label="联系地址">
        </el-table-column>
        <el-table-column
          prop="department.name"
          align="center"
          width="120"
          label="所属部门">
        </el-table-column>
        <el-table-column
          prop="position.name"
          align="center"
          width="130"
          label="职位">
        </el-table-column>
        <el-table-column
          prop="jobLevel.name"
          align="center"
          width="130"
          label="职称">
        </el-table-column>
        <el-table-column
          prop="engageForm"
          align="center"
          label="聘用形式">
        </el-table-column>
        <el-table-column
          prop="school"
          align="center"
          width="150"
          label="毕业院校">
        </el-table-column>
        <el-table-column
          prop="specialty"
          align="center"
          width="150"
          label="专业">
        </el-table-column>
        <el-table-column
          prop="beginDate"
          width="100"
          align="center"
          label="入职日期">
          <template slot-scope="scope">
            {{scope.row.beginDate | simpleDateFormat}}
          </template>
        </el-table-column>
        <el-table-column
          prop="conversionTime"
          width="100"
          align="center"
          label="转正日期">
          <template slot-scope="scope">
            {{scope.row.conversionTime | simpleDateFormat}}
          </template>
        </el-table-column>
        <el-table-column
          prop="beginContract"
          width="110"
          align="center"
          label="合同起始日期">
          <template slot-scope="scope">
            {{scope.row.beginContract | simpleDateFormat}}
          </template>
        </el-table-column>
        <el-table-column
          prop="endContract"
          width="110"
          align="center"
          label="合同截止日期">
          <template slot-scope="scope">
            {{scope.row.endContract | simpleDateFormat}}
          </template>
        </el-table-column>
        <el-table-column
          prop="contractTerm"
          width="100"
          align="center"
          label="合同期限">
          <template slot-scope="scope">
            <el-tag>{{scope.row.contractTerm}}</el-tag>年
          </template>
        </el-table-column>
        <el-table-column
          prop="tiptopDegree"
          align="center"
          label="最高学历">
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="180" align="center">
          <template slot-scope="scope">
            <el-button
              size="mini"
              style="padding:2px"
              @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button
              size="mini"
              style="padding:2px"
              type="primary"
              >查看高级资料</el-button>
            <el-button
              size="mini"
              type="danger"
              style="padding:2px"
              @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog
        v-loading="loading2"
        :title="title"
        :visible.sync="dialogVisible"
        width="80%">
        <div>
          <el-form ref="empForm" :model="emp" :rules="rules">
            <el-row>
              <el-col :span="6">
                <el-form-item label="姓名:" prop="name">
                  <el-input maxlength="10" v-model="emp.name" size="mini" prefix-icon="el-icon-edit" placeholder="员工姓名,限长10个字符" style="width:200px"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item label="性别:" prop="gender">
                  <el-radio-group v-model="emp.gender">
                    <el-radio :label="'男'">男</el-radio>
                    <el-radio :label="'女'">女</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="出生日期:" prop="birthday">
                  <el-date-picker
                    size="mini"
                    v-model="emp.birthday"
                    type="date"
                    style="width:150px"
                    placeholder="出生日期">
                  </el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="7">
                <el-form-item label="政治面貌:" prop="politicId">
                  <el-select v-model="emp.politicId" placeholder="政治面貌" size="mini">
                    <el-option
                      v-for="item in politicsStatus"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="6">
                <el-form-item label="民族:" prop="nationId">
                  <el-select v-model="emp.nationId" style="width:200px" placeholder="请选择民族" size="mini">
                    <el-option
                      v-for="item in nations"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item label="籍贯:" prop="nativePlace">
                  <el-input v-model="emp.nativePlace" size="mini" placeholder="员工籍贯" style="width:120px"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="电子邮箱:" prop="email">
                  <el-input v-model="emp.email" prefix-icon="el-icon-message" size="mini" placeholder="电子邮箱地址" style="width:150px"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="7">
                <el-form-item label="联系地址:" prop="address">
                  <el-input v-model="emp.address" prefix-icon="el-icon-edit" size="mini" placeholder="联系地址" style="width:200px"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="6">
                <el-form-item label="职位:" prop="posId">
                  <el-select v-model="emp.posId" style="width:200px" placeholder="请选择职位" size="mini">
                    <el-option
                      v-for="item in positions"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item label="职称:" prop="jobLevelId">
                  <el-select v-model="emp.jobLevelId" style="width:120px" placeholder="请选择职称" size="mini">
                    <el-option
                      v-for="item in joblevels"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="所属部门:" prop="departmentId">
                  <el-popover
                    placement="right"
                    title="所属部门"
                    v-model="popVisiable"
                    width="200"
                    trigger="manual">
                    <el-tree :default-expand-all="true" :data="deps" :props="defaultProps" @node-click="handleNodeClick"></el-tree>
                    <div @click="showPop" style="width:150px;border: 1px solid #dedede;height: 26px;font-size:13px;
                    display:inline-flex;border-radius:5px;cursor:pointer;align-items:center;padding-left:20px;box-sizing: border-box" slot="reference">
                    {{department}}
                    </div>
                  </el-popover>
                </el-form-item>
              </el-col>
              <el-col :span="7">
                <el-form-item label="电话号码:" prop="phone">
                  <el-input v-model="emp.phone" prefix-icon="el-icon-phone" size="mini" placeholder="电话号码" style="width:200px"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="6">
                <el-form-item label="工号:" prop="workID">
                  <el-input v-model="emp.workID" :disabled="true" size="mini" style="width:200px"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item label="学历:" prop="tiptopDegree">
                  <el-select v-model="emp.tiptopDegree" style="width:120px" placeholder="最高学历" size="mini">
                    <el-option
                      v-for="(item,index) in tiptopDegrees"
                      :key="index"
                      :label="item"
                      :value="item">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="毕业院校:" prop="school">
                  <el-input v-model="emp.school" prefix-icon="el-icon-edit" size="mini" placeholder="毕业院校名称" style="width:150px"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="7">
                <el-form-item label="专业名称:" prop="specialty">
                  <el-input v-model="emp.specialty" prefix-icon="el-icon-edit" size="mini" placeholder="专业名称" style="width:200px"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="6">
                <el-form-item label="入职日期:" prop="beginDate">
                  <el-date-picker
                    size="mini"
                    v-model="emp.beginDate"
                    type="date"
                    style="width:170px"
                    placeholder="入职日期">
                  </el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="转正日期:" prop="conversionTime">
                  <el-date-picker
                    size="mini"
                    v-model="emp.conversionTime"
                    type="date"
                    style="width:150px"
                    placeholder="转正日期">
                  </el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="合同起始日期:" prop="beginContract">
                  <el-date-picker
                    size="mini"
                    v-model="emp.beginContract"
                    type="date"
                    style="width:150px"
                    placeholder="合同起始日期">
                  </el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="合同终止日期:" prop="endContract">
                  <el-date-picker
                    size="mini"
                    v-model="emp.endContract"
                    type="date"
                    style="width:150px"
                    placeholder="合同终止日期">
                  </el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item label="身份证号码:" prop="idCard">
                  <el-input v-model="emp.idCard" size="mini" prefix-icon="el-icon-edit" placeholder="请输入员工身份证号码" style="width:200px"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="聘用形式:" prop="engageForm">
                  <el-radio-group v-model="emp.engageForm">
                    <el-radio :label="'劳动合同'">劳动合同</el-radio>
                    <el-radio :label="'劳务合同'">劳务合同</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="婚姻状况:" prop="wedlock">
                  <el-radio-group v-model="emp.wedlock">
                    <el-radio :label="'已婚'">已婚</el-radio>
                    <el-radio :label="'未婚'">未婚</el-radio>
                    <el-radio :label="'离异'">离异</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addEmp">确 定</el-button>
        </span>
      </el-dialog>
      <div style="display:flex;justify-content:space-between">
        <el-button type="danger">批量删除</el-button>
        <el-pagination
          background
          @current-change="currentChange"
          @size-change="sizeChange"
          layout="sizes, prev, pager, next, jumper, ->, total, slot"
          :total="total">
        </el-pagination>
      </div>
    </div>
 </div>
</template>

<script>
 export default {
   name: 'EmpBasic',
   data () {
     return {
      keyword: '',
      searchModel: {
        politicId: null,
        nationId: null,
        jobLevelId: null,
        posId: null,
        engageForm: '劳动合同',
        departmentId: 1,
        b2eDate: null,
      },
      emps: [],
      total: 0,
      page: 1,
      size: 10,
      loading: false,
      loading2: false,
      dialogVisible: false,
      title: '',
      emp: {
        name: "qiuyunduo",
        gender: "男",
        birthday: "1990-01-01 12:00:00",
        idCard: "610122199001011256",
        wedlock: "已婚",
        nationId: 1,
        nativePlace: "陕西",
        politicId: 13,
        email: "laowang@qq.com",
        phone: "18565558897",
        address: "深圳市南山区",
        departmentId: undefined,
        jobLevelId: 9,
        posId: 29,
        engageForm: "劳务合同",
        tiptopDegree: "本科",
        specialty: "信息管理与信息系统",
        school: "深圳大学",
        beginDate: "2018-01-01 12:00:00",
        workState: "在职",
        workID: "00000001",
        contractTerm: 2.0,
        conversionTime: null,
        notWorkDate: null,
        beginContract: "2018-01-01 12:00:00",
        endContract: "2020-01-01 12:00:00",
        workAge: null
      },
      nations: [],
      joblevels: [],
      politicsStatus: [],
      positions: [],
      deps: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      department: '股东会',
      popVisiable: false,
      popVisiable2: false,
      tiptopDegrees: ['博士','硕士','本科','大专','高中','初中','小学','其他'],
      rules: {
        name: [{required:true,message: '请输入用户名',trigger:blur}],
        gender: [{required:true,message: '请选择性别',trigger:blur}],
        birthday: [{required:true,message: '请输入出生日期',trigger:blur}],
        idCard: [{required:true,message: '请输入身份证号',trigger:blur},
                {pattern: /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}$)/,message:'身份证号码格式不正确',trigger:blur}],
        wedlock: [{required:true,message: '请选择婚姻状况',trigger:blur}],
        nationId: [{required:true,message: '请选择所属民族',trigger:blur}],
        nativePlace: [{required:true,message: '请输入籍贯',trigger:blur}],
        politicId: [{required:true,message: '请选择政治面貌',trigger:blur}],
        email: [{required:true,message: '请输入邮箱',trigger:blur},{type:'email',message:'邮箱格式不正确',trigger:blur}],
        phone: [{required:true,message: '请输入电话号码',trigger:blur}],
        address: [{required:true,message: '请输入联系地址',trigger:blur}],
        departmentId: [{required:true,message: '请选择所属部门',trigger:blur}],
        jobLevelId: [{required:true,message: '请输入职称',trigger:blur}],
        posId: [{required:true,message: '请输入职位',trigger:blur}],
        specialty: [{required:true,message: '请输入专业名称',trigger:blur}],
        school: [{required:true,message: '请输入毕业院校',trigger:blur}],
        engageForm: [{required:true,message: '请选择聘用形式',trigger:blur}],
        tiptopDegree: [{required:true,message: '请选择最好学历',trigger:blur}],
        beginDate: [{required:true,message: '请输入入职日期',trigger:blur}],
        workID: [{required:true,message: '请输入工号',trigger:blur}],
        conversionTime: [{required:true,message: '请输入转正日期',trigger:blur}],
        beginContract: [{required:true,message: '请输入合同起始日期',trigger:blur}],
        endContract: [{required:true,message: '请输入合同终止日期 ',trigger:blur}],
      },
      uploadDataBtnText: '导入数据',
      uploadDataBtnIcon: 'el-icon-upload2',
      uploadDataDisabled: false,
      advanceSearchShow: false,
      advanceSearchIcon: 'fa fa-angle-double-down',
      nurmalDisabled: false,
      searchType: ''
     }
   },
   mounted: function() {
     this.initEmps('');
     this.initData();
     this.initPositions();
   },
   methods: {
    initData() {
      if(window.sessionStorage.getItem('nations')) {
        this.nations = JSON.parse(window.sessionStorage.getItem('nations'))
      } else {
        this.getRequest('/employee/basic/nations').then(resp => {
          if(resp.object) {
            this.nations = resp.object;
            window.sessionStorage.setItem('nations',JSON.stringify(resp.object));
          }  
        })
      }
      if(window.sessionStorage.getItem('joblevels')) {
        this.joblevels = JSON.parse(window.sessionStorage.getItem('joblevels'))
      } else {
        this.getRequest('/employee/basic/joblevels').then(resp => {
          if(resp.object) {
            this.joblevels = resp.object;
            window.sessionStorage.setItem('joblevels',JSON.stringify(resp.object));
          }  
        })
      }
      if(window.sessionStorage.getItem('politicsStatus')) {
        this.politicsStatus = JSON.parse(window.sessionStorage.getItem('politicsStatus'))
      } else {
        this.getRequest('/employee/basic/politicsStatus').then(resp => {
          if(resp.object) {
            this.politicsStatus = resp.object;
            window.sessionStorage.setItem('politicsStatus',JSON.stringify(resp.object));
          }  
        })
      }
      if(window.sessionStorage.getItem('deps')) {
        this.deps = JSON.parse(window.sessionStorage.getItem('deps'))
      } else {
        this.getRequest('/employee/basic/departments').then(resp => {
          if(resp.object) {
            this.deps = resp.object;
            window.sessionStorage.setItem('deps',JSON.stringify(resp.object));
          }  
        })
      }
    },
    initPositions() {
      this.getRequest('/employee/basic/positions').then(resp => {
        if(resp.object) {
          this.positions = resp.object;
        }
      })
    },
    initWorkID() {
      this.getRequest('/employee/basic/workID').then(resp => {
        if(resp.object) {
          this.emp.workID = resp.object;
        }
      })
    },
    initEmps(url) {
      this.loading = true;
      let baseUrl = '?page='+this.page+'&size='+this.size;
      this.getRequest('/employee/basic/'+baseUrl+url).then(resp => {
        if(resp) {
          this.total = resp.total;
          this.emps = resp.objects
        }
        this.loading = false;
      })
    },
    currentChange(page) {
      this.page = page;
      if(this.searchType == 'nurmal') {
        this.nurmalSearch();
      } else if(this.searchType == 'advance') {
        this.advanceSearch();
      } else {
        this.initEmps('');
      }
    },
    sizeChange(size) {
      this.size = size;
      if(this.searchType == 'nurmal') {
        this.nurmalSearch();
      } else if(this.searchType == 'advance') {
        this.advanceSearch();
      } else {
        this.initEmps('');
      }
    },
    nurmalSearch() {
      this.searchType = 'nurmal'
      let url = '';
      if(this.keyword && this.keyword.trim() != '') {
        url = '&name='+this.keyword;
      }
      this.initEmps(url);
    },
    showAdvanceSearch() {
      this.nurmalDisabled = !this.nurmalDisabled;
      this.advanceSearchShow = !this.advanceSearchShow;
      this.advanceSearchIcon = this.advanceSearchShow ? 'fa fa-angle-double-up' : 'fa fa-angle-double-down';
    },
    handleNodeClick2(data) {
      this.searchModel.departmentId = data.id;
      this.department = data.name;
      this.popVisiable2 = false;
    },
    advanceSearch() {
      this.searchType = 'advance'
      let url = '';
      if(this.searchModel.politicId) {
        url += '&politicId='+this.searchModel.politicId;
      }
      if(this.searchModel.nationId) {
        url += '&nationId='+this.searchModel.nationId;
      }
      if(this.searchModel.jobLevelId) {
        url += '&jobLevelId='+this.searchModel.jobLevelId;
      }
      if(this.searchModel.posId) {
        url += '&posId='+this.searchModel.posId;
      }
      if(this.searchModel.engageForm) {
        url += '&engageForm='+this.searchModel.engageForm;
      }
      if(this.searchModel.departmentId) {
        url += '&departmentId='+this.searchModel.departmentId;
      }
      if(this.searchModel.b2eDate) {
        url += '&b2eDate='+this.searchModel.b2eDate;
      }
      this.initEmps(url);
    },
    showPop2() {
      this.popVisiable2 = !this.popVisiable2;
    },
    //初始化emp对象
    employEmp() {
      this.emp = {
        name: "",
        gender: "",
        birthday: "",
        idCard: "610122199001011256",
        wedlock: "",
        nationId: null,
        nativePlace: "",
        politicId: null,
        email: "",
        phone: "",
        address: "",
        departmentId: null,
        jobLevelId: null,
        posId: null,
        engageForm: "",
        tiptopDegree: "",
        specialty: "",
        school: "",
        beginDate: "",
        workState: "",
        workID: "",
        contractTerm: null,
        conversionTime: null,
        notWorkDate: null,
        beginContract: "",
        endContract: "",
        workAge: null
      };
      this.department = '股东会';
    },
    //导出文件
    exportData() {
      console.log('进入exportData方法');
      window.open('/employee/basic/export','_parent');
    },
    //文件导入
    beforeUpload(file) {
      this.uploadDataBtnText = '正在导入';
      this.uploadDataBtnIcon = 'el-icon-loading';
      this.uploadDataDisabled = true;
    },
    onSuccess(response, file, fileList) {
      this.uploadDataBtnText = '导入数据';
      this.uploadDataBtnIcon = 'el-icon-upload2';
      this.uploadDataDisabled = false;
      this.$message.success('数据导入成功');
      this.initEmps('');
    },
    onError(err, file, fileList) {
      this.uploadDataBtnText = '导入数据';
      this.uploadDataBtnIcon = 'el-icon-upload2';
      this.uploadDataDisabled = false;
    },
    //添加员工
    addEmp() {
      this.$refs['empForm'].validate(valid => {
        if(valid) {
          this.loading2 = true
          if(this.emp.id) {
            console.log("put")
            this.putRequest('/employee/basic/',this.emp).then(resp => {
              this.initEmps('');
              this.loading2 = false;
              this.dialogVisible = false;
            }).catch(() => {
              this.loading2 = false;
            })
          } else {
            console.log("post")
            this.postRequest('/employee/basic/',this.emp).then(resp => {
              this.initEmps('');
              this.loading2 = false;
              this.dialogVisible = false;
            }).catch(() => {
              this.loading2 = false;
            })
          }
        }
      })
    },
    showAddDialog() {
      this.employEmp();
      this.title = '添加员工';
      this.dialogVisible = true;
      this.initWorkID();
    },
    handleNodeClick(data) {
      this.department = data.name;
      this.emp.departmentId = data.id;
      this.popVisiable = false;
    },
    showPop() {
      this.popVisiable = !this.popVisiable;
    },
    //编辑员工信息
    handleEdit(index,row) {
      this.emp = row;
      this.department = row.department.name;
      this.title = '编辑员工信息';
      this.initPositions();
      this.dialogVisible = true;
    },
    //删除
    handleDelete(index,row) {
      this.$confirm('此操作将永久删除【'+row.name+'】员工, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
          this.deleteRequest('/employee/basic/'+row.id).then(resp => {
              this.initEmps('');
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

<style>

 
</style>