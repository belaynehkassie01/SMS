import { useState } from "react";

/**
 * Generic form handler for ALL CRUD forms
 */
export const useForm = (initialValues = {}, validate) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;

    setValues({
      ...values,
      [name]: value,
    });

    if (validate) {
      const validationErrors = validate({
        ...values,
        [name]: value,
      });

      setErrors(validationErrors);
    }
  };

  // handle blur
  const handleBlur = (e) => {
    const { name } = e.target;

    setTouched({
      ...touched,
      [name]: true,
    });
  };

  // reset form
  const resetForm = () => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  };

  // set values manually (for edit forms)
  const setFormValues = (data) => {
    setValues(data);
  };

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    resetForm,
    setFormValues,
    setValues,
    setErrors,
  };
};