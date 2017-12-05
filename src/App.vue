<template>
  <div :class="{'nav-open': $sidebar.showSidebar}">
    <router-view v-if="!isBootstrapping"></router-view>

    <!--This sidebar appears only for screens smaller than 992px-->
    <side-bar type="navbar" :sidebar-links="$sidebar.sidebarLinks" v-if="!isBootstrapping">
      <ul class="nav navbar-nav">
        <li>
          <a href="javascript:void(0)" class="btn-rotate">
            <i class="fa fa-user" aria-hidden="true"></i> {{userEmail}}
          </a>
        </li>

        <li v-if="currentUser">
          <a href="#/settings" class="btn-rotate">
            <i class="fa fa-gear" aria-hidden="true"></i> Settings
          </a>
        </li>

        <li class="divider"></li>
      </ul>
    </side-bar>

    <BlockUI message="Loading..." :html="html" v-if="isLoading || isBootstrapping"></BlockUI>

    <notifications></notifications>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'

  export default {
    data () {
      return {
        html: '<i class="fa fa-spinner fa-3x fa-spin fa-fw"></i><span class="sr-only">Loading...</span>'
      }
    },
    beforeCreate () {
      this.$store.dispatch('sessionAuthenticate').then((res) => {
        if (res.loggedIn) {
          this.$notify('User Logged In')
        }
      }).catch(() => {
        this.$notify('Error in authenticating from session', 'ti-user', 'danger')
      })
    },
    computed: {
      userEmail () {
        return this.currentUser !== null ? this.currentUser.email : 'Guest'
      },
      ...mapGetters([
        'isLoading',
        'isBootstrapping',
        'currentUser'
      ])
    }
  }
</script>

<style lang="scss"></style>
