<template>
    <div class="container">
        <div class="row">
            <div class="col-4">
                <h3>房型介紹</h3>
            </div>
        </div>
        <div class="row">
            <div>
                入住日期：<input type="date" v-model="findBegin" @change="checkDate()" class="col-lg-2 col-md-6">
                退房日期：<input type="date" v-model="findLast" @change="checkDate()" class="col-lg-2 col-md-6">
                人數：<select v-model="findAmount" class="col-lg-1 col-md-6">
                    <option v-for="n in 4">{{ n }}</option>
                </select>
                <button :disabled="!isFormValid" @click="callFind(0)" style="margin-left: 10px;">搜尋房間</button>
            </div>
        </div>
        <br>
        <div class="row">
            <RoomTypeCard v-for="roomtype in roomtypes" :key="roomtype.id" :room="roomtype" :formValid="formValid" @booking="addBooking" @intro="introLink">
            </RoomTypeCard>
        </div>

    </div>

</template>

<script setup>
import Swal from "sweetalert2"
import axiosapi from "@/plugins/axios.js"
import RoomTypeCard from "@/components/booking/RoomTypeCard.vue";
import { ref, onMounted, computed} from "vue";
import { useRouter } from "vue-router";

const findBegin = ref("");
const findLast = ref("");
const findAmount = ref(0);
const days = ref(0);

const roomtypes = ref(null);
const findName = ref("");
const router = useRouter();

const isFormValid = computed(() => {
    return !!(findBegin.value !== '' && findLast.value !== '' && findAmount.value > 0);
});
const formValid = ref(false); 

//pagination start
const total = ref(0);
const pages = ref(100);
const current = ref(50);
const start = ref(0);
const rows = ref(50);
const lastPageRows = ref(0);
//pagination end

function introLink(id){
    let link = "room"+id;

    // router.push({ name: "cart-link" })
    router.push({ name: link });

}

function checkDate() {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // 將時間設置為0點，確保只比較日期

    const lastDate = findLast.value ? new Date(findLast.value) : null;
    const beginDate = findBegin.value ? new Date(findBegin.value) : null;
    
    // 將 lastDate 和 beginDate 設置為0點
    if (lastDate) {
        lastDate.setHours(0, 0, 0, 0);
    }
    if (beginDate) {
        beginDate.setHours(0, 0, 0, 0);
    }

    if (lastDate && lastDate < today) {
        Swal.fire({
            text: "退房日期不可以選今日之前的日期",
            icon: 'error',
            allowOutsideClick: false,
            confirmButtonText: '確認',
        }).then(() => {
            const newLastDate = new Date(beginDate);
            newLastDate.setDate(newLastDate.getDate() + 1);
            findLast.value = formatDate(newLastDate); // 格式化 newLastDate 為所需格式
        });
        return;
    }

    if (beginDate && beginDate < today) {
        Swal.fire({
            text: "入住日期不可以選今日之前的日期",
            icon: 'error',
            allowOutsideClick: false,
            confirmButtonText: '確認',
        }).then(() => {
            findBegin.value = formatDate(today); 
        });
        return;
    }

    if (beginDate && lastDate && beginDate.getTime() === lastDate.getTime()) {
        Swal.fire({
            text: "入住與退房日期不可選同日",
            icon: 'error',
            allowOutsideClick: false,
            confirmButtonText: '確認',
        }).then(() => {
            const newLastDate = new Date(beginDate);
            newLastDate.setDate(newLastDate.getDate() + 1);
            findLast.value = formatDate(newLastDate); // 格式化 newLastDate 為所需格式
        });
        return;
    }

    if (lastDate != null && beginDate != null) {

        if (lastDate < beginDate) {
            Swal.fire({
                text: "退房日期不可以早於入住日期",
                icon: 'error',
                allowOutsideClick: false,
                confirmButtonText: '確認',
            }).then(function () {
                const newLastDate = new Date(beginDate);
                newLastDate.setDate(newLastDate.getDate() + 1);
                findLast.value = formatDate(newLastDate);
            });
        }
    }
    if (lastDate && beginDate) {
        const difference = (lastDate - beginDate) / (1000 * 3600 * 24); // 計算天數差
        days.value = difference;
        console.log("Days between dates:", days.value);
    }
}

function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

const cart = ref([]);

function callCart(){
    const cartData = $cookies.get('cart');
    if(cartData != null){
        cart.value = cartData;
    } else{
        cart.value = null;
    }
}

function checkRoomAmount(rtId, roomAmount){
    let count = 0;
    //計算購物車中已經有的房間數
    console.log("before loop cart")
    for(let item of cart.value){
        if(item.rtId === rtId){
            console.log("cartId = ", item.rtId)
            console.log("rtId = ", rtId)
            const isBeginInRange = item.begin <= findBegin.value && item.last >= findBegin.value;
            const isLastInRange = item.last >= findLast.value && item.begin >= findLast.value;
            const isRangeOverlap = item.last >= findLast.value && item.begin <= findBegin.value;

            if(isBeginInRange || isLastInRange || isRangeOverlap){
                count += item.quantity;
            }
        }
    }
    console.log("count in cart", count)
    count++;    //加上這次的
    console.log("count add new book", count)
    if(roomAmount >= count){
        return true;
    } else{
        return false;
    }
}

function addBooking(rtId, roomName, flexiblePrice, memberPrice, discount, roomAmount) {
    checkDate()
    let discountObject;
    if(discount != null){
        discountObject=JSON.stringify(discount);
    } else{
        discountObject="";
    }
    if(isFormValid.value){
            console.log("result success")
            if(cart.value != null){
                let result = checkRoomAmount(rtId, roomAmount)
                if(result){
                    console.log("after result")
                    let existIndex = cart.value.findIndex(item => {
                        return item?.rtId === rtId &&
                            item?.begin === findBegin.value &&
                            item?.last === findLast.value;
                    })
                    if (existIndex !== -1) {
                        let isSame = (cart.value[existIndex].discount === discountObject) ? true : false;
                        if(isSame){
                            cart.value[existIndex].quantity += 1;
                        } else{
                            cart.value.push({
                                "rtId": rtId,
                                "roomName": roomName,
                                "quantity": 1,
                                "discount": discountObject,
                                "memberPrice": memberPrice,
                                "flexiblePrice": flexiblePrice,
                                "days": days.value,
                                "begin": findBegin.value,
                                "last": findLast.value,
                                "roomAmount": roomAmount
                            });
                        }
                    } else{
                        console.log("before add");
                        cart.value.push({
                            "rtId": rtId,
                            "roomName": roomName,
                            "quantity": 1,
                            "discount": discountObject,
                            "memberPrice": memberPrice,
                            "flexiblePrice": flexiblePrice,
                            "days": days.value,
                            "begin": findBegin.value,
                            "last": findLast.value,
                            "roomAmount": roomAmount
                        });
                    }
                } else{
                    Swal.fire({
                        text: '已經達到最大訂購數',
                        icon: 'error',
                        allowOutsideClick: false,
                        confirmButtonText: '確認',
                    })
                    return
                }
            } else{
                cart.value=[{
                    "rtId": rtId,
                    "roomName": roomName,
                    "quantity": 1,
                    "discount": discountObject,
                    "memberPrice": memberPrice,
                    'flexiblePrice': flexiblePrice,
                    "days": days.value,
                    "begin": findBegin.value,
                    "last": findLast.value,
                    "roomAmount": roomAmount,
                }];
            }
            console.log("after add");
            $cookies.set('cart', JSON.stringify(cart.value));
        
            Swal.fire({
                        text: "訂購房間",
                        icon: 'success',
                        allowOutsideClick: false,
                        confirmButtonText: '確認',
                    }).then(function (result) {
                        if(result.isConfirmed) {
                            router.push({ name: "cart-link" });
                        }
                    });
    } else{
        Swal.fire({
            text: '請選擇日期和人數',
            icon: 'error',
            allowOutsideClick: false,
            confirmButtonText: '確認',
        })
    }
}



function callFind(page) {
    formValid.value = isFormValid.value;

    if (page) {
        start.value = (page - 1) * rows.value;
        current.value = page;
    } else {
        start.value = 0;
        current.value = 1;
    }

    if (findName.value === "") {
        findName.value = null;
    }

    if (findBegin.value === "") {
        findBegin.value = null;
    }

    if (findLast.value === "") {
        findLast.value = null;
    }

    let data = {
        "start": start.value,
        "rows": rows.value,
        "dir": false,
        "order": "peopleMaxAmount",
        "name": findName.value,
        "beginDate": findBegin.value,
        "lastDate": findLast.value,
        "peopleAmount": findAmount.value,
    };
    axiosapi.post("/booking/rooms/find", data).then(function (response) {
        roomtypes.value = response.data.list;
        console.log(response.data.list)
        //pagination start
        total.value = response.data.total;
        pages.value = Math.ceil(response.data.count / rows.value);
        lastPageRows.value = response.data.count % rows.value;
        // pagination end
        setTimeout(function () {
            Swal.close();
        }, 500);
    }).catch(function (error) {
        console.log("callFind error", error);
        Swal.fire({
            text: 'callFind失敗：' + error.message,
            icon: 'error',
            allowOutsideClick: false,
            confirmButtonText: '確認',
        }).then(function () {
            // if(error && error.response.status && error.response.status==403) {
            //     router.push("/secure/login");
            // }
        });
    });
}

onMounted(function () {
    callFind();
    callCart();
});
</script>

<style scoped>

.container {
    max-width: 100%;
    min-width: 100%;
    margin: 0 auto;
    padding: 20px;
    background-color: #ddd;
    background-size: cover;
}
</style>