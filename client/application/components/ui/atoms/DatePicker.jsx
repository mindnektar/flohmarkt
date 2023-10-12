import React, { useState, useEffect, useContext } from 'react';
import moment from 'moment';
import Calendar from 'react-calendar';
import OutsideClickHandler from 'react-outside-click-handler';
import FormItemContext from 'contexts/formItem';
import Collapsible from 'molecules/Collapsible';
import TextField from 'atoms/TextField';

const DatePicker = () => {
    const [isDateInputOpen, setIsDateInputOpen] = useState(false);
    const [textFieldValue, setTextFieldValue] = useState('');
    const formItemContext = useContext(FormItemContext);

    useEffect(() => {
        setTextFieldValue(formItemContext.value ? moment(formItemContext.value).format('L') : '');
    }, [formItemContext.value]);

    const showDateInput = () => {
        setIsDateInputOpen(true);
    };

    const hideDateInput = () => {
        setIsDateInputOpen(false);
    };

    const onChangeCalendar = (nextValue) => {
        const date = moment.utc(nextValue.toDateString());
        const currentDate = moment(formItemContext.value);

        date.hour(currentDate.hour()).minute(currentDate.minute());

        formItemContext.onChange(date.toISOString());
        setTextFieldValue(date.format('L'));
        hideDateInput();
    };

    const onChangeTextField = (event) => {
        if (!event.target.value.trim()) {
            formItemContext.onChange(null);

            return;
        }

        const date = moment.utc(event.target.value, 'L');

        if (date.isValid()) {
            if (!moment(date).isSame(formItemContext.value)) {
                formItemContext.onChange(date.toISOString());
                setTextFieldValue(date.format('L'));
            }
        } else {
            setTextFieldValue(moment(formItemContext.value).isValid() ? moment(formItemContext.value).format('L') : '');
        }
    };

    return (
        <div className="ui-date-picker">
            <OutsideClickHandler onOutsideClick={hideDateInput}>
                <TextField
                    onBlur={onChangeTextField}
                    onChange={setTextFieldValue}
                    onFocus={showDateInput}
                    onSubmit={onChangeTextField}
                    selected={isDateInputOpen}
                    value={textFieldValue}
                />

                <Collapsible collapsed={!isDateInputOpen}>
                    <div className="ui-date-picker__calendar">
                        <Calendar
                            locale="de"
                            minDetail="decade"
                            onChange={onChangeCalendar}
                            showFixedNumberOfWeeks
                            value={formItemContext.value ? new Date(formItemContext.value) : null}
                        />
                    </div>
                </Collapsible>
            </OutsideClickHandler>
        </div>
    );
};

export default DatePicker;
