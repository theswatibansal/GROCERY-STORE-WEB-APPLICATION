const Category = {

  template:` <div>
  <p>Welcome Admin<p>
  <h1>{{ msg }}</h1>
  <h3>Available Category</h3>
  <table style="width: 100%; border-collapse: collapse;">
    <tr>
      <th style="background-color: violet; color: white; padding: 10px;">Category ID</th>
      <th style="background-color: violet; color: white; padding: 10px;">Category Name</th>
      <th style="background-color: violet; color: white; padding: 10px;">Actions</th>
    </tr>
    <tr v-for="category in categories" :key="category.cid">
      <td style="text-align:center; padding: 10px;">{{ category.cid }}</td>
      <td style="text-align:center; padding: 10px;">{{ category.categoryName }}</td>
      <td style="text-align:center; padding: 10px;">
        <button @click="editCategory(category)" style="background-color: lightgreen; text-align:center;color: white; border: none; border-radius: 5px; cursor: pointer;">Edit</button>
        <button @click="deleteCategory(category.cid)" style="background-color: orange; text-align:center;color: white; border: none; border-radius: 5px; cursor: pointer;">Delete</button>
        </td>
    </tr>
  </table>

  <div v-if="editModalOpen" class="modal" style="display: block; position: fixed; z-index: 1; padding-top: 100px; left: 0; top: 0; width: 100%; height: 100%; overflow: auto; background-color: rgba(0, 0, 0, 0.4);">
    <div class="modal-content" style="background-color: #fefefe; margin: auto; padding: 20px; border: 1px solid #888; width: 80%;">
      <h3>Edit Category</h3>
      <form @submit.prevent="updateCategory"> 
        <label for="edit-name">Category Name:</label>
        <input type="text" id="edit-name" v-model="editedCategory.name" required style="padding: 10px; margin-bottom: 10px;">
        <button type="submit" style="padding: 10px 20px; background-color: #007bff; color: #fff; border: none; border-radius: 5px; cursor: pointer; margin-right: 10px;">Update</button>
        <button type="button" @click="closeEditModal" style="padding: 10px 20px; background-color: #dc3545; color: white; border: none; border-radius: 5px; cursor: pointer;">Cancel</button>
        </form>
    </div>
  </div>
 
<button type="button" @click="openCreateCategory" style="padding: 10px 20px; background-color: #007bff; color: #fff; border: none; border-radius: 5px; cursor: pointer;">Create New Category</button>
<div v-if="createCategoryPopup" class="modal" style="display: block; position: fixed; z-index: 1; padding-top: 100px; left: 0; top: 0; width: 100%; height: 100%; overflow: auto; background-color: rgba(0, 0, 0, 0.4);">
<div class="modal-content" style="background-color: #fefefe; margin: auto; padding: 20px; border: 1px solid #888; width: 50%;">
  <h3>Create New Category</h3>
  <form @submit.prevent="createCategory">
    <div style="margin-bottom: 10px;">
      <label for="category">Category Name:</label>
      <input type="text" id="category" v-model="newCategory.name" required style="padding: 10px;">
    </div>
    <div style="display: flex; justify-content: space-between;">
      <button type="submit" style="padding: 10px 20px; background-color: #007bff; color: #fff; border: none; border-radius: 5px; cursor: pointer;">Create Category</button>
      <button type="button" @click="closeCreateCategory" style="padding: 10px 20px; background-color: #dc3545; color: #fff; border: none; border-radius: 5px; cursor: pointer;">Cancel</button>
    </div>
  </form>
</div>
</div>
</div>`,

  
  data(){
      return {
        categories: [],
          msg:"",
          
          newCategory: {
            name: '',
          },
          token: localStorage.getItem('auth-token'),

          editModalOpen: false,
    editedCategory: {
      id: null,
      name: '',
    },
    createCategoryPopup: false,
     
  };
},

  mounted() {
      
      this.fetchCategories(); 
    },
  methods: {
      
      openCreateCategory() {
        this.createCategoryPopup = true;
      },
  
      closeCreateCategory() {
        this.createCategoryPopup = false;
      },

      
          
      fetchCategories() {
         
          fetch('/api/approve_category', {
            headers: {
              'Authentication-Token': this.token,
            },
          })
          
            .then(response => response.json())
            .then(data => {
              this.categories = data;
            })
            .catch(error => {
              console.error('Error:', error);
            });
        },
      
      


      DeleteCategory(id) {
        
        fetch(`/api/approve_category/${id}`, {
          method: 'DELETE',
          headers: {
            'Authentication-Token': this.token,
          },
        })
          .then(response => response.json())
          .then(data => {
            
            console.log('Category deleted:', data);
            this.msg=data.message;
            this.fetchCategories(); 
          })
          .catch(error => {
            console.error('Error:', error);
          });
      },

      deleteCategory(id) {
        if (window.confirm('Are you sure you want to delete this category?')) {
          this.DeleteCategory(id);
        }
      },

      
      

      editCategory(category) {
        this.editedCategory.id = category.cid;
        this.editedCategory.name = category.categoryName;
        this.editModalOpen = true;
      },

      closeEditModal() {
        this.editModalOpen = false;
      },

      updateCategory() {
        const id = this.editedCategory.id;
        const { name } = this.editedCategory;
      
        
        fetch(`/api/approve_category/${id}`, {
          method: 'PUT',
          headers: {
            'Authentication-Token': this.token,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ categoryName: name }),
        })
          .then(response => response.json())
          .then(data => {
           
            console.log('Category updated:', data);
            this.fetchCategories(); 
            this.closeEditModal();
          })
          .catch(error => {
            console.error('Error:', error);
          });
      },
   
      createCategory() {
        
        fetch('/api/approve_category', {
          method: 'POST',
          headers: {
            'Authentication-Token': this.token,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            categoryName: this.newCategory.name,
          }),
        })
          .then(response => response.json())
          .then(data => {
          console.log('Category created:', data);
            this.fetchCategories();
            this.newCategory.name="";
            this.closeCreateCategoryPopup();
            //localStorage.setItem('cid', data.cid)
         })
          .catch(error => {
            console.error('Error:', error);
          });
      },
    },

    
  }
  
  export default Category
  
 
    
    