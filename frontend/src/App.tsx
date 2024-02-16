import { RouterProvider, createBrowserRouter } from "react-router-dom";
import FrontPage from "./pages/game/FrontPage";
import GamePage from "./pages/game/GamePage";
import DashboardPage from "./pages/game/DashboardPage";
import JoinPage from "./pages/game/JoinPage";

function App() {
  
  const router = createBrowserRouter([
    {
      path: "/",
      element: (<FrontPage />),
    },
    {
      path: "/join",
      element: (<JoinPage />),
    },
    {
      path: "/game",
      element: (<GamePage/>),
    },
    {
      path: "/dashboard",
      element: (<DashboardPage/>),
    }
  ]);

  return (
    <RouterProvider router={router} />
  )
}

export default App
