import findScrollParent from 'helpers/findScrollParent';
import useRepeatFor from 'hooks/useRepeatFor';

export default () => {
    const repeat = useRepeatFor(300);

    return (element, verticalOffset = 80) => {
        const scrollParent = findScrollParent(element);

        return repeat(() => {
            if (!scrollParent) {
                return;
            }

            const scrollerHeight = scrollParent.height();
            const scrollerTop = scrollParent.top();
            const elementRect = element.getBoundingClientRect();
            const elementTop = elementRect.top - scrollerTop;
            const elementBottom = elementRect.bottom - scrollerTop;
            const distance = Math.min(
                Math.min(elementBottom, scrollerHeight) + verticalOffset - scrollerHeight,
                elementTop - verticalOffset,
            );

            // TODO: implement scrolling up

            if (distance > 0) {
                scrollParent.scroll(distance);
            }
        });
    };
};
