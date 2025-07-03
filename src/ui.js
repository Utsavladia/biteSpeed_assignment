// ui.js
// Displays the drag-and-drop UI
// --------------------------------------------------

import { useState, useRef, useCallback } from 'react';
import ReactFlow, { Controls, Background, MiniMap } from 'reactflow';
import { useStore } from './store';
import { shallow } from 'zustand/shallow';
import { InputNode } from './nodes/inputNode';
import { LLMNode } from './nodes/llmNode';
import { OutputNode } from './nodes/outputNode';
import { TextNode } from './nodes/textNode';
import { MathNode } from './nodes/mathNode';
import { ImageNode } from './nodes/imageNode';
import { DateNode } from './nodes/dateNode';
import { ToggleNode } from './nodes/toggleNode';
import { SelectNode } from './nodes/selectNode';
import './index.css';

import 'reactflow/dist/style.css';

const gridSize = 30;
const proOptions = { hideAttribution: true };
const nodeTypes = {
  customInput: InputNode,
  llm: LLMNode,
  customOutput: OutputNode,
  text: TextNode,
  math: MathNode,
  image: ImageNode,
  date: DateNode,
  toggle: ToggleNode,
  select: SelectNode,
};

const selector = (state) => ({
  nodes: state.nodes,
  edges: state.edges,
  getNodeID: state.getNodeID,
  addNode: state.addNode,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  onConnect: state.onConnect,
});

export const PipelineUI = () => {
  const reactFlowWrapper = useRef(null);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const {
    nodes,
    edges,
    getNodeID,
    addNode,
    onNodesChange,
    onEdgesChange,
    onConnect
  } = useStore(selector, shallow);

  const getInitNodeData = (nodeID, type) => {
    let nodeData = { id: nodeID, nodeType: `${type}` };
    if (type === 'customInput') {
      const inputId = nodeID.split('-')[1];
      nodeData.inputName = `input_${inputId}`;
      nodeData.inputType = 'Text';
    } else if (type === 'text') {
      nodeData.text = '{{input}}';
    }
    return nodeData;
  }

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      if (event?.dataTransfer?.getData('application/reactflow')) {
        const appData = JSON.parse(event.dataTransfer.getData('application/reactflow'));
        const type = appData?.nodeType;

        // check if the dropped element is valid
        if (typeof type === 'undefined' || !type) {
          return;
        }

        const position = reactFlowInstance.project({
          x: event.clientX - reactFlowBounds.left - 40,
          y: event.clientY - reactFlowBounds.top - 40,
        });

        const nodeID = getNodeID(type);
        const newNode = {
          id: nodeID,
          type,
          position,
          data: getInitNodeData(nodeID, type),
        };

        addNode(newNode);
      }
    },
    [reactFlowInstance, addNode, getNodeID]
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const isValidConnection = useCallback(
    (connection) => {
      const { source, target, targetHandle } = connection;
      const sourceNode = nodes.find((n) => n.id === source);
      const targetNode = nodes.find((n) => n.id === target);

      if (!sourceNode || !targetNode) {
        return false;
      }

      if (sourceNode.type === 'customInput' && targetNode.type === 'text') {
        const variableName = targetHandle.split('-').slice(2).join('-');
        const sourceVariableName = sourceNode.data.inputName;
        return variableName === sourceVariableName;
      }

      return true;
    },
    [nodes]
  );

  return (
    <>
      <div className="cardContainer" ref={reactFlowWrapper}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onInit={setReactFlowInstance}
          nodeTypes={nodeTypes}
          proOptions={proOptions}
          snapGrid={[gridSize, gridSize]}
          connectionLineType='smoothstep'
          isValidConnection={isValidConnection}
        >
          <Background color="#aaa" gap={gridSize} />
          <Controls />
          <MiniMap
            maskColor="rgba(70, 31, 168, 0.5)"
            nodeColor="rgba(70, 31, 168, 0.5)"
            style={{
              backgroundColor: 'black',
            }}
          />
        </ReactFlow>
      </div>
    </>
  )
}
