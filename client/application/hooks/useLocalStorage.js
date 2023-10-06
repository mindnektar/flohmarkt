import { useContext } from 'react';
import LocalStorageContext from 'contexts/localStorage';

export default (key, defaultValue) => {
    const { read, write } = useContext(LocalStorageContext);
    const current = read(key, true);

    return [
        current !== undefined ? current : defaultValue,
        (value) => {
            write(key, value);
        },
    ];
};
