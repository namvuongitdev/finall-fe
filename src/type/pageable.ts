export interface Pageable {
    pageNumber: number,
    pageSize: number
}

export interface Page<T> {
    content: T[],
    pageable: Pageable | undefined;
    totalElements: number | undefined,
    totalPages: number | undefined,
    totalItem?: number
}