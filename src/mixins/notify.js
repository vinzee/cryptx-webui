import Vue from 'vue'

Vue.mixin({
  methods: {
    $notify: function (message, icon, type) {
      console.log('Notification: ' + message)
      this.$notifications.notify({
        message: message,
        icon: icon === undefined ? 'ti-bell' : icon,
        horizontalAlign: 'right',
        verticalAlign: 'bottom',
        type: type === undefined ? 'success' : type
      })
    }
  }
})
