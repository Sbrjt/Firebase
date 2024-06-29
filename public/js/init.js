import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js'
import { getMessaging, getToken } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging.js'

let config = {
	apiKey: 'AIzaSyCw3FBktOtoOfr44cDBdIKJrmuHYnW2TqE',
	authDomain: 'fir-functions-d12ef.firebaseapp.com',
	projectId: 'fir-functions-d12ef',
	storageBucket: 'fir-functions-d12ef.appspot.com',
	messagingSenderId: '236253524864',
	appId: '1:236253524864:web:4dfd9d565984190608c765'
}

const app = initializeApp(config)

export { app }

// for getting notification
const messaging = getMessaging(app)
;(async () => {
	try {
		const registration = await navigator.serviceWorker.register('js/sw.js')

		const currentToken = await getToken(messaging, {
			serviceWorkerRegistration: registration,
			vapidKey: 'BFmRzZwDy_YuE6JFHfliputE_SwNWuMazCokkIt107tN8Ccwis3b0jZJtBvbO85YmNTIJkwCRRFbqpL02P5Ru2I'
		})

		console.log('Token: ' + currentToken)
	} catch (err) {
		console.log(err)
	}
})()
