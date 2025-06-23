import { DropZone, GroupManager, ControlPanel } from './components'
import { useGroupManager, type Group } from './hooks/useGroupManager'
import type { Item } from './components'
import './App.css'

function App() {
  // Initial data configuration
  const initialGroups: Group[] = [
    { id: 'tasks', title: 'Tasks', backgroundColor: '#e3f2fd' },
    { id: 'ideas', title: 'Ideas', backgroundColor: '#f3e5f5' },
  ]

  const initialGroupItems: Record<string, Item[]> = {
    tasks: [
      { id: '1', text: 'Task 1', color: '#ff6b6b', groupId: 'tasks' },
      { id: '2', text: 'Task 2', color: '#4ecdc4', groupId: 'tasks' },
      { id: '3', text: 'Task 3', color: '#45b7d1', groupId: 'tasks' },
      { id: '4', text: 'Task 4', color: '#96ceb4', groupId: 'tasks' },
    ],
    ideas: [
      { id: '5', text: 'Idea 1', color: '#feca57', groupId: 'ideas' },
      { id: '6', text: 'Idea 2', color: '#ff9ff3', groupId: 'ideas' },
      { id: '7', text: 'Idea 3', color: '#54a0ff', groupId: 'ideas' },
      { id: '8', text: 'Idea 4', color: '#5f27cd', groupId: 'ideas' },
    ],
  }

  const {
    groups,
    groupItems,
    createGroup,
    createNewItem,
    createItemInGroup,
    moveItemInGroup,
    transferItem,
    handleItemDrop,
  } = useGroupManager({ initialGroups, initialGroupItems })

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
      
      <ControlPanel 
        onCreateGroup={createGroup}
        onCreateNewItem={createNewItem}
        onCreateItemInGroup={createItemInGroup}
        groups={groups}
      />

      <DropZone onItemDrop={handleItemDrop}>
        <GroupManager
          groups={groups}
          groupItems={groupItems}
          moveItemInGroup={moveItemInGroup}
          transferItem={transferItem}
        />
      </DropZone>
    </div>
  )
}

export default App
