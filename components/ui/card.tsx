import * as React from "react"

import { cn } from "@/lib/utils"

function Card({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card"
      className={cn(
        "rounded-3xl border border-border/50 bg-background/40 shadow-sm",
        className
      )}
      {...props}
    />
  )
}

export { Card }
