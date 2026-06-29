self.addEventListener('push', function (e) {
  const data = e.data ? e.data.json() : {}
  e.waitUntil(
    self.registration.showNotification(data.title || 'Neighbor Abroad', {
      body: data.body || '',
      icon: '/favicon.ico',
      data: { url: data.url || '/' },
    })
  )
})

self.addEventListener('notificationclick', function (e) {
  e.notification.close()
  e.waitUntil(clients.openWindow(e.notification.data?.url || '/'))
})
