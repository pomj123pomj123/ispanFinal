<template>

    <div ref="exampleModalRef" class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h1 class="modal-title fs-5" id="exampleModalLabel" v-show="!isShowButtonInsert">修改房型內容</h1>
                    <h1 class="modal-title fs-5" id="exampleModalLabel" v-show="isShowButtonInsert">新增房型</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <table>
                        
                        <tr>
                            <td>飯店名稱 : </td>
                            <td><input type="text" name="hotelName" :value="hotelName"
                                        @input="emits('update:hotelName', $event.target.value)" 
                                        style="margin-left: 5px;"></td>
                        </tr>
                        <tr>
                            <td>房型名稱 : </td>
                            <td><input type="text" name="roomName" :value="roomName"
                                        @input="emits('update:roomName', $event.target.value)" 
                                        style="margin-left: 5px;"></td>
                        </tr>

                        <tr>
                            <td>房型標題 : </td>
                            <td><input type="text" name="featureTittle" :value="featureTittle"
                                        @input="emits('update:featureTittle', $event.target.value)" 
                                        style="margin-left: 5px;"></td>
                        </tr>

                        <tr>
                            <td>房型標題內文 : </td>
                            <td><input type="text" name="featureTittleContent" :value="featureTittleContent"
                                        @input="emits('update:featureTittleContent', $event.target.value)" 
                                        style="margin-left: 5px;"></td>
                        </tr>

                        <tr>
                            <td>房型數量 : </td>
                            <td><input type="text" name="roomAmount" :value="roomAmount"
                                        @input="emits('update:roomAmount', $event.target.value)" 
                                        style="margin-left: 5px;"></td>
                        </tr>
                        <tr>
                            <td>床數 : </td>
                            <td><input type="text" name="bedNumber" :value="bedNumber"
                                        @input="emits('update:bedNumber', $event.target.value)"
                                        style="margin-left: 5px;"></td>
                        </tr>
                        <tr>
                            <td>床類型 : </td>
                            <td><input type="text" name="bedType" :value="bedType"
                                        @input="emits('update:bedType', $event.target.value)"
                                        style="margin-left: 5px;"></td>
                        </tr>
                        <tr>
                            <td>會員價格 : </td>
                            <td><input type="text" name="memberPrice" :value="memberPrice"
                                        @input="emits('update:memberPrice', $event.target.value)"
                                        style="margin-left: 5px;"></td>
                        </tr>
                        <tr>
                            <td>非會員價格 : </td>
                            <td><input type="text" name="flexiblePrice" :value="flexiblePrice"
                                        @input="emits('update:flexiblePrice', $event.target.value)"
                                        style="margin-left: 5px;"></td>
                        </tr>
                        <tr>
                            <td>寵物入住 : </td>
                            <td><input type="text" name="pet" :value="pet"
                                        @input="emits('update:pet', $event.target.value)"
                                        style="margin-left: 5px;"></td>
                        </tr>
                        <tr>
                            <td>加床 : </td>
                            <td><input type="text" name="allowAddBed" :value="allowAddBed"
                                        @input="emits('update:allowAddBed', $event.target.value)"
                                        style="margin-left: 5px;"></td>
                        </tr>
                        <tr>
                            <td>無障礙 : </td>
                            <td><input type="text" name="accessibleRoom" :value="accessibleRoom"
                                        @input="emits('update:accessibleRoom', $event.target.value)"
                                        style="margin-left: 5px;"></td>
                        </tr>
                        <tr>
                            <td>最大入住人數 : </td>
                            <td><input type="text" name="peopleMaxAmount" :value="peopleMaxAmount"
                                        @input="emits('update:peopleMaxAmount', $event.target.value)"
                                        style="margin-left: 5px;"></td>
                        </tr>
                        
                        <tr>
                            <td>最後修改人員 : </td>
                            <td><input type="text" name="lastModifiedEmp" :value="lastModifiedEmp"
                                        @input="emits('update:lastModifiedEmp', $event.target.value)"
                                        style="margin-left: 5px;"></td>
                        </tr>

                        <tr>
                            <td>修改內容 : </td>
                            <td><input type="text" name="lastModifiedText" :value="lastModifiedText"
                                        @input="emits('update:lastModifiedText', $event.target.value)"
                                        style="margin-left: 5px;"></td>
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
        ["roomName", "featureTittle", "featureTittleContent", "roomAmount", "bedNumber", "bedType", "memberPrice", "flexiblePrice", "pet", 
        "allowAddBed", "accessibleRoom", "peopleMaxAmount", "lastModifiedEmp", "lastModifiedText", "hotelName","isShowButtonInsert"]);
    const emits = defineEmits(["update:roomName", "update:featureTittle", "update:featureTittleContent", "update:roomAmount", "update:bedNumber",    
        "update:bedType","update:memberPrice", "update:flexiblePrice", "update:pet", "update:allowAddBed",
"update:accessibleRoom", "update:peopleMaxAmount", "update:lastModifiedEmp", "update:lastModifiedText", "update:hotelName", "insert", "update"]);

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

</script>
    
<style>
    
</style>