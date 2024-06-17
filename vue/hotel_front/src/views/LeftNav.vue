<template>

<div class="bg-light border-right" id="sidebar-wrapper">
    <div class="sidebar-heading">芳山旅館集團整合系統</div><br>
    <div class="list-group list-group-flush">
        <div>目前登入者：emp0001 <br>陳小明 (櫃台人員)</div>
      <a href="#" class="list-group-item list-group-item-action bg-light">一般設定</a>
      <a href="#" class="list-group-item list-group-item-action bg-light">房型管理</a>
      <a href="#" class="list-group-item list-group-item-action bg-light">訂單管理</a>
      <RouterLink aria-current="page" to="/discount" class="list-group-item list-group-item-action bg-light">優惠管理</RouterLink>
      <RouterLink aria-current="page" to="/news"class="list-group-item list-group-item-action bg-light">公告管理</RouterLink>
      <a href="#" class="list-group-item list-group-item-action bg-light">顧客及會員管理</a>
      <a href="#" class="list-group-item list-group-item-action bg-light">員工管理</a>
      <a href="#" class="list-group-item list-group-item-action bg-light">餐廳訂位管理</a>

    </div>
  </div>
</template>
    
<script setup lang='ts'>
    
</script>
    
<style>
    #sidebar-wrapper {
  width: 250px;
  height: 100vh;
  position: fixed;
  z-index: 1;
  top: 0;
  left: 0;
  overflow-y: auto;
}
</style>