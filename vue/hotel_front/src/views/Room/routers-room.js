// 引入SFC元件
import Rooms from "./Rooms.vue";
import RoomList from "../../components/room/RoomList.vue"
import Superior1 from '../../components/room/frontPage/Superior/Superior1.vue'  // 豪華客房單人房
import Superior2 from '../../components/room/frontPage/Superior/Superior2.vue'
import Superior4 from '../../components/room/frontPage/Superior/Superior4.vue'
import Deluxe1 from "../../components/room/frontPage/Deluxe/Deluxe1.vue"    // 尊榮客房單人房
import Deluxe2 from "../../components/room/frontPage/Deluxe/Deluxe2.vue" 
import Deluxe4 from "../../components/room/frontPage/Deluxe/Deluxe4.vue"
import DeluxeView1 from "../../components/room/frontPage/DeluxeView/DeluxeView1.vue" //景觀尊榮客房單人房
import DeluxeView2 from "../../components/room/frontPage/DeluxeView/DeluxeView2.vue"
import DeluxeView4 from "../../components/room/frontPage/DeluxeView/DeluxeView4.vue"
import GrandDeluxeFamily4 from "../../components/room/frontPage/GrandDeluxeFamily/GrandDeluxeFamily4.vue" //特選尊榮家庭客房四人房
import Premier1 from "../../components/room/frontPage/Premier/Premier1.vue" //超豪華客房單人房
import Premier2 from "../../components/room/frontPage/Premier/Premier2.vue"
import Premier4 from "../../components/room/frontPage/Premier/Premier4.vue"
import HorizonSuperior1 from "../../components/room/frontPage/HorizonSuperior/HorizonSuperior1.vue"  //豪華閣豪華客房單人房
import HorizonSuperior2 from "../../components/room/frontPage/HorizonSuperior/HorizonSuperior2.vue" 
import HorizonSuperior4 from "../../components/room/frontPage/HorizonSuperior/HorizonSuperior4.vue" 
import HorizonDeluxe1 from "../../components/room/frontPage/HorizonDeluxe/HorizonDeluxe1.vue"   //豪華閣尊榮客房單人房
import HorizonDeluxe2 from "../../components/room/frontPage/HorizonDeluxe/HorizonDeluxe2.vue"
import HorizonDeluxe4 from "../../components/room/frontPage/HorizonDeluxe/HorizonDeluxe4.vue"
import PremierView1 from "../../components/room/frontPage/PremierView/PremierView1.vue"     //景觀超豪華客房單人房
import PremierView2 from "../../components/room/frontPage/PremierView/PremierView2.vue"
import PremierView4 from "../../components/room/frontPage/PremierView/PremierView4.vue"
import SpecialtySuite1 from "../../components/room/frontPage/SpecialtySuite/SpecialtySuite1.vue" //特級套房單人房
import SpecialtySuite2 from "../../components/room/frontPage/SpecialtySuite/SpecialtySuite2.vue"
import SpecialtySuite4 from "../../components/room/frontPage/SpecialtySuite/SpecialtySuite4.vue"
import PlazaSuite2 from "../../components/room/frontPage/PlazaSuite/PlazaSuite2.vue" //雅仕套房兩人房

// 設定路由網址
export default [

    { name: "room-link", path: "/room/rooms", component: Rooms },
    { name: "roomlist", path: "/room/roomlist", component: RoomList},
    { name: "room1", path: "/superiorintro1/1", component: Superior1 },	// 豪華客房單人房
    { name: "room2", path: "/superiorintro2/2", component: Superior2 },
    { name: "room3", path: "/superiorintro4/3", component: Superior4 },
    { name: "room4", path: "/deluxe1/4", component: Deluxe1 },			// 尊榮客房單人房
    { name: "room5", path: "/deluxe2/5", component: Deluxe2 },
    { name: "room6", path: "/deluxe4/6", component: Deluxe4 },
    { name: "room7", path: "/deluxeview1/7", component: DeluxeView1 },	//景觀尊榮客房單人房
    { name: "room8", path: "/deluxeview2/8", component: DeluxeView2 },
    { name: "room9", path: "/deluxeview4/9", component: DeluxeView4 },
    { name: "room10", path: "/granddeluxefamily4/10", component: GrandDeluxeFamily4 },	  //特選尊榮家庭客房四人房	
    { name: "room11", path: "/premier1/11", component: Premier1 },		//超豪華客房單人房
    { name: "room12", path: "/premier2/12", component: Premier2 },
    { name: "room14", path: "/premier4/13", component: Premier4 },
    { name: "room15", path: "/horizonsuperior1/14", component: HorizonSuperior1 },	//豪華閣豪華客房單人房
    { name: "room16", path: "/horizonsuperior2/15", component: HorizonSuperior2 },
    { name: "room17", path: "/horizonsuperior4/16", component: HorizonSuperior4 },
    { name: "room18", path: "/horizondeluxe1/17", component: HorizonDeluxe1 },		//豪華閣尊榮客房單人房
    { name: "room19", path: "/horizondeluxe2/18", component: HorizonDeluxe2 },
    { name: "room20", path: "/horizondeluxe4/19", component: HorizonDeluxe4 },
    { name: "room21", path: "/premierView1/20", component: PremierView1 },			//景觀超豪華客房單人房
    { name: "room22", path: "/premierView2/21", component: PremierView2 },
    { name: "room23", path: "/premierView4/22", component: PremierView4 },
    { name: "room24", path: "/specialtysuite1/23", component: SpecialtySuite1 },		//特級套房單人房
    { name: "room25", path: "/specialtysuite2/24", component: SpecialtySuite2 },
    { name: "room25", path: "/specialtysuite4/25", component: SpecialtySuite4 },
    { name: "room26", path: "/plazasuite2/26", component: PlazaSuite2 },			//雅仕套房兩人房


]