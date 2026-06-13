import React from 'react'
import Pagination from '../ui/Pagination'
export default function EnrolmentsTable({ columns, rows, sortKey, sortDir, toggleSort,
                             page, totalPages, setPage, totalRows }) {
  return (
    <div>
      <table>
        <thead>
          <tr>
            {columns.map(col => (
              <th key={col.key}
                  onClick={col.sortable ? () => toggleSort(col.key) : undefined}
                  style={{ cursor: col.sortable ? 'pointer' : 'default' }}
              >
                {col.label}
                {sortKey === col.key ? (sortDir === 'asc' ? ' ↑' : ' ↓') : ''}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={row.id ?? i}>
              {columns.map(col => <td key={col.key}>{row[col.key]}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    <Pagination/>
    </div>
  )
}

