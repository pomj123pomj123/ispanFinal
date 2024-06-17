<template>
  <div>
    <h1>餐廳菜單</h1>

    <!-- Create Menu Button -->
    <div>
      <h2>新增菜單</h2>
      <button @click="showCreateMenuModal">新增</button>
    </div>

    <!-- Find Menu By ID -->
    <div>
      <h2>搜尋菜單</h2>
      <input type="number" v-model="findMenuId">
      <button @click="findMenu">搜尋</button>
      <div v-if="foundMenu">
        <h3>菜單詳情</h3>
        <p>{{ foundMenu.menuName }} - {{ foundMenu.price }}</p>
      </div>
    </div>

    <!-- Menus List -->
    <div>
      <h2>菜單列表</h2>
      <table border="1">
        <thead>
          <tr>
            <th>菜單編號</th>
            <th>菜單名稱</th>
            <th>價格</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="menu in menus" :key="menu.remId">
            <td>{{ menu.remId }}</td>
            <td>{{ menu.menuName }}</td>
            <td>{{ menu.price }}</td>
            <td>
              <button @click="editMenu(menu)">編輯</button>
              <button @click="deleteMenu(menu.remId)">刪除</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Edit Menu Form -->
    <div v-if="editMode">
      <h2>編輯菜單</h2>
      <form @submit.prevent="updateMenu">
        <div>
          <label for="menuName">菜單名稱:</label>
          <input type="text" v-model="selectedMenu.menuName" required>
        </div>
        <div>
          <label for="price">價格:</label>
          <input type="number" v-model="selectedMenu.price" required>
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
    const menus = ref([]);
    const newMenu = ref({ remId: '', menuName: '', price: 0 });
    const selectedMenu = ref(null);
    const editMode = ref(false);
    const findMenuId = ref(null);
    const foundMenu = ref(null);

    function fetchMenus() {
      axiosapi.get('/restaurant/RestaurantMenu/all')
        .then(function(response) {
          menus.value = response.data;
        })
        .catch(function(error) {
          Swal.fire('Error', 'There was an error fetching the menus!', 'error');
          console.error('There was an error fetching the menus!', error);
        });
    }

    function createMenu() {
      axiosapi.post('/restaurant/RestaurantMenu/create', newMenu.value)
        .then(function(response) {
          menus.value.push(response.data);
          newMenu.value = { remId: '', menuName: '', price: 0 };
          Swal.fire('Success', 'Menu created successfully!', 'success');
        })
        .catch(function(error) {
          Swal.fire('Error', 'There was an error creating the menu!', 'error');
          console.error('There was an error creating the menu!', error);
        });
    }

    function showCreateMenuModal() {
      Swal.fire({
        title: '新增菜單',
        html:
          '<div>' +
          '<label for="remId">菜單編號:</label>' +
          '<input id="remId" type="text" class="swal2-input" v-model="newMenu.remId" required>' +
          '</div>' +
          '<div>' +
          '<label for="menuName">菜單名稱:</label>' +
          '<input id="menuName" type="text" class="swal2-input" v-model="newMenu.menuName" required>' +
          '</div>' +
          '<div>' +
          '<label for="price">價格:</label>' +
          '<input id="price" type="number" class="swal2-input" v-model="newMenu.price" required>' +
          '</div>',
        focusConfirm: false,
        preConfirm: () => {
          return {
            remId: document.getElementById('remId').value,
            menuName: document.getElementById('menuName').value,
            price: document.getElementById('price').value
          };
        }
      }).then((result) => {
        if (result.isConfirmed) {
          Object.assign(newMenu.value, result.value);
          createMenu();
        }
      });
    }

    function editMenu(menu) {
      selectedMenu.value = { ...menu };
      editMode.value = true;
    }

    function updateMenu() {
      axiosapi.put('/restaurant/RestaurantMenu/update', selectedMenu.value)
        .then(function(response) {
          const index = menus.value.findIndex(function(m) {
            return m.remId === selectedMenu.value.remId;
          });
          if (index !== -1) {
            menus.value[index] = response.data;
          }
          selectedMenu.value = null;
          editMode.value = false;
          Swal.fire('Success', 'Menu updated successfully!', 'success');
        })
        .catch(function(error) {
          Swal.fire('Error', 'There was an error updating the menu!', 'error');
          console.error('There was an error updating the menu!', error);
        });
    }

    function deleteMenu(remId) {
      axiosapi.delete(`/restaurant/RestaurantMenu/delete/${remId}`)
        .then(function() {
          menus.value = menus.value.filter(function(m) {
            return m.remId !== remId;
          });
          Swal.fire('Success', 'Menu deleted successfully!', 'success');
        })
        .catch(function(error) {
          Swal.fire('Error', 'There was an error deleting the menu!', 'error');
          console.error('There was an error deleting the menu!', error);
        });
    }

    function findMenu() {
      axiosapi.get(`/restaurant/RestaurantMenu/${findMenuId.value}`)
        .then(function(response) {
          foundMenu.value = response.data;
          Swal.fire({
            title: '菜單詳情',
            html: `<p>菜單名稱: ${foundMenu.value.menuName}</p><p>價格: ${foundMenu.value.price}</p>`
          });
        })
        .catch(function(error) {
          Swal.fire('Error', 'There was an error finding the menu!', 'error');
          console.error('There was an error finding the menu!', error);
        });
    }

    onMounted(fetchMenus);

    return {
      menus,
      newMenu,
      selectedMenu,
      editMode,
      findMenuId,
      foundMenu,
      createMenu,
      editMenu,
      updateMenu,
      deleteMenu,
      findMenu,
      showCreateMenuModal
    };
  }
};
</script>

<style scoped>
/* 可以在这里添加组件的样式 */
</style>

