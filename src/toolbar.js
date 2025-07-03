// toolbar.js

import { useState } from 'react';
import { DraggableNode } from './draggableNode';
import './toolbar.css';
import { Icon } from './Icon';


const nodeMeta = [
    { type: 'customInput', label: 'Input' },
    { type: 'llm', label: 'LLM' },
    { type: 'customOutput', label: 'Output' },
    { type: 'text', label: 'Text' },
    { type: 'math', label: 'Math' },
    { type: 'image', label: 'Image' },
    { type: 'date', label: 'Date' },
    { type: 'toggle', label: 'Toggle' },
    { type: 'select', label: 'Select' },
];

export const PipelineToolbar = () => {
    const [search, setSearch] = useState('');
    const [active, setActive] = useState(false);
    const filteredNodes = nodeMeta.filter(meta =>
        meta.label.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="toolbarContainer">
            <div className={`searchBarWrapper${active ? ' searchBarActive' : ''}`}>
                <input
                    type="text"
                    placeholder="Search nodes..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    onFocus={() => setActive(true)}
                    onBlur={() => setActive(false)}
                    className="searchBarInput"
                />
                <span className="searchBarIcon">
                    <Icon iconName="search" size={16} style={{ color: 'rgb(198, 198, 198)' }} />
                </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', width: '100%', overflowY: 'auto', flex: 1, padding: '5px' }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', width: '100%' }}>
                    {filteredNodes.map(meta => (
                        <DraggableNode key={meta.type} type={meta.type} label={meta.label} />
                    ))}
                </div>
            </div>
        </div>
    );
};
