export default {
  template: `<div>
  <div v-if="error"> {{error}}</div>
  <div v-for="user in allUsers">
  {{user.username}} 
  <button class="btn btn-primary" v-if='!user.active' @click="approve(user.uid)"> Approve </button></div>
  </div>`,
  data() {
    return {
      allUsers: [],
      token: localStorage.getItem('auth-token'),
      error: null,
    }
  },
  methods: {
    async approve(managerid) {
      const res = await fetch(`/api/activate/manager/${managerid}`, {
        headers: {
          'Authentication-Token': this.token,
        },
      })
      const data = await res.json()
      if (res.ok) {
        alert(data.message)
      }
    },
  },
  async mounted() {
    const res = await fetch('api/users', {
      headers: {
        'Authentication-Token': this.token,
      },
    })
    const data = await res.json().catch((e) => {})
    if (res.ok) {
      console.log(data)
      this.allUsers = data
    } else {
      this.error = res.status
    }
  },
}
