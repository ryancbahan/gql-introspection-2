export const appCreditCreate1 = {
  title: "test credit",
  description: "test app credit description",
  data: {
    amount: {
      amount: "1.00",
      currencyCode: "USD",
    },
    description: "foo",
    test: true,
  },
};

export const collectionInput1 = {
  title: "test collection",
  description: "new collection of products",
  data: {
    input: {
      title: "Our entire shoe collection",
      descriptionHtml: "View <b>every</b> shoe available in our store.",
    },
  },
};

export const productInput1 = {
  title: "test product",
  description: "my new product for testing",
  data: {
    input: {
      title: "sweet new product",
    },
  },
};

export const argsLookup = {
  appCreditCreate: [appCreditCreate1],
  collectionCreate: [collectionInput1],
  productCreate: [productInput1],
};
