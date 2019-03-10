const router = require('express').Router()
const User = require('../db/models/user')
const nodemailer = require('nodemailer')

module.exports = router

router.post('/login', async (req, res, next) => {
  try {
    const user = await User.findOne({where: {email: req.body.email}})
    if (!user) {
      console.log('No such user found:', req.body.email)
      res.status(401).send('Wrong username and/or password')
    } else if (!user.correctPassword(req.body.password)) {
      console.log('Incorrect password for user:', req.body.email)
      res.status(401).send('Wrong username and/or password')
    } else if (!(user.access === 'company admin' || user.access === 'admin')) {
      res.status(401).send('You dont have admin access!')
    } else {
      req.login(user, err => (err ? next(err) : res.json(user)))
    }
  } catch (err) {
    next(err)
  }
})

router.post('/signup', async (req, res, next) => {
  try {
    const user = await User.create(req.body)
    req.login(user, err => (err ? next(err) : res.json(user)))
  } catch (err) {
    if (err.name === 'SequelizeUniqueConstraintError') {
      res.status(401).send('User already exists')
    } else {
      next(err)
    }
  }
})

router.post('/logout', (req, res) => {
  req.logout()
  req.session.destroy()
  res.redirect('/')
})

router.get('/me', (req, res) => {
  res.json(req.user)
})

router.post('/validateQr', async (req, res, next) => {
  try {
    const user = await User.findOne({where: {email: req.body.email}})

    if (!user) {
      console.log('No such user found:', req.body.email)
      res.status(401).send('Wrong username')
    } else if (!(user.password() === req.body.password)) {
      console.log('Incorrect password for user:', req.body.password)
      res.status(401).send('Wrong password')
    } else {
      res.send('valid')
    }
  } catch (err) {
    next(err)
  }
})

router.post('/email/', (req, res, next) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'mshalam04@gmail.com',
      pass: process.env.emailPassword
    }
  })

  let myHtml = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"> 
  <html xmlns="http://www.w3.org/1999/xhtml">   
    <head>  
      <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />   
      <title>Demystifying Email Design</title>  
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/> 
  </head>  
      <body style="margin: 0; padding: 0;"> 
        <table align="center" border="0" cellpadding="0" cellspacing="0" width="300" style="border-collapse: collapse;"> 
          <tr>
            <td align="center" bgcolor="#70bbd9" style="padding: 40px 0 30px 0;">
               <img src=${
                 req.body.qrCode
               } alt="images are blocked on your email, check attachments for your QR Code" width="150" height="150" style="display: block;" />
               
            </td>
          </tr> 
          <tr> 
            <td bgcolor="#ffffff" style="color: #153643; font-family: Arial, sans-serif; font-size: 24px;">
               <p align="center">Use your QR code to get where you need to go!</p>
            </td>
          </tr>
        </table>  
      </body>
 </html>`

  const mailOptions = {
    from: 'mshalam04@gmail.com',
    to: 'mshalam@yahoo.com',
    subject: 'Sending Email using Node.js',
    html: myHtml,
    attachments: [
      {
        path: req.body.qrCode
      }
    ]
  }

  transporter.sendMail(mailOptions, function(error, info) {
    if (error) {
      console.log(error)
    } else {
      console.log('Email sent: ' + info.response)
    }
  })

  res.redirect('/')
})

router.use('/google', require('./google'))
