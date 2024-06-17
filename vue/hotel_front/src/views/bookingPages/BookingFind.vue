<template>
    <div class="container">
        <h3>查詢訂單</h3>
        <div class="table-responsive">
            <table class="table table-striped table-bordered">
                <thead>
                    <tr class="table-primary text-center">
                        <th scope="col">訂購日期</th>
                        <th scope="col">訂購人</th>
                        <th scope="col">身分證字號／護照號碼</th>
                        <th scope="col">手機號碼</th>
                        <th scope="col">E-Mail</th>
                    </tr>
                </thead>
                <tbody v-if="booking">
                    <tr class="text-center">
                        <td>{{ bookingDate }}</td>
                        <td>{{ name }}</td>
                        <td>{{ showId }}</td>
                        <td>{{ booking.tel }}</td>
                        <td>{{ booking.email }}</td>
                    </tr>
                </tbody>
            </table>
            <table class="table table-striped table-bordered">
                <thead>
                    <tr class="table-primary text-center">
                        <th scope="col">旅館名稱</th>
                        <th scope="col">地址</th>
                        <th scope="col">電話</th>
                        
                    </tr>
                </thead>
                <tbody v-if="booking">
                    <tr class="text-center">
                        <td>{{ booking.hotelName }}</td>
                        <td>{{ booking.hotelAddress }}</td>
                        <td>{{ booking.hotelTel }}</td>
                        
                    </tr>
                </tbody>
            <!-- </table>
            <table class="table table-striped table-bordered"> -->
                <thead>
                    <tr class="table-primary text-center">
                        <th scope="col">預計抵達時間</th>
                        <th scope="col" colspan="2">備註</th>
                    </tr>
                </thead>
                <tbody v-if="booking">
                    <tr>
                        <td  class="text-center" v-if="!isModify">
                            {{ booking.arrivalTime }}
                        </td>
                        <td  class="text-center" v-if="isModify">
                            <select class="form-select" id="arrivalTime" v-model="booking.arrivalTime">
                                <option>15:00</option>
                                <option>16:00</option>
                                <option>17:00</option>
                                <option>18:00</option>
                            </select>
                        </td>
                        <td colspan="2" v-if="!isModify">{{ booking.remark }}</td>
                        <td colspan="2" v-if="isModify"><input v-model="booking.remark" type="text"></td>
                    </tr>
                </tbody>
            </table>
            <table class="table table-striped table-bordered">
                <thead>
                    <tr class="table-primary text-center">
                        <th scope="col">#</th>
                        <th scope="col">房型</th>
                        <th scope="col">入住日期</th>
                        <th scope="col">專案</th>
                        <th scope="col">折扣</th>
                        <th scope="col">總價</th>
                        <th scope="col">訂金</th>
                        <th scope="col">早餐</th>
                    </tr>
                </thead>
                <tbody class="text-center" v-if="booking">
                        <tr v-for="(item, index) in booking.rooms" :key="item.roomNumber">
                            <td>{{ index + 1 }}</td>
                            <td>{{ item.roomType }}</td>
                            <td>{{ item.beginDate }} - {{ item.lastDate }}</td>
                            <td><span v-if="item.packageDdName">{{ item.packageDdName }}</span></td>
                            <td><span v-if="item.promoDdName">{{ item.promoDdName }}</span></td>
                            <td>{{ (item.amountPayable) + (item.deposit) }}</td>
                            <td>{{ item.deposit }}</td>
                            <td>
                                <span v-if="!isModify">{{ item.breakfast }}</span>
                                <span v-if="isModify">
                                    <select class="form-select" id="arrivalTime" v-model="item.breakfast" @change="breakfastChange(item)">
                                        <option>是</option>
                                        <option>否</option>
                                    </select>
                                </span>
                            </td>
                        </tr>
                </tbody>
            </table>
            <div class="text-center mt-3"> 
                <table class="table table-striped table-bordered">
                    <thead>
                        <tr class="table-primary text-center">
                            <th scope="col">總價格</th>
                            <th scope="col">總訂金</th>
                            <th scope="col">付款狀態</th>
                        </tr>
                    </thead>
                    <tbody v-if="booking">
                        <tr class="text-center">
                            <td>{{ totalPrice }}</td>
                            <td>{{ totalDeposit }}</td>
                            <td>{{ booking.paymentStatus }}</td>
                        </tr>
                        <tr>
                            <td>
                                <select class="form-select" id="title" v-model="payType" :disabled="isPaid" @change="changePaidType()">
                                    <option value="deposit" v-if="!depositPaid">先付訂金</option>
                                    <option value="remain" v-if="depositPaid">付剩餘金額</option>
                                    <option value="full" v-if="unPaid">全額繳清</option>
                                </select>
                            </td>
                            <td><button :disabled="isPaid" type="button" @click="paid" >付款</button></td>
                            <td>付款金額：{{paymentAmountCal}}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="text-center mt-3"> 
                <button type="button" @click="modifyChange" class="btn btn-primary mx-2" v-if="!isModify">修改</button>
                <button type="button" @click="modify" class="btn btn-primary mx-2" v-if="isModify">確認修改</button>
                <button type="button" @click="demodifyChange" class="btn btn-primary mx-2" v-if="isModify">取消修改</button>
                <button type="button" @click="goToHome" class="btn btn-primary mx-2">回首頁</button>
            </div>
    
        </div>

    </div>
        
</template>
    
<script setup>
    import Swal from "sweetalert2"
    import axiosapi from "@/plugins/axios.js";
    import { onMounted, ref } from "vue"
    import { useRouter } from "vue-router"

    const orderNumber = ref("");
    const booking = ref(null);
    const bookingDate = ref(null);
    const title = ref("");
    const name = ref("");
    const showId = ref("");
    const totalPrice = ref(0);
    const totalDeposit = ref(0);
    const isModify = ref(false);
    const router = useRouter();
    const breakfastC = ref([])
    const isPaid = ref(false);
    const payType = ref("deposit");
    const depositPaid = ref(false);
    const paymentAmountCal = ref(0);
    const unPaid = ref(true);

    const totalPaid = ref(0);
    const totalPaidDeposit = ref(0);

    function changePaidType(){
        if(payType.value === "deposit"){
            paymentAmountCal.value = totalDeposit.value - totalPaidDeposit.value;
        } else{
            paymentAmountCal.value = totalPrice.value - totalPaid.value;
        }

    }

    function paid(){


        let inputName = "";
        if (booking.value.identification === null) {
            inputName = `${booking.value.firstName} ${booking.value.lastName} ${title.value}`;
        } else {
            inputName = `${booking.value.lastName} ${booking.value.firstName} ${title.value}`;
        }
        let bookingInfo = {
            "orderNumber" : booking.value.orderNumber,
            "name" :  inputName,
            "payType" : payType.value
        }
        $cookies.set('bookingInfo', bookingInfo);
        $cookies.set('paymentAmountCal', paymentAmountCal.value);
        router.push({ name: "bookingPayment-link" });
    }

    function breakfastChange(room){
        let result;
        if(room.breakfast === "是"){
            result = true;
        }
        if(room.breakfast === "否"){
            result = false;
        }
        console.log("breakfast result = ", result)
        breakfastC.value.push({
                    "bId": room.bId,
                    "breakfast": result,
                });
    }

    function modifyChange(){
        isModify.value = true;
    }

    function demodifyChange(){
        isModify.value = false;
    }

    function goToHome(){
        router.push({ name: "home-link" })
    }

    function modify(){
        let data = {
            "arrivalTime" : booking.value.arrivalTime,
            "customerRemark" : booking.value.remark,
            "bookings" : [...breakfastC.value]
        }

        axiosapi.put(`/booking/book/customer/modify/${booking.value.bdId}`,data).then((response) => {
            if(response.data.success) {
                Swal.fire({
                    text: response.data.message,
                    icon: 'success',
                    allowOutsideClick: false,
                    confirmButtonText: '確認',
                }).then(function (result) {
                    if(result.isConfirmed) {
                        sessionStorage.setItem("orderNumber", response.data.orderNumber);
                        findBooking();
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
        }).catch(function(error) {
            console.log("error", error);
            Swal.fire({
                text: '更新失敗：'+error.message,
                icon: 'error',
                allowOutsideClick: false,
                confirmButtonText: '確認',
            })
        });
    }

    function findBooking(){
        orderNumber.value = sessionStorage.getItem("orderNumber");
        let data = {"orderNumber" : orderNumber.value};
        axiosapi.post("/booking/book/customer/find", data).then((response) => {
            if(response.data.success) {
                const bookingdata = response.data.booking;
                if(bookingdata != null){
                    booking.value = bookingdata;
                    valueBreakfast();
                    if (booking.value.titleOfCourtesy) {
                        title.value = booking.value.titleOfCourtesy;
                    }

                    if (booking.value.identification === null) {
                        name.value = `${booking.value.firstName} ${booking.value.lastName} ${title.value}`;
                    } else {
                        name.value = `${booking.value.lastName} ${booking.value.firstName} ${title.value}`;
                    }

                    showId.value = formattedIdPassort();

                    if(booking.value.paymentStatus === "未付款"){
                        unPaid.value = true;
                    } else{
                        unPaid.value = false;
                    }

                    totalPaidDeposit.value = 0;
                    totalPaid.value = 0;
                    
                    let tempPrice = 0, tempDeposit = 0;
                    for(let room of booking.value.rooms){
                        if(room.deposit === null){
                            room.deposit = 0;
                        }
                        totalPaidDeposit.value += room.depositPaid;
                        totalPaid.value += (room.amountPaid + room.depositPaid);
                        tempPrice += (room.amountPayable + room.deposit);
                        tempDeposit += room.deposit;
                    }
                    totalPrice.value = tempPrice;
                    totalDeposit.value = tempDeposit;
                    if(totalPaidDeposit.value === totalDeposit.value){
                        console.log("totalPaidDeposit ",totalPaidDeposit.value);
                        console.log("totalDeposit.value ",totalDeposit.value);
                        depositPaid.value = true;
                    }
                    if(totalPaid.value === totalPrice.value){
                        console.log("tempPrice ",totalPaid.value);
                        console.log("totalPrice.value ",totalPrice.value);
                        isPaid.value = true;
                    }
                    paymentAmountCal.value = totalDeposit.value - totalPaidDeposit.value;
                }

                sessionStorage.removeItem("orderNumber");

            } else {
                sessionStorage.removeItem("orderNumber");
                
                Swal.fire({
                    text: response.data.message,
                    icon: 'error',
                    allowOutsideClick: false,
                    confirmButtonText: '確認',
                }).then(() => {
                    goToHome();
                });
            }
        }).catch(function(error) {
            console.log("error", error);
            Swal.fire({
                text: '查詢失敗：'+error.message,
                icon: 'error',
                allowOutsideClick: false,
                confirmButtonText: '確認',
            }).then(() => {
                goToHome();
            });
            sessionStorage.removeItem("orderNumber");
        });
    }
    
    function valueBreakfast(){
        if (booking.value && booking.value.rooms) {
            for (let room of booking.value.rooms) {
                room.breakfast = room.breakfast ? "是" : "否";
                if(bookingDate.value === null){
                    bookingDate.value = room.bookingDate;
                }
            }
        }
    }

    function formattedIdPassort(){
        if (!booking.value) return '';
        const id = booking.value.identification ? booking.value.identification : booking.value.passportNumber;
        if (!id) return '';
        return id.charAt(0) + '*'.repeat(id.length - 2) + id.charAt(id.length - 1);
    }


    onMounted(function(){
        findBooking();
        
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