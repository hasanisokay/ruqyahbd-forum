import useTheme from "@/hooks/useTheme";

const ThreeDotsIcon = ({ height, width, classes, handleOnclick }) => {
    const { theme } = useTheme();
    return <svg className={classes} onClick={handleOnclick} version="1.0" xmlns="http://www.w3.org/2000/svg"
        width={width || "512.000000pt"} height={height || "512.000000pt"} viewBox="0 0 512.000000 512.000000"
        preserveAspectRatio="xMidYMid meet">

        <g transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)"
            fill={theme ==="dark" ? "#fffff5":"#000000"} stroke="none">
            <path d="M2441 4624 c-253 -68 -410 -331 -346 -579 67 -256 329 -415 580 -350
   190 50 330 207 358 401 48 331 -270 615 -592 528z"/>
            <path d="M2441 3024 c-253 -68 -410 -331 -346 -579 67 -256 329 -415 580 -350
   190 50 330 207 358 401 48 331 -270 615 -592 528z"/>
            <path d="M2441 1424 c-253 -68 -410 -331 -346 -579 67 -256 329 -415 580 -350
   190 50 330 207 358 401 48 331 -270 615 -592 528z"/>
        </g>
    </svg>
};

export default ThreeDotsIcon;