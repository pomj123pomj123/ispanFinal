<template>
  <div>
    <h1>餐廳外帶客人</h1>

    <!-- Create Customer Button -->
    <div>
      <h2>新增訂單資料</h2>
      <button @click="showCreateCustomerModal">新增</button>
    </div>

    <!-- Find Customer By ID -->
    <div>
      <h2>查詢顧客資料</h2>
      <input type="number" v-model="findCustomerId">
      <button @click="findCustomer">查詢</button>
    </div>

    <!-- Customers List -->
    <div>
      <h2>顧客列表</h2>
      <table border="1">
        <thead>
          <tr>
            <!-- <th>預訂時間</th>
            <th>取餐時間</th>
            <th>菜單名稱</th>
            <th>價格</th> -->
            <th>姓氏</th>
            <th>名字</th>
            <th>手機</th>
            <th>電子郵件</th>
            <th>備註</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="customer in customers" :key="customer.recId">
            <!-- <td>{{ customer.reserveTime }}</td>
            <td>{{ customer.pickTime }}</td>
            <td>{{ customer.menuName }}</td>
            <td>{{ customer.price }}</td> -->
            <td>{{ customer.lastName }}</td>
            <td>{{ customer.firstName }}</td>
            <td>{{ customer.cellphone }}</td>
            <td>{{ customer.email }}</td>
            <td>{{ customer.remark }}</td>
            <td>
              <button @click="editCustomer(customer)">編輯</button>
              <button @click="deleteCustomer(customer.recId)">刪除</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Edit Customer Form -->
    <div v-if="editMode">
      <h2>編輯顧客</h2>
      <form @submit.prevent="updateCustomer">
        <div>
          <label for="firstName">名字:</label>
          <input type="text" v-model="selectedCustomer.firstName" required>
        </div>
        <div>
          <label for="lastName">姓氏:</label>
          <input type="text" v-model="selectedCustomer.lastName" required>
        </div>
        <div>
          <label for="email">Email:</label>
          <input type="email" v-model="selectedCustomer.email" required>
        </div>
        <div>
          <label for="cellphone">手機號碼:</label>
          <input type="text" v-model="selectedCustomer.cellphone" required>
        </div>
        <div>
          <label for="cellphone">菜品:</label>
          <input type="text" v-model="selectedCustomer.menuName" required>
        </div>
        <button type="submit">更新</button>
      </form>
    </div>

  </div>
</template>

<script>
import Swal from "sweetalert2";
import axiosapi from "@/plugins/axios.js";
import { ref, onMounted } from "vue";

export default {
  setup() {
    const customers = ref([]);
    const newCustomer = ref({ firstName: '', lastName: '', email: '', cellphone: '' ,menuName:''});
    const selectedCustomer = ref(null);
    const editMode = ref(false);
    const findCustomerId = ref(null);
    const foundCustomer = ref(null);

    function fetchCustomers() {
      axiosapi.get('/restaurant/RestaurantCustomerCKY/all')
        .then(function(response) {
          customers.value = response.data;
        })
        .catch(function(error) {
          Swal.fire('Error', 'There was an error fetching the customers!', 'error');
          console.error('There was an error fetching the customers!', error);
        });
    }

    function createCustomer() {
      axiosapi.post('/restaurant/RestaurantCustomerCKY/create', newCustomer.value)
        .then(function(response) {
          customers.value.push(response.data);
          newCustomer.value = { firstName: '', lastName: '', email: '', cellphone: '' };
          Swal.fire('Success', 'Customer created successfully!', 'success');
        })
        .catch(function(error) {
          Swal.fire('Error', 'There was an error creating the customer!', 'error');
          console.error('There was an error creating the customer!', error);
        });
    }

    function showCreateCustomerModal() {
      Swal.fire({
        title: '新增顧客資料',
        html:
          '<div>' +
          '<label for="lastName">姓氏:</label>' +
          '<input id="lastName" type="text" class="swal2-input" v-model="newCustomer.lastName" required>' +
          '</div>' +
          '<div>' +
          '<label for="firstName">名字:</label>' +
          '<input id="firstName" type="text" class="swal2-input" v-model="newCustomer.firstName" required>' +
          '</div>' +
          '<div>' +
          '<label for="email">Email:</label>' +
          '<input id="email" type="email" class="swal2-input" v-model="newCustomer.email" required>' +
          '</div>' +
          '<div>' +
          '<label for="cellphone">手機號碼:</label>' +
          '<input id="cellphone" type="text" class="swal2-input" v-model="newCustomer.cellphone" required>' +
          '</div>' +
          '<div>' +
          '<label for="cellphone">菜品:</label>' +
          '<input id="menuName" type="text" class="swal2-input" v-model="newCustomer.menuName" required>' +
          '</div>',
        focusConfirm: false,
        preConfirm: () => {
          return {
            lastName: document.getElementById('lastName').value,
            firstName: document.getElementById('firstName').value,
            email: document.getElementById('email').value,
            cellphone: document.getElementById('cellphone').value
          };
        }
      }).then((result) => {
        if (result.isConfirmed) {
          Object.assign(newCustomer.value, result.value);
          createCustomer();
        }
      });
    }

    function editCustomer(customer) {
      selectedCustomer.value = { ...customer };
      editMode.value = true;
    }

    function updateCustomer() {
      axiosapi.put('/restaurant/RestaurantCustomerCKY/update', selectedCustomer.value)
        .then(function(response) {
          const index = customers.value.findIndex(function(c) {
            return c.recId === selectedCustomer.value.recId;
          });
          if (index !== -1) {
            customers.value[index] = response.data;
          }
          selectedCustomer.value = null;
          editMode.value = false;
          Swal.fire('Success', 'Customer updated successfully!', 'success');
        })
        .catch(function(error) {
          Swal.fire('Error', 'There was an error updating the customer!', 'error');
          console.error('There was an error updating the customer!', error);
        });
    }

    function deleteCustomer(recId) {
      axiosapi.delete(`/restaurant/RestaurantCustomerCKY/delete/${recId}`)
        .then(function() {
          customers.value = customers.value.filter(function(c) {
            return c.recId !== recId;
          });
          Swal.fire('Success', 'Customer deleted successfully!', 'success');
        })
        .catch(function(error) {
          Swal.fire('Error', 'There was an error deleting the customer!', 'error');
          console.error('There was an error deleting the customer!', error);
        });
    }

    function findCustomer() {
      axiosapi.get(`/restaurant/RestaurantCustomerCKY/${findCustomerId.value}`)
        .then(function(response) {
          foundCustomer.value = response.data;
          Swal.fire({
            title: '顧客資料',
            html: `<p>名字: ${foundCustomer.value.firstName}</p><p>姓氏: ${foundCustomer.value.lastName}</p><p>Email: ${foundCustomer.value.email}</p><p>手機號碼: ${foundCustomer.value.cellphone}</p>`
          });
        })
        .catch(function(error) {
          Swal.fire('Error', 'There was an error finding the customer!', 'error');
          console.error('There was an error finding the customer!', error);
        });
    }

    onMounted(fetchCustomers);

    return {
      customers,
      newCustomer,
      selectedCustomer,
      editMode,
      findCustomerId,
      foundCustomer,
      createCustomer,
      editCustomer,
      updateCustomer,
      deleteCustomer,
      findCustomer,
      showCreateCustomerModal
    };
  }
};
</script>

<style scoped>
.col-id{
        width: 3%;
    }
    .col-type {
        width: 10%;
    }
    .col-title {
        width: 20%;
    }
    .col-date {
        width: 12%;
    }
    .col-button {
        width: 5%;
    }

/* 暫時的格式 */
    table {
    width: 100%;
    border-collapse: collapse;
    }

    th, td {
    border: 1px solid #ddd;
    padding: 8px;
    }
    th {
    background-color: #f4f4f4;
    }

    button {
    cursor: pointer;
    }

    .table-primary {
    background-color:#D2E9FF; /* 將表格背景色設置為白色 */
}

.table-primary th,
.table-primary td {
    border: 1px solid #b9adad;
    padding: 8px;
}

.table-primary th {
    background-color: #66B3FF;
}

</style>
