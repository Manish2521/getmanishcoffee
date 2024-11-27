import React from "react";
import { useLocation } from "react-router-dom";

const DonationInvoice = () => {
  const location = useLocation();
  const { paymentData, itemCount, pricePerCoffee, name, email, phone } = location.state || {};

  return (
    <div className="bg-gradient-to-tr from-amber-200 to-yellow-500 min-h-screen flex justify-center items-center">
      <div className="p-6 bg-white rounded shadow-lg max-w-lg w-full">
        <h1 className="text-center text-3xl font-semibold mb-4">Donation Invoice</h1>
        <div className="mb-4">
          <p><strong>Donor's Name:</strong> {name}</p>
          <p><strong>Email:</strong> {email}</p>
          <p><strong>Phone:</strong> {phone}</p>
        </div>

        <div className="mb-4">
          <p><strong>Items:</strong> {itemCount} Coffee(s)</p>
          <p><strong>Total:</strong> ₹{itemCount * pricePerCoffee}</p>
        </div>

        <div className="mb-4">
          <p><strong>Payment Status:</strong> {paymentData?.razorpay_payment_id ? 'Success' : 'Failed'}</p>
        </div>

        <div className="mt-4 text-center">
          <button
            className="bg-yellow-600 text-white px-6 py-2 rounded-full shadow-md hover:bg-yellow-700"
            onClick={() => window.history.back()}
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default DonationInvoice;
