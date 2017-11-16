import Vue from 'vue'
import Vuex from 'vuex'
import './auth.js'

Vue.use(Vuex)

const store = new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',
  state: {
    isAuthenticated: true,
    user: {
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
    investments: state => {
      return state.user.investments
    },
    isAuthenticated: state => {
      return state.isAuthenticated
    }
  },
  mutations: {
    login (state, user) {
      state.isAuthenticated = true
      state.user = user
    },
    logout (state) {
      state.isAuthenticated = false
      state.user = null
    },
    add_money_to_virtual_wallet (state, data) {
      Vue.set(state.user.virtual_wallet, 'balance', state.user.virtual_wallet.balance + data.amount)
    },
    add_bank_account (state, data) {
      state.user.bank_accounts.push(data)
    }
  },
  actions: {
    add_bank_account ({ commit, state, dispatch }, accountData) {
      if (accountData) {
        dispatch('add_bank_account', accountData)

        window.vue.$notifications.notify({
          message: 'Added new bank account sucessfully !',
          icon: 'ti-bank',
          horizontalAlign: 'right',
          verticalAlign: 'bottom',
          type: 'success'
        })
      }
    },
    register ({ commit, state, dispatch }, user) {
      if (user) {
        Vue.axios.post('/user/signup').then((response) => {
          let user = response.data.user
          window.vue.$notifications.notify({
            message: 'User registered in sucessfully !',
            icon: 'ti-bank',
            horizontalAlign: 'right',
            verticalAlign: 'bottom',
            type: 'success'
          })
          dispatch('login', user)
        }, (err) => {
          console.log('Error in user registration', err)
        })
      }
    },
    isLoggedIn ({ commit, state, dispatch }, user) {
      var session = this.$cookie.get('session')

      if (session) {
        Vue.axios.post('/user/info', {session: session})
        .then(function (response) {
          if (response.success) {
            dispatch('login', response.user)
          }
        },
        function (error) {
          console.log('Failed to renew old session', error)
        })
      }
    },
    login ({ commit, state }, {user, requestOptions}) {
      // vueAuth.login(user, requestOptions).then((response) => {
      //   commit('login', user)
      // })

      // let self = this
      // if (user) {
      //   Vue.axios.post('/user/login').then((response) => {
      //     if (response.success) {
      //       self.$cookie.set('session', response.session, 30)
      //       commit('login', user)
      //       window.vue.$router.push('/')

      //       window.vue.$notifications.notify({
      //         message: 'User logged in sucessfully !',
      //         icon: 'ti-bank',
      //         horizontalAlign: 'right',
      //         verticalAlign: 'bottom',
      //         type: 'success'
      //       })
      //     } else {
      //       console.log('User login failed', response)
      //     }
      //   }, (err) => {
      //     console.log('Error in user registration', err)
      //   })
      // }
    },
    logout ({ commit, state }) {
      window.vue.$router.push('/login')
      commit('logout')

      window.vue.$notifications.notify({
        message: 'User logged out sucessfully !',
        icon: 'ti-bank',
        horizontalAlign: 'right',
        verticalAlign: 'bottom',
        type: 'success'
      })
    }
  }
})

export default store
