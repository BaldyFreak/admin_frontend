import request from '@/utils/request'

// 查询参数列表
export function getConfig() {
  return request({
    url: '/tour/config',
    method: 'get',
  })
}



// 修改参数配置
export function addOrUpdateConfig(data) {
  return request({
    url: '/tour/config',
    method: 'put',
    data: data
  })
}
