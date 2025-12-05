"use client"
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AudioLinesIcon, BellIcon, ChevronDownIcon, GripIcon, SearchIcon } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { ButtonGroup } from "@/components/ui/button-group";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AppLogo } from "../dashboard/SVGs";

export function Header() {
    const [showNewDialog, setShowNewDialog] = useState(false)
    const [showShareDialog, setShowShareDialog] = useState(false)
    return (
        <>
        <header 
            className="sticky top-0 z-10 flex items-center justify-between w-full h-[38px] px-2"
            //style={{ background: 'linear-gradient(89.94deg, #111953 0.09%, #4157FE 100.9%)' }}
        >
            <AppLogo/>
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
                                            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                                            <AvatarFallback>CN</AvatarFallback>
                                        </Avatar>
                                    </div>
                                    <div className="relative flex flex-col items-start justify-start">
                                        <span className="text-sm font-bold">John Doe</span>
                                        <span className="text-xs">john@kazentic.com</span>
                                    </div>
                                    <ChevronDownIcon/>
                                </div>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-40" align="end">
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
                            <FieldGroup className="py-3">
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