import { app } from './init.js'
import { getAuth, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js'

const authSwitchLinks = document.querySelectorAll('.switch')
const authModals = document.querySelectorAll('.auth .modal')
const authWrapper = document.querySelector('.auth')
const registerForm = document.querySelector('.register')
const loginForm = document.querySelector('.login')
const signout = document.querySelector('.sign-out')

// toggle auth modals
authSwitchLinks.forEach((link) => {
	link.addEventListener('click', () => {
		authModals.forEach((modal) => modal.classList.toggle('active'))
	})
})

const auth = getAuth(app)

// register form
registerForm.addEventListener('submit', async () => {
	const email = registerForm.email.value
	const password = registerForm.password.value

	try {
		await createUserWithEmailAndPassword(auth, email, password)
		registerForm.reset()
	} catch (err) {
		registerForm.querySelector('.error').textContent = err.message
	}
})

// login form
loginForm.addEventListener('submit', async () => {
	const email = loginForm.email.value
	const pwd = loginForm.password.value

	try {
		await signInWithEmailAndPassword(auth, email, pwd)
		loginForm.reset()
	} catch (err) {
		loginForm.querySelector('.error').textContent = err.message
	}
})

// sign out
signout.addEventListener('click', async () => {
	await signOut(auth)
})

// auth listener
onAuthStateChanged(auth, (usr) => {
	if (usr) {
		authWrapper.classList.remove('open')
		authModals.forEach((modal) => modal.classList.remove('active'))
	}
	else {
		authWrapper.classList.add('open')
		authModals[0].classList.add('active')
	}
})
