const Item = require('../models/item'); // Pastikan path-nya benar
const User = require('../models/user');
const mongoose = require('mongoose');

exports.createItem = async (req, res) => {
    console.log(req.userId);
    const { type, amount, category, description, date } = req.body ;
    const userId = req.userId;
    
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).send('Invalid userId format');
    }
    try {
        const item = new Item({
            userId,
            type,
            amount,
            category,
            description,
            date
        });
        console.log( 'type : ' ,type);// debuging
        await item.save();
        res.status(201).send('Item berhasil dibuat');
    } catch (error) {
        res.status(400).send('Error creating item: ' + error.message);
    }
};


exports.deleteItem = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid item ID format' });
    }

    try {
        const deletedItem = await Item.findByIdAndDelete(id);
        if (!deletedItem) {
            return res.status(404).send('Item tidak ditemukan');
        }
        
        // Ambil userId dari req (pastikan middleware auth mengeset req.userId)
        const userId = req.userId;
        // Ambil item-item terbaru milik user
        const items = await Item.find({ userId }).sort({ date: -1 });
        // Hitung saldo terbaru
        let totalBalance = 0;
        items.forEach((item) => {
            if (item.type === 'income') {
                totalBalance += Number(item.amount);
            } else {
                totalBalance -= Number(item.amount);
            }
        });

        // Kirim response dengan saldo dan item terbaru
        res.json({ message: 'Item berhasil dihapus', totalBalance, items });
    } catch (error) {
        res.status(500).send('Error deleting item: ' + error.message);
    }
};


exports.getItems = async (req, res) => {
    const userId = req.userId;
    

    try {
        const items = await Item.find({userId}).sort({date: -1});
        let totalBalance = 0;
        items.forEach((item) => {
           
            if(item.type === 'income') {
                totalBalance += Number(item.amount);   
            } else {
                totalBalance -= Number(item.amount);
            }
        } );
        console.log("Items:", items);
        console.log("Total Balance:", totalBalance);
        res.json({totalBalance,items} );
    } catch (error) {
        res.status(500).json({ message: 'Error calculating total balance ', error: error.message });
    }
};

exports.updateItem = async (req, res) => {
    const { id } = req.params;
    const {type, amount, category, description, date } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid item ID format' });
    }

    try {
        const updatedItem = await Item.findByIdAndUpdate(id, {type, amount, category, description, date}, { new: true });
        if (!updatedItem) {
            return res.status(404).send('Item tidak ditemukan');
        }
        res.send('Item berhasil diupdate');
    } catch (error) {
        res.status(400).send('Error updating item: ' + error.message);
    }
};

// exports.deleteItem = async (req, res) => {
//     const { id } = req.params;

//     if (!mongoose.Types.ObjectId.isValid(id)) {
//         return res.status(400).json({ message: 'Invalid item ID format' });
//     }

//     try {
//         const deletedItem = await Item.findByIdAndDelete(id);
//         if (!deletedItem) {
//             return res.status(404).send('Item tidak ditemukan');
//         }
        
//     } catch (error) {
//         res.status(500).send('Error deleting item: ' + error.message);
//     }
// };
