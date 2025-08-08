import React from 'react';
import {FormBuilder } from './components/FormBuilder';
import {FormField} from './types';

const formConfig: FormField[] = [
    { type: 'text', name:'firstName', label:'First Name', required: true},
    { type: 'email', name:'email', label:'Email Address', required: true},
    { type: 'select', name: 'country', label: 'Country', options: ['USA', 'Canada', 'UK'], required: false},
    { type: 'checkbox', name: 'subscribe', label: 'Subscribe to Newsletter', required: false},
];

const handlFormSubmit = (data: Record<string, string>) =>{
    console.log('Form submitted:', data);
};

const FormPlayground = () => {
    return (
        <div>
            <h1>Form Playground</h1>
            <FormBuilder config={formConfig} onSubmit={handlFormSubmit}></FormBuilder>
        </div>
);
};


export default FormPlayground;