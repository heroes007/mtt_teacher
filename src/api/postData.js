import api from './modules/config'
import { Message } from 'view-design';
import Loading from '../plug/loading'

export  default (url,data) => {
  var loading
  var timeout = setTimeout(() => {
    loading = Loading({message: "加载中，请稍后", show: true})
  }, 200)
  return api.post(url, data).then((res) => {
    clearTimeout(timeout)
    if(loading) loading.close()
    if(res.data.res_code === 1){
      return res.data
    }else{
      Message.warning(res.data.msg);
      return res.data
    }
  })
}
