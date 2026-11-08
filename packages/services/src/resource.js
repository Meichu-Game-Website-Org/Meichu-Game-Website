// Keep request ordering per component without coupling the services to a Vue version.
const requests = new WeakMap()

export function createResource() {
  return { status: 'loading', data: null, error: '' }
}

export function invalidateResource(resource) {
  requests.set(resource, (requests.get(resource) || 0) + 1)
}

function requestMessage(error) {
  if (error && error.response && error.response.status === 404) return '找不到這筆資料，請返回列表或重新載入。'
  if (error && error.code === 'ECONNABORTED') return '連線逾時，請稍後重新載入。'
  if (error && error.code === 'INVALID_RESPONSE') return '資料暫時無法讀取，請重新載入。'
  return '暫時無法取得資料，請檢查網路連線後重新載入。'
}

export function loadResource(resource, request, isEmpty = data => data == null) {
  invalidateResource(resource)
  const version = requests.get(resource)
  resource.status = 'loading'
  resource.error = ''
  resource.data = null
  return Promise.resolve().then(request).then(data => {
    if (requests.get(resource) !== version) return
    const empty = isEmpty(data)
    resource.data = data
    resource.status = empty ? 'empty' : 'success'
  }).catch(error => {
    if (requests.get(resource) !== version) return
    resource.data = null
    resource.error = requestMessage(error)
    resource.status = 'error'
  })
}

export const resourceMixin = {
  data() { return { resource: createResource() } },
  beforeDestroy() { invalidateResource(this.resource) },
  beforeUnmount() { invalidateResource(this.resource) }
}
