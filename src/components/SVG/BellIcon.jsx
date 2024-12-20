
const BellIcon = ({ count, handleOnclick, classes, title, fill }) => {
    return <svg className={classes} title={title} onClick={handleOnclick} version="1.0" xmlns="http://www.w3.org/2000/svg"
        width="24px" height="24px" viewBox="0 0 512.000000 512.000000"
        preserveAspectRatio="xMidYMid meet">

        <g transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)"
            fill={fill || "#000000"} stroke="none">
            <path d="M2453 5105 c-141 -38 -250 -141 -299 -280 -13 -37 -19 -97 -23 -228
  l-6 -179 -85 -33 c-194 -74 -360 -178 -502 -313 -185 -177 -314 -378 -392
  -613 -68 -203 -68 -204 -76 -764 -8 -535 -12 -586 -60 -760 -28 -98 -53 -161
  -109 -273 -72 -143 -161 -261 -297 -397 -155 -154 -169 -180 -169 -305 0 -80
  4 -102 23 -138 35 -66 88 -119 150 -149 l57 -28 577 -3 578 -3 6 -27 c32 -148
  91 -264 181 -361 142 -155 304 -234 507 -248 219 -15 412 61 576 226 112 113
  168 218 204 383 l6 27 578 3 577 3 57 28 c62 30 115 83 150 149 19 36 23 58
  23 138 0 126 -15 152 -169 305 -206 205 -332 413 -407 672 -46 161 -51 225
  -59 758 -8 559 -9 561 -75 761 -78 236 -208 440 -393 616 -142 135 -308 239
  -502 313 l-85 33 -6 179 c-5 144 -10 189 -26 235 -78 212 -298 330 -510 273z
  m210 -227 c23 -13 55 -42 72 -66 30 -43 30 -45 33 -190 l3 -147 -210 0 -211 0
  0 133 c0 97 4 143 15 170 49 116 186 162 298 100z"/>
        </g>
    </svg>

};

export default BellIcon;