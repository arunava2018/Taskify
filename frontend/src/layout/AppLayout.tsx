import { Outlet } from "react-router-dom"
import Navbar from "./Navbar"
import Footer from "./Footer"

const AppLayout: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header always visible */}
      <Navbar />
      {/* Page content */}
      <main className="flex-grow container m-auto">
        <Outlet />
      </main>
      {/* Footer */}
      <Footer />
    </div>
  )
}

export default AppLayout
