<template>
    <!-- 使用 container-fluid 讓預設是滿版, 再用 custom-container-width 的 padding 往裡面壓 -->
    
        <div class="row">
            <div class="col">
                <!-- <caption class="blockquote">房型總覽</caption> -->
                <div class="room-type-over-view flexadjust">

                    <p class="padjust">房型總覽</p>
                    
                    <i class="fa-solid fa-square-plus inew" @click="openModal('insert')"></i>
                    
                    
                    <Rows class="rowadjust"
                        :choices=choicesValue
                        v-model="rows"
                        :total="totalPage"
                        @change="findAllPage"
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
                    :click-handler="findAllPage"
                    ></paginate>

                </div>
                
                <table class="table table-striped table-hover  table-bordered align-middle">
                    
                    <thead class="text-center">
                        <tr>
                        <th>#</th>
                        <th>飯店名稱</th>
                        <th>房型名稱</th>
                        <th>房型數量</th>
                        <th>床數</th>
                        <th>床類型</th>
                        <th>會員價格</th>
                        <th>非會員價格</th>
                        <th>寵物入住</th>
                        <th>加床</th>
                        <th>無障礙</th>
                        <th>最大入住人數</th>
                        <th>最後修改時間</th>
                        <th>最後修改人員</th>
                        <th>修改內容</th>
                        <th>操作</th>
                        </tr>
                    </thead>
                    <tbody class="table-group-divider text-center">
                        <tr v-for="roomtype in roomtypes">
                        <!-- 取得陣列索引號: https://ithelp.ithome.com.tw/articles/10227363 -->
                        <td>{{ roomtypes.indexOf(roomtype) + 1 }}</td>
                        <td>{{ roomtype.hotel.name }}</td>
                        <td>{{ roomtype.roomName }}</td>
                        <td>{{ roomtype.roomAmount }}</td>
                        <td>{{ roomtype.bedNumber }}</td>
                        <td>{{ roomtype.bedType }}</td>
                        <td>{{ roomtype.memberPrice }}</td>
                        <td>{{ roomtype.flexiblePrice }}</td>
                        <td>{{ roomtype.pet }}</td>
                        <td>{{ roomtype.allowAddBed }}</td>
                        <td>{{ roomtype.accessibleRoom }}</td>
                        <td>{{ roomtype.peopleMaxAmount }}</td>
                        <td>{{ roomtype.lastModifiedDate.replace('T', ' ') }}</td>
                        <td>{{ roomtype.lastModifiedEmp }}</td>
                        <td>{{ roomtype.lastModifiedText }}</td>
                        <td>
                            
                            <i class="fa-sharp fa-solid fa-pen-to-square uadjust" @click="openModal('update', roomtype.rtId)"></i>
                            
                            <i class="fa-solid fa-trash-can dadjust" @click="remove('delete', roomtype.rtId)"></i>

                        </td>
                        </tr>
                    </tbody>
                </table>
                
            </div>
        </div>
        
        <div style="height: 20px; border-bottom: 2px solid rgb(234, 219, 200); margin-bottom: 20px;"></div>

        
        <div class="row">

            <div class="room-type-over-view flexadjust">
                <p class="padjust">房型照片</p>
                
                <i class="fa-solid fa-square-plus inew" @click="openPhotoModal('insert')"></i>
                
                <select class="form-select form-select-sm" aria-label="Default select example" style="width: 300px; margin-left: 20px; font-size: 18px; text-align: center;" @change="findAllPhotoPage" id="forselect" >
                    <option>未選取任何房型</option>
                    <option v-for="roomtype in nearByPhotoInsert" :key="roomtype.rtId" :value="roomtype.roomName">{{ roomtype.roomName }}</option>
                    
                </select>
    
                <PhotoRows class="rowadjust"
                    :choices=photoChoicesValue
                    v-model="photoRows"
                    :total="photoTotalPage"
                    @change="findAllPhotoPage"
                ></PhotoRows>

                <paginate class="paginateadjust" 
                :page-count="photoPages"  
                :initial-page="photoCurrent" 
                :first-last-button="true"
                first-button-text="First"                
                last-button-text="Last"
                prev-text="Prev"
                next-text="Next"
                v-model="photoCurrent"  
                :click-handler="findAllPhotoPage"
                ></paginate>

            </div>

            <div class="row photocardadjust">
                <RoomTypePhotoCard v-for="photo in photos" :key="photo.rpId" :item="photo" class="roomtypephotocardadjust col-3"
                @open-update="openPhotoModal" @delete="photoRemove" 
                ></RoomTypePhotoCard>
            </div>

        </div>
    
    <RoomTypeModal ref="roomTypeModalRef" 
        :is-show-button-insert="isShowButtonInsert"
        v-model:roomName="roomModalData.roomName"
        v-model:featureTittle="roomModalData.featureTittle"
        v-model:featureTittleContent="roomModalData.featureTittleContent"
        v-model:roomAmount="roomModalData.roomAmount"
        v-model:bedNumber="roomModalData.bedNumber"
        v-model:bedType="roomModalData.bedType"
        v-model:memberPrice="roomModalData.memberPrice"
        v-model:flexiblePrice="roomModalData.flexiblePrice"
        v-model:pet="roomModalData.pet"
        v-model:allowAddBed="roomModalData.allowAddBed"
        v-model:accessibleRoom="roomModalData.accessibleRoom"
        v-model:peopleMaxAmount="roomModalData.peopleMaxAmount"
        v-model:lastModifiedEmp="roomModalData.lastModifiedEmp"
        v-model:lastModifiedText="roomModalData.lastModifiedText"
        v-model:hotelName="hotelName"

        @insert="roomTypeinsertData" @update="roomTypeupdateData"
        >
    </RoomTypeModal>

    <RoomTypePhotoModal ref="roomTypePhotoModalRef"
        :is-show-button-room-type-photo-insert = "isShowButtonRoomTypePhotoInsert"
        v-model:photoname ="findByPhotoIdData.photoname"
        v-model:photoDescription = "findByPhotoIdData.photoDescription"
        v-model:photoFile = "photofile"
        :notPageFindAll = "notPageFindAll"
        v-model:modelValue = "modelValue"
        @insert="roomTypeInsertPhotoData" @update="roomTypeUpdatePhotoData"
    >
    </RoomTypePhotoModal>



</template>
    
<script setup>
    import axiosapi from "@/plugins/axios.js";
    import { ref, onMounted } from "vue";

    import RoomTypeModal from "./RoomTypeModal.vue"

    import Paginate from "vuejs-paginate-next"
    
    import Rows from "./Rows.vue";
    

    
    

    const roomtypes = ref(null);
    // RoomModal 用變數 ----------------------------------------------------------------------------------------------------------------------
    const roomTypeModalRef = ref(null); //RoomModal
    const isShowButtonInsert = ref(null); //要傳給 RoomModal 的值
    const roomModalData = ref({}) //綁定 RoomModal 的屬性值
    // RoomModal 用變數 ----------------------------------------------------------------------------------------------------------------------
    
    // page 用變數 ---------------------------------------------------------------------------------------------------------------------------
    const pages = ref(50);
    const current = ref(1);         //現在這頁是哪一頁
    const start = ref(0);           //起始頁
    const rows = ref(5);            //一頁顯示幾筆資料
    const lastPageRows = ref(0);    //最後一頁有幾筆資料
    // page 用變數 ---------------------------------------------------------------------------------------------------------------------------
    
    // Rows 用變數 ---------------------------------------------------------------------------------------------------------------------------
    const choicesValue = [3, 4, 5, 6];
    const totalPage = ref(0)
    
    // Rows 用變數


    onMounted(function(){
        findAll();
        findAllPage();
        findAllPhotoPage(photoCurrent.value);
        //findAllPhoto();
    })
    
    // 分頁用的方法
    function findAllPage(page) {
        // 看 paginate 元件有沒有傳參數進來, 開啟頁面時沒有但是當點擊頁數後
        console.log("page參數", page);

        /*
        計算分頁相關資訊:
        1.開啟頁面時並不會傳 page 的參數, 點擊分頁時才會傳 page 參數, 所以要先判斷是否有 page 參數再透過 page 參數計算出該頁的第一筆資料
        2.同時透過 page 來判斷現在在哪一頁

        if(page) {
            start.value = ( page -1 ) * rows.value;
            current.value = page;
        } else {
            start.value = 0;
            current.value = 1;
        }
        */
        
        // 使用 Jparepository 的時候判斷如果 page 沒給值就直接設成 1
        if (!page) {
            page = 1;
            current.value =1;
        } else {
            current.value = page;
        }
        

        let data = {

            /*
            非 jparepository 方式要傳給後端設定分頁的參數
            "start": start.value
            "rows": rows.value
            "dir":true
            "order": "id"
            */
            "rows": rows.value,
            "pageNumber": page


        }
        axiosapi.post(`/roomtype/page`, data).then(function(response){

            /*
            使用非 JpaRepository 的方式:
            看回傳的值中是否真的有 count, 有
            處理分頁回傳結果:
            1.計算總共有幾頁, 透過從後端傳回來的 count 值(總共有多少筆資料)換算. 總共有多少筆/一次顯示幾列
            pages.value = Math.ceil(response.data.count / rows.value);
            2.計算最後一頁有幾筆資料, 總筆數對一頁顯示多少列資料模同餘(取餘數)
            lastPageRows.value = response.data.count % rows.value;

            */

            // 使用 Page 物件的方式, 請求發出後回傳的是 page 物件, 可以使用 page 物件提供的參數
            // response 內容
            console.log("findallpage 的 response", response.data);
            // 回傳的單頁資料
            console.log("回傳的單頁資料", response.data.content);
            // 總頁數
            console.log("總頁數", response.data.totalPages); 
            // 每頁顯示列數
            console.log("每頁顯示列數", response.data.size);
            // 總資料數
            console.log("總資料數", response.data.totalElements);

            // 處理分頁回傳結果
            // 將回傳的 Page 物件中的總資料數參數賦值給 totalPage
            totalPage.value = response.data.totalElements
            // 1.抓 totalPages 獲得共有幾頁
            pages.value = response.data.totalPages;
            // 2.計算最後一頁有幾筆資料, 總筆數對一頁顯示多少列資料模同餘(取餘數)
            lastPageRows.value = response.data.totalElements % response.data.size;

            // console.log("response", response);
            // console.log("response", response.data);
            roomtypes.value = response.data.content;
            
        })
    }

    // 用來存 findAll 的結果因為 findAllPage 只會存當個分頁的數據但是我想要獲取所有房型名稱
    /* 
    findAll() 找到資料庫的所有房型資料存到 notPageFindAll 中,  RoomTypePhotoModal 標籤再加上 :notPageFindAll = "notPageFindAll" 讓
    notPageFindAll 可以傳到 RoomTypePhotoModal 元件中, RoomTypePhotoModal 元件中的 const props = defineProps 再加上 "notPageFindAll"
    就能使用這個參數了, 再將 notPageFindAll 當成 option 用的遍歷集合就可以產生出有所有房型名稱的下拉選單.
    <option v-for="roomtype in notPageFindAll" :key="roomtype.id" :value="roomtype.roomTypeName">{{ roomtype.roomTypeName }}</option>
    */
    const notPageFindAll = ref({});

    // 給房型照片文字旁邊的多選框用的, 值一樣是所有房型資料
    const nearByPhotoInsert = ref({});
    
    /*
    在父元件建立一個變數 modelValue 在 RoomTypePhotoModal 標籤再加上 v-model:modelValue = "modelValue" 讓元件中的 modelValue 數值改變時
    父元件的 modelValue 數值也會跟著改變, RoomTypePhotoModal 元件中 const props = defineProps 再加上 "modelValue", <select :value="modelValue" @change="dochange" class="selectadjust"> 加上 change 的事件監聽, 當 change 事件發生時觸發 dochange(), dochange() 中的 emits('update:modelValue', event.target.value); 會把 modelValue 變動的值傳給父元件.
    */
    const modelValue = ref({});
    // 想要有刷新頁面時就可以調用
    function findAll() {
        
        // 用添加 { params: { name: '客房' } } 方式指定 get 參數
        axiosapi.get("/roomtype/findAll").then(function(response){
            // console.log("response", response);
            console.log("response", response.data);
            notPageFindAll.value = response.data;
            nearByPhotoInsert.value = response.data;
        })

    }
    
    let hotelName = ref({});
    function findById(id) {
        // 用添加 { params: { name: '客房' } } 方式指定 get 參數
        axiosapi.get(`roomtype/findById?id=${id}`).then(function(response){
            // 根據id找資料只會有1筆
            console.log("response", response.data);
            hotelName.value = response.data.hotel.name;
            roomModalData.value = response.data;
            
            console.log(roomModalData);
        })
        
    }

    function roomTypeinsertData() {
        console.log(roomModalData.value.roomName);
        

        let data = {
            "roomName": roomModalData.value.roomName,
            "featureTittle": roomModalData.value.featureTittle,
            "featureTittleContent": roomModalData.value.featureTittleContent,
            "roomAmount": roomModalData.value.roomAmount,
            "bedNumber": roomModalData.value.bedNumber,
            "bedType": roomModalData.value.bedType,
            "memberPrice": roomModalData.value.memberPrice,
            "flexiblePrice": roomModalData.value.flexiblePrice,
            "pet": roomModalData.value.pet,
            "allowAddBed": roomModalData.value.allowAddBed,
            "accessibleRoom": roomModalData.value.accessibleRoom,
            "peopleMaxAmount": roomModalData.value.peopleMaxAmount,
            "lastModifiedEmp":roomModalData.value.lastModifiedEmp,  // MERGE 之後輸入框要拔掉然後等於的值是登入方法回傳的JSON的使用者名稱值
            "lastModifiedText": roomModalData.value.lastModifiedText,
            "hotelName": hotelName.value
        }
        axiosapi.post("/roomtype/save", data).then(function(response){
            // 看送出去的資料的內容
            //console.log("insertData", data);
            //console.log("response", response);

            // 用 roomTypeModalRef 調用 RoomModal 的 hideModal() 方法關閉彈窗
            roomTypeModalRef.value.hideModal();
            // 之後補上sweetalert 的確認訊息
            alert("新增成功");
            
            
            // 插入完新資料後刷新頁面
            // findAll();

            /*
            用 lastPageRow 的值是不是 0 來判斷新增當前這筆之後頁數要不要加1
            lastPageRow 的意思是總比數對每頁要顯示幾筆資料取餘數

            有一筆資料 >> 餘1
            有兩筆資料 >> 餘2
            有三筆資料 >> 餘3
            有四筆資料 >> 餘4 ......

            不管頁面要顯示幾筆, 如果是頁面中顯示的列數滿了 >> 餘0
            */
            if(lastPageRows.value === 0) {
                current.value += 1;
            }
            
            console.log("==============================================================");
            console.log("最後一頁幾筆", lastPageRows.value);
            console.log("每頁幾筆資料", response.data.size);
            console.log("==============================================================");

            // 分頁用, 插入完資料後要自動跳到插入時的那一頁, 所以將 current.value 當作參數傳進去
            // findAllPage(current.value);

            // 分頁用, 不管在哪一頁插入數據自動跳到最後一頁
            console.log("insert後的Pages", pages.value);
            findAllPage(pages.value);
            
            

            
        })
    }

    function roomTypeupdateData() {

        console.log("觸發更新函數");
        //let data = roomModalData.value;
        let data = {
            "roomName": roomModalData.value.roomName,
            "featureTittle": roomModalData.value.featureTittle,
            "featureTittleContent": roomModalData.value.featureTittleContent,
            "roomAmount": roomModalData.value.roomAmount,
            "bedNumber": roomModalData.value.bedNumber,
            "bedType": roomModalData.value.bedType,
            "memberPrice": roomModalData.value.memberPrice,
            "flexiblePrice": roomModalData.value.flexiblePrice,
            "pet": roomModalData.value.pet,
            "allowAddBed": roomModalData.value.allowAddBed,
            "accessibleRoom": roomModalData.value.accessibleRoom,
            "peopleMaxAmount": roomModalData.value.peopleMaxAmount,
            "lastModifiedEmp":roomModalData.value.lastModifiedEmp,  // MERGE 之後輸入框要拔掉然後等於的值是登入方法回傳的JSON的使用者名稱值
            "lastModifiedText": roomModalData.value.lastModifiedText,
            "hotelName": hotelName.value
        }
        console.log(data);
        axiosapi.put(`/roomtype/update`, data).then(function(response){
            // 根據id找資料只會有1筆
            console.log("response", response);
            roomTypeModalRef.value.hideModal();
            alert("修改成功");
            // findAll();

            
            // 分頁用, 修改完資料後要自動跳到修改時的那一頁, 所以將 current.value 當作參數傳進去
            findAllPage(current.value);

        })
    }

    
    function openModal (action, id) {
        hotelName.value = null;
        roomModalData.value = {};
        console.log("openModal", action, id, new Date());
        if(action === 'insert'){
            isShowButtonInsert.value = true;
        } else {
            // 測試 findById 方法
            findById(id);
            isShowButtonInsert.value = false;
        }
        roomTypeModalRef.value.showModal();
        

    }
    // 根據 id 刪除被點擊的 roomtype 項目
    function remove (action, id) {

        console.log("remove", action, id, new Date());
        axiosapi.delete(`/roomtype/deleteById?rtId=${id}`).then(function(response){

            //用最後一頁幾筆資料來判斷刪除當前這筆之後頁數要不要減1
            if(lastPageRows.value === 1 && current.value > 1) {
                current.value -= 1;
            }

            //findAll();

            // 分頁用, 刪除完資料後要自動跳到刪除時的那一頁, 所以將 current.value 當作參數傳進去
            findAllPage(current.value);
            
        })



    }
    // -------------------------------------------------------------------------------------------------------------
    // photo相關開始
    import RoomTypePhotoCard from "./RoomTypePhotoCard.vue";
    import RoomTypePhotoModal from "./RoomTypePhotoModal.vue";
    import PhotoRows from "./PhotoRows.vue";
    
    
    const photos = ref({});
    // function findAllPhoto() {
        
    //     // 用添加 { params: { name: '客房' } } 方式指定 get 參數
    //     axiosapi.get("/photo/findallphoto").then(function(response){
            
    //         console.log("photo的response", response.data);
    //         photos.value = response.data;
            
    //     })

    // }

    const roomTypePhotoModalRef = ref(null);
    const isShowButtonRoomTypePhotoInsert = ref(true);

    function findAllPhoto() {
        
        // 用添加 { params: { name: '客房' } } 方式指定 get 參數
        let data = {

            "start": 0,
            "rows": 10,
            "dir": false
    
        }
        axiosapi.post("/roomphoto/find", data).then(function(response){
            
            console.log("photo的response", response.data);
            photos.value = response.data;
            
        })

    }

    /*
    function findById(id) {
        // 用添加 { params: { name: '客房' } } 方式指定 get 參數
        axiosapi.get(`roomtype/findById?id=${id}`).then(function(response){
            // 根據id找資料只會有1筆
            console.log("response", response.data);
            roomModalData.value = response.data;
            console.log(roomModalData);
        })
        
    }
    */ 
    // 這裡給空集合不要給 null 會報錯
    let findByPhotoIdData = ref({})
    // 存關聯 roomtype 的名稱
    let findByPhotoIdroomTypeData = ref({})
    let findByPhotoIdroomTypefeatureData = ref({})
    let findByPhotoIdroomTypefeatureTittleContent = ref({})

    let findByPhotoIdNumber = ref({}) //讓 update 要傳的 formate 可以抓到 id 的值
    
    function findByPhotoId(id) {

        axiosapi.get(`/photos/findbyid/entity?rpId=${id}`).then(function(response){
            
            console.log("photofindbyid的response", response.data);

            

            // 透過判斷長度是不是 0 來判斷有沒有資料
            if (response.data.length != 0){
                findByPhotoIdData.value = response.data.list[0];
                console.log("findByPhotoIdData", findByPhotoIdData);
                findByPhotoIdNumber = response.data.list[0].rpId;
                console.log("findByPhotoIdNumber", findByPhotoIdNumber);
                modelValue.value = response.data.list[0].RoomtypeName;
                console.log("modelValue", modelValue);
            }

            // 
            console.log("讓 update 的 format 可以抓得 id 值", findByPhotoIdNumber);
           
            
        })
    }

    //分頁用------------------------------------------------------------------------------
    const photoPages = ref(50);
    const photoStart = ref(0);           //起始頁
    const photoCurrent = ref(1);         //現在這頁是哪一頁
    const photoRows = ref(5);            //一頁顯示幾筆資料
    const photoLastPageRows = ref(0);    //最後一頁有幾筆資料
    const photoChoicesValue = [2, 3, 4, 5, 6];
    const photoTotalPage = ref(0)
    
    let nearByPhotoInsertData = ref({});
    // 分頁用的方法
    function findAllPhotoPage(page) {
        // 看 paginate 元件有沒有傳參數進來, 開啟頁面時沒有但是當點擊頁數後
        console.log("findAllPhotoPage參數", page);
        nearByPhotoInsertData.value = document.getElementById("forselect").value;
        console.log("criteriaQueryName", nearByPhotoInsertData.value);
        // 使用下拉選單時傳進來的參數類型是 object
        // 按分頁傳進來的參數類型是 number
        console.log("使用下拉選單時傳進來的參數類型", typeof page);
        

        /*
        計算分頁相關資訊:
        1.開啟頁面時並不會傳 page 的參數, 點擊分頁時才會傳 page 參數, 所以要先判斷是否有 page 參數再透過 page 參數計算出該頁的第一筆資料
        2.同時透過 page 來判斷現在在哪一頁

        if(page) {
            start.value = ( page -1 ) * rows.value;
            current.value = page;
        } else {
            start.value = 0;
            current.value = 1;
        }
        */
        if(page) {
            start.value = ( page -1 ) * rows.value;
            photoCurrent.value = page;
        } else {
            start.value = 0;
            photoCurrent.value = 1;
        }
        // 使用 Jparepository 的時候判斷如果 page 沒給值就直接設成 1
        // if (!page || typeof page === 'object') {
        //     page = 1;
        //     photoCurrent.value = 1;
        // } else {
        //     photoCurrent.value = page;
        //     console.log("在哪一頁", photoCurrent.value);
        // }
        
        

        

        // 
        let data = {

            /*
            非 jparepository 方式要傳給後端設定分頁的參數
            "start": start.value
            "rows": rows.value
            "dir":true
            "order": "id"
            "criteriaQueryName" : nearByPhotoInsertData.value
            */
            // "start": photoStart.value,
            // "rows": photoRows.value,
            // "dir":false,
            // "roomType" : nearByPhotoInsertData.value
            "start": start.value,
            "rows": photoRows.value,
            "page": page,
            "roomType" : nearByPhotoInsertData.value
        }

        console.log("發給請求的資料", data);
        axiosapi.post(`/roomphoto/find`, data).then(function(response){
            console.log("findallphoto的資料", response.data);
            /*
            使用非 JpaRepository 的方式:
            看回傳的值中是否真的有 count, 有
            處理分頁回傳結果:
            1.計算總共有幾頁, 透過從後端傳回來的 count 值(總共有多少筆資料)換算. 總共有多少筆/一次顯示幾列
            pages.value = Math.ceil(response.data.count / rows.value);
            2.計算最後一頁有幾筆資料, 總筆數對一頁顯示多少列資料模同餘(取餘數)
            lastPageRows.value = response.data.count % rows.value;

            */

            // 使用 Page 物件的方式, 請求發出後回傳的是 page 物件, 可以使用 page 物件提供的參數
            // response 內容
            // console.log("findAllPhotoPage 的 response", response.data);
            // 回傳的單頁資料
            // console.log("回傳的單頁資料", response.data.content);
            // 總頁數
            // console.log("總頁數", response.data.totalPages); 
            // 每頁顯示列數
            // console.log("每頁顯示列數", response.data.size);
            // 總資料數
            // console.log("總資料數", response.data.totalElements);

            // 處理分頁回傳結果
            // 將回傳的 Page 物件中的總資料數參數賦值給 totalPage
            console.log("count",response.data.count);
            photoTotalPage.value = response.data.count;
            // 1.抓 totalPages 獲得共有幾頁
            photoPages.value = Math.ceil(response.data.count / rows.value);
            // 2.計算最後一頁有幾筆資料, 總筆數對一頁顯示多少列資料模同餘(取餘數)
            photoLastPageRows.value = response.data.count % rows.value;

            
            console.log("photos", response.data.list);
            photos.value = response.data.list;
           
            // photospre.value = response.data
            // 抓標題路徑然後用photospre湊
            //console.log("featureTittle", response.data.content[0].roomType.featureTittle);
            
        })
    }

    // 獲取上傳圖片file物件
    let photofile = ref({});
    
    function roomTypeInsertPhotoData() {
        

        /*
        要使用 axios 正確地發送包含文件和其他表單數據的 POST 請求，應該使用 FormData 將這些數據打包並發送。 
        但是要注意如果直接寫死 formData.append('roomTypeName', findByPhotoIdroomTypeData.value); 那 roomTypeName 在發送時就一定要有值,
        FormData 在构建时，如果某个键没有值它不会自动跳过这个键就算後端加了 @RequestParam(required = false) 也沒用, 家這個比較像是設定接收的值中
        可以為空, 但是發送是看 FormData 這裡, 會發不出請求.

        如果發送的值有可能是空就要用只有在值存在时才添加的方式寫.
        if (findByPhotoIdroomTypeData.value) { 
            formData.append('roomTypeName', findByPhotoIdroomTypeData.value);
        }
        
        */
        // 創建 FormData 對象
        const formData = new FormData();

        // 測試各個屬性值是否正確
        console.log('photoName', findByPhotoIdData.value.photoname);
        console.log('photoDescription', findByPhotoIdData.value.photoDescription);
        //console.log('roomTypeName', findByPhotoIdroomTypeData.value);
        console.log('roomName', modelValue.value);
        console.log("父元件的photofile取得子元件檔案欄位變動時的值", photofile.value);

        // 將各個屬性添加到 FormData 中, 要對應到物件的屬性
        formData.append('photoname', findByPhotoIdData.value.photoname);
        if(photofile.value) {
            formData.append('photoFile', photofile.value);
        }
        formData.append('photoDescription', findByPhotoIdData.value.photoDescription);
        // 只有在值存在时才添加 這裡是使用關聯方式獲得該圖片的關聯房型值
        // if (findByPhotoIdroomTypeData.value) { 
        //     formData.append('roomTypeName', findByPhotoIdroomTypeData.value);
        // }

        // 列出現在所有房型用下拉選單的方式選所以一定有值
        formData.append('roomName', modelValue.value);
        

        axiosapi.post(`/photos/insertphoto`, formData).then(function(response){
            console.log("點擊新增後發送給後端的資料", response.data);
            roomTypePhotoModalRef.value.hideModal(); //關閉彈窗
            if(photoLastPageRows.value === 0) {
                photoCurrent.value += 1;
                photoPages.value += 1;
            }
            
            

            // 分頁用, 插入完資料後要自動跳到插入時的那一頁, 所以將 current.value 當作參數傳進去
            // findAllPage(current.value);

            // 分頁用, 不管在哪一頁插入數據自動跳到最後一頁
            console.log("insert後的Pages", photoPages.value);
            findAllPhotoPage(photoPages.value);
            
        })

        
        
    }

    let PhotoCard= ref(null);
    function roomTypeUpdatePhotoData() {

        console.log("觸發更新函數");
        // 創建 FormData 對象
        const formDataUpdate = new FormData();

        // 測試各個屬性值是否正確 
        console.log('photoname', findByPhotoIdData.value.photoname);
        console.log('photoDescription', findByPhotoIdData.value.photoDescription);
        console.log('roomTypeName', modelValue.value);
        console.log("父元件的photofile取得子元件檔案欄位變動時的值", photofile.value);

        // 將各個屬性添加到 FormData 中
        formDataUpdate.append('rpId', findByPhotoIdNumber);
        formDataUpdate.append('photoname', findByPhotoIdData.value.photoname);
        if(photofile.value) {
            formDataUpdate.append('photoFile', photofile.value);
        }
        formDataUpdate.append('photoDescription', findByPhotoIdData.value.photoDescription);
        formDataUpdate.append('roomName', modelValue.value);
        
        axiosapi.put(`/photos/updatephoto`, formDataUpdate, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
        }).then(function(){
        // 根據id找資料只會有1筆
        
        roomTypePhotoModalRef.value.hideModal();
        


        alert("修改成功");
    
        
        // 刷新頁面
        window.location.reload();
        

        // 刷新頁面一定會跳回第一頁之後再找跳到當前頁的方式
        
        })
    }

    // 刪除沒有 action
    function photoRemove(rpId) {

    console.log("photoRemove", rpId, new Date());
    axiosapi.delete(`/photo/deleteById?rpId=${rpId}`).then(function(response){

        console.log("if判斷前的最後一頁數值", photoLastPageRows.value);

        //用最後一頁幾筆資料來判斷刪除當前這筆之後頁數要不要減1
        if(photoLastPageRows.value === 1 && photoCurrent.value > 1) {
            photoCurrent.value -= 1;
        }

        console.log("if判斷後的最後一頁數值", photoLastPageRows.value);

        // 分頁用, 刪除完資料後要自動跳到刪除時的那一頁, 所以將 photoCurrent.value 當作參數傳進去
        findAllPhotoPage(photoCurrent.value);
        
        })

    }

    
    
    
    function openPhotoModal(action, id) {
        /*
        能抓的到 id 的原因是當 RoomTypePhotoCard 被點擊時會用 emits 傳 emits("openUpdate", "update", id(item.id傳進去)); 
        emits("傳給父元件是哪個事件被觸發", 參數1, 參數2);
        */
        console.log("openRoomTypePhotoModal", action, id, new Date());

        // 打開 openRoomTypePhotoModal 前先把資料清空
        modelValue.value = {};
        findByPhotoIdData.value = {};
        findByPhotoIdroomTypeData.value = null;

        if (action === "insert") {
            isShowButtonRoomTypePhotoInsert.value = true;
            console.log(isShowButtonRoomTypePhotoInsert.value);
        } else {
            isShowButtonRoomTypePhotoInsert.value = false;
            console.log(isShowButtonRoomTypePhotoInsert.value);
            findByPhotoId(id)
        }
        roomTypePhotoModalRef.value.showModal();

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