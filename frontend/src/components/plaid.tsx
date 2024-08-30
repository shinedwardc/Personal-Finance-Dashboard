import { usePlaidLink } from "react-plaid-link";
import { useState, useEffect } from "react";
import axios from "axios";

const Plaid = ({ onPlaidConnected }) => {

    const [linkToken, setLinkToken] = useState<string>("");

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

    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [transactions, setTransactions] = useState<any[]>([]);

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
                setAccessToken(newAccessToken);
                onPlaidConnected(newAccessToken);
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


      return (
        <div>
            <button className="btn btn-neutral" onClick={() => open()} disabled={!ready}>
            Connect with plaid
            </button>
        </div>
      )
}

export default Plaid;