self.addEventListener('push', (e) => {
	const notif = e.data.json().notification
	const data = e.data.json().data
	console.log(notif)
	console.log(data)

	e.waitUntil(
		self.registration.showNotification(notif.title, {
			body: notif.body,
			icon: notif.image,
			data: {
				url: data.url
			}
		})
	)
})

self.addEventListener('notificationclick', (e) => {
	e.waitUntil(clients.openWindow(e.notification.data.url))
})
