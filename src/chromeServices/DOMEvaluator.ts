import {
  DOMMessage,
  DOMMessageResponse,
  DOMMessageResponseType,
  DOMMessageType,
  TableRow,
} from 'types';

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
  const container = document.querySelector(
    '.order-details .col-xs-12.col-md-6'
  );
  const secondContainer = document.querySelector(
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
