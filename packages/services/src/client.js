import axios from 'axios'

export const REQUEST_TIMEOUT = 10000

// An isolated client keeps the same credential behavior in both applications.
export default axios.create({
  timeout: REQUEST_TIMEOUT,
  withCredentials: true
})
