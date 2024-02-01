"use client"
const RootError = ({error, reset}) => { 
    return (
        <div className="flex flex-col gap-2 items-center justify-center">
            <h1 className="text-2xl">Something went wrong</h1>
            <p>Reload the page.</p>
        {/* <button onClick={()=>reset()} className="bg-red-600 px-2 py-1 rounded-2xl text-white">Reset</button> */}
        </div>
    );
};

export default RootError;