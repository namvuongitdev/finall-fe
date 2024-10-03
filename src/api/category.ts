import axiosInstance from "@/axios/axiosConfig"
import { CateforyFilter } from "@/type/category"

export async function fetchCategorys() {
    const response = await axiosInstance.get("/category/no-product")
    return response.data
}

export async function fetchCategoryFIndAll(page: number | undefined, size: number | undefined, dataFilter: CateforyFilter | undefined) {
    const response = await axiosInstance.get("/category", {
        params: {
            page,
            size,
            ...(dataFilter !== undefined ? dataFilter : {}),
        }
    })
    return response.data
}

export async function fetchDeleteCategory(id: number) {
    const response = await axiosInstance.delete("/category/delete", {
        params: {
            id
        }
    })
    return response.data;
}

export async function fetchAddCategory(data: FormData) {
    const response = await axiosInstance.post('/category/add', data,
        {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }
    );
    return response.data;

}

export async function fetchDetailCategory(id: number) {
    const response = await axiosInstance.get('/category/detail', {
        params: {
            id
        },
    })
    return response.data;
}

export async function fetchUpdateCategory(id: number, data: FormData) {
    const response = await axiosInstance.put('/category/update', data, {
        params: {
            id
        },
        headers: {
            'Content-Type': 'multipart/form-data'
        }

    })
    return response.data
}

export async function fetchExportExeclCtegory(data: CateforyFilter) {
    const response = await axiosInstance.get('/category/export', {
        params: {
            ...data
        },
        responseType: 'blob', // Đặt responseType thành blob để nhận tệp
    });
    return response;

}