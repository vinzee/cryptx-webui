<template>
  <div class="card">
    <div class="header">
      <h4 class="title">User Profile</h4>
    </div>
    <div class="content">
      <form>
        <div class="row">

          <div class="col-md-4">
            <fg-input type="email"
                      label="Email"
                      placeholder="Email"
                      v-model="user.email" disabled>
            </fg-input>
          </div>
          <div class="col-md-4">
            <fg-input type="password"
                      label="Password"
                      placeholder="Password"
                      v-model="user.password">
            </fg-input>
          </div>
          <div class="col-md-4">
            <fg-input type="password"
                      label="Password Confirmation"
                      placeholder="Password Confirmation">
            </fg-input>
          </div>

        </div>

        <div class="row">
          <div class="col-md-4">
            <div class="form-group">
              <label>Full Name</label>
              <input v-validate="'required'" class="form-control border-input" name="name" placeholder="First Name" v-model="user.name">
              <span v-show="errors.has('name')" class="text-danger">{{ errors.first('name') }}</span>
            </div>
          </div>
          <div class="col-md-4">
            <div class="form-group">
              <label>SSN</label>
              <input v-validate="{required: true, regex: /^\d{3}-?\d{2}-?\d{4}$$/}" class="form-control border-input" name="ssn" placeholder="XXX-XX-XXXX" v-model="user.ssn">
              <span v-show="errors.has('ssn')" class="text-danger">{{ errors.first('ssn') }}</span>
            </div>
          </div>
          <div class="col-md-4">
            <div class="form-group">
              <label>Phone</label>
              <input v-validate="{required: true, regex: /^(()?\d{3}())?(-|\s)?\d{3}(-|\s)?\d{4}$/}" class="form-control border-input" name="phone" placeholder="Phone" v-model="user.phone">
              <span v-show="errors.has('phone')" class="text-danger">{{ errors.first('phone') }}</span>
            </div>
          </div>
        </div>

        <div class="row">
          <div class="col-md-12">
            <fg-input type="text"
                      label="Address"
                      placeholder="Home Address"
                      v-model="user.address">
            </fg-input>
          </div>
        </div>

        <div class="row">
          <div class="col-md-4">
            <fg-input type="text"
                      label="City"
                      placeholder="City"
                      v-model="user.city">
            </fg-input>
          </div>
          <div class="col-md-4">
            <fg-input type="text"
                      label="Country"
                      placeholder="Country"
                      v-model="user.country">
            </fg-input>
          </div>
          <div class="col-md-4">
            <fg-input type="number"
                      label="Postal Code"
                      placeholder="ZIP Code"
                      v-model="user.postalCode">
            </fg-input>
          </div>
        </div>

        <!-- <div class="row">
          <div class="col-md-12">
            <div class="form-group">
              <label>About Me</label>
              <textarea rows="5" class="form-control border-input"
                        placeholder="Here can be your description"
                        v-model="user.aboutMe">

              </textarea>
            </div>
          </div>
        </div> -->
        <div class="text-center">
          <button type="submit" class="btn btn-info btn-fill btn-wd" @click.prevent="updateProfile">
            Update Profile
          </button>
        </div>
        <div class="clearfix"></div>
      </form>
    </div>
  </div>
</template>
<script>
  import _ from 'lodash'
  // import { mapGetters } from 'vuex'

  export default {
    data () {
      return {
      }
    },
    computed: {
      user () {
        return _.cloneDeep(this.$store.getters.currentUser)
      }
    },
    methods: {
      updateProfile () {
        this.$store.dispatch('updateUserProfile', this.user).then(() => {
          this.$notify('User Profile updated', 'ti-user')
        }).catch(function (res) {
          this.$notify('User Profile update failed', 'ti-alert', 'danger')
        })
      }
    }
  }

</script>
<style>

</style>
