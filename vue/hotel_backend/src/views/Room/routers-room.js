// 引入SFC元件
import Rooms from "./Rooms.vue";
import RoomList from "../../components/room/RoomList.vue"


// 設定路由網址
export default [

    { name: "room-link", path: "/room/rooms", component: Rooms },
    { name: "roomlist", path: "/room/roomlist", component: RoomList},
    

]