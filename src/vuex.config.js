import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

const store = new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',
  state: {
    isAuthenticated: false,
    user: null,
    transactions: [{
      'type': 'Buy',
      currency: 'bitcoin',
      amount: '$36.738',
      date: new Date()
    }, {
      'type': 'Buy',
      currency: 'bitcoin',
      amount: '$36.738',
      date: new Date()
    }, {
      'type': 'Buy',
      currency: 'bitcoin',
      amount: '$36.738',
      date: new Date()
    }, {
      'type': 'Buy',
      currency: 'bitcoin',
      amount: '$36.738',
      date: new Date()
    }]
  },
  getters: {
    currentUser: state => {
      return state.user
    },
    transactions: state => {
      return state.transactions
    },
    virtual_wallet_balance: state => {
      return state.user.virtual_wallet.balance
    },
    investments: state => {
      return state.user.investments
    },
    isAuthenticated: state => {
      return state.isAuthenticated
    }
  },
  mutations: {
    setAuth (state, isAuthenticated) {
      state.isAuthenticated = isAuthenticated
    },
    setUser (state, user) {
      state.user = user
    },
    add_money_to_virtual_wallet (state, data) {
      Vue.set(state.user.virtual_wallet, 'balance', state.user.virtual_wallet.balance + data.amount)
    },
    add_bank_account (state, data) {
      state.user.bank_accounts.push(data)
    }
  },
  actions: {
    sessionAuthenticate ({ commit }) {
      store.dispatch('fetchUserData').then(() => {
        store.dispatch('login')
      })
    },
    login ({ commit }) {
      commit('setAuth', true)
    },
    logout ({ commit }) {
      commit('setAuth', false)
    },
    setUserData ({ commit }, userData) {
      commit('setUser', userData)
    },
    fetchUserData ({ dispatch }) {
      axios.get('/user/info').then((response) => {
        console.log('axios.get /user/info: ', response)
        dispatch('setUserData', response.data.user)
      }, (err) => {
        console.log(err)
      })

      let userData = {
        firstName: 'Vineet',
        lastName: 'Ahirkar',
        email: 'vinzee93@gmail.com',
        address: 'Maryland, US',
        city: 'baltimore',
        country: 'United States',
        postalCode: '21227',
        virtual_wallet: {
          balance: 1234
        },
        bank_accounts: [{
          id: '1',
          name: 'Bank of America',
          account_number: '1234',
          type: 'credit'
        }, {
          id: '2',
          name: 'PNC',
          account_number: '6789',
          type: 'debit'
        }],
        investments: {
          bitcoin: {
            amount: 1.7
          },
          litecoin: {
            amount: 1.3
          },
          etherium: {
            amount: 0.5
          },
          ripple: {
            amount: 1.5
          }
        }
      }
      dispatch('setUserData', userData)
    },
    add_bank_account ({ commit, state }, accountData) {
      if (accountData) {
        commit('add_bank_account', accountData)
      }
    }
  }
})

export default store
