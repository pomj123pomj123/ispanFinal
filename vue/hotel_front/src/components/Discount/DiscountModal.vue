<template>
    <div ref="exampleModalRef" class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-xl">
            <div class="modal-content">
                <div class="modal-header">
                    <h1 class="modal-title fs-5" id="exampleModalLabel">Modal title</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="container">
                        <div class="row">
                            <div class="col-8">
                                <table>
                                    <tr>
                                        <td>適用旅館: </td>
                                        <td>{{ ModalFormData.hotelName }} </td>
                                    </tr>
                                    <tr>
                                        <td>優惠類型：</td>
                                        <td><input type="radio" name="discountType" v-model="ModalFormData.discountType" value="專案" @change="selectProjOrPromoCode('proj')">專案
                                            <input type="radio" name="discountType" v-model="ModalFormData.discountType" value="折扣碼" @change="selectProjOrPromoCode('promoCode')">折扣碼</td>
                                    </tr>
                                    <tr>
                                        <td>名稱：</td>
                                        <td><input type="text" v-model="ModalFormData.name" placeholder="請輸入專案名稱" @blur="checkName(ModalFormData.name)"><span>{{nameMsg}}</span></td>
                                    </tr>
                                    <tr>
                                        <td>折扣碼：</td>
                                        <td><input type="text" v-model="ModalFormData.promoCode" @blur="checkPromoCode(ModalFormData.promoCode)" placeholder="" :disabled="promoCodeIsDisabled"><span>{{promoCodeMsg}}</span></td>
                                    </tr>
                                    <tr>
                                        <td>折扣類型：</td>
                                        <!-- 根據selectedOption動態的設定class -->
                                        <td><label :class="{ 'disabled': selectedOption !== 'rate' }">
                                            
                                            <input type="radio" name="PriceOrRate"  value="rate" v-model="selectedOption" @focus="selectOptionFuntion('rate')">
                                            打<input type="text" v-model="ModalFormData.discountRate" @focus="selectOptionFuntion('rate')" size="3">折</label><br>
                                            <i class="bi bi-info-lg"></i>說明：打7折請輸入70，打95折請輸入95，只接受整數。不得低於五折<br>
                                            <label :class="{ 'disabled': selectedOption !== 'price' }">
                                            <input type="radio" name="PriceOrRate" value="price" v-model="selectedOption" @focus="selectOptionFuntion('price')">
                                            折<input type="text" v-model="ModalFormData.discountPrice"  @focus="selectOptionFuntion('price')" size="3">元</label><br>

                                            
                                            <input type="checkbox" v-model="ModalFormData.memberonly">僅限會員使用<br>
                                            <input type="checkbox" v-model="ModalFormData.idVerification">請櫃檯人員於辦理 CHECK IN 時再次確認顧客是否符合優惠身分(如壽星優惠)
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>起始日 <br>
                                            結束日
                                        </td>
                                        <td><input type="date" v-model="ModalFormData.beginDate"><br>
                                            <input type="date"  v-model="ModalFormData.lastDate">  
                                            <input type="checkbox" v-model="dateUnlimited" @click="handleDateUnlimited">永久
                                        <div v-if="!startEndDateIsValidate" style="color: red; font-weight: bold; font-size: smaller;">結束日不能早於起始日</div></td>
                                    </tr>
                                    <tr>
                                        <td>使用次數上限：</td>
                                        <td><input type="text" v-model="ModalFormData.maxTimes" v-show="!maxTimesUnlimited">

                                            <input type="checkbox" v-model="maxTimesUnlimited" @change="handlemaxTimesUnlimited">無限制
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>備註：</td>
                                        <td><input type="text" v-model="ModalFormData.remark" >
                                        </td>
                                    </tr>
                                </table>
                                
                            </div>
                            <div class="col-4">
                                <h3>適用房型</h3>
                                <input type="checkbox" v-model="selectAllRooms" @change="toggleAllRooms">全選<br>

                                <h4><div v-for="room in allRoomTypeList" :key="room.rtId">
                                <input
                                    type="checkbox"
                                    :id="room.rtId"
                                    :value="room.rtId"
                                    v-model="ModalFormData.roomTypes"
                                />
                                <label :for="room.rtId">{{ room.roomName }}</label>
                                <br>
                                </div>
                            </h4>

                                <!-- ModalFormData.maxTimes={{ ModalFormData.maxTimes }} -->

                            </div>
                        </div>
                    </div>
                    
                </div>
                <div class="modal-footer">
                    <button type="submit" class="btn btn-primary"  @click="submit1" v-show="isCreate">確定新增</button> 
                    <button type="submit" class="btn btn-primary"  @click="submit1" v-show="!isCreate">確定修改</button>        
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">取消</button>
                </div>
            </div>
        </div>
    </div>

</template>
    
<script setup>
//傳入
    const props = defineProps(["ModalFormData","isCreate"]);
    const emits = defineEmits(["submit","update"]);

    import { ref, onMounted,computed,watch } from "vue";
    import bootstrap from 'bootstrap/dist/js/bootstrap.bundle.min.js'
    import axiosapi from "@/plugins/axios.js";
    
    
//元件中用到的一些變數
    const promoCodeMsg=ref(null)
    const nameMsg=ref(null)
    const selectedOption = ref('rate');// rate/price
    const promoCodeIsDisabled= ref(true);
    const maxTimesUnlimited=ref(true)
    const selectAllRooms=ref(false)
    const dateUnlimited=ref(false)

//處理使用次數無限制
    function handlemaxTimesUnlimited(){
        if (maxTimesUnlimited.value) {
            props.ModalFormData.maxTimes=9999999;
      } else {
        props.ModalFormData.maxTimes=null
      }
    }

//處理日期為永久(用WATCH)
    watch(dateUnlimited, (newValue) => {
      if (newValue) {
        props.ModalFormData.lastDate = "9999-12-31";
      } else {
        props.ModalFormData.lastDate = getTodayDate();
      }
    });
//處理取消勾選某些選項後也該取消全選// 0530還不會動
    watch(props.ModalFormData.roomTypes, (newValue) => {
      if (newValue) {
        console.log("123")
        selectAllRooms.value=false
      }
    });


//處理房型全選
function toggleAllRooms() {
      // 當額外的勾選框被勾選時，將所有房間類型加入到 ModalFormData.roomTypes 中
      if (selectAllRooms.value) {
        props.ModalFormData.roomTypes = allRoomTypeList.value.map(room => room.rtId);
      } else {
        // 當額外的勾選框沒有被勾選時，清空 ModalFormData.roomTypes
        props.ModalFormData.roomTypes = [];
      }
    }


//根據選到打N折或折價N元去處理
    const selectOptionFuntion = (option) => {
      selectedOption.value = option;
      if(option=="rate"){
        props.ModalFormData.discountPrice=null;
      }else if(option=="price"){
        props.ModalFormData.discountRate=null;
      }
    };
//根據選到專案或折扣碼去處理
const selectProjOrPromoCode = (option) => {
    console.log("ModalFormData.discountType",props.ModalFormData.discountType)
    console.log("option",option)
      if(option=="proj"){
        props.ModalFormData.promoCode=null;
        promoCodeMsg.value=null;
        promoCodeIsDisabled.value=true
      }else if(option=="promoCode"){
        promoCodeIsDisabled.value=false
      }
    };



    const exampleModalRef = ref(null);
    const exampleModalObj = ref(null);
    const allRoomTypeList =ref([]);
    onMounted(function() {
        exampleModalObj.value = new bootstrap.Modal(exampleModalRef.value);
    });

//取得今天日期並將格式轉換為yyyy-mm-dd
function getTodayDate() {
        //取得現在的日期時間
        const today = new Date();
        //取得年份
        const yyyy = today.getFullYear(); 
        // getMonth()回傳0~11所以要加1
        // String(字串).padStart(期望長度,填充字符)，但其實就算不用也不會出錯
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd}`;
    }

// //資料驗證：判斷起始日是否早於截止日
    
    const startEndDateIsValidate = computed(() => {
        return new Date(props.ModalFormData.beginDate) <= new Date(props.ModalFormData.lastDate);
    });


//驗證name 
function checkName(name){
        axiosapi.get(`/discount/isNameDuplicate/${name}`)
        .then(function(response){
            console.log("response.data.result",response.data.result);
            if(response.data.result==true){
                nameMsg.value="優惠名稱已存在，請重新輸入"
            }else{
                nameMsg.value="確認可用 無重複"
            }
        })
        .catch(function(error){
            console.log("something wrong");
        })

    }

//驗證PromoCode
    function checkPromoCode(promoCode){
        if(promoCode===""){
            promoCodeMsg.value="請輸入折扣碼"
            return;
        }else if(promoCode.length<6){
            promoCodeMsg.value="請輸入折扣碼，至少需6個字"
            return;
        }else{
            axiosapi.get(`/discount/isPromoCodeDuplicate/${promoCode}`)
        .then(function(response){
            console.log("response.data.result",response.data.result);
            if(response.data.result==true){
                promoCodeMsg.value="折扣碼已存在，請重新輸入"
            }else{
                promoCodeMsg.value="確認可用 無重複"
            }
        })
        .catch(function(error){
            console.log("something wrong");
        })
        }
    }
    


//送出表單：把表單中的資料傳到父元件
function submit1() {

    // 根據 beginDate和lastDate 判斷 status 的值

    const today = new Date(getTodayDate()); 
    const beginDate = new Date(props.ModalFormData.beginDate);  
    const lastDate = new Date(props.ModalFormData.lastDate);
    if(props.ModalFormData.status==="暫停中"){  //如果是暫停中就不更新狀態
        //do nothing
    }else if(props.ModalFormData.status!="暫停中"){  //非暫停狀態才要判定狀態
        if (beginDate > today) { //0623 > 0518
            props.ModalFormData.status = '尚未開始';
        } else if (beginDate <= today && lastDate >= today){ //0623 > 0518
            props.ModalFormData.status = '啟用中';
        }else if(lastDate < today){
            props.ModalFormData.status = '已封存'
        }
    }
    // 觸發父元件的函數，並傳遞資料
    emits('submit', props.ModalFormData,startEndDateIsValidate.value)
    
}

    function showModal(action,id) {
        dateUnlimited.value=false
        //開啟Modal時把promoCodeMsg初始化為空字串
        if(action==="insert") {
            promoCodeMsg.value=""
            nameMsg.value=""
            props.ModalFormData.discountType= "專案",
            props.ModalFormData.promoCode=""
            props.ModalFormData.name= ""
            props.ModalFormData.beginDate= getTodayDate(),
            props.ModalFormData.lastDate= getTodayDate()
            props.ModalFormData.discountRate=null
            props.ModalFormData.discountPrice=null
            props.ModalFormData.maxTimes= 99999
            maxTimesUnlimited.value=true
            props.ModalFormData.memberOnly="false",
            props.ModalFormData.idVerification="false"
            props.ModalFormData.roomTypes=[]
        }
        //找所有房型
        axiosapi.get("/discount/findAllRoomType").then(function(response){
            console.log("response.data.list",response.data.list);
            allRoomTypeList.value=response.data.list;
            console.log("取得房型列表",allRoomTypeList.value);
            
        })
        .catch(function(error){

        })
        console.log(props.ModalFormData)

        exampleModalObj.value.show();
    }
    function hideModal() {
        exampleModalObj.value.hide();
    }
    defineExpose({
        showModal, hideModal
    });

</script>
    
<style scoped>
    .disabled input[type="text"] {
        background-color: #f1f1f1;
        border: 1px solid lightgrey;
    }
</style>