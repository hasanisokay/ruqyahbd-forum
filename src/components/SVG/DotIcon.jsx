import useTheme from "@/hooks/useTheme";

const DotIcon = () => {
const {theme} = useTheme();
    return <svg version="1.0" xmlns="http://www.w3.org/2000/svg"
        width="24px" height="24px" viewBox="0 0 512.000000 512.000000"
        preserveAspectRatio="xMidYMid meet">
        <g transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)"
            fill={theme==="dark"? "#ffffff":"#000000"} stroke="none">
            <path d="M2450 2959 c-67 -13 -163 -64 -213 -113 -61 -59 -95 -121 -113 -207
   -50 -237 106 -444 363 -481 308 -45 559 182 513 464 -38 242 -280 390 -550
   337z"/>
        </g>
    </svg>
};

export default DotIcon;