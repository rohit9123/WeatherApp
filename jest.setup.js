// In jest.setup.js
import { configure } from '@testing-library/react';
import '@testing-library/jest-dom';

// This tells Testing Library to look for data-test attributes
configure({ testIdAttribute: 'data-test' });

// OR to use data-testid (default)
configure({ testIdAttribute: 'data-testid' });