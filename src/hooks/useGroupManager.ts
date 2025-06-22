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

  // Create a new item in its own group
  const createNewItem = () => {
    const newItem: Item = {
      id: generateId(),
      text: `Item ${groups.length + 1}`,
      color: `hsl(${Math.random() * 360}, 70%, 60%)`,
    }
    
    const newGroup: Group = {
      id: generateId(),
      title: newItem.text,
      backgroundColor: `hsl(${Math.random() * 360}, 70%, 90%)`,
    }
    
    setGroups(prev => [...prev, newGroup])
    setGroupItems(prev => ({ ...prev, [newGroup.id]: [newItem] }))
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
    setGroupItems(prev => {
      const newGroupItems = { ...prev }
      
      // Remove from all groups
      Object.keys(newGroupItems).forEach(groupId => {
        newGroupItems[groupId] = newGroupItems[groupId].filter(i => i.id !== item.id)
      })
      
      // Add to target group
      newGroupItems[targetGroupId] = [...(newGroupItems[targetGroupId] || []), item]
      
      // Remove empty groups
      const emptyGroupIds = Object.keys(newGroupItems).filter(
        groupId => newGroupItems[groupId].length === 0
      )
      
      emptyGroupIds.forEach(groupId => {
        delete newGroupItems[groupId]
      })
      
      // Remove empty groups from groups array
      setGroups(prevGroups => prevGroups.filter(group => !emptyGroupIds.includes(group.id)))
      
      return newGroupItems
    })
  }

  // Create a new single-item group from an existing item
  const createSingleItemGroup = (item: Item) => {
    // Create a new group for this item
    const newGroup: Group = {
      id: generateId(),
      title: item.text,
      backgroundColor: `hsl(${Math.random() * 360}, 70%, 90%)`,
    }
    
    setGroupItems(prev => {
      const newGroupItems = { ...prev }
      
      // Remove the item from all existing groups
      Object.keys(newGroupItems).forEach(groupId => {
        newGroupItems[groupId] = newGroupItems[groupId].filter(i => i.id !== item.id)
      })
      
      // Add the new group and place the item in it
      newGroupItems[newGroup.id] = [item]
      
      // Remove empty groups
      const emptyGroupIds = Object.keys(newGroupItems).filter(
        groupId => newGroupItems[groupId].length === 0
      )
      
      emptyGroupIds.forEach(groupId => {
        delete newGroupItems[groupId]
      })
      
      // Remove empty groups from groups array
      setGroups(prevGroups => prevGroups.filter(group => !emptyGroupIds.includes(group.id)))
      
      return newGroupItems
    })
    
    // Add the new group
    setGroups(prev => [...prev, newGroup])
  }

  return {
    groups,
    groupItems,
    createGroup,
    createNewItem,
    moveItemInGroup,
    transferItem,
    createSingleItemGroup,
  }
}

export type { Group } 