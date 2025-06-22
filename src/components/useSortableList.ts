import { useState } from 'react'
import type { Item } from './DraggableCard'

export const useSortableList = (initialItems: Item[]) => {
  const [items, setItems] = useState<Item[]>(initialItems)

  const moveItem = (dragIndex: number, hoverIndex: number) => {
    setItems(prevItems => {
      const newItems = [...prevItems]
      const draggedItem = newItems[dragIndex]
      
      if (!draggedItem) return prevItems
      
      // Remove the dragged item
      newItems.splice(dragIndex, 1)
      
      // Insert at the new position
      newItems.splice(hoverIndex, 0, draggedItem)
      
      return newItems
    })
  }

  const addItem = (item: Item) => {
    setItems(prev => [...prev, item])
  }

  const removeItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id))
  }

  const updateItem = (id: string, updates: Partial<Item>) => {
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, ...updates } : item
    ))
  }

  return {
    items,
    moveItem,
    addItem,
    removeItem,
    updateItem,
    setItems
  }
} 