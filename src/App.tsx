import { CustomDragLayer, DraggableCard, useSortableList } from './components'
import type { Item } from './components'
import './App.css'

function App() {
  const initialItems: Item[] = [
    { id: '1', text: 'Item 1', color: '#ff6b6b' },
    { id: '2', text: 'Item 2', color: '#4ecdc4' },
    { id: '3', text: 'Item 3', color: '#45b7d1' },
    { id: '4', text: 'Item 4', color: '#96ceb4' },
    { id: '5', text: 'Item 5', color: '#feca57' },
  ]

  const { items, moveItem } = useSortableList(initialItems)

  return (
    <div style={{ 
      padding: 20, 
      fontFamily: 'Arial, sans-serif',
      width: '100%',
      maxWidth: '600px',
      margin: '0 auto'
    }}>
      <h1 style={{ 
        textAlign: 'center', 
        marginBottom: 30, 
        color: 'white',
        fontSize: '2.5rem',
        fontWeight: 'bold',
        textShadow: '0 2px 4px rgba(0,0,0,0.3)'
      }}>
        Drag and Drop Interface
      </h1>
      <div 
        className="drop-zone"
        style={{ 
          display: 'flex', 
          justifyContent: 'center',
          minHeight: '500px',
          padding: '30px',
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          borderRadius: 16,
          border: '2px dashed #dee2e6',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
        }}
      >
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center',
          width: '100%'
        }}>
          {items.map((item, index) => (
            <DraggableCard
              key={item.id}
              item={item}
              index={index}
              moveCard={moveItem}
            />
          ))}
        </div>
      </div>
      <CustomDragLayer />
    </div>
  )
}

export default App
