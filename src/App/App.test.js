import { render, screen, fireEvent } from '@testing-library/react';
import { App } from './';

const daveObj = {
	name: 'dave',
	email: 'dave@gmail.com',
	phone: '123-456-1234',
};

const bobObj = {
	name: 'bob',
	email: 'bob@gmail.com',
	phone: '111-456-1234',
};

const addContact = (c) => {
	const addContactBtn = screen.getByTestId('add-contact-btn');

	fireEvent.click(addContactBtn);
	expect(screen.getByTestId('contact-modal-form')).toBeInTheDocument();

	const nameInput = screen.getByPlaceholderText('Name');
	const phoneInput = screen.getByPlaceholderText('Phone Number');
	const emailInput = screen.getByPlaceholderText('Email Address');
	const form = screen.getByTestId('contact-modal-form');

	fireEvent.change(nameInput, { target: { value: c.name } });
	fireEvent.change(phoneInput, { target: { value: c.phone } });
	fireEvent.change(emailInput, { target: { value: c.email } });
	fireEvent.submit(form);
};

describe('App', () => {
	test('shows contact modal when add contact button is cicked', () => {
		render(<App />);

		//btn ahould not be in the doc
		expect(screen.queryByTestId('contact-modal-form')).not.toBeInTheDocument();

		const addContectBtn = screen.getByTestId('add-contact-btn');

		fireEvent.click(addContectBtn);
		//should be in the doc
		expect(screen.getByTestId('contact-modal-form')).toBeInTheDocument();
	});

	test('hides contact modal when cancel button clicked', () => {
		render(<App />);
		expect(screen.queryByTestId('contact-modal-form')).not.toBeInTheDocument();

		const addContactBtn = screen.getByTestId('add-contact-btn');

		fireEvent.click(addContactBtn);

		const cancelBtn = screen.getByText('Cancel');
		fireEvent.click(cancelBtn);

		expect(screen.queryByTestId('contact-modal-form')).not.toBeInTheDocument();
	});

	test('closes modal automatically after submit', () => {
		render(<App />);
		expect(screen.queryByTestId('contact-modal-form')).not.toBeInTheDocument();

		const addContactBtn = screen.getByTestId('add-contact-btn');

		addContact(daveObj);

		expect(screen.queryByTestId('contact-modal-form')).not.toBeInTheDocument();
	});
});

describe('localstorage', () => {
	beforeEach(() => {
		Object.defineProperty(window, 'localStorage', {
			value: {
				getItem: jest.fn(() => null),
				setItem: jest.fn((c) => c),
			},
			writable: true,
		});
	});

	test('initalises empty array in localstorage if no contacts are stored', () => {
		render(<App />);
		expect(window.localStorage.setItem).toHaveBeenCalledWith(
			'contacts',
			JSON.stringify([])
		);
	});

	test('propertly manages the edit scneraio for the contact modal', () => {
		render(<App />);

		addContact(daveObj);
		const editBtn = screen.getByTestId('edit-btn-0');
		fireEvent.click(editBtn);
		expect(screen.getByTestId('contact-modal-form')).toBeInTheDocument();

		const nameInput = screen.getByPlaceholderText('Name');

		expect(nameInput).toHaveValue('dave');

		fireEvent.change(nameInput, { target: { value: 'dave1' } });

		// expect(nameInput).toHaveValue('dave1');

		fireEvent.click(screen.getByText('Submit'));

		expect(window.localStorage.setItem).toHaveBeenCalledWith(
			'contacts',
			JSON.stringify([{ ...daveObj, name: 'dave1' }])
		);
	});

	test('Properly manages the deletion of contacts', () => {
		render(<App />);

		addContact(daveObj);
		addContact(bobObj);

		// expect(window.localStorage.setItem).toHaveBeenCalledWith(
		// 	'contacts',
		// 	JSON.stringify([daveObj])
		// );

		expect(window.localStorage.setItem).toHaveBeenCalledWith(
			'contacts',
			JSON.stringify([daveObj, bobObj])
		);

		const deleteBtn = screen.getByTestId('delete-btn-0');
		fireEvent.click(deleteBtn);

		expect(window.localStorage.setItem).toHaveBeenCalledWith(
			'contacts',
			JSON.stringify([bobObj])
		);
	});

	test('Properly stores submitted users', () => {
		render(<App />);

		expect(screen.queryByTestId('contact-modal-form')).not.toBeInTheDocument();

		addContact(daveObj);

		expect(screen.queryByTestId('contact-modal-form')).not.toBeInTheDocument();

		expect(window.localStorage.setItem).toHaveBeenCalledWith(
			'contacts',
			JSON.stringify([daveObj])
		);

		addContact(bobObj);
		expect(screen.queryByTestId('contact-modal-form')).not.toBeInTheDocument();
		// screen.debug();
		expect(window.localStorage.setItem).toHaveBeenCalledWith(
			'contacts',
			JSON.stringify([daveObj, bobObj])
		);
	});
});
