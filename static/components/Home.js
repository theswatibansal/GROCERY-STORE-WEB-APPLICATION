import AdminHome from './AdminHome.js'
import ManagerHome from './ManagerHome.js'
import UserDashboard from './UserDashboard.js'



export default {
  template: `<div>
  <UserDashboard v-if="userRole=='user'"/>
  <AdminHome v-if="userRole=='admin'" />
  <ManagerHome v-if="userRole=='manager'" />
  
  
  </div>`,

  data() {
    return {
      userRole: localStorage.getItem('role'),
      
    }
  },

  components: {
    AdminHome,
    ManagerHome,
    UserDashboard,
    
  },

  
}
