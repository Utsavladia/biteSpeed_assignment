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

    const handleSubmit = async () => {
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
            const alertMessage = `Pipeline Submission Analysis:
- Number of Nodes: ${result.num_nodes}
- Number of Edges: ${result.num_edges}
- ${dagMessage}`;

            alert(alertMessage);

        } catch (error) {
            console.error("Failed to submit pipeline:", error);
            alert(`Failed to submit pipeline: ${error.message}`);
        }
    };

    return (
        <button type="button" className={styles.ctaButton} onClick={handleSubmit}>Submit</button>
    );
}
