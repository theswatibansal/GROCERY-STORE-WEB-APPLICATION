export default {
    template: `<div class="p-2">
    
    <h5 style="color:MediumSeaGreen;">Approval for creating category</h5><br><br>
    <div>
    <tr v-for="category in categories" :key="category.cid">
      <h6>Category Name: {{category.categoryName}}</h6>
      <p>Creator: {{category.creator}}</p>
      <button v-if="!category.is_approved && role=='admin'" class="btn btn-success" @click='approveCategory(category)' > Approve </button>
    </tr>
    </div>
    <br>
    <h5 style="color:MediumSeaGreen;">Approval for editing category</h5><br><br>
    <div>
    <tr v-for="category in categories" :key="category.cid">
      <h6>Category Name: {{category.categoryName}}</h6>
      <p>Creator: {{category.creator}}</p>
      <button v-if="!category.edit_approval && role=='admin'" class="btn btn-success" @click='EditApproval(category)'> Approve </button>
    </tr>
    </div>
    <br>
    <h5 style="color:MediumSeaGreen;">Delete category approval</h5><br><br>
    <div>
    <tr v-for="category in categories" :key="category.cid">
      <h6>Category Name: {{category.categoryName}}</h6>
      <p>Creator: {{category.creator}}</p>
      <button v-if="!category.delete_approval && role=='admin'" class="btn btn-success" @click='DeleteApproval(category)'> Approve </button>
    </tr>
    </div>
    </div>`,
    props: ['category'],
    data() {
      return {
        categories: [],
        
        role: localStorage.getItem('role'),
        authToken: localStorage.getItem('auth-token'),
      }
    },
    mounted() {
      // Fetch products when the component is mounted
      this.fetchCategory();
  },
    
    methods: {
      async approveCategory(category) {
        
        const res = await fetch(`/api/categories/${category.cid}/approve`, {
          headers: {
            'Authentication-Token': this.authToken,
          },
        })
        const data = await res.json()
        if (res.ok) {
          alert(data.message)
          this.$router.go(0)
        } else {
          alert(data.message)
        }
      },
      async EditApproval(category) {
        //const cid = localStorage.getItem('cid');
        const res = await fetch(`/api/edit_category/${category.cid}/approve`, {
          headers: {
            'Authentication-Token': this.authToken,
          },
        })
        const data = await res.json()
        if (res.ok) {
          alert(data.message)
          this.$router.go(0)
        } else {
          alert(data.message)
        }
      },
      async DeleteApproval(category) {
        //const cid = localStorage.getItem('cid');
        const res = await fetch(`/api/delete_category/${category.cid}/approve`, {
          headers: {
            'Authentication-Token': this.authToken,
          },
        })
        const data = await res.json()
        if (res.ok) {
          alert(data.message)
          this.$router.go(0)
        } else {
          alert(data.message)
        }
      },
      async fetchCategory() {
        const res = await fetch('/api/category', {
          headers: {
            'Authentication-Token': this.authToken,
          },
        })
        const data = await res.json()
        if (res.ok) {
          this.categories = data
          console.log(data)
        } else {
          alert(data.message)
        }
      },
    },
  }