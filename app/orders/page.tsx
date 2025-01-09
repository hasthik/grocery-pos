"use client";

import { useEffect, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "./data-table";

// ShadCN UI imports
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";

// --------------------------------------------------
// Types
// --------------------------------------------------
export type Invoice = {
  orderId: string;
  customerName: string;
  totalAmount: number;
  paidAmount: number;
  status: string;
  balance: number;
  paymentType: string;
  createdAt: string;
  modifiedAt: string;
};

export type CartItem = {
  id: number;
  name: string;
  price: number;
  weight?: number;
  unitPrice: number;
  totalPrice: number;
  imageSrc: string;
  qtyType: string;
  quantity: number;
};

// --------------------------------------------------
// Mock Data Fetchers
// --------------------------------------------------
async function getInvoiceData(): Promise<Invoice[]> {
  return [
    {
      orderId: "INV12345",
      customerName: "John Doe",
      totalAmount: 1500,
      paidAmount: 1000,
      status: "Partially Paid",
      balance: 500,
      paymentType: "UPI",
      createdAt: "2025-01-02 09:00 AM",
      modifiedAt: "2025-01-03 10:00 AM",
    },
    {
      orderId: "INV12346",
      customerName: "Jane Smith",
      totalAmount: 2000,
      paidAmount: 2000,
      status: "Paid",
      balance: 0,
      paymentType: "Cash",
      createdAt: "2025-01-04 10:30 AM",
      modifiedAt: "2025-01-03 11:00 AM",
    },
    {
      orderId: "INV12346",
      customerName: "Jane Smith",
      totalAmount: 2000,
      paidAmount: 2000,
      status: "Paid",
      balance: 0,
      paymentType: "Cash",
      createdAt: "2025-01-04 10:30 AM",
      modifiedAt: "2025-01-03 11:00 AM",
    },
    {
      orderId: "INV12346",
      customerName: "Jane Smith",
      totalAmount: 2000,
      paidAmount: 2000,
      status: "Paid",
      balance: 0,
      paymentType: "Cash",
      createdAt: "2025-01-04 10:30 AM",
      modifiedAt: "2025-01-03 11:00 AM",
    }
  ];
}

async function getCartItems(orderId: string): Promise<CartItem[]> {
  const products = {
    INV12345: [
      {
        id: 1,
        name: "Bell Pepper",
        price: 20,
        imageSrc:
          "https://m.media-amazon.com/images/I/41ywWsEeyWL._SY300_SX300_QL70_FMwebp_.jpg",
        qtyType: "kg",
        quantity: 2,
      },
      {
        id: 2,
        name: "Avocado",
        price: 15,
        imageSrc:
          "https://m.media-amazon.com/images/I/71cs5TNn-LL._SX679_.jpg",
        qtyType: "kg",
        quantity: 3,
      },
    ],
    INV12346: [
      {
        id: 3,
        name: "Orange",
        price: 30,
        imageSrc:
          "https://m.media-amazon.com/images/I/31vcKZnUpzL._SX300_SY300_QL70_FMwebp_.jpg",
        qtyType: "kg",
        quantity: 5,
      },
      {
        id: 4,
        name: "Onion",
        price: 25,
        imageSrc:
          "https://m.media-amazon.com/images/I/41lAEExTwBL._SX300_SY300_QL70_FMwebp_.jpg",
        qtyType: "kg",
        quantity: 4,
      },
    ],
  };

  const items = products[orderId] || [];
  return items.map((product) => ({
    ...product,
    unitPrice: product.price,
    totalPrice: product.price * product.quantity,
  }));
}

// --------------------------------------------------
// Main DemoPage Component
// --------------------------------------------------
export default function DemoPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [filteredInvoices, setFilteredInvoices] = useState<Invoice[]>([]);

  // Pagination state for the invoice table
  const [invoicePage, setInvoicePage] = useState(1);
  const itemsPerPage = 5; // Items per page in the invoice table

  // Order details / cart items
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editedCartItems, setEditedCartItems] = useState<CartItem[]>([]);

  // Filters
  const [filters, setFilters] = useState({
    customerName: "",
    startDate: "",
    endDate: "",
    status: "",
    paymentType: "",
  });

  // ---------------------------
  // Data Fetching
  // ---------------------------
  useEffect(() => {
    const fetchInvoices = async () => {
      const data = await getInvoiceData();
      setInvoices(data);
      setFilteredInvoices(data);
    };
    fetchInvoices();
  }, []);

  // ---------------------------
  // Filtering
  // ---------------------------
  useEffect(() => {
    setInvoicePage(1); // Reset to first page on filters change
    const filterData = () => {
      setFilteredInvoices(
        invoices.filter((invoice) => {
          const matchesCustomerName = invoice.customerName
            .toLowerCase()
            .includes(filters.customerName.toLowerCase());
          const matchesStartDate =
            !filters.startDate ||
            new Date(invoice.createdAt) >= new Date(filters.startDate);
          const matchesEndDate =
            !filters.endDate ||
            new Date(invoice.createdAt) <= new Date(filters.endDate);
          const matchesStatus =
            !filters.status || invoice.status === filters.status;
          const matchesPaymentType =
            !filters.paymentType || invoice.paymentType === filters.paymentType;

          return (
            matchesCustomerName &&
            matchesStartDate &&
            matchesEndDate &&
            matchesStatus &&
            matchesPaymentType
          );
        })
      );
    };

    filterData();
  }, [filters, invoices]);

  // ---------------------------
  // Selecting an Invoice
  // ---------------------------
  const handleOrderClick = async (orderId: string) => {
    const items = await getCartItems(orderId);
    const invoice = invoices.find((inv) => inv.orderId === orderId);
    if (invoice) {
      setSelectedInvoice(invoice);
      setCartItems(items);
      setEditedCartItems(items);
    }
  };

  // ---------------------------
  // Editing Cart Items
  // ---------------------------
  const handleSaveChanges = () => {
    setCartItems(editedCartItems);
    setIsEditing(false);
  };

  const handleCancelChanges = () => {
    setEditedCartItems(cartItems);
    setIsEditing(false);
  };

  const handleEditField = (id: number, field: keyof CartItem, value: any) => {
    setEditedCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  // ---------------------------
  // Invoice Table Pagination
  // ---------------------------
  const totalInvoicePages = Math.ceil(filteredInvoices.length / itemsPerPage);
  // Calculate which invoices to display on the current page
  const startIndex = (invoicePage - 1) * itemsPerPage;
  const endIndex = invoicePage * itemsPerPage;
  const currentInvoiceData = filteredInvoices.slice(startIndex, endIndex);

  const handleInvoicePageChange = (page: number) => {
    setInvoicePage(page);
  };

  // ---------------------------
  // Columns
  // ---------------------------
  const invoiceColumns: ColumnDef<Invoice>[] = [
    {
      accessorKey: "orderId",
      header: "Order ID",
      cell: ({ row }) => (
        <Button variant="link" onClick={() => handleOrderClick(row.original.orderId)}>
          {row.original.orderId}
        </Button>
      ),
    },
    {
      accessorKey: "customerName",
      header: "Customer Name",
    },
    {
      accessorKey: "totalAmount",
      header: "Total Amount",
      cell: ({ row }) => `₹${row.original.totalAmount}`,
    },
    {
      accessorKey: "paidAmount",
      header: "Paid Amount",
      cell: ({ row }) => `₹${row.original.paidAmount}`,
    },
    {
      accessorKey: "balance",
      header: "Balance",
      cell: ({ row }) => `₹${row.original.balance}`,
    },
    {
      accessorKey: "status",
      header: "Status",
    },
    {
      accessorKey: "createdAt",
      header: "Created At",
    },
    {
      accessorKey: "modifiedAt",
      header: "Modified At",
    },
    {
      accessorKey: "paymentType",
      header: "Payment Type",
    },
  ];

  const orderColumns: ColumnDef<CartItem>[] = [
    {
      accessorKey: "imageSrc",
      header: "",
      cell: ({ row }) => (
        <img
          src={row.original.imageSrc}
          alt={row.original.name}
          className="w-10 h-10 object-cover"
        />
      ),
    },
    {
      accessorKey: "name",
      header: "Item Name",
      cell: ({ row }) => row.original.name,
    },
    {
      accessorKey: "quantity",
      header: "Quantity",
      cell: ({ row }) =>
        isEditing ? (
          <Input
            className="w-16"
            type="number"
            defaultValue={row.original.quantity}
            onChange={(e) =>
              handleEditField(row.original.id, "quantity", parseInt(e.target.value, 10))
            }
          />
        ) : (
          `${row.original.quantity} ${row.original.qtyType}`
        ),
    },
    {
      accessorKey: "unitPrice",
      header: "Unit Price",
      cell: ({ row }) =>
        isEditing ? (
          <Input
            type="number"
            className="w-16"
            defaultValue={row.original.unitPrice}
            onChange={(e) =>
              handleEditField(row.original.id, "unitPrice", parseFloat(e.target.value))
            }
          />
        ) : (
          `₹${row.original.unitPrice}`
        ),
    },
    {
      accessorKey: "totalPrice",
      header: "Total Price",
      cell: ({ row }) => `₹${row.original.unitPrice * row.original.quantity}`,
    },
  ];

  // ---------------------------
  // Render
  // ---------------------------
  return (
    <div className="container mx-auto py-10 flex gap-4">
      {/* ---------------- Invoice Table ---------------- */}
      <div className="w-2/3">
        <h2 className="text-xl font-bold mb-4">Invoice</h2>

        {/* Filters with Titles */}
        <div className="mb-4 grid grid-cols-5 gap-4">
          {/* Customer Name Filter */}
          <div className="flex flex-col">
            <label className="text-sm font-semibold mb-1" htmlFor="customerName">
              Customer Name
            </label>
            <Input
              id="customerName"
              placeholder="Customer Name"
              value={filters.customerName}
              onChange={(e) =>
                setFilters({ ...filters, customerName: e.target.value })
              }
            />
          </div>

          {/* Start Date Filter */}
          <div className="flex flex-col">
            <label className="text-sm font-semibold mb-1" htmlFor="startDate">
              Start Date
            </label>
            <Input
              id="startDate"
              type="date"
              value={filters.startDate}
              onChange={(e) =>
                setFilters({ ...filters, startDate: e.target.value })
              }
            />
          </div>

          {/* End Date Filter */}
          <div className="flex flex-col">
            <label className="text-sm font-semibold mb-1" htmlFor="endDate">
              End Date
            </label>
            <Input
              id="endDate"
              type="date"
              value={filters.endDate}
              onChange={(e) =>
                setFilters({ ...filters, endDate: e.target.value })
              }
            />
          </div>

          {/* Payment Type Filter */}
          <div className="flex flex-col">
            <label className="text-sm font-semibold mb-1">Payment Type</label>
            <Select
              value={filters.paymentType || "all"}
              onValueChange={(value) =>
                setFilters({
                  ...filters,
                  paymentType: value === "all" ? "" : value,
                })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Payment Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="Credit">Credit</SelectItem>
                <SelectItem value="UPI">UPI</SelectItem>
                <SelectItem value="Cash">Cash</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Status Filter */}
          <div className="flex flex-col">
            <label className="text-sm font-semibold mb-1">Status</label>
            <Select
              value={filters.status || "all"}
              onValueChange={(value) =>
                setFilters({ ...filters, status: value === "all" ? "" : value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="Paid">Paid</SelectItem>
                <SelectItem value="Partially Paid">Partially Paid</SelectItem>
                <SelectItem value="Unpaid">Unpaid</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Invoice Table + Pagination */}
        <DataTable columns={invoiceColumns} data={currentInvoiceData} />

        {/* Pagination for Invoice Table */}
        {totalInvoicePages > 1 && (
          <div className="mt-4 flex justify-center">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    disabled={invoicePage === 1}
                    onClick={() => handleInvoicePageChange(invoicePage - 1)}
                  />
                </PaginationItem>

                {invoicePage > 3 && (
                  <>
                    <PaginationItem>
                      <PaginationLink onClick={() => handleInvoicePageChange(1)}>
                        1
                      </PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationEllipsis />
                    </PaginationItem>
                  </>
                )}

                {Array.from({ length: totalInvoicePages }, (_, i) => i + 1)
                  .filter((page) => {
                    // Show a small window around the current page
                    const windowSize = 2;
                    return (
                      page >= invoicePage - windowSize && page <= invoicePage + windowSize
                    );
                  })
                  .map((page) => (
                    <PaginationItem key={page}>
                      <PaginationLink
                        onClick={() => handleInvoicePageChange(page)}
                        isActive={invoicePage === page}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  ))}

                {invoicePage < totalInvoicePages - 2 && (
                  <>
                    <PaginationItem>
                      <PaginationEllipsis />
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink
                        onClick={() => handleInvoicePageChange(totalInvoicePages)}
                      >
                        {totalInvoicePages}
                      </PaginationLink>
                    </PaginationItem>
                  </>
                )}

                <PaginationItem>
                  <PaginationNext
                    disabled={invoicePage === totalInvoicePages}
                    onClick={() => handleInvoicePageChange(invoicePage + 1)}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>

      {/* ---------------- Order Table ---------------- */}
      <div className="w-1/3">
        <h2 className="text-xl font-bold mb-4">Order</h2>

        {selectedInvoice && (
          <div className="mb-4 border p-4 rounded bg-gray-50">
            <p>
              <strong>Customer Name:</strong> {selectedInvoice.customerName}
            </p>
            <p>
              <strong>Order ID:</strong> {selectedInvoice.orderId}
            </p>
            <p>
              <strong>Created At:</strong> {selectedInvoice.createdAt}
            </p>
            <p>
              <strong>Modified At:</strong> {selectedInvoice.modifiedAt}
            </p>
          </div>
        )}

        <DataTable columns={orderColumns} data={editedCartItems} />

        {selectedInvoice && (
          <div className="mt-4 text-right font-bold">
            <p>Total Price: ₹{selectedInvoice.totalAmount}</p>
          </div>
        )}

        {isEditing ? (
          <div className="flex justify-end gap-4 mt-4">
            <Button onClick={handleSaveChanges} variant="primary">
              Save Changes
            </Button>
            <Button onClick={handleCancelChanges} variant="secondary">
              Cancel
            </Button>
          </div>
        ) : (
          <div className="flex justify-end mt-4">
            <Button onClick={() => setIsEditing(true)} variant="primary">
              Edit Order
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
