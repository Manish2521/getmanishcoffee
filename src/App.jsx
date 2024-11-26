import React, { useState } from 'react';
import coffeeIcon from './coffee.png';

const App = () => {
  const [itemCount, setItemCount] = useState(1);
  const pricePerCoffee = 350;

  const incrementCount = () => setItemCount((prev) => prev + 1);
  const decrementCount = () => setItemCount((prev) => (prev > 1 ? prev - 1 : 1));

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted with itemCount:", itemCount);
  };

  return (
    <div className="bg-gradient-to-tr from-amber-200 to-yellow-500 min-h-screen flex justify-center items-center">
      <section className="p-4 max-w-md w-full">
        <div className="p-6 bg-white rounded shadow-md">
          <div className="flex items-center justify-center font-black m-3 mb-8">
            {/* <img
              src="https://cdn-icons-png.flaticon.com/512/4264/4264946.png"
              alt="Coffee Logo"
              className="h-10 w-10 mr-3"
            /> */}
            <h1 className="tracking-wide text-3xl text-gray-900">Get Manish a Coffee</h1>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col justify-center">
            <div className="flex justify-between items-center mb-4">
              <div className="inline-flex items-center self-start">
                <img
                  src={coffeeIcon}
                  alt="Coffee Icon"
                  className="h-8 w-8 mr-3"
                />
                <span className="font-bold text-gray-900">₹{pricePerCoffee}/ Coffee</span>
              </div>

              <div className="flex">
                <button
                  type="button"
                  onClick={decrementCount}
                  className="bg-red-500 p-1.5 font-bold rounded text-white"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z"
                      clipRule="evenodd"
                    />
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
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            </div>

            <label className="text-sm font-medium">Name</label>
            <input
              className="mb-3 mt-1 block w-full px-2 py-1.5 border border-gray-300 rounded-md text-sm shadow-sm placeholder-gray-400 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
              type="text"
              name="name"
              placeholder="Enter your name"
              required
            />

            <label className="text-sm font-medium">Email</label>
            <input
              className="mb-3 mt-1 block w-full px-2 py-1.5 border border-gray-300 rounded-md text-sm shadow-sm placeholder-gray-400 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
              type="email"
              name="email"
              placeholder="Enter your email"
              required
            />

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
              Donate ₹{itemCount * pricePerCoffee}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default App;
