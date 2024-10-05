import { act, React } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import MockOpenInvestigationsNotification from '../../__mocks__/OpenInvestigationsNotification';

describe('OpenInvestigationsNotification Component', () => {
    test('renders notification button', () => {
        render(<MockOpenInvestigationsNotification open={false} investigations={[]} onClose={jest.fn()} />);

        const notificationButton = screen.getByRole('button', { name: /notifications/i });
        expect(notificationButton).toBeInTheDocument();
    });

    test('shows open investigations in dialog when button is clicked', () => {
        const mockInvestigations = [{ id: 1 }, { id: 2 }];

        render(<MockOpenInvestigationsNotification open={true} investigations={mockInvestigations} onClose={jest.fn()} />);

        expect(screen.getByText(/open investigations/i)).toBeInTheDocument();
        expect(screen.getByText(/Investigation ID: 1/i)).toBeInTheDocument();
        expect(screen.getByText(/Investigation ID: 2/i)).toBeInTheDocument();
    });

    test('shows message when there are no open investigations', () => {
        render(<MockOpenInvestigationsNotification open={true} investigations={[]} onClose={jest.fn()} />);

        expect(screen.getByText(/no open investigations at the moment/i)).toBeInTheDocument();
    });
});
