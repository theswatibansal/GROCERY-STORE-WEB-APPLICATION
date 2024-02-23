import Home from './components/Home.js'
import Login from './components/Login.js'
import Signup from './components/Signup.js'
import Users from './components/Users.js'
import ApprovalCategory from './components/ApprovalCategory.js' 
import Category from './components/Category.js'
import Search from './components/Search.js'
import UserCart from './components/UserCart.js'
import Order from './components/Order.js'


const routes = [
  { path: '/', component: Home, name: 'Home' },
  { path: '/login', component: Login, name: 'Login' },
  { path: '/users', component: Users },
  { path: '/signup', component: Signup, name: 'Signup' },
  { path: '/approve_category', component: ApprovalCategory, name: 'ApprovalCategory' },
  { path: '/manager_category', component: Category, name: 'Category' },
  { path: '/search', component: Search, name: 'Search' },
  { path: '/user_cart', component: UserCart, name: 'UserCart' },
  { path: '/order', component: Order, name: 'Order' },
  
]

export default new VueRouter({
  routes,
})
