# Drag and Drop Components

This directory contains reusable drag-and-drop components built with react-dnd.

## Components

### DraggableCard
A draggable card component that can be reordered in a list.

**Props:**
- `item: Item` - The item data to display
- `index: number` - The current index of the item in the list
- `moveCard: (dragIndex: number, hoverIndex: number) => void` - Callback function to handle reordering

### CustomDragLayer
A custom drag preview component that shows the dragged item with rotation and opacity effects.

**Features:**
- 20-degree rotation (currently set to -5deg)
- 75% opacity
- Follows the cursor during drag operations

## Hooks

### useSortableList
A custom hook that manages the state and operations for a sortable list.

**Returns:**
- `items: Item[]` - Current list of items
- `moveItem: (dragIndex: number, hoverIndex: number) => void` - Function to move items
- `addItem: (item: Item) => void` - Function to add new items
- `removeItem: (id: string) => void` - Function to remove items by ID
- `updateItem: (id: string, updates: Partial<Item>) => void` - Function to update items
- `setItems: (items: Item[]) => void` - Function to set the entire list

## Types

### Item
```typescript
interface Item {
  id: string
  text: string
  color: string
}
```

## Usage Example

### Basic Usage
```tsx
import { useState } from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { CustomDragLayer, DraggableCard } from './components'
import type { Item } from './components'

function MyApp() {
  const [items, setItems] = useState<Item[]>([
    { id: '1', text: 'Item 1', color: '#ff6b6b' },
    { id: '2', text: 'Item 2', color: '#4ecdc4' },
  ])

  const moveCard = (dragIndex: number, hoverIndex: number) => {
    const dragCard = items[dragIndex]
    const newItems = [...items]
    newItems.splice(dragIndex, 1)
    newItems.splice(hoverIndex, 0, dragCard)
    setItems(newItems)
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div>
        {items.map((item, index) => (
          <DraggableCard
            key={item.id}
            item={item}
            index={index}
            moveCard={moveCard}
          />
        ))}
        <CustomDragLayer />
      </div>
    </DndProvider>
  )
}
```

### Using the Hook (Recommended)
```tsx
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { CustomDragLayer, DraggableCard, useSortableList } from './components'
import type { Item } from './components'

function MyApp() {
  const initialItems: Item[] = [
    { id: '1', text: 'Item 1', color: '#ff6b6b' },
    { id: '2', text: 'Item 2', color: '#4ecdc4' },
  ]

  const { items, moveItem, addItem, removeItem } = useSortableList(initialItems)

  return (
    <DndProvider backend={HTML5Backend}>
      <div>
        {items.map((item, index) => (
          <DraggableCard
            key={item.id}
            item={item}
            index={index}
            moveCard={moveItem}
          />
        ))}
        <CustomDragLayer />
        
        {/* Example: Add a new item */}
        <button onClick={() => addItem({ id: Date.now().toString(), text: 'New Item', color: '#ff9ff3' })}>
          Add Item
        </button>
      </div>
    </DndProvider>
  )
}
```

## Required Dependencies

Make sure you have the following dependencies installed:

```bash
npm install react-dnd react-dnd-html5-backend
```

## CSS Requirements

The components include their own CSS file (`DraggableComponents.css`) that will be automatically imported. If you want to use your own styling, you can override the CSS classes:

```css
.draggable-card {
  transition: all 0.2s ease;
}

.draggable-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15) !important;
}

.draggable-card:active {
  transform: translateY(0);
}

.drop-zone {
  transition: all 0.3s ease;
}

.drop-zone:hover {
  background-color: #e9ecef !important;
  border-color: #adb5bd !important;
}
```

## Customization

You can customize the appearance by modifying the inline styles in each component:

- **DraggableCard**: Modify the card dimensions, colors, and styling in `DraggableCard.tsx`
- **CustomDragLayer**: Adjust the rotation angle, opacity, and shadow effects in `CustomDragLayer.tsx`

## File Structure

```
src/components/
├── CustomDragLayer.tsx      # Custom drag preview component
├── DraggableCard.tsx        # Draggable card component
├── DraggableComponents.css  # Component-specific styles
├── useSortableList.ts       # Custom hook for list management
├── index.ts                 # Export file for easy imports
└── README.md               # This documentation
``` 