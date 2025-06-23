import { useState, useCallback, useEffect, useMemo } from 'react'
import type { Item } from '../components'

interface Group {
  id: string
  title: string
  backgroundColor: string
}

interface UseGroupManagerProps {
  initialGroups: Group[]
  initialItems: Item[]
}

export const useGroupManager = ({ initialGroups, initialItems }: UseGroupManagerProps) => {
  const [groups, setGroups] = useState<Group[]>(initialGroups)
  const [items, setItems] = useState<Item[]>(initialItems)

  // Generate unique IDs
  const generateId = () => Math.random().toString(36).substr(2, 9)

  // Computed: Group items by groupId
  const groupItems = useMemo(() => {
    const grouped: Record<string, Item[]> = {}
    items.forEach(item => {
      if (!grouped[item.groupId]) {
        grouped[item.groupId] = []
      }
      grouped[item.groupId].push(item)
    })
    return grouped
  }, [items])

  // Computed: Get all group IDs that have items
  const activeGroupIds = useMemo(() => {
    return [...new Set(items.map(item => item.groupId))]
  }, [items])

  // Computed: Filter groups to only show those with items or explicitly created
  const activeGroups = useMemo(() => {
    return groups.filter(group => 
      activeGroupIds.includes(group.id) || groupItems[group.id]?.length > 0
    )
  }, [groups, activeGroupIds, groupItems])

  // Clean up empty groups whenever items change
  useEffect(() => {
    const groupsWithItems = new Set(items.map(item => item.groupId))
    setGroups(prevGroups => 
      prevGroups.filter(group => groupsWithItems.has(group.id))
    )
  }, [items])

  // Create a new group
  const createGroup = () => {
    const newGroup: Group = {
      id: generateId(),
      title: `Group ${groups.length + 1}`,
      backgroundColor: `hsl(${Math.random() * 360}, 70%, 90%)`,
    }
    setGroups(prev => [...prev, newGroup])
  }

  // Create a new item in its own group
  const createNewItem = () => {
    const newGroup: Group = {
      id: generateId(),
      title: `Item ${items.length + 1}`,
      backgroundColor: `hsl(${Math.random() * 360}, 70%, 90%)`,
    }
    
    const newItem: Item = {
      id: generateId(),
      text: `Item ${items.length + 1}`,
      color: `hsl(${Math.random() * 360}, 70%, 60%)`,
      groupId: newGroup.id,
    }
    
    setGroups(prev => [...prev, newGroup])
    setItems(prev => [...prev, newItem])
  }

  // Create a new item in an existing group
  const createItemInGroup = (groupId: string) => {
    const newItem: Item = {
      id: generateId(),
      text: `Item ${items.length + 1}`,
      color: `hsl(${Math.random() * 360}, 70%, 60%)`,
      groupId: groupId,
    }
    
    setItems(prev => [...prev, newItem])
  }

  // Move item within a group
  const moveItemInGroup = useCallback((groupId: string, dragIndex: number, hoverIndex: number) => {
    setItems(prev => {
      const groupItems = prev.filter(item => item.groupId === groupId)
      const draggedItem = groupItems[dragIndex]
      
      if (!draggedItem) return prev
      
      // Create new array with reordered items
      const newItems = [...prev]
      const allGroupItemIndices = prev
        .map((item, index) => item.groupId === groupId ? index : -1)
        .filter(index => index !== -1)
      
      const actualDragIndex = allGroupItemIndices[dragIndex]
      const actualHoverIndex = allGroupItemIndices[hoverIndex]
      
      if (actualDragIndex === undefined || actualHoverIndex === undefined) return prev
      
      // Remove dragged item and insert at new position
      newItems.splice(actualDragIndex, 1)
      newItems.splice(actualHoverIndex, 0, draggedItem)
      
      return newItems
    })
  }, [])

  // Transfer item between groups
  const transferItem = useCallback((item: Item, targetGroupId: string) => {
    setItems(prev => 
      prev.map(existingItem => 
        existingItem.id === item.id 
          ? { ...existingItem, groupId: targetGroupId }
          : existingItem
      )
    )
  }, [])

  // Create a new single-item group from an existing item
  const createSingleItemGroup = useCallback((item: Item) => {
    // Create a new group for this item
    const newGroup: Group = {
      id: generateId(),
      title: item.text,
      backgroundColor: `hsl(${Math.random() * 360}, 70%, 90%)`,
    }
    
    // Update the item's groupId
    setItems(prev => 
      prev.map(existingItem => 
        existingItem.id === item.id 
          ? { ...existingItem, groupId: newGroup.id }
          : existingItem
      )
    )
    
    // Add the new group
    setGroups(prev => [...prev, newGroup])
  }, [])

  // Handle item drop in drop zone - creates a single-item group
  const handleItemDrop = useCallback((item: Item) => {
    createSingleItemGroup(item)
  }, [createSingleItemGroup])

  return {
    groups: activeGroups,
    groupItems,
    items,
    createGroup,
    createNewItem,
    createItemInGroup,
    moveItemInGroup,
    transferItem,
    handleItemDrop,
  }
}

export type { Group } 