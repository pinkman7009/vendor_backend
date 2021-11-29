const express = require("express");
const {protect,authorize} = require("../middleware/auth");
const User = require("../models/User");

const router = express.Router()

// Get all users

router.get("/", protect, authorize(0), async (req,res) => {
    try {
        const users = await User.find({role: 1});

        res.status(200).json(users)
    } catch (error) {
        console.error(err.message);
        res.status(500).send("server error");
    }
})

// Get user by ID

router.get("/:id", protect, authorize(0,1), async (req,res) => {
    try {
        const user = await User.findById(req.params.id);

        if(!user)
        {
            return res.status(404).json({
                message: "User with this ID not found"
            })
        }

        res.status(200).json(user)
    } catch (error) {
        console.error(err.message);
        res.status(500).send("server error");
    }
})

// Approve User login

router.put("/approve/:id", protect, authorize(0), async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if(!user)
        {
            return res.status(404).json({
                message: "User with this ID not found"
            })
        }

        user.canLogin = req.body.canLogin || user.canLogin;

        await user.save();

        res.status(200).json({
            message: `User login status updated to ${user.canLogin}` 
        })

    } catch (err) {
        console.error(err.message);
        res.status(500).send("server error");
    }
});


module.exports = router;