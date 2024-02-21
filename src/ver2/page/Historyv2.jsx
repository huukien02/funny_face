// // import Header from "../components/Header";
// import EventHistory from "../components/eventHistory";
// import Comments from "../components/comments";
// import axios from "axios";
// import React, { useEffect, useState } from "react";
// import img from "../components/image/heart-double.png";
// import { BsFillHeartFill } from "react-icons/bs";
// import { SlMenu } from "react-icons/sl";
// import useEvenStore from "../../utils/store";
// import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
// import Header from "../components/Header";

// function Historyv2() {
//   const [search_w, keyWord] = useState("");
//   const [dataSearch, setDataSearch] = useState("");
//   const [showMenu, setShowMenu] = useState(false);
//   const version = useEvenStore((state) => state.version);
//   const setVersion = useEvenStore((state) => state.setVersion);
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     localStorage.clear();
//   };
//   const toggleMenu = () => {
//     setShowMenu(!showMenu);
//   };
//   const toggleVersion = () => {
//     navigate("/love");
//   };

//   const onSearch = (value) => {
//     if (value === "") {
//       axios
//         .get(`https://databaseswap.mangasocial.online/lovehistory/page/1`)
//         .then((response) => {
//           setDataSearch(response.data.list_sukien);
//         });
//     }
//     axios
//       .get(`https://databaseswap.mangasocial.online/search?word=${value}`)
//       .then((response) => {
//         setDataSearch(response.data.list_sukien);
//       });
//   };
//   return (
//     <div
//       className=" Historyv2 flex flex-col min-h-screen overflow-hidden"
//       style={{ background: "linear-gradient(to right, #F0A3BF, #A86ED4)" }}
//     >
//       <Header onSearch={onSearch} />
//       <b className="starborn text-white lg:text-5xl text-3xl ml-12 mb-3 ">
//         Events
//       </b>

//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mx-6 sm:mx-10 lg:mx-16 justify-center">
//         <div className="flex justify-center">
//           <div className="flex-grow">
//             <EventHistory search={search_w} data={dataSearch} />
//           </div>
//         </div>
//         <div>
//           <Comments />
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Historyv2;
