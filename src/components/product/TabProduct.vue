<script lang="ts" setup>

import { markRaw, ref } from "vue";
import ProductForm from "./ProductForm.vue";
import { useI18n } from 'vue-i18n';
const { t } = useI18n();

type Tab = {
  title: string;
  name: string;
  component: any;
  props?: Record<string, any>;
}

let tabIndex = 2;
const editableTabsValue = ref("1");

const addTabForm = (tabTitle: string, component: any = null , props: Record<string, any> = {}) => {
  const newTabName = `${++tabIndex}`;
  editableTabs.value.push({
    title: tabTitle,
    name: newTabName,
    component,
    props
  });
  editableTabsValue.value = newTabName;
};

const editableTabs = ref<Tab[]>([
  {
    title: "manageProduct",
    name: "1",
    component: markRaw(ProductForm),
    props: {
      addTabForm: addTabForm,
    },
  },
]);

const removeTab = (targetName: string) => {
  const tabs = editableTabs.value;
  let activeName = editableTabsValue.value;
  if (activeName === targetName) {
    tabs.forEach((tab, index) => {
      if (tab.name === targetName) {
        const nextTab = tabs[index + 1] || tabs[index - 1];
        if (nextTab) {
          activeName = nextTab.name;
        }
      }
    });
  }

  editableTabsValue.value = activeName;
  editableTabs.value = tabs.filter((tab) => tab.name !== targetName);
};

const resetTab = () => {
  editableTabsValue.value = '1'; // Giá trị tab mặc định
};
</script>

<template>
  <el-tabs
    v-model="editableTabsValue"
    type="card"
    class="demo-tabs"
    closable
    @tab-remove="removeTab"
  >
    <el-tab-pane
      v-for="item in editableTabs"
      :key="item.name"
      :label="t(`tabs.product.${item.title}`)"
       :name="item.name"
    >
      <component @reset-tab="resetTab" :is="item.component" v-bind="item.props" />
    </el-tab-pane>
  </el-tabs>
</template>

<style scoped>
.demo-tabs > .el-tabs__content {
  padding: 32px;
  color: #6b778c;
  font-size: 32px;
  font-weight: 600;
}
</style>