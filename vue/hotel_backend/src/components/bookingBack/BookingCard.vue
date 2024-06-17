<template>
    <tr class="text-center">
        <td>{{ index + 1 }}</td>
        <td>{{ booking.orderNumber }}</td>
        <td>{{ booking.bookingDate }}</td>
        <td>{{ booking.beginDate }} - {{ booking.lastDate }}</td>
        <td>{{ booking.hotelName }}</td>
        <td>{{ booking.roomType }}</td>
        <td>
            <span v-if="!isRoomModify">{{ booking.roomNumber }}</span>
            <select v-if="isRoomModify" @change="callModify(booking.bId)"  v-model="booking.roomNumber">
                <option v-for="emptyRoom in booking.emptyRooms" :key="emptyRoom.roomNumber" :value="emptyRoom.roomNumber">{{ emptyRoom.roomNumber }}</option>
            </select>
            <button type="button" @click="roomModify()">排房</button>
        </td>
        <td>{{ booking.deposit+booking.amountPayable}}／{{booking.deposit}}</td>
        <td>{{ booking.paymentStatus }}</td>
        <td>{{ booking.packageDdName }}</td>
        <td>{{ booking.promoDdName }}</td>
        <td>{{ booking.lastName }}{{ booking.firstName }}</td>
        <td>{{ booking.remark }}</td>
        <td>
            <select v-model="booking.bookingStatus" @change="callModify(booking.bId)">
                <option>待確認</option>
                <option>已確認</option>
                <option>已入住</option>
                <option>已退房</option>
                <option>訂單完成</option>
                <option>取消訂單</option>
            </select>
        </td>
        <td><button type="button" @click="removeBooking(booking.bId)">刪除訂單</button></td>
                
    </tr>
    
</template>
<script setup>
    const props = defineProps(["booking", "index"]);
    const emits = defineEmits(["openUpdate", "delete", "update"]);

    import { ref } from 'vue';

    const isRoomModify = ref(false);

    function roomModify(){
        isRoomModify.value = true;
    }


    function updateBooking(id) {
        emits("openUpdate", "update", id);
    }
    function removeBooking(id) {
        emits("delete", id);
    }

    function callModify(id){
        console.log("callModify",props.booking.roomNumber, props.booking.bookingStatus )
        isRoomModify.value = false;
        emits("update", id, props.booking.roomNumber, props.booking.bookingStatus)
    }

</script>
<style>

</style>
