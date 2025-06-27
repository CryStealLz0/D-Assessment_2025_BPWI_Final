export function showFormattedDate(date, locale = 'en-US', options = {}) {
    return new Date(date).toLocaleDateString(locale, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        ...options,
    });
}

export function sleep(time = 1000) {
    return new Promise((resolve) => setTimeout(resolve, time));
}

export function transitionHelper({ skipTransition = false, updateDOM }) {
    if (skipTransition || !document.startViewTransition) {
        const updateCallbackDone = Promise.resolve(updateDOM()).then(() => {});
        return {
            ready: Promise.reject(Error('View transitions unsupported')),
            updateCallbackDone,
            finished: updateCallbackDone,
        };
    }
    return document.startViewTransition(updateDOM);
}
