import { app } from './init.js'
import { getFunctions, httpsCallable } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-functions.js'
import { getFirestore, collection, onSnapshot, connectFirestoreEmulator } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js'

const firestore = getFirestore(app)

const functions = getFunctions(app)
const addRequest = httpsCallable(functions, 'addRequest')
const addRequestCount = httpsCallable(functions, 'addRequestCount')

// adding request
const requestModal = document.querySelector('.new-request')
const requestLink = document.querySelector('.add-request')
const requestForm = document.querySelector('.new-request form')

// open request modal
requestLink.addEventListener('click', () => {
	requestModal.classList.add('open')
})

// close request modal
requestModal.addEventListener('click', (e) => {
	if (e.target.classList.contains('new-request')) {
		requestModal.classList.remove('open')
	}
})

// add new request to db
requestForm.addEventListener('submit', () => {
	addRequest({ text: requestForm.request.value })
	requestForm.reset()
	requestForm.querySelector('.error').textContent = ''
	requestModal.classList.remove('open')
})

// add upvote
const request = document.querySelector('ul')
request.addEventListener('click', (e) => {
	if (e.target.tagName == 'I') {
		try {
			addRequestCount({ id: e.target.id })
		} catch (err) {
			console.log(err.message)
		}
	}
})

// rebuild the request div on changes in db
onSnapshot(collection(firestore, 'requests'), (snap) => {
	let html = ''

	snap.forEach((doc) => {
		const { text, upvotes } = doc.data()
		const id = doc.id

		html += `
        <li>
            <span class="text">${text}</span>
            <div>
                <span class="votes">${upvotes}</span>
                <i id="${id}" class="material-icons upvote">arrow_upward</i>
            </div>
        </li>
        `
	})

	document.querySelector('ul').innerHTML = html
})

// warm up the firebase functions
setInterval(() => {
	addRequest({ isDummyCall: true })
	addRequestCount({ isDummyCall: true })
	console.log('warm up')
}, 10000)
