import { Location } from '@epam/uui-docs';

export type LocationItem = Omit<Location, 'children'> & {
    children?: LocationItem[];
};
