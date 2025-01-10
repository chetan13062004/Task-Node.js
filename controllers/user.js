const UserModel = require('../models/user')
const nodemailer = require('nodemailer')

module.exports.signup = (req, res) => {
    console.log(req.body)

    UserModel.findOne({ email: req.body.email }).then(user => {
        if (user) {
            return res.send({ code: 400, message: 'Email already exists' });
        }

        UserModel.findOne({ username: req.body.username }).then(existingUser => {
            if (existingUser) {
                return res.send({ code: 400, message: 'Username already taken' });
            }

            const newUser = new UserModel({
                email: req.body.email,
                password: req.body.password,
                username: req.body.username  
            });

            newUser.save().then(() => {
                res.send({ code: 200, message: 'Signup success' })
            }).catch((err) => {
                res.send({ code: 500, message: 'Signup error', error: err })
            })
        }).catch((err) => {
            res.send({ code: 500, message: 'Error checking username', error: err });
        });
    }).catch((err) => {
        res.send({ code: 500, message: 'Error checking email', error: err });
    })
}

module.exports.signin = (req, res) => {
    console.log(req.body)

    UserModel.findOne({ username: req.body.username }).then(existingUser => {
        if (!existingUser) {
            return res.send({ code: 400, message: 'Username not found' });
        }

    
        if (existingUser.password !== req.body.password) {
            return res.send({ code: 400, message: 'Invalid password' });
        }

        res.send({ code: 200, message: 'Signin success' });

    }).catch((err) => {
        res.send({ code: 500, message: 'Error checking username', error: err });
    });
}


module.exports.forgotPass = (req, res) => {
    console.log(req.body);

    // Find the user by email
    UserModel.findOne({ email: req.body.email }).then(user => {
        if (!user) {
            return res.send({ code: 400, message: 'User not found' });
        }

        // Log the user before updating
        console.log("Found user: ", user);

        // Update the password
        user.password = req.body.password;

        // Log the updated password
        console.log("Updated password: ", user.password);

        // Save the updated user document
        user.save().then(() => {
            console.log("User saved successfully.");
            res.send({ code: 200, message: 'Password updated successfully' });
        }).catch((err) => {
            console.log("Error saving user: ", err);
            res.send({ code: 500, message: 'Error updating password', error: err });
        });
    }).catch((err) => {
        console.log("Error finding user: ", err);
        res.send({ code: 500, message: 'Error finding user', error: err });
    });
};


// module.exports.otp = async (req, res) => {
//     console.log(req.body)
//     const _otp = Math.floor(100000 + Math.random() * 900000)
//     console.log(_otp)
//     let user = await UserModel.findOne({ email: req.body.email })
  
//     if (!user) {
//         res.send({ code: 500, message: 'user not found' })
//     }

//     let testAccount = await nodemailer.createTestAccount()

//     let transporter = nodemailer.createTransport({
//         host: "smtp.ethereal.email",
//         port: 587,
//         secure: false,
//         auth: {
//             user: testAccount.user,
//             pass: testAccount.pass
//         }
//     })



//     let info = await transporter.sendMail({
//         from: 'ayushbochare123@gmail.com',
//         to: req.body.email, 
//         subject: "OTP", 
//         text: String(_otp),
//         html: `<html>
//             < body >
//             Hello and welcome
//         </ >
//        </html > `,
//     })

//     if (info.messageId) {

//         console.log(info, 84)
//         UserModel.updateOne({ email: req.body.email }, { otp: _otp })
//             .then(result => {
//                 res.send({ code: 200, message: 'otp send' })
//             })
//             .catch(err => {
//                 res.send({ code: 500, message: 'Server err' })

//             })

//     } else {
//         res.send({ code: 500, message: 'Server err' })
//     }
// }


// module.exports.submitotp = (req, res) => {
//     console.log(req.body)


//     UserModel.findOne({ otp: req.body.otp }).then(result => {

//         //  update the password 

//         UserModel.updateOne({ email: result.email }, { password: req.body.password })
//             .then(result => {
//                 res.send({ code: 200, message: 'Password updated' })
//             })
//             .catch(err => {
//                 res.send({ code: 500, message: 'Server err' })

//             })


//     }).catch(err => {
//         res.send({ code: 500, message: 'otp is wrong' })

//     })


// }