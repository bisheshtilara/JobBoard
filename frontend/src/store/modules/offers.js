import api from '@/helpers/api'
import moment from 'moment'
import router from '@/router'

const state = {
  all: [],
  available: []
}

const getters = {
  getOfferById: (state) => (id) => {
    return state.all.find((item) => item._id === id)
  },
  getOffersByAuthor: (state) => (author) => {
    return author
      ? state.all.filter((item) => item.author?._id === author._id)
      : []
  },
  getUserOffers: (state, getters, rootState, rootGetters) => {
    const appliedOffers = rootGetters['applications/appliedOffers'] || []
    return state.all.filter((item) => appliedOffers.includes(item._id))
  }
}

const actions = {
  fetchAll({ commit }) {
    return api('get', 'offers').then(({ data }) => commit('setAllOffers', data))
  },
  getOfferDetails(_, id) {
    return api('get', `offers/${id}`).then(({ data }) => data)
  },
  createOffer({ dispatch }, { data }) {
    return api('post', 'offers', data, {
      'Content-Type': 'multipart/form-data'
    }).then((res) => {
      dispatch('fetchAll')
      router.push(`/offer/${res.data._id}`)
    })
  },
  updateOffer({ dispatch }, { data, id }) {
    return api('put', `offers/${id}`, data, {
      'Content-Type': 'multipart/form-data'
    }).then(() => {
      dispatch('fetchAll')
      router.push(`/offer/${id}`)
    })
  },
  cancel({ dispatch }, { id, reason }) {
    return api('delete', `offers/${id}`, {
      deleteReason: reason
    }).then(() => {
      dispatch('fetchAll')
    })
  }
}

const mutations = {
  setAllOffers(state, data) {
    state.all = data.sort((a, b) =>
      moment.utc(a.startDate).diff(moment.utc(b.startDate))
    )
    state.available = data
      .filter(
        (offer) =>
          offer.startDate &&
          moment.utc(offer.startDate).isSameOrAfter(moment.utc())
      )
      .sort((a, b) => moment.utc(a.startDate).diff(moment.utc(b.startDate)))
  },
  deleteOffer(state, data) {
    state.all = state.filter((offer) => offer._id !== data._id)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
