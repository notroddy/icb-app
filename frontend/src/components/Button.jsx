import React from 'react';

/**
 * Button component.
 * @param {Object} props - Component props.
 * @param {string} props.label - Button label.
 * @param {Function} props.onClick - Click handler.
 * @param {string} props.className - CSS class for the button.
 */
function Button({ label, onClick, className }) {
  return (
    <button className={className} onClick={onClick}>
      {label}
    </button>
  );
}

export default Button;
