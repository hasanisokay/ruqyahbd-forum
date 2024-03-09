'use client'
import { useState } from "react";
import bkashLogo from "@/../public/images/bkash-logo.png";
import Image from "next/image";

const Donate = () => {
  const [donationScheme, setDonationScheme] = useState("");
  const [amount, setAmount] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Make API request to process the form data
    try {
      const response = await fetch("/api/bkash/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          donationScheme,
          amount: parseFloat(amount),
        }),
      });
      if (response.ok) {
        // Handle successful response, e.g., show a success message
        console.log("Donation successful!");
      } else {
        // Handle error response, e.g., show an error message
        console.error("Donation failed.");
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  return (
    <div>
      <form
        className="lg:w-[50%] w-[90%] mx-auto"
        onSubmit={handleSubmit}
      >
        <select
          className="select w-full mb-4 border-0 focus:outline-none"
          value={donationScheme}
          onChange={(e) => setDonationScheme(e.target.value)}
        >
          <option>Select Donation Scheme</option>
          <option value={"HadiaForAdmin"}>Hadia To Admins</option>
          <option value={"Maintainace Expenditure"}>
            Maintainance Expenditure
          </option>
        </select>
        <input
          type="number"
          placeholder="Enter Amount"
          className="input w-full border-0 focus:outline-none"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <p className="text-center">Pay with</p>
        <Image
          alt="bkash logo"
          src={bkashLogo}
          width={60}
          height={60}
        />
        <button type="submit">Pay</button>
      </form>
    </div>
  );
};

export default Donate;
