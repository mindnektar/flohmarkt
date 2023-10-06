import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const Icon = (props) => (
    <div
        className={classNames(
            'ui-icon',
            `ui-icon--${props.type}`,
        )}
    />
);

Icon.propTypes = {
    type: PropTypes.string.isRequired,
};

export default Icon;
