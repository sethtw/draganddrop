import { useState } from 'react'
import { CustomDragLayer, GroupDraggableCard, useSortableList } from './components'
import type { Item } from './components'
import './App.css'

interface Group {
  id: string
  title: string
  backgroundColor: string
}

function App() {
  const [groups, setGroups] = useState<Group[]>([
    { id: 'tasks', title: 'Tasks', backgroundColor: '#e3f2fd' },
    { id: 'ideas', title: 'Ideas', backgroundColor: '#f3e5f5' },
  ])

  const [groupItems, setGroupItems] = useState<Record<string, Item[]>>({
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
  })

  const [ungroupedItems, setUngroupedItems] = useState<Item[]>([])

  // Generate unique IDs
  const generateId = () => Math.random().toString(36).substr(2, 9)

  // Create a new group
  const createGroup = () => {
    const newGroup: Group = {
      id: generateId(),
      title: `Group ${groups.length + 1}`,
      backgroundColor: `hsl(${Math.random() * 360}, 70%, 90%)`,
    }
    setGroups(prev => [...prev, newGroup])
    setGroupItems(prev => ({ ...prev, [newGroup.id]: [] }))
  }

  // Create a new ungrouped item
  const createUngroupedItem = () => {
    const newItem: Item = {
      id: generateId(),
      text: `Item ${ungroupedItems.length + 1}`,
      color: `hsl(${Math.random() * 360}, 70%, 60%)`,
    }
    setUngroupedItems(prev => [...prev, newItem])
  }

  // Move item within a group
  const moveItemInGroup = (groupId: string, dragIndex: number, hoverIndex: number) => {
    setGroupItems(prev => {
      const newGroupItems = { ...prev }
      const items = [...newGroupItems[groupId]]
      const draggedItem = items[dragIndex]
      
      if (!draggedItem) return prev
      
      items.splice(dragIndex, 1)
      items.splice(hoverIndex, 0, draggedItem)
      
      newGroupItems[groupId] = items
      return newGroupItems
    })
  }

  // Transfer item between groups
  const transferItem = (item: Item, targetGroupId: string) => {
    // Remove from ungrouped items if it's there
    setUngroupedItems(prev => prev.filter(i => i.id !== item.id))
    
    // Remove from all groups
    setGroupItems(prev => {
      const newGroupItems = { ...prev }
      Object.keys(newGroupItems).forEach(groupId => {
        newGroupItems[groupId] = newGroupItems[groupId].filter(i => i.id !== item.id)
      })
      return newGroupItems
    })
    
    // Add to target group
    setGroupItems(prev => ({
      ...prev,
      [targetGroupId]: [...(prev[targetGroupId] || []), item]
    }))
  }

  // Move item within ungrouped items
  const moveUngroupedItem = (dragIndex: number, hoverIndex: number) => {
    setUngroupedItems(prev => {
      const newItems = [...prev]
      const draggedItem = newItems[dragIndex]
      
      if (!draggedItem) return prev
      
      newItems.splice(dragIndex, 1)
      newItems.splice(hoverIndex, 0, draggedItem)
      
      return newItems
    })
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
          onClick={createUngroupedItem}
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
        className="drop-zone"
        style={{ 
          display: 'flex', 
          justifyContent: 'center',
          minHeight: '600px',
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
          flexDirection: 'row', 
          alignItems: 'flex-start',
          justifyContent: 'center',
          width: '100%',
          gap: '20px',
          flexWrap: 'wrap'
        }}>
          {/* Ungrouped Items */}
          {ungroupedItems.length > 0 && (
            <GroupDraggableCard
              groupId="ungrouped"
              title="Ungrouped Items"
              items={ungroupedItems}
              moveCard={moveUngroupedItem}
              transferItem={transferItem}
              backgroundColor="#f8f9fa"
            />
          )}
          
          {/* Dynamic Groups */}
          {groups.map(group => (
            <GroupDraggableCard
              key={group.id}
              groupId={group.id}
              title={group.title}
              items={groupItems[group.id] || []}
              moveCard={(dragIndex, hoverIndex) => moveItemInGroup(group.id, dragIndex, hoverIndex)}
              transferItem={transferItem}
              backgroundColor={group.backgroundColor}
            />
          ))}
        </div>
      </div>
      <CustomDragLayer />
    </div>
  )
}

export default App
