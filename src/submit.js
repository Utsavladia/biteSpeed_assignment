// submit.js

import styles from './submit.module.css';
import { useStore } from './store';
import { shallow } from 'zustand/shallow';

const selector = (state) => ({
    nodes: state.nodes,
    edges: state.edges,
});

export const SubmitButton = () => {
    const { nodes, edges } = useStore(selector, shallow);

    const handleSave = async () => {
        // Validation: More than one node, and more than one node has zero target handles
        if (nodes.length > 1) {
            // For each node, count target handles
            const nodesWithNoTargetHandles = nodes.filter(node => {
                // Handles are usually in node.handles or node.data.handles
                const handles = node.handles || (node.data && node.data.handles) || [];
                // If handles are not present, try to infer from type (fallback: assume 0)
                const targetHandles = handles.filter(h => h.type === 'target');
                return targetHandles.length === 0;
            });
            if (nodesWithNoTargetHandles.length > 1) {
                alert('Error: More than one node has empty target handles. Please ensure only one node has no incoming connections.');
                return;
            }
        }
        try {
            const response = await fetch('http://localhost:8000/pipelines/parse', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ nodes, edges }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();

            const dagMessage = result.is_dag ? 'The pipeline is a valid DAG.' : 'The pipeline has cycles and is not a valid DAG.';
            const alertMessage = `Pipeline Submission Analysis:\n- Number of Nodes: ${result.num_nodes}\n- Number of Edges: ${result.num_edges}\n- ${dagMessage}`;

            alert(alertMessage);

        } catch (error) {
            console.error("Failed to submit pipeline:", error);
            alert(`Failed to submit pipeline: ${error.message}`);
        }
    };

    return (
        <button type="button" className={styles.ctaButton} onClick={handleSave}>Save ✨</button>
    );
}
