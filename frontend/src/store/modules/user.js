import api from '@/helpers/api'
import { persist, destroy } from '@/helpers/persist'
import router from '@/router'
import Swal from 'sweetalert2'
import config from '@/helpers/config'

const sessionName = config.sessionName

// initial state
const state = {
  current: null,
  all: []
}

const getters = {}

const actions = {
  fetchAll({ commit }) {
    return api('get', 'users').then(({ data }) => commit('setAllUsers', data))
  },
  findUser(_, id) {
    return api('get', `users/${id}`).then(({ data }) => data)
  },
  registerNewUser({ dispatch }, data) {
    return api('post', 'users/join', data).then(async (res) => {
      await persist(sessionName, res.data.token, res.data.expiresIn)
      await dispatch('getCurrentUser')
    })
  },
  loginUser({ dispatch }, { email, password }) {
    return api('post', 'users/me', {
      email,
      password
    }).then(async (res) => {
      await persist(sessionName, res.data.token, res.data.expiresIn)
      await dispatch('getCurrentUser')
    })
  },
  verifyAccount({ dispatch }, code) {
    return api('get', `users/code/${code}`).then(async (res) => {
      await persist(sessionName, res.data.token, res.data.expiresIn)
      await dispatch('getCurrentUser')
    })
  },
  checkResetToken(_, token) {
    return api('get', `users/reset/${token}`)
  },
  forgotPassword(_, { email }) {
    return api('post', 'users/forgot', {
      email: email
    })
  },
  resetPassword(_, { email, password, token }) {
    return api('post', `users/reset/${token}`, {
      email: email,
      password: password
    })
  },
  updateUserInfo({ dispatch }, data) {
    return api('put', 'users/me', data, {
      'Content-Type': 'multipart/form-data'
    }).then(() => dispatch('getCurrentUser'))
  },
  getCurrentUser({ commit, dispatch }) {
    return api('get', 'users/me')
      .then(async ({ data }) => {
        await commit('setCurrentUser', data)
        await dispatch('applications/fetchUserApplications', null, {
          root: true
        })
      })
      .then(
        () =>
          new Promise((resolve) => {
            resolve(true)
          })
      )
      .catch(
        () =>
          new Promise((reject) => {
            reject(false)
          })
      )
  },
  async logout({ commit }) {
    try {
      await api('delete', 'users/me')
      await destroy(sessionName)
      await commit('unsetCurrentUser')
      sessionStorage.clear()
      router.go('/')
    } catch (e) {
      Swal.fire('Oops...', 'Something went wrong!', 'error')
      console.error(e)
    }
  },
  deleteUserById(_, { id, reason }) {
    return api('delete', `users/${id}`, { deleteReason: reason })
  },
  async loginWithFacebook(
    { dispatch },
    {
      accessToken,
      data_access_expiration_time,
      expiresIn,
      signedRequest,
      userID
    }
  ) {
    try {
      return await api('post', 'auth/facebook', {
        accessToken,
        data_access_expiration_time,
        expiresIn,
        signedRequest,
        userID
      }).then(async (res) => {
        await persist(sessionName, res.data.token, res.data.expiresIn)
        await dispatch('getCurrentUser')
      })
    } catch (e) {
      Swal.fire('Oops...', 'Something went wrong!', 'error')
      console.error(e)
    }
  }
}

// mutations
const mutations = {
  setCurrentUser(state, user) {
    state.current = user
  },
  unsetCurrentUser(state) {
    state.current = null
  },
  setAllUsers(state, data) {
    state.all = data
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
