module.exports = {
  isAuthenticated: (req, res, next) => {
    if (req.isAuthenticated()) {
      next()
    } else {
      res.redirect('/users/login')
    }
  },
  isInRole: (role) => {
    return (req, res, next) => {
      if (req.isAuthenticated() && req.user.roles.indexOf(role) > -1) {
        next()
      } else {
        res.redirect('/')
      }
    }
  },
  isBlocked: (req, res, next) => {
    if (req.user && !req.user.isBlocked) {
      next()
    } else {
      res.redirect('/')
    }
  }
}
