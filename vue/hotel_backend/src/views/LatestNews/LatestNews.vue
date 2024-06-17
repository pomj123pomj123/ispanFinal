<template>
    <h2>公告管理</h2>
    <button type="button" class="btn btn-primary" @click="openModal('insert')">新增</button>&nbsp;&nbsp;
    <button type="button" class="btn btn-primary" @click="changeDir" v-show="dir">排序：由新到舊</button>
    <button type="button" class="btn btn-primary" @click="changeDir" v-show="!dir">排序：由舊到新</button>

    <div  class="choose"><h5>顯示狀態：
            <input class="form-check-input" type="checkbox" value="尚未開始" v-model="statuses" checked 
                @change="showAll(1)" >尚未開始
            <input class="form-check-input" type="checkbox" value="顯示中" v-model="statuses" checked 
                @change="showAll(1)">顯示中
            <input class="form-check-input" type="checkbox" value="暫停顯示" v-model="statuses" checked 
                @change="showAll(1)">暫停顯示
            <input class="form-check-input" type="checkbox" value="已封存" v-model="statuses" checked 
                @change="showAll(1)">已封存 &nbsp;&nbsp;&nbsp;
            </h5>
    </div>

    <div  class="choose"><h5>類型：
        <input class="form-check-input" type="checkbox" value="一般公告" v-model="types" checked @change="showAll(1)">一般公告
        <input class="form-check-input" type="checkbox" value="優惠公告" v-model="types" @change="showAll(1)">優惠公告
        &nbsp;&nbsp;</h5>
    </div>
    <ChooseRows :total="total" :choices="[5,10,15,20]"
                        v-model="rows" @change="showAll" :current="current"></ChooseRows>
    <Paginate :first-last-button="true" first-button-text="第一頁"
        last-button-text="最後一頁" prev-text="上一頁" next-text="下一頁"
        :page-count="pages" :initial-page="current" v-model="current"
        :click-handler="showAll">
    </Paginate>
    <h2 v-show="LatestNewsList==''">查無資料，請試著改變篩選條件🧐</h2>
    <table class="table" v-show="LatestNewsList!=''">
        <thead>
            <tr>
                <!-- <th scope="col" class="col-id">#</th> -->
                <th scope="col" class="col-type">類型</th>
                
                <th scope="col" class="col-title">標題</th>
                <th scope="col" class="col-date">開始日期</th>
                <th scope="col" class="col-date">結束日期</th>
                <th scope="col" class="col-type">狀態</th>
                <th scope="col" class="col-button">編輯</th>
                <th scope="col" class="col-button">刪除</th>
            </tr>
        </thead>
        <tbody class="table-group-divider">
            <tr v-for="(item, index) in LatestNewsList" :key="index" >
                <!-- <td @click="openModal('update', item.lnId)">{{ item.lnId }}</td> -->
                <td @click="openModal('update', item.lnId)">{{ item.type }}</td>
                <td @click="openModal('update', item.lnId)">{{ item.title }}</td>
                <td @click="openModal('update', item.lnId)">{{ item.startDate }}</td>
                <td @click="openModal('update', item.lnId)">
                    <span v-if="item.endDate==='9999-12-31'">永久</span>
                    <span v-else>{{ item.endDate }}</span>
                </td>  
                <td><i class="bi bi-play-circle" 
                        @click="pause(item.lnId)" v-show="item.status==='顯示中'"></i>
                    <i class="bi bi-pause-circle-fill" 
                        @click="pause(item.lnId)" v-show="item.status==='暫停顯示'"></i>{{ item.status }}</td>
                <td @click="openModal('update', item.lnId)"><i class="bi bi-highlighter" @click="openModal('update', item.lnId)"></i></td>
                <td @click="deleteItem(item.lnId)"><i class="bi bi-x-circle" @click="deleteItem(item.lnId)"></i></td>
            </tr>
        </tbody>
    </table>

<!-- :屬性名稱="資料" -->
<!-- @自訂事件名稱="處理函式" -->
<LatestNewsModal ref="latestNewsModalRef" 
    @submit="handleSubmit" 
    :updateDataOringin="findUpdateData" :isCreate="isCreate">
</LatestNewsModal>
<!-- submit事件傳出兩筆資料：formData,startEndDateIsValidate -->

</template>


<script setup >
//import會用到的東西
    import Swal from "sweetalert2"
    import axiosapi from "@/plugins/axios.js";
    import { ref,onMounted,onUpdated } from "vue";
    import LatestNewsCreate from "@/components/LatestNews/LatestNewsCreate.vue";
    import LatestNewsModal from "@/components/LatestNews/LatestNewsModal.vue";
    import Paginate from "vuejs-paginate-next"
    import ChooseRows from "@/components/LatestNews/ChooseRows.vue";
    
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
    const LatestNewsList =ref(null); //用來裝找到的所有資料
    const total = ref(0); //總資料數?
    const pages = ref(5); //總頁數
    const current = ref(1); //現在在第幾頁(後端取名為start，實在該改名qq->我改了^^)
    const rows =ref(10); //這裡決定預設值!
    const lastPageRows = ref(0); //最後一頁有幾筆資料
    const dir =ref(true); // 預設true。 true-> DESC 由新到舊
    const order =ref("startDate");
    const statuses =ref(["顯示中","尚未開始","已封存","暫停顯示"]);
    const types =ref(["優惠公告","一般公告"]);
    const latestNewsModalRef = ref(null);
    const findUpdateData=ref(null)//用來裝找到的一筆資料->修改的時候會用到
    const isCreate=ref(true) //新增為true 修改為false



//資料狀態背景更新
function statusUpdate(){
    axiosapi.put(`/latestNews/statusUpdate`).then(function(response) {
        console.log("資料狀態更新成功")
    }).catch(function(error) {
        console.log("資料狀態更新失敗")
    })
}


//暫停切換
function pause(id){
    console.log("呼叫暫停")
    axiosapi.put(`/latestNews/changePauseStatus/${id}`).then(function(response) {
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


//查詢 //0516完成 //0520做分頁相關
    function showAll(page){
        if(current.value>pages.value){
            current.value==current.value-1
        }

        if(typeof page==="number") {  //有傳數字的話到該頁面
            current.value = page;
            //0520 遇到的問題：如果有類似<button @click="showAll">XXX</button>會導致[事件對象被傳遞]，
            //所以page可能不是[數字]而是[(自動傳出的)事件]，就會發生問題
            //解法1 <button @click="() => showAll(1)">Go to Page 1</button>
            //解法2 typeof
        }

        let data = {
            "current": current.value,
            "rows": rows.value,
            "dir": dir.value,
            "order": order.value,
            "statuses":statuses.value,
            "types":types.value
        }
        
        axiosapi.post("/latestNews/findByStatusAndType", data).then(function(response) {

            //console.log("response", response);
            LatestNewsList.value=response.data.list; 
            

            //pagination start  //0520要大改
            total.value =  response.data.count;
            pages.value = response.data.pages;
            console.log("total", total.value);
            lastPageRows.value = response.data.count % rows.value;//最後一頁中的資料筆數
            //pagination end
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

//刪除 //0517能動了讚讚 我是複製貼上大師OWO
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
                axiosapi.delete(`/latestNews/${pk}`).then(function(response){
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
                        Swal.fire({
                            text: response.data.message,
                            icon: 'warning',
                            allowOutsideClick: false,
                            confirmButtonText: '確認',
                        });
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

//根據action決定要isCreate的值並顯示Modal
function openModal(action, id) {
        if(action==="insert") {
            isCreate.value=true;
            findUpdateData.value = {};
        } else { //update
            isCreate.value=false;
            findById(id); //成功的話findUpdateData.value會被更新為要找的資料        
        }
        latestNewsModalRef.value.showModal();
    }

//處理是新增還是修改 //0520完成
    function handleSubmit(formData,startEndDateIsValidate,selectedFile){
        if (isCreate.value===true) {
            createItem(formData,startEndDateIsValidate)
            //圖片版
            //createItem2(formData,startEndDateIsValidate,selectedFile);
      } else {
            editItem(formData,startEndDateIsValidate);
      }
    }
//找一筆資料(修改的前置步驟)
    function findById(id){
        axiosapi.get(`/latestNews/${id}`).then(function (response) {
            //console.log("response", response);
            //console.log("response.data.list[0]", response.data.list[0]);
            if(response.data.list.length!=0) {
                findUpdateData.value = response.data.list[0];   //抓陣列第一筆資料然後裝進findUpdateData
                //console.log("在findById中，現在找到的findUpdateData為",JSON.stringify(findUpdateData.value))
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
//修改一筆資料//0520完成
    function editItem(formData,startEndDateIsValidate){
        Swal.fire({
            text: "Loading......",
            showConfirmButton: false,
            allowOutsideClick: false,
        });
        if(!startEndDateIsValidate){
            Swal.fire({
                    text: "結束日不能早於起始日",
                    icon: 'warning',
                    allowOutsideClick: false,
                    confirmButtonText: '確認',
                });
        }else{
            axiosapi.put(`/latestNews/${formData.lnId}`, formData).then(function(response) {
            if(response.data.success) {
                latestNewsModalRef.value.hideModal();
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
            Swal.fire({
                text: '修改失敗：'+error.message,
                icon: 'error',
                allowOutsideClick: false,
                confirmButtonText: '確認',
            });
        });
    }	
}
    
//新增一筆資料2
function createItem2(formData,startEndDateIsValidate,selectedFile){

    console.log("formData",formData)
    //JSON 物件轉換為 FormData
        let newFormData = new FormData();
        newFormData.append('file', selectedFile);
        newFormData.append('json', JSON.stringify(formData));

        if(!startEndDateIsValidate){
            Swal.fire({
                    text: "結束日不能早於起始日",
                    icon: 'warning',
                    allowOutsideClick: false,
                    confirmButtonText: '確認',
                });
        }else{
            axiosapi.post("/latestNews2", newFormData,{
          headers: {
            'Content-Type': 'multipart/form-data',
          }}).then(function(response) {
            if(response.data.success) {
                latestNewsModalRef.value.hideModal();
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

//新增一筆資料
    function createItem(formData,startEndDateIsValidate,selectedFile){
        console.log("callCreate");
        Swal.fire({
            text: "Loading......",
            showConfirmButton: false,
            allowOutsideClick: false,
        });
        if(!startEndDateIsValidate){
            Swal.fire({
                    text: "結束日不能早於起始日",
                    icon: 'warning',
                    allowOutsideClick: false,
                    confirmButtonText: '確認',
                });
        }else{
            axiosapi.post("/latestNews", formData).then(function(response) {
            if(response.data.success) {
                latestNewsModalRef.value.hideModal();
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

//改變排序
function changeDir(){
    dir.value=!dir.value;
    showAll();
}

</script>
    
<style>
    .choose{
        padding-top:10px;
    }

    .col-id{
        width: 3%;
    }
    .col-type {
        width: 10%;
    }
    .col-title {
        width: 20%;
    }
    .col-date {
        width: 12%;
    }
    .col-button {
        width: 5%;
    }

/* 暫時的格式 */
    table {
    width: 100%;
    border-collapse: collapse;
  }
  
  th, td {
    border: 1px solid #ddd;
    padding: 8px;
  }
  
  th {
    background-color: #f4f4f4;
  }
  
  button {
    cursor: pointer;
  }
</style>