import { Cell, Compatible } from "../Model/PublicModel";
import { State } from "../Model/State";
import { Location } from "../Model/InternalModel";
import { tryAppendChangeHavingGroupId } from "./tryAppendChangeHavingGroupId";
import { getActiveSelectedRange } from "./getActiveSelectedRange";
import { newLocation } from "./newLocation";

export function pasteData(state: State, rows: Compatible<Cell>[][]): State {
  const activeSelectedRange = getActiveSelectedRange(state);
  if (rows.length === 1 && rows[0].length === 1) {
    // pasting single cell on active selected range
    activeSelectedRange.rows.forEach((row) =>
      activeSelectedRange.columns.forEach((column) => {
        state = tryAppendChangeHavingGroupId(
          state, 
          newLocation(row, column),
          rows[0][0]
        ) as State;
      })
    );
  } else {
    let lastLocation: Location | undefined;
    const cellMatrix = state.cellMatrix;

    rows.forEach((row, ri) =>
      row.forEach((cell, ci) => {
        const rowIdx = activeSelectedRange.first.row.idx + ri;
        const columnIdx = activeSelectedRange.first.column.idx + ci;
        if (
          rowIdx <= cellMatrix.last.row.idx &&
          columnIdx <= cellMatrix.last.column.idx
        ) {
          lastLocation = cellMatrix.getLocation(rowIdx, columnIdx);
        } else {
          let row = cellMatrix.rows[rowIdx];
          let column = cellMatrix.columns[columnIdx];

          if (!row) {
            row = {
              ...cellMatrix.last.row,
              idx: rowIdx,
              rowId: rowIdx,
              cells: cellMatrix.last.row.cells.map((cell, index) => {
                const newCell = {
                  ...cell,
                  forceChange: true
                };

                if (index !== 0) {
                  return {
                    ...newCell,
                    value: NaN,
                    text: ''
                  };
                }

                return newCell;
              })
            }

            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            cellMatrix.last.row = row;
            cellMatrix.rowIndexLookup[rowIdx] = rowIdx;
            cellMatrix.rows.push(row);
          }

          if (!column) {
            column = {
              ...cellMatrix.last.column,
              idx: columnIdx,
              columnId: columnIdx,
            }

            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            cellMatrix.last.column = column;
            cellMatrix.columnIndexLookup[columnIdx] = columnIdx;
            cellMatrix.columns.push(column);

            cellMatrix.rows.forEach((existingRow) => {
              existingRow.cells.push({
                ...existingRow.cells[existingRow.cells.length - 1],
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                value: NaN,
                text: '',
                forceChange: true
              });
            });
          }

          lastLocation = {
            row,
            column,
          } as Location
        }

        state = tryAppendChangeHavingGroupId(
          state,
          lastLocation,
          cell
        ) as State;
      })
    );

    if (!lastLocation) {
      return state;
    }
    return {
      ...state,
      selectedRanges: [
        cellMatrix.getRange(activeSelectedRange.first, lastLocation),
      ],
      activeSelectedRangeIdx: 0,
    };
  }
  return state;
}
