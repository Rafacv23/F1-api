export default function Footer() {
  return (
    <footer className="text-gray-300 py-4 border-t-slate-200 border">
      <div className="max-w-4xl mx-auto flex justify-between items-center">
        <p className="text-sm">© 2024 Formula 1 API. All rights reserved.</p>
        <ul className="flex space-x-4">
          <li>
            <a href="#" className="hover:text-gray-400 transition duration-300">
              About
            </a>
          </li>
          <li>
            <a href="#" className="hover:text-gray-400 transition duration-300">
              Contact
            </a>
          </li>
          <li>
            <a href="#" className="hover:text-gray-400 transition duration-300">
              Privacy Policy
            </a>
          </li>
        </ul>
      </div>
    </footer>
  )
}
