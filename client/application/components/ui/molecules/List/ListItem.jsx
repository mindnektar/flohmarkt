import React from 'react';
import PropTypes from 'prop-types';

const ListItem = (props) => (
    <div className="ui-list-item">
        <div className="ui-list-item__content">
            <div className="ui-list-item__label">
                {props.label}
            </div>

            {props.subLabel && (
                <div className="ui-list-item__sub-label">
                    {props.subLabel}
                </div>
            )}
        </div>
    </div>
);

ListItem.defaultProps = {
    subLabel: null,
};

ListItem.propTypes = {
    label: PropTypes.string.isRequired,
    subLabel: PropTypes.string,
};

export default ListItem;
