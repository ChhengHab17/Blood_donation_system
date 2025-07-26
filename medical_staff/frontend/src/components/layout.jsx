import Sidebar from "./sidebar"
import Header from "./Header"

export default function Layout({ children, title }) {
  return (
    <div className="min-h-screen bg-gray-100 flex">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header title={title} />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  )
}
