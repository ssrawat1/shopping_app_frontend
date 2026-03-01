import React from 'react'
import { X } from 'lucide-react'
import { useThemeContext } from '@/context/ThemeContext'
import { logoutApi } from '@/apis/userApi';

const ProfileModal = ({ profileData: { name, email }, setIsLoggedIn }) => {
  const { isDark, setShowUserProfile } = useThemeContext();

  const handleLogout = async () => {
    try {
      const { data } = await logoutApi();
      console.log("Logout User response:", data)
      setIsLoggedIn(false);
      setShowUserProfile(false)
    } catch (error) {
      console.log("Error while logout the user:", error)
    }
  }

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/50 z-40 md:hidden"
        onClick={() => setShowUserProfile(false)}
      />

      <div className={`
        ${isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}
        shadow-lg py-4 px-6 z-50 rounded-2xl border
        fixed top-20 left-1/2 -translate-x-1/2 w-[90%] max-w-sm
        md:absolute md:top-full md:-right-28 md:left-auto md:translate-x-0 md:mt-2 md:w-64
      `}>

        <button 
          onClick={(e) => {
            e.stopPropagation()
            setShowUserProfile(false)
          }} 
          className={`
            absolute top-2 right-2 p-1 rounded-full transition-colors
            ${isDark ? "hover:bg-gray-700 bg-gray-700" : "hover:bg-blue-100 bg-gray-100"}
          `}
        >
          <X size={18} className={isDark ? 'text-gray-300' : 'text-gray-700'} />
        </button>

        <div className='flex justify-center mb-3 mt-2'>
          <div className='w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center text-white text-lg font-bold'>
            {name?.charAt(0)?.toUpperCase() || 'U'}
          </div>
        </div>

        <p className={`text-center font-semibold text-lg mb-1 ${isDark ? "text-gray-100" : "text-gray-800"}`}>
          {name || 'User'}
        </p>

        <p className={`text-center text-sm mb-4 break-words ${isDark ? "text-gray-400" : "text-gray-600"}`}>
          {email || 'email@example.com'}
        </p>

        <div className={`border-t mb-3 ${isDark ? "border-gray-700" : "border-gray-200"}`}></div>

        <button 
          onClick={() => handleLogout()} 
          className={`
            w-full py-2 rounded-md text-sm font-medium transition-colors
            ${isDark ? "bg-gray-700 hover:bg-gray-600 text-gray-100" : "bg-gray-100 hover:bg-gray-200 text-gray-700"}
          `}
        >
          Logout
        </button>
      </div>
    </>
  )
}

export default ProfileModal