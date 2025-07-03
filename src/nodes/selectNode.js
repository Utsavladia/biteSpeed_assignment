// selectNode.js
import { useState } from 'react';
import { Position } from 'reactflow';
import { BaseNode } from './BaseNode';

export const SelectNode = ({ id, data }) => {
    const [selected, setSelected] = useState(data?.selected || 'option1');

    return (
        <BaseNode
            title="Select"
            fields={[
                {
                    key: 'selected',
                    label: 'Select:',
                    type: 'select',
                    value: selected,
                    onChange: e => setSelected(e.target.value),
                    options: [
                        { value: 'option1', label: 'Option 1' },
                        { value: 'option2', label: 'Option 2' },
                        { value: 'option3', label: 'Option 3' },
                    ],
                },
            ]}
            handles={[
                {
                    type: 'source',
                    position: Position.Right,
                    id: `${id}-select`,
                },
            ]}
        />
    );
};
