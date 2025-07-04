import { DocItem } from './_types/docItem';

export const GettingStartedDocItem: DocItem = {
    id: 'gettingStarted',
    name: 'Getting Started',
    examples: [
        { descriptionPath: 'gettingStarted-intro' },
        { name: 'Starting a new Vite project', descriptionPath: 'gettingStarted-configuring from scratch vite' },
        { name: 'Starting a new CRA-based project', descriptionPath: 'gettingStarted-configuring from scratch' },
        { name: 'Starting a new Next.js project', descriptionPath: 'gettingStarted-configuring from scratch nextjs' },
        { name: 'Adding UUI to existing project', descriptionPath: 'Configuring-into-existing-project' },
    ],
};
