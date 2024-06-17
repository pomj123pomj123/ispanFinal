//引入SFC元件
import RestaurantBackend from "./RestaurantBackend.vue";
import RestaurantCustomerCKY from "./RestaurantCustomerCKY.vue";
import RestaurantMenuBackend from "./RestaurantMenuBackend.vue"




//設定路由網址
export default[
    { name: "restaurantBackend-link", path:"/restaurant/RestaurantBackend", component: RestaurantBackend},
    { name: "restaurantCustomerCKY-link", path:"/restaurant/RestaurantCustomerCKY", component: RestaurantCustomerCKY},
    { name: "RestaurantMenuBackend-link", path:"/restaurant/RestaurantMenuBackend", component: RestaurantMenuBackend}
]