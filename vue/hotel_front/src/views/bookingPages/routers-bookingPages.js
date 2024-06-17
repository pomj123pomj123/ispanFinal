//引入SFC元件
import Rooms from "./Rooms.vue";
import Login from "./BookingLogin.vue";
import Cart from "./Cart.vue";
import BookingForm from "./BookingForm.vue";
import BookingFinal from "./BookingFinal.vue";
import BookingCheck from "./BookingCheck.vue";
import BookingFind from "./BookingFind.vue";
import BookingPayment from "./BookingPayment.vue";

//設定路由網址
export default [
    { name: "bookingRooms-link", path: "/bookingPages/rooms", component: Rooms },
    { name: "bookinglogin-link", path: "/bookingPages/login", component: Login },
    { name: "cart-link", path: "/bookingPages/cart", component: Cart },
    { name: "bookingForm-link", path: "/bookingPages/bookingForm", component: BookingForm },
    { name: "bookingFinal-link", path: "/bookingPages/bookingFinal", component: BookingFinal },
    { name: "bookingCheck-link", path: "/bookingPages/bookingCheck", component: BookingCheck },
    { name: "bookingFind-link", path: "/bookingPages/bookingFind", component: BookingFind },
    { name: "bookingPayment-link", path: "/bookingPages/bookingPayment", component: BookingPayment },
]

