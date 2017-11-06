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
      bank_accounts: [{
        name: 'Bank of America',
        account_number: '1234',
        type: 'credit' // credit / debit,
      }]
    },
    transactions: [{
      'buy/sell': 'Buy',
      currency: 'bitcoin',
      amount: '$36.738',
      date: new Date()
    }, {
      'buy/sell': 'Buy',
      currency: 'bitcoin',
      amount: '$36.738',
      date: new Date()
    }, {
      'buy/sell': 'Buy',
      currency: 'bitcoin',
      amount: '$36.738',
      date: new Date()
    }, {
      'buy/sell': 'Buy',
      currency: 'bitcoin',
      amount: '$36.738',
      date: new Date()
    }]
  },
  getters: {
    currentUser: state => {
      return state.user
    }
    // ,transactions: state => {
    //   let out = []
    //   return _.each(state.transactions, function (transaction) {
    //     let transaction_dup = ;
    //     transaction.date = moment(transaction.date).format('MMMM Do YYYY, h:mm:ss a') // this.$config.momentFormat
    //   })
    // }
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
