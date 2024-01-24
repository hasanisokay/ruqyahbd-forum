import useTheme from "@/hooks/useTheme";

const UserIcon = ({ height, width }) => {
    const {theme} = useTheme()
    return <svg version="1.0" xmlns="http://www.w3.org/2000/svg"
        width={width || '45px'} height={height || "45px"} viewBox="0 0 512.000000 512.000000"
        preserveAspectRatio="xMidYMid meet">

        <g transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)"
            fill={theme=="dark"?"#7d7d7d" :"#000000"} stroke="none">
            <path d="M2394 4626 c-230 -44 -407 -138 -559 -298 -129 -134 -210 -276 -256
   -448 -20 -73 -23 -108 -23 -255 0 -187 12 -249 74 -398 66 -158 215 -340 359
   -437 299 -201 675 -231 997 -81 115 54 197 112 290 205 131 131 215 278 266
   464 29 105 32 382 5 482 -87 317 -285 558 -565 687 -168 78 -418 111 -588 79z"/>
            <path d="M1709 2275 c-222 -41 -435 -144 -597 -289 -240 -215 -378 -484 -412
   -806 -17 -160 1 -266 67 -392 66 -127 200 -237 338 -281 l70 -22 1385 0 1385
   0 74 24 c224 73 378 269 406 513 8 76 -10 242 -41 358 -96 366 -374 682 -720
   821 -42 17 -120 43 -173 57 l-96 27 -805 2 c-651 1 -819 -1 -881 -12z"/>
        </g>
    </svg>
};

export default UserIcon;