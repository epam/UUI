export interface ExampleTreeItem {
    id: string;
    name: string;
    parentId?: string;
    type: 'folder' | 'file';
}

export const treeData: ExampleTreeItem[] = [
    // First level items (10+) - all folders
    { id: '1', name: 'Getting Started', parentId: undefined, type: 'folder' },
    { id: '2', name: 'Components', parentId: undefined, type: 'folder' },
    { id: '3', name: 'Layout', parentId: undefined, type: 'folder' },
    { id: '4', name: 'Navigation', parentId: undefined, type: 'folder' },
    { id: '5', name: 'Forms', parentId: undefined, type: 'folder' },
    { id: '6', name: 'Data Display', parentId: undefined, type: 'folder' },
    { id: '7', name: 'Feedback', parentId: undefined, type: 'folder' },
    { id: '8', name: 'Overlays', parentId: undefined, type: 'folder' },
    { id: '9', name: 'Utilities', parentId: undefined, type: 'folder' },
    { id: '10', name: 'Advanced', parentId: undefined, type: 'folder' },
    { id: '11', name: 'API Reference', parentId: undefined, type: 'folder' },
    { id: '12', name: 'Examples', parentId: undefined, type: 'folder' },

    // Getting Started children - all files
    { id: '13', name: 'Installation', parentId: '1', type: 'file' },
    { id: '14', name: 'Quick Start', parentId: '1', type: 'file' },
    { id: '15', name: 'Configuration', parentId: '1', type: 'file' },
    { id: '16', name: 'Basic Usage', parentId: '1', type: 'file' },

    // Components children - all files
    { id: '17', name: 'Buttons', parentId: '2', type: 'file' },
    { id: '18', name: 'Inputs', parentId: '2', type: 'file' },
    { id: '19', name: 'Icons', parentId: '2', type: 'file' },
    { id: '20', name: 'Typography', parentId: '2', type: 'file' },
    { id: '21', name: 'Cards', parentId: '2', type: 'file' },
    { id: '22', name: 'Modals', parentId: '2', type: 'file' },

    // Layout children - all files
    { id: '23', name: 'Grid', parentId: '3', type: 'file' },
    { id: '24', name: 'Flexbox', parentId: '3', type: 'file' },
    { id: '25', name: 'Container', parentId: '3', type: 'file' },
    { id: '26', name: 'Spacing', parentId: '3', type: 'file' },
    { id: '27', name: 'Alignment', parentId: '3', type: 'file' },

    // Navigation children - all files
    { id: '28', name: 'Menu', parentId: '4', type: 'file' },
    { id: '29', name: 'Breadcrumbs', parentId: '4', type: 'file' },
    { id: '30', name: 'Tabs', parentId: '4', type: 'file' },
    { id: '31', name: 'Pagination', parentId: '4', type: 'file' },
    { id: '32', name: 'Sidebar', parentId: '4', type: 'file' },

    // Forms children - all files
    { id: '33', name: 'Text Input', parentId: '5', type: 'file' },
    { id: '34', name: 'Select', parentId: '5', type: 'file' },
    { id: '35', name: 'Checkbox', parentId: '5', type: 'file' },
    { id: '36', name: 'Radio', parentId: '5', type: 'file' },
    { id: '37', name: 'Date Picker', parentId: '5', type: 'file' },
    { id: '38', name: 'File Upload', parentId: '5', type: 'file' },

    // Data Display children - all files
    { id: '39', name: 'Table', parentId: '6', type: 'file' },
    { id: '40', name: 'List', parentId: '6', type: 'file' },
    { id: '41', name: 'Tree', parentId: '6', type: 'file' },
    { id: '42', name: 'Charts', parentId: '6', type: 'file' },
    { id: '43', name: 'Progress', parentId: '6', type: 'file' },

    // Feedback children - all files
    { id: '44', name: 'Alerts', parentId: '7', type: 'file' },
    { id: '45', name: 'Notifications', parentId: '7', type: 'file' },
    { id: '46', name: 'Loading', parentId: '7', type: 'file' },
    { id: '47', name: 'Tooltips', parentId: '7', type: 'file' },

    // Overlays children - all files
    { id: '48', name: 'Modal', parentId: '8', type: 'file' },
    { id: '49', name: 'Popover', parentId: '8', type: 'file' },
    { id: '50', name: 'Drawer', parentId: '8', type: 'file' },
    { id: '51', name: 'Dropdown', parentId: '8', type: 'file' },

    // Utilities children - all files
    { id: '52', name: 'Colors', parentId: '9', type: 'file' },
    { id: '53', name: 'Spacing', parentId: '9', type: 'file' },
    { id: '54', name: 'Typography', parentId: '9', type: 'file' },
    { id: '55', name: 'Animations', parentId: '9', type: 'file' },

    // Advanced children - all files
    { id: '56', name: 'Customization', parentId: '10', type: 'file' },
    { id: '57', name: 'Performance', parentId: '10', type: 'file' },
    { id: '58', name: 'Accessibility', parentId: '10', type: 'file' },
    { id: '59', name: 'Testing', parentId: '10', type: 'file' },

    // API Reference children - all files
    { id: '60', name: 'Components API', parentId: '11', type: 'file' },
    { id: '61', name: 'Hooks API', parentId: '11', type: 'file' },
    { id: '62', name: 'Utilities API', parentId: '11', type: 'file' },
    { id: '63', name: 'Types', parentId: '11', type: 'file' },

    // Examples children - all files
    { id: '64', name: 'Basic Examples', parentId: '12', type: 'file' },
    { id: '65', name: 'Advanced Examples', parentId: '12', type: 'file' },
    { id: '66', name: 'Real-world Examples', parentId: '12', type: 'file' },
    { id: '67', name: 'Code Sandbox', parentId: '12', type: 'file' },
];
