import bkashLogo from "@/../public/images/bkash-logo.png"
import Image from "next/image";

const Donate = () => {
    return (
        <div>
            <form className="lg:w-[50%] w-[90%] mx-auto">
                <select className="select w-full mb-4 border-0 focus:outline-none">
                    <option>Select Donation Scheme</option>
                    <option value={"HadiaForAdmin"}>Hadia To Admins</option>
                    <option value={"Maintainace Expenditure"}>Maintainace Expenditure</option>
                </select>
                <input type="number" placeholder="Enter Amount" className="input w-full border-0 focus:outline-none" />
            <p className="text-center">Pay with</p>
            <Image alt="bkash logo" src={bkashLogo} width={60} height={60} />
            </form>
        </div>
    );
};

export default Donate;