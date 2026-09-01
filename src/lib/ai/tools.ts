import { tool } from "ai";
import { z } from "zod";
 
// Flat mock price list — swap for a real price source later.
const UNIT_PRICES: Record<string, number> = {
  rice: 320,      // per kg, PKR
  "cooking oil": 650, // per litre
  eggs: 20,       // per egg
  flour: 180,     // per kg
  milk: 250,      // per litre
};
const DEFAULT_UNIT_PRICE = 150;
 
const DELIVERY_FEE_BY_CITY: Record<string, number> = {
  lahore: 150,
  karachi: 180,
  islamabad: 150,
};
const DEFAULT_DELIVERY_FEE = 200;
 
export const estimateOrder = tool({
  description:
    "Estimate the cost of a grocery order for delivery to a city in Pakistan.",
  inputSchema: z.object({
    items: z
      .array(
        z.object({
          name: z.string().describe("Grocery item name, e.g. rice, eggs"),
          quantity: z
            .number()
            .min(1)
            .describe("How many units/kg/litres of this item"),
        })
      )
      .describe("The list of grocery items the user wants estimated"),
    city: z
      .string()
      .describe("City in Pakistan for delivery, e.g. Lahore, Karachi"),
  }),
  execute: async ({ items, city }) => {
    const lineItems = items.map((item) => {
      const unitPrice =
        UNIT_PRICES[item.name.toLowerCase()] ?? DEFAULT_UNIT_PRICE;
      return {
        name: item.name,
        quantity: item.quantity,
        unitPrice,
        lineTotal: unitPrice * item.quantity,
      };
    });
 
    const subtotal = lineItems.reduce((sum, i) => sum + i.lineTotal, 0);
    const deliveryFee =
      DELIVERY_FEE_BY_CITY[city.toLowerCase()] ?? DEFAULT_DELIVERY_FEE;
 
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 2);
 
    return {
      city,
      items: lineItems,
      subtotal,
      deliveryFee,
      total: subtotal + deliveryFee,
      currency: "PKR",
      estimatedDelivery: deliveryDate.toDateString(),
    };
  },
});