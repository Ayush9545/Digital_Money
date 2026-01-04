CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),  -- Unique Receipt ID
    amount DECIMAL(10, 2) NOT NULL,                 -- How much
    sender_wallet_id INT REFERENCES wallets(acc_no),-- From
    receiver_wallet_id INT REFERENCES wallets(acc_no),-- To
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP   -- When
);