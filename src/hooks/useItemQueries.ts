import { useMemo } from 'react'
import type { Item } from '../components'

interface UseItemQueriesProps {
  items: Item[]
}

export const useItemQueries = ({ items }: UseItemQueriesProps) => {
  // Get all items in a specific group
  const getItemsByGroup = useMemo(() => {
    return (groupId: string) => items.filter(item => item.groupId === groupId)
  }, [items])

  // Get items by color
  const getItemsByColor = useMemo(() => {
    return (color: string) => items.filter(item => item.color === color)
  }, [items])

  // Get items containing specific text
  const getItemsByText = useMemo(() => {
    return (searchText: string) => 
      items.filter(item => 
        item.text.toLowerCase().includes(searchText.toLowerCase())
      )
  }, [items])

  // Get items by multiple groups
  const getItemsByGroups = useMemo(() => {
    return (groupIds: string[]) => 
      items.filter(item => groupIds.includes(item.groupId))
  }, [items])

  // Get items that are in single-item groups
  const getSingleItemGroups = useMemo(() => {
    const groupCounts = items.reduce((acc, item) => {
      acc[item.groupId] = (acc[item.groupId] || 0) + 1
      return acc
    }, {} as Record<string, number>)
    
    return items.filter(item => groupCounts[item.groupId] === 1)
  }, [items])

  // Get items that are in multi-item groups
  const getMultiItemGroups = useMemo(() => {
    const groupCounts = items.reduce((acc, item) => {
      acc[item.groupId] = (acc[item.groupId] || 0) + 1
      return acc
    }, {} as Record<string, number>)
    
    return items.filter(item => groupCounts[item.groupId] > 1)
  }, [items])

  // Get statistics about items
  const getItemStats = useMemo(() => {
    const totalItems = items.length
    const uniqueGroups = new Set(items.map(item => item.groupId)).size
    const uniqueColors = new Set(items.map(item => item.color)).size
    
    const groupCounts = items.reduce((acc, item) => {
      acc[item.groupId] = (acc[item.groupId] || 0) + 1
      return acc
    }, {} as Record<string, number>)
    
    const avgItemsPerGroup = totalItems / uniqueGroups
    const maxItemsInGroup = Math.max(...Object.values(groupCounts), 0)
    const minItemsInGroup = Math.min(...Object.values(groupCounts), 0)
    
    return {
      totalItems,
      uniqueGroups,
      uniqueColors,
      avgItemsPerGroup,
      maxItemsInGroup,
      minItemsInGroup,
      groupCounts
    }
  }, [items])

  // Get items sorted by various criteria
  const getSortedItems = useMemo(() => {
    return {
      byText: (ascending = true) => 
        [...items].sort((a, b) => {
          const comparison = a.text.localeCompare(b.text)
          return ascending ? comparison : -comparison
        }),
      byColor: (ascending = true) => 
        [...items].sort((a, b) => {
          const comparison = a.color.localeCompare(b.color)
          return ascending ? comparison : -comparison
        }),
      byGroupId: (ascending = true) => 
        [...items].sort((a, b) => {
          const comparison = a.groupId.localeCompare(b.groupId)
          return ascending ? comparison : -comparison
        })
    }
  }, [items])

  // Get items with complex filtering
  const getFilteredItems = useMemo(() => {
    return (filters: {
      groupIds?: string[]
      colors?: string[]
      textSearch?: string
      minItemsInGroup?: number
      maxItemsInGroup?: number
    }) => {
      let filtered = [...items]
      
      if (filters.groupIds) {
        filtered = filtered.filter(item => filters.groupIds!.includes(item.groupId))
      }
      
      if (filters.colors) {
        filtered = filtered.filter(item => filters.colors!.includes(item.color))
      }
      
      if (filters.textSearch) {
        filtered = filtered.filter(item => 
          item.text.toLowerCase().includes(filters.textSearch!.toLowerCase())
        )
      }
      
      if (filters.minItemsInGroup || filters.maxItemsInGroup) {
        const groupCounts = items.reduce((acc, item) => {
          acc[item.groupId] = (acc[item.groupId] || 0) + 1
          return acc
        }, {} as Record<string, number>)
        
        filtered = filtered.filter(item => {
          const count = groupCounts[item.groupId]
          const minOk = !filters.minItemsInGroup || count >= filters.minItemsInGroup
          const maxOk = !filters.maxItemsInGroup || count <= filters.maxItemsInGroup
          return minOk && maxOk
        })
      }
      
      return filtered
    }
  }, [items])

  return {
    getItemsByGroup,
    getItemsByColor,
    getItemsByText,
    getItemsByGroups,
    getSingleItemGroups,
    getMultiItemGroups,
    getItemStats,
    getSortedItems,
    getFilteredItems
  }
} 