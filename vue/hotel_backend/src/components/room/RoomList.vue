<template>
    <!-- 使用 container-fluid 讓預設是滿版, 再用 custom-container-width 的 padding 往裡面壓 -->
    
        <div class="row">
            <div class="col">
                
                <div class="room-type-over-view flexadjust">

                    <p class="padjust">房間總覽</p>
                    <!-- openModal('insert'), 傳參數 insert 給 openModal(), insert 並不需要 id 也沒有 id 可以傳 -->
                    <i class="fa-solid fa-square-plus inew" @click="openModal('insert')"></i>
                    <select class="form-select form-select-sm" aria-label="Default select example" style="width: 300px; margin-left: 20px; font-size: 18px; text-align: center;" @change="findAllRoomPage" id="forselect" :value="roomStatus" v-model="roomStatus">
                        <option>未選取任何狀態</option>
                        <option>空閒中</option>
                        <option>待清潔</option>
                        <option>禁止使用</option>
                    </select>
                    
                    <Rows class="rowadjust"
                        :choices=choicesValue
                        v-model="rows"
                        :total="totalPage"
                        @change="findAllRoomPage"
                    ></Rows>

                    <paginate class="paginateadjust" 
                    :page-count="pages"  
                    :initial-page="current" 
                    :first-last-button="true"
                    first-button-text="First"                
                    last-button-text="Last"
                    prev-text="Prev"
                    next-text="Next"
                    v-model="current"  
                    :click-handler="findAllRoomPage"
                    ></paginate>

                </div>
                
                <table class="table table-striped table-hover  table-bordered align-middle">
                    
                    <thead class="text-center">
                        <tr>
                        <th>#</th>
                        <th>房間號碼</th>
                        <th>房間樓層</th>
                        <th>房間狀態</th>
                        <th>房間房型</th>
                        <th>最後修改時間</th>
                        <th style="display: none;">最後修改人員</th>
                        <th>修改內容</th>
                        <th>操作</th>
                        </tr>
                    </thead>
                    <tbody class="table-group-divider text-center">
                        <tr v-for="room in rooms">
                        <td>{{ rooms.indexOf(room) + 1 }}</td>
                        <td>{{ room.roomNumber }}</td>
                        <td>{{ room.floor }}</td>
                        <td>{{ room.roomStatus }}</td>
                        <td>{{ room.roomType }}</td>
                        <td>{{ room.lastModifiedDate }}</td>
                        <td style="display: none;">{{ room.lastModifiedEmp }}</td>
                        <td>{{ room.lastModifiedText }}</td>
                        
                        <td>
                            
                            <!-- openModal('update'), 傳參數 'update' 給 openModal(), update 需要 id 來帶入 findById() 中, 再用 id 把新資料儲存 -->
                            <i class="fa-sharp fa-solid fa-pen-to-square uadjust" @click="openModal('update', room.rId)"></i>
                            
                            <i class="fa-solid fa-trash-can dadjust" @click="remove('delete', room.rId)"></i>

                        </td>
                        </tr>

                    </tbody>
                </table>
                
            </div>
        </div>
        
        


    <RoomListModal ref="roomListModalRef" 
        :is-show-button-insert="isShowButtonInsert"
        :notPageFindAll="notPageFindAll"
        v-model:modelValue = "modelValue"
        v-model:roomNumber = "roomListData.roomNumber"
        v-model:floor = "roomListData.floor"
        v-model:roomStatus = "roomListData.roomStatus"               
        v-model:lastModifiedEmp = "roomListData.lastModifiedEmp"                
        v-model:lastModifiedText = "roomListData.lastModifiedText"  

        @insert="roomInsertData" @update="roomUpdateData"
        >
    </RoomListModal>

    



</template>
    
<script setup>
    import axiosapi from "@/plugins/axios.js";
    import { ref, onMounted } from "vue";

    import RoomListModal from "./RoomListModal.vue"

    import Paginate from "vuejs-paginate-next"
    
    import Rows from "./Rows.vue";
    

    
    

    const rooms = ref(null);
    // RoomModal 用變數 ----------------------------------------------------------------------------------------------------------------------
    const roomListModalRef = ref({}); 
    const isShowButtonInsert = ref(null); //要傳給 RoomModal 的值
    const roomListData = ref({}); //綁定 RoomListModal 的屬性值, modal 打開來是每個 findbyid 找到的物件
    // RoomModal 用變數 ----------------------------------------------------------------------------------------------------------------------
    
    // page 用變數 ---------------------------------------------------------------------------------------------------------------------------
    const pages = ref(50);          //最多需要多少個分頁
    const current = ref(1);         //現在這頁是哪一頁
    const start = ref(0);           //起始頁
    const rows = ref(5);            //一頁顯示幾筆資料
    const lastPageRows = ref(0);    //最後一頁有幾筆資料
    // page 用變數 ---------------------------------------------------------------------------------------------------------------------------
    
    // Rows 用變數 ---------------------------------------------------------------------------------------------------------------------------
    const choicesValue = [3, 4, 5, 6, 8, 10];
    const totalPage = ref(0)
    
    // Rows 用變數

    const modelValue = ref({});
    let roomStatus = ref(null);


    onMounted(function(){

        findAll();
        findAllRoomPage();

    })

    // 想要有刷新頁面時就可以調用
    const notPageFindAll = ref({});
    function findAll() {
        
        // 用添加 { params: { name: '客房' } } 方式指定 get 參數
        axiosapi.get("/roomtype/findAll").then(function(response){
            // console.log("response", response);
            console.log("response", response.data);
            notPageFindAll.value = response.data;
        })

    }

    // 分頁用的方法
    function findAllRoomPage(page) {
        // 看 paginate 元件有沒有傳參數進來, 開啟頁面時沒有但是當點擊頁數後
        console.log("page參數", page);
        

        

        if(page) {
            start.value = ( page -1 ) * rows.value;
            current.value = page;
        } else {
            start.value = 0;
            current.value = 1;
        }
        
        let data = {

            "start": start.value,
            "rows": rows.value,
            "roomStatus": roomStatus.value
            //"dir":false,
            
            
        }
        axiosapi.post(`/room/criteriapageforvue`, data).then(function(response){
            rooms.value = response.data.list;
            console.log("rooms 的值", rooms.value);
            /*
            使用非 JpaRepository 的方式:
            看回傳的值中是否真的有 count, 有
            處理分頁回傳結果:
            1.計算總共有幾頁, 透過從後端傳回來的 count 值(總共有多少筆資料)換算. 總共有多少筆/一次顯示幾列
            pages.value = Math.ceil(response.data.count / rows.value);
            2.計算最後一頁有幾筆資料, 總筆數對一頁顯示多少列資料模同餘(取餘數)
            lastPageRows.value = response.data.count % rows.value;
            */

            // 處理分頁回傳結果
            // 將回傳的 Page 物件中的總資料數參數賦值給 totalPage
            totalPage.value = response.data.count;
            // 1.抓 totalPages 獲得共有幾頁
            pages.value = Math.ceil(response.data.count / rows.value);
            console.log("總共有幾頁", pages.value);
            // 2.計算最後一頁有幾筆資料, 總筆數對一頁顯示多少列資料模同餘(取餘數)
            lastPageRows.value = response.data.count % rows.value;

        })
    }

    function findById(id) {
        
        axiosapi.get(`/room/onlyfindbyidlazy?rId=${id}`).then(function(response){
            // 根據id找資料只會有1筆
            console.log("findbyidresponse", response.data);
            roomListData.value = response.data;
            modelValue.value = response.data.roomType;
           
        })
        
    }

    function roomInsertData() {

        let data = {

        "roomNumber": roomListData.value.roomNumber,
        "floor": roomListData.value.floor,
        "roomStatus": roomListData.value.roomStatus,
        "roomType": modelValue.value,
        "lastModifiedEmp": "員工1", //到時候要把INPUT拔掉, 抓登入方法回傳的USERNAME
        "lastModifiedText": roomListData.value.lastModifiedText

        }
        console.log(data);
        axiosapi.post("/room/insertfromjson", data).then(function(response){
            
            // 用 roomTypeModalRef 調用 RoomModal 的 hideModal() 方法關閉彈窗
            roomListModalRef.value.hideModal();
            // 之後補上sweetalert 的確認訊息
            alert("新增成功");
            
            if(lastPageRows.value === 0) {
                current.value += 1;
            }
            
            console.log("==============================================================");
            console.log("最後一頁幾筆", lastPageRows.value);
            console.log("每頁幾筆資料", response.data.size);
            console.log("==============================================================");


            // 分頁用, 不管在哪一頁插入數據自動跳到最後一頁
            console.log("insert後的Pages", pages.value);
            findAllRoomPage(pages.value);
            
            

            
        })
    }

    function roomUpdateData() {

        console.log("觸發更新函數");
        let data = {

            "rId": roomListData.value.rId,
            "roomNumber": roomListData.value.roomNumber,
            "floor": roomListData.value.floor,
            "roomStatus": roomListData.value.roomStatus,
            "roomType": modelValue.value,
            "lastModifiedEmp": "員工1",
            "lastModifiedText": roomListData.value.lastModifiedText

        }
        console.log(data);
        axiosapi.put(`/room/updatefromjson`, data).then(function(response){
            // 根據id找資料只會有1筆
            console.log("response", response);
            roomListModalRef.value.hideModal();
            alert("修改成功");
            // findAll();

            window.location.reload();
            

        })
    }

    function remove (action, id) {

        console.log("remove觸發", action, id, new Date());
        console.log("rId", id);
        axiosapi.delete(`/room/deleteById?rId=${id}`).then(function(response){

        //用最後一頁幾筆資料來判斷刪除當前這筆之後頁數要不要減1
        if(lastPageRows.value === 1 && current.value > 1) {
            current.value -= 1;
        }

        // 分頁用, 刪除完資料後要自動跳到刪除時的那一頁, 所以將 current.value 當作參數傳進去
        findAllRoomPage(current.value);
    
    })



    }
    
    function openModal (action, id) {
        modelValue.value = {};
        roomListData.value = {};
        console.log("房間列表openModal", action, id, new Date());
        if(action === 'insert'){
            isShowButtonInsert.value = true;
        } else {
            // 測試 findById 方法
            findById(id);
            console.log(findById(id));
            isShowButtonInsert.value = false;
        }
        roomListModalRef.value.showModal();
        

    }
    
    
    



    

</script>
    
<style scoped>

    .photocardadjust {
        margin: auto;
    }
   
    .roomtypephotocardadjust {
        margin-bottom: 40px;
    }

    .paginateadjust {

        /* 把元素推到最右邊 */
        margin-left: 0;
        margin-bottom: 0;
        user-select:none;

    }

    .rowadjust {

    /* 把元素推到最右邊 */
    margin-left: auto;
    margin-right: 20px;
    user-select:none;

    /* rgb(199, 200, 204) */
    color: rgb(80, 60, 60);
    font-size: 18px;

    }

    .uadjust {
        font-size: 26px;
        color: rgb(71, 147, 175);
        
    }

    .dadjust {
        font-size: 26px;
        color: rgb(199, 0, 57);
    }

    table {
        user-select:none;
    }

    p {
        margin: 0;
        user-select:none;
    }

    .padjust {
        margin: 0 10px 0 0;
        font-size: 26px;
    }

    .room-type-over-view{
        margin: 20px 0 2px 0;
        font-size: 26px;
    }

    .uadjust {
        font-size: 26px;
        color: rgb(71, 147, 175);
        margin: 5px 20px 5px 0;
    }

    .dadjust {
        font-size: 26px;
        color: rgb(199, 0, 57);
    }

    .uadjust:hover,.dadjust {
        cursor: pointer;
    }

    .flexadjust{
        /* https://ithelp.ithome.com.tw/articles/10202597 */
        display: flex;
        text-align: center;
        line-height: 26px;
        margin-bottom: 10px;
        align-items: center;
    }

    .inew {
        color: rgb(37, 43, 72);
        cursor: pointer;
    }

</style>