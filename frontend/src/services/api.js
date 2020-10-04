import Axios from 'axios'

const headerData = {
  'Content-Type': 'application/json',
}

const baseUrl = process.env.REACT_APP_BASE_URL || 'http://localhost:8080'

const getFullUrl = url => `${baseUrl}${url}`

const serverError = {
  status: false,
  message: 'Server Error!',
}

export const get = async ({ url, headers }) => {
  try {
    const result = await Axios({
      method: 'get',
      url: getFullUrl(url),
      headers: {
        ...headerData,
        ...headers,
      },
    })
    return result.data
  } catch (error) {
    if (error && error.response) {
      return error.response.data
    } else {
      return serverError
    }
  }
}

export const post = async ({ url, data = {}, headers = headerData }) => {
  try {
    const result = await Axios({
      method: 'post',
      url: getFullUrl(url),
      headers: {
        ...headerData,
        ...headers,
      },
      data,
    })
    return result.data
  } catch (error) {
    if (error && error.response) {
      return error.response.data
    } else {
      return serverError
    }
  }
}

export const put = async ({ url, data = {}, headers = headerData }) => {
  try {
    const result = await Axios({
      method: 'put',
      url: getFullUrl(url),
      headers: {
        ...headerData,
        ...headers,
      },
      data,
    })
    return result.data
  } catch (error) {
    if (error && error.response) {
      return error.response.data
    } else {
      return serverError
    }
  }
}

export const del = async ({ url, headers = headerData }) => {
  try {
    const result = await Axios({
      method: 'delete',
      url: getFullUrl(url),
      headers: {
        ...headerData,
        ...headers,
      },
    })
    return result.data
  } catch (error) {
    if (error && error.response) {
      return error.response.data
    } else {
      return serverError
    }
  }
}
