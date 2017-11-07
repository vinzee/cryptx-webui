<template>
  <div>
    <div class="card">
      <div class="header">
        <h4 class="title">Bank Accounts</h4>
      </div>
      <div class="content">
        <ul class="list-unstyled team-members">
          <li>
            <div class="row" v-for="bank_account in bank_accounts">
              <div class="col-xs-3">
                <div class="avatar">
                  <img src="static/img/bank-logo.png" alt="Circle Image" class="img-circle img-no-padding img-responsive">
                </div>
              </div>
              <div class="col-xs-6">
                {{bank_account.name}}
                <br>
                <span class="text-success">
                  <small>{{bank_account.account_number}}</small>
                </span>
              </div>

              <div class="col-xs-3 text-right">
                <button class="btn btn-sm btn-success btn-icon">
                  <i class="fa fa-credit-card"></i>
                </button>
              </div>
            </div>
          </li>
        </ul>

        <div class="text-center">
          <button type="button" class="btn btn-info btn-fill" data-toggle="modal" data-target="#addAccountModal">
            Add Account
          </button>
        </div>


      </div>
    </div>

    <!-- add Account modal -->
    <div class="modal" id="addAccountModal" tabindex="-1" role="dialog" aria-labelledby="addAccountModal" aria-hidden="true" data-backdrop="false">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <form @submit.stop.prevent="add_bank_account">

          <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
            <h4 class="modal-title" id="myModalLabel">Add Bank Account</h4>
          </div>

          <div class="modal-body">

            <div class="row">
              <div class="col-md-6">
                <fg-input type="text"
                          label="Bank Name"
                          placeholder="Bank Name"
                          v-model="add_bank_account_details.name">
                </fg-input>
              </div>
              <div class="col-md-6">
                <fg-input type="text"
                          label="Address"
                          placeholder="Address"
                          v-model="add_bank_account_details.address">
                </fg-input>
              </div>
            </div>

            <div class="row">
              <div class="col-md-4">
                <div class="form-group">
                  <label>Account Number</label>
                  <input v-validate="'required'" class="form-control border-input" type="number" name="account_number" label="Amount" placeholder="Amount" v-model="add_bank_account_details.account_number">
                  <span v-show="errors.has('account_number')" class="text-danger">{{ errors.first('account_number') }}</span>

                </div>
              </div>
              <div class="col-md-4">
                <div class="form-group">
                  <label>Account Number</label>
                  <input v-validate="'required'" class="form-control border-input" type="number" name="account_number" label="Amount" placeholder="Amount" v-model="add_bank_account_details.account_number">
                  <span v-show="errors.has('account_number')" class="text-danger">{{ errors.first('account_number') }}</span>

                </div>
              </div>
              <div class="col-md-4">
                <div class="form-group">
                  <label>Account Number</label>
                  <input v-validate="'required'" class="form-control border-input" type="number" name="account_number" label="Amount" placeholder="Amount" v-model="add_bank_account_details.account_number">
                  <span v-show="errors.has('account_number')" class="text-danger">{{ errors.first('account_number') }}</span>

                </div>
              </div>
            </div>

          </div>

          <div class="modal-footer">
            <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
            <button type="button" class="btn btn-primary" @click.prevent="add_bank_account">Add Bank Account</button>
          </div>

        </form>
        </div>
      </div>
    </div>
    <!-- end add Account modal -->

  </div>
</template>
<script>
  export default {
    data () {
      return {
        add_bank_account_details: {
          name: '',
          account_no: '',
          card_number: ''
        }
      }
    },
    computed: {
      bank_accounts () {
        return this.$store.state.user.bank_accounts
      }
    },
    methods: {
      add_bank_account () {
        console.log('add_bank_account', this.add_bank_account_details)

        this.$validator.validateAll()
        .then((isValidated) => {
          if (isValidated) {
            this.$store.commit('add_bank_account', self.add_bank_account_details)
            this.$notifications.notify({
              message: 'Added ' + this.add_bank_account_details.name + ' sucessfully !',
              icon: 'ti-bank',
              horizontalAlign: 'right',
              verticalAlign: 'top',
              type: 'success'
            })
          } else {
            this.$notifications.notify({
              message: 'Error in adding bank !',
              icon: 'ti-bank',
              horizontalAlign: 'right',
              verticalAlign: 'top',
              type: 'danger'
            })
          }
        })
      }
    }
  }

</script>
<style>

</style>
