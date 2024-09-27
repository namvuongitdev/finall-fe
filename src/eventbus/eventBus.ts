import mitt from 'mitt';


type EventType = {
    languageChanged: string;
    loadDataProduct: string;
    loadData: string// Định nghĩa sự kiện với kiểu dữ liệu
};

const eventBus = {
    events: {} as Record<keyof EventType, Array<(payload: any) => void>>,

    emit<T extends keyof EventType>(event: T, payload: EventType[T]) {
        if (!this.events[event]) return;
        this.events[event].forEach(callback => callback(payload));
    },

    on<T extends keyof EventType>(event: T, callback: (payload: EventType[T]) => void) {
        if (!this.events[event]) {
            this.events[event] = [];
        }
        this.events[event].push(callback);
    },

    off<T extends keyof EventType>(event: T, callback: (payload: EventType[T]) => void) {
        if (!this.events[event]) return;
        this.events[event] = this.events[event].filter(cb => cb !== callback);
    },
};

export default eventBus;