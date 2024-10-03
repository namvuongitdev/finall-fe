import { ElMessageBox, ElMessage } from 'element-plus';



export function customConfirm(title: string, messageConfirm: string, messageSuccse: string,
    type: 'success' | 'warning' | 'info' | 'error' = 'warning',
    ok: string, cancel: string
): Promise<boolean> {
    return new Promise((resolve, reject) => {
        ElMessageBox.confirm(messageConfirm, title, {
            confirmButtonText: ok,
            cancelButtonText: cancel,
            type: type,
        })
            .then(() => {
                resolve(true);
            })
            .catch(() => {
                resolve(false);
            });
    });
}
export function customMessage(type: 'success' | 'warning' | 'info' | 'error', message: string) {
    ElMessage({
        type,
        message,
    });
}