import React, { useState } from 'react'
import type { Group } from '../hooks/useGroupManager'

interface ControlPanelProps {
  onCreateGroup: () => void
  onCreateNewItem: () => void
  onCreateItemInGroup: (groupId: string) => void
  groups: Group[]
  createGroupText?: string
  createItemText?: string
  createItemInGroupText?: string
  style?: React.CSSProperties
  buttonStyle?: React.CSSProperties
}

const ControlPanel = ({ 
  onCreateGroup, 
  onCreateNewItem,
  onCreateItemInGroup,
  groups,
  createGroupText = "+ Create New Group",
  createItemText = "+ Create New Item",
  createItemInGroupText = "+ Add Item to Group",
  style = {},
  buttonStyle = {}
}: ControlPanelProps) => {
  const [selectedGroupId, setSelectedGroupId] = useState<string>('')

  const defaultStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '20px',
    marginBottom: '30px',
    flexWrap: 'wrap',
    ...style
  }

  const defaultButtonStyle: React.CSSProperties = {
    padding: '12px 24px',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    cursor: 'pointer',
    fontWeight: 'bold',
    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
    transition: 'all 0.2s ease',
    ...buttonStyle
  }

  const createGroupButtonStyle: React.CSSProperties = {
    ...defaultButtonStyle,
    backgroundColor: '#28a745'
  }

  const createItemButtonStyle: React.CSSProperties = {
    ...defaultButtonStyle,
    backgroundColor: '#007bff'
  }

  const createItemInGroupButtonStyle: React.CSSProperties = {
    ...defaultButtonStyle,
    backgroundColor: '#fd7e14'
  }

  const selectStyle: React.CSSProperties = {
    padding: '10px 16px',
    border: '2px solid #ddd',
    borderRadius: '8px',
    fontSize: '16px',
    backgroundColor: 'white',
    cursor: 'pointer',
    minWidth: '150px'
  }

  const handleAddToGroup = () => {
    if (selectedGroupId) {
      onCreateItemInGroup(selectedGroupId)
    }
  }

  return (
    <div style={defaultStyle}>
      <button
        onClick={onCreateGroup}
        style={createGroupButtonStyle}
        onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
        onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
      >
        {createGroupText}
      </button>
      <button
        onClick={onCreateNewItem}
        style={createItemButtonStyle}
        onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
        onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
      >
        {createItemText}
      </button>
      
      {groups.length > 0 && (
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <select
            value={selectedGroupId}
            onChange={(e) => setSelectedGroupId(e.target.value)}
            style={selectStyle}
          >
            <option value="">Select a group...</option>
            {groups.map(group => (
              <option key={group.id} value={group.id}>
                {group.title}
              </option>
            ))}
          </select>
          <button
            onClick={handleAddToGroup}
            disabled={!selectedGroupId}
            style={{
              ...createItemInGroupButtonStyle,
              opacity: selectedGroupId ? 1 : 0.6,
              cursor: selectedGroupId ? 'pointer' : 'not-allowed'
            }}
            onMouseOver={(e) => {
              if (selectedGroupId) {
                e.currentTarget.style.transform = 'translateY(-2px)'
              }
            }}
            onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            {createItemInGroupText}
          </button>
        </div>
      )}
    </div>
  )
}

export default ControlPanel 