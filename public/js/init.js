import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js'

let config = {
	apiKey: 'AIzaSyCw3FBktOtoOfr44cDBdIKJrmuHYnW2TqE',
	authDomain: 'fir-functions-d12ef.firebaseapp.com',
	projectId: 'fir-functions-d12ef',
	storageBucket: 'fir-functions-d12ef.appspot.com',
	messagingSenderId: '236253524864',
	appId: '1:236253524864:web:4dfd9d565984190608c765'
}

// if ((location.hostname = 'localhost')) {
// 	config = {
// 		databaseURL: 'http://localhost:4000?ns=emulatorui'
// 	}
// }

const app = initializeApp(config)

export { app }
