import { configure } from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';

configure({ adapter: new Adapter() });

class ResizeObserver {
    observe() {
        // do nothing
    }
    disconnect() {
        // do nothing
    }
}

global.ResizeObserver = ResizeObserver;
