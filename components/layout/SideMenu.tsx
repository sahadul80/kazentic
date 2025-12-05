"use client"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { PlusIcon, Settings2, Bug, HelpCircle } from "lucide-react"

export function SideMenu() {
  return (
    <aside className="fixed top-[38px] w-[38px] h-[calc(100vh-38px)] flex flex-col justify-between items-center">
      {/* TOP PART */}
      <div className="flex flex-col items-center">

        {/* C */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Avatar className="w-full h-auto cursor-pointer">
                <AvatarFallback>C</AvatarFallback>
              </Avatar>
            </TooltipTrigger>
            <TooltipContent side="right"><p>Item C</p></TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* + */}
        <Button size="icon" variant="ghost" className="h-6 w-6">
          <PlusIcon className="h-4 w-4" />
        </Button>

        <Separator className="w-8" />

        {/* D & L group */}
        <Avatar className="h-8 w-8 cursor-pointer">
          <AvatarFallback>D</AvatarFallback>
        </Avatar>

        <Avatar className="h-8 w-8 cursor-pointer">
          <AvatarFallback>L</AvatarFallback>
        </Avatar>

        <Separator className="w-8" />

        <Button size="icon" variant="ghost" className="h-6 w-6">
          <PlusIcon className="h-4 w-4" />
        </Button>

        <Separator className="w-8" />

        <Button size="icon" variant="ghost" className="h-6 w-6">
          <PlusIcon className="h-4 w-4" />
        </Button>
      </div>

      {/* BOTTOM BUTTON GROUP */}
      <div className="flex flex-col p-4">

        <Button size="icon" variant="ghost" className="h-8 w-8">
          <Settings2 className="h-4 w-4" />
        </Button>

        <Button size="icon" variant="ghost" className="h-8 w-8">
          <Bug className="h-4 w-4" />
        </Button>

        <Button size="icon" variant="ghost" className="h-8 w-8">
          <HelpCircle className="h-4 w-4" />
        </Button>
      </div>

    </aside>
  )
}