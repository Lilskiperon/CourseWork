/* eslint-disable react/prop-types */
import { forwardRef } from "react";
import { NavLink } from "react-router-dom";
import { navbarLinks } from "../../constants";
import './Sidebar.css'; 

const Sidebar = forwardRef(({ collapsed }, ref) => {
    return (
        <aside
            ref={ref}
            className={`sidebar ${collapsed ? "collapsed left-collapsed" : ""}`}
        >
            <div className="logo">
                <img
                    src={"/assets/img/logoSite.png"}
                    alt="Logoipsum"
                    className="dark:hidden"
                />

                {!collapsed && <p>NgMassa</p>}
            </div>
            <div className="nav-group">
        
                        {navbarLinks.map((link) => (
                            <NavLink
                                key={link.label}
                                to={link.path}
                                className="sidebar-item"
                                end={link.path === "/admin/"}
                            >
                                <link.icon
                                    size={22}
                                    
                                />
                                {!collapsed && <p>{link.label}</p>}
                            </NavLink>
                        ))}

            </div>
        </aside>
    );
});

Sidebar.displayName = "Sidebar";

export default Sidebar;
