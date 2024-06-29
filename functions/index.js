import { https } from 'firebase-functions/v2/functions'
import { auth } from 'firebase-functions/functions'
import { initializeApp } from 'firebase-admin/app'
import { getFirestore, FieldValue } from 'firebase-admin/firestore'

const app = initializeApp()
const firestore = getFirestore(app)

async function sendNotification(item) {
	const message = {
		notification: {
			title: 'New item added',
			body: item
		},
		topic: 'allUsers'
	}

	const response = await admin.messaging().send(message)
	console.log('Successfully sent message:', response)
}

// create user record (upvotes array is unused as of now)
const newUserSignUp = auth.user().onCreate((usr) => {
	firestore.doc(`users/${usr.uid}`).set({
		email: usr.email,
		upvotedOn: []
	})

	console.log('User created: ', usr.email)

	return
})

// adding a request
const addRequest = https.onCall(async (data, context) => {
	text = data.text
	if (data === null) {
		console.log('Warm up')
		return
	}

	firestore.collection('requests').add({
		text: text,
		upvotes: 0
	})

	console.log('Text added: ', data.text)

	sendNotification(text)

	return
})

// increase request count
const addRequestCount = https.onCall((data, context) => {
	if (data === null) {
		console.log('Warm up')
		return
	}

	if (!context.auth) {
		throw new https.HttpsError('unauthenticated', 'only authenticated users can add requests')
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
