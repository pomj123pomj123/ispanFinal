<template>
    <span>
        <span v-if="total<=0">查無資料</span>
        <span v-else>總共{{ total }}筆資料，每頁顯示</span>
        
        <select :value="modelValue" @change="dochange" class="selectadjust">
            <option v-for="row in choices" :key="row" :value="row">{{ row }}</option>
        </select>

        <span>筆</span>
    </span>
</template>
    
<script setup>
    const props = defineProps(["modelValue", "choices", "total"]);
    const emits = defineEmits(["update:modelValue", "change"]);
    function dochange(event) {
        emits('update:modelValue', event.target.value);
        emits("change");
    }
</script>
    
<style scoped>
    .selectadjust{
        margin: 0 5px 0 5px;
    }
</style>