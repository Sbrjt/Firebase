import { auth, https } from 'firebase-functions'
import { initializeApp } from 'firebase-admin/app'
import { getFirestore, FieldValue } from 'firebase-admin/firestore'
import { getMessaging } from 'firebase-admin/messaging'

const app = initializeApp()
const firestore = getFirestore(app)

// create user record (unused function)
const newUserSignUp = auth.user().onCreate((usr) => {
	firestore.doc(`users/${usr.uid}`).set({
		email: usr.email
	})

	console.log('User created: ', usr.email)

	return
})

// adds user token for receiving notification
const addToken = https.onCall(async (data, context) => {
	if (!context.auth) {
		throw new https.HttpsError('unauthenticated', 'only authenticated users can add requests')
	}

	await firestore.doc(`tokens/tokens`).update({
		tokens: FieldValue.arrayUnion(data.token)
	})

	console.log('Token added: ', data.token)

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

// adding a request
const addRequest = https.onCall(async (data, context) => {
	if (data === null) {
		console.log('Warm up')
		return
	}

	if (!context.auth) {
		throw new https.HttpsError('unauthenticated', 'only authenticated users can add requests')
	}

	firestore.collection('requests').add({
		text: data.text,
		upvotes: 0
	})

	console.log('Text added: ', data.text)
	await sendNotification(data.text)
	return
})

// helper function to send notification when addRequest() is invoked
async function sendNotification(text) {
	const doc = await firestore.doc(`tokens/tokens`).get()
	const tokens = doc.data().tokens
	// console.log(tokens)

	const msg = {
		notification: {
			title: text,
			body: 'New item added'
		},
		data: { url: 'https://fir-functions-d12ef.firebaseapp.com/' },
		tokens: tokens
	}

	const response = await getMessaging().sendMulticast(msg)
	console.log('Sent', response.successCount, 'messages')
	return
}

export { newUserSignUp, addRequest, addRequestCount, addToken }

/* 
Console commands:
firebase deploy --only functions
firebase deploy --only functions:addRequestCount
firebase functions:log --only helloWorld
firebase init hosting:github
firebase init emulator  
firebase emulators:start
*/
