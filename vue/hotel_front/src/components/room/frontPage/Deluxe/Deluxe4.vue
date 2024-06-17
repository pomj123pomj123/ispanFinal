<template>
    <!-- https://ithelp.ithome.com.tw/articles/10205421 -->
    <div style="margin: 20px auto ; border-bottom: 2px solid rgb(154, 59, 59); text-align:center; width: 200px; position: relative;">
        <span style="font-size: 40px; text-align: justify; color: white">房型介紹</span>
    </div>

    

    <div class="container" style="display: flex; margin: auto; padding: 5px;">
        <div class="row" style="justify-content: flex-start ">
            <div class="col-2 rootype-navlink-div"><a href="#" class="rootype-navlink-div-a" @click.prevent="navigateTo('/superiorintro1/1')">豪華客房單人房</a></div>
            <div class="col-2 rootype-navlink-div" >
                <a href="#" class="rootype-navlink-div-a" @click.prevent="navigateTo('/superiorintro2/2')" >豪華客房兩人房</a>
            </div>
            <div class="col-2 rootype-navlink-div">
                <a href="#" class="rootype-navlink-div-a" @click.prevent="navigateTo('/superiorintro4/3')" >豪華客房四人房
                </a>
            </div>
            <div class="col-2 rootype-navlink-div">
                <a href="#" class="rootype-navlink-div-a"  @click.prevent="navigateTo('/deluxe1/4')" >尊榮客房單人房</a>
            </div>
            <div class="col-2 rootype-navlink-div" ><a href="#" class="rootype-navlink-div-a" @click.prevent="navigateTo('/deluxe2/5')" >尊榮客房兩人房</a></div>
            <div class="col-2 rootype-navlink-div" ><a href="#" class="rootype-navlink-div-a" >尊榮客房四人房</a></div>
            <div class="col-2 rootype-navlink-div" ><a href="#" class="rootype-navlink-div-a" @click.prevent="navigateTo('/deluxeview1/7')" >景觀尊榮客房單人房</a></div>
            <div class="col-2 rootype-navlink-div" ><a href="#" class="rootype-navlink-div-a" @click.prevent="navigateTo('/deluxeview2/8')" >景觀尊榮客房兩人房</a></div>
            <div class="col-2 rootype-navlink-div" ><a href="#" class="rootype-navlink-div-a" @click.prevent="navigateTo('/deluxeview4/9')" >景觀尊榮客房四人房</a></div>
            <div class="col-2 rootype-navlink-div" ><a href="#" class="rootype-navlink-div-a" @click.prevent="navigateTo('/granddeluxefamily4/10')" >特選尊榮家庭客房四人房</a></div>
            <div class="col-2 rootype-navlink-div" ><a href="#" class="rootype-navlink-div-a"  @click.prevent="navigateTo('/premier1/11')" >超豪華客房單人房</a></div>
            <div class="col-2 rootype-navlink-div" ><a href="#" class="rootype-navlink-div-a"  @click.prevent="navigateTo('/premier2/12')" >超豪華客房兩人房</a></div>
            <div class="col-2 rootype-navlink-div" ><a href="#" class="rootype-navlink-div-a"  @click.prevent="navigateTo('/premier4/13')" >超豪華客房四人房</a></div>
            <div class="col-2 rootype-navlink-div" ><a href="#" class="rootype-navlink-div-a" @click.prevent="navigateTo('/horizonsuperior1/14')" >豪華閣豪華客房單人房</a></div>
            <div class="col-2 rootype-navlink-div" style="text-align: center;margin-bottom: 5px; margin-top: 10px;"><a href="#" class="rootype-navlink-div-a" @click.prevent="navigateTo('/horizonsuperior2/15')" >豪華閣豪華客房兩人房</a></div>
            <div class="col-2 rootype-navlink-div" ><a href="#" class="rootype-navlink-div-a" @click.prevent="navigateTo('/horizonsuperior4/16')" >豪華閣豪華客房四人房</a></div>
            <div class="col-2 rootype-navlink-div" ><a href="#" class="rootype-navlink-div-a" @click.prevent="navigateTo('/horizondeluxe1/17')" >豪華閣尊榮客房單人房</a></div>
            <div class="col-2 rootype-navlink-div" ><a href="#" class="rootype-navlink-div-a" @click.prevent="navigateTo('/horizondeluxe2/18')" >豪華閣尊榮客房兩人房</a></div>
            <div class="col-2 rootype-navlink-div" ><a href="#" class="rootype-navlink-div-a" @click.prevent="navigateTo('/horizondeluxe4/19')" >豪華閣尊榮客房四人房</a></div>
            <div class="col-2 rootype-navlink-div" ><a href="#" class="rootype-navlink-div-a" @click.prevent="navigateTo('/premierView1/20')" >景觀超豪華客房單人房</a></div>
            <div class="col-2 rootype-navlink-div" ><a href="#" class="rootype-navlink-div-a" @click.prevent="navigateTo('/premierView2/21')" >景觀超豪華客房兩人房</a></div>
            <div class="col-2 rootype-navlink-div" ><a href="#" class="rootype-navlink-div-a" @click.prevent="navigateTo('/premierView4/22')" >景觀超豪華客房四人房</a></div>
            <div class="col-2 rootype-navlink-div" ><a href="#" class="rootype-navlink-div-a" @click.prevent="navigateTo('/specialtysuite1/23')" >特級套房單人房</a></div>
            <div class="col-2 rootype-navlink-div" ><a href="#" class="rootype-navlink-div-a" @click.prevent="navigateTo('/specialtysuite2/24')" >特級套房兩人房</a></div>
            <div class="col-2 rootype-navlink-div" ><a href="#" class="rootype-navlink-div-a" @click.prevent="navigateTo('/specialtysuite4/25')" >特級套房四人房</a></div>
            <div class="col-2 rootype-navlink-div" ><a href="#" class="rootype-navlink-div-a" @click.prevent="navigateTo('/plazasuite2/26')" >雅仕套房兩人房</a></div>
        </div>
        
        
        
        
    </div>
    <!-- https://www.youtube.com/watch?v=q4RgxiDM6v0 -->
    <div class="container" ref="container" style="margin-top: 20px; margin-bottom: 30px;">

        <div style="margin-top: 20px; margin-bottom: 20px; border-left: 10px solid rgb(154, 59, 59); display: flex; align-items:center; ">
            
            <span style="padding-left: 20px; font-size: 24px; width: 500px; color: white;">{{ roomTypeName }}</span>
            
            

        </div>

        <!-- 輪播圖部分開始 -->
        <div class="containerImg">
            <div class="button-box">
                <i class="fa-solid fa-circle-chevron-left clickButton pre" @click="prevSlide"></i>
                <i class="fa-solid fa-circle-chevron-right clickButton next" @click="nextSlide"></i>
            </div>
            <a v-for="(img, index) in images" :key="index" href="#" target="_blank" @click.prevent style="cursor: default;">
                <img :src="img" alt="" :class="['backgroundImg', { show: currentSlide === index, nshow: currentSlide !== index }]">
            </a>
        </div>
        <div  class="listcontainer-outer">
            <div class="listcontainer">
                <ul class="liflex">
                    <li v-for="(img, index) in images" :key="index" @mouseover="gotoSlide(index)" :class="{ liflexitem: currentSlide === index }"></li>
                </ul>
            </div>
        </div>
        <!-- 輪播圖部分結束 -->

    </div>

    <div class="container" style="width: 1200px; border-bottom: 2px solid gray; opacity: 0.3;"></div>

    <div class="container" style="margin-top: 0; margin-bottom: 10px; background-color: #f2f2f2;">
        
        <div style="position: absolute; width: 435px; right: 20px; padding: 10px; top: 80px; text-align: justify; z-index: 2;" class="glass">

            <span style="display: inline-block; color: rgb(154, 59, 59); font-size: 22px;">
                <i class="fa-solid fa-exclamation"></i>
                注意事項 :
            </span>
            <span>
                <br>
                平日：週日 ～ 週四。
                <br>
                假日：
                週五 ～ 週六，國定假日、特殊節日、連續假期及前夕。
            </span>
            <span>
                預付訂金僅保留房間至晚間6時，若較晚抵達請於訂單備註您的抵達時間。
            </span>

        </div>
        
    </div>
    
    <div class="container" style="background-color: #f2f2f2; padding: 20px; margin-bottom: 100px;">
        <div style="position: absolute; right: 0;">
            <div style="display: flex; align-items:center; ">
                
                <span style="color: rgb(192, 130, 97); font-size: 22px; right: 20px; width: 400px; text-align: right;">點選「訂房」可享有官網優惠價</span>
                <div style="width: 120px;  background-color: rgb(154, 59, 59); outline:1px solid; text-align:center; height: 30px; margin-left: 10px; margin-right: 20px">
                    <a href="#" style="text-decoration: none; font-size: 20px; line-height: 30px; color: white;" @click.prevent="navigateTo('/bookingPages/rooms')">立即訂房</a>
                    
                </div>

            </div>
        </div>
        <div style="background-color: #f2f2f2;">
            <span style="font-size: 28px; display: block; margin-bottom: 5px; color: rgb(192, 130, 97);">{{ featureTittle }}</span>
            <span style="font-size: 22px; display: block; margin-bottom: 20px; width: 600px; text-align: justify">{{ featureTittleContent }}</span>
            <span style="font-size: 20px; display: block; margin-bottom: 5px; color: rgb(192, 130, 97);">特色</span>
            <span style="font-size: 16px; display: block; margin-bottom: 5px; margin-top: 5px;">
                <i class="fa-solid fa-bath"></i>
                大理石打造的浴室配備12吋平板電視機和獨立淋浴間及浴缸。
            </span>
            <span style="font-size: 16px; display: block; margin-bottom: 5px; margin-top: 5px;">
                <i class="fa-solid fa-maximize"></i>
                房間面積為 36 平方米/383 平方英尺。
            </span>
        </div>

        <div style="margin-top: 20px; position: relative;  ">
            <span style="font-size: 20px; display: block; margin-bottom: 5px; color: rgb(192, 130, 97);">設施</span>
            <i class="fa-solid fa-minus"></i>
            <div style=" display: inline-block; margin-left: 5px;">
                <i class="fa-solid fa-display"></i>
            </div>
            <span style="font-size: 16px; display: inline-block; margin-bottom: 10px; margin-left: 5px">媒體及娛樂</span>
        </div>
        <div >
            <span style="font-size: 16px; display: block; margin-bottom: 5px; margin-left: 30px">免費 Wi-Fi 上網</span>
            <span style="font-size: 16px; display: block; margin-bottom: 5px; margin-left: 30px">液晶電視</span>
            <span style="font-size: 16px; display: block; margin-bottom: 5px; margin-left: 30px">浴室附設電視機</span>
        </div>

        <div style="margin-top: 20px;">
            <i class="fa-solid fa-minus"></i>
            <div style=" display: inline-block; margin-left: 5px;">
                <i class="fa-solid fa-pen-clip"></i>
            </div>
            <span style="font-size: 16px; display: inline-block; margin-bottom: 10px; margin-left: 5px">辦公設備及文具</span>
        </div>
        <div >
            <span style="font-size: 16px; display: block; margin-bottom: 5px; margin-left: 30px">大型行政辦公桌</span>
            <span style="font-size: 16px; display: block; margin-bottom: 5px; margin-left: 30px">雙線國際直撥長途電話</span>
            <span style="font-size: 16px; display: block; margin-bottom: 5px; margin-left: 30px">語音留言信箱</span>
            <span style="font-size: 16px; display: block; margin-bottom: 5px; margin-left: 30px">電子保險箱</span>
            <span style="font-size: 16px; display: block; margin-bottom: 5px; margin-left: 30px">床側照明控制</span>
        </div>

        <div style="margin-top: 20px;">
            <i class="fa-solid fa-minus"></i>
            <div style=" display: inline-block; margin-left: 5px;">
                <i class="fa-solid fa-shower"></i>
            </div>
            <span style="font-size: 16px; display: inline-block; margin-bottom: 10px; margin-left: 5px">洗浴及個人護理</span>
        </div>
        <div >
            <span style="font-size: 16px; display: block; margin-bottom: 5px; margin-left: 30px">多款睡枕提供選擇</span>
            <span style="font-size: 16px; display: block; margin-bottom: 5px; margin-left: 30px">獨立淋浴間和浴缸</span>
            <span style="font-size: 16px; display: block; margin-bottom: 5px; margin-left: 30px">精選洗浴用品</span>
        </div>

        <div style="margin-top: 20px;">
            <i class="fa-solid fa-minus"></i>
            <div style=" display: inline-block; margin-left: 5px;">
                <i class="fa-solid fa-bed"></i>
            </div>
            <span style="font-size: 16px; display: inline-block; margin-bottom: 10px; margin-left: 5px">床型</span>
        </div>
        <div >
            <span style="font-size: 16px; display: block; margin-bottom: 5px; margin-left: 30px">一大床</span>
            <span style="font-size: 16px; display: block; margin-bottom: 5px; margin-left: 30px">**本房型恕不提供加床服務**</span>
        </div>

        <div style="margin-top: 20px;">
            <i class="fa-solid fa-minus"></i>
            <div style=" display: inline-block; margin-left: 5px;">
                <i class="fa-solid fa-martini-glass-citrus"></i>
            </div>
            <span style="font-size: 16px; display: inline-block; margin-bottom: 10px; margin-left: 5px">飲品小食</span>
        </div>
        <div >
            <span style="font-size: 16px; display: block; margin-bottom: 5px; margin-left: 30px">時令水果</span>
            <span style="font-size: 16px; display: block; margin-bottom: 5px; margin-left: 30px">咖啡&茶沖泡設備</span>
            <span style="font-size: 16px; display: block; margin-bottom: 5px; margin-left: 30px">迷你吧</span>
        </div>

    </div>

</template>
    
<script setup>
const imgPath = import.meta.env.VITE_BACKEND_URL;
import { ref, onMounted, onUnmounted } from 'vue';
import axiosapi from "@/plugins/axios.js";
import { useRouter } from 'vue-router';




onMounted(function() {

    startAutoPlay();
    getRoomTypeData()
    getRoomPhotoId();
    container.value.addEventListener('mouseover', stopAutoPlay);
    container.value.addEventListener('mouseout', startAutoPlay);
    
});

onUnmounted(function() {
    if (container.value) {
        container.value.removeEventListener('mouseover', stopAutoPlay);
        container.value.removeEventListener('mouseout', startAutoPlay);
      }
    stopAutoPlay(); // 停止自动播放
});

const container = ref(null);
const images = ref([]);
// 測試用 const fromBackendPhotoId = ref([]);

function getRoomPhotoId(){

    axiosapi.get(`/roomphoto/deluxe4`).then(function(response){
        console.log(response.data);
        
        // 遍历 JSON 对象的属性，并将属性值存储在 images 变量中
        for (const key in response.data) {
            
            if (Object.hasOwnProperty.call(response.data, key)) {
                const value = response.data[key];
                console.log(value);
                let string = `${imgPath}/photos/findbyid?rpId=${value}`;
                images.value.push(string);
            }

        }

        // 先用 fromBackendPhotoId 測試 console.log(fromBackendPhotoId.value);
        
    })

}
// 獲取房型資訊

let HotelName = ref({});  
let HotelAddress = ref({});
let HotelTel = ref({});
let HotelFax = ref({});
let HotelEmail = ref({});
let roomTypeName = ref({});
let featureTittle = ref({});
let featureTittleContent = ref({});


function getRoomTypeData(){

axiosapi.get(`/roomtype/deluxe4`).then(function(response){
    console.log("房型資訊", response.data);

    console.log("HotelName", response.data.list[0].HotelName);
    HotelName.value = response.data.list[0].HotelName;
    console.log("HotelAddress", response.data.list[0].HotelAddress);
    HotelAddress.value = response.data.list[0].HotelAddress;
    console.log("HotelTel", response.data.list[0].HotelTel);
    HotelTel.value = response.data.list[0].HotelTel;
    console.log("HotelFax", response.data.list[0].HotelFax);
    HotelFax.value = response.data.list[0].HotelFax;
    console.log("HotelEmail", response.data.list[0].HotelEmail);
    HotelEmail.value = response.data.list[0].HotelEmail;


    console.log("roomTypeName",response.data.list[0].roomName);
    roomTypeName.value = response.data.list[0].roomName;
    console.log("featureTittle",response.data.list[0].featureTittle);
    featureTittle.value = response.data.list[0].featureTittle;
    console.log("featureTittleContent",response.data.list[0].featureTittleContent);
    featureTittleContent.value = response.data.list[0].featureTittleContent;


    


    
    
})

}

const currentSlide = ref(0);
let auto1;

function auto() {
    currentSlide.value = (currentSlide.value + 1) % images.value.length;
}

function startAutoPlay() {
    auto1 = setInterval(auto, 2000);
}

function stopAutoPlay() {
    clearInterval(auto1);
}

function nextSlide() {
    stopAutoPlay();
    auto();
}

function prevSlide() {
    stopAutoPlay();
    currentSlide.value = (currentSlide.value - 1 + images.value.length) % images.value.length;
}

function gotoSlide(index) {
    stopAutoPlay();
    currentSlide.value = index;
}

const router = useRouter();
function navigateTo(path) {
    router.push(path);
}

    // // 撥放 function
    // let i = 0;
    //     let img = document.querySelectorAll("img");
    //     function auto() {
    //         let li = document.querySelectorAll("li");
            
    //         if (i == img.length) {
    //             i = 0;
    //             img[img.length - 1].classList.remove("show");
    //             img[i].classList.toggle("show");
    //             li[li.length - 1].classList.remove("liflexitem");
    //             li[i].classList.toggle("liflexitem");


    //         }else if (i>1){
    //             img[i-1].classList.remove("show");
    //             img[i].classList.add("show");
    //             li[i - 1].classList.remove("liflexitem");
    //             li[i].classList.add("liflexitem");
    //         }
    //         else if (i > 0){
    //             img[i-1].classList.remove("show");
    //             img[i-1].classList.add("nshow");
    //             img[i].classList.add("show");

    //             li[i - 1].classList.remove("liflexitem");
    //             li[i].classList.add("liflexitem");

    //         } 
    //         console.log(i);
    //         i++
    //     }
    //     // 將撥放 function 放入定時器中達到類似 for 效果變成自動撥放, 計時器名稱不能跟函數名稱一樣
    //     let auto1 = setInterval(function(){
    //         auto();
    //     }, 2000);
    //     // 滑鼠移入停止自動撥放
    //     let container = document.querySelector(".container");
    //     container.addEventListener("mouseover", function(){
    //         clearInterval(auto1);
    //     })
    //     // 滑鼠移出開啟自動撥放
    //     container.addEventListener("mouseout", function(){
    //         // 重新賦值 auto1 變數計時器功能, 因為 i 會記錄著之前自動撥放時 i 加到多少, 所以重新添加計時器後順序也不會亂掉, 計時器名稱不能跟函數名稱一樣
    //         auto1 = setInterval(function(){
    //             auto();
    //         },2000)
    //     })
    //     // 點擊next按鈕變成下一張
    //     let nextbtn = document.querySelector(".next");
    //     nextbtn.addEventListener("mouseover", function(){
    //         clearInterval(auto1);
    //     })
    //     nextbtn.addEventListener("click", function(){
    //         auto();
    //     })
    //     // 點擊pre按鈕變成前一張
    //     let prebtn = document.querySelector(".pre");
    //     prebtn.addEventListener("mouseover", function(){
    //         clearInterval(auto1);
    //     })
    //     prebtn.addEventListener("click", function(){
    //         let li = document.querySelectorAll("li");
    //         if (i == img.length) {
    //             i--;
    //             img[i].classList.remove("show");
    //             li[i].classList.remove("liflexitem");
    //             img[i-1].classList.add("show");
    //             li[i-1].classList.add("liflexitem");

    //         } else if(i > 0){
    //             // 先清除完當前樣式再讓 i - 1 調整倒退後的樣式
    //             img[i].classList.remove("show");
    //             li[i].classList.remove("liflexitem");
    //             i--;
    //             img[i].classList.add("show");
    //             li[i].classList.add("liflexitem");
    //         } else if(i <= 0){
    //             i = img.length;
    //             img[0].classList.remove("show");
    //             li[0].classList.remove("liflexitem");
    //             /* 
    //             倒退到最後一張點下去 i 是 -1, 所以要讓 img[i-1] 變成最後一個元素, 最後一個元素是 length - 1, 但是img[i-1]本身就會 -1 , 所以先設 i = img.length;
    //             */
    //             img[i-1].classList.add("show");
    //             li[i-1].classList.add("liflexitem");
    //             /*
    //             設定完 最後一個元素之後要讓 i 值 -1 讓 i 對應到索引號的最後一個
    //             */
    //             i--;
    //         } 
    //         console.log(i);
    //     })
        
    //     // 為所有li加上事件監聽並寫對應的函數
    //     let li = document.querySelectorAll("li");
    //     for(item of li) {
    //         item.addEventListener("mouseover", limouseover);
    //     }
    //     function limouseover(e){
    //         // 清除所有狀態
    //         for(item of li) {
    //             item.classList.remove("liflexitem");
    //         }
    //         img[0].classList.add("nshow");
    //         for(let i = 0; i < img.length; i++){
    //             img[i].classList.remove("show");
    //         }
    //         // 為觸發mousein的元素加上class
    //         e.target.classList.add("liflexitem");
    //         // 找到是哪個li項目並將數字擷取除來傳給img讓img顯示
    //         let num = e.target.id;
    //         console.log(num);
    //         let imgnum = num.substring(2);
    //         console.log(num.substring(2)); 
    //         img[imgnum].classList.add("show");
    //         console.log(typeof(imgnum)); 
    //         console.log(typeof(+imgnum)); 
    //         i = +imgnum;
    //         console.log(i);
    //     }
</script>
    
<style scoped>
    *{
            margin: 0;
            padding: 0;
        }

        .nshow{
            display: none;
        }

        .show{
            display: block;
        }


        /* https://ithelp.ithome.com.tw/articles/10253500 */
        .container{
            width: 1200px;
            margin: 20px auto 10px auto;
            
            border-radius: 10px;
            position: relative;
        }

        .containerImg{

            width: 100%;
            height: 730px;
            margin: auto;
            
            
        }

        .backgroundImg{
            /* https://clairechang.tw/2023/05/10/css/css-object-fit/ */
            
            background-size: cover;
            background-position: center;
            margin: auto;
            border-radius: 10px;

            width: 100%;
            height: 100%;
            
            object-fit: cover;
        }

        /* https://ithelp.ithome.com.tw/articles/10253500 */
        .clickButton {
            
            border-radius: 10px;
            /* https://www.webdesigns.com.tw/CSS-opacity.asp */
            font-size: 50px;
            text-align: center;
            color: #C7C8CC;
            top: 335px;
            /* https://blog.csdn.net/weixin_42464697/article/details/117729067 */
            user-select: none;
            
        }

        .button-box{
            position: flex;
            top: 340px;
            display: none;
        }

        .container:hover .button-box {
            display: inline;  
        }

        .next{
            position: absolute;
            right:15px;  
            opacity: 0.5;
        }
        
        .next:hover{
            cursor: pointer;
        }

        .pre{
            position: absolute;
            left:15px;
            opacity: 0.5;
        }

        .pre:hover{
            cursor: pointer;
        }

        .listcontainer{
            width: 500px;
            margin: 20px auto 20px auto;
        }

        /* https://ithelp.ithome.com.tw/articles/10267398 */
        .liflex{
            display: flex;
            list-style: none;
            flex-wrap: nowrap;
            flex-direction: row;
            justify-content: center;
            
        }

        li{
            width: 15px;
            height: 15px;
            background-color: #C7C8CC;
            border-radius: 50%;
            margin-right: 10px;
            opacity: 0.6;
            
            
        }

        .liflex li:hover{
            width: 100px;
            height: 15px;
            
            background-color: #C7C8CC;
            cursor: pointer;
            border-radius: 10px;
        }

        li.liflexitem{
            width: 100px;
            height: 15px;
            
            background-color: #C7C8CC;
            border-radius: 10px;
            
        }
        
        .listcontainer-outer {

            width: 500px; 
            margin: auto; 
            position: absolute; 
            top: 680px; 
            left: 0; 
            right:0

        }

        .glass {

            background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0));
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            border-radius: 20px;
            border: 1px solid rgba(255, 255, 255, 0.18);
            box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);

        }

        .rootype-navlink-div{
            
            text-align: center; 
            margin-bottom: 5px; 
            margin-top: 10px;

        }

        .rootype-navlink-div-a{

            color: #f2f2f2;
            text-decoration: none; 
            border: 1px solid #C7C8CC; 
            padding: 5px; 
            background-color: rgb(199, 200, 204, 0.3); 
            display: inline-block; 
            width: 190px; 
            border-radius: 5px;
            
        }

        .rootype-navlink-div-a:hover{

            background-color: #C7C8CC;
            color: black;
            

        }

        
        
</style>