import DashboardLayout from '../components/Dashboard/Layout/DashboardLayout.vue'
// GeneralViews
import NotFound from '../components/GeneralViews/NotFoundPage.vue'

// Admin pages
import Overview from 'src/components/Dashboard/Views/Overview.vue'
import UserProfile from 'src/components/Dashboard/Views/UserProfile.vue'
import Register from 'src/components/Dashboard/Views/Register.vue'
import Login from 'src/components/Dashboard/Views/Login.vue'
import Notifications from 'src/components/Dashboard/Views/Notifications.vue'
import Icons from 'src/components/Dashboard/Views/Icons.vue'
// import Maps from 'src/components/Dashboard/Views/Maps.vue'
import Typography from 'src/components/Dashboard/Views/Typography.vue'
import Transactions from 'src/components/Dashboard/Views/Transactions.vue'

const routes = [
  {
    path: '/',
    component: DashboardLayout,
    children: [
      {
        path: '/',
        name: 'overview',
        component: Overview,
        meta: { requiresAuth: true }
      },
      {
        path: 'login',
        name: 'login',
        component: Login,
        meta: { requiresNoAuth: true }
      },
      {
        path: 'register',
        name: 'register',
        component: Register,
        meta: { requiresNoAuth: true }
      },
      {
        path: 'settings',
        name: 'settings',
        component: UserProfile,
        meta: { requiresAuth: true }
      },
      {
        path: 'notifications',
        name: 'notifications',
        component: Notifications,
        meta: { requiresAuth: true }
      },
      {
        path: 'icons',
        name: 'icons',
        component: Icons
      },
      // {
      //   path: 'maps',
      //   name: 'maps',
      //   component: Maps
      // },
      {
        path: 'typography',
        name: 'typography',
        component: Typography
      },
      {
        path: 'transactions',
        name: 'transactions',
        component: Transactions,
        meta: { requiresAuth: true }
      }
    ]
  },
  { path: '*', component: NotFound }
]

/**
 * Asynchronously load view (Webpack Lazy loading compatible)
 * The specified component must be inside the Views folder
 * @param  {string} name  the filename (basename) of the view to load.
function view(name) {
   var res= require('../components/Dashboard/Views/' + name + '.vue');
   return res;
};**/

export default routes
