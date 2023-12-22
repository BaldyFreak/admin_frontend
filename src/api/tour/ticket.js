import request from '@/utils/request'

// 查询参数列表
export function listTicket(query) {
  return request({
    url: '/tour/ticket/page',
    method: 'get',
    params: query
  })
}

// 查询参数详细
export function getTicket(id) {
  return request({
    url: '/tour/ticket/' + id,
    method: 'get'
  })
}

// 新增参数配置
export function addTicket(data) {
  return request({
    url: '/tour/ticket',
    method: 'post',
    data: data
  })
}

// 修改参数配置
export function updateTicket(data) {
  return request({
    url: '/tour/ticket',
    method: 'put',
    data: data
  })
}

// 删除参数配置
export function delTicket(ids) {
  return request({
    url: '/tour/ticket',
    method: 'delete',
    data:ids
  })
}
