import React from 'react';
import { useConfig } from '../lib/ConfigContext';

export function ContextDebug() {
  const { config, updateConfig, saveConfiguration } = useConfig();

  const handleTest = async () => {
    console.log('🧪 Context Debug - Full Config:', config);
    console.log('🧪 Context Debug - System Prompt:', config.systemPrompt);
    console.log('🧪 Context Debug - System Prompt Length:', config.systemPrompt.length);
    
    const result = await saveConfiguration();
    console.log('🧪 Context Debug - Save Result:', result);
    
    alert(`System Prompt: "${config.systemPrompt}"\nLength: ${config.systemPrompt.length}\nSave Result: ${result.success ? 'Success' : 'Failed'}\nError: ${result.error || 'None'}`);
  };

  const handleUpdatePrompt = () => {
    const newPrompt = `Test prompt actualizado: ${new Date().toLocaleTimeString()}`;
    console.log('🧪 Updating prompt to:', newPrompt);
    updateConfig({ systemPrompt: newPrompt });
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
      maxWidth: '400px'
    }}>
      <h4>🔍 CONTEXT DEBUG</h4>
      <p><strong>Site ID:</strong> {config.siteId}</p>
      <p><strong>System Prompt Length:</strong> {config.systemPrompt.length}</p>
      <p><strong>System Prompt Preview:</strong></p>
      <div style={{ 
        background: '#f5f5f5', 
        padding: '5px', 
        fontSize: '10px',
        maxHeight: '80px',
        overflow: 'auto',
        border: '1px solid #ccc'
      }}>
        {config.systemPrompt.substring(0, 200)}...
      </div>
      <div style={{ marginTop: '10px' }}>
        <button onClick={handleUpdatePrompt} style={{ margin: '2px', fontSize: '10px' }}>
          Update Prompt
        </button>
        <button onClick={handleTest} style={{ margin: '2px', fontSize: '10px' }}>
          Test Save
        </button>
      </div>
    </div>
  );
}
