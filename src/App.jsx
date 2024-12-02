import React, { useState, useEffect } from "react";
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
  const [isLoadingInvoice, setIsLoadingInvoice] = useState(false);

  const incrementCount = () => setItemCount((prev) => prev + 1);
  const decrementCount = () => setItemCount((prev) => (prev > 1 ? prev - 1 : 1));
  
  useEffect(() => {
    keepalive();  
    keepalive();
  }, []);
  
  const handlePayment = (name, email, phone, amount) => {
    localStorage.setItem('name', name);
    localStorage.setItem('email', email);
    localStorage.setItem('phone', phone);
    localStorage.setItem('amount', amount);
    // const razorpayKey = process.env.REACT_APP_RAZORPAY_KEY;
    // console.log("----------",razorpayKey);
    keepalive();

    setTimeout(() => {
      keepalive(); 
    }, 5000); 

    setTimeout(() => {
      keepalive(); 
    }, 10000); 

    setTimeout(() => {
      keepalive(); 
    }, 20000); 

    const options = {
      key: "rzp_test_bPES0b7gSlSjD5", 
      amount: amount * 100, 
      currency: "INR",
      name: "Coffee Payment",
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
        // console.log("---------------------------");
        // console.log(response)
        // console.log("---------------------------");
        setPaymentStatus("success");
        setPaymentData(response);
        console.log("------------------");
        console.log(response.razorpay_payment_id);
        localStorage.setItem('razorpay_payment_id', response.razorpay_payment_id);
        console.log("------------------");
        // const paymentMethod = response?.method
        // localStorage.setItem('paymentMethod', paymentMethod);
        setIsPaymentSuccessModalOpen(true);
        setShowModal(false); 
        setName('');
        setEmail('');
        setPhone('');
        setItemCount(1);
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
    keepalive();
    e.preventDefault();
    if (
      name && email && 
      phone.length === 10 && /^[789]\d{9}$/.test(phone)
    ) {
      setShowModal(true); 
    }
  };

  // Check whether Backend is up or not
  const keepalive = () => {
    fetch('https://getmanishcoffee.onrender.com/keepalive', {
      method: 'GET',
      credentials: 'include', 
    })
      .then((response) => {
        if (response.ok) {
          console.log('Server is alive');
        } else {
          console.log('Failed to keep the server alive');
        }
      })
      .catch((error) => {
        console.error('Error keeping server alive:', error);
      });
  };
  

  const generateInvoice = async () => {
    keepalive();
    const name = localStorage.getItem("name");
    const amount = localStorage.getItem("amount");
    const email = localStorage.getItem("email");
    const phone = localStorage.getItem("phone");
    const razorpay_payment = localStorage.getItem("razorpay_payment_id");
  
    const doc = new jsPDF();
    const message = "Thank you for the great work!";
    try {
      const response = await fetch(`https://getmanishcoffee.onrender.com/payment-details/${razorpay_payment}`, {
        method: 'GET',
        credentials: 'include'  
      });
  
      if (!response.ok) {
        throw new Error(`Error fetching payment details: ${response.status}`);
      }
  
      const textResponse = await response.text(); 
      console.log('Raw response from backend:', textResponse);
  
      let paymentDetails;
      try {
        paymentDetails = JSON.parse(textResponse); 
        console.log("Parsed payment details:", paymentDetails);
      } catch (e) {
        console.error('Error parsing JSON:', e);
        throw new Error('Invalid JSON response');
      }
      const paymentMethod = paymentDetails.method || "N/A";
      let bankName = paymentDetails.bank || "N/A";
      if (paymentDetails.method === "card" && paymentDetails.card) {
        bankName = paymentDetails.card.issuer || "N/A"; 
      }
      const paymentStatus = paymentDetails.status || "Failed";
      const invoiceNumber = paymentDetails.acquirer_data?.bank_transaction_id || Math.floor(Math.random() * 900000) + 100000;; 
  
      doc.setFontSize(18);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(0, 0, 0);
      doc.text("Payment Invoice", 105, 20, null, null, "center");
  
      doc.setFontSize(12);
      doc.text("Thank you for your support!", 105, 28, null, null, "center");
  
      doc.setFillColor(240, 255, 240);
      doc.setDrawColor(0, 255, 0);
      doc.roundedRect(14, 36, 186, 14, 3, 3, "F");
  
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(0, 0, 0);
      doc.text("Payment Successful", 20, 44);
      doc.text(`Invoice No : ${invoiceNumber}`, 196, 44, null, null, "right");
  
      doc.setFont("helvetica", "bold");
      doc.text("Payment Details", 14, 58);
      doc.setLineWidth(0.5);
      doc.line(14, 60, 196, 60);
  
      doc.setFont("helvetica", "normal");
      doc.text(`Date and Time: ${new Date().toLocaleString()}`, 14, 68);
      doc.text(`Transaction ID: ${razorpay_payment}`, 120, 68);
  
      doc.setFont("helvetica", "bold");
      doc.text("User Information", 14, 82);
      doc.line(14, 84, 196, 84);
  
      doc.setFont("helvetica", "normal");
      doc.text(`Name:`, 14, 92);
      doc.text(name, 160, 92, null, null, "right");
  
      doc.text(`Email:`, 14, 100);
      doc.text(email, 160, 100, null, null, "right");
  
      doc.text(`Phone:`, 14, 108);
      doc.text(phone, 160, 108, null, null, "right");
  
      doc.text(`Amount:`, 14, 116);
      doc.setTextColor(0, 0, 0);
      doc.text(`${amount} INR`, 160, 116, null, null, "right");
  
      doc.text(`Payment Method:`, 14, 124);
      doc.text(paymentMethod, 160, 124, null, null, "right");
  
      doc.text(`Bank Name:`, 14, 132);  
      doc.text(bankName, 160, 132, null, null, "right");
  
      doc.setFont("helvetica", "bold");
      doc.text("Message", 14, 144);
      doc.line(14, 146, 196, 146);
  
      doc.setFont("helvetica", "normal");
      doc.text(message, 14, 152);
  
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text("This is an automatically generated invoice.", 105, 280, null, null, "center");
  
      doc.save("Payment_Invoice.pdf");
  
    } catch (error) {
      console.error("Error fetching payment details:", error);
    }
  };
  

  const removeinfo = () => {
    keepalive();
    localStorage.removeItem('name');
    localStorage.removeItem('email');
    localStorage.removeItem('phone');
    localStorage.removeItem('amount');
    localStorage.removeItem('razorpay_payment_id');
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
              onChange={(e) => setEmail(e.target.value.toLowerCase())}
              placeholder="Enter your email"
              required
            />

            <label className="text-sm font-medium">Phone Number</label>
            <input
              className={`mb-3 mt-1 block w-full px-2 py-1.5 border ${phone.length < 10 ? 'border-gray-300' : 'border-gray-300'} rounded-md text-sm shadow-sm placeholder-gray-400 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500`}
              type="tel"
              maxLength="10"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Enter your phone number"
              required
            />

            {phone.length > 0 && phone.length < 10 && (
              <p className="text-red-500 text-sm">Phone number must be 10 digits long</p>
            )}

            {phone.length === 10 && !/^[789]\d{9}$/.test(phone) && (
              <p className="text-red-500 text-sm">Phone number must start with 7, 8, or 9</p>
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
              Pay ₹ {itemCount * pricePerCoffee}
            </button>
          </form>
        </div>
      </section>

      {/* Payment Process Modal*/}
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
              onClick={() => {setShowModal(false); removeinfo();}}
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
            <p className="text-gray-700">Amount Paid: ₹{localStorage.getItem('amount')}</p>
            
            <div className="mt-6 flex justify-between">
              <button
                onClick={() => {setIsPaymentSuccessModalOpen(false); removeinfo();}}
                className="px-4 py-2 bg-green-600 text-white rounded-md"
              >
                Close
              </button>
              <button
                onClick={generateInvoice}
                className="px-4 py-2 bg-green-600 text-white rounded-md flex items-center justify-center"
                disabled={isLoadingInvoice} // Disable button while loading
              >
                {isLoadingInvoice ? (
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8H4zm2 5.292l6.292-6.292H8a8 8 0 00-6 6z"
                    ></path>
                  </svg>
                ) : (
                  "Download Invoice"
                )}
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
                onClick={() => {setIsPaymentCancelModalOpen(false); removeinfo(); }}
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
