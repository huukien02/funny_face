import { useState } from "react";
import { useNavigate } from "react-router-dom";

import useAuth from "../../../hooks/useAuth";

function SidebarLink({
  path,
  icon,
  iconActive,
  name,
  isActive,
  sideBarHidden,
}) {
  const [isHovered, setIsHovered] = useState(false);

  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div
      className={`flex ${
        sideBarHidden ? "justify-center" : "pr-14 xl:pr-20"
      } gap-4 cursor-pointer py-3`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => (path === "logout" ? handleLogout() : navigate(path))}
    >
      <img
        loading="lazy"
        src={isActive || isHovered ? iconActive : icon}
        alt={name}
        className={
          sideBarHidden ? `min-w-[28px] max-w-[28px]` : `w-[30px] h-[30px]`
        }
      />
      {!sideBarHidden && (
        <div
          className={`flex items-center whitespace-nowrap text-lg xl:text-xl font-semibold grow ${
            isActive || isHovered ? "text-green-400" : "text-white"
          }`}
        >
          {name}
        </div>
      )}
    </div>
  );
}

export default SidebarLink;
