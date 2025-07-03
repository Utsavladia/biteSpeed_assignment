// textNode.js

import { useMemo, useState, useRef } from 'react';
import { Position } from 'reactflow';
import { shallow } from 'zustand/shallow';
import { useStore } from '../store';
import { BaseNode } from './BaseNode';
import { AutocompleteMenu } from './AutocompleteMenu';

const selector = (state) => ({
  updateNodeField: state.updateNodeField,
  nodes: state.nodes,
  onConnect: state.onConnect,
});

export const TextNode = ({ id, data }) => {
  const { updateNodeField, nodes, onConnect } = useStore(selector, shallow);
  const textareaRef = useRef(null);
  const [autocomplete, setAutocomplete] = useState({
    show: false,
    suggestions: [],
    position: { top: 0, left: 0 },
  });

  const inputNodeNames = useMemo(() =>
    nodes
      .filter(node => node.type === 'customInput' && node.data.inputName)
      .map(node => node.data.inputName),
    [nodes]
  );

  const handleTextChange = (e) => {
    const text = e.target.value;
    updateNodeField(id, 'text', text);

    const cursorPos = e.target.selectionStart;
    const textBeforeCursor = text.substring(0, cursorPos);
    const match = textBeforeCursor.match(/{{\s*([a-zA-Z0-9_]*)$/);

    if (match) {
      const query = match[1];
      const suggestions = inputNodeNames.filter(name => name.toLowerCase().includes(query.toLowerCase()));

      const textareaElem = textareaRef.current;
      if (textareaElem) {
        setAutocomplete({
          show: true,
          suggestions,
          position: {
            top: textareaElem.offsetTop + textareaElem.offsetHeight + 5,
            left: textareaElem.offsetLeft,
          },
        });
      }
    } else {
      setAutocomplete(prev => ({ ...prev, show: false }));
    }
  };

  const handleSelectSuggestion = (suggestion) => {
    const text = data.text || '';
    const cursorPos = textareaRef.current.selectionStart;

    const textBeforeCursor = text.substring(0, cursorPos);
    const textAfterCursor = text.substring(cursorPos);

    const replacedText = textBeforeCursor.replace(/{{\s*([a-zA-Z0-9_]*)$/, `{{${suggestion}}}`);
    const newText = replacedText + textAfterCursor;

    updateNodeField(id, 'text', newText);
    setAutocomplete(prev => ({ ...prev, show: false }));

    const sourceNode = nodes.find(
      (n) => n.type === 'customInput' && n.data.inputName === suggestion
    );

    if (sourceNode) {
      onConnect({
        source: sourceNode.id,
        sourceHandle: `${sourceNode.id}-value`,
        target: id,
        targetHandle: `${id}-${suggestion}`,
      });
    }

    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        const newCursorPos = replacedText.length;
        textareaRef.current.setSelectionRange(newCursorPos, newCursorPos);
      }
    }, 0);
  };

  const handles = useMemo(() => {
    const text = data.text || '';
    const variableRegex = /{{\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*}}/g;
    const variables = new Set();
    let match;
    while ((match = variableRegex.exec(text)) !== null) {
      variables.add(match[1]);
    }

    const varArray = Array.from(variables);
    const targetHandles = varArray.map((variable, index) => ({
      type: 'target',
      position: Position.Left,
      id: `${id}-${variable}`,
      style: { top: `${(index + 1) * 100 / (varArray.length + 1)}%` },
    }));

    return [
      {
        type: 'source',
        position: Position.Right,
        id: `${id}-output`,
      },
      ...targetHandles,
    ];
  }, [data.text, id]);

  return (
    <BaseNode
      title="Text"
      fields={[
        {
          key: 'text',
          label: 'Text:',
          type: 'textarea',
          value: data.text || '',
          onChange: handleTextChange,
          ref: textareaRef,
        },
      ]}
      handles={handles}
    >
      {autocomplete.show && (
        <AutocompleteMenu
          suggestions={autocomplete.suggestions}
          onSelect={handleSelectSuggestion}
          position={autocomplete.position}
        />
      )}
    </BaseNode>
  );
};
