import { useItemQueries } from '../hooks/useItemQueries'
import type { Item } from './DraggableCard'

interface ItemAnalyticsProps {
  items: Item[]
}

const ItemAnalytics = ({ items }: ItemAnalyticsProps) => {
  const {
    getItemStats,
    getSingleItemGroups,
    getMultiItemGroups,
    getSortedItems,
    getFilteredItems
  } = useItemQueries({ items })

  const stats = getItemStats
  const singleItemGroups = getSingleItemGroups
  const multiItemGroups = getMultiItemGroups
  const sortedByText = getSortedItems.byText(true)
  const complexFiltered = getFilteredItems({
    textSearch: 'Task',
    minItemsInGroup: 2
  })

  return (
    <div style={{
      background: 'rgba(255, 255, 255, 0.1)',
      borderRadius: 12,
      padding: 20,
      marginTop: 20,
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255, 255, 255, 0.2)'
    }}>
      <h3 style={{ 
        color: 'white', 
        marginBottom: 15,
        fontSize: '1.2rem',
        fontWeight: 'bold'
      }}>
        📊 Item Analytics (Single Array Approach)
      </h3>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 15 }}>
        {/* Statistics */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.1)',
          padding: 15,
          borderRadius: 8,
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <h4 style={{ color: 'white', marginBottom: 10, fontSize: '1rem' }}>📈 Statistics</h4>
          <div style={{ color: 'white', fontSize: '0.9rem', lineHeight: 1.4 }}>
            <div>Total Items: {stats.totalItems}</div>
            <div>Unique Groups: {stats.uniqueGroups}</div>
            <div>Unique Colors: {stats.uniqueColors}</div>
            <div>Avg per Group: {stats.avgItemsPerGroup.toFixed(1)}</div>
            <div>Max in Group: {stats.maxItemsInGroup}</div>
            <div>Min in Group: {stats.minItemsInGroup}</div>
          </div>
        </div>

        {/* Group Types */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.1)',
          padding: 15,
          borderRadius: 8,
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <h4 style={{ color: 'white', marginBottom: 10, fontSize: '1rem' }}>🏷️ Group Types</h4>
          <div style={{ color: 'white', fontSize: '0.9rem', lineHeight: 1.4 }}>
            <div>Single Items: {singleItemGroups.length}</div>
            <div>Multi Items: {multiItemGroups.length}</div>
            <div>Single Groups: {new Set(singleItemGroups.map(i => i.groupId)).size}</div>
            <div>Multi Groups: {new Set(multiItemGroups.map(i => i.groupId)).size}</div>
          </div>
        </div>

        {/* Sorted Items */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.1)',
          padding: 15,
          borderRadius: 8,
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <h4 style={{ color: 'white', marginBottom: 10, fontSize: '1rem' }}>🔤 Sorted by Text</h4>
          <div style={{ color: 'white', fontSize: '0.8rem', lineHeight: 1.3, maxHeight: 100, overflowY: 'auto' }}>
            {sortedByText.slice(0, 5).map(item => (
              <div key={item.id} style={{ marginBottom: 2 }}>
                {item.text} ({item.groupId})
              </div>
            ))}
            {sortedByText.length > 5 && <div style={{ fontStyle: 'italic' }}>... and {sortedByText.length - 5} more</div>}
          </div>
        </div>

        {/* Complex Filter */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.1)',
          padding: 15,
          borderRadius: 8,
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <h4 style={{ color: 'white', marginBottom: 10, fontSize: '1rem' }}>🔍 Complex Filter</h4>
          <div style={{ color: 'white', fontSize: '0.8rem', lineHeight: 1.3, maxHeight: 100, overflowY: 'auto' }}>
            <div style={{ marginBottom: 5, fontStyle: 'italic' }}>Tasks in groups with 2+ items:</div>
            {complexFiltered.map(item => (
              <div key={item.id} style={{ marginBottom: 2 }}>
                {item.text} ({item.groupId})
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ 
        marginTop: 15, 
        padding: 10, 
        background: 'rgba(0, 123, 255, 0.2)', 
        borderRadius: 6,
        border: '1px solid rgba(0, 123, 255, 0.3)'
      }}>
        <div style={{ color: 'white', fontSize: '0.9rem', fontStyle: 'italic' }}>
          💡 <strong>Benefits of Single Array Approach:</strong> All queries are computed from one data source, 
          enabling complex filtering, sorting, and analytics without data duplication or synchronization issues.
        </div>
      </div>
    </div>
  )
}

export default ItemAnalytics 