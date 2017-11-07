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
          <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
            <h4 class="modal-title" id="myModalLabel">Add Account</h4>
          </div>
          <div class="modal-body">
            <h3>Add Account</h3>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
            <button type="button" class="btn btn-primary" @click.prevent="add_account">Add Account</button>
          </div>
        </div>
      </div>
    </div>
    <!-- end add Account modal -->

  </div>
</template>
<script>
  export default {
    computed: {
      bank_accounts () {
        return this.$store.state.user.bank_accounts
      }
    },
    methods: {
      add_account () {

      }
    }
  }

</script>
<style>

</style>
