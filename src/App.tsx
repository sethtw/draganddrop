import { useState, useRef } from 'react'
import { useDrag, useDrop, useDragLayer } from 'react-dnd'
import './App.css'

interface Item {
  id: string
  text: string
  color: string
}

const ItemTypes = {
  CARD: 'card'
}

// Custom drag layer component
const CustomDragLayer = () => {
  const { isDragging, item, currentOffset } = useDragLayer((monitor) => ({
    item: monitor.getItem(),
    currentOffset: monitor.getSourceClientOffset(),
    isDragging: monitor.isDragging(),
  }))

  if (!isDragging || !currentOffset) {
    return null
  }

  const { x, y } = currentOffset

  return (
    <div
      style={{
        position: 'fixed',
        pointerEvents: 'none',
        zIndex: 100,
        left: x,
        top: y,
        transform: 'rotate(-5deg)',
        opacity: 0.75,
      }}
    >
      <div
        style={{
          width: 200,
          height: 80,
          backgroundColor: item.color,
          borderRadius: 8,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontWeight: 'bold',
          boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
        }}
      >
        {item.text}
      </div>
    </div>
  )
}

// Draggable card component
const DraggableCard = ({ 
  item, 
  index, 
  moveCard 
}: { 
  item: Item
  index: number
  moveCard: (dragIndex: number, hoverIndex: number) => void
}) => {
  const ref = useRef<HTMLDivElement>(null)

  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.CARD,
    item: { index, ...item },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  })

  const [, drop] = useDrop({
    accept: ItemTypes.CARD,
    hover: (draggedItem: any, monitor) => {
      if (!ref.current) {
        return
      }
      const dragIndex = draggedItem.index
      const hoverIndex = index

      if (dragIndex === hoverIndex) {
        return
      }

      const hoverBoundingRect = ref.current?.getBoundingClientRect()
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2
      const clientOffset = monitor.getClientOffset()
      const hoverClientY = clientOffset!.y - hoverBoundingRect.top

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return
      }

      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return
      }

      moveCard(dragIndex, hoverIndex)
      draggedItem.index = hoverIndex
    },
  })

  drag(drop(ref))

  return (
    <div
      ref={ref}
      className="draggable-card"
      style={{
        opacity: isDragging ? 0.5 : 1,
        cursor: 'move',
        marginBottom: 12,
      }}
    >
      <div
        style={{
          width: 200,
          height: 80,
          backgroundColor: item.color,
          borderRadius: 8,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontWeight: 'bold',
          fontSize: '16px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          transition: 'all 0.2s ease',
          userSelect: 'none',
        }}
      >
        {item.text}
      </div>
    </div>
  )
}

function App() {
  const [cards, setCards] = useState<Item[]>([
    { id: '1', text: 'Item 1', color: '#ff6b6b' },
    { id: '2', text: 'Item 2', color: '#4ecdc4' },
    { id: '3', text: 'Item 3', color: '#45b7d1' },
    { id: '4', text: 'Item 4', color: '#96ceb4' },
    { id: '5', text: 'Item 5', color: '#feca57' },
  ])

  const moveCard = (dragIndex: number, hoverIndex: number) => {
    const dragCard = cards[dragIndex]
    const newCards = [...cards]
    newCards.splice(dragIndex, 1)
    newCards.splice(hoverIndex, 0, dragCard)
    setCards(newCards)
  }

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
          {cards.map((card, index) => (
            <DraggableCard
              key={card.id}
              item={card}
              index={index}
              moveCard={moveCard}
            />
          ))}
        </div>
      </div>
      <CustomDragLayer />
    </div>
  )
}

export default App
