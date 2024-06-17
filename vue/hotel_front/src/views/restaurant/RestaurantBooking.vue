<template>
    <div class="container">
        <div class="row">
        <h3>訂位系統</h3>
        </div>
    </div>

    <div class="container">
        <div class="row">
                <div  class="form-group">
                    預定日期：<input type="date" v-model="reserveTime" @change="checkDate()" class="col-lg-2 col-md-6">
                    <div class="form-group" >
                        <label for="mealTime" class="form-label">預定時間：{{ mealTime }}</label>
                        <select class="form-select" id="mealTime" v-model="mealTime">
                            <option>08:00</option>
                            <option>08:30</option>
                            <option>09:00</option>
                            <option>09:30</option>
                            <option>11:00</option>
                            <option>11:30</option>
                            <option>12:00</option>
                            <option>12:30</option>
                            <option>13:00</option>
                            <option>13:30</option>
                            <option>17:00</option>
                            <option>17:30</option>
                            <option>18:00</option>
                            <option>18:30</option>
                            <option>19:00</option>
                            <option>19:30</option>
                        
                        </select>
                    </div>
                    人數：<select v-model="findAmount" class="form-group">
                        <option v-for="n in 10">{{ n }}</option>
                    </select>
                    <button :disabled="!isFormValid" @click="callFind(0)" style="margin-left: 10px;">搜尋</button>
                </div>
        </div>
    </div >

    
    <br>
    <div v-if="showCustomer" class="container">
        <h3>客戶資料表單</h3>
        <form>
            <!-- 客戶資料 -->
            <div class="mb-3">
                <label for="name" class="form-label">客戶姓氏：</label>
                <input type="text" class="form-control" id="lastName" v-model="lastName">
                <label for="name" class="form-label">客戶名字：</label>
                <input type="text" class="form-control" id="firstName" v-model="firstName">
            </div>
            <div class="mb-3">
                <label for="email" class="form-label">E-mail：</label>
                <input type="email" class="form-control" id="email" v-model="email" @change="checkEmail(email)">
                {{ emailmessage }}
            </div>
            <div class="mb-3">
                <label for="cellphone" class="form-label">手機號碼：</label>
                <input type="cellphone" class="form-control" id="cellphone" v-model="cellphone" @chang="checkcellphone(cellphone)">
                {{ cellphonemessage }}
            </div>
            <div class="mb-3">
                <label for="totalAdult" class="form-label">大人人數：</label>
                <input type="number" class="form-control" id="totalAdult" v-model="totalAdult">
            </div>
            <div class="mb-3">
                <label for="totalChildren" class="form-label">小孩人數：</label>
                <input type="number" class="form-control" id="totalChildren" v-model="totalChildren">
            </div>
            <div class="mb-3">
                <label for="remark" class="form-label">備註</label>
                <input type="text" class="form-control" id="remark" v-model="remark">
            </div>
            
        </form>
        <div class="modal-footer">
            <button type="button" class="btn btn-primary" @click="customerNext()">下一步</button>
        </div>
    </div>
    <div v-if="showBookingConfirm">
        <BookingConfirm @confirmNext="confirmNext"></BookingConfirm>
    </div>

</template>

<script setup>
import Swal from "sweetalert2"
import axiosapi from "@/plugins/axios.js"
import RestaurantBookingModal from "@/components/restaurant/RestaurantBookingModal.vue";
import { ref, onMounted, computed } from "vue";
import Paginate from "vuejs-paginate-next";
import { useRouter } from "vue-router";

const showCustomer = ref(false);
const showBookingConfirm = ref(false);

const mealTime = ref("08:00"); // 將 mealTime 添加到 data 選項中並設置預設值
const reserveTime = ref("")

const total = ref(0); // 定義總數量為一個 ref，並設置初始值為 0

const findDate = ref("");
const findAmount = ref(0);
const findBegin = ref("");

const isFormValid = computed(()=>{
    return !!(reserveTime.value !== '' && findAmount.value >0);
});
const formValid = ref(false);

const restaurant = ref("");
const router = useRouter(); // 使用 useRouter
const emailmessage = ref("");
const isEmail = ref(false);
const isCellphone = ref(false);

function handleSubmit(){
    console.log("isEmail =", isEmail.value)
    checkEmail();
    if(!isEmail){
        alert("請輸入正確電子郵件信箱");
        return;
    }
    if(!isCellphone){
        alert("請輸入連絡電話");
        return;
    }
    defineEmits("customerNext");
}

function checkEmail(email){
    const emailRule = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // validate ok or not
    if(email.search(emailRule)!= -1){
        isEmail.value = true;   
        emailmessage.value = ""; // 清空驗證訊息
    } else {
        isEmail.value = false;
        emailmessage.value = "信箱格式錯誤"; // 更新驗證訊息
        email = "";
    }

}

// 這個驗證機制尚未完成
function checkcellphone(cellphone) {
    const phoneRegex = /^\d{10}$/; // 假設電話號碼是10位數的數字
    
    if (cellphone.length === 10 && phoneRegex.search(cellphone)) {
        isCellphone.value = true;
        cellphonemessage.value = ""; // 清空驗證訊息
    } else {
        isCellphone.value = false;
        cellphonemessage.value = "電話號碼格式錯誤"; // 更新驗證訊息
        cellphone = ""; // 清空電話號碼
    }
}




function checkDate() {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // 將時間設置為0點，確保只比較日期

    const beginDate = reserveTime.value ? new Date(reserveTime.value) : null;
    // 將 beginDate 設置為0點
    if (beginDate) {
        beginDate.setHours(0, 0, 0, 0);
    }

    if (beginDate && beginDate < today) {
        Swal.fire({
            text: "預定日期不可以選今日之前的日期",
            icon: 'error',
            allowOutsideClick: false,
            confirmButtonText: '確認',
        }).then(() => {
            reserveTime.value = formatDate(today);
        });
        return;
    }
}

function formatDate(date){
    const year = date.getFullYear();
    const month = String(date.getMonth()+1).padStart(2,'0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function goToHome(){
        router.push({name: "home-link"})
    }
function callFindById(id) {
        Swal.fire({
            text: "Loading......",
            showConfirmButton: false,
            allowOutsideClick: false,
        });
        axiosapi.get(`/restaurant/restaurantBooking/${id}`).then(function (response) {
            console.log("response", response.data.list[0]);
            if(response.data.list.length!=0) {
                product.value = response.data.list[0];
            }
            setTimeout(function() {
                Swal.close();
            }, 500);
        }).catch(function (error) {
            console.log("callFindById error", error);
            Swal.fire({
                text: '失敗：'+error.message,
                icon: 'error',
                allowOutsideClick: false,
                confirmButtonText: '確認',
            });
        });
    }

    function callFind(){
        let data={
            "reserveTime": reserveTime.value,
            "mealTime":mealTime.value,
            // "totalSeat": findAmount.value,
        };
        axiosapi.post("/restaurant/checkBooking",data).then(function(response){
            console.log("after axios")
            restaurant.value = response.data.reId;
            setTimeout(function(){
                Swal.close();
            },500);
        }).catch(function(error){
            console.log("callFind error", error);
            Swal.fire({
                text:'callFind失敗： '+error.message,
                icon: 'error',
                allowOutsideClick: false,
                confirmButtonText: '確認'
            }).then(function(){

            });
        });
        showCustomer.value = true;
    }

    const lastName = ref("")
    const firstName = ref("")
    const email = ref("")
    const cellphone = ref("")
    const totalAdult = ref("")
    const totalChildren = ref("")
    const remark = ref("")


    function customerNext(){
        let customerdata ={
            "reId":restaurant.value,
            "lastName":lastName.value,
            "firstName":firstName.value,
            "email":email.value,
            "cellphone":cellphone.value,
            "totalAdult":totalAdult.value,
            "totalChildren":totalChildren.value,
            "remark":remark.value,
            "reserveTime": reserveTime.value,
            "mealTime":mealTime.value
        }
        axiosapi.post("/restaurant/createcustomer",customerdata).then(function(response){
            console.log("after axios")
            console.log("response = "+response);
            console.log("response.data = "+response.data);
            if(response.data.success){
                Swal.fire({
                text: "預定成功",
                icon: 'success',
                allowOutsideClick: false,
                confirmButtonText: '確認',
            }).then(function(result){
                if(result.isConfirmed){
                    
                    router.push({name:"restaurantBookingFinal-link"});
                }
            });
                console.log(response.data.message);
            } else{
                console.log("fail + ",response.data.message);
            }
            setTimeout(function(){
                Swal.close();
            },1000);
            goToHome();
        }).catch(function(error){
            console.log("customerNext error", error);
            Swal.fire({
                text:'customerNext '+error.message,
                icon: 'error',
                allowOutsideClick: false,
                confirmButtonText: '確認'
            }).then(function(){
            });
        });
        

    }
    
        
    
</script>

<style scoped>
    /* 調整文字顏色 */
    h3, label {
        color: black; /* 將文字顏色設置為黑色 */
    }

    /* 調整表單元素的背景色和文字顏色 */
    input[type="text"], input[type="email"], input[type="number"], select {
        background-color: white; /* 將表單元素背景色設置為白色 */
        color: black; /* 將文字顏色設置為黑色 */
    }

    .reservation-form {
    width: 300px;
    margin: 0 auto;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 5px;
}

.reservation-form h3 {
    text-align: center;
}

.form-group {
    margin-bottom: 15px;
}

.form-group label {
    display: block;
    margin-bottom: 5px;
}

.form-group input,
.form-group select {
    width: 100%;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 3px;
}

.form-group select {
    appearance: none; /* 隱藏原生下拉箭頭 */
    -webkit-appearance: none;
    -moz-appearance: none;
    background: url('arrow-down.png') no-repeat; /* 使用自定義箭頭 */
    background-position: right center;
    padding-right: 30px; /* 為了避免箭頭被覆蓋，留出一些空間 */
}

button {
    width: 100%;
    padding: 10px;
    background-color: #007bff;
    color: #fff;
    border: none;
    border-radius: 3px;
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