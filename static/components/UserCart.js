const UserCart = {

  template:` <div style="font-family: Arial, sans-serif;">
  <h1 style="font-size: 24px; margin-bottom: 20px;">{{ msg }}</h1>
  <h3 style="color:MediumSeaGreen;">SHOPPING CART</h3>
  <br><br>

  <div v-for="(cart, index) in cartItems" :key="index"  class="card mb-3" style="width: 18rem;">
        <h5 class="card-title">Cart ID: {{ cart.cart_id }}</h5><br>

        <div v-for="(item, itemIndex) in cart.cart_items" :key="itemIndex" class="card-body">
            <h6 class="card-title">Product ID: {{ item.product_id }}</h6>
            <h6 class="card-subtitle mb-2 text-muted">Quantity: {{ item.quantity }}</h6>
            <h6 class="card-subtitle mb-2 text-muted">Price: {{ item.price }}</h6>
            <h6 class="card-subtitle mb-2 text-muted">Total: {{ item.quantity*item.price }}</h6>
            
        </div>
        <h6 class="card-subtitle mb-2 text-muted">Total payable amount: {{ calculateCartTotal(cart.cart_items) }} </h6> 
    </div>
  <br><br>
  
  <br><br>
  <button @click="placeOrder" type="submit" style="padding: 10px 20px; background-color: #007bff; color: #fff; border: none; border-radius: 5px; cursor: pointer;">Place Order</button>
  

  </div>`,
    data() {
      return {
        cartItems: [],
        msg:"",
        token: localStorage.getItem('auth-token'),
    };
  },
  mounted() {
    // Fetch products when the component is mounted
    this.fetchCartItems();
},
    methods: {

      calculateCartTotal(cartItems) {
        let cartTotal = 0;
  
        cartItems.forEach(item => {
            cartTotal += item.quantity * item.price;
        });
  
        return cartTotal;
    } ,

      fetchCartItems() {
        const user_id = localStorage.getItem('user_id');

        axios.get(`http://127.0.0.1:5000/api/cart/${user_id}`, {
                headers: {
                    'Authentication-Token': this.token,
                }
            })
            .then(response => {
                this.cartItems = response.data.cart_items;
                console.log(response.data.cart_items)
            })
            .catch(error => {
                console.error('Error fetching cart items:', error);
            });
    },

    placeOrder() {
      const user_id = localStorage.getItem('user_id'); 
   
    fetch(`http://127.0.0.1:5000/api/order/${user_id}`, {
          method: 'POST',
          headers: {
            'Authentication-Token': localStorage.getItem('auth-token'),
            'Content-Type': 'application/json',
          },
        })
          
          .then(response => response.json())
            .then(data => {
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
export default UserCart


  
 
