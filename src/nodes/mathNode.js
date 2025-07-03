// mathNode.js
import { useState } from 'react';
import { Position } from 'reactflow';
import { BaseNode } from './BaseNode';

export const MathNode = ({ id, data }) => {
    const [a, setA] = useState(data?.a || '');
    const [b, setB] = useState(data?.b || '');
    const [op, setOp] = useState(data?.op || '+');

    return (
        <BaseNode
            title="Math"
            fields={[
                {
                    key: 'a',
                    label: 'number a',
                    type: 'number',
                    value: a,
                    onChange: e => setA(Number(e.target.value)),
                },
                {
                    key: 'b',
                    label: 'number b',
                    type: 'number',
                    value: b,
                    onChange: e => setB(Number(e.target.value)),
                },
                {
                    key: 'op',
                    label: 'operation',
                    type: 'select',
                    value: op,
                    onChange: e => setOp(e.target.value),
                    options: [
                        { value: '+', label: '+' },
                        { value: '-', label: '-' },
                        { value: '*', label: '*' },
                        { value: '/', label: '/' },
                    ],
                },
            ]}
            handles={[
                {
                    type: 'source',
                    position: Position.Right,
                    id: `${id}-result`,
                },
            ]}
        />
    );
};
