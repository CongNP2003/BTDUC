import { Routes, Route } from "react-router-dom";
import Login from "../pages/Login.jsx";
import AdminLayout from "../layouts/AdminLayout.jsx";
import UserLayout from "../layouts/UserLayout.jsx";
 
// Global theme styles injected once at the router level
const GlobalStyle = () => (
    <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&family=Lato:wght@300;400;700&display=swap');
 
        :root {
            --color-bg:           #eaf5fd;
            --color-surface:      #ffffff;
            --color-primary:      #1976d2;
            --color-primary-light:#42a5f5;
            --color-primary-pale: #e3f2fd;
            --color-border:       #d6e8f7;
            --color-text:         #1a2740;
            --color-text-muted:   #7a94b0;
            --color-danger:       #e53935;
            --color-danger-pale:  #fff5f5;
            --font-heading:       'Nunito', sans-serif;
            --font-body:          'Lato', sans-serif;
            --radius-lg:          20px;
            --radius-md:          12px;
            --radius-sm:          9px;
            --shadow-card:        0 4px 24px rgba(30,136,229,0.08), 0 1px 4px rgba(0,0,0,0.05);
            --shadow-btn:         0 4px 16px rgba(25,118,210,0.22);
        }
 
        *, *::before, *::after { box-sizing: border-box; }
 
        body {
            margin: 0;
            background: var(--color-bg);
            font-family: var(--font-body);
            color: var(--color-text);
            -webkit-font-smoothing: antialiased;
        }
 
        /* Scrollbar */
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: #f0f9ff; }
        ::-webkit-scrollbar-thumb { background: #90caf9; border-radius: 99px; }
        ::-webkit-scrollbar-thumb:hover { background: #42a5f5; }
    `}</style>
);
 
function AppRouter() {
    return (
        <>
            <GlobalStyle />
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/admin/*" element={<AdminLayout />} />
                <Route path="/user/*" element={<UserLayout />} />
            </Routes>
        </>
    );
}
 
export default AppRouter;