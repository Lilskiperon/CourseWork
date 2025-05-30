import { useState, useRef } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";
import { ordersData } from "../../constants/dummy.jsx";
import "./Orders.css";

function GlobalFilter({ globalFilter, setGlobalFilter }) {
  return (
    <input
      value={globalFilter ?? ""}
      onChange={e => setGlobalFilter(e.target.value)}
      placeholder="Поиск..."
      style={{ padding: 12, width: 200, borderRadius: 6, border: "1px solid #cbd5e1" }}
    />
  );
}

const columns = [
  {
    header: "Image",
    accessorKey: "ProductImage",
    enableSorting: false,
    enableResizing: false,
    cell: ({ row }) => (
        <img
          src={row.original.ProductImage}
          alt="order-item"
          style={{ width: 60, height: 60, borderRadius: 8, objectFit: "cover" }}
        />
    ),
    size: 80,
  },
  {
    header: "Item",
    accessorKey: "OrderItems",
    enableResizing: true,
  },
  {
    header: "Customer Name",
    accessorKey: "CustomerName",
    enableResizing: true,
  },
  {
    header: "Total Amount",
    accessorKey: "TotalAmount",
    cell: info => `$${info.getValue()}`,
    enableResizing: true,
  },
  {
    header: "Status",
    accessorKey: "Status",
    cell: ({ row }) => (
      <button
        type="button"
        style={{
          background: row.original.StatusBg,
          color: "#fff",
          borderRadius: "1rem",
          padding: "0.25rem 0.5rem",
          border: "none",
        }}
      >
        {row.original.Status}
      </button>
    ),
    enableResizing: true,
  },
  {
    header: "Order ID",
    accessorKey: "OrderID",
    enableResizing: true,
  },
  {
    header: "Location",
    accessorKey: "Location",
    enableResizing: true,
  },
];

const Orders = () => {
  const [globalFilter, setGlobalFilter] = useState("");
  const [columnVisibility, setColumnVisibility] = useState({});
  const [sorting, setSorting] = useState([]);
  const [columnSizing, setColumnSizing] = useState({});
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  // Контекстное меню
  const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0, row: null });
  const contextMenuRef = useRef();

  const table = useReactTable({
    data: ordersData,
    columns,
    state: {
      globalFilter,
      sorting,
      columnVisibility,
      columnSizing,
      pagination,
    },
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    onColumnSizingChange: setColumnSizing,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    debugTable: false,
    enableColumnResizing: true,
  });

  // Контекстное меню
  const handleContextMenu = (e, row) => {
    e.preventDefault();
    setContextMenu({
      visible: true,
      x: e.clientX,
      y: e.clientY,
      row,
    });
  };

  const handleCloseContextMenu = () => setContextMenu({ visible: false, x: 0, y: 0, row: null });


  if (contextMenu.visible) {
    setTimeout(() => {
      window.addEventListener("click", handleCloseContextMenu, { once: true });
    }, 0);
  }

  
  const handleEdit = (row) => {
    alert(`Редактировать заказ ${row.original.OrderID}`);
  };

  return (
    <div className="admin-container" style={{ position: "relative" }}>
      <h1 className="admin-title">Orders</h1>
      <div className="grid-content">
        <GlobalFilter globalFilter={globalFilter} setGlobalFilter={setGlobalFilter} />
        <select
          className="page-size-select"
          value={table.getState().pagination.pageSize}
          onChange={e => {
            table.setPageSize(Number(e.target.value));
          }}
        >
          {[10, 20, 50].map(pageSize => (
            <option key={pageSize} value={pageSize}>
              Показать {pageSize}
            </option>
          ))}
        </select>
      </div>
      <table className="tanstack-table">
        <thead>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th
                  key={header.id}
                  style={{
                    width: header.getSize(),
                    position: "relative",
                    userSelect: "none",
                  }}
                >
                  <div
                    {...{
                      onClick: header.column.getToggleSortingHandler(),
                      style: { cursor: header.column.getCanSort() ? "pointer" : "default", display: "inline-flex", alignItems: "center" },
                    }}
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
                    {header.column.getIsSorted() === "asc" && (
                      <span className="sort-indicator">▲</span>
                    )}
                    {header.column.getIsSorted() === "desc" && (
                      <span className="sort-indicator">▼</span>
                    )}
                  </div>
                  {header.column.getCanResize() && (
                    <div
                      onMouseDown={header.getResizeHandler()}
                      onTouchStart={header.getResizeHandler()}
                      style={{
                        position: "absolute",
                        right: 0,
                        top: 0,
                        height: "100%",
                        width: "5px",
                        cursor: "col-resize",
                        userSelect: "none",
                      }}
                    />
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map(row => (
            <tr
              key={row.id}
              onContextMenu={e => handleContextMenu(e, row)}
              style={{ cursor: "context-menu" }}
            >
              {row.getVisibleCells().map(cell => (
                <td key={cell.id} style={{ position: "relative" }}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  {/* Кнопка Edit только при наведении */}
                  {cell.column.id === "Location" && (
                    <button
                      className="edit-btn"
                      onClick={() => handleEdit(row)}
                    >
                      Edit
                    </button>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {/* Контекстное меню */}
      {contextMenu.visible && (
        <div
          className="context-menu"
          style={{
            top: contextMenu.y,
            left: contextMenu.x,
          }}
          ref={contextMenuRef}
        >
          <div className="context-menu__item" onClick={() => { handleEdit(contextMenu.row); handleCloseContextMenu(); }}>
            ✏️ Редактировать
          </div>
          <div className="context-menu__item" onClick={handleCloseContextMenu}>
            ❌ Закрыть
          </div>
        </div>
      )}
      <div style={{ marginTop: 16, display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
        <button
          className="pagination-btn"
          onClick={() => table.setPageIndex(0)}
          disabled={!table.getCanPreviousPage()}
        >
          {"<<"}
        </button>
        <button
          className="pagination-btn"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          {"<"}
        </button>
        <span>
          Страница{" "}
          <strong>
            {table.getState().pagination.pageIndex + 1} из {table.getPageCount()}
          </strong>
        </span>
        <button
          className="pagination-btn"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          {">"}
        </button>
        <button
          className="pagination-btn"
          onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          disabled={!table.getCanNextPage()}
        >
          {">>"}
        </button>
        <span>
          | Перейти к странице:{" "}
          <input
            type="number"
            min={1}
            max={table.getPageCount()}
            defaultValue={table.getState().pagination.pageIndex + 1}
            onChange={e => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0;
              table.setPageIndex(page);
            }}
            style={{ width: 50, borderRadius: 6, border: "1px solid #cbd5e1", padding: "2px 6px" }}
          />
        </span>
      </div>
    </div>
  );
};

export default Orders;