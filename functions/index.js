import * as functions from 'firebase-functions'
import { initializeApp } from 'firebase-admin/app'
import { getFirestore, FieldValue } from 'firebase-admin/firestore'
import 'firebase-functions/logger/compat'
import { log } from 'firebase-functions/logger'

const app = initializeApp()

const helloWorld = functions.https.onRequest((req, res) => {
	console.log('Hello World')
	log('Hello World')
	res.send('Hello World')
	return
})

const firestore = getFirestore(app)

// create user record (upvotes array is unused as of now)
const newUserSignUp = functions.auth.user().onCreate((usr) => {
	const ref = firestore.doc(`users/${usr.uid}`)
	ref.set({
		email: usr.email,
		upvotedOn: []
	})
	console.log('user created')

	return
})

// adding a request
const addRequest = functions.https.onCall((data, context) => {
	// if (data.text === '') return

	if (!context.auth) {
		throw new functions.https.HttpsError('unauthenticated', 'only authenticated users can add requests')
	}

	console.log(data.text)

	firestore.collection('requests').add({
		text: data.text,
		upvotes: 0
	})

	return
})

// increase request count
const addRequestCount = functions.https.onCall((data, context) => {
	console.log(data.id.length)
	log(data.id.length)
	log('runnning')

	if (!context.auth) {
		throw new functions.https.HttpsError('unauthenticated', 'only authenticated users can add requests')
	}

	const ref = firestore.doc(`requests/${data.id}`)

	ref.update({
		upvotes: FieldValue.increment(1)
	})

	console.log('incrementing')

	return
})

export { newUserSignUp, addRequest, addRequestCount, helloWorld }
