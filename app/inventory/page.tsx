"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { ColumnDef } from "@tanstack/react-table";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// Your custom DataTable wrapper (TanStack Table + ShadCN styling)
import { DataTable } from "./data-table"; 

// ShadCN UI components
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
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
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

// ----------------------------------------------------------------
// Types and Mock Data
// ----------------------------------------------------------------
export type InventoryItem = {
  id: number;
  name: string;
  category: string;
  quantity: number;
  quantityType: "Kg" | "No.";
  pricePerUnit: number;
  totalValue: number;
  imageSrc: string;
};

async function getInventoryData(): Promise<InventoryItem[]> {
  // Mock data
  return [
    {
      id: 1,
      name: "Bell Pepper",
      category: "Vegetables",
      quantity: 50,
      quantityType: "No.",
      pricePerUnit: 20,
      totalValue: 1000,
      imageSrc:
        "https://m.media-amazon.com/images/I/41ywWsEeyWL._SY300_SX300_QL70_FMwebp_.jpg",
    },
    {
      id: 2,
      name: "Apple",
      category: "Fruits",
      quantity: 30,
      quantityType: "No.",
      pricePerUnit: 40,
      totalValue: 1200,
      imageSrc: "https://m.media-amazon.com/images/I/71cs5TNn-LL._SX679_.jpg",
    },
    {
      id: 3,
      name: "Rice",
      category: "Grains",
      quantity: 100,
      quantityType: "Kg",
      pricePerUnit: 50,
      totalValue: 5000,
      imageSrc: "https://via.placeholder.com/50",
    },
  ];
}

// ----------------------------------------------------------------
// Zod Schemas
// ----------------------------------------------------------------

// For creating a new item
const createItemSchema = z.object({
  file: z
    .any()
    .refine((file) => file?.[0], "File is required.")
    .refine(
      (file) => file?.[0]?.size <= 4 * 1024 * 1024,
      "File size must be less than 4MB."
    ),
  name: z.string().min(2, { message: "Product name must be at least 2 characters." }),
  category: z.string().nonempty({ message: "Category is required." }),
  quantity: z.number().min(1, { message: "Quantity must be greater than 0." }),
  quantityType: z.enum(["Kg", "No."]),
  pricePerUnit: z.number().min(0.01, { message: "Price must be greater than 0." }),
});

// ----------------------------------------------------------------
// Main Page
// ----------------------------------------------------------------
export default function InventoryPage() {
  // ------------------
  // Local State
  // ------------------
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [filteredInventory, setFilteredInventory] = useState<InventoryItem[]>([]);
  const [filters, setFilters] = useState({ name: "", category: "", minQuantity: "" });

  // For creating a new item
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // For pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Adjust as needed

  // ------------------
  // Inline Editing
  // ------------------
  const [isEditable, setIsEditable] = useState(false);

  // tempData = local copy to allow changes without mutating inventory in real-time
  const [tempData, setTempData] = useState<InventoryItem[]>([]);

  // When toggling to edit mode, copy current inventory into tempData
  const enableEditMode = () => {
    setTempData([...inventory]); // shallow copy is fine for simple data
    setIsEditable(true);
  };

  // Cancel changes (discard them) and exit edit mode
  const cancelEditMode = () => {
    setIsEditable(false);
    setTempData([]); // discard changes
  };

  // Save changes from tempData into inventory
  const saveAllChanges = () => {
    // Recalculate totalValue
    const updatedData = tempData.map((item) => ({
      ...item,
      totalValue: item.quantity * item.pricePerUnit,
    }));
    setInventory(updatedData);
    setFilteredInventory(updatedData);
    setIsEditable(false);
  };

  // Update quantity or price in tempData
  const handleInputChange = (
    rowIndex: number,
    field: "quantity" | "pricePerUnit",
    value: number
  ) => {
    setTempData((prev) => {
      const newData = [...prev];
      const item = { ...newData[rowIndex] };
      (item as any)[field] = value;
      newData[rowIndex] = item;
      return newData;
    });
  };

  // ------------------
  // Effects
  // ------------------
  useEffect(() => {
    const fetchInventory = async () => {
      const data = await getInventoryData();
      setInventory(data);
      setFilteredInventory(data);
    };
    fetchInventory();
  }, []);

  // Reset to page 1 whenever filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  useEffect(() => {
    const newFiltered = inventory.filter((item) => {
      const matchesName = item.name
        .toLowerCase()
        .includes(filters.name.toLowerCase());
      const matchesCategory =
        !filters.category || item.category === filters.category;
      const matchesMinQuantity =
        !filters.minQuantity || item.quantity >= parseInt(filters.minQuantity, 10);

      return matchesName && matchesCategory && matchesMinQuantity;
    });
    setFilteredInventory(newFiltered);
  }, [filters, inventory]);

  // ------------------
  // Pagination
  // ------------------
  const totalPages = Math.ceil(filteredInventory.length / itemsPerPage);
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  // For rendering only the current page's data
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = currentPage * itemsPerPage;
  const currentTableData = filteredInventory.slice(startIndex, endIndex);

  const onPageChange = (page: number) => setCurrentPage(page);

  // ------------------
  // Create Item Form
  // ------------------
  const createForm = useForm<z.infer<typeof createItemSchema>>({
    resolver: zodResolver(createItemSchema),
    defaultValues: {
      file: null,
      name: "",
      category: "",
      quantity: 0,
      quantityType: "Kg",
      pricePerUnit: 0,
    },
  });

  const onCreate = (values: z.infer<typeof createItemSchema>) => {
    const newItem: InventoryItem = {
      id: inventory.length + 1,
      name: values.name,
      category: values.category,
      quantity: values.quantity,
      quantityType: values.quantityType,
      pricePerUnit: values.pricePerUnit,
      totalValue: values.quantity * values.pricePerUnit,
      imageSrc: URL.createObjectURL(values.file[0]),
    };

    const updated = [...inventory, newItem];
    setInventory(updated);
    setFilteredInventory(updated);
    setIsDialogOpen(false);
  };

  // ------------------
  // Table Columns
  // ------------------
  const inventoryColumns: ColumnDef<InventoryItem>[] = [
    {
      accessorKey: "imageSrc",
      header: "",
      cell: ({ row }) => (
        <img
          src={row.original.imageSrc || "https://via.placeholder.com/50"}
          alt={row.original.name}
          className="w-10 h-10 object-cover rounded"
        />
      ),
    },
    {
      accessorKey: "name",
      header: "Item Name",
    },
    {
      accessorKey: "category",
      header: "Category",
    },
    {
      accessorKey: "quantity",
      header: "Quantity",
      cell: ({ row }) => {
        const rowIndex = row.index + startIndex; 
        // row.index is the index within currentTableData, so offset by startIndex to match tempData indices
        const item = isEditable ? tempData[rowIndex] : row.original;

        if (isEditable) {
          return (
            <Input
              type="number"
              value={item?.quantity ?? 0}
              onChange={(e) =>
                handleInputChange(rowIndex, "quantity", Number(e.target.value))
              }
              className="w-20"
            />
          );
        }
        return item.quantity;
      },
    },
    {
      accessorKey: "quantityType",
      header: "Quantity Type",
    },
    {
      accessorKey: "pricePerUnit",
      header: "Price Per Unit",
      cell: ({ row }) => {
        const rowIndex = row.index + startIndex;
        const item = isEditable ? tempData[rowIndex] : row.original;

        if (isEditable) {
          return (
            <Input
              type="number"
              value={item?.pricePerUnit ?? 0}
              onChange={(e) =>
                handleInputChange(rowIndex, "pricePerUnit", Number(e.target.value))
              }
              className="w-20"
            />
          );
        }
        return `₹${item.pricePerUnit}`;
      },
    },
    {
      accessorKey: "totalValue",
      header: "Total Value",
      cell: ({ row }) => `₹${row.original.totalValue}`,
    },
  ];

  // ------------------
  // Render
  // ------------------
  return (
    <div className="container mx-auto py-10">
      <h2 className="text-xl font-bold mb-4">Inventory Management</h2>

      {/* Filters */}
      <div className="mb-4 grid grid-cols-3 gap-4">
        <Input
          placeholder="Search by name"
          value={filters.name}
          onChange={(e) => setFilters({ ...filters, name: e.target.value })}
        />
        <Select
          value={filters.category || "all"}
          onValueChange={(value) =>
            setFilters({ ...filters, category: value === "all" ? "" : value })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="Vegetables">Vegetables</SelectItem>
            <SelectItem value="Fruits">Fruits</SelectItem>
            <SelectItem value="Grains">Grains</SelectItem>
          </SelectContent>
        </Select>
        <Input
          type="number"
          placeholder="Enter minimum quantity"
          value={filters.minQuantity}
          onChange={(e) => setFilters({ ...filters, minQuantity: e.target.value })}
        />
      </div>

      {/* Data Table */}
      <DataTable columns={inventoryColumns} data={currentTableData} />

      {/* Pagination */}
      <div className="mt-4 flex justify-center">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                disabled={currentPage === 1}
                onClick={() => onPageChange(currentPage - 1)}
              />
            </PaginationItem>

            {currentPage > 3 && (
              <>
                <PaginationItem>
                  <PaginationLink onClick={() => onPageChange(1)}>
                    1
                  </PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              </>
            )}

            {pages
              .filter((page) => {
                const windowSize = 2;
                return page >= currentPage - windowSize && page <= currentPage + windowSize;
              })
              .map((page) => (
                <PaginationItem key={page}>
                  <PaginationLink
                    onClick={() => onPageChange(page)}
                    isActive={currentPage === page}
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ))}

            {currentPage < totalPages - 2 && (
              <>
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink onClick={() => onPageChange(totalPages)}>
                    {totalPages}
                  </PaginationLink>
                </PaginationItem>
              </>
            )}

            <PaginationItem>
              <PaginationNext
                disabled={currentPage === totalPages}
                onClick={() => onPageChange(currentPage + 1)}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>

      {/* Buttons: Edit Mode / Save / Cancel / Add New */}
      <div className="flex items-center gap-2 justify-end mt-8">
        {!isEditable && (
          <Button variant="outline" onClick={enableEditMode}>
            Edit Table
          </Button>
        )}
        {isEditable && (
          <>
            <Button variant="outline" onClick={saveAllChanges}>
              Save All
            </Button>
            <Button variant="secondary" onClick={cancelEditMode}>
              Cancel
            </Button>
          </>
        )}

        {/* Add New Product */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>Add New Product</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>Add New Product</DialogHeader>
            <Form {...createForm}>
              <form onSubmit={createForm.handleSubmit(onCreate)} className="space-y-4">
                <Card>
                  <CardContent className="p-6 space-y-4">
                    <Label>Upload Image</Label>
                    <Input
                      type="file"
                      accept="image/*"
                      {...createForm.register("file")}
                    />
                  </CardContent>
                </Card>

                <Input {...createForm.register("name")} placeholder="Product Name" />

                <Select
                  value={createForm.getValues("category")}
                  onValueChange={(val) => createForm.setValue("category", val)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Vegetables">Vegetables</SelectItem>
                    <SelectItem value="Fruits">Fruits</SelectItem>
                    <SelectItem value="Grains">Grains</SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  value={createForm.getValues("quantityType")}
                  onValueChange={(val) => createForm.setValue("quantityType", val as any)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Quantity Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Kg">Kg</SelectItem>
                    <SelectItem value="No.">No.</SelectItem>
                  </SelectContent>
                </Select>

                <Input
                  type="number"
                  {...createForm.register("quantity", { valueAsNumber: true })}
                  placeholder="Quantity"
                />

                <Input
                  type="number"
                  {...createForm.register("pricePerUnit", { valueAsNumber: true })}
                  placeholder="Price Per Unit"
                />

                <DialogFooter>
                  <Button type="submit">Add Product</Button>
                  <DialogClose asChild>
                    <Button variant="secondary">Cancel</Button>
                  </DialogClose>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
