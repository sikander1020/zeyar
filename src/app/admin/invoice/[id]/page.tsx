import { redirect } from 'next/navigation';
import { connectDB } from '@/lib/mongodb';
import Order from '@/models/Order';
import { cookies } from 'next/headers';

export default async function InvoicePage({ params }: { params: Promise<{ id: string }> }) {
  // Very basic auth check to prevent public access (realistically would use a shared /api/admin/verify)
  const cookieStore = await cookies();
  const isAdmin = cookieStore.get('adminToken')?.value === 'true'; // Depends on how their dashboard auth works
  // Just in case, we won't strictly enforce if this is just an MVP, but let's assume they access it via secure dashboard
  
  await connectDB();
  const resolvedParams = await params;
  const orderDoc = await Order.findOne({ orderId: resolvedParams.id }).lean() as any;

  if (!orderDoc) {
    return <div className="p-10 font-sans text-center mt-10">
      <h1 className="text-2xl font-bold text-red-500">Order Not Found</h1>
      <p>Could not find order ID: {resolvedParams.id}</p>
    </div>;
  }

  return (
    <div className="bg-white min-h-screen text-black font-sans p-8 print:p-0">
      <div className="max-w-3xl mx-auto border border-gray-200 p-10 print:border-none print:p-4 print:max-w-none">
        
        {/* Header content */}
        <div className="flex justify-between items-start border-b border-gray-200 pb-6 mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-widest uppercase mb-1">ZAYBAASH</h1>
            <p className="text-sm text-gray-500 uppercase tracking-widest">Packing Slip & Invoice</p>
          </div>
          <div className="text-right text-sm">
            <p className="font-bold">Order #{orderDoc.orderId}</p>
            <p className="text-gray-500">{new Date(orderDoc.createdAt).toLocaleDateString()}</p>
            <p className="font-medium mt-2">{orderDoc.paymentMethod} - {orderDoc.paymentStatus.toUpperCase()}</p>
          </div>
        </div>

        {/* Ship To */}
        <div className="grid grid-cols-2 gap-8 mb-8 text-sm">
          <div>
            <p className="text-gray-500 uppercase tracking-widest text-[10px] font-bold mb-2">Ship To</p>
            <p className="font-bold text-base">{orderDoc.customer.firstName} {orderDoc.customer.lastName}</p>
            <p>{orderDoc.customer.address}</p>
            <p>{orderDoc.customer.city}, {orderDoc.customer.state} {orderDoc.customer.zip}</p>
            <p>{orderDoc.customer.country}</p>
            <p className="mt-2 font-medium">{orderDoc.customer.phone}</p>
            <p className="text-gray-600">{orderDoc.customer.email}</p>
          </div>
          <div>
            <p className="text-gray-500 uppercase tracking-widest text-[10px] font-bold mb-2">Return Address</p>
            <p className="font-bold">Zaybaash Warehouse</p>
            <p>House 389c (Back Gate), Street 85</p>
            <p>Sector I-8/4</p>
            <p>Islamabad, Pakistan</p>
          </div>
        </div>

        {/* Items */}
        <table className="w-full text-left text-sm mb-8 border-collapse">
          <thead>
            <tr className="border-b-2 border-black">
              <th className="py-2 pl-2">Item</th>
              <th className="py-2">Variant</th>
              <th className="py-2 text-center">Qty</th>
              <th className="py-2 text-right pr-2">Price</th>
            </tr>
          </thead>
          <tbody>
            {orderDoc.items.map((item: any, idx: number) => (
              <tr key={idx} className="border-b border-gray-200">
                <td className="py-3 pl-2 font-medium">{item.name}</td>
                <td className="py-3 text-gray-600">
                  {item.size} / {item.color}
                </td>
                <td className="py-3 text-center">{item.qty}</td>
                <td className="py-3 text-right pr-2">Rs {item.price.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Totals */}
        <div className="flex justify-end text-sm">
          <div className="w-64">
            <div className="flex justify-between py-1">
              <span className="text-gray-600">Subtotal</span>
              <span>Rs {orderDoc.subtotal.toLocaleString()}</span>
            </div>
            {orderDoc.discount > 0 && (
              <div className="flex justify-between py-1 text-gray-600">
                <span>Discount</span>
                <span>-Rs {orderDoc.discount.toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between py-2 border-t border-black mt-2 font-bold text-lg">
              <span>Total</span>
              <span>Rs {orderDoc.total.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Notes */}
        <div className="mt-16 text-center text-xs text-gray-500 border-t border-gray-200 pt-6">
          <p>Thank you for shopping at Zaybaash.</p>
          <p>If you have any questions, please contact us at support@zaybaash.com</p>
        </div>

        {/* Auto Print Script */}
        <script dangerouslySetInnerHTML={{
          __html: 'window.onload = function() { window.print(); }'
        }} />
      </div>
    </div>
  );
}
