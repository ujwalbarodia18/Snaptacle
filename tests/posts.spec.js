import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Posts from '../src/app/components/Posts'
import '@testing-library/jest-dom';

jest.mock('next/navigation', () => ({
    useRouter: jest.fn(),
}));


describe('Posts Component', () => {
  test('renders a list of posts', () => {
    const mockPush = jest.fn();
    const mockRouter = {
      push: mockPush,
    };
    jest.spyOn(require('next/navigation'), 'useRouter').mockReturnValue(mockRouter);    
    const mockPosts = [
      { _id: 1, title: 'Post 1', caption: 'Content 1', user: { profileImg: 'http://localhost/testImage1.jpg1' } },
      { _id: 2, title: 'Post 2', caption: 'Content 2', user: { profileImg: 'http://localhost/testImage2.jpg1' } },
    ];

    const setPostId = jest.fn();

    render(<Posts posts={mockPosts} setPostId={setPostId} />);

    mockPosts.forEach((post) => {
        const postTitleElement = screen.getByTestId(post._id);
        expect(postTitleElement).toBeInTheDocument();
      });

    mockPosts.forEach((post) => {
      const postElement = screen.getByTestId(post._id);
      fireEvent.click(postElement);
    });
  });
});
