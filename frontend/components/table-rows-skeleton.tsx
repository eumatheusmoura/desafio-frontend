"use client";

import { Skeleton } from "./ui/skeleton";

interface TableRowsSkeletonProps {
  rows?: number;
}

export function TableRowsSkeleton({ rows = 10 }: TableRowsSkeletonProps) {
  return (
    <>
      {Array.from({ length: rows }).map((_, index) => (
        <tr
          key={index}
          className="border-b border-border hover:bg-muted/50 transition-colors"
        >
          <td className="p-2 align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]">
            <Skeleton
              className="h-4 w-4 rounded-md translate-y-[2px]"
              role="checkbox"
            />{" "}
          </td>
          <td className="p-2 align-middle whitespace-nowrap">
            <Skeleton className="h-4 w-32 rounded-md" />{" "}
          </td>
          <td className="p-2 align-middle whitespace-nowrap">
            <Skeleton className="h-4 w-36 rounded-md" />{" "}
          </td>
          <td className="p-2 align-middle whitespace-nowrap">
            <Skeleton className="h-4 w-48 rounded-md" />{" "}
          </td>
          <td className="p-2 align-middle whitespace-nowrap">
            <Skeleton className="h-4 w-32 rounded-md" />{" "}
          </td>
          <td className="p-2 align-middle whitespace-nowrap">
            <Skeleton className="h-4 w-28 rounded-md" />{" "}
          </td>
          <td className="p-2 align-middle whitespace-nowrap">
            <Skeleton className="h-8 w-8 rounded-md" />{" "}
          </td>
        </tr>
      ))}
    </>
  );
}
