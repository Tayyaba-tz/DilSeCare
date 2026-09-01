interface LineItem {
  name: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}
 
export interface OrderEstimateCardProps {
  city: string;
  items: LineItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  currency: string;
  estimatedDelivery: string;
}
 
export default function OrderEstimateCard(props: OrderEstimateCardProps) {
  const { city, items, subtotal, deliveryFee, total, currency, estimatedDelivery } = props;
 
  return (
    <div className="bg-white rounded-card shadow p-4 my-2 border border-gray-100">
      <h3 className="font-bold text-primary mb-2">Order estimate — {city}</h3>
      <ul className="text-sm divide-y">
        {items.map((item, i) => (
          <li key={i} className="flex justify-between py-1">
            <span>{item.name} × {item.quantity}</span>
            <span>{item.lineTotal} {currency}</span>
          </li>
        ))}
      </ul>
      <div className="text-sm mt-2 pt-2 border-t space-y-1">
        <div className="flex justify-between"><span>Subtotal</span><span>{subtotal} {currency}</span></div>
        <div className="flex justify-between"><span>Delivery</span><span>{deliveryFee} {currency}</span></div>
        <div className="flex justify-between font-bold text-primary"><span>Total</span><span>{total} {currency}</span></div>
      </div>
      <p className="text-xs text-gray-500 mt-2">Estimated delivery: {estimatedDelivery}</p>
    </div>
  );
}