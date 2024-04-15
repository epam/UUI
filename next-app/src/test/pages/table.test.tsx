import { screen } from '@epam/uui-test-utils';
import { render } from '../test-utils';
import TablePage from '../../app/lazytable/page';

describe('Page with demo table is rendered', () => {
  it('should render', () => {
    render(<TablePage />);
    const main = screen.getByText('Demo example with table');
    expect(main).toBeInTheDocument();
  });
});
