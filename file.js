import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

const ReusableForm = ({ fields, onSubmit }) => {
  // Build a dynamic validation schema
  const validationSchema = yup.object().shape(
    fields.reduce((schema, field) => {
      if (field.validations) {
        schema[field.name] = yup.string();
        field.validations.forEach((rule) => {
          if (rule === 'required') {
            schema[field.name] = schema[field.name].required('This field is required');
          }
          if (rule === 'minLength') {
            schema[field.name] = schema[field.name].min(rule.value, `Minimum length is ${rule.value}`);
          }
        });
      }
      return schema;
    }, {})
  );

  const { handleSubmit, control, errors } = useForm({
    resolver: yupResolver(validationSchema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="grid-container">
        {fields.map((field, index) => (
          <div className={`grid-item ${field.gridLayout}`} key={index}>
            <label htmlFor={field.name}>{field.label}</label>
            <Controller
              name={field.name}
              control={control}
              defaultValue=""
              render={({ field: inputField }) => {
                switch (field.type) {
                  case 'text':
                    return <input {...inputField} type="text" />;
                  case 'number':
                    return <input {...inputField} type="number" />;
                  case 'select':
                    return (
                      <select {...inputField}>
                        {field.options.map((option, idx) => (
                          <option key={idx} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    );
                  case 'checkbox':
                    return <input {...inputField} type="checkbox" />;
                  case 'radio':
                    return field.options.map((option, idx) => (
                      <label key={idx}>
                        <input {...inputField} type="radio" value={option.value} />
                        {option.label}
                      </label>
                    ));
                  case 'file':
                    return <input {...inputField} type="file" />;
                  default:
                    return null;
                }
              }}
            />
            {errors[field.name] && <p className="error">{errors[field.name]?.message}</p>}
          </div>
        ))}
      </div>
      <button type="submit">Submit</button>
    </form>
  );
};

export default ReusableForm;
