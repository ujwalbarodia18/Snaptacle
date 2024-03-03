import React from 'react'
import '@testing-library/jest-dom';
import { render, screen, act, fireEvent } from '@testing-library/react';
import Story from '../src/app/components/Story';
// import { act, fireEvent } from 'react-dom/test-utils';

jest.mock('next/navigation', () => ({
    useRouter: jest.fn(),
  }));
  
  describe('Story Component', () => {
    test('should handle closing story correctly', () => {
      // Mock the useRouter implementation
      const mockPush = jest.fn();
      const mockRouter = {
        push: mockPush,
      };
      jest.spyOn(require('next/navigation'), 'useRouter').mockReturnValue(mockRouter);
  
      // Render the component
      render(<Story story={{ image: 'story-image-url' }} username="testuser" src="profile-img-url" />);
  
      // Click on the close icon
      act(() => {
        fireEvent.click(screen.getByTestId('close-icon'));
      });
  
      // Assert that router.push was called with the expected URL
      expect(mockPush).toHaveBeenCalledWith('/feed');
    });
  });