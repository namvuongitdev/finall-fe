<script lang="ts" setup>
import { onBeforeMount, reactive, onMounted, onUnmounted, ref , defineProps } from "vue";
import { Page } from "../../type/pageable";
import { ProductFilter, ProductRequest, ProductResponse } from "../../type/product";
import { fetchAddProduct,fetchCountProduct , fetchDeleteProduct, fetchDetailProduct, fetchExportExeclProduct, fetchProducts, fetchUpdateProduct } from "@/api/product";
import { descriptionProps, type FormInstance } from "element-plus";
import ProductTable from "@/components/product/ProductTable.vue";
import "@/styles/product.css";
import { customConfirm, customMessage } from "@/util/message";
import ProductFormFilter from "./ProductFormFilter.vue";
import { CategoryResponse } from "@/type/category";
import { fetchCategorys } from "@/api/category";
import { createFormData } from "@/api/formdata";
import ProductAdd from "./ProductAdd.vue";
import { useI18n } from 'vue-i18n';
import eventBus from '@/eventbus/eventBus';
import axiosInstance from "@/axios/axiosConfig";
import { AxiosError } from "axios";

const { t } = useI18n();


const category = reactive<CategoryResponse[]>([])
const page = ref<number>()
const pageSize = ref<number>()

const productResponse = reactive<Page<ProductResponse>>({
  content: [],
  pageable: undefined,
  totalElements: undefined,
  totalPages: undefined,
  totalItem:0
});

const productFilter = reactive<ProductFilter>({
  productName: "",
  productCode: "",
  startCreate: "",
  endCreate: "",
  category:""
});

const productRequest = reactive<ProductRequest>({
  productCode:"",
  productName:"",
  description: "",
  price: "",
  quantity: "",
  image:"",
  file: "",
  createAt:"",
  createBy:"",
  modifiedBy:"",
  modifiedDate:"",
  categorys: []
})

const props = defineProps<{
  addTabForm: (title:string, component: any , props: any) => void;
}>();

const handleFindProduct = async (
  page: number | undefined,
  size: number | undefined,
) => {
 await  fetchProducts(page, size, productFilter)
    .then((response) => {
      Object.assign(productResponse, response);
    })
    .catch((error) => {
      console.log(error);
    });
};


onBeforeMount(async () => {
 await handleFindProduct(undefined, undefined);
 const responseCategory =  await fetchCategorys()
  Object.assign(category , responseCategory)
});

const handleResetFetchProduct = async () => {
  await  fetchProducts(page.value, pageSize.value, productFilter)
    .then((response) => {
      Object.assign(productResponse, response);
    })
    .catch((error) => {
      console.log(error);
    });
}

const handlePageble = (data: any) => {
  page.value = data.pageNew;
  pageSize.value = data.size;
  handleFindProduct(data.page - 1, data.size);
};

const handlerFilterProduct = (data:ProductFilter) => {
  Object.assign(productFilter , data)
  handleFindProduct(undefined, undefined);
};

const handleResetFilterProduct = (data:ProductFilter) => {
  Object.assign(productFilter , data)
  handleFindProduct(undefined, undefined);
};

const handleDeleteProduct = (id: number) => {
  customConfirm(
    t('messageTitle.delete'),
    t('message.confirm'),
    t('message.delete'),
    "warning",
    t('messageTitle.ok'),
    t('messageTitle.cancel'),
  ).then((result) => {
    if (result) {
      fetchDeleteProduct(id)
        .then((response) => {
          productResponse.content.forEach((item, index) => {
            if (item.id === response.id) {
              productResponse.content.splice(index, 1);
              customMessage('success' , t('message.delete'))
              return;
            }
          });
        })
        .catch((error) => {
          customMessage('error' , error.response.data.message)
        });
    }
  });
};

const handleUpdateProduct = async (id:number) => {
  if(id){
   await fetchDetailProduct(id).then((response) => {
      handleResponseToProductReqeust(response);
      if(response.categoryResponses !== null){
        response.categoryResponses.forEach((o:any) => {
          productRequest.categorys.push(o.id)
        })
      }
        props.addTabForm('updateProduct',ProductAdd , {
          productRequest:productRequest,
          active:'update',
          idUpdate:id
        })
     
   }).catch((error)=>{
    customMessage('error' , error.response.data.message)
   })
  }
}

const handleDetailProduct = (id:number) => {
 if(id){
  fetchDetailProduct(id).then((response) => {
  
   handleResponseToProductReqeust(response);
   if(response.categoryResponses !== null){
   response.categoryResponses.forEach((item:any) => {
      productRequest.categorys.push(item.id)
    })
   }
    props.addTabForm("detailProduct" , ProductAdd , {
      productRequest:productRequest,
      active:'detail',
      productDetail:response
    })
    
  }).catch((error) => {
    customMessage('error' , error.response.data.message)
  })

 }
}

const handleDialog = () => {
  props.addTabForm('createProduct', ProductAdd ,{active:'create'});
}

const handleResponseToProductReqeust = (response:ProductRequest) => {
  console.log(response.modifiedBy)
  Object.assign(productRequest , {productCode: response.productCode,
        productName:response.productName,
        description:response.description,
        price:response.price,
        quantity:response.quantity,
        image:response.image,
        createAt:response.createAt,
        createBy:response.createBy,
        modifiedDate:response.modifiedDate,
        modifiedBy:response.modifiedBy,
        categorys:[]
      })
}


const downloadExcel = async () => {
  try {
    const response = await fetchExportExeclProduct(productFilter).then((response) => {
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'data.xlsx'); // Tên tệp tải xuống
    document.body.appendChild(link);
    link.click(); // Tạo một click giả lập để tải xuống

    // Xóa link khỏi DOM
    if (link.parentNode) {
      link.parentNode.removeChild(link);
    }

    // Giải phóng URL đã tạo
    window.URL.revokeObjectURL(url);
    });
   } catch (error) {
    if (error instanceof AxiosError) {
      // Xử lý lỗi từ axios
      if (error.response) {
        const errorMessage = await error.response.data.text();
        const jsonObject = JSON.parse(errorMessage); 
        customMessage('error', jsonObject.message);

      } 
    } 
   }
};

onMounted(() => {
  eventBus.on('loadDataProduct', handleResetFetchProduct);
});

onUnmounted(() => {
  eventBus.off('loadDataProduct', handleResetFetchProduct );
});


</script>

<template>

  <div class="main">
    <div class="data">
      <div class="formFilter">
        <ProductFormFilter :model="productFilter"
         :categorys="category"
         @sendDataFilter="handlerFilterProduct"
          @sendDataFilterReset="handleResetFilterProduct" />
      </div>
      <div class="productTable">
        <div class="active">
         <div>
          <el-button type="primary"  @click="handleDialog
            ">
             {{ t('create') }}
          </el-button>
         </div>
         <div>
          <el-button @click="downloadExcel" :disabled="productResponse.totalElements === 0" type="primary">{{ t('downloadExcel') }}</el-button>

         </div>
        </div>
        <ProductTable
          :items="productResponse"
          :categorys="category"
          @dataSendPage="handlePageble"
          @sendDataToDelete="handleDeleteProduct"
          @sendDataToUpdate ="handleUpdateProduct"
          @sendDataDetail = "handleDetailProduct"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>