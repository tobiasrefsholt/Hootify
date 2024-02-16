import { RouterProvider, createBrowserRouter } from "react-router-dom";
import FrontPage from "./pages/frontPage/FrontPage";
import GamePage from "./pages/gamePage/GamePage";
import DashboardPage from "./pages/dashboardPage/DashboardPage";
import { ThemeProvider } from "./components/theme-provider";
import { Toaster } from "sonner";

function App() {
  
  const router = createBrowserRouter([
    {
      path: "/",
      element: (<FrontPage />),
    },
    {
      path: "/game/:playerId",
      element: (<GamePage/>),
    },
    {
      path: "/dashboard",
      element: (<DashboardPage/>),
    }
  ]);

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <RouterProvider router={router} />
      <Toaster />
    </ThemeProvider>
  )
}

export default App
