<template>
    <div>
      <div class="row">

        <div class="col-lg-8 col-md-7">
          <edit-profile-form></edit-profile-form>
        </div>

        <div class="col-lg-4 col-md-5">
          <!-- <user-card></user-card> -->
          <stats-card>
            <div class="icon-big text-center icon-success" slot="header">
              <i class="ti-wallet"></i>
            </div>
            <div class="numbers" slot="content">
              <p style="font-size: 15px">Virtual Wallet</p>
              $1,345
            </div>
            <div class="stats" slot="footer">
              <button type="button" class="btn btn-sm btn-info btn-fill" data-toggle="modal" data-target="#addMoneyModal">
                Add Money
              </button>
            </div>
          </stats-card>

          <bank-accounts-card></bank-accounts-card>
        </div>
      </div>

      <!-- add money modal -->
      <div class="modal" id="addMoneyModal" tabindex="-1" role="dialog" aria-labelledby="addMoneyModal" aria-hidden="true" data-backdrop="false">
        <div class="modal-dialog modal-lg">
          <div class="modal-content">
            <div class="modal-header">
              <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
              <h4 class="modal-title" id="myModalLabel">Add Money</h4>
            </div>
            <div class="modal-body">
              <h3>Add Money</h3>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
              <button type="button" class="btn btn-primary" @click.prevent="add_money">Add Money</button>
            </div>
          </div>
        </div>
      </div>
      <!-- end add money modal -->

    </div>
</template>
<script>
  import EditProfileForm from './UserProfile/EditProfileForm.vue'
  import UserCard from './UserProfile/UserCard.vue'
  import BankAccountsCard from './UserProfile/BankAccountsCard.vue'
  import StatsCard from 'components/UIComponents/Cards/StatsCard.vue'

  export default {
    components: {
      EditProfileForm,
      UserCard,
      BankAccountsCard,
      StatsCard
    },
    methods: {
      add_money () {

      }
    }
  }

</script>
<style>

</style>
