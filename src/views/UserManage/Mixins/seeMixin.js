
let setData = (type) =>{
  const MECH = {name: '所属机构', title: 'title'}
  const AUTH = {name: '身份', title: 'rname'}
  let d1 = type == 4 ? [{name: '证件类型', title: 'id_type'},{name: '证件号码', title: 'id_num'}] : []
  let d = type == 1 ? [MECH] : type == 2 ? [AUTH] : type == 3 ? [MECH,AUTH] : []
  return [
    {name: '用户ID', title: 'username'},
    ...d1,
    {name: '手机号', title: 'phone'},
    ...d,
    {name: '注册时间', title: 'create_time'},
    {name: '最后登录', title: 'update_time'},
  ]
}
export default {
  data() {
    return {
      detailShow: false,
      management: setData(1),
      institution: setData(2),
      mentor: setData(3),
      student: setData(4),
    }
  },
  methods: {
    close(){
      this.detailShow = false;
    }
  }
}

