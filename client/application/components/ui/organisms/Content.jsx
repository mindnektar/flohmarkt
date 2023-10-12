import React from 'react';
import PropTypes from 'prop-types';
import Loading from 'molecules/Loading';
import EmptyState from 'molecules/EmptyState';

const Content = (props) => {
    const renderBody = () => (
        props.emptyState?.condition ? (
            <EmptyState
                action={props.action}
                text={props.emptyState.text}
                title={props.emptyState.title}
            />
        ) : (
            <>
                {props.children}

                <div className="ui-content__action">
                    {props.action}
                </div>
            </>
        )
    );

    return (
        <div className="ui-content">
            <div className="ui-content__header">
                {props.headline}
            </div>

            <div className="ui-content__body">
                {props.children ? (
                    renderBody()
                ) : (
                    <Loading />
                )}
            </div>
        </div>
    );
};

Content.defaultProps = {
    action: null,
    children: null,
    emptyState: null,
};

Content.propTypes = {
    action: PropTypes.node,
    children: PropTypes.node,
    emptyState: PropTypes.shape({
        condition: PropTypes.bool.isRequired,
        text: PropTypes.string,
        title: PropTypes.string.isRequired,
    }),
    headline: PropTypes.string.isRequired,
};

export default Content;
