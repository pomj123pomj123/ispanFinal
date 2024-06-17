<template>
    <h3>餐廳訂位管理</h3>
    <!-- {{ result }} -->
    <button type="button" class="btn btn-primary" @click="openModal('insert')">新增</button>&nbsp;&nbsp;
    <button type="button" class="btn btn-primary" @click="changeDir" v-show="dir">排序：由新到舊</button>
    <button type="button" class="btn btn-primary" @click="changeDir" v-show="!dir">排序：由舊到新</button>


    <div class="row">
        <div>
            搜尋客戶電話：<input type="text" v-model="findcellphone" placeholder="請輸入客戶電話" @input="callFind(0)">
        </div>
    </div>
    <!-- <h2 v-show="showBook==''">查無資料，請試著改變篩選條件🧐</h2> -->
    <div>
        <div class="table-responsive">
            <table class="table-primary table-bordered">
                <thead>
                    <tr class="table-primary text-center">
                        <th scope="col">編號</th>
                        <th scope="col">預定日期</th>
                        <th scope="col">預定時間</th>
                        <th scope="col">客戶姓名</th>
                        <th scope="col">大人人數</th>
                        <th scope="col">小孩人數</th>
                        <th scope="col">手機號碼</th>
                        <th scope="col">E-mail</th>
                        <th scope="col">備註</th>
                        <th scope="col" class="col-button">編輯</th>
                        <th scope="col" class="col-button">刪除</th>
                    </tr>
                </thead>
                <tbody class="booking" v-if="result">
                    <tr v-for="(result, reserveTime) in result" :key="result.reserveTime" class="text-center"> 
                        <td>{{ result.rebId }}</td>
                        <td>{{ result.reserveTime }}</td>
                        <td>{{ result.mealTime }}</td>
                        <td>{{ result.lastName }}{{ result.firstName }}</td>
                        <td>{{ result.totalAdult }}</td>
                        <td>{{ result.totalChildren }}</td>
                        <td>{{ result.cellphone }}</td>
                        <td>{{ result.email }}</td>
                        <td>{{ result.remark }}</td>
                        <td><i class="bi bi-highlighter" @click="openModal('update', result.rebId)"></i></td>
                        <td><i class="bi bi-x-circle" @click="removebooking(result.rebId)"></i></td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>

    <div>

    </div>


    <!-- :屬性名稱="資料" -->
<!-- @自訂事件名稱="處理函式" -->
<RestaurantBookingModal ref="restaurantBookingModalRef" 
    @submit="handleSubmit" 
    :updateDataOringin="findUpdateData" :isCreate="isCreate">
</RestaurantBookingModal>
<!-- submit事件傳出兩筆資料：formData,startEndDateIsValidate -->
</template>
    
<script setup>
//import會用到的東西
    import Swal from "sweetalert2"
    import axiosapi from "@/plugins/axios.js";
    import { ref,onMounted,onUpdated } from "vue";
    import Paginate from "vuejs-paginate-next"
    import RestaurantBookingModal from "@/components/restaurant/RestaurantBookingModal.vue";

    

//組件掛載完成時要做的事
onMounted(function(){ 
        //進行查詢
        // statusUpdate();
        showAll();
    })
    onUpdated(function(){
        //console.log("current.value",current.value);
    })


    //宣告會用到的變數
    const resultlist =ref(null); //用來裝找到的所有資料，這是別人的，要刪除
    const total = ref(0); //總資料數?
    const pages = ref(5); //總頁數
    const current = ref(1); //現在在第幾頁(後端取名為start，實在該改名qq->我改了^^)
    const rows =ref(20); //這裡決定預設值!
    const lastPageRows = ref(0); //最後一頁有幾筆資料
    const dir =ref(true); // 預設true。 true-> DESC 由新到舊
    const order =ref("lnId");
    const statuses =ref(["顯示中","尚未開始","已封存","暫停顯示"]);
    const types =ref(["測試類型","一般公告"]);
    const restaurantBookingModalRef = ref(null);
    const findUpdateData=ref(null)//用來裝找到的一筆資料->修改的時候會用到
    const isCreate=ref(true) //新增為true 修改為false
    const result = ref(null); //用來裝找到的所有資料
    const findcellphone = ref("");

    const isModify = ref(true);

// chatgpt給的方法
function removebooking(rebId) {
    Swal.fire({
        text: "確定刪除？",
        icon: 'warning',
        allowOutsideClick: false,
        confirmButtonText: '確認',
        showCancelButton: true,
        cancelButtonText: '取消',
    }).then((result) => { // 將刪除請求放在確認按鈕的回調函數中
        if (result.isConfirmed) { // 如果用戶按下了確認
            axiosapi.delete(`/restaurant/booking/remove/${rebId}`).then((response) => {
                console.log("response:", response);
                console.log("response.data:", response.data);
                if (response.data.success) {
                    Swal.fire({
                        text: response.data.message,
                        icon: 'success',
                        allowOutsideClick: false,
                        confirmButtonText: '確認',
                    }).then(function(result) {
                        if (result.isConfirmed) {
                            isModify.value = false;
                            location.reload();
                        }
                    });
                } else {
                    Swal.fire({
                        text: response.data.message,
                        icon: 'error',
                        allowOutsideClick: false,
                        confirmButtonText: '確認',
                    });
                }
            }).catch(function(error) {
                console.log("error", error);
                Swal.fire({
                    text: '取消預約失敗:' + error.message,
                    icon: 'error',
                    allowOutsideClick: false,
                    confirmButtonText: '確認',
                });
            });
        }
    });
}

// // chatgpt給的方法我自己再次修改
// function showAll(page) {
//         console.log("page ="+page);
//         if(current.value>pages.value){
//             current.value==current.value-1
//         }

//         if(typeof page==="number") {  //有傳數字的話到該頁面
//             current.value = page;
//             //0520 遇到的問題：如果有類似<button @click="showAll">XXX</button>會導致[事件對象被傳遞]，
//             //所以page可能不是[數字]而是[(自動傳出的)事件]，就會發生問題
//             //解法1 <button @click="() => showAll(1)">Go to Page 1</button>
//             //解法2 typeof
//         }

//         let data = {
//             "current": current.value,
//             "rows": rows.value,
//             "dir": dir.value,
//             "order": order.value,
//             "statuses":statuses.value,
//             "types":types.value
//         }
        
//         let queryParams = {
//             params: {
//                 "current": current.value,
//                 "rows": rows.value,
//                 "dir": dir.value,
//                 "order": order.value,
//                 "statuses":statuses.value,
//                 "types":types.value
//             }
//         };
//         axiosapi.get("/allData", queryParams)
//             .then(function(response) {
                
//                 console.log('response.data.booking='+response.data.booking);
//                 result.value = response.data; // 更新資料
//                 console.log("result:"+result.value);
//                 console.log('response.data.booking!!='+response.data.booking);
//                 console.log("result:", result.value);
//                 total.value = response.data.length; // 更新總資料數
//                 // 如果後端提供了分頁資訊，可以在這裡更新相關變數

//                 //pagination start  //0520要大改
//                 // total.value =  response.data.count;
//                 pages.value = response.data.pages;
//                 console.log("total", total.value);
//                 lastPageRows.value = response.data.count % rows.value;//最後一頁中的資料筆數
//                 //pagination end

//                 if(result.isConfirmed){
//                     showBook.value = true;
//                 }
//             })
//             .catch(function(error) {
//                 console.log("callFind error", error);
//                 console.log(result.value[0].lastName); // 訪問陣列中的第一個元素的 lastName 屬性
//                 Swal.fire({
//                     text: '失敗：' + error.message,
//                     icon: 'error',
//                     allowOutsideClick: false,
//                     confirmButtonText: '確認',
//                 });
//             });
//     }

// chatgpt給的方法
    function showAll(page, sortBy, sortOrder) {
        console.log("page ="+page);
        if (typeof page === "number") {
            current.value = page;
        }
        
        let queryParams = {
            params: {
                "current": page, // 當前頁碼
                "rows": 10, // 每頁顯示的資料筆數
                dir: dir.value, // 排序方向，true 表示由新到舊
                sortBy: sortBy, // 根據參數決定排序欄位
                sortOrder: sortOrder ? 'DESC' : 'ASC' // 根據排序方向決定排序方式
                
            }
        };
        axiosapi.get("/allData", queryParams)
            .then(function(response) {
                
                // console.log('response.data.booking='+response.data.booking);
                // result.value = response.data; // 更新資料
                // console.log("result:"+result.value);
                // console.log('response.data.booking!!='+response.data.booking);
                // console.log("result:", result.value);
                // total.value = response.data.length; // 更新總資料數
                // // 如果後端提供了分頁資訊，可以在這裡更新相關變數

                result.value = response.data;
                total.value = response.data.length; // 更新總資料數
                pages.value = response.data.pages; // 更新總頁數

                if(result.isConfirmed){
                    showBook.value = true;
                }
            })
            .catch(function(error) {
                console.log("callFind error", error);
                console.log(result.value[0].lastName); // 訪問陣列中的第一個元素的 lastName 屬性
                Swal.fire({
                    text: '失敗：' + error.message,
                    icon: 'error',
                    allowOutsideClick: false,
                    confirmButtonText: '確認',
                });
            });
    }

//改變排序
function changeDir(){
    dir.value = !dir.value;
    // 傳遞相應的排序參數，此處假設根據 reserveTime 進行排序
    showAll(current.value, 'rebId', dir.value);
}


    
    // function showAll(page){
    //     if(current.value>pages.value){
    //         current.value==current.value-1
    //     }

    //     if(typeof page==="number") {  //有傳數字的話到該頁面
    //         current.value = page;
    //         //0520 遇到的問題：如果有類似<button @click="showAll">XXX</button>會導致[事件對象被傳遞]，
    //         //所以page可能不是[數字]而是[(自動傳出的)事件]，就會發生問題
    //         //解法1 <button @click="() => showAll(1)">Go to Page 1</button>
    //         //解法2 typeof
    //     }

    //     let data = {
    //         "lastName":lastName.value,
    //         "firstName":firstName.value,
    //         "email":email.value,
    //         "cellphone":cellphone.value,
    //         "totalAdult":totalAdult.value,
    //         "totalChildren":totalChildren.value,
    //         "remark":remark.value,
    //         "reserveTime": reserveTime.value,
    //         "mealTime":mealTime.value
    //     }
        
    //     axiosapi.get("/allData", data).then(function(response) {

    //         //console.log("response", response);
    //         result.value=response.data.booking; 

    //         //pagination start  //0520要大改
    //         total.value =  response.data.count;
    //         pages.value = response.data.pages;
    //         console.log("total", total.value);
    //         lastPageRows.value = response.data.count % rows.value;//最後一頁中的資料筆數
    //         //pagination end
    //     }).catch(function(error) {
    //         console.log("callFind error", error);
    //         Swal.fire({
    //             text: '失敗：'+error.message,
    //             icon: 'error',
    //             allowOutsideClick: false,
    //             confirmButtonText: '確認',
    //         });
    //     });
    // }

    //根據action決定要isCreate的值並顯示Modal
    function openModal(action, id) {
        if(action==="insert") {
            isCreate.value=true;
            findUpdateData.value = {};
        } else { //update
            isCreate.value=false;
            findById(id); //成功的話findUpdateData.value會被更新為要找的資料        
        }
        restaurantBookingModalRef.value.showModal();
    }

    //處理是新增還是修改 //0520完成
    function handleSubmit(formData){
        if (isCreate.value===true) {
            createItem(formData);
            //圖片版
            //createItem2(formData,startEndDateIsValidate,selectedFile);
        } else {
            editItem(formData);
        }
    }
    //找一筆資料(修改的前置步驟)
    function findById(id){
        axiosapi.get(`/restaurant/${id}`).then(function (response) {
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

function editItem(formData){
        Swal.fire({
            text: "Loading......",
            showConfirmButton: false,
            allowOutsideClick: false,
        });
        axiosapi.put(`/restaurantbackend/modify/${formData.rebId}`, formData).then(function(response){
            if(response.data.success){
                RestaurantBookingModal.value.hideModal();
                Swal.fire({
                    text: response.data.message,
                    icon: 'success',
                    allowOutsideClick: false,
                    confirmButtonText: '確認',
                }).then(function(){
                    showAll(current.value);
                    showAll();
                    console.log("create success");
                })
            }else{
                Swal.fire({
                    text: response.data.message,
                    icon: 'warning',
                    allowOutsideClick: false,
                    confirmButtonText: '確認',
                });
            }
        }).catch(function(error){
            console.log("callCreate error", error);
            Swal.fire({
                text: '修改失敗：'+error.message,
                icon: 'error',
                allowOutsideClick: false,
                confirmButtonText: '確認',
            });
        })
    }

    //c給的方法
    function createItem(formData) {
    Swal.fire({
        text: "Loading...",
        showConfirmButton: false,
        allowOutsideClick: false,
    });
    // 确认 formData 中包含了正确的数据
    axiosapi.post("/restaurant/createcustomer", formData)
        .then(function(response) {
            console.log("response = "+response);
            console.log("response.data = "+response.data);
            if (response.data.success) {
                // 请求成功的处理逻辑
                restaurantBookingModalRef.value.hideModal();
                Swal.fire({
                    text: response.data.message,
                    icon: 'success',
                    allowOutsideClick: false,
                    confirmButtonText: 'OK',
                }).then(function() {
                    showAll(current.value);
                    showAll();
                });
            } else {
                // 请求失败的处理逻辑
                Swal.fire({
                    text: response.data.message,
                    icon: 'warning',
                    allowOutsideClick: false,
                    confirmButtonText: 'OK',
                });
            }
        })
        .catch(function(error) {
            // 请求错误的处理逻辑
            console.log("Error:", error);
            Swal.fire({
                text: '请求失败: ' + error.message,
                icon: 'error',
                allowOutsideClick: false,
                confirmButtonText: 'OK',
            });
        });
}

    

    
    </script>
    
<style scoped>
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

    .table-primary {
    background-color:#D2E9FF; /* 將表格背景色設置為白色 */
}

.table-primary th,
.table-primary td {
    border: 1px solid #b9adad;
    padding: 8px;
}

.table-primary th {
    background-color: #66B3FF;
}


</style>