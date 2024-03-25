import Sidebar from "@/components/admin/Sidebar";
const layout = ({ children }) => {
  return (
    <>
  
        <>
          <Sidebar />
          {children}
        </>
 
    </>
  );
};

export default layout;
