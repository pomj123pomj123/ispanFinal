//引入vue-router函式庫
import { createRouter, createWebHistory } from 'vue-router'

//引入SFC元件
import Home from '../views/Home.vue'
import NotFound from '../views/NotFound.vue';
import routersMemberPages from "@/views/Member/routers-memberPages.js"
import routersDiscount from '@/views/Discount/routers-Discount';
import routersNews from '@/views/LatestNews/routers-news';
import routersRoom from '@/views/Room/routers-room';
import routersBookingBackPages from '@/views/bookingBackPages/routers-bookingBackPages';
import routersrestaurantbookingPages from '@/views/restaurant/routers-restaurantbookingPages'

//設定路由網址
const routes = [
    { name: "home-link", path: "/", component: Home },
    { name: "notfound-link", path: "/:pathMatch(.*)*", component: NotFound },

    ...routersMemberPages,
    ...routersDiscount,
    ...routersNews,
    ...routersRoom,
    ...routersBookingBackPages,
    ...routersrestaurantbookingPages,
];


//產生router物件
const router = createRouter({
    routes,
    history: createWebHistory()
});

export default router;
