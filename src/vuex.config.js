import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',
  state: {
    logged_in: false,
    user: {
      firstName: 'Vineet',
      lastName: 'Ahirkar',
      email: 'vinzee93@gmail.com',
      address: 'Maryland, US',
      city: 'baltimore',
      postalCode: '21227'
    }
  },
  getters: {
    currentUser: state => {
      return state.user
    }
  },
  mutations: {
    login (state, user) {
      state.logged_in = true
      state.user = user
    },
    logout (state) {
      state.logged_in = false
      state.user = null
    }
  }
})

export default store
