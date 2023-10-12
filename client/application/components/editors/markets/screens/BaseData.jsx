import React from 'react';
import validate from 'helpers/validate';
import TextField from 'atoms/TextField';
import DatePicker from 'atoms/DatePicker';
import Form, { FormItem, FormGroup } from 'molecules/Form';

const BaseData = () => (
    <Form>
        <FormGroup>
            <FormItem
                label="Name"
                name="name"
                validators={[{
                    message: 'Bitte gib einen Namen an.',
                    isValid: validate.required(),
                }]}
            >
                <TextField />
            </FormItem>

            <FormItem
                label="Start"
                name="startDate"
                validators={[{
                    message: 'Bitte gib ein Startdatum an.',
                    isValid: validate.required(),
                }]}
            >
                <DatePicker />
            </FormItem>

            <FormItem
                label="Ende"
                name="endDate"
                validators={[{
                    message: 'Bitte gib ein Enddatum an.',
                    isValid: validate.required(),
                }]}
            >
                <DatePicker />
            </FormItem>
        </FormGroup>
    </Form>
);

export default BaseData;
