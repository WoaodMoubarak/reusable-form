import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';


const ReusableForm = ({ fields, onSubmit }) => {
  
  const validationSchema = yup.object().shape(
    fields.reduce((schema, field) => {
      if (field.validations?.required) {
        schema[field.name] = yup
          .string()
          .required(`${field.label} is required`);
        if (field.validations.minLength) {
          schema[field.name] = schema[field.name].min(
            field.validations.minLength,
            `${field.label} must be at least ${field.validations.minLength} characters`
          );
        }
        if (field.type === 'number') {
          schema[field.name] = yup
            .number()
            .typeError(`${field.label} must be a number`)
            .required(`${field.label} is required`)
            .min(field.validations.min || 0, `${field.label} must be greater than or equal to ${field.validations.min}`);
        }
      }
      return schema;
    }, {})
  );

  const { handleSubmit, control } = useForm({
    resolver: yupResolver(validationSchema),
  });

  return (
    <div className="form-container">
    <form onSubmit={handleSubmit(onSubmit)} className="row">
      {fields.map((field) => (
        <div key={field.name} className={field.gridLayout || 'col-12'}>
          <label>{field.label}</label>
          <Controller
            name={field.name}
            control={control}
            render={({ field: controllerField }) => {
              switch (field.type) {
                case 'text':
                case 'number':
                  return <input {...controllerField} type={field.type} className="form-control" />;
                  
                case 'radio':
                  return field.options.map((option) => (
                    <div key={option} className="form-check">
                      <input
                        {...controllerField}
                        type="radio"
                        value={option}
                        id={`${field.name}-${option}`}
                        className="form-check-input"
                      />
                      <label className="form-check-label" htmlFor={`${field.name}-${option}`}>
                        {option}
                      </label>
                    </div>
                  ));

                case 'checkbox':
                  return (
                    <div className="form-check form-check-inline">
  <input
    {...controllerField}
    type="checkbox"
    className="form-check-input"
    id={field.name}
  />
  <span>Subscribe to newsletter</span>
</div>

                  );

                case 'select':
                  return (
                    <select {...controllerField} className="form-control">
                      {field.options.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  );

                case 'file':
                  return <input {...controllerField} type="file" className="form-control" />;

                case 'range':
                  return (
                    <input
                      {...controllerField}
                      type="range"
                      min={field.validations?.min || 0}
                      max={field.validations?.max || 100}
                      className="form-range"
                    />
                  );

                default:
                  return null;
              }
            }}
          />
        </div>
      ))}
      <button type="submit" className="btn btn-primary mt-3">
        Submit
      </button>
    </form>
</div>

  );
};
export default ReusableForm;
