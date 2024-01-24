
const SendMessageIcon = ({ fill, height, width }) => {
    return <svg version="1.0" xmlns="http://www.w3.org/2000/svg"
        width={width || "24px"} height={height || "24px"} viewBox="0 0 512.000000 512.000000"
        preserveAspectRatio="xMidYMid meet">
        <g transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)"
            fill={fill || "#494a54"} stroke="none">
            <path d="M533 4832 c-153 -55 -252 -185 -261 -344 -4 -74 4 -111 198 -890 112
-447 206 -816 209 -820 3 -3 511 -52 1129 -109 617 -57 1122 -106 1122 -109 0
-3 -505 -52 -1122 -109 -618 -57 -1126 -106 -1129 -109 -3 -4 -97 -373 -209
-820 -194 -779 -202 -816 -198 -890 6 -101 39 -174 112 -248 32 -31 81 -67
113 -82 52 -24 70 -27 165 -27 l108 0 1956 978 c2153 1077 2022 1005 2087
1136 30 61 32 72 32 171 0 99 -2 110 -32 171 -65 131 66 59 -2086 1136 l-1955
977 -94 3 c-71 3 -105 -1 -145 -15z"/>
        </g>
    </svg>
};

export default SendMessageIcon;