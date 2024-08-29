import { usePlaidLink } from "react-plaid-link";
import { useState, useEffect } from "react";
import axios from "axios";

const Plaid = () => {

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
                setAccessToken(newAccessToken);

                // Fetch transactions using the new access token
                await fetchTransactions(newAccessToken);
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

    const fetchTransactions = async (token: string) => {
        try {
            const response = await axios.get('http://localhost:8000/get-transactions/', {
                params: { access_token: token }
            });
            setTransactions(response.data.transactions);
            console.log('transactions: ', response.data.transactions);
        } catch (error) {
            console.error('Error fetching transactions:', error);
        }
    };

      return (
        <div>
            <button className="btn btn-neutral" onClick={() => open()} disabled={!ready}>
            Connect with plaid
            </button>
        </div>
      )
}

export default Plaid;