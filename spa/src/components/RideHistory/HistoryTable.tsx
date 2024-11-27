"use client"

import * as React from "react"
import {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    VisibilityState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table"
import { ArrowUpDown, ChevronDown } from "lucide-react"

import { Button } from "../ui/button"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "../ui/dropdown-menu"
import { Input } from "../ui/input"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../ui/table"
import { FormattedRideHistory } from "../../interfaces/RideInterfaces"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "../ui/select"
import { HistoryFilter } from "../../types/RideTypes"
import { useRideContext } from "../../contexts/RideContext"

export const columns: ColumnDef<FormattedRideHistory>[] = [
    {
        accessorKey: "driver_name",
        header: ({ column }) => {
            return (
                <Button
                    variant="default"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Nome
                    <ArrowUpDown />
                </Button>
            )
        },
        cell: ({ row }) => <div>{row.getValue("driver_name")}</div>,
    },
    {
        accessorKey: "date",
        header: ({ column }) => {
            return (
                <Button
                    variant="default"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Data e hora
                    <ArrowUpDown />
                </Button>
            )
        },
        cell: ({ row }) => {
            const formatter = new Intl.DateTimeFormat('pt-BR', {
                dateStyle: "short",
                timeStyle: "short"
            });
            const formatted = formatter.format(new Date(row.getValue("date")));
            return <div>{formatted}</div>
        }
    },
    {
        accessorKey: "origin",
        header: ({ column }) => {
            return (
                <Button
                    variant="default"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Origem
                    <ArrowUpDown />
                </Button>
            )
        },
        cell: ({ row }) => <div>{row.getValue("origin")}</div>,
    },
    {
        accessorKey: "destination",
        header: ({ column }) => {
            return (
                <Button
                    variant="default"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Destino
                    <ArrowUpDown />
                </Button>
            )
        },
        cell: ({ row }) => <div>{row.getValue("destination")}</div>,
    },
    {
        accessorKey: "distance",
        header: ({ column }) => {
            return (
                <Button
                    variant="default"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="mx-auto"
                >
                    Distância
                    <ArrowUpDown />
                </Button>
            )
        },
        cell: ({ row }) => <div>{row.getValue("distance")}m</div>,
    },
    {
        accessorKey: "duration",
        header: ({ column }) => {
            return (
                <Button
                    variant="default"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Tempo
                    <ArrowUpDown />
                </Button>
            )
        },
        cell: ({ row }) => <div>{row.getValue("duration")}</div>,
    },
    {
        accessorKey: "value",
        header: ({ column }) => {
            return (
                <Button
                    variant="default"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Valor
                    <ArrowUpDown />
                </Button>
            )
        },
        cell: ({ row }) => {
            const formatter = new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL'
            });
            const formatted = formatter.format(row.getValue("value"));
            return <div>{formatted}</div>
        }
    }
]

export function HistoryTable() {
    const { rideHistory } = useRideContext();
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
        []
    )

    const [columnVisibility, setColumnVisibility] =
        React.useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = React.useState({})

    const [formattedRideHistory, setFormattedRideHistory] = React.useState<FormattedRideHistory[]>([]);

    React.useEffect(() => {
        if (rideHistory) {
            const newDrivers: FormattedRideHistory[] = rideHistory.rides.map((ride) => {
                return {
                    id: ride.id,
                    date: ride.date,
                    origin: ride.origin,
                    destination: ride.destination,
                    distance: ride.distance,
                    duration: ride.duration,
                    driver_id: ride.driver.id,
                    driver_name: ride.driver.name,
                    value: ride.value
                }
            });
            setFormattedRideHistory(newDrivers);
        }
    }, [rideHistory])

    const table = useReactTable({
        data: formattedRideHistory,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
    })

    const [tableFilter, setTableFilter] = React.useState<HistoryFilter>("driver_name");

    function formattedCellId(id: HistoryFilter) {
        const ids = { driver_name: "Nome", date: "Data e hora", origin: "Origem", destination: "Destino", distance: "Distância", duration: "Tempo", value: "Valor" }
        return ids[id];
    }

    return (
        <div className="w-full">
            <div className="flex items-center py-4">
                <div className="flex gap-3">
                    <Select onValueChange={(value => {
                        table.setColumnFilters([]);
                        setTableFilter(value as HistoryFilter);
                    })} defaultValue="driver_name">
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Seleciona o filtro" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Filtros</SelectLabel>
                                <SelectItem value="driver_name">Nome do motorista</SelectItem>
                                <SelectItem value="date">Data e hora</SelectItem>
                                <SelectItem value="origin">Origem</SelectItem>
                                <SelectItem value="destination">Destino</SelectItem>
                                <SelectItem value="distance">Distância</SelectItem>
                                <SelectItem value="duration">Tempo</SelectItem>
                                <SelectItem value="value">Valor</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                    <Input
                        placeholder={`Filtre ${formattedCellId(tableFilter).toLowerCase()}...`}
                        value={(table.getColumn(tableFilter)?.getFilterValue() as string) ?? ""}
                        onChange={(event) =>
                            table.getColumn(tableFilter)?.setFilterValue(event.target.value)
                        }
                        className="max-w-sm"
                    />
                </div>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="ml-auto">
                            Colunas <ChevronDown />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        {table
                            .getAllColumns()
                            .filter((column) => column.getCanHide())
                            .map((column) => {
                                return (
                                    <DropdownMenuCheckboxItem
                                        key={column.id}
                                        className="capitalize"
                                        checked={column.getIsVisible()}
                                        onCheckedChange={(value) =>
                                            column.toggleVisibility(!!value)
                                        }
                                    >
                                        {formattedCellId(column.id as HistoryFilter)}
                                    </DropdownMenuCheckboxItem>
                                )
                            })}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <div className="w-full rounded-md border overflow-x-auto">
                <div className="min-w-full">
                    <Table>
                        <TableHeader>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => {
                                        return (
                                            <TableHead style={{ minWidth: "25% !important" }} key={header.id}>
                                                {header.isPlaceholder
                                                    ? null
                                                    : flexRender(
                                                        header.column.columnDef.header,
                                                        header.getContext()
                                                    )}
                                            </TableHead>
                                        )
                                    })}
                                </TableRow>
                            ))}
                        </TableHeader>
                        <TableBody>
                            {table.getRowModel().rows?.length ? (
                                table.getRowModel().rows.map((row) => (
                                    <TableRow
                                        key={row.id}
                                    >
                                        {row.getVisibleCells().map((cell) => {
                                            return <TableCell style={{ minWidth: "25% !important" }} key={cell.id}>
                                                {flexRender(
                                                    cell.column.columnDef.cell,
                                                    cell.getContext()
                                                )}
                                            </TableCell>
                                        })}

                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell
                                        colSpan={columns.length}
                                        className="h-24 text-center"
                                    >
                                        No results.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    )
}