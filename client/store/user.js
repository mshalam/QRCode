import axios from 'axios'
import history from '../history'

/**
 * ACTION TYPES
 */
const GET_USER = 'GET_USER'
const REMOVE_USER = 'REMOVE_USER'
const GET_PASSWORD = 'GET_PASSWORD'
const GET_MY_USERS = 'GET_MY_USERS'
const RESET_HOME = 'RESET_HOME'
const SHOW_QR = 'SHOW_QR'
const UPDATE_VALID = 'UPDATE_VALID'

/**
 * INITIAL STATE
 */
const defaultUser = {}

/**
 * ACTION CREATORS
 */
const getUser = user => ({type: GET_USER, user})
const removeUser = () => ({type: REMOVE_USER})
const getPassword = password => ({type: GET_PASSWORD, password})
const getMyUsers = users => ({type: GET_MY_USERS, users})
export const resetHomePage = () => ({type: RESET_HOME})
export const showQR = () => ({type: SHOW_QR})
const updateValid = valid => ({type: UPDATE_VALID, valid})

/**
 * THUNK CREATORS
 */
export const me = () => async dispatch => {
  try {
    const res = await axios.get('/auth/me')
    dispatch(getUser(res.data || defaultUser))
  } catch (err) {
    console.error(err)
  }
}

export const auth = (email, password, method) => async dispatch => {
  let res
  try {
    res = await axios.post(`/auth/${method}`, {email, password})
  } catch (authError) {
    return dispatch(getUser({error: authError}))
  }

  try {
    dispatch(getUser(res.data))
    history.push('/home')
  } catch (dispatchOrHistoryErr) {
    console.error(dispatchOrHistoryErr)
  }
}

export const logout = () => async dispatch => {
  try {
    await axios.post('/auth/logout')
    dispatch(removeUser())
    history.push('/login')
  } catch (err) {
    console.error(err)
  }
}

export const getPass = (userId, fn) => async dispatch => {
  try {
    const response = await axios.get(`/api/users/password/${userId}`)
    dispatch(getPassword(response.data))
    fn()
  } catch (error) {
    console.log(error)
  }
}

export const sendEmail = qrCode => async dispatch => {
  try {
    //console.log('qrCode: ', qrCode)
    const response = await axios.post(`/auth/email/`, {qrCode: qrCode})
  } catch (error) {
    console.log(error)
  }
}

export const getAllMyUsers = userId => async dispatch => {
  try {
    const response = await axios.get(`/api/users/`)
    dispatch(getMyUsers(response.data))
  } catch (error) {
    console.log(error)
  }
}

export const validateQr = (email, password) => async dispatch => {
  let res
  try {
    res = await axios.post(`/auth/validateQr`, {email, password})
    dispatch(updateValid(res.data))
  } catch (authError) {
    return dispatch(updateValid({error: authError}))
  }
}

/**
 * REDUCER
 */
export default function(state = defaultUser, action) {
  switch (action.type) {
    case GET_USER:
      return action.user
    case REMOVE_USER:
      return defaultUser
    case GET_PASSWORD:
      return {...state, password: action.password}
    case GET_MY_USERS:
      return {...state, users: [action.users]}
    case RESET_HOME:
      return {...state, showQr: false}
    case SHOW_QR:
      return {...state, showQr: true}
    case UPDATE_VALID:
      return {...state, valid: action.valid}

    default:
      return state
  }
}
