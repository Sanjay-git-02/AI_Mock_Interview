import React from 'react'
import {Control, Controller, FieldValues, Path} from "react-hook-form";
import {Input} from "@/components/ui/input";
import {FormControl, FormItem, FormLabel} from "@/components/ui/form";

interface FormFieldProps<T extends FieldValues>{
    control:Control<T>;
    name:Path<T>;
    label:string;
    placeholder?:string;
    type?: 'text' | 'password' | 'email' | 'file'
}

const FormField = ({control,name,label,placeholder,type="text"} : FormFieldProps<T>) => (
    <Controller
        control={control}
        name={name}
        render={({field}) => (
            <FormItem>
                <FormLabel>{label}</FormLabel>
                <FormControl>
                    <Input className="input" type={type} placeholder={placeholder} {...field}/>
                </FormControl>
            </FormItem>
        )}
    />
)
export default FormField
