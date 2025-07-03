// draggableNode.js

import { Icon } from './Icon';

export const DraggableNode = ({ type, label }) => {
  const onDragStart = (event, nodeType) => {
    const appData = { nodeType }
    event.target.style.cursor = 'grabbing';
    event.dataTransfer.setData('application/reactflow', JSON.stringify(appData));
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div
      className={type}
      onDragStart={(event) => onDragStart(event, type)}
      onDragEnd={(event) => (event.target.style.cursor = 'grab')}
      style={{
        cursor: 'grab',
        minWidth: '100px',
        height: '120px',
        display: 'flex',
        alignItems: 'center',
        borderRadius: '16px',
        background: 'linear-gradient(180deg,rgb(7, 2, 19) 0%,rgb(20, 7, 48) 100%)',
        justifyContent: 'center',
        flexDirection: 'column',
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
        margin: '4px',
        border: '1px solid rgb(42, 17, 106)',
        padding: '0',
        position: 'relative',
      }}
      draggable
    >
      <div style={{
        width: '100%',
        background: 'rgb(76, 33, 162)',
        color: '#fff',
        borderTopLeftRadius: '16px',
        borderTopRightRadius: '16px',
        textAlign: 'center',
        fontWeight: 500,
        fontSize: '1rem',
        padding: '10px 0 6px 0',
        letterSpacing: '0.5px',
      }}>{label}</div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
        <Icon iconName={type} size={44} style={{ margin: '16px 0 8px 0', color: 'rgb(198, 198, 198)' }} />
        {/* You can add a subtitle or file types here if needed */}
      </div>
    </div>
  );
};
