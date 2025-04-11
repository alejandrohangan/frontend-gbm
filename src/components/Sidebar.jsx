import { Link, useLocation } from "react-router-dom"
import { FolderOpen, CheckCircle, XCircle, Clock, AtSign, Ticket, Users, Settings } from "lucide-react"

const SideBar = () => {
    const location = useLocation()

    return (
        <div
            className="d-flex flex-column flex-shrink-0 p-3 text-white bg-dark"
            style={{ width: "280px", minHeight: "100%" }}
        >
            <ul className="nav nav-pills flex-column mb-auto">
                <li>
                    <Link
                        to="/categories"
                        className={`nav-link text-white d-flex align-items-center ${location.pathname.includes("/categories") ? "active" : ""}`}
                    >
                        <FolderOpen className="me-2" size={20} />
                        Categories
                    </Link>
                </li>
                <li>
                    <Link
                        to="/open"
                        className={`nav-link text-white d-flex align-items-center ${location.pathname === "/open" ? "active" : ""}`}
                    >
                        <FolderOpen className="me-2" size={20} />
                        Open
                    </Link>
                </li>
                <li>
                    <Link
                        to="/solved"
                        className={`nav-link text-white d-flex align-items-center ${location.pathname === "/solved" ? "active" : ""}`}
                    >
                        <CheckCircle className="me-2" size={20} />
                        Solved
                    </Link>
                </li>
                <li>
                    <Link
                        to="/closed"
                        className={`nav-link text-white d-flex align-items-center ${location.pathname === "/closed" ? "active" : ""}`}
                    >
                        <XCircle className="me-2" size={20} />
                        Closed
                    </Link>
                </li>
                <li>
                    <Link
                        to="/pending"
                        className={`nav-link text-white d-flex align-items-center ${location.pathname === "/pending" ? "active" : ""}`}
                    >
                        <Clock className="me-2" size={20} />
                        Pending
                    </Link>
                </li>
                <li>
                    <Link
                        to="/unassigned"
                        className={`nav-link text-white d-flex align-items-center ${location.pathname === "/unassigned" ? "active" : ""}`}
                    >
                        <AtSign className="me-2" size={20} />
                        Unassigned
                    </Link>
                </li>
                <li>
                    <Link
                        to="/my-tickets"
                        className={`nav-link text-white d-flex align-items-center ${location.pathname === "/my-tickets" ? "active" : ""}`}
                    >
                        <Ticket className="me-2" size={20} />
                        My tickets
                    </Link>
                </li>
                <li>
                    <Link
                        to="/teams"
                        className={`nav-link text-white d-flex align-items-center ${location.pathname === "/teams" ? "active" : ""}`}
                    >
                        <Users className="me-2" size={20} />
                        Teams
                    </Link>
                </li>
                <li>
                    <Link
                        to="/management"
                        className={`nav-link text-white d-flex align-items-center ${location.pathname === "/management" ? "active" : ""}`}
                    >
                        <Settings className="me-2" size={20} />
                        Management
                    </Link>
                </li>
            </ul>
        </div>
    )
}

export default SideBar