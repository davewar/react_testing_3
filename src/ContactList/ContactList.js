import React from 'react';
import styles from './styles.module.css';

export const ContactList = ({ contacts, onEditClick, onDeleteClick }) => {
	return (
		<div className={styles.main}>
			{contacts.map((item, index) => (
				<div key={`row-${index}`} data-testid={`contact-${index}`}>
					<div>Name {item.name}</div>
					<div>Phone {item.phone}</div>
					<div>Email {item.email}</div>

					<div
						data-testid={`edit-btn-${index}`}
						onClick={() => {
							onEditClick(index);
						}}
					>
						Edit
					</div>

					<div
						data-testid={`delete-btn-${index}`}
						onClick={() => {
							onDeleteClick(index);
						}}
					>
						Delete
					</div>
				</div>
			))}
		</div>
	);
};
