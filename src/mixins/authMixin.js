import Vue from 'vue'

Vue.mixin({
  methods: {
    isAuthenticated: function () {
      return this.$store.getters.isAuthenticated
    },
    login: function (email, password) {
      console.log('login attempt')
      let self = this

      this.$auth.login({ email, password }).then(function (res) {
        if (res.success) {
          console.log('login successful !')
          self.$cookie.set('session', res.session, 30)
          self.notify('User Logged In successfully!')
          self.$router.push('/')
        } else {
          throw new Error('Error in user login: ', res)
        }
      })
    },
    register: function (name, email, password) {
      console.log('register attempt')
      this.$auth.register({ name, email, password }).then(function () {
        console.log('register successful !')
        this.login(email, password)
        // Execute application logic after successful registration
      })
    },
    logout: function () {
      this.$store.commit('logout')
      this.$router.push({ path: 'login' })
    }
  }
})
