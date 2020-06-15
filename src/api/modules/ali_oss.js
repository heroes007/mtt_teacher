import api from './config'
export function get_sign(content_type,date,bucket,dir,filename,type) {
    return api.post('common/getSign',{content_type:content_type,date:date,bucket:bucket,dir:dir,filename:filename,type:type});
}
export function get_sign_4_datacenter(content_type,date,bucket,dir,filename,type) {
    return api.post('upload/get_sign',{content_type:content_type,date:date,bucket:bucket,dir:dir,filename:filename,type:type});
}
