<template>
        <div class="container">
                <h3>已經確認訂單</h3>
                <div>{{bookingInfo.name}} {{ bookingInfo.titleOfCourtesy }}</div><br>
                <div>訂單編號：{{bookingInfo.orderNumber}}</div>
                <div>付款狀態：{{bookingInfo.paymentStatus}}</div>
        </div>
        
</template>
        
<script setup>
        import { ref, onMounted  } from 'vue';
        import Swal from "sweetalert2"
        import axiosapi from "@/plugins/axios.js"

        const bookingInfo = ref("");

        function findByBookingNumber(){
                if(bookingInfo){
                        let orderNumber = bookingInfo.value.orderNumber;
                        axiosapi.get(`/booking/book/customer/findbyorder/${orderNumber}`).then(function(response){
                                if(response.data.success){
                                        bookingInfo.value.paymentStatus = response.data.paymentStatus;
                                } else{
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
        }

        onMounted(function(){
                bookingInfo.value = $cookies.get('bookingInfo');
                $cookies.remove('bookingInfo')
                findByBookingNumber();
        })



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