/* eslint-disable react/prop-types */
import { Bell, ChevronsLeft, Search} from "lucide-react";
import profileImg from "../../../public/assets/img/avatar_1.png";;
import './Header.css'; // подключаем CSS

const Header = ({ collapsed, setCollapsed }) => {

    return (    
        <header className={`header `}>
            <div className="header-left">
                <button
                    className="btn-ghost"
                    onClick={() => setCollapsed(!collapsed)}
                >
                    <ChevronsLeft className={collapsed ? "rotate-180" : ""} />
                </button>
                <div className="input">
                    <Search
                        size={20}
                        className="text-slate-300"
                    />
                    <input
                        type="text"
                        name="search"
                        id="search"
                        placeholder="Search..."
                    />
                </div>
            </div>
            <div className="header-right">
                <button className="btn-ghost">
                    <Bell size={20} />
                </button>
                <button className="profile-img">
                    <img
                        src={profileImg}
                        alt="profile image"
                    />
                </button>
            </div>
        </header>
    );
};


export default Header;
