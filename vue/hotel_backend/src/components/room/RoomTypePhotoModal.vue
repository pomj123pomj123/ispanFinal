<template>

    <div ref="exampleModalRef" class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h1 class="modal-title fs-5" id="exampleModalLabel" v-show="isShowButtonRoomTypePhotoInsert">新增房型圖片</h1>
                    <h1 class="modal-title fs-5" id="exampleModalLabel" v-show="!isShowButtonRoomTypePhotoInsert">修改房型圖片</h1>
                    <div style="margin-left: 20px; border-radius: 5px; border: 1px solid gainsboro; padding: 5px; cursor: pointer;">
                        <span @click="fastinput">demo</span>
                    </div>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <form id="form" enctype="multipart/form-data">
                        <tr>
                            <td>圖片名稱 : </td>
                            <td><input type="text" name="photoname" :value="photoname"
                                        @input="emits('update:photoname', $event.target.value)" id="photoname"></td>
                        </tr>
                        <tr>
                            <td>上傳檔案 : </td>
                            <td><input type="file" name="photoFile" @change="emits('update:photoFile', $event.target.files[0])" ></td>
                        </tr>
                        <tr>
                            <td>圖片敘述 : </td>
                            <td><input type="text" name="photoDescription" :value="photoDescription"
                                        @input="emits('update:photoDescription', $event.target.value)" id="photoDescription"></td>
                        </tr>
                        
                            <!-- <td>房型名稱 : </td>
                            <td><input type="text" name="roomTypeName" :value="roomTypeName"
                                        @input="emits('update:roomTypeName', $event.target.value)"></td> -->
                        
                        <tr>
                            <td>房型名稱 : </td>
                            <select :value="modelValue" @change="dochange" class="selectadjust">
                                <option v-for="roomtype in notPageFindAll" :key="roomtype.rtId" :value="roomtype.roomName">{{ roomtype.roomName }}</option>
                            </select>
                        </tr>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-primary"
                            v-show="isShowButtonRoomTypePhotoInsert" @click="emits('insert')">新增</button>
                    <button type="button" class="btn btn-primary"
                            v-show="!isShowButtonRoomTypePhotoInsert" @click="emits('update')">修改</button>
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                </div>
            </div>
        </div>
    </div>

</template>
    
<script setup>
    const props = defineProps(["photoname", "photoDescription", "roomTypeName", "isShowButtonRoomTypePhotoInsert", "notPageFindAll", "modelValue"]);
    const emits = defineEmits(["update:photoname", "update:photoDescription",
                        "update:roomTypeName","update:photoFile", "update:modelValue", "insert", "update"]);

    import { ref, onMounted } from "vue";
    import bootstrap from 'bootstrap/dist/js/bootstrap.bundle.min.js'

    const exampleModalRef = ref(null);
    const exampleModalObj = ref(null);
    onMounted(function() {
        exampleModalObj.value = new bootstrap.Modal(exampleModalRef.value);
    });

    function showModal() {
        exampleModalObj.value.show();
        
    }
    function hideModal() {
        exampleModalObj.value.hide();
    }

    function dochange(event) {
        emits('update:modelValue', event.target.value);
        
    }


    
    
    let file = null;

    //測試: 用 file 來測試選取要上傳的檔案後觸發紀錄要上傳的檔案, 類型是 file 
    function handleFileChange(event) {
    file = event.target.files[0];
    console.log(file);
    }

    
    //在 defineExpose 中加上 file 讓父元件能透過 <RoomTypePhotoModal> 設好的 ref 屬性變數值抓到file變數
    defineExpose({
        showModal, hideModal
    });
    
    function fastinput(){

    let hotelName = document.getElementById("photoname");
    hotelName.value = "測試用房型";
    hotelName.dispatchEvent(new Event('input'));

    let roomName = document.getElementById("photoDescription");
    roomName.value = "測試用房型照片1";
    roomName.dispatchEvent(new Event('input'));

    



    }

</script>
    
<style>
    
</style>