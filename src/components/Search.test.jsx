import { render, screen, act, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Search from './Search';

describe('Search Component', () => {
  const mockResults = [
    { id: 1, name: 'London', country: 'UK' },
    { id: 2, name: 'Paris', country: 'France' }
  ];

  beforeAll(() => {
    jest.useFakeTimers();
    window.HTMLElement.prototype.scrollIntoView = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  // Existing tests here...

  test('handles keyboard navigation', async () => {
    const mockSelect = jest.fn();
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

    render(<Search results={mockResults} onSearch={jest.fn()} onSelect={mockSelect} />);

    const input = screen.getByTestId('search-input');
    
    // Arrow down
    await user.type(input, '{ArrowDown}');
    expect(screen.getByTestId('search-result-1')).toHaveClass('bg-blue-500');
    
    // Arrow up (should wrap to bottom)
    await user.type(input, '{ArrowUp}');
    expect(screen.getByTestId('search-result-2')).toHaveClass('bg-blue-500');
    
    // Enter selection
    await user.type(input, '{Enter}');
    expect(mockSelect).toHaveBeenCalledWith(mockResults[1]);
  });

  test('does nothing when pressing keys with no results', async () => {
    const mockSelect = jest.fn();
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

    render(<Search results={[]} onSearch={jest.fn()} onSelect={mockSelect} />);
    
    const input = screen.getByTestId('search-input');
    await user.type(input, '{ArrowDown}');
    await user.type(input, '{Enter}');
    
    expect(mockSelect).not.toHaveBeenCalled();
  });

  test('cleans up timer on unmount', () => {
    const mockSearch = jest.fn();
    const { unmount } = render(<Search onSearch={mockSearch} />);
    
    unmount();
    act(() => {
      jest.runOnlyPendingTimers();
    });
    
    expect(mockSearch).not.toHaveBeenCalled();
  });

  test('does not show results when empty', () => {
    render(<Search results={[]} />);
    expect(screen.queryByTestId('search-results')).not.toBeInTheDocument();
  });

  test('hides loading spinner when not loading', () => {
    render(<Search isLoading={false} />);
    expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();
  });

  test('handles enter key without highlighted index', async () => {
    const mockSelect = jest.fn();
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

    render(<Search results={mockResults} onSelect={mockSelect} />);
    
    const input = screen.getByTestId('search-input');
    await user.type(input, '{Enter}');
    
    expect(mockSelect).not.toHaveBeenCalled();
  });

  test('scrolls to highlighted item', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    render(<Search results={mockResults} />);

    const input = screen.getByTestId('search-input');
    await user.type(input, '{ArrowDown}');

    expect(window.HTMLElement.prototype.scrollIntoView).toHaveBeenCalled();
  });
});