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
import { FormattedDriver } from "../../interfaces/RideInterfaces"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "../ui/select"
import { DriverFilter, TRideConfirm } from "../../types/RideTypes"
import { Checkbox } from "../ui/checkbox"
import { useRideContext } from "../../contexts/RideContext"
import { UseFormSetValue } from "react-hook-form"

export const columns: ColumnDef<FormattedDriver>[] = [
    {
        id: "select",
        header: ({ }) => (
            <Button
                variant="default"
            >
                Selecione
            </Button>
        ),
        cell: ({ row, table }) => (
            <div className="flex items-center justify-center">
                <Checkbox
                    className="bg-white"
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => {
                        table.setRowSelection({});
                        row.toggleSelected(!!value);
                    }}
                    aria-label="Select row"
                />
            </div>
        ),
        enableSorting: false,
        enableHiding: false,
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
        },
    },
    {
        accessorKey: "name",
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
        cell: ({ row }) => <div>{row.getValue("name")}</div>,
    },
    {
        accessorKey: "description",
        header: ({ column }) => {
            return (
                <Button
                    variant="default"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Descrição
                    <ArrowUpDown />
                </Button>
            )
        },
        cell: ({ row }) => <div>{row.getValue("description")}</div>,
    },
    {
        accessorKey: "vehicle",
        header: ({ column }) => {
            return (
                <Button
                    variant="default"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="mx-auto"
                >
                    Veículo
                    <ArrowUpDown />
                </Button>
            )
        },
        cell: ({ row }) => <div>{row.getValue("vehicle")}</div>,
    },
    {
        accessorKey: "review_rating",
        header: ({ column }) => {
            return (
                <Button
                    variant="default"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Avaliação
                    <ArrowUpDown />
                </Button>
            )
        },
        cell: ({ row }) => <div>{row.getValue("review_rating")}/5</div>,
    },
    {
        accessorKey: "review_comment",
        header: ({ column }) => {
            return (
                <Button
                    variant="default"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Comentário
                    <ArrowUpDown />
                </Button>
            )
        },
        cell: ({ row }) => <div>{row.getValue("review_comment")}</div>,
    }
]

export function DriverTable({ setValue }: {
    setValue: UseFormSetValue<TRideConfirm>
}) {
    const { rideEstimate } = useRideContext();
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
        []
    )

    const [columnVisibility, setColumnVisibility] =
        React.useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = React.useState({})

    const [formattedDrivers, setFormattedDrivers] = React.useState<FormattedDriver[]>([]);

    React.useEffect(() => {
        if (rideEstimate) {
            const newDrivers: FormattedDriver[] = rideEstimate.options.map((driver) => {
                return {
                    description: driver.description,
                    id: driver.id,
                    name: driver.name,
                    review_rating: driver.review.rating,
                    review_comment: driver.review.comment,
                    value: driver.value,
                    vehicle: driver.vehicle

                }
            });
            setFormattedDrivers(newDrivers);
        }
    }, [rideEstimate])

    const table = useReactTable({
        data: formattedDrivers,
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

    React.useEffect(() => {
        const row = table.getSelectedRowModel().rows[0];
        if (row) {
            const driver = row.original;
            Object.entries(driver).map(([key, value]) => {
                if (["id", "name"].includes(key)) {
                    setValue("driver_" + key as any, value);
                } else if (["value"].includes(key)) {
                    setValue(key as any, value);
                }
            });
        }
    }, [rowSelection]);

    const [tableFilter, setTableFilter] = React.useState<DriverFilter>("name");

    function formattedCellId(id: DriverFilter) {
        const ids = { name: "Nome", description: "Descrição", vehicle: "Veículo", review_rating: "Avaliação", review_comment: "Comentário", value: "Valor" }
        return ids[id];
    }

    return (
        <div className="w-full">
            <div className="flex items-center py-4">
                <div className="flex gap-3">
                    <Select onValueChange={(value => {
                        table.setColumnFilters([]);
                        setTableFilter(value as DriverFilter);
                    })} defaultValue="name">
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Seleciona o filtro" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Filtros</SelectLabel>
                                <SelectItem value="value">Valor</SelectItem>
                                <SelectItem value="name">Nome</SelectItem>
                                <SelectItem value="description">Descrição</SelectItem>
                                <SelectItem value="vehicle">Veículo</SelectItem>
                                <SelectItem value="review_rating">Avaliação</SelectItem>
                                <SelectItem value="review_comment">Comentário</SelectItem>
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
                                        {formattedCellId(column.id as DriverFilter)}
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