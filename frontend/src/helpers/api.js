import axios from 'axios'
import config from '@/helpers/config'
import Cookies from '@/helpers/cookies'

const sessionName = config.sessionName

const client = axios.create({
  baseURL: `${config.apiUrl}/${config.apiVersion}`,
  json: true,
  headers: {
    'api-version': config.apiVersion || ''
  }
})

export default function execute(method, resource, data, extraHeaders = {}) {
  const token =
    Cookies.get(sessionName) || window.localStorage.getItem(sessionName)
  client.defaults.headers['authorization'] = 'Bearer ' + token
  client.defaults.headers[method] =
    extraHeaders || client.defaults.headers[method]
  return client({
    method,
    url: resource,
    data
  })
}
