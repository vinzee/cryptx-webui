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
              ${{virtual_wallet_balance}}
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
            <form @submit.stop.prevent="add_money">

            <div class="modal-header">
              <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
              <h4 class="modal-title" id="myModalLabel">Add Money to Virtual Wallet</h4>
            </div>

            <div class="modal-body">

                <div class="row">
                  <div class="col-md-4 col-md-offset-4">

                    <div class="form-group">
                      <label>Amount ($)</label>
                      <input v-validate="'required'" class="form-control border-input" type="number" name="amount" label="Amount" placeholder="Amount" v-model="virtual_wallet_add_money.amount" min="10" step="10">
                      <span v-show="errors.has('amount')" class="text-danger">{{ errors.first('amount') }}</span>

                    </div>

                    <div class="form-group">
                      <label>Bank Account</label>
                      <select v-validate="'required'" class="form-control" v-model="virtual_wallet_add_money.bank_id" name="bank_account">
                        <option v-for="bank_account in bank_accounts" :value="bank_account.id">{{bank_account.name}}</option>
                      </select>
                      <span v-show="errors.has('bank_account')" class="text-danger">{{ errors.first('bank_account') }}</span>
                    </div>

                  </div>
                </div>

            </div>

            <div class="modal-footer">
              <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
              <button type="submit" class="btn btn-primary">Add Money</button>
            </div>

            </form>
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
  import $ from 'jquery'

  export default {
    components: {
      EditProfileForm,
      UserCard,
      BankAccountsCard,
      StatsCard
    },
    data () {
      return {
        virtual_wallet_add_money: {
          amount: 100,
          bank_id: 1
        }
      }
    },
    computed: {
      virtual_wallet_balance () {
        return this.$store.getters.virtual_wallet_balance
      },
      bank_accounts () {
        return this.$store.state.user.bank_accounts
      }
    },
    methods: {
      add_money () {
        console.log('add_money', this.virtual_wallet_add_money.amount, this.virtual_wallet_add_money.bank_id)

        this.$validator.validateAll()
        .then((isValidated) => {
          if (isValidated) {
            this.$store.commit('add_money_to_virtual_wallet', {amount: this.virtual_wallet_add_money.amount})
            this.$notifications.notify({
              message: 'Added $' + this.virtual_wallet_add_money.amount + ' to virtual wallet successfully from !',
              icon: 'ti-money',
              horizontalAlign: 'right',
              verticalAlign: 'bottom',
              type: 'success'
            })

            $('#addMoneyModal').modal('hide')

            // this.$notifications.notify({
            //   message: 'Error in adding money to virtual wallet !',
            //   icon: 'ti-money',
            //   horizontalAlign: 'right',
            //   verticalAlign: 'bottom',
            //   type: 'danger'
            // })
          }
        })
      }
    }
  }

</script>
<style>

</style>
