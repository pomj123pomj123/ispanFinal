<template>
    <table>
        <tr>
            <td>入住日期：</td>
            <td><input type="date" v-model="findBegin" @change="updateBeginDate($event.target.value)"></td>
        </tr>
        <tr>
            <td>退房日期：</td>
            <td><input type="date" v-model="findLast" @change="updateLastDate($event.target.value)"></td>
        </tr>
        <tr>
            <td>房型：</td>
            <td>
                <select v-model="room.rtId" @change="handleRoomChange">
                    <option v-for="findRoom in roomtypes" :key="findRoom.rtId" :value="findRoom.rtId">{{ findRoom.roomName }} 價格：{{ findRoom.flexiblePrice }}/會員價：{{findRoom.memberPrice}}</option>
                </select>
            </td>
        </tr>
        <tr>
            <td>專案：</td>
            <td>
                <select v-model="room.ddIds[0].ddId" @change="handleDiscountChange()">
                    <option value=""></option>
                    <option v-for="discount in discounts" :key="discount.dDId" :value="discount.dDId">{{ discount.dDName }}</option>
                </select>
            </td>
        </tr>

        <tr>
            <td>優惠券：</td>
            <td>
                <label for="remark" class="form-label">優惠碼：{{ promoName }}</label>
                        <button type="button" @click="cleanDiscount()">清空</button>
                        <input type="text" class="form-control" id="remark" v-model="promo" @change="addDiscount()"  :disabled="selectedRoomId===null"><span v-if="isWrongPromo">{{ message }}</span>
            </td>
        </tr>
        <tr>
            <td> </td>
            <td>價格：{{room.amountPayable+room.deposit}}<br>訂金：{{room.deposit}}</td>
        </tr>

        
        
    </table>
</template>
    
<script setup>
    const props =defineProps(["room","isMember","beginDate","lastDate","promoDdid", "amountPayable", "deposit"]);
    const emits = defineEmits(["update:beginDate", "update:lastDate","update:promoDdid", "update:amountPayable", "update:deposit"])

    import { onMounted, ref, watch } from "vue";
    import Swal from "sweetalert2"
    import axiosapi from "@/plugins/axios.js"
    import {calculatePriceBooking, calculateDeposit, calculatePrice} from "@/views/bookingBackPages/priceCalculator.js"

    const findBegin = ref("");
    const findLast = ref("");
    const days = ref(0);
    const isWrongPromo = ref(false);
    const promo = ref("");
    const promoDiscount = ref({});
    const message = ref("");
    const promoName = ref("");
    const roomtypes = ref([]);
    const discounts = ref([])
    const selectedRoomId = ref(props.room.rtId)

    function updateBeginDate(value) {
        findBegin.value = value;
        checkDate();
    }

    function updateLastDate(value) {
        findLast.value = value;
        checkDate();
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
            days.value = difference
            callFind();
            emits("update:beginDate", findBegin.value)
            emits("update:lastDate", findLast.value)
        }
    }

    function formatDate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }



    function callFind() {

        if (props.beginDate === "") {
            props.beginDate = null;
        }

        if (props.lastDate === "") {
            props.lastDate = null;
        }

        let data = {
            "beginDate": props.beginDate,
            "lastDate": props.lastDate,
            "peopleAmount":1
        };
        axiosapi.post("/booking/rooms/find", data).then(function (response) {
            roomtypes.value = response.data.list;
        }).catch(function (error) {
            console.log("callFind error", error);
            Swal.fire({
                text: 'callFind失敗：' + error.message,
                icon: 'error',
                allowOutsideClick: false,
                confirmButtonText: '確認',
            })
        });
    }



    function handleRoomChange (event){
        selectedRoomId.value = event.target.value;
        addDiscount();
        handlePrice();
    }
    
    watch(// 要監聽的資料
    () => selectedRoomId.value,
    (newValue, oldValue) => {
        updateDiscounts(newValue)
    }
    )

    function updateDiscounts (rtId) {
        // console.log("updateDiscounts called with rtId: ", rtId);
        // console.log("roomtypes.value before update: ", roomtypes.value);
        let findrtId = parseInt(rtId);
        let selectedRoom = roomtypes.value.find(room => room.rtId === findrtId);

        if (selectedRoom) {
            discounts.value = selectedRoom.discounts;
        } else {
            console.warn("No room found with rtId: ", rtId);
            discounts.value = [];
        }

        // console.log("discounts.value after update: ", discounts.value);
    }

    function handleDiscountChange(){
        
        handlePrice();
    }

    function handlePrice(){
        console.log("handlePrice!")
        let price = 0;
        let amountPayable =0;
        let deposit = 0;

        let findrtId = parseInt(props.room.rtId);
        let selectedRoom = roomtypes.value.find(room => room.rtId === findrtId);

        let findDdId = parseInt(props.room.ddIds[0].ddId)
        let selectedDiscount = discounts.value.find(discount => discount.dDId === findDdId)

        if(props.isMember){
            price = selectedRoom.memberPricePrice;
        }else{
            price = selectedRoom.flexiblePrice;
        }
        console.log("price = ", price)
        price = calculatePrice(price, selectedDiscount, days.value);
        console.log("afterPack = ",price)
        console.log("promoDiscount.value = ", promoDiscount.value)
        price = calculatePriceBooking(price, promoDiscount.value, days.value);
        console.log("afterPromo = ",price)

        deposit = calculateDeposit(price);
        amountPayable = price - deposit
        emits("update:amountPayable", amountPayable)
        emits("update:deposit", deposit);


    }

    function addDiscount(){

        isWrongPromo.value = false;
        if(promo.value !== ""){
            let data = {
                "rtId": props.room.rtId,
                "beginDate": props.room.beginDate,
                "lastDate": props.room.lastDate,
                "promo" : promo.value
            }
            console.log("data = ", data);
            axiosapi.post("/booking/discount/check", data).then(function(response){
                if(response.data.success){
                    if(response.data.discountMethod === "discountPrice"){
                        promoDiscount.value = {
                            "discountPrice":response.data.discount,
                        }
                    }   else{
                        promoDiscount.value = {
                            "discountRate":response.data.discount,
                        }
                    }
                    promoName.value = response.data.dDName
                    emits("update:promoDdid", response.data.ddId)

                    handlePrice();
                } else{
                    message.value = response.data.message;
                    promo.value = "";
                    promoName.value = "";
                    isWrongPromo.value = true;
                }
            })
        }
    }

    function cleanDiscount(){
        if (promoDiscount !== null) {
            promoDiscount.value = {
                        "discountMethod" : null,
                        "discount":null,
            }
            promoName.value = null;
            handlePrice();
        }
        promo.value = "";
        if(message.value !== null){
            message.value = "";
        }
    }
    onMounted(function(){
        // callFind();
        selectedRoomId.value = props.room.rtId;
        console.log(" selectedRoomId.value  = ", selectedRoomId.value )
    })

    
</script>
    
<style>
    
</style>