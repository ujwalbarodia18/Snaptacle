import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Otp from '../src/app/components/Otp';
import '../stylesheets/storyCircle.css'
import '@testing-library/jest-dom';

import MockAdapter from 'axios-mock-adapter';
import axios from 'axios'

const mockAxios = new MockAdapter(axios);

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

describe('Otp component', () => {
  it('renders Otp component and handles verification correctly', async () => {
    const mockPush = jest.fn();
    const mockRouter = {
      push: mockPush,
    };
    jest.spyOn(require('next/navigation'), 'useRouter').mockReturnValue(mockRouter);
    const mockToken = 'mockToken';
    const mockEmail = 'mockuser@email.com';

    render(<Otp token={mockToken} email={mockEmail} />);

    const otpContainer = screen.getByTestId('main-otp');
    expect(otpContainer).toBeInTheDocument();

    const otpInput = screen.getByPlaceholderText('Enter the OTP');
    fireEvent.change(otpInput, { target: { value: '123456' } });

    mockAxios.onPost(`${process.env.NEXT_PUBLIC_APIURL}/verification`).reply(200, { message: true });

    const verifyButton = screen.getByText('Verify');
    fireEvent.click(verifyButton);

    await waitFor(() => {
      expect(mockRouter.push).toHaveBeenCalledWith('/feed');
    });
  });
});