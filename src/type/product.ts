import { BaseProps } from "./base"
import { CategoryResponse } from "./category"

export interface ProductResponse extends BaseProps {
    id: number,
    productName: string,
    productCode: string,
    description: string,
    price: number,
    quantity: number,
    image: string,
    file: any,
    status: string,
    categorys: string,
    categoryResponses: CategoryResponse[]
}

export interface ProductReqeust extends BaseProps {
    productName: string,
    productCode: string,
    description: string,
    price: number | string,
    quantity: number | string,
    image: string,
    file: any | string,
    categorys: number[]
}

export interface ProductFilter {
    productName: string,
    productCode: string,
    startCreate: string,
    endCreate: string,
    category: number | string
}