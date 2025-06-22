import { useRef, useEffect } from 'react'
import { useDrag, useDrop } from 'react-dnd'
import './DraggableComponents.css'

export interface Item {
  id: string
  text: string
  color: string
}

export const ItemTypes = {
  CARD: 'card',
  GROUP: 'group'
}

interface DraggableCardProps {
  item: Item
  index: number
  moveCard: (dragIndex: number, hoverIndex: number) => void
  groupId: string
  transferItem?: (item: Item, targetGroupId: string) => void
  isSingleItemGroup?: boolean
}

// Draggable card component
const DraggableCard = ({ 
  item, 
  index, 
  moveCard,
  groupId,
  transferItem,
  isSingleItemGroup = false
}: DraggableCardProps) => {
  const ref = useRef<HTMLDivElement>(null)
  const lastMoveRef = useRef<{ dragId: string; targetGroupId: string } | null>(null)

  // Reset lastMoveRef when the item changes (e.g., after a transfer)
  useEffect(() => {
    lastMoveRef.current = null
  }, [item.id, groupId, index])

  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.CARD,
    item: { index, groupId, ...item },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  })

  const [{ isOver }, drop] = useDrop({
    accept: ItemTypes.CARD,
    hover: (draggedItem: any, monitor) => {
      if (!ref.current) {
        return
      }
      const dragIndex = draggedItem.index
      const hoverIndex = index
      const sourceGroupId = draggedItem.groupId
      const targetGroupId = groupId

      if (dragIndex === hoverIndex && sourceGroupId === targetGroupId) {
        return
      }

      // If moving between different groups
      if (sourceGroupId !== targetGroupId) {
        // If this is a single item group and we have transferItem function, handle the transfer
        if (isSingleItemGroup && transferItem) {
          // Check if we've already moved this item to this target group
          if (lastMoveRef.current?.dragId === draggedItem.id && 
              lastMoveRef.current?.targetGroupId === targetGroupId) {
            return
          }
          
          transferItem(draggedItem, targetGroupId)
          lastMoveRef.current = { dragId: draggedItem.id, targetGroupId }
        }
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

      // Call moveCard without mutating the draggedItem
      moveCard(dragIndex, hoverIndex)
      
      // Don't mutate the draggedItem - let the state update handle the index changes
    },
    drop: () => {
      // Reset the last move reference when the drag operation ends
      lastMoveRef.current = null
      return { dropped: true }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
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
        border: isOver && isSingleItemGroup ? '3px dashed #007bff' : 'none',
        borderRadius: isOver && isSingleItemGroup ? 12 : 8,
        transition: 'all 0.2s ease',
        boxShadow: isOver && isSingleItemGroup ? '0 4px 12px rgba(0,123,255,0.3)' : '0 2px 4px rgba(0,0,0,0.1)',
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