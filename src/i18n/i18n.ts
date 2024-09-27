import { createI18n } from 'vue-i18n';

const messages = {

    en: {
        table: {
            index: 'No.',
            productCode: 'Product Code',
            productName: 'Product Name',
            description: 'Description',
            price: 'Price',
            quantity: 'Quantity',
            createAt: 'Created At',
            modifiedDate: 'Modified Date',
            category: 'Category',
            status: 'Status',
            image: "Image",
            Category: "Category",
            operations: 'Operations',
            createBy: 'Create by',
            modifiedBy: 'Modified By'
        },
        tableCategory: {
            index: 'No.',
            categoryCode: 'Category Code',
            categoryName: 'Category Name',
            description: 'Description',
            createAt: 'Created At',
            modifiedDate: 'Modified Date',
            status: 'Status',
            image: "Image",
            Category: "Category",
            operations: 'Operations',
            createBy: 'Create by',
            modifiedBy: 'Modified By'
        },
        pagination: {
            itemsPerPage: 'Items per page',
            total: 'Total {total} items', // Chuỗi cho tổng số mục
            goto: 'Go to', // Chuỗi cho "Go to"
        },
        tabs: {
            create: 'create',
            detail: 'detail',
            update: 'update',
            manage: 'manage',
        },
        validation: {
            required: 'This field is required.',
            minLength: 'This field must have at least {min} characters {max} characters',
            number: 'This field must be a number.',
            priceInvalid: 'Price must be a positive number.',
            quantityInvalid: 'Quantity must be a positive integer.',
            quantityInteger: 'Quantity must be a number',
            intergerValid: 'must be a number',
            image: 'Please select image file!',
            imageMaxSizeInMB: 'File size must be less than or equal to {maxSizeInMB} MB!',
            specialChar: 'No special characters allowed'

        },
        messageTitle: {
            delete: 'delete'
        },
        message: {
            delete: 'detele success',
            create: 'create success',
            update: 'update success',
            confirm: 'proxy will permanently delete the file. Continue?'

        },
        downloadExcel: 'Download Excel',
        create: 'Create',
        startDate: 'Start date',
        endDate: 'End date',
        search: 'Search',
        reset: 'Reset',
        back: 'Back',
        save: 'Save',
        validateFilterStart: 'start date is required',
        validateFilterend: 'end date is required',
        validateEndDateBigger: 'end date bigger start date',
        product: "Product",
        category: "Category",
        searchIsEmpty: 'search is required',
        selectCategory: 'select category',
        deleteImage: 'Delete image'


    },
    vi: {
        table: {
            index: 'STT',
            productCode: 'Mã sản phẩm',
            productName: 'Tên sản phẩm',
            description: 'Mô tả',
            price: 'Giá',
            quantity: 'Số lượng',
            createAt: 'Ngày tạo',
            modifiedDate: 'Ngày sửa',
            category: 'Danh mục',
            status: 'Trạng thái',
            image: "Anh",
            Category: "Danh mục",
            operations: 'Thao tác',
            createBy: 'Người tạo',
            modifiedBy: 'Người sửa',
        },
        tableCategory: {
            index: 'No.',
            categoryCode: 'Mã danh mục',
            categoryName: 'Tên danh mục',
            description: 'Mô tả',
            createAt: 'Ngày tạo',
            modifiedDate: 'Ngày sửa',
            status: 'Trạng thái',
            image: "Anh",
            operations: 'Thao tác',
            createBy: 'Người tạo',
            modifiedBy: 'Người sửa'
        },
        pagination: {
            itemsPerPage: 'Số mục mỗi trang',
            total: 'Tổng {total} mục', // Chuỗi cho tổng số mục
            goto: 'Đi đến', // Chuỗi cho "Đi đến"
        },
        tabs: {
            create: 'Thêm mới',
            detail: 'chi tiết',
            update: 'cập nhập',
            manage: 'Quản lý'
        },
        validation: {
            required: 'Trường này là bắt buộc.',
            minLength: 'Trường này phải có ít nhất {min} ký tự và {max} ký tự',
            number: 'Trường này phải là số.',
            priceInvalid: 'Giá phải là số dương.',
            quantityInvalid: 'Số lượng phải là số nguyên dương.',
            positiveNumberError: 'Giá trị phải lớn hơn 0.',
            intergerValid: 'phải là số nguyên',
            image: 'Vui lòng chọn file hình ảnh!',
            imageMaxSizeInMB: 'Kích thước file phải nhỏ hơn hoặc bằng {maxSizeInMB} MB!',
            specialChar: 'không được nhập tí tự đặc biệt'
        },
        messageTitle: {
            delete: 'xóa'
        },
        message: {
            delete: 'xóa thành công',
            create: 'thêm mới thành công',
            update: 'cập nhập thành công',
            confirm: 'bạn có muốn xóa không'
        },
        downloadExcel: 'Tải tệp Excel',
        create: 'Thêm mới',
        startDate: 'Ngày bắt đầu',
        endDate: 'Ngày kết thúc',
        search: 'Tìm kiếm',
        reset: 'Làm mới',
        back: 'Quay lại',
        save: 'Lưu',
        validateFilterStart: 'chưa chọn ngày bắt đầu',
        validateFilterend: 'chưa chọn ngày kết thúc',
        validateEndDateBigger: 'ngày kết thức phải lớn hơn ngày bắt đầu',
        product: "Sản phẩm",
        category: "Danh mục",
        searchIsEmpty: 'bạn chưa điền gì vào các ô tìm kiếm',
        selectCategory: 'lựa chọn danh mục',
        deleteImage: 'Xóa ảnh'


    },
};

const i18n = createI18n({
    locale: 'en',
    fallbackLocale: 'en',
    messages,
});

export default i18n;
