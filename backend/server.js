import express from 'express';
import Razorpay  from 'razorpay';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';

const app = express();
const port = 3001;

// Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
});

// Middleware
app.use(bodyParser.json());
app.use(cors({
  origin: ['https://getmanishcoffee.vercel.app', 'http://localhost:5173'], 
  credentials: true,
}));
app.use(cookieParser());


app.get('/payment-details/:paymentId', async (req, res) => {
  const { paymentId } = req.params;

  try {
    const payment = await razorpay.payments.fetch(paymentId);
    res.json(payment);
  } catch (error) {
    console.error('Error fetching payment details:', error);
    res.status(500).json({ error: 'Failed to fetch payment details' });
  }
});

app.get('/keepalive', async (req, res) => {
    console.log("server is up");
  });

app.listen(port, () => {
  console.log(`Server running on ${port}`);
});

