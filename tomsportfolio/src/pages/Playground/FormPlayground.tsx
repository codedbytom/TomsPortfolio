import React from 'react';
import {FormBuilder } from './components/FormBuilder';
import {FormField} from './types';
import {MainLayout} from '../../components/Layout';

const formConfig: FormField[] = [
    { type: 'text', name:'firstName', label:'First Name', required: true},
    { type: 'email', name:'email', label:'Email Address', required: true},
    { type: 'select', name: 'country', label: 'Country', options: ['USA', 'Canada', 'UK'], required: false},
    { type: 'checkbox', name: 'subscribe', label: 'Subscribe to Newsletter', required: false},
];

const handleFormSubmit = (data: Record<string, string>) =>{
    console.log('Form submitted:', data);
};

const FormPlayground = () => {
    return (
        <MainLayout>
            <div>
            <h1>Form Playground</h1>
            <FormBuilder config={formConfig} onSubmit={handleFormSubmit}></FormBuilder>
            </div>    
        </MainLayout>
        
);
};


export default FormPlayground;