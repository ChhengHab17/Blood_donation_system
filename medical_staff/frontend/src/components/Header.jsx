export default function Header({ title }) {
    return (
      <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-white-600 rounded-lg flex items-center justify-center">
              <div className="text-white font-bold text-sm">
                <div className="flex flex-col items-center">
                  <span className="text-xs">donate</span>
                  <span className="text-xs font-black">BLOOD</span>
                </div>
              </div>
            </div>
          </div>
  
          <h1 className="text-3xl font-bold text-red-600 absolute left-1/2 transform -translate-x-1/2">
            {title}
          </h1>
  
          <div className="flex items-center space-x-3">
            <span className="text-gray-700 font-medium">Hi,name</span>
            <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
          </div>
        </div>
      </header>
    )
  }