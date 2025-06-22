interface ControlPanelProps {
  onCreateGroup: () => void
  onCreateNewItem: () => void
  createGroupText?: string
  createItemText?: string
  style?: React.CSSProperties
  buttonStyle?: React.CSSProperties
}

const ControlPanel = ({ 
  onCreateGroup, 
  onCreateNewItem,
  createGroupText = "+ Create New Group",
  createItemText = "+ Create New Item",
  style = {},
  buttonStyle = {}
}: ControlPanelProps) => {
  const defaultStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'center',
    gap: '20px',
    marginBottom: '30px',
    ...style
  }

  const defaultButtonStyle: React.CSSProperties = {
    padding: '12px 24px',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    cursor: 'pointer',
    fontWeight: 'bold',
    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
    transition: 'all 0.2s ease',
    ...buttonStyle
  }

  const createGroupButtonStyle: React.CSSProperties = {
    ...defaultButtonStyle,
    backgroundColor: '#28a745'
  }

  const createItemButtonStyle: React.CSSProperties = {
    ...defaultButtonStyle,
    backgroundColor: '#007bff'
  }

  return (
    <div style={defaultStyle}>
      <button
        onClick={onCreateGroup}
        style={createGroupButtonStyle}
        onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
        onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
      >
        {createGroupText}
      </button>
      <button
        onClick={onCreateNewItem}
        style={createItemButtonStyle}
        onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
        onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
      >
        {createItemText}
      </button>
    </div>
  )
}

export default ControlPanel 