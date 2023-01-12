import React, { useEffect, useState } from 'react';
import logo from 'assets/mmja_logo.png';
import './index.css';
import {
  DOMMessage,
  DOMMessageResponse,
  DOMMessageType,
  GetTableDataResponseData,
} from 'types';
import { storage } from 'utils/storage';

const ORDER_STATUS_ROW_INDEX = 2;
const ORDER_ACTION_ROW_INDEX = 5;
const SYMBOL_ROW_INDEX = 6;
const BUYING_PRICE_ROW_INDEX = 10;

function App() {
  const [errorMessage, setErrorMessage] = useState('');
  const [portfolioId, setPortfolioId] = useState('lzM8b0')
  const [orderInfo, setOrderInfo] = useState({
    orderStatus: '',
    orderAction: '',
    symbol: '',
  });

  const parseData = (rows: GetTableDataResponseData) => {
    const orderStatus = rows[ORDER_STATUS_ROW_INDEX].value;
    const orderAction = rows[ORDER_ACTION_ROW_INDEX].value;
    const symbol = rows[SYMBOL_ROW_INDEX].value;

    setOrderInfo({
      orderStatus,
      orderAction,
      symbol,
    });
  };

  const requestData = async () => {
    const queryOptions = { active: true, currentWindow: true };
    chrome.tabs.query(queryOptions, (tabs) => {
      console.log(tabs);

      const message: DOMMessage = { type: DOMMessageType.GET_TABLE_DATA };

      chrome.tabs.sendMessage(
        tabs[0].id ?? 0,
        message,
        (response: DOMMessageResponse | undefined) => {
          console.log(response);
          if (response === undefined) {
            return setErrorMessage('Error: No response from content script');
          }

          if (!response.errorMessage) {
            parseData(response.data as GetTableDataResponseData);
          } else {
            setErrorMessage(response.errorMessage);
          }
        }
      );
    });
  };

  const saveData = async () => {
    await storage.set('hello', { hello: 'world' });
  };

  const loadData = async () => {
    const data = await storage.get('hello');
    console.log(data);
  };

  const getData = async () => {
    await storage.getAllStorage();
  };

  const launchMyMoneyJA = () => {
    chrome.tabs.create({ url: `https://mymoneyja.com/portfolio/${portfolioId}/${orderInfo.symbol}` });
    // var xpath = "//node()[text()='PROVEN']";
    // var matchingElement = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
  };

  return (
    <div className="bg-background h-full p-6 flex flex-col items-center">
      <header className="flex justify-center">
        <img src={logo} className="w-[200px]" alt="logo" />
      </header>

      <div>
        <ul>
          <li>Symbol: {orderInfo.symbol}</li>
          <li>Action {orderInfo.orderAction}</li>
          <li>Status {orderInfo.orderStatus}</li>
          <li>Qty: {}</li>
          <li>Fees: {}</li>
          <li>Unit Price: {}</li>
        </ul>
      </div>

      <button
        onClick={requestData}
        className="bg-primary rounded-md w-4/5 py-3 px-2 mt-4 text-white shadow-sm"
      >
        Grab Trade Details
      </button>
      <button
        onClick={launchMyMoneyJA}
        className="bg-primary rounded-md w-4/5 py-3 px-2 mt-4 text-white shadow-sm"
      >
        Launch My Money JA
      </button>
      <button
        onClick={saveData}
        className="bg-primary rounded-md w-4/5 py-3 px-2 mt-4 text-white shadow-sm"
      >
        Save data
      </button>
      <button
        onClick={loadData}
        className="bg-primary rounded-md w-4/5 py-3 px-2 mt-4 text-white shadow-sm"
      >
        Load data
      </button>
      <button onClick={getData}>Get All</button>
    </div>
  );
}

export default App;
