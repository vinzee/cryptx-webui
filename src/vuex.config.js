import Vue from 'vue'
import Vuex from 'vuex'
// import moment from 'moment'
// import _ from 'lodash'

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
      postalCode: '21227',
      virtual_wallet: {
        balance: 1234
      },
      bank_accounts: [{
        name: 'Bank of America',
        account_number: '1234',
        type: 'credit' // credit / debit,
      }],
      currencies: {
        bitcoin: {
          amount: 1.7
        },
        litecoin: {
          amount: 1.3
        }
      }
    },
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
    currencies: state => {
      return state.user.virtual_wallet.currencies
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
