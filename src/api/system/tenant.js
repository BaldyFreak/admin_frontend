import request from '@/utils/request'

// 查询系统租户表列表
export function listTenant(query) {
  return request({
    url: '/system/tenant/list',
    method: 'get',
    params: query
  })
}


// 查询系统租户表详细
export function getTenant(Id) {
  return request({
    url: '/system/tenant/' + Id,
    method: 'get'
  })
}

// 新增系统租户表
export function addTenant(data) {
  return request({
    url: '/system/tenant',
    method: 'post',
    data: data
  })
}

// 修改系统租户表
export function updateTenant(data) {
  return request({
    url: '/system/tenant',
    method: 'put',
    data: data
  })
}

// 删除系统租户表
export function delTenant(Id) {
  return request({
    url: '/system/tenant/' + Id,
    method: 'delete'
  })
}
