<template>
    <div class="container">
        <h3>已選擇房間</h3>
        <div class="table-responsive">
            <table class="table" style="width:100%">
                <thead>
                    <tr class="table-primary">
                        <th scope="col">#</th>
                        <th scope="col">房型</th>
                        <th scope="col">入住日期</th>
                        <th scope="col">退房日期</th>
                        <th scope="col">天數</th>
                        <th scope="col">間數</th>
                        <th scope="col">優惠</th>
                        <th scope="col">房價</th>
                        <th scope="col">訂金</th>
                        <th scope="col">刪除</th>
                    </tr>
                </thead>
                <tbody class="table-group-divider">
                    <tr v-for="item, index in cart" :key="item.rtId">
                        <td>{{ index + 1 }}</td>
                        <td>{{ item.roomName }}</td>
                        <td>{{ item.begin }}</td>
                        <td>{{ item.last }}</td>
                        <td>{{ item.days }}</td>
                        <td>
                            <div style="display: flex; align-items: center; padding: 1px;">
                                <button type="button"  @click="changeQuantity(index, 'decrease')" :disabled="item.quantity <= 1" style="width: 20px; height: 20px; font-size: 12px; padding: 2px; margin-right: 5px;">-</button>
                                {{ item.quantity }}
                                <button type="button"  @click="changeQuantity(index, 'increase')" style="width: 20px; height: 20px; font-size: 12px; padding: 2px; margin-left: 5px;">+</button>
                                <span v-if="item.showWarning" class="warning-text" >已達最大可預訂房間數量</span>
                            </div>
                        </td>
                        <td>{{ item.dDName }}</td>
                        <td>{{ item.price }}</td>
                        <td>{{ item.deposit }}</td>
                        <td style="width: 80px;"><button @click="removeItem(index)" style="width: 50px; height: 30px; font-size: 12px; padding: 2px; margin-left: 5px;">刪除</button></td>
                    </tr>
                </tbody>
            </table>
            <div class="text-center mt-3" > <!-- 使用Bootstrap的text-center類使按鈕置中，並增加一些上邊距 -->
                <div>總價格 (含稅及服務費)：{{ totalPrice }}</div>
            </div>
            <div class="text-center mt-3"> <!-- 使用Bootstrap的text-center類使按鈕置中，並增加一些上邊距 -->
                <button type="button" @click="backToRoom" class="btn btn-primary mx-2" style="width: 200px; background-color: #E04416;">繼續訂購</button> <!-- 增加水平間距 -->
                <button type="button" @click="goToCustomer" class="btn btn-primary mx-2" style="width: 200px; background-color:#E04416">結帳付款</button> <!-- 增加水平間距 -->
            </div>
    
        </div>

    </div>
</template>

<script setup>
    import { ref, onMounted, computed } from 'vue';
    import { useRouter } from "vue-router";
    import {calculateDeposit, calculatePrice} from "./priceCalculator.js"
    import Swal from "sweetalert2"

    const router = useRouter();
    const user = ref(null);

    const cart = ref(new Array());

    function backToRoom(){
        router.push({ name: "bookingRooms-link" })
    }

    function goToCustomer(){
        console.log("before router push = ",cart.value)
        if(cart.value.length===0){
            Swal.fire({
                text: "購物車是空的",
                icon: 'error',
                allowOutsideClick: false,
                confirmButtonText: '確認',
            }).then(() => {
            });
        }else{
            router.push({ name: "bookingForm-link" })
        }
    }

    function callCart(){
        const cartData = $cookies.get('cart');
        user.value = sessionStorage.getItem("username");
        
        if(cartData != null){
            cart.value = cartData.map(item => ({
                ...item,
                showWarning: false,
                price: 0,
                deposit: 0,
                dDName: item.discount != "" ? JSON.parse(item.discount).dDName : null
            }));
            cart.value.forEach((item, index) => callCalculate(index));
            updateCartInCookies();
        } else{
            cart.value = [];
        }
    }
    
    function callCalculate(index){
        let  discountObject = null;
        if(cart.value[index].discount !== ""){
            discountObject = JSON.parse(cart.value[index].discount);
        }
        let price = user.value ? cart.value[index].memberPrice : cart.value[index].flexiblePrice;
        cart.value[index].price = calculatePrice(price, discountObject, cart.value[index].days) * cart.value[index].quantity;
        cart.value[index].deposit = calculateDeposit(cart.value[index].price);
    }

    function changeQuantity(index, action){
        let oldQuan = cart.value[index].quantity;
        let roomAmount = cart.value[index].roomAmount;

        if (action === "increase") {
            if (oldQuan < roomAmount) {
                cart.value[index].quantity += 1;
                cart.value[index].showWarning = false;  // 隱藏警告
            } else {
                cart.value[index].showWarning = true;  // 顯示警告
                return; // 阻止繼續執行
            }
        } else {
            cart.value[index].quantity -= 1;
            cart.value[index].showWarning = false;  // 隱藏警告
        }
        callCalculate(index);
        updateCartInCookies();
    }

    function removeItem(index) {
        cart.value.splice(index, 1);
        updateCartInCookies();
        // if (cart.value.length === 0) {
        //     cookies.remove('cart');
        // }
    }
    
    function updateCartInCookies() {
        $cookies.set('cart', JSON.stringify(cart.value));
    }


    onMounted(function () {
    callCart();
});

// 先計算總價格
const totalPrice = computed(() => {
    return cart.value.reduce((acc, item) => acc + item.price, 0);
});




</script>

<style scoped>
    .warning-text {
        color: red;
        margin-left: 10px;
    }
    .container {
    max-width: 100%;
    min-width: 100%;
    margin: 0 auto;
    padding: 20px;
    background-color: #ddd;
    background-size: cover;
}

</style>