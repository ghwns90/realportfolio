import React from 'react';
import styles from './FormInput.module.css';

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const FormInput: React.FC<FormInputProps> = ({label, error, className, ...props}) => {
  
  return (
    <div className={`${styles.inputGroup} ${className} || ''`}>
      {label && <label className={styles.label}>{label}</label>}
      <input 
        className={`${styles.input} ${error ? styles.errorInput : ''}`} 
        {...props} 
      />
      {error && <span className={styles.errorMessage}>{error}</span>}
    </div>
  );
};

interface FormTextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const FormTextArea: React.FC<FormTextAreaProps> = ({ label, error, className, ...props }) => {
  return (
    <div className={`${styles.inputGroup} ${className || ''}`}>
      {label && <label className={styles.label}>{label}</label>}
      <textarea 
        className={`${styles.textarea} ${error ? styles.errorInput : ''}`} 
        {...props} 
      />
      {error && <span className={styles.errorMessage}>{error}</span>}
    </div>
  );
};