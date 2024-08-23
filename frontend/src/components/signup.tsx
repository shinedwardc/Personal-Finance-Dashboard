import { useState } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";

const Signup = () => {
    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [fName, setFName] = useState("");
    const [lName, setLName] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const handleFormSubmit = async (e : React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword){
            alert('Passwords do not match.');
            return;
        }
        try {
            const response = await axios.post('http://localhost:8000/signup/', {
                username,
                password,
                email,
                fName,
                lName,
            });
            if (response.status === 201) {
                console.log('here');
                navigate('/login', {state: {success: true}});
            }
        } catch (error) {
            console.error('Error: ',error);
        }
    } 

    return (
        <form onSubmit={handleFormSubmit}>
            <div className="mb-2">
                <label className="block text-sm font-medium">
                    Username:
                </label>
                <input
                  type="text"
                  value={username}
                  className="bg-gray-50 border border-gray-300"
                  onChange={(e) => setUsername(e.target.value)}
                />
            </div>
            <div className="flex flex-wrap gap-5">
                <div className="mb-2">
                    <label className="block text-sm font-medium">
                        First name:
                    </label>
                    <input
                    type="text"
                    value={fName}
                    className="bg-gary-50 border border-gray-300"
                    onChange={(e) => setFName(e.target.value)}
                    />
                </div>
                <div className="mb-2">
                    <label className="block text-sm font-medium">
                        Last name:
                    </label>
                    <input
                    type="text"
                    value={lName}
                    className="bg-gary-50 border border-gray-300"
                    onChange={(e) => setLName(e.target.value)}
                    />
                </div>
                <div className="mb-2">
                    <label className="block text-sm font-medium">
                        Email:
                    </label>
                    <input
                    type="email"
                    value={email}
                    className="bg-gary-50 border border-gray-300"
                    onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
            </div>
            <div className="mb-2">
                <label className="block text-sm font-medium">
                    Password:
                </label>
                <input
                  type="password"
                  minLength={2}
                  maxLength={16}
                  required={true}
                  value={password}
                  className="bg-gary-50 border border-gray-300"
                  onChange={(e) => setPassword(e.target.value)}
                />
            </div>
            <div>
                <label className="block text-sm font-medium">
                    Re-type password:
                </label>
                <input
                    type="password"
                    minLength={2}
                    maxLength={16}
                    required={true}
                    value={confirmPassword}
                    className="bg-gary-50 border border-gray-300"
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />
            </div>
            <button className="mt-1 text-white bg-green-400 rounded-lg">
                Sign up
            </button>
        </form>
    )
}

export default Signup;