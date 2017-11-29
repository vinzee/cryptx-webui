import Vue from 'vue'

Vue.mixin({
  methods: {
    $blockUI: function (message, icon, type) {
      this.$store.commit('setIsLoading', true)
    },
    $unblockUI: function (message, icon, type) {
      this.$store.commit('setIsLoading', false)
    }
  }
})
