<template>
    <div class="container mt-5">
        <div class="row justify-content-center">
            <div class="col-lg-6 col-md-12">
                <h3 class="mb-4 text-center">訂單</h3>
                <!-- 顧客資料 Customer -->
                <div v-if="showCustomer">
                    <BookingCustomer :customer="customer" :isMember="isMember" @customerNext="customerNext"></BookingCustomer>
                </div>
                <!-- 訂單 Booking Detail -->
                <div v-if="showBookingDetail">
                    <BookingDetail :booking="booking" :rooms="rooms" :customer="customer"  @back="detailBack" @bookingNext="bookingNext" @cleanDiscount="cleanDiscount"></BookingDetail>
                </div>
                <div v-if="showBookingConfirm">
                    <BookingConfirm :customer="customer" :booking="booking" :rooms="rooms" @back="confirmBack" @confirmNext="confirmNext"></BookingConfirm>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
    import { ref, onMounted, onUnmounted} from 'vue';
    import Swal from "sweetalert2";
    import axiosapi from "@/plugins/axios.js";
    import { useRouter, onBeforeRouteLeave  } from "vue-router";
    import BookingCustomer from "@/components/booking/BookingCustomer.vue";
    import BookingDetail from "@/components/booking/BookingDetail.vue";
    import BookingConfirm from "@/components/booking/BookingConfirm.vue";
    import {calculateDeposit} from "@/views/bookingPages/priceCalculator.js"

    const router = useRouter();

    const exiting = ref(false); //  確保離開頁面時去掉折扣碼

    const isMember = ref(false);
    const showCustomer = ref(true);
    const showBookingDetail = ref(false);
    const showBookingConfirm = ref(false);
    
    // 顧客資料 Customer
    const customer = ref({
        "firstName": null,
        "lastName": null,
        "identification": null,
        "tel": null,
        "address": null,
        "birthday": "2000-01-01",
        "gender": null,
        "country": "台灣",
        "email": null,
        "titleOfCourtesy": null,
        "allowPromotionMail": null,
        "passportNumber": null,
        "username":null
    })
    const username = ref(null);

    // 訂單 Booking Detail
    const booking = ref({
        "hId": 1,
        "customerRemark": null,
        "childNumber": null,
        "infantUtility": false,
        "adultNumber": null,
        "arrivalTime": null,
        "totalRoom": null,
        "payType":null
    })

    // 訂單 Booking
    const rooms = ref(new Array());

    function customerNext(){
        showCustomer.value = false;
        showBookingDetail.value = true;
    }

    function detailBack(){
        showCustomer.value = true;
        showBookingDetail.value = false;
    }
    function confirmBack(){
        showBookingConfirm.value = false;
        showBookingDetail.value = true;
    }


    const cart = ref(new Array());


    function callCart(){
            const cartData = $cookies.get('cart');
            console.log(cartData)
            
            if(cartData != null){
                cart.value = cartData;
                let calculateTotalRoom = 0; // 初始化計算變量
                if (Array.isArray(cartData)) { // 確保 cartData 是一個陣列
                    cartData.forEach((item, index) => {
                        for(let i = 0; i < item.quantity; i++){
                            let num = "";
                            if(item.quantity > 1){
                                num += (i+1);
                            }
                            rooms.value.push({
                                "key":index,
                                "roomName":item.roomName+num,
                                "days":item.days,
                                "newdDName": "",
                                "dDName" : item.dDName,
                                "rtId": item.rtId,
                                "beginDate": item.begin,
                                "lastDate": item.last,
                                "additionalBed": null,
                                'breakfast': null,
                                "typeName": null,
                                "amountPayable": item.price/item.quantity-item.deposit/item.quantity,
                                "paymentMethod": null,
                                "price": item.price/item.quantity,
                                "deposit": item.deposit/item.quantity,
                                "promo":null,
                                "ddIds": item.discount && typeof item.discount === 'string' ? [{ ddId: JSON.parse(item.discount).dDId, dDName: item.dDName}] : []
                            })    
                        }
                        calculateTotalRoom += (item.quantity || 0); // 添加對 item.quantity 的存在性檢查
                    });
                }
                booking.value.totalRoom = calculateTotalRoom;
                
            } else{
                Swal.fire({
                    text: "購物車為空，請重新訂購",
                    icon: 'error',
                    allowOutsideClick: false,
                    confirmButtonText: '確認',
                }).then(function () {
                    router.push({ name: "bookingRooms-link" })
                });
            }
        }

    function findUser(){
        username.value = sessionStorage.getItem("username");
        if(username.value === null){
            isMember.value = false;
        } else{
            isMember.value = true;
            axiosapi.get(`/booking/customer/${username.value}`).then(function (response){
                customer.value = {
                    "firstName": response.data.firstName,
                    "lastName": response.data.lastName,
                    "identification": response.data.identification,
                    "passportNumber": response.data.passportNumber,
                    "tel": response.data.tel,
                    "address": response.data.address,
                    "country": response.data.country,
                    "birthday": response.data.birthday,
                    "gender": response.data.gender,
                    "email": response.data.email,
                    'titleOfCourtesy': response.data.titleOfCourtesy,
                    "allowPromotionMail": response.data.allowPromotionMail,
                    "username":response.data.username
                };
            }).catch(function (error) {
        
            });
        }
    }

    function bookingNext(){
        showBookingDetail.value = false;
        showBookingConfirm.value = true;
    }

    function confirmNext(paymentAmountCal){
        exiting.value = true; // 處理按鈕邏輯
        callCreate(paymentAmountCal);
    }


    
    function callCreate(paymentAmountCal){
        let data = { ...booking.value, ...customer.value, rooms: [...rooms.value] }
        console.log(data);
        axiosapi.post("/booking/book/create", data).then(function(response){
            if(response.data.success){
                Swal.fire({
                    text: "預訂成功",
                    icon: 'success',
                    allowOutsideClick: false,
                    confirmButtonText: '確認',
                }).then(function (result) {
                    if(result.isConfirmed) {
                        $cookies.remove('cart');
                        $cookies.remove('bookingInfo');
                        $cookies.remove("paymentAmountCal")
                        const bookingInfo = response.data.bookingInfo;
                        
                        $cookies.set('bookingInfo', bookingInfo);
                        $cookies.set('paymentAmountCal', paymentAmountCal);
                        router.push({ name: "bookingPayment-link" });
                    }
                });
            }   else {
                Swal.fire({
                    text: response.data.message,
                    icon: 'warning',
                    allowOutsideClick: false,
                    confirmButtonText: '確認',
                });
            }
        }).catch(function(error) {
            console.log("callModify error", error);
            Swal.fire({
                text: '失敗：'+error.message,
                icon: 'error',
                allowOutsideClick: false,
                confirmButtonText: '確認',
            });
        });
    }

    //  去除掉新增的折扣碼折扣
    function cleanDiscount(room){
        if (room.ddIds[1] !== null) {
            room.newdDName = "";
            room.ddIds.splice(1, 1);
            let tempDeposit = calculateDeposit(room.price);
            room.amountPayable = room.price - tempDeposit;
            room.deposit = tempDeposit;
        }
        room.promo = "";
        if(room.message !== null){
            room.message = "";
        }
    }

    // 添加 beforeunload 事件監聽器
    const handleBeforeUnload = (event) => {
        if (!exiting.value) {
            rooms.value.forEach(room => {
                cleanDiscount(room);
            }); // 修改數值
        }
        event.preventDefault();
        event.returnValue = ''; // 確保彈出提示
    };

    onMounted( function(){
            findUser();
            callCart();
            window.addEventListener('beforeunload', handleBeforeUnload); // 監聽離開頁面
        }
    )

    onUnmounted(() => {
        window.removeEventListener('beforeunload', handleBeforeUnload); //  移除監聽
    });

    // 使用 beforeRouteLeave 鉤子來監控路由變化
    onBeforeRouteLeave((to, from, next) => {
        if (!exiting.value) {
            rooms.value.forEach(room => {
                cleanDiscount(room);
            }); // 修改數值
        }
        next(); // 允許導航
    });

</script>

<style scoped>
/* .container {
    margin-top: 50px;
} */

.container {
    max-width: 100%;
    min-width: 100%;
    margin: 0 auto;
    padding: 20px;
    background-color: #ddd;
    background-size: cover;
}

h3 {
    margin-bottom: 30px;
}

.form-label {
    font-weight: bold;
}

.btn-primary {
    background-color: #007bff;
    border-color: #007bff;
}
</style>
