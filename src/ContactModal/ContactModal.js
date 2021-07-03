import React, { useState, useEffect } from 'react';
import styles from './styles.module.css';

export const ContactModal = ({ cancel, submit, contact }) => {
	const [name, setName] = useState(contact?.name || '');
	const [phone, setPhone] = useState(contact?.phone || '');
	const [email, setEmail] = useState(contact?.email || '');

	const [isValid, setIsValid] = useState(false);

	// has any field being edited ?
	const [nameDirty, setNameDirty] = useState('');
	const [emailDirty, setEmailDirty] = useState('');
	const [phoneDirty, setPhoneDirty] = useState('');

	const [nameError, setNameError] = useState('');
	const [phoneError, setPhoneError] = useState('');
	const [emailError, setEmailError] = useState('');

	useEffect(() => {
		setNameError('');
		setPhoneError('');
		setEmailError('');

		let _valid = (() => {
			if (!name) {
				return false;
			} else if (!email) {
				return false;
			} else if (!phone) {
				return false;
			} else if (!/^[0-9]{3}-[0-9]{3}-[0-9]{4}$/.test(phone)) {
				return false;
			} else if (
				!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
					email
				)
			) {
				return false;
			} else {
				return true;
			}
		})();

		if (nameDirty && !name) {
			setNameError('Name is required');
		} else if (emailDirty && !email) {
			setEmailError('Email is required');
		} else if (phoneDirty && !phone) {
			setPhoneError('Phone is required');
		} else if (phoneDirty && !/^[0-9]{3}-[0-9]{3}-[0-9]{4}$/.test(phone)) {
			setPhoneError('Phone format error. Please correct');
		} else if (
			emailDirty &&
			!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
				email
			)
		) {
			setEmailError('Email format error. Please correct');
		}

		setIsValid(_valid);
	}, [email, name, phone, nameDirty, emailDirty, phoneDirty]);

	return (
		<div className={styles.main}>
			<form
				data-testid='contact-modal-form'
				onSubmit={(e) => {
					e.preventDefault();
					if (isValid) {
						submit({
							name,
							email,
							phone,
						});
					}
				}}
			>
				<div>
					<input
						required
						type='text'
						placeholder='Name'
						value={name}
						onChange={(e) => {
							setName(e.target.value);
							setNameDirty(true);
						}}
					/>

					{!!nameError && (
						<div data-testid='error' className={styles.error}>
							{nameError}
						</div>
					)}
				</div>

				<div>
					<input
						required
						type='text'
						placeholder='Phone Number'
						value={phone}
						onChange={(e) => {
							setPhoneDirty(true);
							setPhone(e.target.value);
						}}
					/>

					{!!phoneError && (
						<div data-testid='error' className={styles.error}>
							{phoneError}
						</div>
					)}
				</div>

				<div>
					<input
						required
						type='text'
						placeholder='Email Address'
						value={email}
						onChange={(e) => {
							setEmailDirty(true);
							setEmail(e.target.value);
						}}
					/>

					{!!emailError && (
						<div data-testid='error' className={styles.error}>
							{emailError}
						</div>
					)}
				</div>
				<button disabled={!isValid}>Submit</button>
				<button type='button' onClick={cancel}>
					Cancel
				</button>
			</form>
		</div>
	);
};
