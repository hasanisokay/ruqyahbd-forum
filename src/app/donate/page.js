import dynamic from "next/dynamic";
const Donate = dynamic(() => import("@/components/donate/Donate"));

const donatePage = () => {
    return (
        <div>
            <Donate />
        </div>
    );
};

export default donatePage;