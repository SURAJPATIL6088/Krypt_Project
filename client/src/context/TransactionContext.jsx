import React, {useState, useEffect, createContext} from "react";
import {ethers} from 'ethers';

import {contractABI, contractAddress} from '../utils/constants';

export const TransactionContext = createContext();

const {ethereum } = window;

const getEthereumContract = () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const transactionsContract = new ethers.Contract(contractAddress, contractABI, signer);

    console.log({
        provider,
        signer,
        transactionsContract
    })
    return transactionsContract;
}

export const TransactionProvider = ({children}) => {
    
    const[currentAccount, setCurrentAccount] = useState('');
    const[formData, setFormData] = useState({addressTo:'', amount:'', keyword:'', message:''});
    const [isLoading, setIsLoading] = useState(false);
    const [transactionCount, setTransactionCount] = useState(localStorage.getItem('transactionCount'));

    const handleChange = (e, name) =>{
        setFormData((prevState) => ({...prevState, [name]: e.target.value}));
    };

    const checkIfWalletIsConnected = async () => {
        try{
            if(!ethereum) return alert("Please install Metamask");

            const accounts = await ethereum.request({method: 'eth_accounts'});
            
            if(accounts.length)
            {
                setCurrentAccount(accounts[0]);

                // get the all the transactions
                //getAllTransactions();
            }
            else
            {
                console.log('No Accounts Found');
            }
            
            console.log(accounts);            
        }
        catch(error){
            console.log(error);
            throw new Error("No ethereum Object");
        }

    }

    const connectWallet = async () => {
        try{
            if(!ethereum) return alert("Please install Metamask");

            const accounts = await ethereum.request({method: 'eth_requestAccounts'});         
            setCurrentAccount(accounts[0]);
        } catch(error){
            console.log(error);
            throw new Error("No ethereum Object");
        }
    }

    const sendTransaction = async () =>{
        try{
            if(!ethereum) return alert("Please install Metamask");
            
            // get the data form the form
            const {addressTo, amount, keyword, message} = formData;
            const transactionContract = getEthereumContract();
            const parsedAmount = ethers.utils.parseEther(amount);

            await ethereum.request({
                method: 'eth_sendTransaction',
                params : [{
                    from: currentAccount,
                    to: addressTo,
                    gas: "0x5208", // 21000 wei
                    value:parsedAmount._hex, // 0.0001 it should be in the decimal
                }]
            });

            const transactionHash = await transactionContract.addToBlockchain(addressTo, parsedAmount, message, keyword);
            setIsLoading(true);
            console.log(`Loading - ${transactionHash}`);
            await transactionHash.wait();
            setIsLoading(false);
            console.log(`Success - ${transactionHash}`);

            const transactionCount = await transactionContract.getTransactionCount();
            setTransactionCount(transactionCount.toNumber());

        } catch(error){
            console.log(error);
            throw new Error("No ethereum Object");
        }
    }

    useEffect(() => {
        checkIfWalletIsConnected();
    }, [])

    return (
        <TransactionContext.Provider value={{connectWallet, currentAccount, formData, sendTransaction, handleChange}}>
            {children}
        </TransactionContext.Provider>
    );
}

