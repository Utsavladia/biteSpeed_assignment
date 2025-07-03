// AutocompleteMenu.js
import React from 'react';
import styles from './AutocompleteMenu.module.css';

export const AutocompleteMenu = ({ suggestions, onSelect, position }) => {
    if (suggestions.length === 0) {
        return null;
    }

    return (
        <div
            className={styles.menu}
            style={{ top: position.top, left: position.left }}
        >
            {suggestions.map((suggestion, index) => (
                <div
                    key={index}
                    className={styles.item}
                    onClick={() => onSelect(suggestion)}
                >
                    {suggestion}
                </div>
            ))}
        </div>
    );
}; 