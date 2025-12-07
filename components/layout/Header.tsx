"use client"
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AudioLinesIcon, BellIcon, ChevronDownIcon, GripIcon, SearchIcon, LogOut } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { ButtonGroup } from "@/components/ui/button-group";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AppLogo } from "../dashboard/SVGs";
import { mockUsers, mockWorkspaces, getWorkspaceById } from "@/data/mockStorageData";
import { useRouter } from "next/navigation";

export function Header() {
    const [showNewDialog, setShowNewDialog] = useState(false)
    const [showShareDialog, setShowShareDialog] = useState(false)
    const [currentUser, setCurrentUser] = useState<typeof mockUsers[0] | null>(null)
    const [currentWorkspace, setCurrentWorkspace] = useState<ReturnType<typeof getWorkspaceById> | null>(null)
    const router = useRouter()

    useEffect(() => {
        // Get user and workspace from localStorage
        const storedUser = localStorage.getItem("currentUser")
        const storedWorkspaceId = localStorage.getItem("currentWorkspace")
        
        if (storedUser) {
            setCurrentUser(JSON.parse(storedUser))
        }
        
        if (storedWorkspaceId) {
            const workspace = getWorkspaceById(parseInt(storedWorkspaceId))
            setCurrentWorkspace(workspace)
        }
    }, [])

    const handleSignOut = () => {
        localStorage.removeItem("currentUser")
        localStorage.removeItem("currentWorkspace")
        router.push("/login")
    }

    const switchWorkspace = () => {
        localStorage.removeItem("currentWorkspace")
        router.refresh()
    }

    if (!currentUser) {
        return null // Or loading state
    }

    return (
        <>
        <header 
            className="fixed left-0 right-0 top-0 z-10 flex items-center justify-between w-full h-[38px] px-2 bg-background"
        >
            <div className="flex items-center gap-4">
                <AppLogo/>
            </div>
            
            <div className="relative">
                <ButtonGroup>
                    <Button variant="ghost" className="border-l border-t border-b">
                        <SearchIcon/>
                    </Button>
                    <Input placeholder="Search ..." />
                    <Button variant="outline">
                        <AudioLinesIcon/>
                    </Button>
                </ButtonGroup>
            </div>
            
            <div className="flex items-center justify-center">
                <div className="relative">
                    <Button variant="ghost">
                        <BellIcon/>
                    </Button>
                    <Button variant="ghost">
                        <GripIcon/>
                    </Button>
                </div>
                <Separator orientation="vertical"/>
                <div className="relative">
                    <DropdownMenu modal={false}>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="cursor-pointer">
                                <div className="w-auto flex items-center gap-2">
                                    <div className="flex flex-row flex-wrap items-center">
                                        <Avatar className="h-6 w-6">
                                            <AvatarFallback>
                                                {currentUser.name.split(' ').map(n => n[0]).join('')}
                                            </AvatarFallback>
                                        </Avatar>
                                    </div>
                                    <div className="relative flex flex-col items-start justify-start">
                                        <span className="text-sm font-bold">{currentUser.name}</span>
                                        <span className="text-xs">{currentUser.email}</span>
                                    </div>
                                    <ChevronDownIcon/>
                                </div>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-48" align="end">
                            <DropdownMenuLabel>My Account</DropdownMenuLabel>
                            <DropdownMenuGroup>
                                <DropdownMenuItem onSelect={() => setShowNewDialog(true)}>
                                    Profile Settings
                                </DropdownMenuItem>
                                <DropdownMenuItem onSelect={() => setShowShareDialog(true)}>
                                    Manage Workspaces
                                </DropdownMenuItem>
                            </DropdownMenuGroup>
                            <DropdownMenuSeparator />
                            <DropdownMenuLabel>File Actions</DropdownMenuLabel>
                            <DropdownMenuGroup>
                                <DropdownMenuItem onSelect={() => setShowNewDialog(true)}>
                                    New File...
                                </DropdownMenuItem>
                                <DropdownMenuItem onSelect={() => setShowShareDialog(true)}>
                                    Share...
                                </DropdownMenuItem>
                                <DropdownMenuItem disabled>Download</DropdownMenuItem>
                            </DropdownMenuGroup>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onSelect={handleSignOut} className="text-destructive">
                                <LogOut className="mr-2 h-4 w-4" />
                                Sign out
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    
                    <Dialog open={showNewDialog} onOpenChange={setShowNewDialog}>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>Create New File</DialogTitle>
                                <DialogDescription>
                                    Provide a name for your new file. Click create when you&apos;re done.
                                </DialogDescription>
                            </DialogHeader>
                            <FieldGroup className="pb-3">
                                <Field>
                                    <FieldLabel htmlFor="filename">File Name</FieldLabel>
                                    <Input id="filename" name="filename" placeholder="document.txt" />
                                </Field>
                            </FieldGroup>
                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button variant="outline">Cancel</Button>
                                </DialogClose>
                                <Button type="submit">Create</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                    
                    <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>Share File</DialogTitle>
                                <DialogDescription>
                                    Anyone with the link will be able to view this file.
                                </DialogDescription>
                            </DialogHeader>
                            <FieldGroup className="">
                                <Field>
                                    <Label htmlFor="email">Email Address</Label>
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        placeholder="shadcn@vercel.com"
                                        autoComplete="off"
                                    />
                                </Field>
                                <Field>
                                    <FieldLabel htmlFor="message">Message (Optional)</FieldLabel>
                                    <Textarea
                                        id="message"
                                        name="message"
                                        placeholder="Check out this file"
                                    />
                                </Field>
                            </FieldGroup>
                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button variant="outline">Cancel</Button>
                                </DialogClose>
                                <Button type="submit">Send Invite</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
        </header>
        </>
    );
}