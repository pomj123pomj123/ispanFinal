<template>

    <div ref="exampleModalRef" class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h1 class="modal-title fs-5" id="exampleModalLabel" v-show="!isShowButtonInsert">修改房間內容</h1>
                    <h1 class="modal-title fs-5" id="exampleModalLabel" v-show="isShowButtonInsert">新增房間</h1>
                    <div style="margin-left: 20px; border-radius: 5px; border: 1px solid gainsboro; padding: 5px; cursor: pointer;">
                        <span @click="fastinput">demo</span>
                    </div>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <table>
                        <tr>
                            <td>房間號碼 : </td>
                            <td><input type="text" name="roomNumber" :value="roomNumber"
                                        @input="emits('update:roomNumber', $event.target.value)" 
                                        style="margin-left: 5px;" id="roomNumber"></td>
                        </tr>

                        <tr>
                            <td>房間樓層 : </td>
                            <td><input type="text" name="floor" :value="floor"
                                        @input="emits('update:floor', $event.target.value)" 
                                        style="margin-left: 5px;" id="floor"></td>
                        </tr>

                        <tr>
                            <td>房間狀態 : </td>
                            <td><input type="text" name="roomStatus" :value="roomStatus"
                                        @input="emits('update:roomStatus', $event.target.value)" 
                                        style="margin-left: 5px;" id="roomStatus"></td>
                        </tr>

                        <tr>
                            <td>房間房型 : </td>
                            <select :value="modelValue" name="modelValue" @change="emits('update:modelValue', $event.target.value)" class="selectadjust" >
                                <option v-for="roomtype in notPageFindAll" :key="roomtype.rtId" :value="roomtype.roomName">{{ roomtype.roomName }}</option>
                            </select>
                        </tr>

                        <tr style="display: none;">
                            <td >最後修改人員 : </td>
                            <td><input type="text" name="lastModifiedEmp" :value="lastModifiedEmp"
                                        @input="emits('update:lastModifiedEmp', $event.target.value)"
                                        style="margin-left: 5px;"></td>
                        </tr>

                        <tr>
                            <td>修改內容 : </td>
                            <td><input type="text" name="lastModifiedText" :value="lastModifiedText"
                                        @input="emits('update:lastModifiedText', $event.target.value)"
                                        style="margin-left: 5px;" id="lastModifiedText"></td>
                        </tr>

                    </table>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-primary"
                            v-show="isShowButtonInsert" @click="emits('insert')">新增</button>
                    <button type="button" class="btn btn-primary"
                            v-show="!isShowButtonInsert" @click="emits('update')">修改</button>
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                </div>
            </div>
        </div>
    </div>

</template>
    
<script setup>
    /*
    如果 defineProps 跟 defineEmits 跟上面指定的 emits('update:allowAddBed'....) 有差就會跳警告 (可能只是綁定數值的問題
    所以只是跳警告)
    Component emitted event "update:bedType" but it is neither declared in the emits option nor as an "onUpdate:bedType" prop.
    */
    /*
    課本 vue 部分 04/23 01:22:46
    - 元件的雙向資料綁定元件外部(RoomType)使用 v-model 指令綁定資料
    - 元件內部使用 defineProps() 接收資料、defineEmits() 發送資料改變事件
    */
    const props = defineProps(
        ["roomNumber", "floor", "roomStatus", "lastModifiedEmp", "lastModifiedText","isShowButtonInsert", "notPageFindAll", "modelValue"
        ]);
    const emits = defineEmits(["update:roomNumber", "update:floor", "update:roomStatus", "update:lastModifiedEmp", "update:lastModifiedText", "update:modelValue", "insert", "update"]);

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
    
    

    defineExpose({
        showModal, hideModal,
    });

    function fastinput(){

    let hotelName = document.getElementById("roomNumber");
    hotelName.value = "1401";
    hotelName.dispatchEvent(new Event('input'));

    let roomName = document.getElementById("floor");
    roomName.value = "14";
    roomName.dispatchEvent(new Event('input'));

    let featureTittle = document.getElementById("roomStatus");
    featureTittle.value = "禁止使用";
    featureTittle.dispatchEvent(new Event('input'));

    let featureTittleContent = document.getElementById("lastModifiedText");
    featureTittleContent.value = "為測試房型分配房間";
    featureTittleContent.dispatchEvent(new Event('input'));

    }
</script>
    
<style scoped>

    .selectadjust {

        position: absolute;
        left: 170px;
        top: 165px;


    }

</style>