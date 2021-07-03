import { render, screen, fireEvent } from '@testing-library/react';
import { ContactList } from './';

test('renderslist of contacts', () => {
	const contacts = [
		{
			name: 'bob',
			email: 'bob@gmail.com',
			phone: '122-111-1111',
		},
		{
			name: 'davew',
			email: 'davew@gmail.com',
			phone: '122-111-4444',
		},
	];

	render(<ContactList contacts={contacts} />);

	const joeRow = screen.getByTestId('contact-0');
	const daveRow = screen.getByTestId('contact-1');

	expect(joeRow).toHaveTextContent('bob');
	expect(joeRow).toHaveTextContent('bob@gmail.com');
	expect(joeRow).toHaveTextContent('122-111-1111');

	expect(daveRow).toHaveTextContent('davew');
	expect(daveRow).toHaveTextContent('davew@gmail.com');
	expect(daveRow).toHaveTextContent('122-111-4444');
});

test('calls the edit function when edit button is clicked', () => {
	const contacts = [
		{
			name: 'joe',
			email: 'joe@gmail.com',
			phone: '122-111-1111',
		},
	];

	const editFn = jest.fn();

	render(<ContactList contacts={contacts} onEditClick={editFn} />);

	const editBtnJoe = screen.getByTestId('edit-btn-0');
	fireEvent.click(editBtnJoe);
	expect(editFn).toHaveBeenCalledWith(0);
});

test('calls the delete function when edit button is clicked', () => {
	const contacts = [
		{
			name: 'joe',
			email: 'joe@gmail.com',
			phone: '122-111-1111',
		},
	];

	const deleteFn = jest.fn();

	render(<ContactList contacts={contacts} onDeleteClick={deleteFn} />);

	const deleteBtnJoe = screen.getByTestId('delete-btn-0');
	fireEvent.click(deleteBtnJoe);
	expect(deleteFn).toHaveBeenCalledWith(0);
});
