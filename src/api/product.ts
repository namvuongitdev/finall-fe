import axiosInstance from "@/axios/axiosConfig"
import { ProductFilter, ProductReqeust } from "@/type/product";


export async function fetchProducts(page: number | undefined, size: number | undefined, dataFilter: ProductFilter | undefined) {
    const response = await axiosInstance.get("/product", {
        params: {
            page,
            size,
            ...(dataFilter !== undefined ? dataFilter : {}),
        }
    })
    return response.data

}

export async function fetchAddProduct(data: FormData) {
    const response = await axiosInstance.post('/product/add', data, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
    return response.data;
}

export async function fetchUpdateProduct(id: number, data: FormData) {
    const response = await axiosInstance.put('/product/update', data, {
        params: {
            id
        },
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
    return response.data;
}

export async function fetchDeleteProduct(id: number) {
    const response = await axiosInstance.delete('/product/delete', {
        params: {
            id
        }
    })
    return response.data

}

export async function fetchCountProduct() {
    const response = await axiosInstance.get('/product/count')
    return response.data;

}

export async function fetchDetailProduct(id: number) {
    const response = await axiosInstance.get('/product/detail', {
        params: {
            id
        }
    })
    return response.data

}


export async function fetchExportExeclProduct() {
    const response = await axiosInstance.get('/product/export', {
        responseType: 'blob', // Đặt responseType thành blob để nhận tệp
    });
    return response;

}