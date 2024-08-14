import { Link } from 'react-router-dom';

const Sidebar = () => {
    return (
        <div className="relative h-screen">
            <div className="absolute left-0 h-screen w-48 bg-gray-800 text-white">
                <ul className="list-none">
                    <li className="font-sans p-4 hover:bg-gray-700 text-center">
                        <Link to="/">Home</Link>
                    </li>
                    <li className="p-4 hover:bg-gray-700 text-center">
                        <Link to="/expenses">Expenses</Link>
                    </li>
                </ul>
            </div>
        </div>


    )
}

export default Sidebar;