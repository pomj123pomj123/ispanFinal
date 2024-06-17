<template>
<!-- 解釋 [ref="exampleModalRef"] 用來幹嘛的：當我要使用 bootstrap.Modal() 來創造一個新的Modal時，需要傳遞一個[DOM 元素]作為參數。這個DOM 元素通常是[Modal的根元素(最外層容器)] -->
<div ref="exampleModalRef" class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-lg">
    <div class="modal-content">
      <div class="modal-header">
        <h1 class="modal-title fs-5" id="exampleModalLabel" v-show="isCreate">新增公告</h1>
        <h1 class="modal-title fs-5" id="exampleModalLabel" v-show="!isCreate">修改公告</h1>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <table><!-- 用v-model綁定各項input -->
            <tr>
                <td>館別 : </td>
                <td>{{formData.hotelName}}</td>
            </tr>
            <tr>
                <td>標題 : </td>
                <td><input type="text" v-model="formData.title" ></td>
            </tr>
            <tr>
                <td>起始日 </td>
                <td><input type="date" v-model="formData.startDate"></td>
            </tr>
            <tr>
                <td>結束日 </td>
                <td><input type="date"  v-model="formData.endDate">  
                    <input type="checkbox" v-model="dateUnlimited" @click="handleDateUnlimited">永久
                <div v-if="!startEndDateIsValidate" style="color: red; font-weight: bold; font-size: smaller;">結束日不能早於起始日</div></td>
            </tr>
            <tr>
                <td>內文 : </td>
                <td><textarea  v-model="formData.content" style="width: 100%; height: 150px;"></textarea></td>
            </tr>
            <!-- <tr>
                <td>圖片 : </td>
                <td><input type="file" ref="fileInput" />
                    <button @click="uploadFile">Upload</button></td>
            </tr> -->
            <tr>
                <td>類型 : </td>
                <td><select  v-model="formData.type">
                    <option value="一般公告">一般公告</option>
                    <option value="優惠公告">優惠公告</option>
                </select></td>
            </tr>
        </table>
        
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
//import會用到的東西
    import { ref, onMounted,computed,watch  } from "vue";
    import bootstrap from 'bootstrap/dist/js/bootstrap.bundle.min.js'
//傳入的參數(新增的話不用傳入參數，修改的話要)
    const props = defineProps(["updateDataOringin", "isShowButtonInsert","isCreate", ]);//這邊要包含檔案?
//傳出的事件
    const emits = defineEmits(["submit"]);

//上傳圖片相關的東西
    // const fileInput = ref(null);

    // function uploadFile() {
    //     const file = fileInput.value.files[0];
    //     const formData = new FormData();
    //     formData.append('file', file);

    //     axios.post('/uploadTemp', formData)
    //         .then(response => {
    //         console.log('File uploaded successfully:', response.data);
    //         // 發送事件通知父元件文件上傳完成
    //         emits('file-uploaded');
    //         })
    //         .catch(error => {
    //         console.error('Error uploading file:', error);
    //         });
    // }
    const dateUnlimited=ref(false)
//處理日期為永久(用WATCH)
watch(dateUnlimited, (newValue) => {
      if (newValue) {
        formData.value.endDate = "9999-12-31";
      } else {
        formData.value.endDate = getTodayDate();
      }
    });

//新增時用來初始化表單資料  //純初始化用所以不用加ref
    const initialFormData={
        hId:1,
        hotelName:"芳山旅館",  //預設為一號館而且暫時不給改XD等我1.改完COTROLLER返回的值 2.做完員工系統，可以根據員工有不同的分館
        title:"",
        startDate:getTodayDate(), //預設值為今天
        endDate:getTodayDate(),
        content:"",
        image:"images/LatestNewsDefaultImages.png", //這裡要給一張預定的空白圖
        status:"",
        type:"一般公告",
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
        formData.value.lnId=props.updateDataOringin.lnId;
        formData.value.hotelName = props.updateDataOringin.hotelName;
        formData.value.hId = props.updateDataOringin.hId;
        formData.value.title = props.updateDataOringin.title;
        formData.value.content=props.updateDataOringin.content;
        formData.value.startDate = props.updateDataOringin.startDate;
        formData.value.endDate = props.updateDataOringin.endDate;
        formData.value.image = props.updateDataOringin.image;
        formData.value.status = props.updateDataOringin.status;
        formData.value.type = props.updateDataOringin.type;
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

//資料驗證：判斷起始日是否早於截止日
    
    const startEndDateIsValidate = computed(() => {
        return new Date(formData.value.startDate) <= new Date(formData.value.endDate);
    });
//測試按鈕
    function test(){
        //console.log("驗證結果為=",startEndDateIsValidate.value)
        //console.log(props.updateDataOringin)
        console.log("測試時props.isCreate",props.isCreate)
    }

//送出表單：把表單中的資料傳到父元件
    function submit1() {

    // 根據 startDate和endDate 判斷 status 的值

    const today = new Date(getTodayDate()); 
    const startDate = new Date(formData.value.startDate);  
    const endDate = new Date(formData.value.endDate);
    //console.log("formData.value.status",formData.value.status)
    if(formData.value.status==="暫停顯示"){  //如果是暫停中就不更新狀態
        //do nothing
        console.log("暫停中!!!!!!!!!不更新")
    }else if(formData.value.status!="暫停顯示"){  //非暫停狀態才要判定狀態
        if (startDate > today) { //0623 > 0518
            formData.value.status = '尚未開始';
        } else if (startDate <= today && endDate >= today){ //0623 > 0518
            formData.value.status = '顯示中';
        }else if(endDate < today){
            formData.value.status = '已封存'
        }
    }
    
    console.log("today",today)
    console.log("startDate",startDate)
    console.log("endDate",endDate)
    console.log("status",formData.value.status)

    // 觸發父元件的函數，並傳遞資料
    emits('submit', formData.value,startEndDateIsValidate.value)
    //有圖片版
    //console.log("子元件中selectedFile.value=",selectedFile.value)
    //emits('submit', formData.value,startEndDateIsValidate.value,selectedFile.value);

        
    }





    function showModal() {
        dateUnlimited.value=false;
        exampleModalObj.value.show();
    }
    function hideModal() {
        exampleModalObj.value.hide();
    }
//讓父元件可以呼叫這兩個函數
    defineExpose({
        showModal, hideModal
    });

    
</script>
    
<style>
    
</style>