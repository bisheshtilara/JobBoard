import api from '@/helpers/api'

const state = {
  applications: []
}

const getters = {
  getByOffersId: (state) => (id) => {
    return state.applications.find((item) => item.offer._id === id) || null
  },
  getById: (state) => (id) => {
    return state.applications.find((item) => item._id === id) || null
  },
  appliedOffers: (state) => {
    return state.applications
      .filter((application) => application?.offer)
      .map((application) => application.offer)
  },
  isAppliedTo: (state, getters) => (offer_id) => {
    const offers_ids = getters['appliedOffers'].map((o) => o._id)
    return offers_ids.includes(offer_id) || false
  }
}

const actions = {
  fetchUserApplications({ commit }) {
    return api('get', 'applications').then(({ data }) =>
      commit('setUserApplications', data)
    )
  },
  fetchAdminApplications({ commit }, id) {
    return api('get', `applications/user/${id}`).then(({ data }) =>
      commit('setUserApplications', data)
    )
  },
  subscribe({ dispatch }, { offer }) {
    return api('post', 'applications', { offer: offer._id }).then(() => {
      dispatch('fetchUserApplications')
    })
  },
  unsubscribe({ dispatch }, { application, reason, isAdmin }) {
    return api('delete', `applications/${application}`, {
      cancelReason: reason
    }).then(() => {
      if (isAdmin) dispatch('fetchAdminApplications', isAdmin)
      else dispatch('fetchUserApplications')
    })
  },
  getApplication({ dispatch }, application) {
    return api('get', `applications/${application._id}`)
      .then(({ data }) => data)
      .catch(() => {
        dispatch('fetchUserApplications')
      })
  }
}

const mutations = {
  setUserApplications(state, data) {
    state.applications = data
  },
  unsetUserApplications(state) {
    state.applications = []
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
