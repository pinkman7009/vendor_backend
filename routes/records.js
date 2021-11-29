const express = require('express')
const Record = require("../models/Record")
const User = require("../models/User")
const {protect,authorize} = require("../middleware/auth");

const router = express.Router();

// Get all records
router.get("/", protect, authorize(0), async (req, res) => {
    try {
        const records = await Record.find().populate("user");

        res.status(200).json({
            data: records
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Server error",
        });
    }
});


// Get records of a user
router.get("/userId/:id", protect, authorize(0, 1), async (req, res) => {
    try {

        const user = await User.findById(req.params.id)

        if(!user)
        {
            return res.status(404).json({
                message: "User with this ID not found"
            })
        }
        const records = await Record.find({ user: req.params.id }).populate("user");

        res.status(200).json({
            data: records
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Server error",
        });
    }
})

// Get record by record ID
router.get("/:id", protect, authorize(0,1), async (req, res) => {
    try {
        const record = await Record.findById(req.params.id).populate('user')

        if(!record)
        {
            return res.status(404).json({
                message: "Record with this ID does not exist"
            })
        }

        res.status(200).json({
            data: record
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Server error",
        });
    }
});


// Add a record
router.post("/", protect, authorize(0,1), async (req, res) => {
    try {
        req.body.user = req.user.id;
        const record = new Record(req.body);

        await record.save();

        res.status(201).json({
            data: record,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Server error",
        });
    }
});

// Update a record
router.put("/:id", protect, authorize(0,1), async (req, res) => {
    try {

        const record = await Record.findById(req.params.id)

        if(!record)
        {
            return res.status(404).json({
                message: "Record with this ID not found"
            })
        }

        record.username = req.body.username || record.username;
        record.name = req.body.name || record.name;
        record.accountNo = req.body.accountNo || record.accountNo;
        record.IFSC = req.body.IFSC || record.IFSC;
        record.amount = req.body.amount || record.amount;
        record.date = req.body.date || record.date

        await record.save();

        res.status(200).json({
            message: "Record has been updated",
            data: record
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Server error",
        });
    }
});

// Delete a record
router.delete("/:id", protect, authorize(0,1), async (req, res) => {
    try {


        const record = await Record.findById(req.params.id)

        if(!record)
        {
            return res.status(404).json({
                message: "Record with this ID not found"
            })
        }
        
        await record.remove();

        res.status(200).json({
            message: "Record has been removed",
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Server error",
        });
    }
});



module.exports = router;