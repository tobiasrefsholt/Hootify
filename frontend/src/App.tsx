import {BrowserRouter, Route, Routes} from "react-router-dom";
import {ThemeProvider} from "./components/theme-provider";
import {Toaster} from "sonner";
import React from "react";

const FrontPage = React.lazy(() => import("./pages/frontPage/FrontPage"));
const GamePage = React.lazy(() => import("./pages/gamePage/GamePage"));
const DashboardPage = React.lazy(() => import("./pages/dashboardPage/DashboardPage"));

function App() {
    return (
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <BrowserRouter>
                <Routes>
                    <Route index element={<FrontPage/>}/>
                    <Route path="/game/*" element={<GamePage/>}/>
                    <Route path="/dashboard/*" element={<DashboardPage/>}/>
                </Routes>
                <Toaster/>
            </BrowserRouter>
        </ThemeProvider>
    )
}

export default App
