import request from '@/utils/request'

// 查询参数列表
export function listScenery(query) {
  return request({
    url: '/tour/scenery/list',
    method: 'get',
    params: query
  })
}

// 查询参数详细
export function getScenery(id) {
  return request({
    url: '/tour/scenery/' + id,
    method: 'get'
  })
}

// 新增参数配置
export function addScenery(data) {
  return request({
    url: '/tour/scenery',
    method: 'post',
    data: data
  })
}

// 修改参数配置
export function updateScenery(data) {
  return request({
    url: '/tour/scenery',
    method: 'put',
    data: data
  })
}

// 删除参数配置
export function delScenery(id) {
  return request({
    url: '/tour/scenery/' + id,
    method: 'delete'
  })
}
