<template>
  <el-aside class="sidebar">
    <el-menu :default-active="activeMenu" class="sidebar-menu">
      <div class="logo">
        <span style="width: 100%; text-align: center; line-height: 36px">
          NODO
        </span>
      </div>
      <el-menu-item v-for="item in menuItems" :key="item.index" :index="item.index" @click="handleMenuClick(item.index, item.label)">
        <!-- Render icon using v-if for dynamic icons -->
        <el-icon>
          <component :is="item.iconComponent" />
        </el-icon>
        <span>{{ t(`${item.label}`)}}</span>
      </el-menu-item>
    </el-menu>

  </el-aside>
</template>

<script setup>
import { ref } from 'vue';
import { ElAside, ElMenu, ElMenuItem } from 'element-plus';
import {Box, DocumentCopy, HomeFilled, Setting, ShoppingCartFull, User} from "@element-plus/icons-vue/global";
import Router from "@/router";
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const activeMenu = ref('1');

const menuItems = [
  { index: '2', label: 'category', iconComponent: DocumentCopy },
  { index: '3', label: 'product',iconComponent: Box},
];


function handleMenuClick(index, label) {
  activeMenu.value = index;
  Router.push({name: label})
}

</script>

<style scoped>
.logo {
  text-align: center;
  padding: 10px;
  font-size: 20px;
  font-weight: bold;
  height: 56px;
}

.sidebar {
  background-color: #ffffff;
  border-right: 1px solid #ebeef5;
  height: 100vh; /* Chiều cao cố định bằng chiều cao của màn hình */
}

.sidebar-menu {
  height: 100%; /* Đảm bảo menu chiếm toàn bộ chiều cao của sidebar */
  border-right: 1px solid #ebeef5;
  background-color: #ffffff;
}

.el-menu-item {
  padding: 12px 20px;
  display: flex;
  align-items: center; /* Căn chỉnh icon và văn bản theo chiều dọc */
}

.el-menu-item i {
  font-size: 20px; /* Kích thước biểu tượng */
  margin-right: 16px; /* Khoảng cách giữa biểu tượng và văn bản */
  color: #409eff; /* Màu biểu tượng */
}

.el-menu-item:hover {
  background-color: #f5f7fa; /* Màu nền khi hover */
}

.el-menu-item.is-active {
  background-color: #409eff ; /* Màu nền khi mục menu đang hoạt động */
  color: #fff; /* Màu văn bản khi mục menu đang hoạt động */
}



.el-menu-item span {
  font-size: 16px; /* Kích thước văn bản */
}
</style>