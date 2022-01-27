import React, { useState } from 'react';
import Paper from '@material-ui/core/Paper';
import { EditingState } from '@devexpress/dx-react-grid';
import {
  Grid,
  Table,
  TableHeaderRow,
  TableEditRow,
  TableEditColumn,
  TableColumnResizing,
} from '@devexpress/dx-react-grid-material-ui';

// import {
//   generateRows,
//   defaultColumnValues,
// } from '../../../demo-data/generator';

const getRowId = row => row.id

export function Table2(props) {
//   const [columns] = useState([
//     { name: 'name', title: 'Name' },
//     { name: 'gender', title: 'Gender' },
//     { name: 'city', title: 'City' },
//     { name: 'car', title: 'Car' },
//   ]);
  const [columns, setColumns] = useState([ { name: 'name', title: 'Name' }]);
  if (columns != props.columns) setColumns(props.columns)

//   const [rows, setRows] = useState(generateRows({
//     columnValues: { id: ({ index }) => index, ...defaultColumnValues },
//     length: 8,
//   }));
//   const [rows, setRows] = useState(generateRows());

  const [rows, setRows] = useState();
//   if (rows != props.rows) {
//     const data = []
//     columns.forEach(column => {
        
//     });
//     setRows(data)
//   } 
    if (rows != props.rows) {
        setRows(props.rows)
    }

//   const [editingStateColumnExtensions] = useState([
//     { columnName: 'name', editingEnabled: false },
//   ]);
  const [editingStateColumnExtensions, setEditingStateColumnExtensions] = useState([]);
  if (columns.length > 0) {
    editingStateColumnExtensions[0] = {  columnName: props.columns[0].name, editingEnabled: false }
    editingStateColumnExtensions[1] = {  columnName: props.columns[1].name, editingEnabled: false }
    editingStateColumnExtensions[2] = {  columnName: props.columns[2].name, editingEnabled: false }
    editingStateColumnExtensions[3] = {  columnName: props.columns[3].name, editingEnabled: false }
    editingStateColumnExtensions[4] = {  columnName: props.columns[4].name, editingEnabled: false }
  }

//   const [columnWidths, setColumnWidths] = useState([
//     { columnName: 'name', width: 180 },
//     { columnName: 'gender', width: 180 },
//     { columnName: 'city', width: 180 },
//     { columnName: 'car', width: 240 },
//   ]);
    const [columnWidths, setColumnWidths] = useState([  {  columnName: props.columns[0].name, width: 180 },
        {  columnName: props.columns[1].name, width: 180 },
        {  columnName: props.columns[2].name, width: 180 },
        {  columnName: props.columns[3].name, width: 180 },
        {  columnName: props.columns[4].name, width: 180 },
        {  columnName: props.columns[5].name, width: 180 },]);
//     if (columns.length > 2) {
//         const columnWidthsVal = [  
//         {  columnName: props.columns[0].name, width: 180 },
//         {  columnName: props.columns[1].name, width: 180 },
//         {  columnName: props.columns[2].name, width: 180 },
//         {  columnName: props.columns[3].name, width: 180 },
//         {  columnName: props.columns[4].name, width: 180 },
//         {  columnName: props.columns[5].name, width: 180 },
//     ]

//     setColumnWidths(columnWidthsVal)
//   }


  const commitChanges = ({ added, changed, deleted }) => {
    let changedRows;
    if (added) {
      const startingAddedId = rows.length > 0 ? rows[rows.length - 1].id + 1 : 0;
      changedRows = [
        ...rows,
        ...added.map((row, index) => ({
          id: startingAddedId + index,
          ...row,
        })),
      ];
      props.setNewTableList(changedRows)
    }
    if (changed) {
      changedRows = rows.map(row => (changed[row.id] ? { ...row, ...changed[row.id] } : row));
      props.setNewTableList(changedRows)
    }
    if (deleted) {
      const deletedSet = new Set(deleted);
      changedRows = rows.filter(row => !deletedSet.has(row.id));
    }
    setRows(changedRows);
    props.setNewTableList(changedRows)
  };

  return (
    <Paper>
      <Grid
        rows={rows}
        columns={columns}
        getRowId={getRowId}
      >
        <EditingState
          onCommitChanges={commitChanges}
          //defaultEditingRowIds={[0]}
          columnExtensions={editingStateColumnExtensions}
        />
        <Table />
        <TableColumnResizing
          columnWidths={columnWidths}
          onColumnWidthsChange={setColumnWidths}
        />
        <TableHeaderRow />
        <TableEditRow />
        <TableEditColumn
        //   showAddCommand
          showEditCommand
          messages={{editCommand: 'Правка', addCommand: 'Новая запись', commitCommand: 'Сохранить', cancelCommand: 'Отменить'}}
          width={250}
          //showDeleteCommand
        />
      </Grid>
    </Paper>
  );
};
