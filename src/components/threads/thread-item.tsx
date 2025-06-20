import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar"
import { api } from "@/convex/_generated/api"
import { cn } from "@/lib/utils"
import { Link } from "@tanstack/react-router"
import { useParams } from "@tanstack/react-router"
import { useMutation } from "convex/react"
import equal from "fast-deep-equal/es6"
import { BotMessageSquare, Edit3, FolderOpen, MoreHorizontal, Pin, Trash2 } from "lucide-react"
import { memo, useState } from "react"
import { toast } from "sonner"
import type { Thread } from "./types"

interface ThreadItemProps {
    thread: Thread
    isInFolder?: boolean
    onOpenRenameDialog?: (thread: Thread) => void
    onOpenMoveDialog?: (thread: Thread) => void
    onOpenDeleteDialog?: (thread: Thread) => void
    onOpenGenerateTitleDialog?: (thread: Thread) => void
}

export const ThreadItem = memo(
    ({
        thread,
        isInFolder = false,
        onOpenRenameDialog,
        onOpenMoveDialog,
        onOpenDeleteDialog,
        onOpenGenerateTitleDialog
    }: ThreadItemProps) => {
        const [isMenuOpen, setIsMenuOpen] = useState(false)

        const togglePinMutation = useMutation(api.threads.togglePinThread)
        const params = useParams({ strict: false }) as { threadId?: string }
        const isActive = params.threadId === thread._id

        const handleTogglePin = async () => {
            const pinned = thread.pinned
            try {
                await togglePinMutation({ threadId: thread._id })
            } catch (error) {
                console.error("Failed to toggle pin:", error)
                toast.error(`Failed to ${pinned ? "unpin" : "pin"} thread`)
            }
        }

        const handleGenerateTitle = () => {
            onOpenGenerateTitleDialog?.(thread)
        }

        const handleRename = () => {
            onOpenRenameDialog?.(thread)
        }

        const handleMove = () => {
            onOpenMoveDialog?.(thread)
        }

        const handleDelete = () => {
            onOpenDeleteDialog?.(thread)
        }

        return (
            <SidebarMenuItem className={isInFolder ? "pl-6" : ""}>
                <div
                    className={cn(
                        "group/item flex w-full items-center rounded-sm hover:bg-accent/50",
                        isMenuOpen && "bg-accent/50",
                        isActive && "bg-accent/60"
                    )}
                >
                    <SidebarMenuButton
                        asChild
                        className={cn("flex-1 hover:bg-transparent", isActive && "text-foreground")}
                    >
                        <Link
                            to="/thread/$threadId"
                            params={{ threadId: thread._id }}
                            className="flex items-center justify-between"
                        >
                            <span className="truncate">{thread.title}</span>

                            <DropdownMenu onOpenChange={setIsMenuOpen}>
                                <DropdownMenuTrigger asChild>
                                    <button
                                        type="button"
                                        className={cn(
                                            "rounded p-1 transition-opacity",
                                            isMenuOpen || "opacity-0 group-hover/item:opacity-100"
                                        )}
                                    >
                                        <MoreHorizontal className="mr-1 h-4 w-4" />
                                    </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={handleGenerateTitle}>
                                        <BotMessageSquare className="h-4 w-4" />
                                        Generate Title
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={handleRename}>
                                        <Edit3 className="h-4 w-4" />
                                        Rename Title
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={handleTogglePin}>
                                        <Pin className="h-4 w-4" />
                                        {thread.pinned ? "Unpin" : "Pin"}
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={handleMove}>
                                        <FolderOpen className="h-4 w-4" />
                                        Move to folder
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={handleDelete} variant="destructive">
                                        <Trash2 className="h-4 w-4" />
                                        Delete
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </Link>
                    </SidebarMenuButton>
                </div>
            </SidebarMenuItem>
        )
    },
    (prevProps, nextProps) => {
        return (
            equal(prevProps.thread, nextProps.thread) &&
            prevProps.isInFolder === nextProps.isInFolder
        )
    }
)

ThreadItem.displayName = "ThreadItem"
