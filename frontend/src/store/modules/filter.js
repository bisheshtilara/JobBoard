// initial state
const state = {
  duration: [],
  timeOfTheDay: [],
  selectedDates: [],
  categories: []
}

// getters
const getters = {}

// actions
const actions = {
  set({ commit }, filter) {
    commit('set', filter)
  },
  reset({ commit }) {
    commit('reset')
  }
}

// mutations
const mutations = {
  set(state, data) {
    for (let key in data) {
      if (state[key]) {
        state[key] = data[key]
      }
    }
  },
  reset(state) {
    state.duration = []
    state.timeOfTheDay = []
    state.selectedDates = []
    state.categories = []
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
