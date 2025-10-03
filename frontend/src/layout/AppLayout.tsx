import { Outlet, useLocation } from "react-router-dom"
import Navbar from "./Navbar"
const AppLayout: React.FC = () => {
  const { pathname } = useLocation()
  const isDashboard = pathname.startsWith("/dashboard")

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar always visible */}
      <Navbar />

      {/* Page Content */}
      <main className={`flex-grow ${isDashboard ? "" : "container m-auto"}`}>
        <Outlet />
      </main>

      {/* Footer */}
      {/* <Footer /> */}
    </div>
  )
}

export default AppLayout
