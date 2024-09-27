<script lang="ts" setup>
import { fetchAddCategory, fetchUpdateCategory } from "@/api/category";
import { createFormData } from "@/api/formdata";
import { CategoryRequest, CategoryResponse } from "@/type/category";
import { customMessage } from "@/util/message";
import { type FormInstance } from "element-plus";
import { reactive, ref, defineProps, defineExpose, defineEmits } from "vue";
import { useI18n } from "vue-i18n";
import eventBus from "@/eventbus/eventBus";
import { trimInput } from "@/util/isAllEmpty";
import { URL_IMAGE } from "@/config/config";
const { t } = useI18n();

const formRef = ref<FormInstance>();
const emit = defineEmits(["reset-tab", "loadData"]);
const isCheckImage = ref<boolean>(false);

const categoryRequest = reactive<CategoryRequest>({
  categoryCode: "",
  categoryName: "",
  description: "",
  image: "",
  createAt: "",
  createBy: "",
  modifiedBy: "",
  modifiedDate: "",
  file: "",
});

const validateSpecialCharPattern = (
  rule: any,
  value: string,
  callback: (error?: Error) => void
) => {
  const specialChars = '!@#$%^&*(),.?":{}|<>';
  if (
    typeof value === "string" &&
    specialChars.split("").some((char) => value.includes(char))
  ) {
    callback(new Error(t("validation.specialChar")));
  } else {
    callback();
  }
};

const rules = {
  categoryCode: [
    { required: true, message: t("validation.required"), trigger: "blur" },
    {
      min: 3,
      max: 50,
      message: t("validation.minLength", { min: 3, max: 50 }),
      trigger: "blur",
    },
    {
      validator: validateSpecialCharPattern,
      trigger: "blur",
    },
  ],
  categoryName: [
    { required: true, message: t("validation.required") },
    {
      min: 3,
      max: 50,
      message: t("validation.minLength", { min: 3, max: 50 }),
      trigger: "blur",
    },
    {
      validator: validateSpecialCharPattern,
      trigger: "blur",
    },
  ],
  description: [
    { required: true, message: t("validation.required") },
    {
      min: 3,
      max: 50,
      message: t("validation.minLength", { min: 3, max: 50 }),
      trigger: "blur",
    },
    {
      validator: validateSpecialCharPattern,
      trigger: "blur",
    },
  ],
};

const props = defineProps<{
  active: string;
  categoryDetail?: CategoryResponse;
  idUpdate?: number;
}>();

Object.assign(categoryRequest, props.categoryDetail);

const beforeAvatarUpload = (file: File): boolean => {
  const isImage = file.type.startsWith("image/");
  if (!isImage) {
    console.error("Bạn chỉ có thể tải lên ảnh!");
  }
  return isImage;
};

const handleChange = (file: { raw: File }): void => {
  const maxSizeInMB = 2;
  const isImage = file.raw.type.startsWith("image/");
  const isValidSize = file.raw.size / 1024 / 1024 <= maxSizeInMB;
  if (!isImage) {
    customMessage("error", t("validation.image"));
    return;
  }
  if (!isValidSize) {
    customMessage(
      "error",
      t("validation.imageMaxSizeInMB", { maxSizeInMB: 2 })
    );
    return;
  }
  categoryRequest.file = file.raw;
  const reader = new FileReader();
  reader.readAsDataURL(file.raw);
  reader.onload = () => {
    if (reader.result) {
      categoryRequest.image = reader.result as string; // Cập nhật URL ảnh
      isCheckImage.value = true;
    }
  };
};

const removeImage = () => {
  (categoryRequest.image = ""), (categoryRequest.file = null);
};

const handleCreateCategory = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.validate((valid) => {
    if (valid) {
      console.log(categoryRequest.description);
      const formData = createFormData(categoryRequest);
      if (props.active === "update" && props.idUpdate) {
        fetchUpdateCategory(props.idUpdate, formData)
          .then((response) => {
            customMessage("success", "update success");
            eventBus.emit("loadData", response);
          })
          .catch((error) => {
            customMessage("error", error.response.data.message);
          });
      } else if (props.active === "create") {
        fetchAddCategory(formData)
          .then((response) => {
            customMessage("success", "create success");
            eventBus.emit("loadData", response);
          })
          .catch((error) => {
            customMessage("error", error.response.data.message);
          });
      }
    } else {
      console.log("error submit");
    }
  });
};

const resetTab = () => {
  emit("reset-tab");
};
</script>

<template>
  <div class="container">
    <div class="image-container">
      <div
        class="upload-container"
        v-if="props.active === 'create' || props.active === 'update'"
      >
        <el-upload
          class="avatar-uploader"
          :auto-upload="false"
          :show-file-list="false"
          :on-change="handleChange"
          :before-upload="beforeAvatarUpload"
        >
          <img
            v-if="categoryRequest.image"
            :src="
              isCheckImage
                ? categoryRequest.image
                : URL_IMAGE + categoryRequest.image
            "
            alt=""
            class="avatar"
          />
          <el-icon v-else class="upload-icon"><Plus /></el-icon>
        </el-upload>
        <button
          v-if="categoryRequest.image"
          @click="removeImage"
          class="remove-button"
        >
          {{ t("deleteImage") }}
        </button>
      </div>
      <div v-else-if="props.active === 'detail'" class="upload-container">
        <img
          v-if="categoryRequest.image"
          :src="URL_IMAGE + categoryRequest.image"
          alt=""
          class="avatar"
        />
      </div>
      <div class="text">
        <p>
          {{ t("tableCategory.categoryCode") }}:
          {{ categoryRequest.categoryCode }}
        </p>
        <p>
          {{ t("tableCategory.categoryName") }}:
          {{ categoryRequest.categoryName }}
        </p>
        <p>
          {{ t("tableCategory.description") }}:
          {{ categoryRequest.description }}
        </p>
        <div v-if="props.active === 'detail'">
          <p>
            {{ t("tableCategory.createAt") }} : {{ categoryRequest.createAt }}
          </p>
          <p>
            {{ t("tableCategory.createBy") }} : {{ categoryRequest.createBy }}
          </p>
          <p>
            {{ t("tableCategory.modifiedDate") }} :
            {{ categoryRequest.modifiedDate }}
          </p>
          <p>
            {{ t("tableCategory.modifiedBy") }}:
            {{ categoryRequest.modifiedBy }}
          </p>
        </div>
      </div>
    </div>

    <div class="form-container">
      <el-form
        :model="categoryRequest"
        :rules="rules"
        label-width="auto"
        ref="formRef"
      >
        <el-form-item
          prop="categoryCode"
          :label="t('tableCategory.categoryCode')"
        >
          <el-input
            :disabled="props.active === 'detail' || props.active === 'update'"
            v-model="categoryRequest.categoryCode"
            @blur="trimInput('categoryCode', categoryRequest)"
          />
        </el-form-item>

        <el-form-item
          prop="categoryName"
          :label="t('tableCategory.categoryName')"
        >
          <el-input
            :disabled="props.active === 'detail'"
            v-model="categoryRequest.categoryName"
            @blur="trimInput('categoryName', categoryRequest)"
          />
        </el-form-item>

        <el-form-item
          prop="description"
          :label="t('tableCategory.description')"
          @blur="trimInput('description', categoryRequest)"
        >
          <el-input
            :disabled="props.active === 'detail'"
            v-model="categoryRequest.description"
          />
        </el-form-item>

        <div v-if="props.active === 'detail'">
          <el-form-item>
            <el-form-item :label="t('tableCategory.createAt')">
              <el-input
                :disabled="props.active === 'detail'"
                v-model="categoryRequest.createAt"
              />
            </el-form-item>

            <el-form-item :label="t('tableCategory.modifiedDate')">
              <el-input
                :disabled="props.active === 'detail'"
                v-model.number="categoryRequest.modifiedDate"
              />
            </el-form-item>
          </el-form-item>

          <el-form-item>
            <el-form-item :label="t('tableCategory.createBy')">
              <el-input
                :disabled="props.active === 'detail'"
                v-model="categoryRequest.createBy"
              />
            </el-form-item>

            <el-form-item :label="t('tableCategory.modifiedBy')">
              <el-input
                :disabled="props.active === 'detail'"
                v-model="categoryRequest.modifiedBy"
              />
            </el-form-item>
          </el-form-item>
        </div>

        <div class="dialog-footer">
          <el-form-item>
            <el-button @click="resetTab">{{ t("back") }}</el-button>
            <el-button
              @click="handleCreateCategory(formRef)"
              :disabled="props.active === 'detail'"
              type="primary"
              >{{ t("save") }}</el-button
            >
          </el-form-item>
        </div>
      </el-form>
    </div>
  </div>
</template>

<style scoped>
.text p {
  word-wrap: break-word;
  overflow-wrap: break-word;
  white-space: normal;
  width: 300px;
  color: rgba(151, 151, 151, 0.9);
}
.container {
  display: flex;
  margin-left: 50px;
  overflow: hidden;
}

.form-container {
  flex: 1;
  padding-left: 20px;
  background-color: #fff;
  border-radius: 5px;
  padding: 20px 50px;
  margin-right: 20px;
}

.image-container {
  background-color: #fff;
  height: 100%;
  padding: 20px 50px;
  margin-right: 30px;
  border-radius: 5px;
  text-align: center;
}

.upload-container:hover {
  border-color: #66afe9;
}

.upload-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.upload-icon {
  font-size: 50px;
  color: #007bff;
  margin-bottom: 10px;
}

.avatar-uploader {
  position: relative;
  width: 200px;
  height: 200px;
  border: 1px dashed #d9d9d9;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f7f7f7;
  cursor: pointer;
}

.avatar {
  width: 200px;
  height: 200px;
  border-radius: 50%;
}

.upload-icon {
  font-size: 24px;
  color: #a0a0a0;
}
.upload-icon:hover {
  color: #1890ff;
}

.remove-button {
  margin-top: 10px;
  background-color: #a0a0a0;
  color: white;
  border: none;
  padding: 5px 10px;
  cursor: pointer;
  border-radius: 4px;
}
.remove-button:hover {
  background-color: rgb(203, 198, 198);
}
.dialog-footer {
  display: flex;
  justify-items: center;
  justify-content: right;
}
</style>