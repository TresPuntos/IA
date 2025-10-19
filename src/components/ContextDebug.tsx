import React from 'react';
import { useConfig } from '../lib/ConfigContext';

export function ContextDebug() {
  const { config, updateConfig, saveConfiguration } = useConfig();

  const handleTest = async () => {
    console.log('🧪 Context Debug - Config:', config);
    console.log('🧪 Context Debug - System Prompt:', config.systemPrompt);
    const result = await saveConfiguration();
    console.log('🧪 Context Debug - Save Result:', result);
    alert(`System Prompt: "${config.systemPrompt}"\nSave Result: ${result.success ? 'Success' : 'Failed'}`);
  };

  return (
    <div style={{ 
      position: 'fixed', 
      top: '10px', 
      right: '10px', 
      background: 'white', 
      border: '2px solid green', 
      padding: '10px',
      zIndex: 9999,
      fontSize: '12px',
      maxWidth: '300px'
    }}>
      <h4>🔍 CONTEXT DEBUG</h4>
      <p><strong>Site ID:</strong> {config.siteId}</p>
      <p><strong>System Prompt Length:</strong> {config.systemPrompt.length}</p>
      <p><strong>System Prompt Preview:</strong></p>
      <div style={{ 
        background: '#f5f5f5', 
        padding: '5px', 
        fontSize: '10px',
        maxHeight: '60px',
        overflow: 'auto'
      }}>
        {config.systemPrompt.substring(0, 100)}...
      </div>
      <button onClick={handleTest} style={{ margin: '5px', fontSize: '10px' }}>
        Test Context
      </button>
    </div>
  );
}
