export const isAllEmpty = (data: any) => {

    return Object.values(data).every(value => {
        return (
            value === null ||
            value === undefined ||
            value === '' ||
            (typeof value === 'string' && value.trim() === '') ||
            (Array.isArray(value) && value.length === 0)

        );
    });
};

export const isTrim = (data: Record<string, any>) => {
    Object.keys(data).forEach(key => {
        if (typeof data[key] === 'string') {
            data[key] = data[key].trim();
        }
    });
}

export const trimInput = (field: keyof any, request: any) => {
    if (field === 'productCode' || field === 'categoryCode') {
        request[field] = request[field].replace(/\s+/g, '');
    }
    if (request[field]) {
        request[field] = request[field].trim();
    }
};