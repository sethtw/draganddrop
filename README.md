# Dynamic Group Drag and Drop Interface

A modern React application that demonstrates advanced drag-and-drop functionality with dynamic group management. Built with React 19, TypeScript, and Vite.

## Features

- **Dynamic Group Management**: Create, organize, and manage groups of draggable items
- **Intuitive Drag & Drop**: Seamless item movement within and between groups
- **Visual Feedback**: Real-time drag previews and hover states
- **Responsive Design**: Modern UI with smooth animations
- **TypeScript**: Full type safety throughout the application
- **Custom Hooks**: Reusable logic for group management

## Tech Stack

- **React 19** - Latest React with concurrent features
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **React DnD** - Drag and drop functionality
- **ESLint** - Code quality and consistency

## Getting Started

### Prerequisites

- Node.js (version 18 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd draganddrop
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run lint` - Run ESLint for code quality
- `npm run preview` - Preview production build locally

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ControlPanel.tsx # Control buttons for creating groups/items
│   ├── CustomDragLayer.tsx # Custom drag preview
│   ├── DraggableCard.tsx # Individual draggable item
│   ├── DropZone.tsx     # Drop zone for creating new groups
│   ├── GroupDraggableCard.tsx # Group container component
│   └── GroupManager.tsx # Main group management component
├── hooks/               # Custom React hooks
│   └── useGroupManager.ts # Group management logic
├── types/               # TypeScript type definitions
└── App.tsx             # Main application component
```

## Usage

The application provides a complete drag-and-drop interface where you can:

1. **Create Groups**: Click the "+ Add Group" button to create new empty groups
2. **Create Items**: Click the "+ Add Item" button to create new items in their own groups
3. **Drag Items**: Drag items within groups to reorder them
4. **Transfer Items**: Drag items between groups to reorganize them
5. **Drop to Create**: Drag items to the drop zone to create new single-item groups

## Key Components

- **GroupManager**: Orchestrates the display and interaction of all groups
- **DropZone**: Provides a drop target for creating new groups
- **ControlPanel**: Contains action buttons for creating groups and items
- **useGroupManager**: Custom hook that manages all group and item state

For detailed component documentation, see [src/components/README.md](src/components/README.md).

## Development

### Code Quality

The project uses ESLint with TypeScript support for code quality. The configuration includes:

- TypeScript-aware linting rules
- React-specific linting rules
- Consistent code formatting

### Type Safety

All components and functions are fully typed with TypeScript, providing:

- IntelliSense support in your IDE
- Compile-time error checking
- Better refactoring capabilities

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

This project is licensed under the MIT License.
