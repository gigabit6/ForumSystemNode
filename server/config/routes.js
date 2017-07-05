const controllers = require('../controllers')
const auth = require('./auth')

module.exports = (app) => {
  app.get('/', controllers.home.index)
  app.get('/about', auth.isAuthenticated, controllers.home.about)

  app.get('/users/register', controllers.users.registerGet)
  app.post('/users/register', controllers.users.registerPost)
  app.get('/users/login', controllers.users.loginGet)
  app.post('/users/login', controllers.users.loginPost)
  app.post('/users/logout', controllers.users.logout)
  app.get('/profile/:username', auth.isAuthenticated, controllers.users.profileGet)

  app.get('/admins/all', auth.isInRole('Admin'), controllers.users.list)
  app.get('/admins/add/:id', auth.isInRole('Admin'), controllers.users.addAdmin)
  app.get('/user/block/:id', auth.isInRole('Admin'), controllers.users.blockUser)

  app.get('/thread/add', auth.isBlocked, auth.isAuthenticated, controllers.threads.addGet)
  app.post('/thread/add', auth.isBlocked, auth.isAuthenticated, controllers.threads.addPost)

  app.get('/thread/edit/:id', auth.isInRole('Admin'), controllers.threads.editGet)
  app.post('/thread/edit/:id', auth.isInRole('Admin'), controllers.threads.editPost)

  app.post('/thread/delete/:id', auth.isInRole('Admin'), controllers.threads.deletePost)

  app.get('/answer/edit/:id', auth.isInRole('Admin'), controllers.answers.editGet)
  app.post('/answer/edit/:id', auth.isInRole('Admin'), controllers.answers.editPost)

  app.post('/answer/delete/:id', auth.isInRole('Admin'), controllers.answers.deletePost)

  app.get('/thread/all', controllers.threads.listGet)

  app.get('/thread/like/:id', auth.isAuthenticated, controllers.threads.like)
  app.get('/thread/unlike/:id', auth.isAuthenticated, controllers.threads.unlike)

  app.get('/thread/:id/:title', controllers.threads.detailsGet)

  app.post('/answer/add', auth.isBlocked, auth.isAuthenticated, controllers.answers.addPost)

  app.get('/category/add', auth.isInRole('Admin'), controllers.categories.addGet)
  app.post('/category/add', auth.isInRole('Admin'), controllers.categories.addPost)

  app.post('/category/delete/:id', auth.isInRole('Admin'), controllers.categories.deletePost)

  app.get('/categories', controllers.categories.all)

  app.get('/list/:name', controllers.categories.threadsByCategory)

  app.all('*', (req, res) => {
    res.status(404)
    res.send('404 Not Found!')
    res.end()
  })
}
