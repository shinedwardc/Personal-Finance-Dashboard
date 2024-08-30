import { useState, useCallback, useEffect } from 'react';
import Plaid from './plaid';

const Connections = () => {
    const handlePlaidConnected = () => {
        console.log("Plaid connected");
    }

    return (
        <div>
            <Plaid onPlaidConnected={handlePlaidConnected} />
        </div>
    );
};

export default Connections;