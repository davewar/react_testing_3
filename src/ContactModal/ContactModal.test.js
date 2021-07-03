import { render, screen, fireEvent } from '@testing-library/react';
import { ContactModal } from './';

// afterEach(cleanup);

// test('renders learn react link', async () => {
//   render(<ContactModal/>);
//    const text = await screen.findByText('Iam contact Modal')
//   expect(text).toBeInTheDocument()
// });

describe('edit contact', () => {
	test('Intialise form with contact info', async () => {
		render(
			<ContactModal
				contact={{ name: 'joe', phone: '123-456-7889', email: 'joe@gmail.com' }}
			/>
		);

		const nameInput = screen.queryByPlaceholderText('Name');
		const phoneInput = screen.queryByPlaceholderText('Phone Number');
		const emailInput = screen.queryByPlaceholderText('Email Address');
		const submitButton = screen.getByText('Submit');

		expect(nameInput).toBeInTheDocument();
		expect(phoneInput).toBeInTheDocument();
		expect(emailInput).toBeInTheDocument();

		expect(nameInput).toHaveValue('joe');
		expect(phoneInput).toHaveValue('123-456-7889');
		expect(emailInput).toHaveValue('joe@gmail.com');

		//no error messages
		expect(screen.queryByTestId('error')).not.toBeInTheDocument();

		expect(submitButton).not.toBeDisabled();
	});
});

describe('create Contact', () => {
	test('form with emply values', async () => {
		render(<ContactModal />);

		const nameInput = screen.queryByPlaceholderText('Name');
		const phoneInput = screen.queryByPlaceholderText('Phone Number');
		const emailInput = screen.queryByPlaceholderText('Email Address');
		const submitButton = screen.getByText('Submit');

		expect(nameInput).toBeInTheDocument();
		expect(phoneInput).toBeInTheDocument();
		expect(emailInput).toBeInTheDocument();

		expect(nameInput).toHaveValue('');
		expect(phoneInput).toHaveValue('');
		expect(emailInput).toHaveValue('');

		//no error messages
		expect(screen.queryByTestId('error')).not.toBeInTheDocument();

		expect(submitButton).toBeDisabled();
	});

	test('disables submit button until form is valid', () => {
		render(<ContactModal />);
		const nameInput = screen.queryByPlaceholderText('Name');
		const phoneInput = screen.queryByPlaceholderText('Phone Number');
		const emailInput = screen.queryByPlaceholderText('Email Address');

		const submitButton = screen.getByText('Submit');

		fireEvent.change(nameInput, { target: { value: 'dave' } });
		fireEvent.change(phoneInput, { target: { value: '123-456-1234' } });
		fireEvent.change(emailInput, { target: { value: 'dave@gmail.com' } });

		expect(nameInput).toHaveValue('dave');

		expect(submitButton).not.toBeDisabled();
	});

	test('Enables submit button when input form valid', () => {
		render(<ContactModal />);

		const nameInput = screen.queryByPlaceholderText('Name');
		const phoneInput = screen.queryByPlaceholderText('Phone Number');
		const emailInput = screen.queryByPlaceholderText('Email Address');

		const submitButton = screen.getByText('Submit');

		fireEvent.change(nameInput, { target: { value: 'dave' } });

		expect(screen.queryByTestId('error')).not.toBeInTheDocument();

		fireEvent.change(phoneInput, { target: { value: '123-456-1234' } });

		expect(screen.queryByTestId('error')).not.toBeInTheDocument();

		//invalid email
		fireEvent.change(emailInput, { target: { value: 'davegmail.com' } });
		expect(submitButton).toBeDisabled();

		fireEvent.change(emailInput, { target: { value: 'dave@gmail.com' } });

		expect(screen.queryByTestId('error')).not.toBeInTheDocument();
		expect(submitButton).not.toBeDisabled();

		// invalid number
		fireEvent.change(phoneInput, { target: { value: '123-456-12341' } });
		expect(submitButton).toBeDisabled();

		// valid number
		fireEvent.change(phoneInput, { target: { value: '123-456-1234' } });
		expect(submitButton).not.toBeDisabled();
	});

	test('displays error message for invalid input', () => {
		render(<ContactModal />);

		const nameInput = screen.queryByPlaceholderText('Name');

		const phoneInput = screen.queryByPlaceholderText('Phone Number');
		const emailInput = screen.queryByPlaceholderText('Email Address');

		// const submitButton =  screen.getByText('Submit')
		fireEvent.change(nameInput, { target: { value: 'dave' } });
		fireEvent.change(phoneInput, { target: { value: '123-456-1234' } });
		// incorrect email
		fireEvent.change(emailInput, { target: { value: 'davegmail.com' } });

		let errorDiv = screen.queryByTestId('error');
		expect(errorDiv).toHaveTextContent('Email format error. Please correct');

		fireEvent.change(emailInput, { target: { value: 'bob@gmail.com' } });
		fireEvent.change(phoneInput, { target: { value: '12345612345' } });

		errorDiv = screen.queryByTestId('error');
		expect(errorDiv).toHaveTextContent('Phone format error. Please correct');

		//email corrected && tel no invalid
		fireEvent.change(phoneInput, { target: { value: '123-456-1235' } });

		errorDiv = screen.queryByTestId('error');
		expect(errorDiv).not.toBeInTheDocument();
	});

	test('Prevents submit function from being called if invalid', () => {
		const onSubmit = jest.fn();
		render(<ContactModal submit={onSubmit} />);

		const nameInput = screen.getByPlaceholderText('Name');
		const phoneInput = screen.getByPlaceholderText('Phone Number');
		const emailInput = screen.getByPlaceholderText('Email Address');
		const submitButton = screen.getByText('Submit');
		const form = screen.getByTestId('contact-modal-form');
		//email wrong, all other fields correct
		fireEvent.change(nameInput, { target: { value: 'dave' } });
		fireEvent.change(phoneInput, { target: { value: '123-456-1234' } });
		fireEvent.change(emailInput, { target: { value: 'davegmail.com' } });

		expect(submitButton).toBeDisabled();

		fireEvent.submit(form);
		expect(onSubmit).not.toHaveBeenCalled();

		//email fixed
		fireEvent.change(emailInput, { target: { value: 'dave@gmail.com' } });
		fireEvent.submit(form);
		expect(onSubmit).toHaveBeenCalled();
	});

	test('Calls cancel when cancel button is pressed', () => {
		const cancelfn = jest.fn();
		render(<ContactModal cancel={cancelfn} />);

		const cancelBtn = screen.getByText('Cancel');

		fireEvent.click(cancelBtn);
		expect(cancelfn).toHaveBeenCalled();
	});
});
