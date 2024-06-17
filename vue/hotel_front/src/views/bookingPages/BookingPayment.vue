<template>
        <div v-html="callpay"></div>
</template>
    
<script setup>
    import { ref, onMounted, onUnmounted, nextTick} from 'vue';
    import Swal from "sweetalert2";
    import axiosapi from "@/plugins/axios.js";
    const callpay  = ref("");

    function callPayment(paymentAmountCal, orderNumber, name, payType){

        let data = {
            "orderNumber": orderNumber,
            "totalPaid": ""+paymentAmountCal+"",
            "customerName": name,
            "payType": payType
        }
        //串接綠界
        axiosapi.post("/booking/book/paymentstart", data).then(async function(response){
            console.log("After payment");
            console.log(response.data);
            callpay.value = response.data;
            // document.getElementById("formConfirm").value = response.data;
            // document.getElementById("allPayAPIForm").submit();
            Swal.fire({
                text: "Loading......",
                showConfirmButton: false,
                allowOutsideClick: false,
            });
            
            setTimeout(function() {
                Swal.close();
            }, 500);
            await nextTick();
            const formElement = document.getElementById('allPayAPIForm');
            console.log("formElemnt = ", formElement)
            if (formElement) {
                formElement.submit();
            }
        })
    }

    onMounted(function(){
        let bookingInfo =$cookies.get('bookingInfo');
        if(bookingInfo!==null){
            console.log("bookingInfo", bookingInfo)
            let orderNumber = bookingInfo.orderNumber;
            let name = bookingInfo.name
            let paymentAmountCal = $cookies.get("paymentAmountCal");
            let payType = bookingInfo.payType;
            console.log("orderNumber = ", orderNumber)
            console.log("paymentAmountCal", paymentAmountCal)
            callPayment(paymentAmountCal, orderNumber, name, payType);
            $cookies.remove("paymentAmountCal")
        }
    })
</script>
    
<style scoped>
    
    
</style>