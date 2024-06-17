<template>

    <h3 class="mb-4 text-center">確認訂單</h3>
        <!-- 顧客資料 Customer -->
        <div>
            <div class="mb-3">
                姓氏：{{ customer.lastName }}
                名字：{{customer.firstName}}
            </div>
            <div class="mb-3">
                稱謂：{{ customer.titleOfCourtesy }}
            </div>
            <div class="mb-3">
                生日：{{ customer.birthday }}
            </div>
            <div class="mb-3">
                性別：{{ customer.gender }}
            </div>
            <div class="mb-3">
                國籍：{{ customer.country }}
            </div>
            <div class="mb-3">
                地址：{{ customer.address }}
            </div>
            <div class="mb-3">
                身分證字號：{{ customer.identification }}
            </div>
            <div class="mb-3">
                護照號碼：{{ customer.passportNumber }}
            </div>
            <div class="mb-3">
                E-mail：{{ customer.email }}
            </div>
            <div class="mb-3">
                手機電話：{{ customer.tel }}
            </div>
            <div class="mb-3">
                是否收取優惠信件：{{ customer.allowPromotionMail }}
            </div>
        </div>
        <!-- 訂單 Booking -->
        <div class="mb-3">預訂房間一覽：</div>

        <div v-for="room in rooms" :key="room.key">
            <div class="card" style="width: 24rem;">
                <div class="card-body">
                    <h5 class="card-title">房型名稱：{{ room.roomName }}</h5>
                    <h6 class="card-subtitle mb-2 text-body-secondary">入住日期：【{{ room.beginDate }}】 - 【{{ room.lastDate }}】</h6>
                    <p class="card-text">天數：{{ room.days }}</p><br>
                    <p class="card-text">套用專案：{{ room.dDName }}</p><br>
                    <p class="card-text">房間總價格：{{ room.amountPayable+room.deposit }}</p><br>
                    <p class="card-text">應支付價格：{{ room.amountPayable}}</p><br>
                    <p class="card-text">訂金：{{ room.deposit }}</p><br>
                    <p class="card-text" v-if="room.newdDName">優惠碼：{{room.newdDName}}</p><br v-if="room.newdDName">
                    <p class="card-text" v-if="room.breakfast">是否加早餐：否</p>
                    <p class="card-text" v-else>是否加早餐：否</p>
                </div>
            </div>
        </div>
        <!-- 訂單 Booking Detail -->
        

        <div class="mb-3">預計抵達時間：{{ booking.arrivalTime }}</div>
        <div class="mb-3">備註：{{ booking.customerRemark }}</div>


        <!-- 付款 Booking Payment -->
        <div class="mb-3">
            全部總價格：{{ totalAmountPayable+totalDeposit }}
        </div>
        <div class="mb-3">
            全部應支付價格：{{ totalAmountPayable}}
        </div>
        <div class="mb-3">
            全部訂金：{{ totalDeposit }}
        </div>
        <div class="mb-3">
            <label for="title" class="form-label">付款模式：</label>
            <select class="form-select" id="title" v-model="booking.payType">
                <option value="deposit">先付訂金</option>
                <option value="full">全額繳清</option>
            </select>
        </div>
        <!-- <div class="mb-3">
            <label for="title" class="form-label">付款方式：</label>
            <select class="form-select" id="title" v-model="paymentMethod" @change="addPaymentMethod()">
                <option value="線上支付">線上支付</option>
                <option value="現金付款">現金付款</option>
            </select>
        </div> -->

        <div class="modal-footer">
            <button type="button" class="btn btn-primary" @click="emits('back')">前一步</button>
            <button type="button" class="btn btn-primary" @click="handelSubmit()">確認訂單</button>
        </div>
        
    </template>
        
    <script setup>
        const props = defineProps(["booking", "rooms","customer"]);
        const emits = defineEmits(["confirmNext", "back"]);
    
        import { ref, computed, onMounted } from "vue";

        const paymentMethod = ref("");
        const paymenType = ref("");
        const amountForPayflow = ref(0);

        const totalAmountPayable = computed(function (){
            let total = 0;
            for(let room of props.rooms){
                total += room.amountPayable
            }
            return total;
        });
        const totalDeposit = computed(function (){
            let total = 0;
            for(let room of props.rooms){
                total += room.deposit
            }
            return total;
        });

        function checkBreakfast(breakfast){
            if(breakfast === "true"){
                return true
            }
            return false
        }
        function handelSubmit(){
            // booleanConfirm()
            paymentAmountCal()
            emits('confirmNext',amountForPayflow.value)
        }

        function booleanConfirm(){
            if(props.rooms.infantUtility === "是"){
                props.rooms.infantUtility = true;
            } else{
                props.rooms.infantUtility = false;
            }
            for(let room of props.rooms){
                if(room.breakfast === "是" || room.breakfast ===true){
                    room.breakfast = true;
                } else{
                    room.breakfast = false;
                }
            }
        }

        function paymentAmountCal(){
            if(props.booking.payType === "deposit"){
                amountForPayflow.value = totalDeposit.value;
            } else{
                amountForPayflow.value = totalAmountPayable.value + totalDeposit.value;
            }
            console.log("amountForPayflow = ", amountForPayflow.value);
            return amountForPayflow.value;
        }

        onMounted(function(){
            for(let room of props.rooms){
                console.log("breakfast", room.breakfast)
            }
        })

        // function addPaymentMethod(){
        //     for(let room of props.rooms){
        //         room.paymentMethod = paymentMethod.value;
        //     }
        // }

        // function addPaymentType(){
        //     props.booking.paidType = paymenType.value
        //     for(let room of props.rooms){
        //         room.typeName = paymenType.value;
        //     }
        // }
        
    </script>
        
    <style>
        
    </style>