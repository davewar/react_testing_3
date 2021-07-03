import { ContactModal } from 'ContactModal';
import React, { useState, useEffect } from 'react';
import { ContactList } from 'ContactList';

import styles from './styles.module.css';

export const App = () => {
	const [addingContact, setaddingContact] = useState(false);
	const [contacts, setContacts] = useState([]);
	const [editContact, setEditContact] = useState();

	const editContac1 = (contactIndex) => {
		setEditContact(contacts[contactIndex]);
	};

	const deleteContact = (contactIndex) => {
		const newContacts = contacts.filter((_, i) => i !== contactIndex);
		setContacts(newContacts);
		localStorage.setItem('contacts', JSON.stringify(newContacts));
	};

	useEffect(() => {
		const storedContacts = localStorage.getItem('contacts');

		if (!storedContacts) {
			localStorage.setItem('contacts', JSON.stringify([]));
			setContacts([]);
		} else {
			setContacts(JSON.parse(storedContacts));
		}
	}, []);

	return (
		<div className={styles.main}>
			{addingContact && (
				<ContactModal
					cancel={() => setaddingContact(undefined)}
					submit={(c) => {
						console.log(c);
						const newContacts = [...contacts, c];
						localStorage.setItem('contacts', JSON.stringify(newContacts));
						setContacts(newContacts);
						setaddingContact(false);
					}}
				/>
			)}

			{typeof editContact === 'number' && (
				<ContactModal
					contact={contacts[editContact]}
					cancel={() => setEditContact(undefined)}
					submit={(c) => {
						const newContacts = contacts.map((contact, index) => {
							if (index === editContact) {
								return c;
							} else {
								return contact;
							}
						});

						// console.log(c);

						localStorage.setItem('contacts', JSON.stringify(newContacts));
						setContacts(newContacts);
						setEditContact(undefined);
					}}
				/>
			)}

			<button
				data-testid='add-contact-btn'
				onClick={() => setaddingContact(true)}
			>
				Add Contact
			</button>

			{!!contacts && (
				<ContactList
					contacts={contacts}
					onDeleteClick={deleteContact}
					onEditClick={(contactIndex) => setEditContact(contactIndex)}
				/>
			)}
		</div>
	);
};
