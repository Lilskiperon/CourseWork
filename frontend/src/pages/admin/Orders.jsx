// src/components/Orders.jsx
import React, { useState, useEffect } from 'react';
import axios from '../../lib/axios';
import { useNavigate } from 'react-router-dom';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
} from '@tanstack/react-table';
import './Orders.css';

// Поддерживаемые статусы по Order.js:
// enum: ["pending", "processing", "shipped", "delivered", "cancelled"]
const statusClassMap = {
  pending: 'status-pending',
  processing: 'status-processing',
  shipped: 'status-shipped',
  delivered: 'status-delivered',
  cancelled: 'status-cancelled',
};

function GlobalFilter({ globalFilter, setGlobalFilter }) {
  return (
    <input
      value={globalFilter ?? ''}
      onChange={e => setGlobalFilter(e.target.value)}
      placeholder="Поиск..."
      style={{ padding: 12, width: 200, borderRadius: 6, border: '1px solid #cbd5e1' }}
    />
  );
}

export default function Orders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [globalFilter, setGlobalFilter] = useState('');
  const [sorting, setSorting] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [columnSizing, setColumnSizing] = useState({});
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);
        const resp = await axios.get('/orders');
        // Вытаскиваем реальный массив заказов из ответа
        let raw = resp.data;
        if (!Array.isArray(raw)) {
          if (Array.isArray(raw.orders)) {
            raw = raw.orders;
          } else if (Array.isArray(raw.data)) {
            raw = raw.data;
          } else {
            throw new Error('Невалидный формат ответа от /orders');
          }
        }

        // готовим списки ID для batch-запросов
        const userIds = [...new Set(raw.map(o => o.user))];
        const prodIds = [
          ...new Set(raw.flatMap(o => o.products.map(p => p.product)))
        ];

        // подгружаем пользователей и товары
        const [uRes, pRes] = await Promise.all([
          axios.get('/users',    { params: { ids: userIds.join(',') } }),
          axios.get('/products', { params: { ids: prodIds.join(',') } }),
        ]);
        const userMap = Object.fromEntries(uRes.data.map(u => [u._id, u]));
        const prodMap = Object.fromEntries(pRes.data.map(p => [p._id, p]));

        // объединяем данные
        const enriched = raw.map(o => ({
          ...o,
          user: userMap[o.user] || null,
          orderItems: o.products.map(({ product, quantity, price, _id }) => ({
            id: _id,
            name: prodMap[product]?.productName || '—',
            image: prodMap[product]?.image || '',
            quantity,
            price,
          })),
        }));

        setOrders(enriched);
      } catch (e) {
        console.error(e);
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const handleDelete = async row => {
    if (!window.confirm('Удалить этот заказ?')) return;
    try {
      await axios.delete(`/api/admin/orders/${row.original._id}`);
      setOrders(prev => prev.filter(o => o._id !== row.original._id));
      alert('Заказ удалён');
    } catch {
      alert('Не удалось удалить заказ');
    }
  };

  const columns = [
    {
      header: 'Заказчик',
      accessorKey: 'user',
      cell: ({ row }) => {
        const u = row.original.user;
        return u ? (
          <div className="cell-user">
            <img src={u.avatar} alt="avatar" className="avatar" />
            <span>{u.firstName} {u.lastName}</span>
          </div>
        ) : '—';
      },
    },
    {
      header: 'Товары',
      accessorKey: 'orderItems',
      cell: ({ row }) => (
        <ul className="cell-items">
          {row.original.orderItems.map(item => (
            <li key={item.id}>
              {item.name} ×{item.quantity}
            </li>
          ))}
        </ul>
      ),
    },
    {
      header: 'Сумма',
      accessorKey: 'totalAmount',
      cell: info => `$${info.getValue().toFixed(2)}`,
    },
    {
      header: 'Статус',
      accessorKey: 'status',
      cell: ({ row }) => {
        const st = row.original.status;
        const cls = statusClassMap[st] || '';
        return <span className={`status-badge ${cls}`}>{st}</span>;
      },
    },
    {
      header: 'Адрес',
      accessorKey: 'shippingAddress',
    },
    {
      header: 'Дата',
      accessorKey: 'createdAt',
      cell: info =>
        new Date(info.getValue()).toLocaleString('ru-RU', {
          dateStyle: 'short',
          timeStyle: 'short',
        }),
    },
    {
      header: 'Действия',
      id: 'actions',
      cell: ({ row }) => (
        <div className="cell-actions">
          <button onClick={() => navigate(`/admin/orders/${row.original._id}`)}>
            Ред.
          </button>
          <button onClick={() => handleDelete(row)}>Уд.</button>
        </div>
      ),
    },
  ];

  const table = useReactTable({
    data: orders,
    columns,
    state: { globalFilter, sorting, columnVisibility, columnSizing, pagination },
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    onColumnSizingChange: setColumnSizing,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    enableColumnResizing: true,
  });

  if (loading) return <div className="admin-container">Загрузка...</div>;
  if (error)   return <div className="admin-container">Ошибка: {error}</div>;

  return (
    <div className="admin-container">
      <h1 className="admin-title">Orders</h1>
      <div className="grid-content">
        <GlobalFilter globalFilter={globalFilter} setGlobalFilter={setGlobalFilter} />
        <select
          className="page-size-select"
          value={table.getState().pagination.pageSize}
          onChange={e => table.setPageSize(Number(e.target.value))}
        >
          {[10, 20, 50].map(s => (
            <option key={s} value={s}>Показать {s}</option>
          ))}
        </select>
      </div>
      <table className="tanstack-table">
        <thead>
          {table.getHeaderGroups().map(hg => (
            <tr key={hg.id}>
              {hg.headers.map(header => (
                <th key={header.id} style={{ width: header.getSize(), position: 'relative' }}>
                  <div
                    onClick={header.column.getToggleSortingHandler()}
                    style={{
                      cursor: header.column.getCanSort() ? 'pointer' : 'default',
                      display: 'inline-flex',
                      alignItems: 'center',
                    }}
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
                    {header.column.getIsSorted() === 'asc' && <span>▲</span>}
                    {header.column.getIsSorted() === 'desc' && <span>▼</span>}
                  </div>
                  {header.column.getCanResize() && (
                    <div
                      onMouseDown={header.getResizeHandler()}
                      onTouchStart={header.getResizeHandler()}
                      style={{
                        position: 'absolute',
                        right: 0,
                        top: 0,
                        height: '100%',
                        width: '5px',
                        cursor: 'col-resize',
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
            <tr key={row.id}>
              {row.getVisibleCells().map(cell => (
                <td key={cell.id} style={{ position: 'relative' }}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pagination">
        <button onClick={() => table.setPageIndex(0)} disabled={!table.getCanPreviousPage()}>{'<<'}</button>
        <button onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>{'<'}</button>
        <span>{table.getState().pagination.pageIndex + 1} из {table.getPageCount()}</span>
        <button onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>{'>'}</button>
        <button onClick={() => table.setPageIndex(table.getPageCount() - 1)} disabled={!table.getCanNextPage()}>{'>>'}</button>
      </div>
    </div>
  );
}
