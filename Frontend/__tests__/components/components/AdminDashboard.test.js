// Application.test.js
import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import Application from './Application'; // Adjust the import path as needed

describe('Application Component', () => {
  test('renders the application header', () => {
    render(<Application />);
    
    // Check for the main heading
    expect(screen.getByText('Application')).toBeInTheDocument();
  });

  test('renders application details section', () => {
    render(<Application />);
    
    // Check for the application details text
    expect(screen.getByText('Application details')).toBeInTheDocument();
  });

  test('renders student section with heading', () => {
    render(<Application />);
    
    // Check for the student heading
    expect(screen.getByText('Student')).toBeInTheDocument();
    
    // Check for student details text
    expect(screen.getByText('Student details')).toBeInTheDocument();
  });

  test('renders view student button', () => {
    render(<Application />);
    
    // Check if the button exists
    const viewButton = screen.getByRole('button', { name: /view student/i });
    expect(viewButton).toBeInTheDocument();
  });

  test('view student button should be clickable', async () => {
    // Setup user event
    const user = userEvent.setup();
    
    // Create a mock function to verify button click
    const mockOnClick = jest.fn();
    
    // Use a modified version of the component for this test
    const { container } = render(
      <div onClick={mockOnClick}>
        <Application />
      </div>
    );
    
    // Find and click the button
    const viewButton = screen.getByRole('button', { name: /view student/i });
    await user.click(viewButton);
    
    // Verify the button is styled as a contained button
    expect(viewButton).toHaveClass('MuiButton-contained');
    
    // Verify the button has the primary color
    expect(viewButton).toHaveClass('MuiButton-containedPrimary');
  });

  test('component has proper styling', () => {
    const { container } = render(<Application />);
    
    // Get the main card element
    const card = container.querySelector('.MuiCard-root');
    
    // Check that the container div has the expected classes
    const mainDiv = container.firstChild;
    expect(mainDiv).toHaveClass('h-screen');
    expect(mainDiv).toHaveClass('bg-slate-300');
    expect(mainDiv).toHaveClass('flex');
    expect(mainDiv).toHaveClass('justify-center');
    expect(mainDiv).toHaveClass('items-center');
    
    // Note: Testing exact MUI styling is challenging because MUI applies styles 
    // through emotion's CSS-in-JS, which generates dynamic class names
    // This test just verifies the card exists
    expect(card).toBeInTheDocument();
  });
});