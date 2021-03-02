import { linkStrategy } from './strategies';
import { Link } from './components';

export const linkDecorator = {
    strategy: linkStrategy,
    component: Link,
};
