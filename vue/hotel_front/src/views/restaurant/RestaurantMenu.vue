<template>
  <div class="container">
    <h1>餐廳菜單</h1>
    <div class="menu-list">
      <div v-for="menu in menus" :key="menu.remId" class="menu-item">
        <img :src="getImagePath(menu.remId)" alt="menu image" class="menu-image">
        <h3>{{ menu.menuName }}</h3>
        <p>價格: {{ menu.price }} 元</p>
        <button @click="selectMenu(menu)">選購</button>
      </div>
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

    function selectMenu(menu) {
      Swal.fire('選購成功', `您已選購 ${menu.menuName}`, 'success');
    }

    function getImagePath(remId) {
      return `/images/menus/${remId}.jpg`; // 使用絕對路徑
    }

    onMounted(fetchMenus);

    return {
      menus,
      selectMenu,
      getImagePath
    };
  }
};
</script>

<style scoped>
.menu-list {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: flex-start; /* 改為從左側開始排列 */
}

.menu-item {
  border: 1px solid #ccc;
  padding: 20px;
  text-align: center;
  width: 300px; /* 增加單品寬度 */
  box-sizing: border-box;
}

.menu-image {
  width: 100%;
  height: 250px; /* 增加圖片高度 */
  object-fit: cover;
}

button {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}

.container{
  max-width: 100%;
  min-width: 100%;
  margin: 0 auto;
  padding :20px;
  background-color: #ddd;
  background-size: cover;
}
</style>
