import { disableBodyScroll, clearAllBodyScrollLocks } from 'body-scroll-lock';

export const lockBodyScrolling = (bodyElement) => {
    if (!bodyElement) {
        return;
    }

    disableBodyScroll(bodyElement);

    // Workaround for IOS 15: `disableBodyScroll` will set `position: fixed` on the body element, causing the collapsed browser address bar
    // to uncollapse and create an invisible vertical click offset. All clicks will fire a couple of pixels below where the click actually
    // happened. Clearing the scroll lock after a short timeout and immediately recreating it fixes that.
    window.setTimeout(() => {
        clearAllBodyScrollLocks();
        disableBodyScroll(bodyElement, {
            // Fixes broken scrolling inside the modal on iOS
            allowTouchMove: (element) => {
                while (element && element !== document.body) {
                    if (element.dataset.bodyScrollLockIgnore !== null) {
                        return true;
                    }

                    element = element.parentElement;
                }

                return false;
            },
        });
    }, 10);
};

export const clearBodyScrollLocks = () => {
    clearAllBodyScrollLocks();
};
