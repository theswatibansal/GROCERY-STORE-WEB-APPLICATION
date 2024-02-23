export default {
  template: `
  <div class='d-flex justify-content-center' style="margin-top: 25vh">
    <div class="mb-3 p-5 bg-light">
        <div class='text-danger'>*{{error}}</div>
        <label for="user-username" class="form-label">Username</label>
        <input type="username" class="form-control" id="user-username" placeholder="username" v-model="cred.username">
        <label for="user-password" class="form-label">Password</label>
        <input type="password" class="form-control" id="user-password" v-model="cred.password">
        <button class="btn btn-primary mt-2" @click='login' > Login </button>
        
    </div> 
  </div>
  `,
  data() {
    return {
      cred: {
        username: null,
        password: null,
      },
      error: null,
    }
  },
  methods: {
    async login() {
      const res = await fetch('/api/user-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(this.cred),
      })
      const data = await res.json()
      if (res.ok) {
        localStorage.setItem('auth-token', data.token)
        console.log(data.token)
        localStorage.setItem('role', data.role)
        localStorage.setItem('user_id', data.user_id)

        this.$router.push({ path: '/' })
      } else {
        this.error = data.message
      }
    },
  },
}