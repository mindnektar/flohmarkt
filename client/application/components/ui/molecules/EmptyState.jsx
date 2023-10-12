import React from 'react';
import PropTypes from 'prop-types';

const EmptyState = (props) => (
    <div className="ui-empty-state">
        <div className="ui-empty-state__title">
            {props.title}
        </div>

        <div className="ui-empty-state__text">
            {props.text}
        </div>

        <div className="ui-empty-state__action">
            {props.action}
        </div>
    </div>
);

EmptyState.propTypes = {
    action: PropTypes.node.isRequired,
    text: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
};

export default EmptyState;
