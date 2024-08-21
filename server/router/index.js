const Router = require('express').Router
const UserCtrl = require('../controllers/user-controller')
const router = new Router()

router.post('/registration', UserCtrl.registration)
router.post('/login', UserCtrl.login)
router.post('/logout', UserCtrl.logout)
router.get('/activate/:link', UserCtrl.activate)
router.get('/refresh', UserCtrl.refresh)
router.get('/users', UserCtrl.getUsers)

module.exports = router