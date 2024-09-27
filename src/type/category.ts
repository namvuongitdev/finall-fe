import { BaseProps } from "./base"


export interface CategoryResponse extends BaseProps {
    id: number,
    categoryCode: string,
    categoryName: string,
    description: string,
    img: string,
    status: string,
}

export interface CategoryRequest extends BaseProps {
    categoryCode?: string,
    categoryName?: string,
    description?: string,
    image: string,
    file?: any
}

export interface CateforyFilter {
    categoryName: string,
    categoryCode: string,
    startCreate: string,
    endCreate: string
}

export type CategoryOverview = {
    id?: number,
    categoryCode?: string,
    categoryName?: string,
    description?: string,
    img?: string,
    status?: string,
    createAt?: string;
    modifiedDate?: string;
    modifiedBy?: string;
    createBy?: string

}

export type Action = 'CREATE' | 'EDIT' | 'DELETE';
