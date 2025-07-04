# Drag and Drop Components

A collection of reusable React components for building drag and drop interfaces with group management capabilities. This library provides a complete solution for creating interactive group-based drag and drop applications.

## Components

### DropZone
A drop zone component that accepts draggable items and provides visual feedback. When items are dropped here, they automatically create new single-item groups.

```tsx
import { DropZone } from './components'

<DropZone 
  onItemDrop={(item) => handleItemDrop(item)}
  hoverMessage="Drop here to create a new group"
  showHoverMessage={true}
  style={{ minHeight: '400px' }}
>
  {/* Your content */}
</DropZone>
```

**Props:**
- `onItemDrop: (item: Item) => void` - Callback when an item is dropped
- `children: React.ReactNode` - Content to render inside the drop zone
- `className?: string` - CSS class name (default: "drop-zone")
- `style?: React.CSSProperties` - Inline styles
- `hoverMessage?: string` - Message to show when hovering (default: "Drop here to create a new group")
- `showHoverMessage?: boolean` - Whether to show hover message (default: true)

### GroupManager
Manages the rendering of groups and individual items based on item count. Automatically handles the display logic for single-item groups vs multi-item groups.

```tsx
import { GroupManager } from './components'

<GroupManager
  groups={groups}
  groupItems={groupItems}
  moveItemInGroup={moveItemInGroup}
  transferItem={transferItem}
  containerStyle={{ gap: '16px' }}
/>
```

**Props:**
- `groups: Group[]` - Array of groups
- `groupItems: Record<string, Item[]>` - Items organized by group ID
- `moveItemInGroup: (groupId: string, dragIndex: number, hoverIndex: number) => void` - Handler for moving items within a group
- `transferItem: (item: Item, targetGroupId: string) => void` - Handler for transferring items between groups
- `containerStyle?: React.CSSProperties` - Styles for the container

### ControlPanel
A control panel with buttons for creating groups and items. Provides a clean interface for user interactions.

```tsx
import { ControlPanel } from './components'

<ControlPanel
  onCreateGroup={createGroup}
  onCreateNewItem={createNewItem}
  createGroupText="+ Add Group"
  createItemText="+ Add Item"
/>
```

**Props:**
- `onCreateGroup: () => void` - Handler for creating a new group
- `onCreateNewItem: () => void` - Handler for creating a new item
- `createGroupText?: string` - Text for create group button (default: "+ Create New Group")
- `createItemText?: string` - Text for create item button (default: "+ Create New Item")
- `style?: React.CSSProperties` - Styles for the control panel
- `buttonStyle?: React.CSSProperties` - Styles for the buttons

### DraggableCard
A draggable card component that can represent an individual item. Used for both single-item groups and items within multi-item groups.

```tsx
import { DraggableCard } from './components'

<DraggableCard
  item={item}
  index={0}
  moveCard={(dragIndex, hoverIndex) => moveItemInGroup(groupId, dragIndex, hoverIndex)}
  groupId={groupId}
  transferItem={transferItem}
  isSingleItemGroup={true}
/>
```

**Props:**
- `item: Item` - The item to display
- `index: number` - Index of the item in its group
- `moveCard: (dragIndex: number, hoverIndex: number) => void` - Handler for moving the card
- `groupId: string` - ID of the group this card belongs to
- `transferItem?: (item: Item, targetGroupId: string) => void` - Handler for transferring the item
- `isSingleItemGroup?: boolean` - Whether this card represents a single-item group

### GroupDraggableCard
A container component for groups with multiple items. Provides a visual container and handles drag interactions for the group.

```tsx
import { GroupDraggableCard } from './components'

<GroupDraggableCard
  groupId={groupId}
  title={title}
  items={items}
  moveCard={(dragIndex, hoverIndex) => moveItemInGroup(groupId, dragIndex, hoverIndex)}
  transferItem={transferItem}
  backgroundColor={backgroundColor}
/>
```

**Props:**
- `groupId: string` - ID of the group
- `title: string` - Title of the group
- `items: Item[]` - Items in the group
- `moveCard: (dragIndex: number, hoverIndex: number) => void` - Handler for moving items within the group
- `transferItem?: (item: Item, targetGroupId: string) => void` - Handler for transferring items
- `backgroundColor?: string` - Background color of the group

### CustomDragLayer
A custom drag layer for showing drag previews. Provides visual feedback during drag operations.

```tsx
import { CustomDragLayer } from './components'

<CustomDragLayer />
```

**Note:** This component doesn't accept props and automatically handles drag preview rendering.

## Types

### Item
```tsx
interface Item {
  id: string
  text: string
  color: string
}
```

### Group
```tsx
interface Group {
  id: string
  title: string
  backgroundColor: string
}
```

## Custom Hook

### useGroupManager
A custom hook that provides complete group management functionality.

```tsx
import { useGroupManager } from '../hooks/useGroupManager'

const {
  groups,
  groupItems,
  createGroup,
  createNewItem,
  moveItemInGroup,
  transferItem,
  handleItemDrop,
} = useGroupManager({ 
  initialGroups: [], 
  initialGroupItems: {} 
})
```

**Returns:**
- `groups: Group[]` - Array of all groups
- `groupItems: Record<string, Item[]>` - Items organized by group ID
- `createGroup: () => void` - Creates a new empty group
- `createNewItem: () => void` - Creates a new item in its own group
- `moveItemInGroup: (groupId: string, dragIndex: number, hoverIndex: number) => void` - Moves items within a group
- `transferItem: (item: Item, targetGroupId: string) => void` - Transfers items between groups
- `handleItemDrop: (item: Item) => void` - Handles dropping items in the drop zone to create new groups

## Usage Example

```tsx
import React from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { 
  DropZone, 
  GroupManager, 
  ControlPanel, 
  CustomDragLayer 
} from './components'
import { useGroupManager } from '../hooks/useGroupManager'

function MyApp() {
  const {
    groups,
    groupItems,
    createGroup,
    createNewItem,
    moveItemInGroup,
    transferItem,
    handleItemDrop,
  } = useGroupManager({ initialGroups: [], initialGroupItems: {} })

  return (
    <DndProvider backend={HTML5Backend}>
      <div>
        <h1>My Drag and Drop App</h1>
        
        <ControlPanel 
          onCreateGroup={createGroup}
          onCreateNewItem={createNewItem}
        />

        <DropZone onItemDrop={handleItemDrop}>
          <GroupManager
            groups={groups}
            groupItems={groupItems}
            moveItemInGroup={moveItemInGroup}
            transferItem={transferItem}
          />
        </DropZone>
        
        <CustomDragLayer />
      </div>
    </DndProvider>
  )
}
```

## Key Features

- **Automatic Group Management**: Groups are automatically created and removed based on item count
- **Flexible Item Transfer**: Items can be moved between groups with automatic group cleanup
- **Visual Feedback**: Rich drag previews and hover states
- **Type Safety**: Full TypeScript support with comprehensive type definitions
- **Responsive Design**: Components adapt to different screen sizes
- **Accessibility**: Built with accessibility best practices in mind

## Styling

All components support custom styling through the `style` prop and can be further customized using CSS classes. The components use modern CSS features and provide smooth animations for drag interactions.

## Browser Support

This library requires a modern browser with support for:
- ES6+ features
- CSS Grid and Flexbox
- HTML5 Drag and Drop API

## Dependencies

- React 19+
- react-dnd 16+
- react-dnd-html5-backend 16+
- TypeScript 5.8+ 