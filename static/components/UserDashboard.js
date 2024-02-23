const UserDashboard = {

  template:` <div>
  <p>Welcome User<p>
  <h1 style="font-size: 24px; margin-bottom: 20px;">{{ msg }}</h1>
  <h3 style="color:MediumSeaGreen;">AVAILABLE PRODUCTS</h3>
  <br><br>
  
    <div v-for="(product, index) in products" :key="index" class="card mb-3" style="width: 18rem;">
      <h5 class="card-title">Product Name: {{ product.productName }}</h5>
      <h6 class="card-title">Product Id: {{ product.pid }}</h6>
      <h6 class="card-subtitle mb-2 text-muted">Price: {{ product.price }}</h6>
      <h6 class="card-subtitle mb-2 text-muted">Unit: {{ product.unit }}</h6>
      <h6 class="card-subtitle mb-2 text-muted">Available Quantity: {{ product.quantity }}</h6>
      
      <label for="quantityinput">Quantity:</label>
      <input id="quantityinput" type="number"  v-model="product.quantityinput" />
      <button type="submit" @click=addToCart(product) style="padding: 10px 20px; background-color: #007bff; color: #fff; border: none; border-radius: 5px; cursor: pointer;">Add to cart</button>
       
    </div>
  

  </div>`,
    data() {
      return {
        products: [],
        msg:"",
        
        token: localStorage.getItem('auth-token'),
    };
  },
    mounted() {
        // Fetch products when the component is mounted
        this.fetchProducts();
    },
    methods: {
      fetchProducts() {
         
        fetch('/api/product', {
          headers: {
            'Authentication-Token': localStorage.getItem('auth-token'),
          },
        })
        
          .then(response => response.json())
          .then(data => {
            this.products = data;
            

            console.log(localStorage.getItem('auth-token'))
          })
          .catch(error => {
            console.error('Error:', error);
          });
      },

      addToCart(product) {
        const data = {
          user_id: localStorage.getItem('user_id'),
          product_id: product.pid,
          productQuantity: product.quantityinput || 1,
        };
         
        
        fetch(`http://127.0.0.1:5000/api/cart`, {
          method: 'POST',
          headers: {
            'Authentication-Token': localStorage.getItem('auth-token'),
            'Content-Type': 'application/json',
          }, body:JSON.stringify(data),
        })
          
          .then(response => response.json())
            .then(data => {
            //console.log(response.data);
            console.log(data);

            alert('Product added to cart successfully!');
          })
          .catch(error => {
            console.error(error);
            console.log(JSON.stringify(data));

            alert('Error adding product to cart.');
          });
      },

      
      
    },

}
export default UserDashboard





