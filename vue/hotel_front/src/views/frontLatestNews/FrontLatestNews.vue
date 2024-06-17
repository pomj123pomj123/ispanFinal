<template>
    
<div class="container text-center">
    <div class="row front">
        <div class="col-4 front">
            <br><br><br><br><br>
            <h2>公告列表</h2>
            <div class="list-group" >
                <button @click="findById(item.lnId)" class="list-group-item list-group-item-action" aria-current="true" v-for="(item, index) in LatestNewsList" :key="index">
                    <div class="d-flex w-100 justify-content-between">
                        <h5 class="mb-1">{{ item.title }}</h5>
                        <small  class="text-body-secondary">{{ item.startDate }}</small>
                    </div>
                    <small class="text-body-secondary">{{ item.type }}</small>
                </button>
            </div>
        </div>
        <div class="col-8 front" v-if="findData">
            <br><br>
            <h1>{{findData.title}}</h1><br>
            <h5 style="text-align: right;">公告日期：{{ findData.startDate }}</h5>
            <img v-if="findData.type==='一般公告'" src="/images/LatestNewsPic/LatestNews1.png" width="100%">
            <img v-if="findData.type==='優惠公告'" src="/images/LatestNewsPic/LatestNews2.png" width="100%">
            <br>
            <div class="content"><h5>{{ findData.content }}</h5></div>
            <br><br><br><br>
        </div>
    </div>
</div>
    
</template>
    
<script setup>

//import會用到的東西
    import Swal from "sweetalert2"
    import axiosapi from "@/plugins/axios.js";
    import { ref,onMounted,onUpdated } from "vue";

//組件掛載完成時要做的事
    onMounted(function(){ 
        //進行查詢
        statusUpdate();
        showAll();
    })
    onUpdated(function(){

    })

    //宣告會用到的變數
    const LatestNewsList =ref(null); //用來裝找到的所有資料
    const total = ref(0); //總資料數?
    const pages = ref(5); //總頁數
    const current = ref(1); //現在在第幾頁(後端取名為start，實在該改名qq->我改了^^)
    const rows =ref(100); //這裡決定預設值!
    const lastPageRows = ref(0); //最後一頁有幾筆資料
    const dir =ref(true); // 預設true。 true-> DESC 由新到舊
    const order =ref("startDate");
    const statuses =ref(["顯示中"]);
    const types =ref(["一般公告","優惠公告"]);
    const findData=ref(null)//用來裝找到的一筆資料

    //資料狀態背景更新
function statusUpdate(){
    axiosapi.put(`/latestNews/statusUpdate`).then(function(response) {
        console.log("資料狀態更新成功")
    }).catch(function(error) {
        console.log("資料狀態更新失敗")
    })
}
//查詢 //0516完成 //0520做分頁相關
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
        
        axiosapi.post("/latestNews/findByStatusAndType", data).then(function(response) {

            console.log("response", response);
            LatestNewsList.value=response.data.list; 
            //取得預設值
            findData.value=response.data.list[0]

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

    //找一筆資料(修改的前置步驟)
    function findById(id){
        axiosapi.get(`/latestNews/${id}`).then(function (response) {
            //console.log("response", response);
            if(response.data.list.length!=0) {
                findData.value = response.data.list[0];   //抓陣列第一筆資料然後裝進findUpdateData
                //console.log("在findById中，現在找到的findUpdateData為",JSON.stringify(findUpdateData.value))
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

</script>
    
<style scoped>
    .content {
        white-space: pre-line;
        text-align: left;
    }
    .front{
        /* background-color:  whitesmoke; */
        min-height: 100vh;
        background-color:  #e8f7d0;
        background-size: cover;

    }
</style>