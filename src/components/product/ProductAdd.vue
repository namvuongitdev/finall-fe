<script lang="ts" setup>
import { ProductReqeust } from "@/type/product";
import { reactive, onBeforeMount, ref, computed } from "vue";
import { createFormData } from "@/api/formdata";
import { fetchCategorys } from "@/api/category";
import { CategoryResponse } from "@/type/category";
import { fetchAddProduct, fetchUpdateProduct } from "@/api/product";
import { customMessage } from "@/util/message";
import { type FormInstance } from "element-plus";
import { defineProps, defineEmits } from "vue";
import ProductForm from "./ProductForm.vue";
import { useI18n } from "vue-i18n";
import eventBus from "@/eventbus/eventBus";
import { trimInput } from "@/util/isAllEmpty";
import { URL_IMAGE } from "@/config/config";

const { t } = useI18n();

const formRef = ref<FormInstance>();
const isCheckImage = ref<boolean>(false);
const category = reactive<CategoryResponse[]>([]);
const categoryLoadName = reactive<string[]>([]);
const emit = defineEmits(["reset-tab"]);

const productRequest = reactive<ProductReqeust>({
  productCode: "",
  productName: "",
  description: "",
  price: "",
  quantity: "",
  image: "",
  file: "",
  createAt: "",
  createBy: "",
  modifiedBy: "",
  modifiedDate: "",
  categorys: [],
});

const validatePriceAndQuantity = (
  rule: any,
  value: number,
  callback: (error?: Error) => void
) => {
  if (value < 0) {
    return callback(new Error(t("validation.positiveNumberError")));
  }
  if (!Number.isInteger(Number(value))) {
    return callback(new Error(t("validation.intergerValid")));
  }
  callback();
};

const rules = {
  productCode: [
    { required: true, message: t("validation.required") },
    {
      min: 3,
      max: 50,
      message: t("validation.minLength", { min: 3, max: 50 }),
      trigger: "blur",
    },
  ],
  productName: [
    { required: true, message: t("validation.required") },
    {
      min: 3,
      max: 50,
      message: t("validation.minLength", { min: 3, max: 50 }),
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
  ],
  price: [
    { required: true, message: t("validation.required"), trigger: "blur" },
    { type: "number", message: t("validation.number"), trigger: "blur" },
    { validator: validatePriceAndQuantity, trigger: "blur" },
  ],
  quantity: [
    { required: true, message: t("validation.required"), trigger: "blur" },
    { type: "number", message: t("validation.number"), trigger: "blur" },
    { validator: validatePriceAndQuantity, trigger: "blur" },
  ],
  categorys: [
    { required: true, message: t("validation.required"), trigger: "change" },
    { required: true, message: t("validation.required"), trigger: "blur" },
  ],
  Image: [
    { required: true, message: t("validation.required"), trigger: "blur" },
  ],
};

const props = defineProps<{
  productRequest?: ProductReqeust;
  active: string;
  idUpdate?: number;
}>();

Object.assign(productRequest, props.productRequest);
console.log(productRequest);

const handleCategory = async () => {
  const response = await fetchCategorys();
  Object.assign(category, response);
};

onBeforeMount(() => {
  handleCategory();
});

const handleCreateProduct = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.validate(async (valid) => {
    if (valid) {
      const formData = createFormData(productRequest);

      if (props.active === "update" && props.idUpdate) {
        fetchUpdateProduct(props.idUpdate, formData)
          .then((response) => {
            customMessage("success", t("message.update"));
            eventBus.emit("loadDataProduct", response);
          })
          .catch((error) => {
            customMessage("error", error.response.data.message);
          });
      } else if (props.active === "create") {
        fetchAddProduct(formData)
          .then((response) => {
            customMessage("success", t("message.create"));
            eventBus.emit("loadDataProduct", response);
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

  productRequest.file = file.raw;

  const reader = new FileReader();
  reader.readAsDataURL(file.raw);
  reader.onload = () => {
    if (reader.result) {
      productRequest.image = reader.result as string;
      isCheckImage.value = true;
    }
  };
};

const removeImage = () => {
  productRequest.file = null;
  productRequest.image = "";
};

const selectedCategoryNames = computed(() => {
  return productRequest.categorys.map((id) => {
    const selectedItem = category.find((item) => item.id === id);
    return selectedItem ? selectedItem.categoryName : "";
  });
});
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
            v-if="productRequest.image"
            :src="
              isCheckImage
                ? productRequest.image
                : URL_IMAGE + productRequest.image
            "
            alt=""
            class="avatar"
          />
          <el-icon v-else class="upload-icon"><Plus /></el-icon>
        </el-upload>
        <el-button
          v-if="productRequest.image"
          @click="removeImage"
          class="remove-button"
        >
         {{ t('deleteImage') }}
        </el-button>
      </div>
      <div v-else-if="props.active === 'detail'" class="upload-container">
        <img
          v-if="productRequest.image"
          :src="URL_IMAGE + productRequest.image"
          alt=""
          class="avatar"
        />
      </div>
      <div class="text">
        <p>{{ t("table.productCode") }}: {{ productRequest.productCode }}</p>
        <p>{{ t("table.productName") }}: {{ productRequest.productName }}</p>
        <p>{{ t("table.description") }}: {{ productRequest.description }}</p>
        <p>{{ t("table.price") }} : {{ productRequest.price }}</p>
        <p>{{ t("table.quantity") }} : {{ productRequest.quantity }}</p>
        <p>
          {{ t("table.category") }} : {{ selectedCategoryNames.join(", ") }}
        </p>
        <div v-if="props.active === 'detail'">
          <p>{{ t("table.createAt") }} : {{ productRequest.createAt }}</p>
          <p>{{ t("table.createBy") }} : {{ productRequest.createBy }}</p>
          <p>
            {{ t("table.modifiedDate") }} : {{ productRequest.modifiedDate }}
          </p>
          <p>{{ t("table.modifiedBy") }} : {{ productRequest.modifiedBy }}</p>
        </div>
      </div>
    </div>

    <div class="form-container">
      <el-form
        :model="productRequest"
        :rules="rules"
        label-width="auto"
        ref="formRef"
      >
        <el-form-item prop="productCode" :label="t('table.productCode')">
          <el-input
            :disabled="props.active === 'detail' || props.active === 'update'"
            v-model="productRequest.productCode"
            @blur="trimInput('productCode', productRequest)"
          />
        </el-form-item>

        <el-form-item prop="productName" :label="t('table.productName')">
          <el-input
            :disabled="props.active === 'detail'"
            v-model="productRequest.productName"
            @blur="trimInput('productName', productRequest)"
          />
        </el-form-item>

        <el-form-item prop="description" :label="t('table.description')">
          <el-input
            :disabled="props.active === 'detail'"
            v-model="productRequest.description"
            @blur="trimInput('description', productRequest)"
          />
        </el-form-item>

        <el-form-item>
          <el-form-item prop="price" :label="t('table.price')">
            <el-input
              :disabled="props.active === 'detail'"
              type="number"
              v-model.number="productRequest.price"
              @blur="trimInput('price', productRequest)"
            />
          </el-form-item>

          <el-form-item prop="quantity" :label="t('table.quantity')">
            <el-input
              :disabled="props.active === 'detail'"
              type="number"
              v-model.number="productRequest.quantity"
              @blur="trimInput('quantity', productRequest)"
            />
          </el-form-item>
        </el-form-item>

        <div v-if="props.active === 'detail'">
          <el-form-item>
            <el-form-item :label="t('table.createAt')">
              <el-input
                :disabled="props.active === 'detail'"
                v-model="productRequest.createAt"
              />
            </el-form-item>

            <el-form-item :label="t('table.modifiedDate')">
              <el-input
                :disabled="props.active === 'detail'"
                v-model.number="productRequest.modifiedDate"
              />
            </el-form-item>
          </el-form-item>

          <el-form-item>
            <el-form-item :label="t('table.createBy')">
              <el-input
                :disabled="props.active === 'detail'"
                v-model="productRequest.createBy"
              />
            </el-form-item>

            <el-form-item :label="t('table.modifiedBy')">
              <el-input
                :disabled="props.active === 'detail'"
                v-model="productRequest.modifiedBy"
              />
            </el-form-item>
          </el-form-item>
        </div>

        <el-form-item prop="categorys" :label="t('table.category')">
          <el-select
            v-model="productRequest.categorys"
            multiple
            :placeholder="t('selectCategory')"
            :disabled="props.active === 'detail'"
          >
            <el-option
              v-for="item in category"
              :key="item.id"
              :label="item.categoryName"
              :value="item.id"
            />
          </el-select>
        </el-form-item>

        <div class="dialog-footer">
          <el-form-item>
            <el-button @click="resetTab">{{ t("back") }}</el-button>
            <el-button
              type="primary"
              :disabled="props.active === 'detail'"
              @click="handleCreateProduct(formRef)"
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