import React from 'react';
import { AIWidget } from './components/AIWidget';

export default function WidgetPage() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px'
    }}>
      <AIWidget />
    </div>
  );
}
