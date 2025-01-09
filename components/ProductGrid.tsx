"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Image from "next/image";

const products = [
  {
    id: 1,
    name: "Bell Pepper",
    price: 20,
    imageSrc: "https://m.media-amazon.com/images/I/41ywWsEeyWL._SY300_SX300_QL70_FMwebp_.jpg",
    imageAlt: "Fresh red bell pepper.",
    qtyType: "kg",
  },
  {
    id: 2,
    name: "Avocado",
    price: 15,
    imageSrc: "https://m.media-amazon.com/images/I/71cs5TNn-LL._SX679_.jpg",
    imageAlt: "Fresh ripe avocado.",
    qtyType: "kg",
  },
  {
    id: 3,
    name: "Orange",
    price: 30,
    imageSrc: "https://m.media-amazon.com/images/I/31vcKZnUpzL._SX300_SY300_QL70_FMwebp_.jpg",
    imageAlt: "Fresh oranges.",
    qtyType: "kg",
  },
  {
    id: 4,
    name: "Onion",
    price: 25,
    imageSrc: "https://m.media-amazon.com/images/I/41lAEExTwBL._SX300_SY300_QL70_FMwebp_.jpg",
    imageAlt: "Fresh onion.",
    qtyType: "kg",
  },
  {
    id: 5,
    name: "Mango",
    price: 10,
    imageSrc: "https://m.media-amazon.com/images/I/51DOzqxj-VL._AC_UL640_FMwebp_QL65_.jpg",
    imageAlt: "Fresh ripe mango.",
    qtyType: "kg",
  },
  {
    id: 6,
    name: "Pear",
    price: 50,
    imageSrc: "https://m.media-amazon.com/images/I/41YYLKLwOFL._AC_UL640_FMwebp_QL65_.jpg",
    imageAlt: "Fresh yellow pear.",
    qtyType: "kg",
  },
  {
    id: 7,
    name: "Potato",
    price: 60,
    imageSrc: "https://m.media-amazon.com/images/I/31WtrNh0M8L._SX300_SY300_QL70_FMwebp_.jpg",
    imageAlt: "Fresh potato.",
    qtyType: "kg",
  },
  {
    id: 8,
    name: "Tomato",
    price: 60,
    imageSrc: "https://m.media-amazon.com/images/I/41av+vz+ppL._SX679_.jpg",
    imageAlt: "Fresh tomatoes in a basket.",
    qtyType: "kg",
  },
  {
    id: 9,
    name: "Milk",
    price: 50,
    imageSrc: "https://m.media-amazon.com/images/I/812816L+HkL._SX679_.jpg",
    imageAlt: "Fresh milk bottle.",
    qtyType: "No",
  },
];
export default function ProductGrid({
  onProductSelect,
  onAddToCart,
  weight,
  unitPrice,
}: {
  onProductSelect: (price: number) => void;
  onAddToCart: (product: any) => void;
  weight: number | "";
  unitPrice: number | "";
}) {
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [quantity, setQuantity] = useState<number>(1);
  const [customPrice, setCustomPrice] = useState<number>(0);
  const [popupProduct, setPopupProduct] = useState<any | null>(null);

  const handleAddToCart = (product: any) => {
    if (product.qtyType === "No") {
      setPopupProduct(product);
      setCustomPrice(product.price); // Set the price input with the product price
      setShowDialog(true);
    } else if (product.qtyType === "kg") {
      if (!weight || !unitPrice) {
        alert("Please enter weight and unit price on the Home page.");
        return;
      }
      onAddToCart({
        ...product,
        weight: quantity, // Use weight as quantity for "kg"
        unitPrice,
        totalPrice: weight * unitPrice,
      });
    } else {
      onAddToCart({ ...product, quantity: 1, price: product.price });
    }
  };
  

  const handleConfirm = () => {
    if (popupProduct) {
      onAddToCart({
        ...popupProduct,
        weight: quantity, // Use the quantity entered in the dialog
        unitPrice: customPrice || popupProduct.price,
        totalPrice: (customPrice || popupProduct.price) * quantity, // Calculate total price using dialog input
      });
      setShowDialog(false);
      setQuantity(1); // Reset quantity
      setCustomPrice(0); // Reset custom price
      setPopupProduct(null); // Clear popup product
    }
  };
  

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 p-4">
        {products.map((product) => (
          <Card
            key={product.id}
            className={`relative cursor-pointer transition-all duration-200 border-2 border-transparent rounded-lg ${
              selectedProductId === product.id ? "border-black" : ""
            } hover:border-black`}
            onClick={() => {
              if (selectedProductId !== product.id) {
                setSelectedProductId(product.id);
                onProductSelect(product.price);
              }
            }}
          >
            <CardHeader className="flex items-center justify-center">
              <div className="w-full aspect-square relative">
                <Image
                  src={product.imageSrc}
                  alt={product.imageAlt}
                  fill
                  className="object-cover rounded-md"
                />
              </div>
            </CardHeader>
            <CardContent className="text-center">
              <CardTitle className="mb-2">{product.name}</CardTitle>
              {selectedProductId !== product.id && (
                <p className="text-lg">₹{product.price}</p>
              )}
            </CardContent>
            {selectedProductId === product.id && (
              <div className="absolute bottom-4 left-0 w-full px-4">
                <Button className="w-full" onClick={() => handleAddToCart(product)}>
                  Add
                </Button>
              </div>
            )}
          </Card>
        ))}
      </div>
      {popupProduct && (
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Specify Quantity and Price</DialogTitle>
              <DialogDescription>
                Please enter the quantity and optionally a custom price for {popupProduct.name}.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="block mb-1">Quantity:</label>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="border p-2 w-full"
                />
              </div>
              <div>
                <label className="block mb-1">Price (optional):</label>
                <input
                  type="number"
                  value={customPrice}
                  onChange={(e) => setCustomPrice(Number(e.target.value))}
                  className="border p-2 w-full"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="secondary" onClick={() => setShowDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleConfirm}>Confirm</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}


