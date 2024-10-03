<script lang="ts" setup>
import { reactive, ref, defineEmits } from "vue";
import { type FormInstance } from "element-plus";
import { CateforyFilter } from "@/type/category";
import dayjs, { Dayjs } from "dayjs";
import { customMessage } from "@/util/message";
import { fetchCategoryFIndAll } from "@/api/category";
import { useI18n } from "vue-i18n";
import { isTrim } from "@/util/isAllEmpty";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";

const { t } = useI18n();

const formRef = ref<FormInstance>();
const emit = defineEmits(["sendDataFilter", "sendDataRoot"]);

const dataFilter = reactive<CateforyFilter>({
  categoryCode: "",
  categoryName: "",
  startCreate: "",
  endCreate: "",
});

const rules = {
  categoryCode: [
    { max: 250, message: t("validation.lengSearch", { max: 250 }) },
  ],
  categoryName: [
    { max: 250, message: t("validation.lengSearch", { max: 250 }) },
  ],
};

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
      fetchCategoryFIndAll(undefined, undefined, dataFilter)
        .then((response) => {
          emit("sendDataFilter", response);
          emit("sendDataRoot", dataFilter);
        })
        .catch((error) => {
          customMessage("error", error.response.message);
        });
    }
  });
};
const handleResetFilter = async () => {
  await (Object.keys(dataFilter) as Array<keyof CateforyFilter>).forEach((item) => {
    dataFilter[item] = "";
  });
  await fetchCategoryFIndAll(undefined, undefined, dataFilter)
        .then((response) => {
          emit("sendDataFilter", response);
          emit("sendDataRoot", dataFilter);
        })
        .catch((error) => {
          customMessage("error", error.response.message);
        });
}

</script>

<template>
  <el-form :model="dataFilter" :rules="rules" ref="formRef">
    <div class="filter">
      <el-form-item prop="categoryCode">
        <el-input
          v-model="dataFilter.categoryCode"
          :placeholder="t('tableCategory.categoryCode')"
        />
      </el-form-item>
      <el-form-item prop="categoryName">
        <el-input
          v-model="dataFilter.categoryName"
          :placeholder="t('tableCategory.categoryName')"
        />
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
