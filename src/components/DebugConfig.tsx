import React from 'react';
import { useConfig } from '../lib/ConfigContext';

export function DebugConfig() {
  const { config, updateConfig, saveConfiguration } = useConfig();

  const handleTestSave = async () => {
    console.log('🧪 TEST: Intentando guardar configuración...');
    const result = await saveConfiguration();
    console.log('🧪 TEST: Resultado:', result);
    alert(`Resultado: ${result.success ? 'Éxito' : 'Error'}\n${result.error || ''}`);
  };

  const handleTestUpdate = () => {
    console.log('🧪 TEST: Actualizando system prompt...');
    updateConfig({ 
      systemPrompt: `Test prompt actualizado: ${new Date().toLocaleTimeString()}` 
    });
  };

  return (
    <div style={{ 
      position: 'fixed', 
      top: '10px', 
      right: '10px', 
      background: 'white', 
      border: '2px solid red', 
      padding: '10px',
      zIndex: 9999,
      fontSize: '12px'
    }}>
      <h4>🐛 DEBUG CONFIG</h4>
      <p><strong>System Prompt:</strong></p>
      <textarea 
        value={config.systemPrompt} 
        onChange={(e) => updateConfig({ systemPrompt: e.target.value })}
        style={{ width: '200px', height: '60px', fontSize: '10px' }}
      />
      <br/>
      <button onClick={handleTestUpdate} style={{ margin: '5px' }}>
        Test Update
      </button>
      <button onClick={handleTestSave} style={{ margin: '5px' }}>
        Test Save
      </button>
      <p><strong>Config completa:</strong></p>
      <pre style={{ fontSize: '8px', maxHeight: '100px', overflow: 'auto' }}>
        {JSON.stringify(config, null, 2)}
      </pre>
    </div>
  );
}
