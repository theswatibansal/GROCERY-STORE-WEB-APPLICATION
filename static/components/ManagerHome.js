const ManagerHome = {

  template:` <div style="font-family: Arial, sans-serif;">
  <h1 style="font-size: 24px; margin-bottom: 20px;">{{ msg }}</h1>
  <h3>Available Product</h3>
  <table style="width: 100%; border-collapse: collapse;">
    <tr>
    <th style="background-color: violet; color: white; padding: 10px;">Product ID</th>
    <th style="background-color: violet; color: white; padding: 10px;">Name</th>
    <th style="background-color: violet; color: white; padding: 10px;">Quantity</th>
    <th style="background-color: violet; color: white; padding: 10px;">Unit</th>
    <th style="background-color: violet; color: white; padding: 10px;">Price</th>
    <th style="background-color: violet; color: white; padding: 10px;">Manufacture Date</th>
    <th style="background-color: violet; color: white; padding: 10px;">Expiry Date</th>
    <th style="background-color: violet; color: white; padding: 10px;">Category Id</th>
    <th style="background-color: violet; color: white; padding: 10px;">Actions</th>
    </tr>
    <tr v-for="product in Products" :key="product.pid">
      <td style="text-align:center; padding: 10px;">{{ product.pid }}</td>
      <td style="text-align:center; padding: 10px;">{{ product.productName }}</td>
      <td style="text-align:center; padding: 10px;">{{ product.quantity }}</td>
      <td style="text-align:center; padding: 10px;">{{ product.unit }}</td>
      <td style="text-align:center; padding: 10px;">{{ product.price }}</td>
      <td style="text-align:center; padding: 10px;">{{ product.manufacture_date}}</td>
      <td style="text-align:center; padding: 10px;">{{ product.expiry_date}}</td>
      <td style="text-align:center; padding: 10px;">{{ product.category_id}}</td>

      <td style="padding: 12px; text-align:center;">
        <button @click="openEditModal(product)" style="background-color: lightgreen; text-align:center;color: white; border: none; border-radius: 5px; cursor: pointer;">Edit</button>
        <button @click="confirmProDelete(product.pid)" style="background-color: orange; text-align:center;color: white; border: none; border-radius: 5px; cursor: pointer;">Delete</button>
        </td>
    </tr>
  </table>

  <div v-if="editModalOpen" class="modal" style="display: block; position: fixed; z-index: 1; padding-top: 100px; left: 0; top: 0; width: 100%; height: 100%; overflow: auto; background-color: rgba(0, 0, 0, 0.4);">
    <div class="modal-content" style="background-color: #fefefe; margin: auto; padding: 20px; border: 1px solid #888; width: 80%;">
      <h3>Edit Product</h3>
      <form @submit.prevent="updateProduct"> 
        <label for="edit-name">Name:</label>
        <input type="text" id="edit-name" v-model="editedProduct.name" required style="padding: 10px; margin-bottom: 10px;">
        <label for="edit-quantity">Quantity:</label>
        <input type="number" id="edit-quantity" v-model="editedProduct.quantity" required style="padding: 10px; margin-bottom: 10px;">
        <label for="edit-unit">Unit:</label>
        <input type="text" id="edit-unit" v-model="editedProduct.unit" required style="padding: 10px; margin-bottom: 10px;">
        <label for="edit-price">Price:</label>
        <input type="number" id="edit-price" v-model="editedProduct.price" required style="padding: 10px; margin-bottom: 10px;">
        <label for="edit-manufacture_date">Manufacture Date:</label>
        <input type="text" id="edit-manufacture_date" v-model="editedProduct.manufacture_date" required style="padding: 10px; margin-bottom: 10px;">
        <label for="edit-expiry_date">Expiry Date:</label>
        <input type="text" id="edit-expiry_date" v-model="editedProduct.expiry_date" required style="padding: 10px; margin-bottom: 10px;">
        <label for="edit-category_id">Category Id:</label>
        <input type="text" id="edit-category_id" v-model="editedProduct.category_id" required style="padding: 10px; margin-bottom: 10px;">
        <button type="submit" style="padding: 10px 20px; background-color: #007bff; color: #fff; border: none; border-radius: 5px; cursor: pointer; margin-right: 10px;">Update</button>
        <button type="button" @click="closeEditModal" style="padding: 10px 20px; background-color: #dc3545; color: #fff; border: none; border-radius: 5px; cursor: pointer;">Cancel</button>
        </form>
    </div>
  </div>
 
<button type="button" @click="openCreateProductPopup" style="padding: 10px 20px; background-color: #007bff; color: #fff; border: none; border-radius: 5px; cursor: pointer;">Create New Product</button>
<div v-if="createProductPopup" class="modal" style="display: block; position: fixed; z-index: 1; padding-top: 100px; left: 0; top: 0; width: 100%; height: 100%; overflow: auto; background-color: rgba(0, 0, 0, 0.4);">
<div class="modal-content" style="background-color: #fefefe; margin: auto; padding: 20px; border: 1px solid #888; width: 50%;">
  <h3>Create New Product</h3>
  <form @submit.prevent="createProduct">
    <div style="margin-bottom: 10px;">
        <label for="name">Name:</label>
        <input type="text" id="name" v-model="newProduct.name" required style="padding: 5px;">
      </div>
      <div style="margin-bottom: 10px;">
        <label for="quantity">Quantity:</label>
        <input type="number" id="quantity" v-model="newProduct.quantity" required style="padding: 5px;">


        <label for="unit">Unit:</label>
        <input type="text" id="unit" v-model="newProduct.unit" required style="padding: 5px;">
      </div>
      <div style="margin-bottom: 10px;">
        <label for="price">Price in Rs:</label>
        <input type="number" id="price" v-model="newProduct.price" required style="padding: 5px;">


        <label for="manufacture_date">Manufacture Date:</label>
        <input type="text" id="manufacture_date" v-model="newProduct.manufacture_date" required style="padding: 5px;">
      </div>
      <div style="margin-bottom: 10px;">
        <label for="expiry_date">Expiry Date:</label>
        <input type="text" id="expiry_date" required v-model="newProduct.expiry_date" style="padding: 5px;">
        </div>
        <div style="margin-bottom: 10px;">
        <label for="category_id">Category Id:</label>
        <input type="number" id="category_id" v-model="newProduct.category_id" style="padding: 5px;">
      </div>

    <div style="display: flex; justify-content: space-between;">
      <button type="submit" style="padding: 10px 20px; background-color: #007bff; color: #fff; border: none; border-radius: 5px; cursor: pointer;">Create Category</button>
      <button type="button" @click="closeCreateProductPopup" style="padding: 10px 20px; background-color: #dc3545; color: #fff; border: none; border-radius: 5px; cursor: pointer;">Cancel</button>
    </div>
  </form>
</div>
</div>
<br>
<br><div><button style="background-color: green; text-align:center;color: #fff; border: none; border-radius: 5px; cursor: pointer;" @click='downlod'>Export csv</button><span v-if='isWaiting'> Waiting... </span></div>

</div>`,

  
  data(){
      return {
        Products: [],
          msg:"",
          isWaiting: false,
          
          newProduct:{
            name:"",
            quantity:0,
            unit:"",
            price:0,
            manufacture_date:"",
            expiry_date:"",
            category_id:1,
        },
          token: localStorage.getItem('auth-token'),

          editModalOpen: false,
     
    editedProduct:{
      id:null,
      name:"",
      quantity:0,
      unit:"",
      price:0,
      manufacture_date:"",
      expiry_date:"",

        },
    createProductPopup: false,
     
  };
},

  mounted() {
      
      this.fetchProducts(); 
    },
  methods: {
      
      openCreateProductPopup() {
        this.createProductPopup = true;
      },
  
      closeCreateProductPopup() {
        this.createProductPopup = false;
      },

      
          
      fetchProducts() {
         
          fetch('/api/product', {
            headers: {
              'Authentication-Token': this.token,
            },
          })
          
            .then(response => response.json())
            .then(data => {
              this.Products = data;
              console.log(data)
            })
            .catch(error => {
              console.error('Error:', error);
            });
        },
      
      


      DeleteProduct(id) {
        
        fetch(`/api/product/${id}`, {
          method: 'DELETE',
          headers: {
            'Authentication-Token': this.token,
          },
        })
          .then(response => response.json())
          .then(data => {
            
            console.log('Product deleted:', data);
            this.msg=data.message;
            this.fetchProducts(); 
          })
          .catch(error => {
            console.error('Error:', error);
          });
      },

      confirmProDelete(id) {
        if (window.confirm('Are you sure you want to delete this Product?')) {
          this.DeleteProduct(id);
        }
      },

      
      

      openEditModal(product) {
        this.editedProduct.id = product.pid;
        this.editedProduct.name = product.productName;
        this.editedProduct.quantity=product.quantity;
        this.editedProduct.unit=product.unit;
        this.editedProduct.price=product.price;
        this.editedProduct.manufacture_date=product.manufacture_date;
        this.editedProduct.expiry_date=product.expiry_date;
        this.editedProduct.category_id=product.category_id;
        this.editModalOpen = true;
      },

      closeEditModal() {
        this.editModalOpen = false;
      },

      updateProduct() {
        const id = this.editedProduct.id;
        const { name, quantity, unit, price, manufacture_date, expiry_date, category_id } = this.editedProduct;
      
        
        fetch(`/api/product/${id}`, {
          method: 'PUT',
          headers: {
            'Authentication-Token': this.token,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ productName: name, quantity: quantity, unit: unit, price: price, manufacture_date: manufacture_date, expiry_date: expiry_date, category_id: category_id  }),
        })
          .then(response => response.json())
          .then(data => {
           
            console.log('Product updated:', data);
            this.fetchProducts(); 
            this.closeEditModal();
          })
          .catch(error => {
            console.error('Error:', error);
          });
      },
   
      createProduct() {
        
        fetch('/api/product', {
          method: 'POST',
          headers: {
            'Authentication-Token': this.token,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            productName: this.newProduct.name,
            quantity: this.newProduct.quantity,
            unit: this.newProduct.unit,
            price: this.newProduct.price,
            manufacture_date: this.newProduct.manufacture_date,
            expiry_date: this.newProduct.expiry_date,
            category_id: this.newProduct.category_id,
          }),
        })
          .then(response => response.json())
          .then(data => {
          console.log('product created:', data);
            this.fetchProducts();
            this.newProduct.name="";
            this.closeCreateProductPopup();
         })
          .catch(error => {
            console.error('Error:', error);
          });
      },

      async downlod() {
        this.isWaiting = true
        const res = await fetch('/download-csv')
        const data = await res.json()
        if (res.ok) {
          const taskId = data['task-id']
          const intv = setInterval(async () => {
            const csv_res = await fetch(`/get-csv/${taskId}`)
            if (csv_res.ok) {
              this.isWaiting = false
              clearInterval(intv)
              window.location.href = `/get-csv/${taskId}`
            }
          }, 1000)
        }
      },
    },

    
  }
  
  export default ManagerHome
  
  
