'use server'
import Sidebar from "@/components/admin/Sidebar";
import getStats from "@/utils/getStats";

const layout = async({children}) => {
  const postData = await getStats();
    return (
        <div>
              <Sidebar postData={postData}/>
            {children}
        </div>
    );
};

export default layout;