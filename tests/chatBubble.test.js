// import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '@testing-library/react';
import ChatBubble from '../src/app/components/ChatBubble';
// import { JSDOM } from 'jsdom';

// const { document } = new JSDOM('').window;
// global.document = document;


// describe("Header", () => {
    it('should render same text passed into title prop', () => {
        render(
            <ChatBubble 
              owner={true}
              message='Hii'
            />
        );
        // const h1Element = screen.getByText(/Hii/i);
        // expect(h1Element).toBeInTheDocument();
    });
// })