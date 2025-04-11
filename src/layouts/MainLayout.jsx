import { Outlet } from "react-router-dom"
import SideBar from "../components/SideBar"
import "bootstrap/dist/css/bootstrap.min.css"

const MainLayout = () => {
    return (
        <div className="d-flex flex-column vh-100">
            {/* Header */}
            <header className="bg-dark text-white py-2 px-3 d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center">
                    <h4 className="mb-0">GBM-TicketSystem</h4>
                </div>
            </header>

            {/* Main content with sidebar and page content */}
            <div className="d-flex flex-grow-1">
              
                {/* Page content */}
                <main className="flex-grow-1 bg-light overflow-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}

export default MainLayout

