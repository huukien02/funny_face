import { Outlet } from "react-router";

const LayoutGuest = () => {
  return (
    <div className="bg-black w-[100vw] min-h-[100vh]">
      <Outlet />
    </div>
  );
};

export default LayoutGuest;
