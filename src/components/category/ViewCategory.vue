<script lang="ts" setup>
import {
  fetchCategoryFIndAll,
  fetchDeleteCategory,
  fetchDetailCategory,
  fetchExportExeclCtegory,
} from "@/api/category";
import {
  CateforyFilter,
  CategoryOverview,
  CategoryResponse,
} from "@/type/category";
import { Page } from "@/type/pageable";
import {
  onBeforeMount,
  onUnmounted,
  onMounted,
  reactive,
  ref,
  onBeforeUnmount,
  computed,
  defineProps,
} from "vue";
import { customConfirm, customMessage } from "@/util/message";
import FormFilterCategory from "./FormFilterCategory.vue";
import ViewForm from "./ViewForm.vue";
import { Plus, Delete, View, Edit } from "@element-plus/icons-vue";
import eventBus from "@/eventbus/eventBus";
import { ProductReqeust, ProductResponse } from "@/type/product";
import { useI18n } from "vue-i18n";
import { URL_IMAGE } from "@/config/config";
import { AxiosError } from "axios";

const { t } = useI18n();


const categoryResponse = reactive<Page<CategoryResponse>>({
  content: [],
  pageable: undefined,
  totalElements: undefined,
  totalPages: undefined,
});

const size = ref<number>();
const pageNew = ref<number>();

const props = defineProps<{
  addTabForm: (title: string, component: any, props: any) => void;
}>();

const categoryFilter = reactive<CateforyFilter>({
  categoryCode: "",
  categoryName: "",
  startCreate: "",
  endCreate: "",
});

const loadData = async () => {
  await fetchCategoryFIndAll(pageNew.value, size.value, categoryFilter)
    .then((response) => {
      Object.assign(categoryResponse, response);
    })
    .catch((error) => {
      customMessage("error", error.response.message);
    });
};

onBeforeMount(async () => {
  await fetchCategoryFIndAll(undefined, undefined, categoryFilter)
    .then((response) => {
      Object.assign(categoryResponse, response);
    })
    .catch((error) => {
      console.log(error);
    });
});

const handleSizeChange = async (pageSize: number) => {
  size.value = pageSize;
  await fetchCategoryFIndAll(pageNew.value, size.value, categoryFilter)
    .then((response) => {
      Object.assign(categoryResponse, response);
      console.log(categoryResponse.pageable);
    })
    .catch((error) => {
      console.log(error);
    });
};

const handleCurrentChange = async (page: number) => {
  pageNew.value = page - 1;
  await fetchCategoryFIndAll(pageNew.value, size.value, categoryFilter)
    .then((response) => {
      Object.assign(categoryResponse, response);
    })
    .catch((error) => {
      console.log(error);
    });
};

const handleFilterCategory = (data: CategoryResponse) => {
  Object.assign(categoryResponse, data);
};

const handleDataRootFilter = (data: CateforyFilter) => {
  Object.assign(categoryFilter, data);
};

const handleDeleteCategory = (id: number) => {
  customConfirm(
    t("messageTitle.delete"),
    t("message.confirm"),
    t("message.delete"),
    "warning",
    t('messageTitle.ok'),
    t('messageTitle.cancel'),
  ).then((result) => {
    if (result) {
      fetchDeleteCategory(id)
        .then((response) => {
          categoryResponse.content.forEach((item, index) => {
            if (item.id === response.id) {
              categoryResponse.content.splice(index, 1);
              customMessage("success", t("message.delete"));
              return;
            }
          });
        })
        .catch((error) => {
          customMessage("error", error.response.data.message);
        });
    }
  });
};

const handleAddCategory = () => {
  props.addTabForm("createCategory", ViewForm, { active: "create" });
};

const handleDetailCategory = (id: number) => {
  fetchDetailCategory(id)
    .then((response) => {
      console.log(response);
      props.addTabForm("detailCategory", ViewForm, {
        active: "detail",
        categoryDetail: response,
      });
    })
    .catch((error) => {
      customMessage('error' , error.response.data.message)
    });
};

const sendToFormToUpdate = (id: number) => {
  fetchDetailCategory(id).then((response) => {
    props.addTabForm("updateCategory", ViewForm, {
        categoryDetail: response,
        active: "update",
        idUpdate: id,
      });
    }).catch((error) => {
      customMessage('error' , error.response.data.message)
    })
};

const handleExeclCategory = async () => {
  try {
    const response = await fetchExportExeclCtegory(categoryFilter);

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "data.xlsx"); // Tên tệp tải xuống
    document.body.appendChild(link);
    link.click(); // Tạo một click giả lập để tải xuống

    // Xóa link khỏi DOM
    if (link.parentNode) {
      link.parentNode.removeChild(link);
    }

    // Giải phóng URL đã tạo
    window.URL.revokeObjectURL(url);
  } catch (error) {
    if (error instanceof AxiosError) {
      // Xử lý lỗi từ axios
      if (error.response) {
        const errorMessage = await error.response.data.text();
        const jsonObject = JSON.parse(errorMessage);
        customMessage("error", jsonObject.message);
      }
    }
  }
};

onMounted(() => {
  eventBus.on("loadData", loadData);
});

onUnmounted(() => {
  eventBus.off("loadData", loadData);
});

</script>

<template>
  <!-- <el-config-provider :locale="locale"> -->
    <div class="container">
      <div class="filterCategory">
        <FormFilterCategory
          @sendDataFilter="handleFilterCategory"
          @sendDataRoot="handleDataRootFilter"
        />
      </div>
      <div class="active">
        <el-button type="primary" @click="handleAddCategory">
          <Plus />
          {{ t("create") }}</el-button
        >
        <el-button
          type="primary"
          :disabled="categoryResponse.totalElements === 0"
          @click="handleExeclCategory"
          >{{ t("downloadExcel") }}</el-button
        >
      </div>
      <el-table
        max-height="500"
        :data="categoryResponse.content"
        style="width: 100%"
        border
      >
        <el-table-column fixed label="STT">
          <template #default="{ $index }">
            {{ (pageNew ?? 0) * (size ?? 10) + $index + 1 }}
          </template>
        </el-table-column>

        <el-table-column
          prop="categoryCode"
          :label="t('tableCategory.categoryCode')"
          width="120"
        />
        <el-table-column
          prop="categoryName"
          :label="t('tableCategory.categoryName')"
          width="180"
        />
        <el-table-column
          prop="description"
          :label="t('tableCategory.description')"
        />
        <el-table-column prop="createAt" :label="t('tableCategory.createAt')" />
        <el-table-column
          prop="modifiedDate"
          :label="t('tableCategory.modifiedDate')"
        />

        <el-table-column prop="image" :label="t('tableCategory.image')" width="100">
          <template v-slot="{ row }">
            <img
              alt="Image"
              style="width: 80px; height: 50px"
              :src="row.image"
              v-if="row.image"
            />
          </template>
        </el-table-column>
        <el-table-column prop="status" :label="t('tableCategory.status')">
          <template v-slot="{ row }">
            <el-tag effect="success">
              {{ t(`tableCategory.${row.status}`) }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column
          fixed="right"
          :label="t('tableCategory.operations')"
          min-width="180"
        >
          <template v-slot="{ row }">
            <el-tooltip
              class="box-item"
              effect="dark"
              :content="t('tabs.detail')"
              placement="top"
            >
              <el-icon @click="handleDetailCategory(row.id)" class="icon">
                <View />
              </el-icon>
            </el-tooltip>

            <el-tooltip
              class="box-item"
              effect="dark"
              :content="t('tabs.update')"
              placement="top"
            >
              <el-icon @click="sendToFormToUpdate(row.id)" class="icon">
                <Edit />
              </el-icon>
            </el-tooltip>

            <el-tooltip
              class="box-item"
              effect="dark"
              :content="t('tabs.delete')"
              placement="top"
            >
              <el-icon @click="handleDeleteCategory(row.id)" class="icon">
                <Delete />
              </el-icon>
            </el-tooltip>

          </template>
        </el-table-column>
      </el-table>

      <div class="demo-pagination-block">
        <el-pagination
          :current-page="(categoryResponse.pageable?.pageNumber ?? 0) + 1"
          :page-size="categoryResponse.pageable?.pageSize"
          :page-sizes="[10, 20, 30]"
          background
          :total="categoryResponse.totalElements"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :show-total="
            t('pagination.total', { total: categoryResponse.totalElements })
          "
          :goto-text="t('pagination.goto')"
        />
      </div>
    </div>
  <!-- </el-config-provider> -->
</template>


  <style scoped>
.container {
  padding: 20px;
  background-color: #fff;
  margin: 0 30px;
}

.filterCategory {
  margin-bottom: 20px;
}

.active {
  margin-bottom: 20px;
}

.el-table {
  background-color: #fff;
  border-radius: 8px;
  overflow: hidden;
}

.el-table-column {
  text-align: center;
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

.demo-pagination-block {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

/* Responsive styles */
@media (max-width: 768px) {
  .el-table-column {
    font-size: 14px;
  }

  .active .el-button {
    width: 100%;
    margin-bottom: 10px;
  }
}
</style>
