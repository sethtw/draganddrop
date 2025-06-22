# Drag and Drop Components

A collection of reusable React components for building drag and drop interfaces with group management capabilities.

## Components

### DropZone
A drop zone component that accepts draggable items and provides visual feedback.

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
Manages the rendering of groups and individual items based on item count.

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
A control panel with buttons for creating groups and items.

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
A draggable card component that can represent an individual item.

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
A container component for groups with multiple items.

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
A custom drag layer for showing drag previews.

```tsx
import { CustomDragLayer } from './components'

<CustomDragLayer />
```

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
import { useGroupManager } from './hooks/useGroupManager'

function MyApp() {
  const {
    groups,
    groupItems,
    createGroup,
    createNewItem,
    moveItemInGroup,
    transferItem,
    createSingleItemGroup,
  } = useGroupManager({ initialGroups: [], initialGroupItems: {} })

  const handleItemDrop = (item) => {
    createSingleItemGroup(item)
  }

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

## Features

- **Nested Drop Targets**: Proper handling of nested drop zones using React DnD's shallow monitoring
- **Group Management**: Automatic creation and cleanup of groups based on item count
- **Visual Feedback**: Hover effects and drag previews
- **Flexible Styling**: Customizable styles for all components
- **TypeScript Support**: Full TypeScript definitions included

## Dependencies

- `react-dnd`
- `react-dnd-html5-backend`
- `react` (16.8+ for hooks)

## Installation

1. Copy the `components` folder to your project
2. Copy the `hooks/useGroupManager.ts` file
3. Install required dependencies:
   ```bash
   npm install react-dnd react-dnd-html5-backend
   ```
4. Wrap your app with `DndProvider` from react-dnd
5. Import and use the components as needed 