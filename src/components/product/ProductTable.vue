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
import { inject } from "vue";
import { useI18n } from "vue-i18n";
import { URL_IMAGE } from "@/config/config";

const { t } = useI18n();
const size = ref<number>();
const pageNew = ref<number>();

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
          width="100"
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
        <el-table-column prop="image" :label="t('table.image')"  width="100">
          <template v-slot="{ row }">
            <img
              alt="Image"
              style="width: 80px; height: 50px"
              :src="row.image"
              v-if="row.image"
            />
          </template>
        </el-table-column>
        <el-table-column prop="categorys" :label="t('table.category')"  width="180"/>
        <el-table-column prop="status" :label="t('table.status')" width="120" >
          <template v-slot="{ row }">
            <el-tag effect="success">
              {{ t(`table.${row.status}`) }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column
          fixed="right"
          :label="t('table.operations')"
          width="180"
        >
          <template v-slot="{ row }">
            <div style="display: flex; align-items: center">
              <el-tooltip
                class="box-item"
                effect="dark"
                :content="t('tabs.detail')"
                placement="top"
              >
                <el-icon @click="sendDataDetail(row.id)" class="icon">
                  <View />
                </el-icon>
              </el-tooltip>
              
              <el-tooltip
                class="box-item"
                effect="dark"
                :content="t('tabs.update')"
                placement="top"
              >
                <el-icon @click="sendDataToUpdate(row.id)" class="icon">
                  <Edit />
                </el-icon>
              </el-tooltip>

              <el-tooltip
                class="box-item"
                effect="dark"
                :content="t('tabs.delete')"
                placement="top"
              >
                <el-icon @click="sendDataToDelete(row.id)" class="icon">
                  <Delete />
                </el-icon>
              </el-tooltip>

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
  cursor: pointer;
  color: #698dff;
  transition: color 0.3s, transform 0.3s;
}
.icon:hover {
  transform: scale(1.1);
}
</style>