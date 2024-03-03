import React from 'react';
import { render, screen } from '@testing-library/react';
import { StoryCircles } from '../src/app/components/StoryCircles';
import '../stylesheets/storyCircle.css'
import '@testing-library/jest-dom';

const mockUser = {
    username: 'mockUser',
    name: 'Mock User',
    profileImg: 'http://localhost/testImage.jpg',
};

describe('StoryCircles component', () => {
    it('renders StoryCircles component with user data', () => {
      render(<StoryCircles user={mockUser} circle={true} />);
  
      const storyCircle = screen.getByTestId('story-circle-main');
      expect(storyCircle).toBeInTheDocument();
  
      const storyImage = screen.getByAltText('');
      const addIcon = screen.getByTestId('add-icon');
      expect(storyImage).toBeInTheDocument();
      expect(addIcon).toBeInTheDocument();
  
      const usernameElement = screen.getByText(mockUser.username);
      expect(usernameElement).toBeInTheDocument();
    });
  
    it('renders StoryCircles component without circle', () => {
      render(<StoryCircles user={null} circle={false} />);
  
      const storyCircle = screen.getByTestId('story-circle-main');
      expect(storyCircle).toBeInTheDocument();
  
      const addStoryText = screen.getByText('Add Story');
      expect(addStoryText).toBeInTheDocument();
    });
});