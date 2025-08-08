import React, { useState } from "react";
import {FormField} from "../types";

interface FormBuilderProps {
    config: FormField[];
    onSubmit: (data: Record<string, string>) => void;
}

export const FormBuilder: React.FC<FormBuilderProps> = ({ config, onSubmit }) => {
    const [formData, setFormData] = useState<Record<string, any>>({});

    const handleChange = (name: string, value: any) =>{
        setFormData(prev => ({...prev, [name]: value}))
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    const renderField = (field: FormField) => {
        const {name, label, required} = field;

        switch(field.type){
            case 'text':
                return (
                    <div key={name} className="mb-4">
                        <label>{label}</label>
                        <input
                            type={field.type}
                            name={name}
                            value={formData[name] || ''}
                            onChange={(e) => handleChange(name, e.target.value)}
                            required={required}
                        />
                        {required && <span className="text-red-500">*</span>}
                    </div>
                );
            case 'select':
                return (
                    <div key={name} className="mb-4">
                        <label>{label}</label>
                        <select 
                            required={required}
                            value={formData[name] || ''}
                            onChange={e => handleChange(name, e.target.value)}
                            >
                            <option value="">Select an option</option>
                                {field.options?.map(option => (
                                    <option key={option} value={option}>{option}</option>
                                ))}
                            </select>
                    </div>
                );
            case 'checkbox':
                return (
                    <div key={name} className="mb-4">
                        <label>
                        <input
                            type="checkbox"
                            checked={formData[name] || false}
                            onChange={e => handleChange(name, e.target.checked)}
                        />
                        {label}
                        </label>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-md mx-auto">
            {config.map(field => renderField(field))}
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md">Submit</button>
        </form>
    );
};
