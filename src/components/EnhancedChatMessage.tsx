// src/components/EnhancedChatMessage.tsx
import React from 'react';
import { enhanceResponse, type EnhancedResponse } from '../lib/productEnhancer';

interface EnhancedChatMessageProps {
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

export function EnhancedChatMessage({ content, role, timestamp }: EnhancedChatMessageProps) {
  const enhancedResponse: EnhancedResponse = enhanceResponse(content);
  
  if (role === 'user') {
    return (
      <div className="flex gap-3 p-4">
        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
          Tú
        </div>
        <div className="flex-1">
          <div className="text-sm text-gray-500 mb-1">
            {timestamp.toLocaleTimeString()}
          </div>
          <div className="text-gray-900">{content}</div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex gap-3 p-4">
      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
        AI
      </div>
      <div className="flex-1">
        <div className="text-sm text-gray-500 mb-1">
          Asistente {timestamp.toLocaleTimeString()}
        </div>
        <div 
          className="text-gray-900 prose prose-sm max-w-none"
          dangerouslySetInnerHTML={{ __html: enhancedResponse.enhancedHtml }}
        />
        
        {/* Mostrar información adicional si hay productos */}
        {enhancedResponse.products.length > 0 && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <div className="text-sm text-blue-800 font-medium mb-2">
              📦 Productos encontrados: {enhancedResponse.products.length}
            </div>
            <div className="text-xs text-blue-600">
              Haz clic en "Ver Producto" para ir directamente al catálogo de 100%Chef
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
