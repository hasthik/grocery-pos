"use client";
import { Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function Cart({
  cart,
  setCart,
  cartNumber,
  customerName,
}: {
  cart: Array<{
    id: number;
    name: string;
    price: number;
    weight: number;
    unitPrice: number;
    totalPrice: number;
    imageSrc: string;
    qtyType: string;
  }>;
  setCart: (cart: typeof cart) => void;
  cartNumber: number;
  customerName: string | null;
}) {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [amountReceived, setAmountReceived] = useState("");

  const removeItem = (id: number) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  // const subtotal = cart.reduce((sum, item) => sum + item.totalPrice, 0);

  const handlePaymentMethodChange = (method: string) => {
    setPaymentMethod(method);
  };
  const subtotal = cart.reduce((sum, item) => sum + (item.totalPrice || 0), 0);

  return (
    <div className="px-4 pb-4 h-[60vh] flex flex-col">
      <ScrollArea className="flex-1 overflow-auto px-4">
        {cart.map((item) => (
          <div key={item.id} className="flex items-center justify-between border-b pb-4 mb-4">
            <div className="flex items-center gap-4">
              <Image
                src={item.imageSrc}
                alt={item.name}
                width={50}
                height={50}
                className="rounded-md"
              />
              <div>
                <p className="font-medium">{item.name}</p>
                <p className="text-sm text-gray-500">Quantity: {item.weight || 0} kg</p>
                <p className="text-sm text-gray-500">Unit Price: ₹{item.unitPrice || 0}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <p className="font-bold">
                Total: ₹{item.totalPrice ? item.totalPrice.toFixed(2) : "0.00"}
              </p>
              <Button variant="destructive" onClick={() => removeItem(item.id)}>
                <Trash className="w-3 h-4" />
              </Button>
            </div>
          </div>
        ))}
      </ScrollArea>
  
      <div className="mt-4 p-4 sticky bottom-0">
        <div className="flex justify-between items-center font-bold text-lg mb-4">
          <span>Subtotal</span>
          <span>₹{subtotal.toFixed(2)}</span>
        </div>
  
        <Button className="w-full" onClick={() => setIsSheetOpen(true)}>
          Checkout
        </Button>
      </div>
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="max-w-lg">
          <SheetHeader>
            <SheetTitle>Checkout</SheetTitle>
          </SheetHeader>

          {/* Display Cart Number and Customer Name */}
          <div className="mt-4">
            <p className="text-sm font-semibold">Cart Number: {cartNumber}</p>
            <p className="text-sm font-semibold">Customer Name: {customerName || "Not selected"}</p>
          </div>

          <div className="mt-4">
            <p className="text-sm mb-4">Subtotal: ₹{subtotal.toFixed(2)}</p>

            <div className="mb-4">
              <p className="text-sm font-semibold mb-2">Select Payment Method:</p>
              <div className="flex gap-4">
                <Button
                  variant={paymentMethod === "cash" ? "default" : "outline"}
                  onClick={() => handlePaymentMethodChange("cash")}
                  className="w-1/3"
                >
                  Cash
                </Button>
                <Button
                  variant={paymentMethod === "googlepay" ? "default" : "outline"}
                  onClick={() => handlePaymentMethodChange("googlepay")}
                  className="w-1/3"
                >
                  UPI
                </Button>
                <Button
                  variant={paymentMethod === "credit" ? "default" : "outline"}
                  onClick={() => handlePaymentMethodChange("credit")}
                  className="w-1/3"
                >
                  Credit
                </Button>
              </div>
            </div>

            <div className="mb-6">
              <p className="text-sm font-semibold mb-2">Amount Received:</p>
              <Input
                type="number"
                placeholder="Enter amount received"
                value={amountReceived}
                onChange={(e) => setAmountReceived(e.target.value)}
                disabled={paymentMethod === "credit"}
              />
            </div>
          </div>

          <Button className="w-full" onClick={() => setIsSheetOpen(false)}>
            Complete Checkout
          </Button>
        </SheetContent>
      </Sheet>
    </div>
  );
}  