import React from 'react';
import PropTypes from 'prop-types';
import useCreateMarket from 'hooks/graphql/mutations/createMarket';
import Modal, { Screen } from 'molecules/Modal';
import BaseData from './screens/BaseData';

const CreateAndUpdate = (props) => {
    const createMarket = useCreateMarket();

    const confirm = async (values) => {
        await createMarket({
            name: values.name.trim(),
            startDate: values.startDate,
            endDate: values.endDate,
        });

        props.close();
    };

    return (
        <Modal
            close={props.close}
            confirmButtonLabel="Speichern"
            formConfig={{
                name: '',
                startDate: '',
                endDate: '',
            }}
            formSubject={props.market}
            isOpen={props.isOpen}
            onConfirm={confirm}
        >
            <Screen headline={props.market ? 'Flohmarkt bearbeiten' : 'Flohmarkt erstellen'}>
                <BaseData />
            </Screen>
        </Modal>
    );
};

CreateAndUpdate.defaultProps = {
    market: null,
};

CreateAndUpdate.propTypes = {
    close: PropTypes.func.isRequired,
    isOpen: PropTypes.bool.isRequired,
    market: PropTypes.object,
};

export default CreateAndUpdate;
