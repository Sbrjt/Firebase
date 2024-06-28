import * as functions from 'firebase-functions'
import { initializeApp } from 'firebase-admin/app'
import { getFirestore, FieldValue } from 'firebase-admin/firestore'

const app = initializeApp()
const firestore = getFirestore(app)

// create user record (upvotes array is unused as of now)
const newUserSignUp = functions.auth.user().onCreate((usr) => {
	firestore.doc(`users/${usr.uid}`).set({
		email: usr.email,
		upvotedOn: []
	})

	console.log('User created: ', usr.email)

	return
})

// adding a request
const addRequest = functions.https.onCall((data, context) => {
	if (!context.auth) {
		throw new functions.https.HttpsError('unauthenticated', 'only authenticated users can add requests')
	}

	firestore.collection('requests').add({
		text: data.text,
		upvotes: 0
	})

	console.log('Text added: ', data.text)

	return
})

// increase request count
const addRequestCount = functions.https.onCall((data, context) => {
	if (data == null) {
		console.log('data == null')
		return
	}
	if (data.id == null) {
		console.log('data.id == null')
		return
	}
	if (!data) {
		console.log('!data')
		return
	}

	if (!context.auth) {
		throw new functions.https.HttpsError('unauthenticated', 'only authenticated users can add requests')
	}

	firestore.doc(`requests/${data.id}`).update({
		upvotes: FieldValue.increment(1)
	})

	console.log('Incremented record: ', data.id)

	return
})

export { newUserSignUp, addRequest, addRequestCount }

/* 
Console commands:
firebase deploy --only functions
firebase deploy --only functions:addRequestCount
firebase functions:log --only helloWorld
firebase init hosting:github
firebase init emulator  
firebase emulators:start
*/
