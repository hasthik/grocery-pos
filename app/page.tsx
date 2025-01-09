"use client";
import axios from "axios";

import ProductGrid from "@/components/ProductGrid";
import Cart from "@/components/Cart";
import { Input } from "@/components/ui/input-mod";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { X } from "lucide-react";
import { useState, useEffect } from "react";
import CustomerDropdown from "@/components/ui/customer-dropdown";

type Customer = {
  id: number;
  name: string;
};

export default function Home() {
  const [tabs, setTabs] = useState([{ id: 1, name: "Cart 1" }]);
  const [activeTab, setActiveTab] = useState(1);
  const [carts, setCarts] = useState<{ [key: number]: any[] }>({ 1: [] });
  const [selectedCustomers, setSelectedCustomers] = useState<{ [key: number]: Customer | null }>({ 1: null });
  const [allCustomers, setAllCustomers] = useState<Customer[]>([
    { id: 1, name: "John Doe" },
    { id: 2, name: "Jane Smith" },
  ]); // Global customer list
  const [unitPrice, setUnitPrice] = useState<number | "">("");
  const [weight, setWeight] = useState<number | "">("");
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newCustomerName, setNewCustomerName] = useState("");

  // Add a new tab
  const addNewTab = () => {
    const newTabId = tabs.length + 1;
    setTabs([...tabs, { id: newTabId, name: `Cart ${newTabId}` }]);
    setCarts({ ...carts, [newTabId]: [] });
    setSelectedCustomers({ ...selectedCustomers, [newTabId]: null });
    setActiveTab(newTabId);
  };

  // Remove a tab
  const removeTab = (id: number) => {
    const updatedTabs = tabs.filter((tab) => tab.id !== id);
    setTabs(updatedTabs);

    const { [id]: removedCart, ...remainingCarts } = carts;
    setCarts(remainingCarts);

    const { [id]: removedCustomer, ...remainingCustomers } = selectedCustomers;
    setSelectedCustomers(remainingCustomers);

    if (activeTab === id && updatedTabs.length > 0) {
      setActiveTab(updatedTabs[0].id);
    } else if (updatedTabs.length === 0) {
      setActiveTab(0);
    }
  };

  // Handle product selection
  const handleProductSelection = (price: number) => {
    setUnitPrice(price);
  };

  // Add product to the active tab's cart
  const addToCart = (product: any) => {
    // if (product.qtyType === "No" && (!product.quantity || !product.unitPrice)) {
    //   alert("Please provide quantity and unit price for the product.");
    //   return;
    // }

    const updatedProduct = {
      ...product,
      weight: product.qtyType === "kg" ? weight : product.weight || 1, // Use `weight` from Home for "kg"
      unitPrice: product.qtyType === "kg" ? unitPrice : product.unitPrice || product.price, // Use `unitPrice` from Home for "kg"
      totalPrice:
        product.qtyType === "kg"
          ? weight * unitPrice
          : (product.unitPrice || product.price) * (product.weight || 1),
    };

    setCarts({
      ...carts,
      [activeTab]: [...(carts[activeTab] || []), updatedProduct],
    });
  };



  // Handle customer selection
  const handleSelectCustomer = (tabId: number, customer: Customer) => {
    setSelectedCustomers({ ...selectedCustomers, [tabId]: customer });
  };

  // Add a new customer
  const handleAddCustomer = () => {
    if (newCustomerName.trim()) {
      const newCustomer = { id: Date.now(), name: newCustomerName };
      setAllCustomers([...allCustomers, newCustomer]);
      setNewCustomerName("");
      setIsDialogOpen(false);
    }
  };

  // Fetch weight data from API
  useEffect(() => {
    const fetchWeight = async () => {
      try {
        const response = await axios.get("http://localhost:4000/api/weight");
        setWeight(response.data.weight);
      } catch (error) {
        console.error("Error fetching weight data:", error);
      }
    };

    const interval = setInterval(fetchWeight, 10000);
    return () => clearInterval(interval);
  }, []);

  // Update total price
  useEffect(() => {
    if (unitPrice !== "" && weight !== "") {
      const calculatedTotalPrice = (+unitPrice * +weight).toFixed(2);
      setTotalPrice(parseFloat(calculatedTotalPrice));
    } else {
      setTotalPrice(0);
    }
  }, [unitPrice, weight]);

  return (
    <div className="flex h-min">
      <div className="flex-1 md:w-2/3 border-r flex flex-col">
        <div className="flex gap-4 mb-4 p-4">
          <div className="flex flex-col flex-1">
            <label className="text-right mb-1 mr-4">Weight</label>
            <Input
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value ? parseFloat(e.target.value) : "")}
              placeholder="Enter weight"
              className="text-right"
              readOnly
            />
          </div>
          <div className="flex flex-col flex-1">
            <label className="text-right mb-1 mr-4">Unit Price</label>
            <Input
              type="number"
              value={typeof unitPrice === "number" ? unitPrice.toFixed(2) : ""}
              onChange={(e) => setUnitPrice(e.target.value ? parseFloat(e.target.value) : "")}
              placeholder="Enter unit price"
              className="text-right"
            />
          </div>
          <div className="flex flex-col flex-1">
            <label className="text-right mb-1 mr-4">Total Price</label>
            <Input
              type="text"
              value={totalPrice}
              readOnly
              placeholder="Total price"
              className="text-right"
            />
          </div>
        </div>

        <ScrollArea className="flex-1 overflow-auto p-4">
          <ProductGrid
            onProductSelect={handleProductSelection}
            onAddToCart={(product) => addToCart(product)}
            weight={weight}
            unitPrice={unitPrice}
          />

        </ScrollArea>
      </div>

      <div className="w-1/3 flex flex-col h-full">
        <Tabs defaultValue={`tab-${activeTab}`} value={`tab-${activeTab}`} className="flex-1 flex flex-col">
          <div className="p-4">
            <div className="overflow-x-auto">
              <TabsList className="w-full inline-flex gap-2 whitespace-nowrap">
                {tabs.map((tab) => (
                  <div key={tab.id} className="relative flex items-center gap-1">
                    <TabsTrigger
                      value={`tab-${tab.id}`}
                      onClick={() => setActiveTab(tab.id)}
                      className="flex items-center gap-1 p-2 pl-4"
                    >
                      {tab.name}
                      {activeTab === tab.id && (
                        <div
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeTab(tab.id);
                        }}
                      >
                        <X className="size-4 text-red-500" />

                      </div>
                      )}
                    </TabsTrigger>
                  </div>
                ))}
                {tabs.length < 5 && (
                  <Button variant="outline" size="icon" onClick={addNewTab} className="ml-2 p-2">
                    +
                  </Button>
                )}
              </TabsList>
            </div>
          </div>

          <Separator />
          <ScrollArea className="flex-1 overflow-auto">
            {tabs.map((tab) => (
              <TabsContent key={tab.id} value={`tab-${tab.id}`}>
                <div className="flex items-center gap-4 p-4">
                  <CustomerDropdown
                    selectedCustomer={selectedCustomers[tab.id] || null}
                    onSelectCustomer={(customer) => handleSelectCustomer(tab.id, customer)}
                  />
                  <Button variant='outline' onClick={() => setIsDialogOpen(true)}>
                    Add Customer
                  </Button>
                </div>
                <Cart
                  cart={carts[tab.id] || []}
                  setCart={(updatedCart) => setCarts({ ...carts, [tab.id]: updatedCart })}
                  cartNumber={tab.id}
                  customerName={selectedCustomers[tab.id]?.name || null}
                />
              </TabsContent>
            ))}
          </ScrollArea>
        </Tabs>
      </div>

      {/* Add New Customer Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Customer</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <label className="block text-sm font-medium mb-2">Customer Name</label>
            <input
              type="text"
              className="w-full border rounded-md p-2"
              placeholder="Enter customer name"
              value={newCustomerName}
              onChange={(e) => setNewCustomerName(e.target.value)}
            />
          </div>
          <div className="mt-4 flex justify-end gap-4">
            <Button variant="ghost" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddCustomer}>Add Customer</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
