import api from './config'
export function add_product(param) {
  let d = {
    organization_id: param.organization_id,
    title:param.title,
    original_price: +param.original_price,
    price: +param.price,
    unlock_type: param.unlock_type,
    state: param.state,
    short_description: param.short_description,
    description: param.description,
    url_arr: param.url_arr,
    duration: 0
  }
  return api.post('product/product/add', d);
}
export function update_product(param) {
  let d = {
    organization_id: param.organization_id,
    product_id: param.product_id,
    title:param.title,
    original_price: +param.original_price,
    price: +param.price,
    unlock_type: param.unlock_type,
    state: param.state,
    short_description: param.short_description,
    description: param.description,
    url_arr: param.url_arr,
    duration: 0
  }
  return api.post('/product/product/change', d);
}
export function get_product_info(id) {
  return api.post('product/product/getProductDetailById', {product_id:id})
}
