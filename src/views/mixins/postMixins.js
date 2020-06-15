import postData from 'src/api/postData'
export default {
    methods: {
        setSex(n){
            return n ? '男' : '女'
        },
        fromAddAndEdit(url,d){
            postData(url, d).then((res) => {
              if(res.res_code == 1){
                if(res.msg === '修改成功'||res.msg === '添加成功') this.$Message.success(res.msg);
                this.getList()
              }
          })
        }
    }
}
