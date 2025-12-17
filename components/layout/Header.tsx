"use client"
import { Input } from "@/components/ui/input";
import { ButtonGroup } from "@/components/ui/button-group";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { AppLogo, BellIcon, GripIcon, HeaderSearchIcon, VoiceSearchIcon } from "../dashboard/SVGs";
import { mockUsers } from "@/data/mockStorageData";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { UserDropdown } from "./UserDropdown";
import { User } from "@/types/storage";

export function Header() {
    const [users, setUsers] = useState<User[]>([])
    const [currentUser, setCurrentUser] = useState<User>()
    const router = useRouter()

    useEffect(() => {
        // Get user and workspace from localStorage
        const storedUser = localStorage.getItem("currentUser")
        setUsers(mockUsers)
        if (storedUser) {
            setCurrentUser(JSON.parse(storedUser))
        }
    }, [])

    const handleSignOut = () => {
        localStorage.removeItem("currentUser")
        localStorage.removeItem("currentWorkspace")
        router.push("/login")
    }

    const handleProfileSettings = () => {
        router.push("/user/profile")
    }

    const handleUserSelect = (user: User) => {
        setCurrentUser(user)
        localStorage.setItem("currentUser", JSON.stringify(user))
        console.log(`User switched to: ${user.name || user.email}`)
        router.push("/")
    }

    if (!currentUser) {
        return null
    }

    return (
        <header className="fixed left-0 right-0 top-0 z-10 flex items-center justify-between w-full h-[38px] bg-background">
            <div className="flex items-center gap-4">
                <AppLogo/>
            </div>
            {/* Centered search bar */}
            <div className="absolute left-1/2 transform -translate-x-1/2">
                <ButtonGroup>
                    <Button variant="ghost" className="flex border-[1px] border-white/50 rounded-lg h-[27px] w-auto max-w-[364px] p-[8px] gap-[8px]">
                        <HeaderSearchIcon/>
                        <Input 
                            placeholder="Search ..." 
                            className="text-white border-0 hidden md:flex"
                        />
                        <VoiceSearchIcon/>
                    </Button>
                </ButtonGroup>
            </div>
            <div className="flex items-center text-white gap-[10px] mx-[16px]">
                <div className="flex flex-row items-center">
                    <Link 
                        href={"#notifications"}
                        className="hover:bg-white/10 rounded transition-colors p-1"
                    >
                        <BellIcon/>
                    </Link>
                    <Link 
                        href={"#notifications"}
                        className="hover:bg-white/10 rounded transition-colors p-1"
                    >
                        <GripIcon/>
                    </Link>
                </div>
                
                {/* Custom vertical separator */}
                <div className="w-px h-[28px] bg-white/30"></div>
                
                <div className="relative">
                    <UserDropdown 
                        user={users} 
                        trigger={currentUser} 
                        onUserSelect={handleUserSelect}  // Add this prop
                        onProfileSettings={handleProfileSettings} 
                        onSignOut={handleSignOut} 
                    />
                </div>
            </div>
        </header>
    );
}