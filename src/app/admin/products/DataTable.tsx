"use client";

import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Column {
  key: string;
  label: string;
  render?: (row: Record<string, any>) => React.ReactNode;
}

interface DataTableProps {
  data: Record<string, any>[];
  columns: Column[];
  getRowHref?: (row: Record<string, any>) => string | undefined;
  rowKey?: string; // L2 FIX: Allow specifying a unique key field
}

export function DataTable({ data, columns, getRowHref, rowKey = "id" }: DataTableProps) {
  if (data.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        No data available. Connect your database to see records.
      </div>
    );
  }

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((col) => (
              <TableHead key={col.key}>{col.label}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row) => {
            // L2 FIX: Use unique key from row data instead of array index
            const key = row[rowKey] ?? row.id ?? JSON.stringify(row);
            const href = getRowHref?.(row);
            const rowContent = (
              <TableRow key={key} className={href ? "cursor-pointer hover:bg-muted/50" : undefined}>
                {columns.map((col) => (
                  <TableCell key={col.key}>
                    {col.render
                      ? col.render(row)
                      : typeof row[col.key] === "boolean"
                        ? row[col.key]
                          ? "Yes"
                          : "No"
                        : String(row[col.key] ?? "-")}
                  </TableCell>
                ))}
              </TableRow>
            );

            return href ? (
              <Link key={key} href={href} className="contents">
                {rowContent}
              </Link>
            ) : (
              rowContent
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
