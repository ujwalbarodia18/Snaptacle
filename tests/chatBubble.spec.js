// import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '@testing-library/react';
import ChatBubble from '../src/app/components/ChatBubble';
import '@testing-library/jest-dom';
// import { JSDOM } from 'jsdom';

// const { document } = new JSDOM('').window;
// global.document = document;


describe("Header", () => {
    it('should render same text passed into title prop', () => {
        const message = 'Hii'
        render(
            <ChatBubble 
              owner={true}
              message={message}
            />
        );
        const chatBubble = screen.getByTestId('chat-bubble');
        expect(chatBubble).toBeInTheDocument();
        expect(chatBubble).toHaveClass('main-chat-bubble');

        const messageElement = screen.getByText(message);
        expect(messageElement).toBeInTheDocument();
    });
})