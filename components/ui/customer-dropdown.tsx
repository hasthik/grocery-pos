"use client";

import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

type Customer = {
  id: number;
  name: string;
};

type CustomerDropdownProps = {
  selectedCustomer: Customer | null;
  onSelectCustomer: (customer: Customer) => void;
};

const CustomerDropdown = ({ selectedCustomer, onSelectCustomer }: CustomerDropdownProps) => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    // Simulating an API call to fetch customers
    const fetchCustomers = async () => {
      const data: Customer[] = [
        { id: 1, name: "John Doe" },
        { id: 2, name: "Jane Smith" },
        { id: 3, name: "Alice Johnson" },
      ];
      setCustomers(data);
      setFilteredCustomers(data);
    };

    fetchCustomers();
  }, []);

  useEffect(() => {
    if (search) {
      setFilteredCustomers(
        customers.filter((customer) =>
          customer.name.toLowerCase().includes(search.toLowerCase())
        )
      );
    } else {
      setFilteredCustomers(customers);
    }
  }, [search, customers]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="w-full justify-between">
          {selectedCustomer ? selectedCustomer.name : "Select a customer"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-full min-w-[100%] p-2">
        <Input
          placeholder="Search customers"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="mb-2"
        />
        <div className="max-h-40 overflow-auto">
          {filteredCustomers.map((customer) => (
            <DropdownMenuItem
              key={customer.id}
              onClick={() => onSelectCustomer(customer)}
            >
              {customer.name}
            </DropdownMenuItem>
          ))}
          {filteredCustomers.length === 0 && (
            <div className="text-sm text-gray-500 text-center">No customers found</div>
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default CustomerDropdown;
