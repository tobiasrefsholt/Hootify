import {Link} from "react-router-dom";

export default function Navigation() {
    return (
        <nav>
            <ul className="flex flex-col gap-2.5">
                <li>
                    <Link to="/dashboard" className="text-white">Dashboard</Link>
                </li>
                <li>
                    <Link to="/dashboard/games" className="text-white">Games</Link>
                </li>
                <li>
                    <Link to="/dashboard/quizzes" className="text-white">Quizzes</Link>
                </li>
                <li>
                    <Link to="/dashboard/questions" className="text-white">Questions</Link>
                </li>
                <li>
                    <Link to="/dashboard/categories" className="text-white">Categories</Link>
                </li>
                <li>
                    <Link to="/" className="text-white">Exit dashboard</Link>
                </li>
            </ul>
        </nav>
    )
}