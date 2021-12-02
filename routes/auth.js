const express = require("express");
const { body, validationResult } = require("express-validator");
const router = express.Router();
const User = require("../models/User");
const {protect,authorize} = require("../middleware/auth");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Get logged in User
router.get("/me", protect, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("server error");
    }
});

// Register User
router.post(
    "/register",
    [
      body("name").not().isEmpty(),
      body("phone").not().isEmpty(),
      body("password").isLength({ min: 5 }),
      body("role").not().isEmpty(),
    ],
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
  
      const {
        name,
        role,
        phone,
        password,
      } = req.body;
      try {
        let user = await User.findOne({ phone });
  
        if (user) {
          res.status(400).json({ message: "Phone number already used" });
        }
  
        user = new User({
            name,
            phone,
            role
        });
  
        const salt = await bcrypt.genSalt(10);
  
        user.password = await bcrypt.hash(password, salt);
  
        await user.save();
  
        const payload = {
            id: user.id,
        };
  
        jwt.sign(
          payload,
          process.env.jwtSecret,
          {
            expiresIn: 360000,
          },
          (err, token) => {
            if (err) throw err;
            res.json({ token });
          }
        );
      } catch (err) {
        console.error({error: err.message});
        res.status(500).send("server error");
      }
    }
  );
  
  

// Login User
router.post(
    "/login",
    [body("password").exists()],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { phone, password } = req.body;

        try {
            let user = await User.findOne({ phone });

            if (!user) {
                return res.status(400).json({ message: "Invalid Credentials" });
            }

            if(user.canLogin === false)
            {
                return res.status(403).json({
                    message: "User login not approved by admin"
                })
            }
            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch) {
                return res.status(400).json({ message: "Wrong Password" });
            }

            const payload = {
                id: user.id,
            };

            jwt.sign(
                payload,
                process.env.jwtSecret,
                {
                    expiresIn: 360000,
                },
                (err, token) => {
                    if (err) throw err;
                    res.json({ token, user });
                }
            );
        } catch (err) {
            console.error(err.message);
            res.status(500).json({ msg: err.message });
        }
    }
);

// Register Admin
router.post(
    "/admin/register",
    [
       
        body("email").isEmail(),
        body("password").isLength({ min: 5 }),
        body("role").not().isEmpty(),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { name,phone,email,password,role} =
            req.body;

        try {
            let user = await User.findOne({ email });

            if (user) {
                res.status(400).json({ msg: "Email id already used" });
            }

            user = new User({
                name,
                phone,
                email,
                role
            });

            const salt = await bcrypt.genSalt(10);

            user.password = await bcrypt.hash(password, salt);

            await user.save();

            const payload = {
                id: user.id,
            };

            jwt.sign(
                payload,
                process.env.jwtSecret,
                {
                    expiresIn: 360000,
                },
                (err, token) => {
                    if (err) throw err;
                    res.json({ token });
                }
            );
        } catch (err) {
            console.log(err.message)
            res.status(500).send("Server error");
        }
    }
);

// Login Admin

router.post(
    "/admin/login",
    [body("email").isEmail(), body("password").exists()],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password } = req.body;

        try {
            let user = await User.findOne({ email });

            if (!user) {
                return res.status(400).json({ msg: "Invalid Credentials" });
            }

            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch) {
                return res.status(400).json({ msg: "Wrong Password" });
            }

            const payload = {
                id: user.id,
            };

            jwt.sign(
                payload,
                process.env.jwtSecret,
                {
                    expiresIn: 360000,
                },
                (err, token) => {
                    if (err) throw err;
                    res.json({ token });
                }
            );
        } catch (err) {
            console.error(err.message);
            res.status(500).json({ msg: "Server error" });
        }
    }
);





module.exports = router;
