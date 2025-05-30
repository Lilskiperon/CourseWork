import { Outlet } from "react-router-dom";
import { useRef, useState, useEffect } from "react";
import useClickOutside  from "../../hooks/use-click-outside.jsx";
import{ useMediaQuery } from "@uidotdev/usehooks";
import Sidebar from "./sidebar";
import Header from "./header";

import "./AdminLayout.css";

const AdminLayout = () => {
    const isDesktopDevice = useMediaQuery("(min-width: 768px)");
    const [collapsed, setCollapsed] = useState(!isDesktopDevice);
    const sidebarRef = useRef(null);
    useEffect(() => {
        setCollapsed(!isDesktopDevice);
    }, [isDesktopDevice]);

    useClickOutside([sidebarRef], () => {
        if (!isDesktopDevice && !collapsed) {
            setCollapsed(true);
        }
    });

    return (
        <div className="admin-layout">
            <div className={`admin-overlay ${!collapsed ? "active" : ""}`}
            onClick={() => setCollapsed(true)} />
            
            <Sidebar ref={sidebarRef} collapsed={collapsed} />

            <div className={`admin-content ${collapsed ? "collapsed" : "expanded"}`}>
                <Header collapsed={collapsed} setCollapsed={setCollapsed} />
                <div className="admin-main">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default AdminLayout;
