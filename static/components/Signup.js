export default {
    template: `
    <div class='d-flex justify-content-center' style="margin-top: 25vh">
    <div class="mb-3 p-5 bg-light">
    <div class="register" id="signup">
        <label for="name" class="form-label">Name</label>
        <input type="text" class="form-control" v-model="name" placeholder="Enter Name" />
        <label for="username" class="form-label">Username</label>
        <input type="text" class="form-control" v-model="username" placeholder="Enter Username" />
        <label for="email" class="form-label">Email</label>
        <input type="text" class="form-control" v-model="email" placeholder="Enter Email" />
        <label for="password" class="form-label">Password</label>
        <input type="password" class="form-control" v-model="password" placeholder="Enter Password" />
        <label for="city" class="form-label">City</label>
        <input type="text" v-model="city" placeholder="Enter City" />
        <label for="state" class="form-label">State</label>
        <input type="text" v-model="state" placeholder="Enter State" />
        <label for="country" class="form-label">Country</label>
        <input type="text" v-model="country" placeholder="Enter Country" />
        <label for="pincode" class="form-label">Pincode</label>
        <input type="text" v-model="pincode" placeholder="Enter Pincode" />
        <br>
        <label for="address" class="form-label">Address</label>
        <input type="text" class="form-control" v-model="address" placeholder="Enter Address" />
        <label for="mobileNo" class="form-label">Mobile No</label>
        <input type="text" class="form-control" v-model="mobileNo" placeholder="Enter mobileNo" />

        <button v-on:click="signUp" type="submit">Sign Up</button>
        <p>
        <router-link to="/login" >Login</router-link>
        </p>

    </div>
    </div>
    </div>
    `,
    data()
        {
            return {
                name: '',
                username: '',
                email: '',
                password: '',
                city: '',
                state: '',
                country: '',
                pincode: '',
                address: '',
                mobileNo: ''
            }
        },
        methods:{
          async signUp()
          {   const url = "http://127.0.0.1:5000/api/signup"
              const data = {
                 name:this.name,
                 username:this.username,
                 email:this.email,
                 password:this.password,
                 city:this.city,
                 state:this.state,
                 country:this.country,
                 pincode:this.pincode,
                 address:this.address,
                 mobileNo:this.mobileNo
              };
              const config = {
                  headers: {
                      "Content-Type": "application/json",
                  },
              };
              let result = await axios.post(url, data, config)


              console.warn(result);
              if(result.status==201){
                  this.$router.push('/login')
              }
          }
      }
}

