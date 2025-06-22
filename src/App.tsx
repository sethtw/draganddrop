import { CustomDragLayer, GroupDraggableCard, DraggableCard } from './components'
import { useGroupManager, type Group } from './hooks/useGroupManager'
import type { Item } from './components'
import { useDrop } from 'react-dnd'
import { ItemTypes } from './components/DraggableCard'
import { useRef } from 'react'
import './App.css'

function App() {
  // Initial data configuration
  const initialGroups: Group[] = [
    { id: 'tasks', title: 'Tasks', backgroundColor: '#e3f2fd' },
    { id: 'ideas', title: 'Ideas', backgroundColor: '#f3e5f5' },
  ]

  const initialGroupItems: Record<string, Item[]> = {
    tasks: [
      { id: '1', text: 'Task 1', color: '#ff6b6b' },
      { id: '2', text: 'Task 2', color: '#4ecdc4' },
      { id: '3', text: 'Task 3', color: '#45b7d1' },
      { id: '4', text: 'Task 4', color: '#96ceb4' },
    ],
    ideas: [
      { id: '5', text: 'Idea 1', color: '#feca57' },
      { id: '6', text: 'Idea 2', color: '#ff9ff3' },
      { id: '7', text: 'Idea 3', color: '#54a0ff' },
      { id: '8', text: 'Idea 4', color: '#5f27cd' },
    ],
  }

  const {
    groups,
    groupItems,
    createGroup,
    createNewItem,
    moveItemInGroup,
    transferItem,
    createSingleItemGroup,
  } = useGroupManager({ initialGroups, initialGroupItems })

  const dropZoneRef = useRef<HTMLDivElement>(null)

  // Drop zone for creating single-item groups
  const [{ isOver }, drop] = useDrop({
    accept: ItemTypes.CARD,
    drop: (draggedItem: any, monitor) => {
      // Only handle the drop if no nested target handled it
      if (!monitor.didDrop()) {
        // Create a new single-item group from the dragged item
        createSingleItemGroup(draggedItem)
        return { dropped: true }
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver({ shallow: false }),
    }),
  })

  // Combine the refs
  drop(dropZoneRef)

  // Render individual item or group based on item count
  const renderGroupOrItem = (group: Group) => {
    const items = groupItems[group.id] || []
    
    // If group has only one item, render the item directly
    if (items.length === 1) {
      const item = items[0]
      return (
        <DraggableCard
          key={item.id}
          item={item}
          index={0}
          moveCard={(dragIndex, hoverIndex) => moveItemInGroup(group.id, dragIndex, hoverIndex)}
          groupId={group.id}
          transferItem={transferItem}
          isSingleItemGroup={true}
        />
      )
    }
    
    // If group has multiple items or is empty, render the group
    return (
      <GroupDraggableCard
        key={group.id}
        groupId={group.id}
        title={group.title}
        items={items}
        moveCard={(dragIndex, hoverIndex) => moveItemInGroup(group.id, dragIndex, hoverIndex)}
        transferItem={transferItem}
        backgroundColor={group.backgroundColor}
      />
    )
  }

  return (
    <div style={{ 
      padding: 20, 
      fontFamily: 'Arial, sans-serif',
      width: '100%',
      maxWidth: '1400px',
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
        Dynamic Group Drag and Drop Interface
      </h1>
      
      {/* Control Buttons */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '20px',
        marginBottom: '30px'
      }}>
        <button
          onClick={createGroup}
          style={{
            padding: '12px 24px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            cursor: 'pointer',
            fontWeight: 'bold',
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
            transition: 'all 0.2s ease'
          }}
          onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
          + Create New Group
        </button>
        <button
          onClick={createNewItem}
          style={{
            padding: '12px 24px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            cursor: 'pointer',
            fontWeight: 'bold',
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
            transition: 'all 0.2s ease'
          }}
          onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
          + Create New Item
        </button>
      </div>

      <div 
        ref={dropZoneRef}
        className="drop-zone"
        style={{ 
          display: 'flex', 
          justifyContent: 'center',
          minHeight: '600px',
          padding: '30px',
          backgroundColor: isOver ? 'rgba(0, 123, 255, 0.1)' : 'rgba(255, 255, 255, 0.95)',
          borderRadius: 16,
          border: isOver ? '3px dashed #007bff' : '2px dashed #dee2e6',
          backdropFilter: 'blur(10px)',
          boxShadow: isOver ? '0 8px 32px rgba(0,123,255,0.2)' : '0 8px 32px rgba(0,0,0,0.1)',
          transition: 'all 0.2s ease',
          position: 'relative'
        }}
      >
        {isOver && (
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            color: '#007bff',
            fontSize: '1.2rem',
            fontWeight: 'bold',
            pointerEvents: 'none',
            zIndex: 10
          }}>
            Drop here to create a new group
          </div>
        )}
        <div style={{ 
          display: 'flex', 
          flexDirection: 'row', 
          alignItems: 'flex-start',
          justifyContent: 'center',
          width: '100%',
          gap: '20px',
          flexWrap: 'wrap'
        }}>
          {/* Render groups or individual items */}
          {groups.map(group => renderGroupOrItem(group))}
        </div>
      </div>
      <CustomDragLayer />
    </div>
  )
}

export default App
