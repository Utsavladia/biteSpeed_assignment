// toggleNode.js
import { useState } from 'react';
import { Position } from 'reactflow';
import { BaseNode } from './BaseNode';

export const ToggleNode = ({ id, data }) => {
    const [enabled, setEnabled] = useState(!!data?.enabled);

    return (
        <BaseNode
            title="Toggle"
            fields={[
                {
                    key: 'enabled',
                    label: 'Enabled:',
                    type: 'checkbox',
                    value: enabled,
                    onChange: e => setEnabled(e.target.checked),
                },
            ]}
            handles={[
                {
                    type: 'source',
                    position: Position.Right,
                    id: `${id}-toggle`,
                },
            ]}
        />
    );
};
