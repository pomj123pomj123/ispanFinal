<template>
            <h3>Login</h3>
    <table>
        <tr>
            <td>ID : </td>
            <td><input type="text" name="username" v-model="username"></td>
            <td><span class="error">{{message}}</span></td>
        </tr>
        <tr>
            <td> </td>
            <td align="right"><button type="button" @click="login()">Login</button></td>
        </tr>
        <tr>
            <td> </td>
            <td align="right"><button type="button" @click="logout()">Logout</button></td>
        </tr>
    </table>
</template>
    
<script setup>
    import Swal from "sweetalert2"
    import axiosapi from "@/plugins/axios.js"
    import { ref } from "vue"
    import { useRouter } from "vue-router"
    const username = ref("");
    const message = ref("");
    const router = useRouter();
    let userid = ref(0);

    function logout(){
        sessionStorage.removeItem("username");
    }

    function login() {
        Swal.fire({
            text: "Loading......",
            showConfirmButton: false,
            allowOutsideClick: false,
        });

        if(username.value==="") {
            username.value = null;
        } else{
            userid = username.value;
        }

        axiosapi.defaults.headers.authorization = "";
        sessionStorage.removeItem("username");
        axiosapi.get(`/booking/login/${userid}`).then((response) => {
            if(response.data.success) {
                Swal.fire({
                    text: response.data.message,
                    icon: 'success',
                    allowOutsideClick: false,
                    confirmButtonText: '確認',
                }).then(function (result) {
                    if(result.isConfirmed) {
                        axiosapi.defaults.headers.authorization = "Bearer "+ response.data.token;
                        sessionStorage.setItem("username", response.data.username);
                        router.push({ name: "home-link" });
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
    
<style>
    
</style>