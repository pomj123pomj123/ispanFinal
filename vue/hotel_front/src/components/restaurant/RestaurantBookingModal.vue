<template>
    <div ref="exampleModalRef" class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div  class="modal-dialog modal-lg">
            <div  class="modal-content">
                <div  class="modal-header">
                    <h1 class="modal-title fs-5" id="exampleModalLabel" v-show="isCreate">新增訂單</h1>
                    <h1 class="modal-title fs-5" id="exampleModalLabel" v-show="!isCreate">修改訂單</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <table>
                        <tr>
                            <td>預定日期：</td>
                            <td><input type="date" v-model="formData.reserveTime"></td>
                        </tr>
                        <tr>
                            <td>預定時間：</td>
                            <td><select class="form-select"  v-model="formData.mealTime">
                                <option>08:00</option>
                                <option>08:30</option>
                                <option>09:00</option>
                                <option>09:30</option>
                                <option>11:00</option>
                                <option>11:30</option>
                                <option>12:00</option>
                                <option>12:30</option>
                                <option>13:00</option>
                                <option>13:30</option>
                                <option>17:00</option>
                                <option>17:30</option>
                                <option>18:00</option>
                                <option>18:30</option>
                                <option>19:00</option>
                                <option>19:30</option>
                            
                            </select></td>
                        </tr>
                        <tr>
                            <td>客戶姓氏：</td>
                            <td><input type="text" v-model="formData.lastName" ></td>
                        </tr>
                        <tr>
                            <td>客戶名字：</td>
                            <td><input type="text" v-model="formData.firstName" ></td>
                        </tr>
                        <tr>
                            <td>E-mail：</td>
                            <td><input type="email" v-model="formData.email" ></td>
                        </tr>
                        <tr>
                            <td>手機號碼：</td>
                            <td><input type="tel" v-model="formData.cellphone" ></td>
                        </tr>
                        <tr>
                            <td>大人人數：</td>
                            <td><input type="number" v-model="formData.totalAdult" ></td>
                        </tr>
                        <tr>
                            <td>小孩人數：</td>
                            <td><input type="number" v-model="formData.totalChildren" ></td>
                        </tr>
                        <tr>
                            <td>備註：</td>
                            <td><input type="text" v-model="formData.remark" ></td>
                        </tr>
                    </table>
                </div>
                <div>
                    <form>
                        <button type="submit" class="btn btn-primary"  @click="submit1" v-show="isCreate">確定新增</button> 
                        <button type="submit" class="btn btn-primary"  @click="submit1" v-show="!isCreate">確定修改</button>        
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">取消</button>
                    </form>
                </div>
            </div>
        </div>
    </div>
        
</template>
    
<script setup>
//import會用到的東西
    import { ref, onMounted,computed,watch  } from "vue";
    import bootstrap from 'bootstrap/dist/js/bootstrap.bundle.min.js'
//傳入的參數(新增的話不用傳入參數，修改的話要)
    const props = defineProps(["updateDataOringin", "isShowButtonInsert","isCreate", ]);//這邊要包含檔案?
//傳出的事件
    const emits = defineEmits(["submit"]);
    //新增時用來初始化表單資料  //純初始化用所以不用加ref
    const initialFormData={
        reId:1,
        reserveTime:getTodayDate(),
        mealTime:"",
        lastName:"",
        firstName:"",
        email:"",
        cellphone:"",
        totalAdult:"",
        totalChildren:"",
        remark:"",
    };

    // 使用 ref 來定義響應式 formData，真正用在表格裡的資料
    const formData = ref({ ...initialFormData }); 

    //修改時 使用 watch 監聽 props.isCreate 和 props.updateDataOringin 的變化
watch(() => props.updateDataOringin, () => {  //捨棄監聽isCreate, 反正只要updateDataOringin有變的話，isCreate一定也有變
    console.log("監聽到props.isCreate",props.isCreate)
      // 當任一監聽目標變化時，執行以下邏輯
        if (props.isCreate) {
        // 如果是創建模式，重置 formData 為初始值
        formData.value = { ...initialFormData };
        } else {
        // 如果不是創建模式，根據 updateDataOringin 更新 formData 的值
        console.log("01監聽到formData.value.rebId",formData.value.rebId)
        console.log("01監聽到props.updateDataOringin.rebId",props.updateDataOringin.rebId)
        formData.value.rebId=props.updateDataOringin.rebId;
        console.log("02監聽到formData.value.rebId",formData.value.rebId)
        console.log("02監聽到props.updateDataOringin.rebId",props.updateDataOringin.rebId)

        formData.value.reserveTime = props.updateDataOringin.reserveTime;
        formData.value.mealTime = props.updateDataOringin.mealTime;
        formData.value.lastName=props.updateDataOringin.lastName;
        formData.value.firstName = props.updateDataOringin.firstName;
        formData.value.email = props.updateDataOringin.email;
        formData.value.cellphone = props.updateDataOringin.cellphone;
        formData.value.totalAdult = props.updateDataOringin.totalAdult;
        formData.value.totalChildren = props.updateDataOringin.totalChildren;
        formData.value.remark = props.updateDataOringin.remark;
        }
    }, { immediate: true });

    //建立modal需要的參數
    const exampleModalRef = ref(null);//用於modal的 DOM 元素。
    const exampleModalObj = ref(null); //onMounted的時候把這個變成實例，用來呼叫show或hide等等
//組件掛載完成時要做的事
    onMounted(function() {
      //建立modal
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

    function showModal() {
        console.log("子元件呼叫showModal時props.isCreate",props.isCreate)
        exampleModalObj.value.show();
    }
    function hideModal() {
        exampleModalObj.value.hide();
    }
//讓父元件可以呼叫這兩個函數
    defineExpose({
        showModal, hideModal
    });

    //送出表單：把表單中的資料傳到父元件
    function submit1() {

        // // 根據 startDate和endDate 判斷 status 的值

        // const today = new Date(getTodayDate()); 
        // const startDate = new Date(formData.value.startDate);  
        // const endDate = new Date(formData.value.endDate);
        // //console.log("formData.value.status",formData.value.status)
        // if(formData.value.status==="暫停顯示"){  //如果是暫停中就不更新狀態
        //     //do nothing
        //     console.log("暫停中!!!!!!!!!不更新")
        // }else if(formData.value.status!="暫停顯示"){  //非暫停狀態才要判定狀態
        //     if (startDate > today) { //0623 > 0518
        //         formData.value.status = '尚未開始';
        //     } else if (startDate <= today && endDate >= today){ //0623 > 0518
        //         formData.value.status = '顯示中';
        //     }else if(endDate < today){
        //         formData.value.status = '已封存'
        //     }
        // }

        // console.log("today",today)
        // console.log("startDate",startDate)
        // console.log("endDate",endDate)
        // console.log("status",formData.value.status)

        // 觸發父元件的函數，並傳遞資料
        emits('submit', formData.value)
        //有圖片版
        //console.log("子元件中selectedFile.value=",selectedFile.value)
        //emits('submit', formData.value,startEndDateIsValidate.value,selectedFile.value);

        
    }



</script>
    

<style>
    /* 修改表格的背景顏色 */
    table {
        background-color: lightblue;
    }

    /* 修改表格中文字的顏色 */
    td {
        color: navy;
    }
</style>
