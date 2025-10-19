import React from 'react';
import { useConfig } from '../lib/ConfigContext';

export function SimpleDebug() {
  const { config, updateConfig, saveConfiguration } = useConfig();

  const handleTest = async () => {
    console.log('🧪 TEST: Config actual:', config);
    const result = await saveConfiguration();
    console.log('🧪 TEST: Resultado:', result);
    alert(`Resultado: ${result.success ? 'Éxito' : 'Error'}\n${result.error || ''}`);
  };

  return (
    <div style={{ 
      position: 'fixed', 
      top: '10px', 
      right: '10px', 
      background: 'white', 
      border: '2px solid blue', 
      padding: '10px',
      zIndex: 9999,
      fontSize: '12px'
    }}>
      <h4>🔧 DEBUG SIMPLE</h4>
      <p><strong>Site ID:</strong> {config.siteId}</p>
      <p><strong>System Prompt:</strong></p>
      <textarea 
        value={config.systemPrompt} 
        onChange={(e) => updateConfig({ systemPrompt: e.target.value })}
        style={{ width: '200px', height: '60px', fontSize: '10px' }}
      />
      <br/>
      <button onClick={handleTest} style={{ margin: '5px' }}>
        Test Save
      </button>
    </div>
  );
}
