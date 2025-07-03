// inputNode.js

import { Position } from 'reactflow';
import { shallow } from 'zustand/shallow';
import { useStore } from '../store';
import { BaseNode } from './BaseNode';
import './BaseNode.module.css';

const selector = (state) => ({
  updateNodeField: state.updateNodeField,
});

export const InputNode = ({ id, data }) => {
  const { updateNodeField } = useStore(selector, shallow);

  return (
    <BaseNode
      title="Input"
      fields={[
        {
          key: 'name',
          label: 'Name:',
          type: 'text',
          value: data.inputName || '',
          onChange: e => updateNodeField(id, 'inputName', e.target.value),
        },
        {
          key: 'type',
          label: 'Type:',
          type: 'select',
          value: data.inputType || 'Text',
          onChange: e => updateNodeField(id, 'inputType', e.target.value),
          options: [
            { value: 'Text', label: 'Text' },
            { value: 'File', label: 'File' },
          ],
        },
      ]}
      handles={[
        {
          type: 'source',
          position: Position.Right,
          id: `${id}-value`,
        },
      ]}
      customContent={data.inputType === 'File' && (
        <div style={{ marginTop: 8 }}>
          <div className="fileRow">File</div>
          <button className="uploadBtn">Upload file</button>
        </div>
      )}
    />
  );
};
