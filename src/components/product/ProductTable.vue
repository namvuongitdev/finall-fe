<script lang="ts" setup>
import { Page } from "../../type/pageable";
import { ProductResponse } from "../../type/product";
import {
  defineProps,
  reactive,
  ref,
  defineEmits,
  computed,
  onMounted,
  onBeforeUnmount,
  watch,
} from "vue";
import { Plus, Delete, View } from "@element-plus/icons-vue";
import en from "element-plus/es/locale/lang/en"; 
import vi from "element-plus/es/locale/lang/vi";
import { inject } from "vue";
import { useI18n } from "vue-i18n";
import eventBus from "@/eventbus/eventBus";
import { URL_IMAGE } from "@/config/config";

const { t } = useI18n();
const size = ref<number>();
const pageNew = ref<number>();
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

const prop = defineProps<{
  items: Page<ProductResponse>;
}>();

const emit = defineEmits([
  "dataSendPage",
  "sendData",
  "sendDataToDelete",
  "sendDataToUpdate",
  "sendDataDetail",
]);

const handleCurrentChange = async (page: number) => {
  pageNew.value = page;
  emit("dataSendPage", {
    page: pageNew.value,
    size: size.value,
  });
};

const handleSizeChange = async (pageSize: number) => {
  size.value = pageSize;
  emit("dataSendPage", {
    page: pageNew.value,
    size: size.value,
  });
};

const sendDataToDelete = (id: number) => {
  emit("sendDataToDelete", id);
};

const sendDataToUpdate = (id: number) => {
  emit("sendDataToUpdate", id);
};

const sendDataDetail = (id: number) => {
  emit("sendDataDetail", id);
};
</script>

<template>
  <el-config-provider :locale="locale">
    <div class="table">
      <el-table :data="prop.items.content" max-height="500" border>
        <el-table-column fixed label="STT">
          <template #default="{ $index }">
            {{ ((pageNew ?? 1) - 1) * (size ?? 10) + $index + 1 }}
          </template>
        </el-table-column>
        <el-table-column
          prop="productCode"
          :label="t('table.productCode')"
          width="180"
        />
        <el-table-column
          prop="productName"
          :label="t('table.productName')"
          width="180"
        />
        <el-table-column prop="description" :label="t('table.description')" />
        <el-table-column prop="price" :label="t('table.price')" />
        <el-table-column prop="quantity" :label="t('table.quantity')" />
        <el-table-column prop="createAt" :label="t('table.createAt')" />
        <el-table-column prop="modifiedDate" :label="t('table.modifiedDate')" />
        <el-table-column prop="image" :label="t('table.image')">
          <template v-slot="{ row }">
            <img
              alt="Image"
              style="width: 80px; height: 50px"
              :src="URL_IMAGE + row.image"
            />
          </template>
        </el-table-column>
        <el-table-column prop="categorys" :label="t('table.category')" />
        <el-table-column prop="status" :label="t('table.status')">
          <template v-slot="{ row }">
            <el-tag effect="success">
              {{ row.status }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column
          fixed="right"
          :label="t('table.operations')"
          min-width="220"
        >
          <template v-slot="{ row }">
            <div style="display: flex; align-items: center">
              <el-icon @click="sendDataDetail(row.id)" class="icon">
                <View />
              </el-icon>
              <el-icon @click="sendDataToUpdate(row.id)" class="icon">
                <Edit />
              </el-icon>
              <el-icon @click="sendDataToDelete(row.id)" class="icon">
                <Delete />
              </el-icon>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div class="demo-pagination-block">
      <el-pagination
        :current-page="(prop.items.pageable?.pageNumber ?? 0) + 1"
        :page-size="prop.items.pageable?.pageSize"
        :page-sizes="[10, 20, 30, 40]"
        background
        layout="total, sizes, prev, pager, next, jumper , ->, goto"
        :total="prop.items.totalElements"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :show-total="t('pagination.total', { total: prop.items.totalElements })"
        :goto-text="t('pagination.goto')"
      />
    </div>
  </el-config-provider>
</template>


  <style scoped>
.demo-pagination-block {
  display: flex;
  justify-content: right;
  padding: 20px 5px 20px 5px;
}
.table {
  margin: 10px 10px 0 10px;
}

.icon {
  margin-left: 5px;
  font-size: 20px;
  /* Kích thước biểu tượng */
  cursor: pointer;
  /* Hiển thị con trỏ như clickable */
  color: #698dff;
  transition: color 0.3s, transform 0.3s;
  /* Hiệu ứng chuyển màu và phóng to */
}
.icon:hover {
  transform: scale(1.1);
  /* Phóng to khi hover */
}
</style>