const express = require("express")  
const cors = require('cors')
const app = express()  
const { MongoClient, ServerApiVersion } = require('mongodb');  
const Razorpay = require("razorpay"); 
const crypto = require('crypto');
const nodemailer = require('nodemailer'); 
const otpGenerator = require('otp-generator');

require("dotenv").config()
app.use(cors()); 
app.use(express.json())  
const port = process.env.PORT || 4000;

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY,
  key_secret: process.env.RAZORPAY_SECRET
});


const uri = `mongodb+srv://atauhid07:${process.env.pass}@cluster0.upq0zm1.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
let client;

async function run(retries = 5) {
  while (retries) {
    try {
      client = new MongoClient(uri, {
        serverApi: {
          version: ServerApiVersion.v1,
          strict: true,
          deprecationErrors: true,
        },
      });
      await client.connect();
      console.log("Database connected successfully");
      break;
    } catch (error) {
      console.log("Error connecting to database:", error);
      retries -= 1;
      console.log(`Retries left: ${retries}`);
      await new Promise(res => setTimeout(res, 5000)); // wait 5 seconds before retrying
    }
  }
}

run().catch(console.dir);
const postCollection = client.db('database').collection('posts'); 
const userCollection = client.db('database').collection('users'); 
const subscriptionCollection = client.db('database').collection('subscriptions'); 
const otpCollection = client.db('database').collection('otps');

    // get  post
    app.get('/post',async(req,res)=>{
        const post = (await postCollection.find().toArray()).reverse(); 
        res.send(post);
    })   

  //  get user
    app.get('/user',async(req,res)=>{
      const users = await userCollection.find().toArray(); 
      res.send(users);
  })   

  //get Loggedin user   
  app.get("/loggedInUser",async(req,res)=>{
    const email = req.query.email; 
    const user = await userCollection.findOne({email:email}); 
    res.send(user);
  }) 
  //get user post
  app.get("/userPost",async(req,res)=>{
    const email = req.query.email; 
    const post = (await postCollection.find({email:email}).toArray()).reverse();
    res.send(post);
  })


  //register user 

   app.post('/register',async (req,res)=>{
       const user = { ...req.body, subscriptionType: 'free', postLimit: 5, postsToday: 0, subscriptionEndDate: null };
       const result = await userCollection.insertOne(user); 
       console.log("registration done ",result) 
       res.send(result);
   })  
    // Middleware to detect mobile device
    const detectMobileDevice = (req, res, next) => {   
     if(req.body.deviceInfo.deviceType === "Mobile"){
       req.isMobile = true; 
     } 
     else{
      req.isMobile=false;
     }
      next();
    }; 
    // Middleware to check time-based access for mobile devices
    const checkTimeAccess = (req, res, next) => { 
      // console.log("req info in check time: ",req)
      if (req.isMobile) { 
        console.log("is mobile true")
        const allowedStartTime = 9;  
        const allowedEndTime = 17;  
        // indian time zone  
        const date = new Date();
        const options = { timeZone: 'Asia/Kolkata', hour: '2-digit', hour12: false };
        const formatter = new Intl.DateTimeFormat([], options);
        const currentHourIST = formatter.formatToParts(date).find(part => part.type === 'hour').value;
        console.log("current hour ist ",currentHourIST)
        if (currentHourIST < allowedStartTime || currentHourIST >= allowedEndTime) {
          return res.send({ message: 'Access denied' });
        }
      }
      next();
    }
   //user Login 
   app.post('/login',detectMobileDevice,checkTimeAccess,async (req, res) => {
    const { email,deviceInfo } = req.body;
    const user = await userCollection.findOne({ email});

    if (!user) {
      return res.status(401).send({ message: 'Invalid email' });
    }
    let deviceRecognized=null;
    if(user.devices){
     deviceRecognized = user.devices.some(device => (
      device.browser === deviceInfo.browser &&
      device.os === deviceInfo.os &&
      device.ip === deviceInfo.ip &&
      device.deviceType === deviceInfo.deviceType
    ));  

  } 
  
    if (!deviceRecognized) { 
      const now = new Date();
      const otp = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false });
      const expiryTime = new Date(now.getTime() + 10 * 60 * 1000); // OTP valid for 10 minutes

      await otpCollection.insertOne({ email, otp, createdAt: now, expiresAt: expiryTime });

      sendOtpEmail(email, otp);
      return res.status(200).send({ message: 'OTP sent', requiresOtp: true });
    }

    res.status(200).send({ message: 'Login successful' });
  }); 

  // otp verification for login 

  app.post('/verify-otp', async (req, res) => {
    const { email, otp, deviceInfo } = req.body;
    const record = await otpCollection.findOne({ email, otp });

    if (!record || new Date() > record.expiresAt) {
      return res.status(400).send({ message: 'Invalid or expired OTP' });
    }

    await otpCollection.deleteOne({ email, otp });

    await userCollection.updateOne(
      { email },
      { $push: { devices: deviceInfo } }
    );

    res.status(200).send({ message: 'OTP verified, login successful' });
  });

   //Updated Post 
    app.post('/post',async (req,res)=>{ 
        console.log('posting...')
        const post = req.body; 
        const email = post?.email; 
        const user = await userCollection.findOne({ email });

        if (!user) {
          return res.status(404).send({ message: 'User not found' });
        }    
        const today = new Date().setHours(0, 0, 0, 0);
        // If the user has never posted, initialize lastPosted to a past date
        const lastPosted = user.lastPosted ? new Date(user.lastPosted).setHours(0, 0, 0, 0) : new Date(0).setHours(0, 0, 0, 0);
      //  check if it's first post of the day for user
        if (today > lastPosted) {
          user.postsToday = 0;
          user.lastPosted = new Date();
          await userCollection.updateOne({ email }, { $set: { postsToday: 0, lastPosted: new Date() } }); 

        } 
        if (user.postsToday >= user.postLimit) {
          return res.status(403).send({ message: 'Post limit reached for today' });
        } 
        user.postsToday += 1;
        await userCollection.updateOne({ email }, { $set: { postsToday: user.postsToday } }); 
        
       const finalPost = {...post,createdAt: new Date()}
        const result = await postCollection.insertOne(finalPost); 
        res.send(result); 
        console.log('post:  ',result)
    })
  
    // subscription options 
    app.get('/subscription-options', (req, res) => {
      const options = {
        monthly: {
          basic: { price: 100, postLimit: 20 },
          premium: { price: 200, postLimit: 50 },
        },
        yearly: {
          basic: { price: 1000, postLimit: 20 },
          premium: { price: 2000, postLimit: 50 },
        },
      };
      res.send(options);
    });
     
    //create order 
    app.post('/create-order', async (req, res) => {
      const { amount, currency } = req.body;
      const options = {
        amount: amount * 100, // amount in the smallest currency unit
        currency,
        receipt: `receipt_${Date.now()}`
      };

      try {
        const order = await razorpay.orders.create(options);
        res.send(order);
      } catch (error) {
        res.status(500).send({ message: 'Order creation failed', error });
      }
    }); 

    // Verify Payment 
    app.post('/verify-payment', async (req, res) => {
      const { email, order_id, payment_id, signature, plan, duration } = req.body;
      const user = await userCollection.findOne({ email });

      if (!user) {
        return res.status(404).send({ message: 'User not found' });
      }

      const body = order_id + "|" + payment_id;
      const expectedSignature = crypto.createHmac('sha256', process.env.RAZORPAY_SECRET)
        .update(body.toString())
        .digest('hex');

      if (expectedSignature === signature) {
        const endDate = new Date();
        if (duration === 'monthly') {
          endDate.setMonth(endDate.getMonth() + 1);
        } else {
          endDate.setFullYear(endDate.getFullYear() + 1);
        }

        const subscription = {
          email: user.email,
          type: plan.type,
          startDate: new Date(),
          endDate,
        };

        await subscriptionCollection.insertOne(subscription);

        user.subscriptionType = plan.type;
        user.postLimit = plan.postLimit;
        user.subscriptionEndDate = endDate;

        await userCollection.updateOne({ email }, { $set: { subscriptionType: plan.type, postLimit: plan.postLimit, subscriptionEndDate: endDate } });

        sendInvoiceEmail(user.email, plan.price,plan.postLimit);

        res.send({ message: 'Subscription successful', subscription });
      } else {
        res.status(400).send({ message: 'Payment verification failed' });
      }
    });

    const sendInvoiceEmail = (email, amount,limit) => {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASS,
        },
      });

      const mailOptions = {
        from: process.env.MAIL_USER,
        to: email,
        subject: 'Invoice for Subscription',
        text: `Thank you for your subscription. Amount: ${amount}Rs Now you can make ${limit} post Daily`,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error('Error sending email:', error);
        } else {
          console.log('Email sent:', info.response);
        }
      });
    };
   
    //send otp to user mail 
    app.post('/language/send-otp', async (req, res) => {
      const { email } = req.body;

      const existingOtp = await otpCollection.findOne({ email }, { sort: { createdAt: -1 } });
      const now = new Date();
      if (existingOtp && (now - new Date(existingOtp.createdAt)) < 2 * 60 * 1000) {
        return res.status(429).send({ message: 'Please wait before requesting another OTP' });
      }

      const otp = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false });
      const expiryTime = new Date(now.getTime() + 10 * 60 * 1000); // OTP valid for 10 minutes

      await otpCollection.insertOne({ email, otp, createdAt: now, expiresAt: expiryTime });

      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASS,
        },
      });

      const mailOptions = {
        from: process.env.MAIL_USER,
        to: email,
        subject: 'Your OTP for Language Change',
        text: `Your OTP code is ${otp}`,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error('Error sending email:', error);
          res.status(500).send({ message: 'Failed to send OTP' });
        } else {
          console.log('Email sent:', info.response); 
          res.send({ message: 'OTP sent successfully' });
        }
      });
    });
 
    // Verify OTP 

    app.post('/language/verify-otp', async (req, res) => {
      const { email, otp, language } = req.body; 
      console.log("verify otp called..") 
      console.log("req data ..") 
      console.log(email) 
      console.log(language)
      const now = new Date();

      // Find the most recent OTP and check if it has expired
      const record = await otpCollection.findOne({ email, otp }, { sort: { createdAt: -1 } });
      if (!record || record.expiresAt < now) {
        return res.status(400).send({ message: 'Invalid or expired OTP' });
      }

      const user = await userCollection.findOne({ email });
      if (!user) {
        return res.status(404).send({ message: 'User not found' });
      }

      await userCollection.updateOne({ email }, { $set: { language } });

      // Invalidate the OTP after successful verification
      await otpCollection.deleteOne({ _id: record._id });

      res.send({ message: 'Language updated successfully' });
    });

    //patch update user data
     app.patch('/userUpdates/:email', async (req, res) => {
            const filter = req.params;
            const profile = req.body;
            const options = { upsert: true};
            const updateDoc = { $set: profile };
            const result = await userCollection.updateOne(filter, updateDoc, options); 
            // await postCollection.updat
            res.send(result)
        }) 

        const sendOtpEmail = (email, otp) => {
          const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: process.env.MAIL_USER,
              pass: process.env.MAIL_PASS,
            },
          });
      
          const mailOptions = {
            from: process.env.MAIL_USER,
            to: email,
            subject: 'Your OTP for login',
            text: `Your OTP is ${otp}. It is valid for 10 minutes.`,
          };
      
          transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
              console.error('Error sending email:', error);
            } else {
              console.log('Email sent:', info.response); 
            }
          });
        };
 


app.get('/',(req,res)=>{
    res.send("hello word from backend")
}) 

app.listen(port,()=>{
    console.log(`app started on port ${port}`)
})