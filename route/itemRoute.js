const express = require('express');
const {authenticationToken} = require('../middleware/authToken');
const router = express.Router();
console.log(require('path').resolve(__dirname, '../controller/itemController'));

const itemController =require('../controller/itemController');
const validateItem = require('../middleware/validateItem');

router.post('/protected/post', authenticationToken ,validateItem ,itemController.createItem);
router.get('/protected/get', authenticationToken ,itemController.getItems);
router.put('/protected/update/:id', authenticationToken ,itemController.updateItem);
router.delete('/protected/delete/:id', authenticationToken ,itemController.deleteItem);

module.exports = router ;