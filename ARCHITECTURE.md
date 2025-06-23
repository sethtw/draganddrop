# Single Array Architecture - Drag and Drop App

## Overview

This document explains the reimagined data model and logic of the drag and drop application, which now uses a **single array of items** with filtering and grouping by `groupId` instead of separate group arrays.

## Architecture Comparison

### Previous Architecture (Separate Arrays)
```typescript
// Separate data structures
const groups: Group[] = [
  { id: 'tasks', title: 'Tasks', backgroundColor: '#e3f2fd' },
  { id: 'ideas', title: 'Ideas', backgroundColor: '#f3e5f5' },
]

const groupItems: Record<string, Item[]> = {
  tasks: [
    { id: '1', text: 'Task 1', color: '#ff6b6b', groupId: 'tasks' },
    { id: '2', text: 'Task 2', color: '#4ecdc4', groupId: 'tasks' },
  ],
  ideas: [
    { id: '3', text: 'Idea 1', color: '#feca57', groupId: 'ideas' },
    { id: '4', text: 'Idea 2', color: '#ff9ff3', groupId: 'ideas' },
  ],
}
```

### New Architecture (Single Array)
```typescript
// Single data structure
const groups: Group[] = [
  { id: 'tasks', title: 'Tasks', backgroundColor: '#e3f2fd' },
  { id: 'ideas', title: 'Ideas', backgroundColor: '#f3e5f5' },
]

const items: Item[] = [
  { id: '1', text: 'Task 1', color: '#ff6b6b', groupId: 'tasks' },
  { id: '2', text: 'Task 2', color: '#4ecdc4', groupId: 'tasks' },
  { id: '3', text: 'Idea 1', color: '#feca57', groupId: 'ideas' },
  { id: '4', text: 'Idea 2', color: '#ff9ff3', groupId: 'ideas' },
]

// Computed grouping
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
```

## Key Benefits

### 1. **Simplified Data Management**
- **Single source of truth**: All items exist in one array
- **No synchronization issues**: No need to keep multiple data structures in sync
- **Easier state updates**: Modifying items only requires updating one array

### 2. **Enhanced Querying Capabilities**
The new `useItemQueries` hook provides powerful filtering and analytics:

```typescript
// Get items by group
const tasks = getItemsByGroup('tasks')

// Get items by color
const redItems = getItemsByColor('#ff6b6b')

// Get items containing text
const taskItems = getItemsByText('Task')

// Complex filtering
const complexFiltered = getFilteredItems({
  groupIds: ['tasks', 'ideas'],
  colors: ['#ff6b6b', '#4ecdc4'],
  textSearch: 'Task',
  minItemsInGroup: 2
})

// Sorting
const sortedByText = getSortedItems.byText(true)
const sortedByColor = getSortedItems.byColor(false)
```

### 3. **Improved Performance**
- **Memoized computations**: Grouping and filtering are computed only when items change
- **Reduced memory usage**: No duplicate data structures
- **Efficient updates**: Single array mutations are faster than object updates

### 4. **Better Analytics**
The new architecture enables rich analytics without additional data processing:

```typescript
const stats = getItemStats
// Returns: {
//   totalItems: 8,
//   uniqueGroups: 2,
//   uniqueColors: 8,
//   avgItemsPerGroup: 4,
//   maxItemsInGroup: 4,
//   minItemsInGroup: 4,
//   groupCounts: { tasks: 4, ideas: 4 }
// }
```

### 5. **Flexible Grouping Logic**
- **Dynamic groups**: Groups are automatically created/removed based on items
- **Single-item groups**: Items can exist in their own groups
- **Multi-item groups**: Items can be grouped together
- **Cross-group operations**: Easy to move items between groups

## Implementation Details

### Core Hook: `useGroupManager`

```typescript
export const useGroupManager = ({ initialGroups, initialItems }: UseGroupManagerProps) => {
  const [groups, setGroups] = useState<Group[]>(initialGroups)
  const [items, setItems] = useState<Item[]>(initialItems)

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

  // Computed: Filter groups to only show those with items
  const activeGroups = useMemo(() => {
    return groups.filter(group => 
      items.some(item => item.groupId === group.id)
    )
  }, [groups, items])

  // ... operations for creating, moving, and transferring items
}
```

### Utility Hook: `useItemQueries`

```typescript
export const useItemQueries = ({ items }: UseItemQueriesProps) => {
  // Various query functions for filtering, sorting, and analytics
  const getItemsByGroup = useMemo(() => {
    return (groupId: string) => items.filter(item => item.groupId === groupId)
  }, [items])

  const getItemStats = useMemo(() => {
    // Complex analytics computation
  }, [items])

  // ... more query functions
}
```

## Migration Benefits

### Before (Separate Arrays)
```typescript
// Creating a new item required updating multiple structures
const createItemInGroup = (groupId: string) => {
  const newItem = { id: generateId(), text: 'New Item', groupId }
  
  // Update groupItems object
  setGroupItems(prev => ({
    ...prev,
    [groupId]: [...(prev[groupId] || []), newItem]
  }))
}

// Moving items required complex logic
const transferItem = (item: Item, targetGroupId: string) => {
  setGroupItems(prev => {
    const newGroupItems = { ...prev }
    const sourceGroupId = item.groupId
    
    // Add to target group
    newGroupItems[targetGroupId] = [...(newGroupItems[targetGroupId] || []), updatedItem]
    
    // Remove from source group
    newGroupItems[sourceGroupId] = newGroupItems[sourceGroupId].filter(i => i.id !== item.id)
    
    return newGroupItems
  })
}
```

### After (Single Array)
```typescript
// Creating a new item is simple
const createItemInGroup = (groupId: string) => {
  const newItem = { id: generateId(), text: 'New Item', groupId }
  setItems(prev => [...prev, newItem])
}

// Moving items is straightforward
const transferItem = (item: Item, targetGroupId: string) => {
  setItems(prev => 
    prev.map(existingItem => 
      existingItem.id === item.id 
        ? { ...existingItem, groupId: targetGroupId }
        : existingItem
    )
  )
}
```

## Use Cases Enabled

1. **Search and Filter**: Find items across all groups
2. **Bulk Operations**: Move multiple items at once
3. **Analytics**: Generate reports and statistics
4. **Sorting**: Sort items by any property
5. **Cross-Group Queries**: Find items that match criteria across groups
6. **Dynamic Grouping**: Create groups based on item properties

## Conclusion

The single array architecture provides a more maintainable, performant, and flexible foundation for the drag and drop application. It eliminates data synchronization issues, enables powerful querying capabilities, and simplifies the codebase while maintaining all existing functionality. 