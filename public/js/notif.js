import { app } from './init.js'
import { getMessaging, getToken } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging.js'
import { getFunctions, httpsCallable } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-functions.js'

const messaging = getMessaging(app)
const functions = getFunctions(app)
const addToken = httpsCallable(functions, 'addToken')

const btn = document.getElementById('btn')

btn.addEventListener('click', async () => {
	const registration = await navigator.serviceWorker.register('js/sw.js')

	const token = await getToken(messaging, {
		serviceWorkerRegistration: registration,
		vapidKey: 'BFmRzZwDy_YuE6JFHfliputE_SwNWuMazCokkIt107tN8Ccwis3b0jZJtBvbO85YmNTIJkwCRRFbqpL02P5Ru2I'
	})

	addToken({ token: token })
})
