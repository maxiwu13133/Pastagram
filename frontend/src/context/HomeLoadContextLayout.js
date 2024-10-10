import { Outlet } from "react-router-dom";

// Context
import { HomeLoadContextProvider } from "./HomeLoadContext";

const HomeLoadContextLayout = () => {

  return (
    <HomeLoadContextProvider>
      <Outlet />
    </HomeLoadContextProvider>
  )
}

export default HomeLoadContextLayout;