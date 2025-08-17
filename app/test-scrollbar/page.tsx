"use client"

import React from "react"

export default function TestScrollbarPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Test des Scrollbars</h1>
      
      {/* Test 1: Scrollbar horizontale simple */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4">Test 1: Scrollbar horizontale</h2>
        <div 
          className="w-96 h-20 bg-gray-100 border rounded p-4 overflow-x-scroll test-scrollbar"
          style={{
            scrollbarWidth: 'thin',
            scrollbarColor: '#8b5cf6 #e5e7eb'
          }}
        >
          <div className="flex gap-4" style={{ width: '800px' }}>
            {Array.from({ length: 20 }, (_, i) => (
              <div key={i} className="bg-blue-200 p-2 rounded whitespace-nowrap">
                Élément {i + 1}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Test 2: Scrollbar avec classe messe-tabs-scrollbar */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4">Test 2: Classe messe-tabs-scrollbar</h2>
        <div className="w-96 h-20 bg-gray-100 border rounded p-4 messe-tabs-scrollbar">
          <div className="flex gap-4" style={{ width: '800px' }}>
            {Array.from({ length: 20 }, (_, i) => (
              <div key={i} className="bg-green-200 p-2 rounded whitespace-nowrap">
                Messe {i + 1}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Test 3: Scrollbar avec classe readings-tabs-scrollbar */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4">Test 3: Classe readings-tabs-scrollbar</h2>
        <div className="w-96 h-20 bg-gray-100 border rounded p-4 readings-tabs-scrollbar">
          <div className="flex gap-4" style={{ width: '800px' }}>
            {Array.from({ length: 20 }, (_, i) => (
              <div key={i} className="bg-purple-200 p-2 rounded whitespace-nowrap">
                Lecture {i + 1}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-yellow-100 p-4 rounded">
        <h3 className="font-semibold mb-2">Instructions de test :</h3>
        <ul className="list-disc list-inside space-y-1">
          <li>Vous devriez voir des scrollbars violettes de 12px de large</li>
          <li>Utilisez la molette de la souris pour faire défiler horizontalement</li>
          <li>Si aucune scrollbar n'apparaît, il y a un problème avec le CSS</li>
        </ul>
      </div>
    </div>
  )
}
