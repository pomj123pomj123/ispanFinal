<template>
    <div class="container">
        <h3>訂單查詢</h3>
        <table>
            <tr>
                <td>
                    訂單編號：
                </td>
                <td>
                    <input type="text" v-model="orderNumber"> {{ message }}
                </td>
            </tr>
            <tr>
                <td>
                    信箱：
                </td>
                <td>
                    <input type="text" v-model="email">
                </td>
            </tr>
        </table>
        <button type="button" @click="addEmail">快速輸入信箱</button>
        
        <br>
        <button type="button" @click="check()">確定</button>

    </div>

</template>
    
<script setup>
    import Swal from "sweetalert2"
    import axiosapi from "@/plugins/axios.js";
    import { ref } from "vue"
    import { useRouter } from "vue-router"

    const orderNumber = ref("");
    const email = ref("");
    const message = ref("");
    const router = useRouter();

    function addEmail(){
        email.value = "tingvul7785@gmail.com"
    }

    function check(){
        let data={
            "orderNumber" : orderNumber.value,
            "email" : email.value
        }

        axiosapi.post("/booking/book/customer/check", data).then((response) => {
            if(response.data.success) {
                Swal.fire({
                    text: response.data.message,
                    icon: 'success',
                    allowOutsideClick: false,
                    confirmButtonText: '確認',
                }).then(function (result) {
                    if(result.isConfirmed) {
                        sessionStorage.setItem("orderNumber", response.data.orderNumber);
                        router.push({ name: "bookingFind-link" });
                    }
                });
            } else {
                this.message = response.data.message;
                setTimeout(function() {
                    Swal.close();
                }, 500);
            }
        }).catch(function(error) {
            console.log("error", error);
            Swal.fire({
                text: '登入失敗：'+error.message,
                icon: 'error',
                allowOutsideClick: false,
                confirmButtonText: '確認',
            });
        });
    }
    
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