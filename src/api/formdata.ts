
export const createFormData = (data: any) => {
    const formData = new FormData();
    for (const [key, value] of Object.entries(data)) {
        if (key === 'image' || key === 'createAt' || key === 'createBy'
            || key === 'modifiedBy' || key === 'modifiedDate'
        ) {
            continue;
        }
        if (value) {
            formData.append(key, value as string | Blob); // Đảm bảo giá trị là string hoặc Blob
        }
    }

    return formData;
};