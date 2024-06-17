<template>
    <div class="container">

        <h3>訂單查詢</h3>
        <div v-if="showCheck">
            預定日期：<input type="date" v-model="reserveTime">{{ message }}<br>
            信箱：<input type="text" v-model="email"><br>
            <button type="button" @click="check()">確定</button>
    
            <!-- {{ result }} -->
        </div>
        <div v-if="showBook" >
            <div class="table-responsive">
                <table class="table-primary table-bordered">
                    <thead>
                        <tr class="table-primary text-center">
                            <th scope="col">客戶姓名</th>
                            <th scope="col">預定日期</th>
                            <th scope="col">預定時間</th>
                            <th scope="col">大人人數</th>
                            <th scope="col">小孩人數</th>
                            <th scope="col">手機號碼</th>
                            <th scope="col">E-mail</th>
                            <th scope="col">備註</th>
                        </tr>
                    </thead>
                    <tbody class="booking" v-if="result">
                        <tr class="text-center">
                            <td>{{ result.lastName }}{{ result.firstName }}</td>
                            <td>{{ result.reserveTime }}</td>
                            <td>{{ result.mealTime }}</td>
                            <td v-if="!isModify">{{ result.totalAdult }}</td>
                            <td v-if="isModify"><input v-model="result.totalAdult" type="text"></td>
                            <td v-if="!isModify">{{ result.totalChildren }}</td>
                            <td v-if="isModify"><input v-model="result.totalChildren" type="text"></td>
                            <td>{{ result.cellphone }}</td>
                            <td>{{ result.email }}</td>
                            <td v-if="!isModify">{{ result.remark }}</td>
                            <td v-if="isModify"><input v-model="result.remark" type="text"></td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="text-center mt-3">
                <button type="button" @click="modifyChange" v-if="!isModify" class="btn btn-primary mx-2">修改</button>
                <button type="button" @click="modify" v-if="isModify" class="btn btn-primary mx-2">確認修改</button>
                <button type="button" @click="demoifyChange" v-if="isModify" class="btn btn-primary mx-2">取消修改</button>
                <button type="button" @click="removebooking" v-if="isModify" class="btn btn-primary mx-2">取消訂單</button>
                <button type="button" @click="goToHome" class="btn btn-primary mx-2">回首頁</button>
            </div>
    
        </div>
    </div>
</template>
    
<script setup>
    import Swal from "sweetalert2"
    import axiosapi from "@/plugins/axios.js"
    import{ref, onMounted} from "vue";
    import {useRouter} from "vue-router";
import RestaurantBookingModal from "@/components/restaurant/RestaurantBookingModal.vue";

    const reserveTime = ref("");
    const email = ref("");
    const message = ref("");
    const router = useRouter();
    const result = ref(null);

    const showBook = ref(false);
    const showCheck = ref(true);


    function check(){
        let data={
            "reserveTime":reserveTime.value,
            "email":email.value,
        }

        axiosapi.post("restaurant/booking/find", data).then((response)=>{
            if(response.data.success){
                console.log('response.data.booking'+response.data.booking);
                console.log('response.data.booking.email'+response.data.booking.email);
                result.value=response.data.booking
                Swal.fire({
                    text: response.data.message,
                    icon: 'success',
                    allowOutsideClick: false,
                    confirmButtonText: '確認'
                }).then(function(result){
                    if(result.isConfirmed){
                        sessionStorage.setItem("booking",response.data.booking);
                        showBook.value = true
                        showCheck.value = false;
                    }
                });
            }else{
                this.message = response.data.message;
                setTimeout(function(){
                    Swal.close();
                },500);
            }
        }).catch(function(error){
            console.log("error", error);
            Swal.fire({
                    text: '登入失敗：'+error.message,
                    icon: 'error',
                    allowOutsideClick: false,
                    confirmButtonText: '確認'
                })
        })
        
    }


    const isModify = ref(false);
    const booking = ref("");
    const title = ref("");

    function modifyChange(){
        isModify.value = true;
    }
    function demoifyChange(){
        isModify.value = false;
    }
    function goToHome(){
        router.push({name: "home-link"})
    }
    function removebooking(){
        let data={
            "rebId":result.value.rebId
        }
        axiosapi.delete(`/restaurant/booking/remove/${result.value.rebId}`,data).then((response)=>{
            if(response.data.success){
                Swal.fire({
                    text: response.data.message,
                    icon: 'success',
                    allowOutsideClick: false,
                    confirmButtonText: '確認',
                }).then(function(result){
                    if(result.isConfirmed){
                        isModify.value = false;
                        goToHome();
                    }
                });
            }else{
                Swal.fire({
                    text: response.data.message,
                    icon: 'error',
                    allowOutsideClick: false,
                    confirmButtonText: '確認',
                });
            }
        }).catch(function(error){
            console.log("error", error);
            Swal.fire({
                text: '取消預約失敗:'+error.message,
                icon: 'error',
                allowOutsideClick: false,
                confirmButtonText: '確認',
            });
        });
    }
    function modify(){
        let data={
            "remark":result.value.remark,
            "totalAdult":result.value.totalAdult,
            "totalChildren":result.value.totalChildren,
            "rebId":result.value.rebId
        }
        
        axiosapi.put(`/restaurant/booking/modify/${result.value.rebId}`,data).then((response)=>{
            if(response.data.success){
                Swal.fire({
                    text: response.data.message,
                    icon: 'success',
                    allowOutsideClick: false,
                    confirmButtonText: '確認',
                }).then(function(result){
                    if(result.isConfirmed){
                        isModify.value = false;
                    }
                });
            }else{
                Swal.fire({
                    text: response.data.message,
                    icon: 'error',
                    allowOutsideClick: false,
                    confirmButtonText: '確認',
                });
            }
        }).catch(function(error){
            console.log("error", error);
            Swal.fire({
                text: '更新失敗:'+error.message,
                icon: 'error',
                allowOutsideClick: false,
                confirmButtonText: '確認',
            });
        });
    }

    function findBooking(){
        booking.value = JSON.parse(sessionStorage.getItem("booking"));
        if (booking.value) {
            lastName.value = booking.value.lastName;
            firstName.value = booking.value.firstName;
            email.value = booking.value.email;
            cellphone.value = booking.value.cellphone;
            totalAdult.value = booking.value.totalAdult;
            totalChildren.value = booking.value.totalChildren;
            remark.value = booking.value.remark;
            reserveTime.value = booking.value.reserveTime;
            mealTime.value = booking.value.mealTime;
        } else {
            Swal.fire({
                text: '找不到訂單',
                icon: 'error',
                allowOutsideClick: false,
                confirmButtonText: '確認',
            }).then(() => {
                goToHome();
            });
        }
        // booking.value = JSON.parse(sessionStorage.getItem("booking"));
        
        // let data ={
        //     "booking" :booking.value
            
        //     // <!--"lastName":lastName.value,
        //     // "firstName":firstName.value,
        //     // "email":email.value,
        //     // "cellphone":cellphone.value,
        //     // "totalAdult":totalAdult.value,
        //     // "totalChildren":totalChildren.value,
        //     // "remark":remark.value,
        //     // "reserveTime": reserveTime.value,
        //     // "mealTime":mealTime.value-->

        // };
        // axiosapi.post("/restaurant/booking/find", data).then((response)=>{
        //     if(response.data.success){
        //         const bookingdata = response.data.booking;
        //         if(bookingdata != null){
        //             lastName.value = bookingdata.lastName,
        //             firstName.value = bookingdata.firstName,
        //             email.value = bookingdata.email,    
        //             cellphone.value = bookingdata.cellphone,
        //             totalAdult.value = bookingdata.totalAdult,
        //             totalChildren.value = bookingdata.totalChildren,
        //             remark.value = bookingdata.remark,
        //             reserveTime.value = bookingdata.reserveTime,
        //             mealTime.value = bookingdata.mealTime                   
        //         }
        //         sessionStorage.removeItem("booking");
    //         }else{
    //             sessionStorage.removeItem("booking");

    //             Swal.fire({
    //                 text: response.data.message,
    //                 icon: 'error',
    //                 allowOutsideClick: false,
    //                 confirmButtonText: '確認',
    //             }).then(()=>{
    //                 goToHome();
    //             });
    //         }
    //     }).catch(function(error){
    //         console.log("error", error);
    //         Swal.fire({
    //             text: '查詢失敗:'+error.message,
    //             icon: 'error',
    //             allowOutsideClick: false,
    //             confirmButtonText: '確認',
    //         });
    //     }).then(()=>{
    //                 goToHome();
    //     });
        
    }

    // onMounted(function(){
    //     check();
    //     console.log("before findBooking");
    //     findBooking();
    //     console.log("after findBooking");
    // })
    
    
    
</script>
    
<style scoped>
    .container{
    max-width: 100%;
    min-width: 100%;
    margin: 0 auto;
    padding :20px;
    background-color: #ddd;
    background-size: cover;
}
</style>

