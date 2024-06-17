<template>
    <h2>優惠管理</h2>
    <button type="button" class="btn btn-primary" @click="openModal('insert')">新增</button>&nbsp;&nbsp;
    <button type="button" class="btn btn-primary" @click="changeDir" v-show="dir">排序：由新到舊</button>
    <button type="button" class="btn btn-primary" @click="changeDir" v-show="!dir">排序：由舊到新</button>

    <div class="choose"><h5>顯示狀態：
            <input class="form-check-input" type="checkbox" value="尚未開始" v-model="statuses" checked 
                @change="showAll(1)" >尚未開始
            <input class="form-check-input" type="checkbox" value="啟用中" v-model="statuses" checked 
                @change="showAll(1)">啟用中
            <input class="form-check-input" type="checkbox" value="暫停中" v-model="statuses" checked 
                @change="showAll(1)">暫停中
            <input class="form-check-input" type="checkbox" value="已封存" v-model="statuses" checked 
                @change="showAll(1)">已封存 &nbsp;&nbsp;&nbsp;</h5></div>
     <div class="choose"><h5>類型：
        <input class="form-check-input" type="checkbox" value="專案" v-model="types" checked @change="showAll(1)">專案
        <input class="form-check-input" type="checkbox" value="折扣碼" v-model="types" @change="showAll(1)">折扣碼
        &nbsp;&nbsp;</h5></div>
        


    <ChooseRows :total="total" :choices="[5,10,15,20]"
                        v-model="rows" @change="showAll" :current="current"></ChooseRows>                        
    <Paginate :first-last-button="true" first-button-text="第一頁"
        last-button-text="最後一頁" prev-text="上一頁" next-text="下一頁"
        :page-count="pages" :initial-page="current" v-model="current"
        :click-handler="showAll">
    </Paginate>
    <h2 v-show="DiscountList==''">查無資料，請試著改變篩選條件🧐</h2>
    <table class="table" v-show="DiscountList!=''">
        <thead>
            <tr>
                <!-- <th scope="col" class="col-id">#</th> -->
                <th scope="col" class="col-10">類型</th>
                
                <th scope="col" class="col-10">名稱</th>
                <th scope="col" class="col-10">折扣碼</th>
                <th scope="col" class="col-10">折扣</th>
                <th scope="col" class="col-10">已用/可用次數</th>
                <th scope="col" class="col-date">開始日期</th>
                <th scope="col" class="col-date">結束日期</th>
                <th scope="col" class="col-10">狀態</th>
                <!-- <th scope="col" class="col-type">點此查看適用房型</th> -->
                <th scope="col" class="col-button">編輯</th>
                <th scope="col" class="col-button">刪除</th>
            </tr>
        </thead>
        <tbody class="table-group-divider">
            <tr v-for="(item, index) in DiscountList" :key="index">
                <!-- <td @click="openModal('update', item.ddId)">{{ item.ddId }}</td> -->
                <td @click="openModal('update', item.ddId)">{{ item.discountType }}</td>
                <td @click="openModal('update', item.ddId)">{{ item.name }}</td>
                <td @click="openModal('update', item.ddId)">
                    <span v-if="item.discountType==='專案'">-</span>
                    <span v-else>{{ item.promoCode }}</span>
                    </td>
                <td v-show="item.discountRate!=null" @click="openModal('update', item.ddId)">
                    <span v-if="item.discountRate % 10 == 0">打{{ item.discountRate / 10 }}折</span>
                    <span v-else>打{{ item.discountRate }}折</span></td>
                <td v-show="item.discountPrice!=null" @click="openModal('update', item.ddId)">折{{ item.discountPrice }}元</td>
                <td @click="openModal('update', item.ddId)">
                    <span v-if="item.maxTimes>=99999">{{ item.usedTimes }}/無限制</span>
                    <span v-else>{{ item.usedTimes }}/{{ item.maxTimes }}</span>
                </td>
                <td @click="openModal('update', item.ddId)">{{ item.beginDate }}</td>
                <td @click="openModal('update', item.ddId)">
                    <span v-if="item.lastDate==='9999-12-31'">永久</span>
                    <span v-else>{{ item.lastDate }}</span>
                </td>    
                <td><i class="bi bi-play-circle" 
                        @click="pause(item.ddId)" v-show="item.status==='啟用中'"></i>
                    <i class="bi bi-pause-circle-fill" 
                        @click="pause(item.ddId)" v-show="item.status==='暫停中'"></i>{{ item.status }}</td>
                        <!-- <td><button @click="findRoomtype(item.ddId)">點此查看適用房型</button></td> -->
                <td><i class="bi bi-highlighter" @click="openModal('update', item.ddId)"></i></td>
                <td><i class="bi bi-x-circle" @click="deleteItem(item.ddId)"></i></td>
            </tr>
        </tbody>
    </table>

    <!-- :屬性名稱="資料" -->
    <!-- @自訂事件名稱="處理函式" -->
    <DiscountModal ref="DiscountModalRef" :ModalFormData="FormData" :roomTypeList="RoomTypeList"
    :isCreate="isCreate" @submit="handleSubmit" >
    </DiscountModal>

</template>
    
<script setup>
//import會用到的東西
    import Swal from "sweetalert2"
    import axiosapi from "@/plugins/axios.js";
    import { ref,onMounted,onUpdated,computed } from "vue";
    import Paginate from "vuejs-paginate-next"
    import ChooseRows from "@/components/LatestNews/ChooseRows.vue";
    import DiscountModal from "@/components/Discount/DiscountModal.vue";

//組件掛載完成時要做的事
    onMounted(function(){ 
        //進行查詢
        statusUpdate();
        showAll();
    })
    onUpdated(function(){
        //console.log("current.value",current.value);
    })
//宣告會用到的變數
const DiscountList =ref(null); //用來裝找到的所有資料
    const total = ref(0); //總資料數?
    const pages = ref(5); //總頁數
    const current = ref(1); //現在在第幾頁(後端取名為start，實在該改名qq->我改了^^)
    const rows =ref(10); //這裡決定預設值!
    const lastPageRows = ref(0); //最後一頁有幾筆資料
    const dir =ref(true); // 預設true。 true-> DESC 由新到舊
    const order =ref("beginDate");
    const statuses =ref(["尚未開始","啟用中","暫停中","已封存"]);
    const types =ref(["專案","折扣碼"]);
    const DiscountModalRef = ref(null);
    const isCreate=ref(true) //新增為true 修改為false
    const RoomTypeList =ref(null); //用來裝找到的房型資料

    //預設值(新增時)
    const FormData=ref({
        hId: 1,
        hotelName:"芳山飯店-大安館",
        // discountType: "專案",
        // promoCode: "",
        // discountRate: null,
        // discountPrice: null,
        // beginDate: getTodayDate(),
        // lastDate: getTodayDate(),
        // maxTimes: 100,
        // name: "",
        // memberOnly: "false",
        // idVerification: "false",
        //roomTypes: []

        // status: "啟用中",
        // emark: "備註",
        // lastModifiedEmp: null,
        

    });

//     //取得今天日期並將格式轉換為yyyy-mm-dd
//     function getTodayDate() {
//         //取得現在的日期時間
//         const today = new Date();
//         //取得年份
//         const yyyy = today.getFullYear(); 
//         // getMonth()回傳0~11所以要加1
//         // String(字串).padStart(期望長度,填充字符)，但其實就算不用也不會出錯
//         const mm = String(today.getMonth() + 1).padStart(2, '0');
//         const dd = String(today.getDate()).padStart(2, '0');
//         return `${yyyy}-${mm}-${dd}`;
//     }

// //資料驗證：判斷起始日是否早於截止日
    
//     const startEndDateIsValidate = computed(() => {
//         return new Date(formData.value.startDate) <= new Date(formData.value.endDate);
//     });

//查詢
    function showAll(page){
        if(current.value>pages.value){
            current.value==current.value-1
        }

        if(typeof page==="number") {  //有傳數字的話到該頁面
            current.value = page;
        }

        let data = {
            "current": current.value,
            "rows": rows.value,
            "dir": dir.value,
            "order": order.value,
            "statuses":statuses.value,
            "types":types.value
        }
        


        axiosapi.post("/discount/findByStatusAndType", data).then(function(response) {

            console.log("response", response);
            DiscountList.value=response.data.list; 

            //pagination start  
            total.value =  response.data.count;
            pages.value = response.data.pages;
            console.log("total", total.value);
            lastPageRows.value = response.data.count % rows.value;//最後一頁中的資料筆數
            //pagination end
            
            //測試
            console.log("dir", dir.value);

        }).catch(function(error) {
            console.log("callFind error", error);
            Swal.fire({
                text: '失敗：'+error.message,
                icon: 'error',
                allowOutsideClick: false,
                confirmButtonText: '確認',
            });
        });
    }

//刪除 
    function deleteItem(pk){
    //彈出確認視窗
        Swal.fire({
            text: "確定刪除？",
            icon: 'warning',
            allowOutsideClick: false,
            confirmButtonText: '確認',
            showCancelButton: true,
            cancelButtonText: '取消',
        }).then(function (result) {
            //如果點了確定刪除，就跳出Loading......視窗
            if (result.isConfirmed) {
                Swal.fire({
                    text: "Loading......",
                    showConfirmButton: false,
                    allowOutsideClick: false,
                });

                //試著執行delete
                axiosapi.delete(`/discount/delete/${pk}`).then(function(response){
                    //如果成功，跳出成功視窗
                    if(response.data.success) {
                        //成功就先重整畫面
                        showAll(current.value);
                        //刪除導致最後一頁資料為空時，要重新整理(0520做不好，先整段註解調改日再戰^^)
                        console.log("pages.value",pages.value)
                        if(current.value==pages.value&&lastPageRows.value===1){ //如果現在的頁數=刪除前的頁數
                            //console.log("刪掉最後一頁的唯一一筆資料囉")
                            showAll(current.value-1)
                        }
                        console.log("current.value",current.value);
                        //然後跳出確認視窗
                        Swal.fire({
                            text: response.data.message,
                            icon: 'success',
                            allowOutsideClick: false,
                            confirmButtonText: '確認',
                        }).then(function() {
                            console.log("delete success");                          
                        });
                    //如果失敗，跳出失敗視窗
                    } else {  
                        if(response.data.askArchive){//如果使用次數不為0
                            Swal.fire({
                            text: response.data.message +"請問要把本優惠狀態改為已封存嗎",
                            icon: "question",
                            showCancelButton: true,
                            confirmButtonColor: "#3085d6",
                            cancelButtonColor: "#d33",
                            confirmButtonText: "是，改為已封存",
                            //cancelButtonText:"取消"
                            }).then((result) => {
                                if (result.isConfirmed) {
                                    axiosapi.put(`/discount/archive/${pk}`).then(function(response){ //封存成功
                                        Swal.fire({
                                        title: "狀態修改成功",
                                        text: "此優惠已被封存",
                                        icon: "success"
                                        });
                                        statusUpdate();
                                        showAll(1);
                                    }).catch(function(error){
                                        Swal.fire({
                                        text: "封存失敗",
                                        icon: 'warning',
                                        allowOutsideClick: false,
                                        confirmButtonText: '確認',});
                                    })   
                            }});
                        }else{
                            Swal.fire({
                                text: response.data.message,
                                icon: 'warning',
                                allowOutsideClick: false,
                                confirmButtonText: '確認',
                            });
                        }
                    }
                //如果執行delete失敗，顯示失敗視窗
                }).catch(function(error) {
                    console.log("callRemove error", error);
                    Swal.fire({
                        text: '失敗：'+error.message,
                        icon: 'error',
                        allowOutsideClick: false,
                        confirmButtonText: '確認',
                    });
                });
            }
        });   
    }

//根據action決定要isShowButtonInsert的值並顯示Modal  //0604註解掉 
async function openModal(action, id) {
        if(action==="insert") {
            isCreate.value=true;
        } else { //update
            isCreate.value=false;
            findById2(id); //成功的話FormData.value會被更新為要找的資料

            //await findRoomtype(id)//成功的話RoomTypeList.value會被更新為要找的資料

            //roomTypes 是一個陣列，包含多個物件，每個物件都有 rtId 和 roomName 屬性。
            //map 方法會遍歷 roomTypes 陣列中的每個元素，並對每個元素執行回調函數。
            //在每次迭代中，回調函數會接收當前的元素作為參數，在這裡這個參數被命名為 room。
            //回調函數 room => room.rtId 簡寫自 function(room) { return room.rtId; }，表示回傳 room 物件中的 rtId 屬性。
            //這樣，map 方法會創建並返回一個新的陣列，這個新陣列包含了每個原始物件的 rtId 值。

            
            console.log("003-RoomTypeList.value應該要是一個包含房間資料的物件",JSON.stringify(RoomTypeList.value))
            // FormData.value.roomTypes = RoomTypeList.value.map(room => room.rtId);
            // RoomTypeList.value=RoomTypeList.value.map(room => room.rtId);
            console.log("004-FormData.value.roomTypes應該要是一個陣列",FormData.value.roomTypes)
        }
        DiscountModalRef.value.showModal(action, id);
    }

//處理送出時是新增還是修改 
    function handleSubmit(formData,startEndDateIsValidate,selectedFile){
        if (isCreate.value===true) {
            createItem(formData,startEndDateIsValidate)
      } else {
        console.log("000-formData",formData)
            editItem(formData,startEndDateIsValidate);
      }
    }

    //新增0605
    function createItem(formData,startEndDateIsValidate){
        if(!startEndDateIsValidate){
            Swal.fire({
                    text: "結束日不能早於起始日",
                    icon: 'warning',
                    allowOutsideClick: false,
                    confirmButtonText: '確認',
                });
        }else{
            axiosapi.post("discount/create", formData).then(function(response) {
            if(response.data.success) {
                DiscountModalRef.value.hideModal();
                //判斷新增後要顯示第幾頁
                if(dir.value==true){
                        showAll(1) //由新至舊時新增，顯示第一頁
                    }else if(dir.value==false){ //由舊至新時新增
                        console.log("lastPageRows.value",lastPageRows.value)
                        console.log("rows.value",rows.value)
                        console.log("pages.value",pages.value)
                        if(lastPageRows.value==0){//最後一頁資料數=rows
                            showAll(pages.value+1)//最後一頁+1
                        }else{//沒滿
                            showAll(pages.value)
                        }
                    }
                Swal.fire({
                    text: response.data.message,
                    icon: 'success',
                    allowOutsideClick: false,
                    confirmButtonText: '確認',
                }).then(function() {
                    console.log("create success");
                });

            } else {
                Swal.fire({
                    text: response.data.message,
                    icon: 'warning',
                    allowOutsideClick: false,
                    confirmButtonText: '確認',
                });
            }
        }).catch(function(error) {
            console.log("callCreate error", error);
            Swal.fire({
                text: '失敗：'+error.message,
                icon: 'error',
                allowOutsideClick: false,
                confirmButtonText: '確認',
            });
        });
    }	
}

//找一筆資料(修改的前置步驟) //0605版本直接改後端融合找房型
function findById2(id){
        axiosapi.get(`/discount/findById0605/${id}`).then(function (response) {
            if(response.data.length!=0) {//如果有找到
                FormData.value= response.data.data; 
                console.log("我要看的此時FormData.value",FormData.value)
                }
        }).catch(function (error) {
            console.log("callFindById error", error);
            Swal.fire({
                text: '失敗：'+error.message,
                icon: 'error',
                allowOutsideClick: false,
                confirmButtonText: '確認',
            });
        });
    }



//找一筆資料(修改的前置步驟) //0605暫時棄用
function findById(id){
        axiosapi.get(`/discount/findById/${id}`).then(function (response) {
            if(response.data.length!=0) {//?
                FormData.value= response.data.data;  
                console.log("此時FormData.value",FormData.value)
            }
            setTimeout(function() {
                Swal.close();
            }, 500);
        }).catch(function (error) {
            console.log("callFindById error", error);
            Swal.fire({
                text: '失敗：'+error.message,
                icon: 'error',
                allowOutsideClick: false,
                confirmButtonText: '確認',
            });
        });
    }
//修改一筆資料
function editItem(formData,startEndDateIsValidate){
        if(!startEndDateIsValidate){
            Swal.fire({
                    text: "結束日不能早於起始日",
                    icon: 'warning',
                    allowOutsideClick: false,
                    confirmButtonText: '確認',
                });
        }else{
            axiosapi.put(`/discount/modify/${formData.ddId}`, formData).then(function(response) {
            if(response.data.success) {
                DiscountModalRef.value.hideModal();
                Swal.fire({
                    text: response.data.message,
                    icon: 'success',
                    allowOutsideClick: false,
                    confirmButtonText: '確認',
                }).then(function() {
                    showAll(current.value)
                    console.log("create success");
                });
            } else {
                Swal.fire({
                    text: response.data.message,
                    icon: 'warning',
                    allowOutsideClick: false,
                    confirmButtonText: '確認',
                });
            }
        }).catch(function(error) {
            console.log("callCreate error", error);
            console.log("發生錯誤時的formData ", formData);
            
            Swal.fire({
                text: '修改失敗：'+error.message,
                icon: 'error',
                allowOutsideClick: false,
                confirmButtonText: '確認',
            });
        });
    }	
}
//查對應房型
async function findRoomtype(pk){
    await axiosapi.get(`/discount/findRoomTypesById/${pk}`).then(function(response){
        //console.log("response",response.data.list)
        RoomTypeList.value=response.data.list
        //console.log("RoomTypeList.value",RoomTypeList.value)
    }).catch(function(error){
        //console.log("something wrong when finding Roomtypes")
    })

}

//資料狀態更新
    function statusUpdate(){
    axiosapi.put(`/discount/statusUpdate`).then(function(response) {
        console.log("資料狀態更新成功")
    }).catch(function(error) {
        console.log("資料狀態更新失敗")
    })
}
//暫停切換
function pause(id){
    //console.log("呼叫暫停")
    axiosapi.put(`discount/changePauseStatus/${id}`).then(function(response) {
        if(response.data.success) {
            Swal.fire({
                text: response.data.message,
                icon: 'success',
                allowOutsideClick: false,
                confirmButtonText: '確認',
            }).then(function() {
                showAll(current.value)
                console.log("create success");
            });
        } else {
            Swal.fire({
                text: response.data.message,
                icon: 'warning',
                allowOutsideClick: false,
                confirmButtonText: '確認',
            });
        }
    }).catch(function(error) {
        console.log("pause error", error);
        Swal.fire({
            text: '狀態切換失敗：'+error.message,
            icon: 'error',
            allowOutsideClick: false,
            confirmButtonText: '確認',
        });
    });
}

//改變排序
function changeDir(){
    dir.value=!dir.value;
    showAll();
}

</script>
    
<style scoped>

    .choose{
        padding-top:10px;
    }

    .col-id{
        width: 3%;
    }
    .col-10 {
        width: 10%;
    }
    .col-date {
        width: 12%;
    }
    .col-button {
        width: 5%;
    }
</style>