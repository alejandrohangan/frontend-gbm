import { Outlet } from "react-router-dom"
import "bootstrap/dist/css/bootstrap.min.css"
import DashboardHeader from "../components/DashboardHeader"

const MainLayout = () => {
    return (
        <div className="d-flex flex-column vh-100">
            {/* Modern Header */}
            <DashboardHeader />

            {/* Main content */}
            <main className="flex-grow-1 bg-light overflow-auto">
                <Outlet />
            </main>
        </div>
    )
}

export default MainLayout