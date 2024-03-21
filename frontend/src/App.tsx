import {BrowserRouter, Route, Routes} from "react-router-dom";
import {ThemeProvider} from "./components/theme-provider";
import {Toaster} from "sonner";
import {lazy, Suspense,} from "react";
import {UserProvider} from "@/context/userContext.tsx";
import {Loader2} from "lucide-react";
import ResetPasswordPage from "@/pages/resetPasswordPage/resetPasswordPage.tsx";

const FrontPage = lazy(() => import("./pages/frontPage/FrontPage"));
const GamePage = lazy(() => import("./pages/gamePage/GamePage"));
const DashboardPage = lazy(() => import("./pages/dashboardPage/DashboardPage.tsx"));

function App() {
    return (
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <UserProvider>
                <BrowserRouter basename="/">
                    <Suspense
                        fallback={<div className="h-screen w-full flex items-center justify-center"><Loader2/></div>}>
                        <Routes>
                            <Route index element={<FrontPage/>}/>
                            <Route path="game/:playerId" element={<GamePage/>}/>
                            <Route path="dashboard/*" element={<DashboardPage/>}/>
                            <Route path="resetPassword" element={<ResetPasswordPage/>}/>
                        </Routes>
                    </Suspense>
                    <Toaster/>
                </BrowserRouter>
            </UserProvider>
        </ThemeProvider>
    )
}

export default App
