# Schema Visualizer

A powerful Strapi plugin for visualizing your content types and their relationships in an interactive diagram. This plugin helps developers and content managers understand the structure of their content types and how they relate to each other.

> **Note:** This plugin is compatible with Strapi v5.

## Prerequisites

- Strapi v5.0.0 or higher
- Node.js 18.x or higher
- npm 9.x or higher (or equivalent yarn/pnpm)

## Credits and Acknowledgements

This plugin was created by forking and enhancing the excellent [Content-Type Explorer](https://github.com/shahriarkh/strapi-content-type-explorer) by [ShahriarKh](ShahriarKh). We're grateful for his foundational work that made this plugin possible. The original plugin has been migrated to newer Strapi versions and enhanced with additional features while maintaining the core visualization functionality.

## Features

- **Interactive Schema Visualization**: View all your content types and their relationships in an interactive diagram
- **Customizable Display**: Toggle visibility of admin types, plugin types, default fields, and more
- **Relationship Visualization**: See connections between content types with different edge styles
- **Layout Options**: Choose between vertical and horizontal layouts
- **Export Functionality**: Export diagrams as images for documentation or presentations
- **Performance Optimized**: Designed to handle large schemas with smooth performance

## Installation

```bash
# Using npm
npm install schema-visualizer --save

# Using yarn
yarn add schema-visualizer
```

## Configuration

After installing the plugin, you need to enable it in your Strapi application:

1. Go to `config/plugins.js` or create it if it doesn't exist:

```javascript
module.exports = {
  // ...
  'schema-visualizer': {
    enabled: true,
  },
  // ...
}
```

## Usage

1. Log in to your Strapi admin panel
2. Navigate to the Schema Visualizer from the main menu
3. The visualization will load automatically, displaying all your content types and their relationships. (click on regenerate button if it doesn't load autmoatically)

## Interface Overview

![Screenshot from 2025-05-05 12-07-32](https://github.com/user-attachments/assets/c2663ff6-5f97-49bd-90c4-872fe475210a)


### Controls and Options

The plugin provides several options to customize the visualization:

- **Layout Controls**: Switch between vertical and horizontal layouts
- **Display Options**: 
  - Show/hide admin types
  - Show/hide plugin types
  - Show/hide types on nodes
  - Show/hide field icons
  - Show relations only (hide non-relation fields)
  - Show/hide default fields
- **Visual Options**:
  - Background pattern options
  - Edge type selection (bezier, step, straight)
  - Toggle edge visibility
  - Toggle grid snapping

### Interactive Features

- **Drag Nodes**: Rearrange nodes by dragging them
- **Zoom & Pan**: Navigate around the diagram using your mouse
- **Toggle Mouse Mode**: Switch between zoom mode and scroll mode
- **Export**: Export the current view as an image for documentation

## Examples

### Basic Schema Visualization

![image (25)](https://github.com/user-attachments/assets/5c8b2be2-79b8-443f-8ea7-8bdbaaacf07b)



### Focused Relationship View

![Screenshot from 2025-05-02 14-27-59](https://github.com/user-attachments/assets/6ffb308c-52a1-437f-b7e5-e21d1ff42d01)


### Export Example

![Screenshot from 2025-05-02 14-28-17](https://github.com/user-attachments/assets/10492472-d3a0-480c-b532-12f53b591fa0)


## Performance Tips

For large schemas with many content types and relationships:

1. Hide unnecessary information using the display options
2. Toggle off edge animations for smoother performance
3. Use the layout buttons to automatically organize your diagram
4. Consider filtering to show only relations for a clearer view

## Technical Details

This plugin is built using:
- ReactFlow for diagram rendering
- Dagre for automatic layout
- Strapi Design System for UI components
- HTML-to-image for export functionality

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT
