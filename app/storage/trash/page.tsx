import { AppBreadcrumb } from "@/components/dashboard/app-breadcrumb";
import { TrashStorageView } from "@/components/storage/TrashStorageView";

export default function TrashPage () {
    return(
        <div className="max-w-[1184px] mx-auto">
            <TrashStorageView/>
        </div>
    )
}