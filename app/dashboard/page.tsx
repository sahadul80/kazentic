"use client"

import { AppBreadcrumb } from "@/components/dashboard/app-breadcrumb"

export default function DashboardPage () {
    return(
        <>
            <div className="sticky top-0 h-[36px] bg-background border-bs flex items-center justify-between px-[12px]">
                <AppBreadcrumb />
            </div>
        </>
    )
}