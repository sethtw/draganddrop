import React from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { 
  DropZone, 
  GroupManager, 
  ControlPanel, 
  CustomDragLayer 
} from './index'
import { useGroupManager } from '../hooks/useGroupManager'
import type { Group } from '../hooks/useGroupManager'

// Example usage of the refactored components
function ExampleApp() {
  // Initial data configuration
  const initialGroups: Group[] = [
    { id: 'tasks', title: 'Tasks', backgroundColor: '#e3f2fd' },
    { id: 'ideas', title: 'Ideas', backgroundColor: '#f3e5f5' },
  ]

  const initialGroupItems = {
    tasks: [
      { id: '1', text: 'Task 1', color: '#ff6b6b' },
      { id: '2', text: 'Task 2', color: '#4ecdc4' },
    ],
    ideas: [
      { id: '3', text: 'Idea 1', color: '#feca57' },
      { id: '4', text: 'Idea 2', color: '#ff9ff3' },
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

  const handleItemDrop = (item: any) => {
    createSingleItemGroup(item)
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div style={{ 
        padding: 20, 
        fontFamily: 'Arial, sans-serif',
        width: '100%',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <h1 style={{ 
          textAlign: 'center', 
          marginBottom: 30, 
          color: '#333',
          fontSize: '2rem',
          fontWeight: 'bold'
        }}>
          Example: Drag and Drop Interface
        </h1>
        
        <ControlPanel 
          onCreateGroup={createGroup}
          onCreateNewItem={createNewItem}
          createGroupText="+ Add Group"
          createItemText="+ Add Item"
        />

        <DropZone 
          onItemDrop={handleItemDrop}
          hoverMessage="Drop here to create a new group"
          style={{ minHeight: '500px' }}
        >
          <GroupManager
            groups={groups}
            groupItems={groupItems}
            moveItemInGroup={moveItemInGroup}
            transferItem={transferItem}
            containerStyle={{ gap: '16px' }}
          />
        </DropZone>
        
        <CustomDragLayer />
      </div>
    </DndProvider>
  )
}

export default ExampleApp 