<template>

    <h3 class="mb-4 text-center">輸入訂單資料</h3>
        <form>

            <!-- 訂單 Booking -->
            <div v-for="room in rooms" :key="room.key">
                <div class="mb-3">預訂房間確認：</div>
                <div class="mb-3">
                    <div>房型名稱：{{ room.roomName }}</div><br>
                    <div>入住日期：【{{ room.beginDate }}】 - 【{{ room.lastDate }}】</div><br>
                    <div>天數：{{ room.days }}</div><br>
                    <div>套用專案：{{ room.dDName }}</div><br>
                    <div>房間總價格：{{ room.amountPayable+room.deposit }}</div>
                    <div>應付價格：{{ room.amountPayable }}</div>
                    <div>房間訂金：{{ room.deposit }}</div>
                </div>
                <div class="mb-3">
                    <div class="mb-3">
                        <label for="remark" class="form-label">優惠碼：{{ room.newdDName }}</label>
                        <button type="button" @click="cleanDiscount(room)">清空</button>
                        <input type="text" class="form-control" id="remark" v-model="room.promo" @change="addDiscount(room)"><span v-if="isWrongPromo">{{ room.message }}</span>
                    </div>
                    <label class="form-label">是否加早餐：</label><br>
                    <div class="form-check form-check-inline">
                        <input class="form-check-input" type="radio" value="true" v-model="room.breakfast">
                        <label class="form-check-label" for="extraBedYes">是</label>
                    </div>
                    <div class="form-check form-check-inline">
                        <input class="form-check-input" type="radio" value="false" v-model="room.breakfast">
                        <label class="form-check-label" for="extraBedNo">否</label>
                    </div>
                </div>
            
            </div>
            <!-- 訂單 Booking Detail -->
            <!-- <div class="mb-3">
                <label class="form-label">嬰兒用品：</label><br>
                <div class="form-check form-check-inline">
                    <input class="form-check-input" type="radio" name="babySupplies" id="babySuppliesYes" value="true" v-model="booking.infantUtility">
                    <label class="form-check-label" for="babySuppliesYes">是</label>
                </div>
                <div class="form-check form-check-inline">
                    <input class="form-check-input" type="radio" name="babySupplies" id="babySuppliesNo" value="false" v-model="booking.infantUtility">
                    <label class="form-check-label" for="babySuppliesNo">否</label>
                </div>
            </div> -->
            <div class="mb-3">
                <label for="arrivalTime" class="form-label">預計抵達時間：</label>
                <select class="form-select" id="arrivalTime" v-model="booking.arrivalTime">
                    <option>15:00</option>
                    <option>16:00</option>
                    <option>17:00</option>
                    <option>18:00</option>
                </select>
            </div>
            <div class="mb-3">
                <label for="remark" class="form-label">備註：</label>
                <input type="text" class="form-control" id="remark" v-model="booking.customerRemark">
                <button type="button" @click="addRemark(booking)">輸入備註</button>
            </div>
        </form>
        <div class="modal-footer">
            <button type="button" class="btn btn-primary" @click="emits('back')">前一步</button>
            <button type="button" class="btn btn-primary" @click="handleSubmit()">下一步</button>
        </div>
        
    </template>
        
    <script setup>
        const props = defineProps(["booking", "rooms","customer"]);
        const emits = defineEmits(["bookingNext", "cleanDiscount", "back"]);
    
        import { onMounted, ref } from "vue";
        import axiosapi from "@/plugins/axios.js"
        import {calculatePriceBooking, calculateDeposit} from "@/views/bookingPages/priceCalculator.js"

        const isWrongPromo = ref(false);

        function addRemark(booking){
            booking.customerRemark = "想要全新的床單"
        }

        function handleSubmit(){
            for (const room of props.rooms) {
                if (!room.breakfast) {
                alert("請為所有房間選擇是否加早餐");
                return;
                }
                console.log("breakfast = ", room.breakfast)
            }
            if (props.booking.arrivalTime === null) {
                alert("請選擇抵達時間");
                return;
            }
            
            emits("bookingNext");
        }

        function addDiscount(room){
            isWrongPromo.value = false;
            if(room.promo !== ""){
                console.log("room = ", room);
                let data = {
                    "rtId": room.rtId,
                    "beginDate": room.beginDate,
                    "lastDate": room.lastDate,
                    "promo" : room.promo
                }
                console.log("data = ", data);
                axiosapi.post("/booking/discount/check", data).then(function(response){
                    if(response.data.success){
                        room.ddIds.push({ddId:response.data.ddId, dDName:response.data.dDName});
                        let discount = "";
                        if(response.data.discountMethod === "discountPrice"){
                            discount = {"discountPrice": response.data.discount};
                        } else{
                            discount = {"discountRate": response.data.discount};
                        }
                        console.log("discount = ", discount)
                        console.log("price = ", room.price)
                        console.log("day = ", room.days)
                        let tempAmount = Math.round(calculatePriceBooking(room.price, discount, room.days));
                        let tempdeposit = Math.round(calculateDeposit(tempAmount));
                        room.amountPayable = tempAmount-tempdeposit;
                        room.deposit = tempdeposit;
                        room.newdDName = response.data.dDName;
                    } else{
                        room.message = response.data.message;
                        room.promo = "";
                        if(room.newdDName !== null){
                            room.newdDName = "";
                        }
                        isWrongPromo.value = true;
                    }
                })
            }
        }

        function cleanDiscount(room){
            emits("cleanDiscount", room);
        }
        
        onMounted(function(){
            // console.log("customer in bookingDetail = ", props.customer);
            // props.rooms.forEach(item => {
            //     item.breakfast = "是";
            // });
            // props.booking.infantUtility = "否";
        })

    </script>
        
    <style>
        
    </style>