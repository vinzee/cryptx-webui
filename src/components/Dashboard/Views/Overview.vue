<template>
  <div>
    <div class="loading" v-if="loading">
      Loading...
    </div>

    <!--Stats cards-->
    <div class="row" v-if="!loading">
      <div class="col-lg-3 col-sm-6">
        <stats-card>
          <div class="icon-big text-center icon-success" slot="header">
            <i class="ti-wallet"></i>
          </div>
          <div class="numbers" slot="content">
            <p style="font-size: 15px">Virtual Wallet</p>
            ${{virtual_wallet_balance}}
          </div>
          <div slot="footer" class="stats"><i class="ti-reload"></i> Updated now
          </div>
        </stats-card>
      </div>

      <div class="col-lg-3 col-sm-6">
        <stats-card>
          <div slot="header" class="icon-big text-center icon-warning">
            <i class="ti-briefcase"></i>
          </div>
          <div slot="content" class="numbers">
            <p style="font-size: 15px;">Net Worth</p>
            ${{portfolio_net_worth}}
          </div>
          <div slot="footer" class="stats"><i class="ti-reload"></i> Updated now
          </div>
        </stats-card>
      </div>
      <div class="col-lg-3 col-sm-6">
        <stats-card>
          <div slot="header" class="icon-big text-center icon-info"><i class="ti-stats-up"></i></div>
          <div slot="content" class="numbers">
            <p style="font-size: 15px;">Top Currency</p>
            23
          </div>
          <div slot="footer" class="stats"><i class="ti-timer"></i> Updated now
          </div>
        </stats-card>
      </div>
      <div class="col-lg-3 col-sm-6">
        <stats-card>
          <div slot="header" class="icon-big text-center icon-danger"><i class="ti-stats-down"></i></div>
          <div slot="content" class="numbers">
            <p style="font-size: 15px;">Worst Currency</p>
            -45
          </div>
          <div slot="footer" class="stats"><i class="ti-reload"></i> Updated now
          </div>
        </stats-card>
      </div>
    </div>

    <!--Charts-->
    <div class="row" v-if="!loading">

      <div class="col-xs-12">
        <chart-card :chart-data="usersChart.data" :chart-options="usersChart.options">
          <h4 class="title" slot="title">Portfolio</h4>
          <span slot="subTitle"> 24 Hours performance</span>
          <span slot="footer">
            <i class="ti-reload"></i> Updated 3 minutes ago</span>
          <div slot="legend">
            <i class="fa fa-circle text-info"></i> Open
            <i class="fa fa-circle text-danger"></i> Click
            <i class="fa fa-circle text-warning"></i> Click Second Time
          </div>
        </chart-card>
      </div>

      <div class="col-md-12 col-xs-12">
        <chart-card :chart-data="activityChart.data" :chart-options="activityChart.options">
          <h4 class="title" slot="title">Current Prices</h4>
          <span slot="subTitle"> All products including Taxes</span>
          <span slot="footer">
            <i class="ti-check"></i> Data information certified</span>
          <div slot="legend">
            <i class="fa fa-circle text-info"></i> Bitcoin
            <i class="fa fa-circle text-warning"></i> Litecoin
          </div>
        </chart-card>
      </div>

    </div>

    <div class="row" v-if="!loading">
      <div class="col-md-6 col-xs-12">
        <chart-card :chart-data="investmentsChartData" :chart-options="investmentsChartOptions" chart-type="Pie">
          <h4 class="title" slot="title">Investments</h4>
          <span slot="subTitle">Investments till now</span>
          <span slot="footer"><i class="ti-timer"></i> Last investment 2 days ago</span>

          <div slot="legend">
            <!-- investmentsChartData -->
            <span v-for="currency in investmentsChartData.labels"><i class="fa fa-circle text-info"></i> {{currency}}</span>
          </div>
        </chart-card>
      </div>
      <div class="col-md-6 col-xs-12">
        <div class="card">
          <paper-table title="Investments" sub-title="" :data="investmentsTableData" :columns="investmentsTableColumns"></paper-table>

          <div class="row">
            <div class="col-xs-4 col-xs-offset-2 text-center">
              <button type="submit" class="btn btn-lg btn-block btn-success btn-fill" @click.prevent="buy">
                Buy
              </button>
            </div>
            <div class="col-xs-4 text-center">
              <button type="submit" class="btn btn-lg btn-block btn-info btn-fill" @click.prevent="sell">
                Sell
              </button>
              <br>
            </div>
          </div>

          <!-- <div class="footer"></div> -->

          <!-- <paper-table title="Current Prices" sub-title="" :data="currentPricesTableData" :columns="currentPricesTableColumns"></paper-table> -->

        </div> <!-- card -->
      </div>

    </div> <!-- row -->

  </div>
</template>
<script>
  import StatsCard from 'components/UIComponents/Cards/StatsCard.vue'
  import ChartCard from 'components/UIComponents/Cards/ChartCard.vue'
  import PaperTable from 'components/UIComponents/PaperTable.vue'
  import _ from 'lodash'
  import { mapGetters } from 'vuex'

  export default {
    components: {
      StatsCard,
      ChartCard,
      PaperTable
    },
    /**
     * Chart data used to render stats, charts. Should be replaced with server data
     */
    data () {
      return {
        loading: true,
        usersChart: {
          data: {
            labels: ['9:00AM', '12:00AM', '3:00PM', '6:00PM', '9:00PM', '12:00PM', '3:00AM', '6:00AM'],
            series: [
              [287, 385, 490, 562, 594, 626, 698, 895, 952],
              [67, 152, 193, 240, 387, 435, 535, 642, 744],
              [23, 113, 67, 108, 190, 239, 307, 410, 410]
            ]
          },
          options: {
            low: 0,
            high: 1000,
            showArea: true,
            height: '245px',
            axisX: {
              showGrid: false
            },
            lineSmooth: this.$Chartist.Interpolation.simple({
              divisor: 3
            }),
            showLine: true,
            showPoint: false
          }
        },
        activityChart: {
          data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            series: [
              [542, 543, 520, 680, 653, 753, 326, 434, 568, 610, 756, 895],
              [230, 293, 380, 480, 503, 553, 600, 664, 698, 710, 736, 795]
            ]
          },
          options: {
            seriesBarDistance: 10,
            axisX: {
              showGrid: false
            },
            height: '245px'
          }
        },
        investmentsChartOptions: {
          labelInterpolationFnc (value) {
            return value
          }
          // ,showLabel: false,
          // plugins: [
          //   this.$Chartist.plugins.legend()
          // ]
        },
        investmentsTableColumns: ['Currency', 'Amount', 'Value'],
        currentPricesTableColumns: ['Currency', 'Price']
      }
    },
    computed: {
      investmentsChartData () {
        let data = {
          labels: [],
          series: []
        }

        _.each(this.investments, function (investment) {
          data.labels.push(investment.currency)
          data.series.push(investment.amount)
        })

        return data
      },
      investmentsTableData () {
        let data = []

        if (!this.loading) {
          _.each(this.investments, function (investment) {
            data.push({
              currency: investment.currency,
              amount: investment.amount,
              value: '$' + investment.value
            })
          })
        }

        return data
      },
      currentPricesTableData () {
        let temp = _.map(this.currencyData, function (currency) {
          return {
            currency: currency.name,
            price: currency.price_usd
          }
        })

        console.log('currentPricesTableData: ', temp)
        return temp
      },
      ...mapGetters([
        'virtual_wallet_balance',
        'portfolio_net_worth',
        'investments',
        'currencyData',
        'currencyDataMap'
      ])
    },
    created () {
      this.fetchData()
    },
    watch: {
      // call again the method if the route changes
      '$route': 'fetchData'
    },
    methods: {
      fetchData () {
        let self = this

        this.$store.dispatch('getCurrencyData').then(() => {
          console.log('self.currencyDataMap: ', self.currencyDataMap)
          self.loading = false
        })
      }
    }
    // beforeRouteEnter (to, from, next) {
    //   console.log('Overview beforeRouteEnter, do all the data loading here')

    //   next(vm => {
    //     // vm.$store.dispatch('getCoinPricingHistogram', {coin: 'BTC'})
    //     vm.$store.dispatch('getCurrencyData')
    //   })
    // }

  }

</script>
<style>

</style>
