import moment from 'moment';

export default (duration) => (
    (callback) => {
        const start = moment();

        const step = () => {
            callback();

            if (moment(start).diff() > -duration) {
                window.requestAnimationFrame(step);
            }
        };

        window.requestAnimationFrame(step);
    }
);
