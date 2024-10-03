<script lang="ts" setup>
import { defineProps, reactive, ref, defineEmits  , onMounted , onBeforeUnmount , computed} from "vue";
import { ProductFilter } from "../../type/product";
import { type FormInstance } from "element-plus";
import { CategoryResponse } from "@/type/category";
import dayjs, { Dayjs } from "dayjs";
import { customMessage } from "@/util/message";
import { useI18n } from "vue-i18n";
import { isTrim } from "@/util/isAllEmpty";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import en from "element-plus/es/locale/lang/en";
import vi from "element-plus/es/locale/lang/vi";
import eventBus from "@/eventbus/eventBus";

const { t } = useI18n();

const formRef = ref<FormInstance>();
const prop = defineProps<{
  model: ProductFilter;
  categorys: CategoryResponse[];
}>();

const dataFilter = reactive<ProductFilter>({
  ...prop.model,
});

const rules = {
  productCode: [
    { max: 250, message: t("validation.lengSearch", { max: 250 }) },
  ],
  productName: [
    { max: 250, message: t("validation.lengSearch", { max: 250 }) },
  ],
};

const emit = defineEmits(["sendDataFilter", "sendDataFilterReset"]);
const handleFiler = (formEl: FormInstance | undefined) => {
  if (!formEl) return;

  formEl.validate((valid) => {
    if (valid) {
      isTrim(dataFilter);
      if (dataFilter.startCreate && dataFilter.endCreate) {
        const startDateTime = dayjs(dataFilter.startCreate, "DD/MM/YYYY");
        const dueDateTime = dayjs(dataFilter.endCreate, "DD/MM/YYYY");
        if (!dueDateTime.isSameOrAfter(startDateTime)) {
          customMessage("error", t("validateEndDateBigger"));
          return;
        }
      }
      emit("sendDataFilter", dataFilter);
    }
  });
};

const handleResetFilter = () => {
  (Object.keys(dataFilter) as Array<keyof ProductFilter>).forEach((item) => {
    dataFilter[item] = "";
  });
  emit("sendDataFilterReset", dataFilter);
};
</script>

<template>
  <el-form :model="dataFilter" :rules="rules" ref="formRef">
    <div class="filter">
      <el-form-item prop="productCode">
        <el-input
          v-model="dataFilter.productCode"
          :placeholder="t('table.productCode')"
        />
      </el-form-item>
      <el-form-item prop="productName">
        <el-input
          v-model="dataFilter.productName"
          :placeholder="t('table.productName')"
        />
      </el-form-item>
      <el-form-item>
        <el-select
          v-model="dataFilter.category"
          style="width: 200px"
          :placeholder="t('table.category')"
        >
          <el-option
            v-for="item in prop.categorys"
            :key="item.id"
            :label="item.categoryName"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
          <el-date-picker 
            v-model="dataFilter.startCreate"
            type="date"
            :placeholder="t('startDate')"
            format="DD/MM/YYYY"
            value-format="DD/MM/YYYY"
          />
      </el-form-item>
      <el-form-item prop="endAt">
        <el-date-picker
          v-model="dataFilter.endCreate"
          type="date"
          :placeholder="t('endDate')"
          format="DD/MM/YYYY"
          value-format="DD/MM/YYYY"
        />
      </el-form-item>

      <el-form-item>
        <div class="hand">
          <el-button type="primary" @click="handleFiler(formRef)">{{
            t("search")
          }}</el-button>
          <el-button type="primary" @click="handleResetFilter">{{
            t("reset")
          }}</el-button>
        </div>
      </el-form-item>
    </div>
  </el-form>
</template>
