import { useEffect, useState } from "react";
import "./converter.css";

// `https://api.frankfurter.app/latest?amount=100&from=EUR&to=USD`

// const url = `https://api.frankfurter.app/latest?amount=1&from=EUR&to=USD`;

export default function Converter() {
const [amount, setAmount] = useState('')
const [fromCurrency, setFromCurrency] = useState('EUR')
const [toCurrency, setToCurrency] = useState('USD')
const [converted, setConverted] = useState('')
const [isLoading, setIsLoading] = useState(false)

console.log(amount)

function Loader(){
    return (
        <div>
            <h4>Converting&nbsp;...</h4>
        </div>
    )
}

  useEffect(() => {
    async function fetchRates() {
        setIsLoading(true);
      try {
        const res = await fetch(`https://api.frankfurter.app/latest?amount=${amount}&from=${fromCurrency}&to=${toCurrency}`);
        const data = await res.json();
        // const amt = data.rates[`${toCurrency}`]
        setConverted(data.rates[`${toCurrency}`]);
        setIsLoading(false);
        // console.log(amt)
        // console.log(data);
      } catch (error) {
        console.log(error);
      }
    }

    if(fromCurrency === toCurrency)
    return setConverted(amount);

    fetchRates();
  }, [amount, fromCurrency, toCurrency]);  

  function formatCurrency(amount) {
        return amount.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });
  };

  return (
    <div>
      <input
      type='text'
      placeholder="Amount"
      value={amount}
      onChange={(e) => setAmount(Number(e.target.value))}
        disabled={isLoading}
      />
      <select
      value={fromCurrency} 
      onChange={(e) => setFromCurrency(e.target.value)}
      disabled={isLoading} >
        <option value='USD' >USD</option>
        <option value='EUR'>EUR</option>
        <option value='CAD'>CAD</option>
        <option value='INR'>INR</option>
      </select>
      <select value={toCurrency} onChange={(e) => setToCurrency(e.target.value)} disabled={isLoading} >
        <option value='USD' >USD</option>
        <option value='EUR'>EUR</option>
        <option value='CAD'>CAD</option>
        <option value='INR'>INR</option>
      </select>
      {isLoading ? <Loader /> :
      <p>{formatCurrency(converted)}&nbsp;<strong>{toCurrency}</strong></p>
    }
    </div>
  );
}
