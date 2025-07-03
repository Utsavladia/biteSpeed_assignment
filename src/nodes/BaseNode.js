// BaseNode.js
import { useState, useLayoutEffect, useRef } from 'react';
import { Handle, Position } from 'reactflow';
import styles from './BaseNode.module.css';

/**
 * fields: [
 *   { key, label, type, value, onChange, options (for select), ... }
 * ]
 * handles: [
 *   { type, position, id, style }
 * ]
 */
const TextareaField = ({ field }) => {
    const internalRef = useRef(null);
    const textareaRef = field.ref || internalRef;
    useLayoutEffect(() => {
        const el = textareaRef.current;
        if (el) {
            el.style.height = 'auto';
            el.style.height = `${el.scrollHeight}px`;
        }
    }, [field.value]);

    return (
        <div className={styles.nodeField}>
            <label>
                {/* {field.label} */}
                <textarea
                    ref={textareaRef}
                    value={field.value}
                    onChange={field.onChange}
                    className={styles.nodeTextarea}
                    rows={1}
                />
            </label>
        </div>
    );
};

export const BaseNode = ({
    title = '',
    fields = [],
    handles = [],
    customContent = null,
    style = {},
    children,
}) => {
    return (
        <div className={styles.nodeContainer} style={style}>
            {/* Handles (top) */}
            {handles.filter(h => h.position === Position.Top).map((h, i) => (
                <Handle key={i} {...h} />
            ))}
            <div className={styles.nodeTitle}>{title}</div>
            <div className={styles.nodeFields}>
                {fields.map((field, i) => {
                    if (field.type === 'select') {
                        return (
                            <div className={styles.nodeField} key={i}>
                                <label>
                                    {/* {field.label} */}
                                    <select value={field.value} onChange={field.onChange} className={styles.nodeInput}>
                                        {field.options.map(opt => (
                                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                                        ))}
                                    </select>
                                </label>
                            </div>
                        );
                    } else if (field.type === 'checkbox') {
                        return (
                            <div className={styles.nodeField} key={i}>
                                <label>
                                    {/* {field.label} */}
                                    <input type="checkbox" checked={field.value} onChange={field.onChange} className={styles.nodeInput} />
                                </label>
                            </div>
                        );
                    } else if (field.type === 'textarea') {
                        return <TextareaField key={i} field={field} />;
                    } else {
                        // text, number, etc.
                        return (
                            <div className={styles.nodeField} key={i}>
                                <label>

                                    <input type={field.type} placeholder={field.label} value={field.value} onChange={field.onChange} className={styles.nodeInput} />
                                </label>
                            </div>
                        );
                    }
                })}
                {customContent}
            </div>
            {children}
            {/* Handles (left, right, bottom) */}
            {handles.filter(h => h.position !== Position.Top).map((h, i) => (
                <Handle key={i} {...h} />
            ))}
        </div>
    );
};
