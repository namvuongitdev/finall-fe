<script lang="ts" setup>
import Language from './components/i18n/Language.vue';
import Menu from './layout/Menu.vue';
import eventBus from "@/eventbus/eventBus";
import {onMounted , onBeforeUnmount , computed , ref} from 'vue'
import en from "element-plus/es/locale/lang/en";
import vi from "element-plus/es/locale/lang/vi";


const currentLanguage = ref(localStorage.getItem("language") || "en");

const updateLanguage = (newLang: string) => {
  currentLanguage.value = newLang;
};

onMounted(() => {
  eventBus.on("languageChanged", updateLanguage);
});

onBeforeUnmount(() => {
  eventBus.off("languageChanged", updateLanguage);
});

const locale = computed(() => {
  return currentLanguage.value === "vi" ? vi : en;
});

</script>

<template>
  <el-config-provider :locale="locale">
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
  </el-config-provider>

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
