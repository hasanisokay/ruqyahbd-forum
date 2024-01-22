const generateInvoiceNumber = () => {
    const prefix = "INV";
    const dateComponent = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).replace(/\//g, "");
    const randomString = Math.random().toString(36).substring(2, 8);
    const invoiceNumber = `${prefix}-${dateComponent}-${randomString}`;
    return invoiceNumber;
};

export default generateInvoiceNumber;