<template>
    <span>
        <span v-if="total<=0">查無資料</span>
        <span v-else>查到{{ total }}筆資料</span>，每頁顯示
            <select :value="modelValue" @change="dochange">
                <option v-for="row in choices" :key="row" :value="row">{{ row }}</option>
            </select>筆</span>
</template>
    
<script setup>

    const props = defineProps(["modelValue", "choices", "total"]); //modelValue代表現在選到的值，choices:屬性中定義的陣列，total來自response.data.count
    const emits = defineEmits(["update:modelValue", "change"]);
    function dochange(event) {
        emits('update:modelValue', event.target.value);
        emits("change",1);//傳參數1給外面綁定的showAll(1)
    }
//update:modelValue 事件用於更新下拉選單的值，change 事件用於通知父組件下拉選單的值已經變更。
//當下拉選單的值發生變更時，此函數會觸發update:modelValue和change事件，分別更新下拉選單的值並通知父組件。

</script>
    
<style>
    
</style>