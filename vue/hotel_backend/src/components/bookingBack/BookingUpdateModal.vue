<template>

    <div ref="exampleModalRef" class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h1 class="modal-title fs-5" id="exampleModalLabel">訂單資訊</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <table>
                        <!-- 顧客資料 Customer -->
                        <tr v-if="isMember">
                            <td>會員帳號 : </td>
                            <td>{{ username }}</td>
                        </tr>
                        <tr>
                            <td>姓 : </td>
                            <td><input type="text" name="lastName" :value="lastName"
                                        @input="emits('update:lastName', $event.target.value)" :disabled="isMember"></td>
                        </tr>
                        <tr>
                            <td>名 : </td>
                            <td><input type="text" name="firstName" :value="firstName"
                                        @input="emits('update:firstName', $event.target.value)" :disabled="isMember"></td>
                        </tr>
                        <tr>
                            <td>稱謂：</td>
                            <td>
                                <select class="form-select" id="title" :value="titleOfCourtesy" :disabled="isMember" @change="emits('update:titleOfCourtesy', $event.target.value)">
                                    <option>先生</option>
                                    <option>女士</option>
                                    <option>其他</option>
                                </select>
                            </td>
                        </tr>
                        <tr>
                            <td>生日：</td>
                            <td>
                                <input type="date" class="form-control" id="birthday" :value="birthday" :disabled="isMember" @change="emits('update:birthday', $event.target.value)">
                            </td>
                        </tr>
                        <tr>
                            <td>性別：</td>
                            <td>
                                <div class="form-check form-check-inline">
                                    <input class="form-check-input" type="radio" name="gender" id="genderMale" value="male" :checked="gender === 'male'" :disabled="isMember" @change="$emit('update:gender', $event.target.value)">
                                    <label class="form-check-label" for="genderMale">男</label>
                                </div>
                                <div class="form-check form-check-inline">
                                    <input class="form-check-input" type="radio" name="gender" id="genderFemale" value="female" :checked="gender === 'female'" :disabled="isMember" @change="$emit('update:gender', $event.target.value)">
                                    <label class="form-check-label" for="genderFemale">女</label>
                                </div>
                                <div class="form-check form-check-inline">
                                    <input class="form-check-input" type="radio" name="gender" id="genderOther" value="其他" :checked="gender === '其他'" :disabled="isMember" @change="$emit('update:gender', $event.target.value)">
                                    <label class="form-check-label" for="genderOther">其他</label>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td>國籍</td>
                            <td>
                                <select class="form-select" id="title" :value="country" @change="handleCountryChange" :disabled="isMember">
                                    <option v-for="country in countries" :key="country.id" :value="country.name">
                                        {{ country.name }}
                                    </option>
                                </select>
                            </td>
                        </tr>
                        <tr>
                            <td>地址：</td>
                            <td>
                                <input type="text" class="form-control" id="address" :value="address" :disabled="isMember" @input="$emit('update:address', $event.target.value)">
                            </td>
                        </tr>
                        <tr>
                            <td>身分證字號：</td>
                            <td>
                                <input type="text" class="form-control" id="identification" :disabled="!isTaiwan || isMember" :value="identification" @input="$emit('update:identification', $event.target.value)">
                            </td>
                        </tr>
                        <tr>
                            <td>護照號碼：</td>
                            <td>
                                <input type="text" class="form-control" id="passportNumber" :disabled="isTaiwan || isMember" :value="passportNumber" @input="$emit('update:passportNumber', $event.target.value)">
                            </td>
                        </tr>
                        <tr>
                            <td>E-mail：</td>
                            <td>
                                <input type="email" class="form-control" id="email" :value="email" :disabled="isMember" @input="$emit('update:email', $event.target.value)">
                            </td>
                        </tr>
                        <tr>
                            <td>手機電話：</td>
                            <td>
                                <input type="tel" class="form-control" id="tel" :value="tel" :disabled="isMember" @input="$emit('update:tel', $event.target.value)">
                            </td>
                        </tr>
                        <tr>
                            <td>是否收取優惠信件：</td>
                            <td>
                                <div class="form-check form-check-inline">
                                    <input class="form-check-input" type="radio" name="allowPromotionMailYes" value="是" :value="allowPromotionMail" :disabled="isMember" @change="$emit('update:allowPromotionMail', $event.target.value)">
                                    <label class="form-check-label" for="allowPromotionMailYes">是</label>
                                </div>
                                <div class="form-check form-check-inline">
                                    <input class="form-check-input" type="radio" name="allowPromotionMailNo" value="否" :value="allowPromotionMail" :disabled="isMember" @change="$emit('update:allowPromotionMail', $event.target.value)">
                                    <label class="form-check-label" for="allowPromotionMailNo">否</label>
                                </div>
                            </td>
                        </tr>
                    </table>
                    <button @click="addBookingDetail">新增預訂詳情</button><button @click="removeBookingDetail">刪除預訂</button>
                    <button @click="handleAddData">輸入資料</button>
                    <div v-for="(room, index) in rooms" :key="index">
                    <BookingDetailInsert 
                    :room="room.room" 
                    :isMember="isMember" 
                    v-model:beginDate="room.room.beginDate"
                    v-model:lastDate="room.room.lastDate"
                    v-model:promoDdid="room.room.ddIds[1].ddId"
                    v-model:amountPayable="room.room.amountPayable"
                    v-model:deposit="room.room.deposit"></BookingDetailInsert>
                    </div>
                    
                </div>
                <div class="modal-footer">
                    <div>總價格：{{  totalAmountPayable+totalDeposit }}　總訂金：{{ totalDeposit }}</div>
                    <button type="button" class="btn btn-primary"
                            v-show="isShowButtonInsert" @click="doInsert()">新增</button>
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                </div>
            </div>
        </div>
    </div>

</template>
    
<script setup>
    const props = defineProps(["username", "lastName", "firstName", 
                                "identification", "passportNumber", "country",
                                "email", "gender", "birthday",
                                "address", "allowPromotionMail",
                                "titleOfCourtesy", "tel","isShowButtonInsert","isMember"]);
    const emits = defineEmits(['update:lastName','update:firstName','update:identification',
                                'update:passportNumber','update:country','update:email',
                                'update:gender','update:birthday','update:address',
                                'update:allowPromotionMail','update:titleOfCourtesy','update:tel',
                                "insert", "addData"]);

    import { ref, onMounted, reactive, computed } from "vue";
    import bootstrap from 'bootstrap/dist/js/bootstrap.bundle.min.js'
    import countries from "@/assets/JSON/world.json"
    import BookingDetailInsert from "@/components/bookingBack/BookingDetailInsert.vue"


    // 判斷用
    const isTaiwan = ref(true);

    const rooms = ref([]);

    function doInsert(){
        emits("insert", rooms.value.map(room => room.room))
    }

    function handleAddData(){
        isTaiwan.value = false;
        emits("addData");
    }

    function removeBookingDetail(){
        if(rooms.value.length > 0){
            rooms.value.pop();
        }
    }

    function addBookingDetail() {
        const newRoom = ref({
            "rtId": null,
            "beginDate": null,
            "lastDate": null,
            "additionalBed": 0,
            'breakfast': true,
            "typeName": null,
            "amountPayable": 0,
            "paymentMethod": "信用卡",
            "deposit": 0,
            "ddIds":  [
                { "ddId": null},
                { "ddId": null}
            ]
        });

        rooms.value.push({ room: reactive(newRoom) });
    }

        const totalAmountPayable = computed(() => {
        return rooms.value.reduce((total, roomWrapper) => total + roomWrapper.room.amountPayable, 0);
        });

        const totalDeposit = computed(() => {
        return rooms.value.reduce((total, roomWrapper) => total + roomWrapper.room.deposit, 0);
        });

    const exampleModalRef = ref(null);
    const exampleModalObj = ref(null);

    function handleCountryChange(event){
        const selectedCountry = event.target.value;
        changeCountry(selectedCountry);
        emits('update:country', selectedCountry)
    }

    

    function changeCountry(country) {
            if(country === "台灣"){
                console.log("國籍變回台灣")
                isTaiwan.value = true;
                console.log(isTaiwan.value)
            } else{
                console.log("國籍非台灣")
                isTaiwan.value = false;
                console.log(isTaiwan.value)
            }
            return
        }

    


    onMounted(function() {
        exampleModalObj.value = new bootstrap.Modal(exampleModalRef.value);

        

    });

    function showModal() {
        exampleModalObj.value.show();
    }
    function hideModal() {
        exampleModalObj.value.hide();
    }
    defineExpose({
        showModal, hideModal
    });

</script>
    
<style>
    
</style>