import {
  DOMMessage,
  DOMMessageResponse,
  DOMMessageResponseType,
  DOMMessageType,
  TableRow,
} from 'types';
import { Transaction } from 'types/transaction';
import { select } from 'utils/dom-manipulation';

const messagesFromReactAppListener = (
  msg: DOMMessage,
  sender: chrome.runtime.MessageSender,
  sendResponse: (response: DOMMessageResponse) => void
) => {
  console.log('[content.js]. Message received', msg);

  switch (msg.type) {
    case DOMMessageType.GET_TABLE_DATA:
      return sendResponse(handleGetTableData());
  }
};

function handleGetTableData(): DOMMessageResponse {
  const container = select('.order-details .col-xs-12.col-md-6');
  const secondContainer = select(
    '.order-details .col-xs-12.col-md-6:last-child'
  );

  if (!container || !secondContainer) {
    return {
      errorMessage: 'Container not found',
      data: null,
      type: DOMMessageResponseType.ERROR,
    };
  }
  const dataArray: any[] = [];

  const containerData = getContainerRows(container);

  const secondContainerData = getContainerRows(secondContainer);

  dataArray.push(...containerData, ...secondContainerData.slice(0, 3));

  // Prepare the response object with information about the site
  let response: DOMMessageResponse;

  response = {
    errorMessage: '',
    data: dataArray,
    type: DOMMessageResponseType.GET_TABLE_DATA_RESPONSE,
  };
  console.log(response);

  return response;
}

function handlePopulateForm(transaction: Transaction): DOMMessageResponse {
  //grab all the inputs
  const transactionTypeInput = select(
    'tr td:nth-child(1) input'
  ) as HTMLInputElement;
  const transactionVolumeInput = select(
    'tr td:nth-child(2) input'
  ) as HTMLInputElement;
  const shareCostInput = select('tr td:nth-child(3) input') as HTMLInputElement;
  const shareValueInput = select(
    'tr td:nth-child(4) input'
  ) as HTMLInputElement;
  const transactionFeesInput = select(
    'tr td:nth-child(5) input'
  ) as HTMLInputElement;
  const transactionDateInput = select('tr td:nth-child(6) button');
  const submitBtn = select('tr td:nth-child(8) button') as HTMLButtonElement;

  // populate the inputs
  transactionTypeInput.value = transaction.transactionType;
  transactionVolumeInput.value = transaction.transactionVolume;
  shareCostInput.value = transaction.shareCost;
  shareValueInput.value = transaction.shareValue;
  transactionFeesInput.value = transaction.transactionFees;
  transactionDateInput!.textContent = transaction.transactionDate;

  // submit

  submitBtn!.click();

  return {
    errorMessage: '',
    data: null,
    type: DOMMessageResponseType.SUBMIT_FORM_RESPONSE,
  };
}

function getContainerRows(container: Element): TableRow[] {
  return Array.from(container.children).map((child) => {
    const [name, value] = Array.from(child.children).map(
      (child) => child.textContent
    );

    return {
      name,
      value,
    } as TableRow;
  });
}

console.log('[content.js]. Listening for messages from My Money JA Extension');

/**
 * Fired when a message is sent from either an extension process or a content script.
 */
chrome.runtime.onMessage.addListener(messagesFromReactAppListener);
