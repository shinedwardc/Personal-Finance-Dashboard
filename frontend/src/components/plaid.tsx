import { usePlaidLink } from "react-plaid-link";
import { useState, useEffect } from "react";
import plaidLogo from '../assets/plaid.png';
import axios from "axios";

const Plaid = ({ onPlaidConnected }) => {

    const [linkToken, setLinkToken] = useState<string>("");
    const [accessToken, setAccessToken] = useState<string>(localStorage.getItem("plaidAccessToken") || "");
    useEffect(() => {
        const createLinkToken = async () => {
            try {
                const response = await axios.post('http://localhost:8000/create-link-token/');
                setLinkToken(response.data.link_token);
            } catch (error) {
                console.error(error);
            }
        }
        createLinkToken();
    },[])


    const { open, ready } = usePlaidLink({
        token: linkToken,
        onSuccess: async (publicToken) => {
            console.log('Public token:', publicToken);
            try {
                // Exchange public token for access token
                const response = await axios.post('http://localhost:8000/exchange-public-token/', {
                  public_token: publicToken
                });
                const newAccessToken = response.data.access_token;
                localStorage.setItem("plaidAccessToken", newAccessToken);
                onPlaidConnected(newAccessToken);
                setAccessToken(newAccessToken);
            } catch (error) {
                console.error('Error exchanging public token:', error);
            }
        },
        onExit: (error) => {
            if (error) {
                console.error('Plaid Link exited with error:', error);
            }
        },
    });

    const plaidDisconnect = () => {
      localStorage.removeItem("plaidAccessToken");
      setAccessToken("");
    }


      return (
        <div className="card w-96 bg-base-100 shadow-2xl">
          <div className="mt-8">
            <figure>
              <img className="w-1/2"
                src={plaidLogo}
                alt="Plaid" />
            </figure>
          </div>
          <div className="card-body">
            <h2 className="card-title">Plaid Connection</h2>
            <p>{localStorage.getItem("plaidAccessToken") ? "Your account is connected to Plaid." : "Connect your bank account to track expenses."}</p>
            <div className="card-actions justify-center">
              {!accessToken ? (              
                <button 
                className={`btn btn-primary ${accessToken ? "btn-disabled" : ""}`} 
                onClick={() => open()} 
                disabled={!ready || !!accessToken}>
                  Connect
                </button>
              ) : (
                <button className="btn btn-secondary" onClick={plaidDisconnect}>Disconnect</button>
              )}
            </div>
          </div>
        </div>
      )
}

export default Plaid;