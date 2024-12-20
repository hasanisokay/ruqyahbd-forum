import NavLink from "@/components/shared/NavLink";
const navLinks = [
    {
        path: "/admin",
        title: "Dashboard"
    },
    {
        path: "/admin/pending-posts",
        title: "Pending Posts"
    },
    {
        path: "/admin/admin-activity",
        title: "Admin Activity"
    },
    // {
    //     path: "/admin/members-activity",
    //     title: "Members Activity"
    // },
    {
        path: "/admin/notice",
        title: "Notice"
    },
    {
        path: "/admin/declinedposts",
        title: "Declined Posts"
    },
    {
        path: "/admin/send-email",
        title: "Email"
    },
]

const Sidebar = ({postData}) => {
    return (
        <div>
            <h1 className="text-2xl font-semibold text-center">Admin Home</h1>
            <ul className="font-semibold flex lg:flex-row flex-col items-center justify-center gap-4">
                {
                    navLinks.map(({ path, title }) => <li key={path}>
                        <NavLink exact activeClassName={"text-[#308853]"} href={path}>{title} 
                        
                        <span className="text-red-500 text-[16px] pl-[2px]">{path==="/admin/declinedposts" && postData?.totalDeclinedPosts}{path==="/admin/pending-posts" && postData?.totalPendingPosts}</span>
                         </NavLink>
                    </li>)
                }
            </ul>
        </div>
    );
};

export default Sidebar;