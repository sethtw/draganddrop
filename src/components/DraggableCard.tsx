import { useRef } from 'react'
import { useDrag, useDrop } from 'react-dnd'
import './DraggableComponents.css'

export interface Item {
  id: string
  text: string
  color: string
}

export const ItemTypes = {
  CARD: 'card'
}

interface DraggableCardProps {
  item: Item
  index: number
  moveCard: (dragIndex: number, hoverIndex: number) => void
}

// Draggable card component
const DraggableCard = ({ 
  item, 
  index, 
  moveCard 
}: DraggableCardProps) => {
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

export default DraggableCard 