import React, { useState } from "react";
import coffeeIcon from "./coffee.png";
import { jsPDF } from "jspdf"; 
// import { config } from './config';

const App = () => {
  const [itemCount, setItemCount] = useState(1);
  const pricePerCoffee = 350;
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [paymentData, setPaymentData] = useState(null);
  const [isPaymentSuccessModalOpen, setIsPaymentSuccessModalOpen] = useState(false);
  const [isPaymentCancelModalOpen, setIsPaymentCancelModalOpen] = useState(false);

  const incrementCount = () => setItemCount((prev) => prev + 1);
  const decrementCount = () => setItemCount((prev) => (prev > 1 ? prev - 1 : 1));
  

  const handlePayment = (name, email, phone, amount) => {
    localStorage.setItem('name', name);
    localStorage.setItem('email', email);
    localStorage.setItem('phone', phone);
    // const razorpayKey = process.env.REACT_APP_RAZORPAY_KEY;
    // console.log("----------",razorpayKey);
    const options = {
      key: "rzp_test_C71g3RFZndj5Vr", 
      amount: amount * 100, 
      currency: "INR",
      name: "Coffee Donation",
      description: "Get Manish a Coffee",
      image: coffeeIcon, 
      prefill: {
        name: name,
        email: email,
        contact: phone,
      },
      theme: {
        color: "#f59e0b", 
      },
      handler: function (response) {
        setPaymentStatus("success");
        setPaymentData(response);
        setIsPaymentSuccessModalOpen(true);
        setShowModal(false); 
        setName('');
        setEmail('');
        setPhone('');
        setItemCount('1');
      },
      modal: {
        ondismiss: function () {
          setPaymentStatus("cancelled");
          setPaymentData(null); 
          setIsPaymentCancelModalOpen(true);
          setShowModal(false); 
        },
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (name && email && phone.length === 10 && /^\d{10}$/.test(phone)) {
      setShowModal(true); 
    } else {
      alert("Please fill in all the required fields and enter a valid phone number!");
    }
  };


  const generateInvoice = () => {
    
    const name = localStorage.getItem("name");
    const email = localStorage.getItem("email");
    const phone = localStorage.getItem("phone");
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Invoice", 14, 20);

    doc.setFontSize(12);
    doc.text(`Name: ${name}`, 14, 30);
    doc.text(`Email: ${email}`, 14, 40);
    doc.text(`Phone: ${phone}`, 14, 50);
    doc.text(`Amount Paid: Rs ${itemCount * pricePerCoffee}`, 14, 60); 
    doc.text(`Transaction ID: ${paymentData?.razorpay_payment_id}`, 14, 70);
    doc.text(`Date and Time: ${new Date().toLocaleString()}`, 14, 80);

    doc.save("invoice.pdf"); 

    localStorage.removeItem('name', name);
    localStorage.removeItem('email', email);
    localStorage.removeItem('phone', phone);
    setIsPaymentSuccessModalOpen(false);
  };

  return (
    <div className="bg-gradient-to-tr from-amber-200 to-yellow-500 min-h-screen flex justify-center items-center">
      <section className="p-4 max-w-lg w-full">
        <div className="p-6 bg-white rounded shadow-md">
          <div className="flex items-center justify-center font-black m-3 mb-8">
            <h1 className="tracking-wide text-3xl text-gray-900">Get Manish a Coffee</h1>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col justify-center">
            <div className="flex justify-between items-center mb-4">
              <div className="inline-flex items-center self-start">
                <img src={coffeeIcon} alt="Coffee Icon" className="h-8 w-8 mr-2" />
                <span className="font-bold text-gray-900">₹ {pricePerCoffee} / Coffee</span>
              </div>

              <div className="flex">
                <button
                  type="button"
                  onClick={decrementCount}
                  className="bg-red-500 p-1.5 font-bold rounded text-white"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd" />
                  </svg>
                </button>

                <input
                  type="number"
                  value={itemCount}
                  readOnly
                  className="max-w-[100px] font-bold font-mono py-1.5 px-2 mx-1.5 block border border-gray-300 rounded-md text-sm shadow-sm placeholder-gray-400 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                />

                <button
                  type="button"
                  onClick={incrementCount}
                  className="bg-green-500 p-1.5 font-bold rounded text-white"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>

            <label className="text-sm font-medium">Name</label>
            <input
              className="mb-3 mt-1 block w-full px-2 py-1.5 border border-gray-300 rounded-md text-sm shadow-sm placeholder-gray-400 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              required
            />

            <label className="text-sm font-medium">Email</label>
            <input
              className="mb-3 mt-1 block w-full px-2 py-1.5 border border-gray-300 rounded-md text-sm shadow-sm placeholder-gray-400 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />

            <label className="text-sm font-medium">Phone Number</label>
            <input
              className={`mb-3 mt-1 block w-full px-2 py-1.5 border ${phone.length < 10 ? 'border-gray-300' : 'border-gray-300'} rounded-md text-sm shadow-sm placeholder-gray-400 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500`}
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Enter your phone number"
              required
            />
            {phone.length < 10 && phone.length > 0 && (
              <p className="text-red-500 text-sm">Phone number must be 10 digits long</p>
            )}

            <label className="inline-flex items-center mt-3 mb-6">
              <input
                type="checkbox"
                name="agree"
                defaultChecked
                required
                className="form-checkbox h-5 w-5 text-yellow-600"
              />
              <span className="ml-2 text-gray-700">I agree to buy this coffee</span>
            </label>

            <button
              type="submit"
              className="px-4 py-1.5 rounded-md shadow-lg bg-gradient-to-r from-yellow-600 to-orange-600 font-medium text-white block transition duration-300"
            >
              Donate ₹ {itemCount * pricePerCoffee}
            </button>
          </form>
        </div>
      </section>

      {/* Tailwind Modal for Payment Process */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg sm:w-3/4 md:w-1/2 lg:w-1/3 xl:w-1/4">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Proceed to Payment</h2>
            <p className="text-gray-700 mb-6">Please confirm your details before proceeding.</p>
            <div className="mb-4">
              <p><strong>Name:</strong> {name}</p>
              <p><strong>Email:</strong> {email}</p>
              <p><strong>Phone:</strong> {phone}</p>
              <p><strong>Amount:</strong> ₹{itemCount * pricePerCoffee}</p>
            </div>
            <button
              onClick={() => handlePayment(name, email, phone, itemCount * pricePerCoffee)}
              className="w-full px-4 py-2 bg-blue-500 text-white font-bold rounded-md shadow-md hover:bg-blue-600 focus:outline-none"
            >
              Proceed with Payment
            </button>
            <button
              onClick={() => setShowModal(false)}
              className="w-full px-4 py-2 mt-4 bg-gray-300 text-black font-bold rounded-md shadow-md hover:bg-gray-400 focus:outline-none"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {isPaymentSuccessModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/4">
            <h2 className="text-xl font-bold text-green-800 mb-4">Payment Successful!</h2>
            <p className="text-gray-700">Razorpay Payment ID: {paymentData?.razorpay_payment_id}</p>
            <p className="text-gray-700">Amount Paid: ₹{itemCount * pricePerCoffee}</p>
            
            {/* Flex container for buttons */}
            <div className="mt-6 flex justify-between">
              <button
                onClick={() => setIsPaymentSuccessModalOpen(false)}
                className="px-4 py-2 bg-green-600 text-white rounded-md"
              >
                Close
              </button>
              <button
                onClick={generateInvoice}
                className="px-4 py-2 bg-green-600 text-white rounded-md"
              >
                Download Invoice
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Modal */}
      {isPaymentCancelModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg sm:w-3/4 md:w-1/2 lg:w-1/3 xl:w-1/4">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Payment Cancelled</h2>
            <p className="text-gray-700 mb-6">You have cancelled the payment. Please try again later.</p>
            <div className="flex justify-end">
              <button
                onClick={() => setIsPaymentCancelModalOpen(false)}
                className="px-4 py-2 bg-red-500 text-white font-bold rounded-md shadow-md hover:bg-red-600 focus:outline-none"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;