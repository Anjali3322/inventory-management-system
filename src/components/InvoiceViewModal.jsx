import { X, Printer } from "lucide-react";

const statusStyles = {
  Paid: "bg-emerald-500/10 text-emerald-500",
  Unpaid: "bg-amber-500/10 text-amber-500",
  Overdue: "bg-rose-500/10 text-rose-500",
  Draft: "bg-slate-500/10 text-slate-400",
};

const InvoiceViewModal = ({ invoice, onClose }) => {
  const handlePrint = () => window.print();

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 print:bg-white print:p-0">
      <div className="bg-white text-slate-900 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto print:max-h-none print:shadow-none">
        <div className="flex items-center justify-between p-6 border-b border-slate-200 print:hidden">
          <h2 className="text-lg font-bold">Invoice {invoice.invoiceNumber}</h2>
          <div className="flex items-center gap-2">
            <button onClick={handlePrint} className="flex items-center gap-2 bg-(--primary-purple) hover:bg-(--hover-purple) text-white px-4 py-2 rounded-xl text-sm font-medium cursor-pointer">
              <Printer size={16} />
              Print
            </button>
            <button onClick={onClose} className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 cursor-pointer">
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="p-8">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-2xl font-bold">INVOICE</h1>
              <p className="text-sm text-slate-500 mt-1">{invoice.invoiceNumber}</p>
            </div>
            <span className={`text-xs font-semibold px-3 py-1.5 rounded-full ${statusStyles[invoice.status]}`}>
              {invoice.status}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-6 mb-8">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase mb-1">Billed To</p>
              <p className="font-semibold">{invoice.customerName}</p>
              {invoice.customerEmail && <p className="text-sm text-slate-500">{invoice.customerEmail}</p>}
              {invoice.customerPhone && <p className="text-sm text-slate-500">{invoice.customerPhone}</p>}
              {invoice.customerAddress && <p className="text-sm text-slate-500">{invoice.customerAddress}</p>}
            </div>
            <div className="text-right">
              <p className="text-xs font-semibold text-slate-400 uppercase mb-1">Issue Date</p>
              <p className="text-sm mb-3">{new Date(invoice.issueDate).toLocaleDateString()}</p>
              <p className="text-xs font-semibold text-slate-400 uppercase mb-1">Due Date</p>
              <p className="text-sm">{new Date(invoice.dueDate).toLocaleDateString()}</p>
            </div>
          </div>

          <table className="w-full text-sm mb-6">
            <thead>
              <tr className="text-left text-slate-400 border-b border-slate-200">
                <th className="pb-2 font-medium">Item</th>
                <th className="pb-2 font-medium text-center">Qty</th>
                <th className="pb-2 font-medium text-right">Price</th>
                <th className="pb-2 font-medium text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items.map((item, index) => (
                <tr key={index} className="border-b border-slate-100">
                  <td className="py-2.5">{item.name}</td>
                  <td className="py-2.5 text-center">{item.quantity}</td>
                  <td className="py-2.5 text-right">${item.price.toFixed(2)}</td>
                  <td className="py-2.5 text-right font-medium">${item.total.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-end">
            <div className="w-56 space-y-1.5 text-sm">
              <div className="flex justify-between text-slate-500">
                <span>Subtotal</span>
                <span>${invoice.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Tax ({invoice.taxRate}%)</span>
                <span>${invoice.taxAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Discount</span>
                <span>-${invoice.discount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-base pt-1.5 border-t border-slate-200">
                <span>Total</span>
                <span>${invoice.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {invoice.notes && (
            <div className="mt-8 pt-4 border-t border-slate-200">
              <p className="text-xs font-semibold text-slate-400 uppercase mb-1">Notes</p>
              <p className="text-sm text-slate-600">{invoice.notes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InvoiceViewModal;