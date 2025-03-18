export type Pagination = {
    size: number;
    total_page: number;
    current_page: number;
}

export type Pageable<T> = {
    data: Array<T>;
    pagination: Pagination;
}