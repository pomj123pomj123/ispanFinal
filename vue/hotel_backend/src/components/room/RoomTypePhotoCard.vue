<template>
    <div>
        <div class="card">
            
            <div style="height: 230px; padding: 0;">
                <!-- 找圖片其實就是根據請求路徑找到資料, findAll 會產生總共要遍歷出多少個 card, 在內部這裡再用 findbyid 的方式來找圖片 -->
                <img class="card-img-top" :src="`${forPhotoRequest}findbyid?rpId=${item.rpId}`" :alt="item.photoname">
            </div>
            
            <div class="card-body" style="width: 350px; padding: 0; margin: auto;">
                
                <ul class="list-group list-group-flush " style="text-align: justify; margin: auto; width: 350px; ">

                    <li class="list-group-item"><strong class="card-title" style="font-size: 26px;">{{ item.photoname }}</strong></li>
                    <li class="list-group-item"><span style="font-size: 18px;">圖片描述: {{ item.photoDescription }}</span></li> 
                    <li class="list-group-item"><span style="font-size: 18px;">圖片房型類型: {{ item.RoomtypeName }}</span></li>
                    <li class="list-group-item"><span style="font-size: 18px;">圖片上傳時間: {{ item.addedDate }}</span></li>

                </ul>
                
                <div class="row" >

                    <div class="text-start" style="position: absolute; bottom: 10px; left: 16px; padding: 0;">
                        <a href="#" class="btn btn-primary" @click="doclick1(item.rpId)" style="display: inline-block; margin-right: 160px; width: 100px;">開啟修改</a>
                        <a href="#" class="btn btn-primary" @click="doclick2(item.rpId)" style="width: 60px;">刪除</a>
                    </div>
                    
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import { ref } from 'vue';

    const props = defineProps(["item", "photospre"], item);
    const emits = defineEmits(["openUpdate", "delete"]);
    const imgSrc = ref(null);
    const forPhotoRequest = import.meta.env.VITE_ROOMPHOTOCBH_URL;
    

    function doclick1(rpId) {
        // 開啟修改被點擊時向父元件發送觸發 update 事件
        emits("openUpdate", "update", rpId);
    }
    function doclick2(rpId) {
        // 點擊刪除時向父元件發送觸發 delete 事件
        emits("delete", rpId);
    }


</script>
<style scoped>
    img {
        width: 100%;
        height: 100%
    }

    .card {
        height: 500px;
        width: 360px;
    }

</style>
