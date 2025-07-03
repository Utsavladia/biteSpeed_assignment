// imageNode.js
import { useState } from 'react';
import { Position } from 'reactflow';
import { BaseNode } from './BaseNode';

export const ImageNode = ({ id, data }) => {
    const [url, setUrl] = useState(data?.url || '');

    return (
        <BaseNode
            title="Image"
            fields={[
                {
                    key: 'url',
                    label: 'URL:',
                    type: 'text',
                    value: url,
                    onChange: e => setUrl(e.target.value),
                },
            ]}
            customContent={url && <img src={url} alt="preview" style={{ width: '100%', maxHeight: 40, objectFit: 'contain' }} />}
            handles={[
                {
                    type: 'source',
                    position: Position.Right,
                    id: `${id}-image`,
                },
            ]}
        />
    );
};
