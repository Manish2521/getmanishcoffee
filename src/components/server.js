import express from 'express';
import Razorpay from 'razorpay';
import cors from 'cors';
import bodyParser from 'body-parser';

// Initialize the Express app
const app = express();
const port = 5000;

// Middleware to parse JSON and enable CORS
app.use(express.json());
app.use(cors());

// Razorpay instance setup
const razorpay = new Razorpay({
  key_id: 'rzp_test_KOTILchgPxqVL8', // Replace with your Razorpay key ID
  key_secret: 'ACT4w98yee0j2vrAGsVSSigf', // Replace with your Razorpay key secret
});

// Middleware to parse JSON bodies
app.use(bodyParser.json());


// Route to create a Razorpay order
app.post('/create-order', async (req, res) => {
  const { amount } = req.body;

  const options = {
    amount: amount * 100, // Convert amount to paisa
    currency: 'INR',
    receipt: 'receipt_order_' + Date.now(), // Unique receipt ID
  };

  try {
    const response = await razorpay.orders.create(options);
    res.json(response);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Error creating order' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
