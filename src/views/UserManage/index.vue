<template>
    <Tabs v-model="tabName" @on-click="tabs" class="tab-name">
        <TabPane v-if='permissionCode1' label="管理列表" name="item1"><ManagementList :permission-item1="permissionItem1" /></TabPane>
        <TabPane v-if='permissionCode2' label="机构列表" name="item2"><ListInstitutions  :permission-item2="permissionItem2" /></TabPane>
        <TabPane v-if='permissionCode3' label="老师列表" name="item3"><MentorList :permission-item3="permissionItem3" /></TabPane>
        <TabPane v-if='permissionCode4' label="学员列表" name="item4"><StudentList  :permission-item4="permissionItem4" /></TabPane>
    </Tabs>
</template>
<script>
  import Vue from 'vue'
  import ManagementList from './ManagementList/index'
  import ListInstitutions from './ListInstitutions/index'
  import StudentList from './StudentList/index'
  import MentorList from './MentorList/index'
  import postData from 'src/api/postData'
  export default {
    name: "UserManage",
    components: { ManagementList, ListInstitutions, StudentList, MentorList },
    data(){
      return{
        permissionCode1: false,
        permissionCode2: false,
        permissionCode3: false,
        permissionCode4: false,
        permissionItem1: null,
        permissionItem2: null,
        permissionItem3: null,
        permissionItem4: null,
        tabName: '',
        role_id: JSON.parse(sessionStorage.getItem('PERSONALDETAILS')).role_id,
      }
    },
    methods: {
      initUser(){
        let bool = this.role_id == 1;
        this.permissionCode1 = bool
        this.permissionCode2 = bool
        this.permissionCode3 = this.role_id < 3
        this.permissionCode4 = true
        if(sessionStorage.getItem('UserManagePane')){
           this.tabName = sessionStorage.getItem('UserManagePane')
        }else {
          if(this.role_id > 1) this.tabs('item' + (this.role_id + 1))
          if(this.role_id === 1) this.tabs('item1')
        }
      },
      setAuth(n,t) {
        this[ 'permissionCode' + n ] = true
        this['permissionItem' + n] = t
      },
      tabs(name){
          this.tabName = name
          sessionStorage.setItem('UserManagePane', name)
      },
      handleAuth(){
        let d = this.$config.getAuth(1)
        if(d){
            d.forEach((t, k) => {
            let n = +t.permission_code.slice(2,4)
            this.setAuth(n,t)
          });
        }
      }
    },
    mounted(){
        this.tabName = this.role_id == 1 ? 'item1' : this.role_id < 3 ? 'item3' : 'item4'
        this.initUser()
       // this.$nextTick(() => {
        // this.handleAuth()
       // })
    }
  }
</script>

<style lang="less" scoped>
  .tab-name, /deep/.ivu-tabs-content, .user-manage-main{
    height: 100% !important;
  }
  .user-manage-main{
    position: relative;
  }
  /deep/ .ivu-page{
    position: absolute;
    // bottom: 60px;
    left: 0;
    right: 0;
    margin: 0 auto;
  }
</style>
