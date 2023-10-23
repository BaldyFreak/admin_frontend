import request from '@/utils/request'

// 查询景区表列表
export function listScenery(query) {
  return request({
    url: '/Api/scenery/list',
    method: 'get',
    params: query
  })
}


// 查询景区表详细
export function getScenery(SceneryId) {
  return request({
    url: '/Api/scenery/' + SceneryId,
    method: 'get'
  })
}

// 新增景区表
export function addScenery(data) {
  return request({
    url: '/Api/scenery',
    method: 'post',
    data: data
  })
}

// 修改景区表
export function updateScenery(data) {
  return request({
    url: '/Api/scenery',
    method: 'put',
    data: data
  })
}

// 删除景区表
export function delScenery(SceneryId) {
  return request({
    url: '/Api/scenery/' + SceneryId,
    method: 'delete'
  })
}
