import React, { useMemo } from 'react';
import { useTable, useSortBy, useFilters, usePagination } from 'react-table';

// 模拟数据生成函数
const generateData = (columns, rows) => {
    const data = [];
    for (let i = 0; i < rows; i++) {
        const row = {};
        for (let j = 0; j < columns; j++) {
            row[`Column ${j + 1}`] = `Row ${i + 1}, Col ${j + 1}`;
        }
        data.push(row);
    }
    return data;
};

const Table = ({ columns, data }) => {
    const defaultColumn = useMemo(
        () => ({
            // 定义默认筛选器
            Filter: DefaultColumnFilter,
        }),
        []
    );

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        prepareRow,
        page,
        canPreviousPage,
        canNextPage,
        pageOptions,
        pageCount,
        gotoPage,
        nextPage,
        previousPage,
        state: { pageIndex },
    } = useTable(
        {
            columns,
            data,
            defaultColumn,
            initialState: { pageIndex: 0 },
        },
        useFilters, // 使用筛选器插件
        useSortBy, // 使用排序插件
        usePagination // 使用分页插件
    );

    return (
        <div>
            <table {...getTableProps()} style={{ width: '100%' }}>
                <thead>
                {headerGroups.map((headerGroup) => (
                    <tr {...headerGroup.getHeaderGroupProps()}>
                        {headerGroup.headers.map((column) => (
                            <th
                                {...column.getHeaderProps(column.getSortByToggleProps())}
                                style={{
                                    borderBottom: 'solid 3px',
                                    background: 'aliceblue',
                                    color: 'black',
                                    fontWeight: 'bold',
                                }}
                            >
                                {column.render('Header')}
                                <span>
                    {column.isSorted ? (
                        column.isSortedDesc ? (
                            <span>&#x2193;</span>
                        ) : (
                            <span>&#x2191;</span>
                        )
                    ) : (
                        ''
                    )}
                  </span>
                                <div>{column.canFilter ? column.render('Filter') : null}</div>
                            </th>
                        ))}
                    </tr>
                ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                {page.map((row) => {
                    prepareRow(row);
                    return (
                        <tr {...row.getRowProps()}>
                            {row.cells.map((cell) => (
                                <td
                                    {...cell.getCellProps()}
                                    style={{
                                        padding: '10px',
                                        border: 'solid 1px gray',
                                        background: 'papayawhip',
                                    }}
                                >
                                    {cell.render('Cell')}
                                </td>
                            ))}
                        </tr>
                    );
                })}
                </tbody>
            </table>
            <div>
                <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
                    {'<<'}
                </button>{' '}
                <button onClick={() => previousPage()} disabled={!canPreviousPage}>
                    {'<'}
                </button>{' '}
                <button onClick={() => nextPage()} disabled={!canNextPage}>
                    {'>'}
                </button>{' '}
                <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
                    {'>>'}
                </button>{' '}
                <span>
          Page{' '}
                    <strong>
            {pageIndex + 1} of {pageOptions.length}
          </strong>{' '}
        </span>
            </div>
        </div>
    );
};

// 默认筛选器组件
const DefaultColumnFilter = ({ column: { filterValue, setFilter } }) => {
    return (
        <input
            value={filterValue || ''}
            onChange={(e) => {
                setFilter(e.target.value || undefined);
            }}
            placeholder="Search..."
        />
    );
};

const DataTable = () => {
    const columns = useMemo(() => {
        const generatedColumns = [];
        for (let i = 0; i < 346; i++) {
            generatedColumns.push({
                Header: `Column ${i + 1}`,
                accessor: `Column ${i + 1}`,
                Filter: DefaultColumnFilter, // 为每一列设置默认筛选器
            });
        }
        return generatedColumns;
    }, []);

    const data = useMemo(() => generateData(346, 5000), []);

    return (
        <div>
            <h1>好好好</h1>
            <Table columns={columns} data={data} />
        </div>
    );
};

export default DataTable;
