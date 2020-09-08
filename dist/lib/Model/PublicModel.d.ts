/// <reference types="react" />
import { TextCell, HeaderCell, CheckboxCell, DateCell, EmailCell, ChevronCell, NumberCell, TimeCell } from './../CellTemplates';
export declare type SelectionMode = 'row' | 'column' | 'range';
export interface ReactGridProps {
    readonly columns: Column[];
    readonly rows: Row<Cell>[];
    readonly customCellTemplates?: CellTemplates;
    readonly focusLocation?: CellLocation;
    readonly initialFocusLocation?: CellLocation;
    readonly highlights?: Highlight[];
    readonly stickyTopRows?: number;
    readonly stickyBottomRows?: number;
    readonly stickyLeftColumns?: number;
    readonly stickyRightColumns?: number;
    readonly enableFillHandle?: boolean;
    readonly enableRangeSelection?: boolean;
    readonly enableRowSelection?: boolean;
    readonly enableColumnSelection?: boolean;
    readonly labels?: TextLabels;
    readonly enableFullWidthHeader?: boolean;
    readonly enableGroupIdRender?: boolean;
    readonly onCellsChanged?: (cellChanges: CellChange[]) => void;
    readonly onFocusLocationChanged?: (location: CellLocation) => void;
    readonly onFocusLocationChanging?: (location: CellLocation) => boolean;
    readonly onColumnResized?: (columnId: Id, width: number, selectedColIds: Id[]) => void;
    readonly onRowsReordered?: (targetRowId: Id, rowIds: Id[], dropPosition: DropPosition) => void;
    readonly onColumnsReordered?: (targetColumnId: Id, columnIds: Id[], dropPosition: DropPosition) => void;
    readonly onContextMenu?: (selectedRowIds: Id[], selectedColIds: Id[], selectionMode: SelectionMode, menuOptions: MenuOption[]) => MenuOption[];
    readonly canReorderColumns?: (targetColumnId: Id, columnIds: Id[], dropPosition: DropPosition) => boolean;
    readonly canReorderRows?: (targetRowId: Id, rowIds: Id[], dropPosition: DropPosition) => boolean;
}
export interface TextLabels {
    legacyBrowserHeader?: string;
    legacyBrowserText?: string;
    copyLabel?: string;
    cutLabel?: string;
    pasteLabel?: string;
    actionNotSupported?: string;
    appleMobileDeviceContextMenuPasteAlert?: string;
    otherBrowsersContextMenuPasteAlert?: string;
}
export interface CellTemplates {
    [key: string]: CellTemplate;
}
export interface CellLocation {
    readonly rowId: Id;
    readonly columnId: Id;
}
export interface Highlight {
    readonly rowId: Id;
    readonly columnId: Id;
    readonly borderColor?: string;
    readonly className?: string;
}
export declare type DefaultCellTypes = CheckboxCell | DateCell | EmailCell | ChevronCell | HeaderCell | NumberCell | TextCell | TimeCell;
export declare type CellChange<TCell extends Cell = DefaultCellTypes & Cell> = TCell extends Cell ? Change<TCell> : never;
export interface Change<TCell extends Cell = DefaultCellTypes> {
    readonly rowId: Id;
    readonly columnId: Id;
    readonly type: TCell['type'];
    readonly previousCell: TCell;
    readonly newCell: TCell;
}
export interface CellTemplate<TCell extends Cell = Cell> {
    getCompatibleCell(uncertainCell: Uncertain<TCell>): Compatible<TCell>;
    isFocusable?(cell: Compatible<TCell>): boolean;
    update?(cell: Compatible<TCell>, cellToMerge: UncertainCompatible<TCell>): Compatible<TCell>;
    handleKeyDown?(cell: Compatible<TCell>, keyCode: number, ctrl: boolean, shift: boolean, alt: boolean): {
        cell: Compatible<TCell>;
        enableEditMode: boolean;
    };
    getStyle?(cell: Compatible<TCell>, isInEditMode: boolean): CellStyle;
    getClassName?(cell: Compatible<TCell>, isInEditMode: boolean): string;
    render(cell: Compatible<TCell>, isInEditMode: boolean, onCellChanged: (cell: Compatible<TCell>, commit: boolean) => void): React.ReactNode;
}
export declare type Id = number | string;
export declare type DropPosition = 'before' | 'on' | 'after';
export interface Column {
    readonly columnId: Id;
    readonly width?: number;
    readonly reorderable?: boolean;
    readonly resizable?: boolean;
}
export interface CellStyle {
    readonly color?: string;
    readonly background?: string;
    readonly overflow?: string;
    readonly paddingLeft?: string;
}
export interface Cell {
    type: string;
    groupId?: Id;
    style?: CellStyle;
    className?: string;
}
export declare type Uncertain<TCell extends Cell> = Partial<TCell> & Cell;
export declare type Compatible<TCell extends Cell> = TCell & {
    text: string;
    value: number;
};
export declare type UncertainCompatible<TCell extends Cell> = Uncertain<TCell> & {
    text: string;
    value: number;
};
export interface Row<TCell extends Cell = DefaultCellTypes> {
    readonly rowId: Id;
    readonly cells: Cell[] | TCell[];
    readonly height?: number;
    readonly reorderable?: boolean;
}
export interface MenuOption {
    id: string;
    label: string;
    handler: (selectedRowIds: Id[], selectedColIds: Id[], selectionMode: SelectionMode) => void;
}
