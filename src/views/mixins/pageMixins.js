export default {
  data() {
    return {
      current: 1,
      total: null,
      pageSize: 16
    }
  },
  methods: {
    pageList(val) {
      if(this.pageTotal){
        this.current = val
        this.initData();
      }else{
        this.current = val
        this.getList()
      }
    }
  }
}
