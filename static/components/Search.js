export default {
    template: `<div>
    <h3 style="color:MediumSeaGreen;">SEARCH</h3><br>
    <div>
    <label for="minPrice">Min Price:</label>
    <input type="number" v-model="minPrice" id="minPrice" />

    <label for="maxPrice">Max Price:</label>
    <input type="number" v-model="maxPrice" id="maxPrice" />

    <button @click="searchProducts">Search</button>

    
    </div>

    <div>

    <label for="category">Category:</label>
    <input type="text" v-model="category" id="category" placeholder="Enter category">

    <button @click="search">Search</button>

    <div v-if="error" style="color: red;">
        {{ error }}
    </div>

    <div v-if="products.length > 0">
        <h2>Search Results:</h2>
        <ul>
            <li v-for="product in products">
            <h6>Product Name: {{ product.productName }} </h6>
            <h6>Quantity: {{ product.quantity }}</h6>
            <h6>Unit: {{ product.unit }}</h6>
            <h6>Price: {{ product.price }}</h6>
            <h6>Manufacture Date: {{ product.manufacture_date }}</h6>
            <h6>Expiry Date: {{ product.expiry_date }}</h6>
            <h6>categoryName: {{ product.categoryName }} </h6>
            </li>
        </ul>
    </div>
    </div>
    </div>`,

    data() {
        return {
            products: [],
            minPrice: null,
            maxPrice: null,
            category: '',
            error: ''
    };
},
methods: {
    searchProducts() {
        axios.get(`http://127.0.0.1:5000/api/search?min_price=${this.minPrice}&max_price=${this.maxPrice}`)
            .then(response => {
                this.products = response.data.products;
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    },
    search: function () {
        
        this.products = [];
        this.error = '';

        axios.get(`http://127.0.0.1:5000/api/search?categoryName=${this.category}`)
            .then(response => {
                this.products = response.data.products;
            })
            .catch(error => {
                this.error = 'An error occurred while fetching products';
                console.error(error);
            });
    }
},

  }

