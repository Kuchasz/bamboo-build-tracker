export const delay = <T>(): Promise<T> =>
    new Promise(res => {
        setTimeout(() => {
            res();
        }, 500);
    });
