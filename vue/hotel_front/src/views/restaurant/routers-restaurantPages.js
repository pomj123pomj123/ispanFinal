//引入SFC元件
import RestaurantBooking from "./RestaurantBooking.vue";
import RestaurantQuestion from "./RestaurantQuestion.vue";
import RestaurantBookingModify from "./RestaurantBookingModify.vue";
import RestaurantMenu from"./RestaurantMenu.vue";




//設定路由網址
export default[
    { name: "restaurantBooking-link", path:"/restaurant/RestaurantBooking", component: RestaurantBooking},
    { name: "restaurantQuestion-link", path:"/restaurant/Restaurantquestion", component: RestaurantQuestion},
    { name: "restaurantBookingModify-link", path:"/restaurant/RestaurantBookingModify", component: RestaurantBookingModify},
    { name: "restaurantMenu-link", path:"/restaurant/RestaurantMenu", component: RestaurantMenu}
]