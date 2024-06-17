<template>
    <form @submit.prevent="submit1"><!-- 這裡是用form表單的submit事件處理送出資料 -->
        <table><!-- 用v-model綁定各項input -->
            <tr>
                <td>館別 : </td>
                <td><input type="text" v-model="formData.hotelName" readonly></td>
            </tr>
            <tr>
                <td>標題 : </td>
                <td><input type="text" v-model="formData.title" ></td>
            </tr>
            <tr>
                <td>起始日 : </td>
                <td><input type="date" v-model="formData.startDate"></td>
            </tr>
            <tr>
                <td>結束日 : </td>
                <td><input type="date"  v-model="formData.endDate"> 
                    <input type="checkbox">永久<span v-if="!startEndDateIsValidate" style="color: red; font-weight: bold; font-size: smaller;">結束日不能早於起始日</span>
                    </td>
            </tr>
            <tr>
                <td>內文 : </td>
                <td><textarea  v-model="formData.content"></textarea></td>
            </tr>
            <tr>
                <td>圖片 : </td>
                <td><input type="file"></td>
            </tr>
            <tr>
                <td>類型 : </td>
                <td><select  v-model="formData.type">
                    <option value="一般公告">一般公告</option>
                    <option value="優惠公告">優惠公告</option>
                </select></td>
            </tr>
        </table>
        <button type="submit" >提交</button>
    </form>
    <button @click="test">測試用按鈕</button>
</template>
    
<script setup>
//import會用到的東西
    import { ref, onMounted,defineEmits,defineProps,computed } from "vue";
    import bootstrap from 'bootstrap/dist/js/bootstrap.bundle.min.js'
//組件掛載完成時要做的事
    onMounted(function(){ 
        //新增時初始值取今天
        formData.value.startDate = getTodayDate();
        formData.value.endDate = getTodayDate();
    })


//宣告會用到的變數
    //傳出的事件
    const emits = defineEmits(["submit"]);   
    //初始化表單資料
    const formData=ref({
        hId:"1",  //預設為一號館而且暫時寫死XD
        title:"",
        startDate:"", //預設值為今天
        endDate:"",
        content:"",
        image:"images/LatestNewsDefaultImages.png", //這裡要給一張預設圖片
        status:"",
        type:"一般公告"
    });
    //資料驗證：判斷起始日是否早於截止日
    const startEndDateIsValidate = computed(() => {
        return new Date(formData.value.startDate) <= new Date(formData.value.endDate);
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



    function test(){
        console.log("驗證結果為=",startEndDateIsValidate.value)
    }

//重要：把表單中的資料傳到父元件的功能
    function submit1() {
    const today = new Date();
    const startDate = new Date(formData.value.startDate);
    const endDate = new Date(formData.value.endDate);

    // 根據 startDate和endDate 判斷 status 的值
    if (startDate > today) { //0623 > 0518
        formData.value.status = '尚未開始';
    } else if (startDate < today && endDate > today){ //0623 > 0518
        formData.value.status = '顯示中';
    }else if(endDate < today){
        formData.value.status = '已封存'
    }

    // 觸發父元件的函數，並傳遞資料
    
    console.log("子元件中formData.value=",formData.value)
    emits('submit', formData.value,startEndDateIsValidate.value);

    }
</script>
    
<style>
    
</style>