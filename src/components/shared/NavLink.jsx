'use client';
import usePreviousPath from "@/hooks/usePreviousPath";
import classNames from "@/utils/classNames";
import Link from "next/link";
import { usePathname} from "next/navigation";

const NavLink = ({ children, href, exact = false, activeClassName, ...props }) => {
    const path = usePathname();
    const previousPath = usePreviousPath();
    const redirectUrl = (path === "/login" || path === "/signup") ? previousPath : path;

    const active = exact ? path===href : path.startsWith(href);
    const classes = classNames(props.className, active && activeClassName)
    if(classes){
        props.className = classes;
    }

    return (
        <Link href={(href === "/login" || href === "/signup") ? `${href}?redirectUrl=${redirectUrl}` : href} {...props}>
            {children}
        </Link>
    );
};

export default NavLink;