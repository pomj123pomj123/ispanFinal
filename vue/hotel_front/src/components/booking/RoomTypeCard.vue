<template>
    <div class="col-lg-3 col-md-6">
        <div class="card mb-3" @click.prevent="showAmount(room.rtId, room.amount)">
            <img class="card-img-top img1" :src="`${path}${room.rtId}`" :alt="room.photoDescription">

            <div class="card-body">
                <h5 class="card-title">{{ room.roomName }}</h5>
                <div class="card-text text-danger text-end">NT$ {{ room.flexiblePrice }}</div>
                <div class="card-text text-danger text-end">會員價NT$ {{ room.memberPrice }}</div>
                <div class="row">
                    <div class="col text-start">
                        <a href="#" class="btn btn-primary" @click.prevent="doclick1(room.rtId)" style="background-color:#FAA939;">房型介紹</a>
                    </div>
                    <div class="col text-end">
                        <a href="#" class="btn btn-primary" 
                        @click.prevent="doclick2(room.rtId, room.roomName, 
                        room.flexiblePrice, room.memberPrice, selectedDiscount, room.amount)" style="background-color:#FAA939"> 
                        線上預訂</a>
                    </div>
                </div>
                <div v-if="formValid">
                    <br>
                    <div class=" p-2 bg-info bg-opacity-10 border border-info rounded-pill ">
                        <h5 class="card-text">剩餘房間數：{{room.amount}}</h5>
                    </div>
                    <br>
                    <ul class="list-group">
                        <div>優惠專案</div>
                        <div v-if="room.discounts">
                            <li v-for="discount in room.discounts" :key="discount.dDId" 
                                class="list-group-item"
                                :class="{ 'selected': selectedDiscount && selectedDiscount.dDId === discount.dDId  }"
                                @click="selectDiscount(discount)">
                                {{ discount.dDName }}
                            </li>
                        </div>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import { ref } from 'vue';

const props = defineProps({
    room: {
        type: Object,
        required: true
    },
    formValid: {
        type: Boolean,
        required: true
    }
});

const emits = defineEmits(["showAmount", "intro", "booking"]);
const path = import.meta.env.VITE_ROOMPHOTO_URL;
const selectedDiscount = ref(null);


function showAmount(id, amount) {
    emits("showAmount", id, amount);
}
function doclick1(id) {
    emits("intro", id);
}
function doclick2(rtId, roomName, flexiblePrice, memberPrice, discount, roomAmount) {
    try {
        if(discount !== null){
            emits("booking", rtId, roomName, flexiblePrice, memberPrice, discount, roomAmount);
        } else{
            emits("booking", rtId, roomName, flexiblePrice, memberPrice, null, roomAmount);
        }
        
    } catch (error) {
        console.log("error出現於doclick2");
    }
    
}

function selectDiscount(discount) {
    selectedDiscount.value = discount;
}


</script>
<style scoped>
.img1 {
    height: 200px;
    object-fit: cover;
}

.selected {
    border: 2px solid #007bff;
}
</style>
