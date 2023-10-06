import React from 'react';
import PropTypes from 'prop-types';
import FormItem, { FORM_ITEM_LABEL_HEIGHT_AUTO, FORM_ITEM_LABEL_HEIGHT_SMALL } from './Form/FormItem';
import FormGroup from './Form/FormGroup';
import FormText from './Form/FormText';

const Form = (props) => (
    <div>
        {props.children}
    </div>
);

Form.propTypes = {
    children: PropTypes.node.isRequired,
};

export default Form;
export {
    FormItem,
    FormGroup,
    FormText,
    FORM_ITEM_LABEL_HEIGHT_AUTO,
    FORM_ITEM_LABEL_HEIGHT_SMALL,
};
