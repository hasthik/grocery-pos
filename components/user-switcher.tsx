"use client";

import * as React from "react";
import { ChevronsUpDown, Plus, User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

interface UserType {
  name: string;
  role: string;
}

export function UserSwitcher({ users }: { users: UserType[] }) {
  const { isMobile } = useSidebar();
  const [activeUser, setActiveUser] = React.useState<UserType>(users[0]);
  const [newUserName, setNewUserName] = React.useState("");
  const [newUserRole, setNewUserRole] = React.useState("");
  const [dialogOpen, setDialogOpen] = React.useState(false);

  const handleAddUser = () => {
    if (newUserName.trim() && newUserRole.trim()) {
      const newUser = { name: newUserName, role: newUserRole };
      users.push(newUser);
      setActiveUser(newUser);
      setNewUserName("");
      setNewUserRole("");
      setDialogOpen(false);
    }
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <User className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{activeUser.name}</span>
                <span className="truncate text-xs">{activeUser.role}</span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-xs text-muted-foreground">Users</DropdownMenuLabel>
            {users.map((user) => (
              <DropdownMenuItem
                key={user.name}
                onClick={() => setActiveUser(user)}
                className="gap-2 p-2 cursor-pointer"
              >
                <div className="flex size-6 items-center justify-center rounded-md bg-background">
                  <User className="size-4" />
                </div>
                <div>
                  <span className="font-medium">{user.name}</span>
                  <div className="text-xs text-muted-foreground">{user.role}</div>
                </div>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <DropdownMenuItem
                  className="gap-2 p-2 cursor-pointer"
                  onSelect={(e) => {
                    e.preventDefault(); // Prevent dropdown from closing
                    setDialogOpen(true);
                  }}
                >
                  <div className="flex size-6 items-center justify-center rounded-md bg-background">
                    <Plus className="size-4" />
                  </div>
                  <div className="font-medium text-muted-foreground">Add User</div>
                </DropdownMenuItem>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add a New User</DialogTitle>
                </DialogHeader>
                <Input
                  type="text"
                  placeholder="Enter user name"
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  className="mb-4"
                />
                <Input
                  type="text"
                  placeholder="Enter user role"
                  value={newUserRole}
                  onChange={(e) => setNewUserRole(e.target.value)}
                />
                <DialogFooter>
                  <Button onClick={handleAddUser}>Add User</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
