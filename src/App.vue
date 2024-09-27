<script lang="ts" setup>
import Language from './components/i18n/Language.vue';
import Menu from './layout/Menu.vue';


</script>

<template>

  <div class="common-layout">
    <el-container>
      <el-header class="custom-header">
        <Language />
        
      </el-header>
      <el-container>
        <el-aside width="200px">
            <Menu />
        </el-aside>
        <el-main style="background-color: #fafafa;padding: 0;
">
          <router-view></router-view> 
        </el-main>
      </el-container>
    </el-container>
  </div>

</template>

<style scoped>
.custom-header {
  background-color:  white; /* Màu nền */
  color: white; /* Màu chữ */
  display: flex;
  justify-content: right; /* Căn giữa nội dung */
  align-items: center; /* Căn giữa theo chiều dọc */
  overflow: hidden;
}
</style>
