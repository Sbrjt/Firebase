import { app } from './init.js'
import { getMessaging, getToken } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging.js'

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
