import { GroupDraggableCard, DraggableCard } from './index'
import type { Item } from './DraggableCard'
import type { Group } from '../hooks/useGroupManager'

interface GroupManagerProps {
  groups: Group[]
  groupItems: Record<string, Item[]>
  moveItemInGroup: (groupId: string, dragIndex: number, hoverIndex: number) => void
  transferItem: (item: Item, targetGroupId: string) => void
  containerStyle?: React.CSSProperties
}

const GroupManager = ({ 
  groups, 
  groupItems, 
  moveItemInGroup, 
  transferItem,
  containerStyle = {}
}: GroupManagerProps) => {
  // Render individual item or group based on item count
  const renderGroupOrItem = (group: Group) => {
    const items = groupItems[group.id] || []
    
    // If group has only one item, render the item directly
    if (items.length === 1) {
      const item = items[0]
      return (
        <DraggableCard
          key={item.id}
          item={item}
          index={0}
          moveCard={(dragIndex, hoverIndex) => moveItemInGroup(group.id, dragIndex, hoverIndex)}
          groupId={group.id}
          transferItem={transferItem}
          isSingleItemGroup={true}
        />
      )
    }
    
    // If group has multiple items or is empty, render the group
    return (
      <GroupDraggableCard
        key={group.id}
        groupId={group.id}
        title={group.title}
        items={items}
        moveCard={(dragIndex, hoverIndex) => moveItemInGroup(group.id, dragIndex, hoverIndex)}
        transferItem={transferItem}
        backgroundColor={group.backgroundColor}
      />
    )
  }

  const defaultContainerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
    width: '100%',
    gap: '20px',
    flexWrap: 'wrap',
    ...containerStyle
  }

  return (
    <div style={defaultContainerStyle}>
      {groups.map(group => renderGroupOrItem(group))}
    </div>
  )
}

export default GroupManager 