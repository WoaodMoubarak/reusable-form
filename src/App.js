import React from 'react';
import ReusableForm from './components/ReusableForm';
import fields from './formFields.json'; // If you used an external JSON file
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

const App = () => {
  const handleFormSubmit = (data) => {
    console.log('Form Data: ', data);
  };

  return (
    <div className="container">
      <h1>Reusable Form</h1>
      <ReusableForm fields={fields} onSubmit={handleFormSubmit} />
    </div>
  );
};

export default App;

