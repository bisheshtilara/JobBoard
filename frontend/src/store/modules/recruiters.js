import api from '@/helpers/api'

const state = {
  all: []
}

const getters = {
  getRecruitersById: (state) => (id) => {
    return state.all.find((item) => item._id === id)
  }
}

const actions = {
  fetchAll({ commit }) {
    return api('get', 'recruiters').then(({ data }) =>
      commit('setAllRecruiters', data)
    )
  },
  findRecruiter(_, id) {
    return api('get', `recruiters/${id}`).then(({ data }) => data)
  }
}

const mutations = {
  setAllRecruiters(state, data) {
    state.all = data.sort(() => Math.random() - 0.5)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
