const Order = {

    template:` <div style="font-family: Arial, sans-serif;">
    <h1 style="font-size: 24px; margin-bottom: 20px;">{{ msg }}</h1>
    <h3 style="color:MediumSeaGreen;">YOUR ORDERS</h3>
    <br><br>
    <div  class="card mb-3" style="width: 18rem;" v-for="(order, index) in orderItems" :key="index" >
        <h6 class="card-title">Date: {{ order.date }}</h6>
        <h6 class="card-title">Order ID: {{ order.oid }}</h6>
        <h5 class="card-title">Total: {{ order.total }}</h6><br>

        <div class="card-body" v-for="(item, itemIndex) in order.order_items" :key="itemIndex">
            <p class="card-title">Product ID: {{ item.product_id }}</p>
            <p class="card-subtitle mb-2 text-muted">Quantity: {{ item.quantity }}</p>
            <p class="card-subtitle mb-2 text-muted">Price: {{ item.price }}</p>
            <p class="card-subtitle mb-2 text-muted">Total: {{ item.quantity*item.price }}</p>
            
        </div>
    </div>
    </div>`,
      data() {
        return {
          orderItems: [],
          
          msg:"",
          token: localStorage.getItem('auth-token'),
      };
    },
    mounted() {
        // Fetch products when the component is mounted
        this.fetchOrderItem();
    },
      
      methods: {
        fetchOrderItem() {
            const user_id = localStorage.getItem('user_id');

          axios.get(`http://127.0.0.1:5000/api/order/${user_id}`, {
                  headers: {
                      'Authentication-Token': this.token,
                  }
              })
              .then(response => {
                  this.orderItems = response.data.order_items;
                  console.log(response)
              })
              .catch(error => {
                  console.error('Error fetching orders :', error);
              });
      },
      },
  
  }
  export default Order
  
  