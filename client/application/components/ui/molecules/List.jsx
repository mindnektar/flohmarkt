import React from 'react';
import PropTypes from 'prop-types';
import ListItem from './List/ListItem';

const List = (props) => (
    <div className="ui-list">
        {props.children}
    </div>
);

List.propTypes = {
    children: PropTypes.node.isRequired,
};

export default List;

export { ListItem };
