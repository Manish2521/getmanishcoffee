import React, { useState } from 'react';

const Landing = () => {
    const [amount, setAmount] = useState(200);

    const handleAmountChange = (event) => {
        let newAmount = parseInt(event.target.value);
        if (isNaN(newAmount) || newAmount < 201) {
            newAmount = 200;
        }
        setAmount(newAmount);
    };

    const handlePayment = async (event) => {
        event.preventDefault();

        const gst = 20; // GST tax amount

        try {
            // const amount = parseInt(amount);
            const response = await fetch('http://localhost:5000/create-order', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ amount : amount + parseInt(gst)}), // Changed to use the state variable amount
            });

            const order = await response.json();

            const options = {
                key: 'rzp_test_KOTILchgPxqVL8', // Replace with your Razorpay key ID
                amount: order.amount ,
                currency: order.currency,
                name: 'Manish Coffee',
                description: 'Test Transaction',
                order_id: order.id,
                handler: function (response) {
                    alert('Payment successful!');
                    console.log(response);
                    window.location.reload()
                },
                prefill: {
                    name: 'Manish',
                    email: 'manish@example.com',
                },
                theme: {
                    color: '#3399cc',
                },
            };

            const rzp1 = new window.Razorpay(options);
            rzp1.open();
        } catch (error) {
            console.error('Error creating order:', error);
        }
    };

    return (
        <div className="bg-gray-100 min-h-screen flex justify-center items-center">
            <div className="max-w-lg mx-auto px-4">
                <h2 className="text-3xl font-semibold text-gray-900 mb-4">
                    Let's Get Manish Some Coffee!
                </h2>
                <p className="text-gray-700 mb-8">
                    Fill out the form below to treat Manish to his favorite brew. Your support is greatly appreciated!
                </p>
                <form className="bg-white rounded-lg px-6 py-8 shadow-md" onSubmit={handlePayment}>
                    <div className="mb-4">
                        <label className="block text-gray-700 font-bold mb-2" htmlFor="name">Name</label>
                        <input
                            className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="name" type="text" placeholder="Enter your name" required />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 font-bold mb-2" htmlFor="email">Email</label>
                        <input
                            className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="email" type="email" placeholder="Enter your email" required />
                    </div>
                    <div className="mb-4 flex flex-col">
                        <label className="block text-gray-700 font-bold mr-2" htmlFor="amount">Amount</label>
                        <input
                            className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline disabled"
                            id="amount" type="number" placeholder="Enter amount" value={amount} onChange={handleAmountChange} required  />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 font-bold mb-2" htmlFor="message">Message</label>
                        <textarea
                            className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline resize-none"
                            id="message" rows="4" placeholder="Enter your message"></textarea>
                    </div>
                    <div className="mb-4 flex items-center">
                        <div className="border border-l-0 border-gray-300 bg-gray-200 text-gray-700 py-2 px-3 rounded-r flex items-center ml-auto">
                            <span className="mr-2">GST: 20rs</span>
                            <span>Total: {parseInt(amount) + 20}rs</span> {/* Yellow highlight */}
                        </div>
                    </div>
                    <div className="flex justify-end">
                        <button
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            type="submit">
                            Send
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Landing;
