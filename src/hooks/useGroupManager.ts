import { useState } from 'react'
import type { Item } from '../components'

interface Group {
  id: string
  title: string
  backgroundColor: string
}

interface UseGroupManagerProps {
  initialGroups: Group[]
  initialGroupItems: Record<string, Item[]>
}

export const useGroupManager = ({ initialGroups, initialGroupItems }: UseGroupManagerProps) => {
  const [groups, setGroups] = useState<Group[]>(initialGroups)
  const [groupItems, setGroupItems] = useState<Record<string, Item[]>>(initialGroupItems)
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

  return {
    groups,
    groupItems,
    ungroupedItems,
    createGroup,
    createUngroupedItem,
    moveItemInGroup,
    transferItem,
    moveUngroupedItem,
  }
}

export type { Group } 