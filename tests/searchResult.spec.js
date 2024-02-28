import React from 'react';
import { render, screen } from '@testing-library/react';
import SearchResult from '../src/app/components/SearchResult';
import '@testing-library/jest-dom';

describe('SearchResult component', () => {
  const mockUser = {
    username: 'mockUser',
    name: 'Mock User',
    profileImg: 'http://localhost/testImage.jpg',
  };

  it('renders SearchResult component with user data', () => {
    render(<SearchResult user={mockUser} />);

    const searchResult = screen.getByTestId('search-result');
    expect(searchResult).toBeInTheDocument();
    
    const usernameElement = screen.getByText(mockUser.username);
    const nameElement = screen.getByText(mockUser.name);
    const imgElement = screen.getByAltText('');
    expect(usernameElement).toBeInTheDocument();
    expect(nameElement).toBeInTheDocument();
    expect(imgElement).toBeInTheDocument();
    expect(imgElement.src).toBe(mockUser.profileImg)
  });
});
