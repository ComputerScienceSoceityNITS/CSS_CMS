const express = require('express');
const router=express.Router();
const {login,signUp}=require('../controllers/userController');

router.post('/signup',signUp);
router.post('/login',login);