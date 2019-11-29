import React from 'react'
import _ from 'lodash'
import { withStyles } from '@material-ui/core/styles'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow'
import Paper from '@material-ui/core/Paper'
// import Checkbox from '@material-ui/core/Checkbox';
import UiTableHead from './UiTableHead'
import styles from './UiTableStyles'
// import ActionButtons from '../inputs/ActionButtons';
// import moment from 'moment';
import TableSearch from '../TableSearch/TableSearch'
import ExportToExcel from '../ExportToExel'

class EnhancedTable extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      order: this.props.order || 'asc',
      orderBy: this.props.orderBy || 'Email',
      selected: this.props.selected || [],
      data: this.props.data,
      columnData: this.props.columnData,
      page: 0,
      rowsPerPage: 10,
      showExpand: -1,
      fieldTableData: {},
      tableData: this.props.data
    }
    this.openSideDrawer = this.openSideDrawer.bind(this)
    this.handleRequestSort = this.handleRequestSort.bind(this)
  }
  componentWillReceiveProps(nextProp) {
    if (nextProp.selected !== this.props.selected) {
      this.setState({
        selected: nextProp.selected
      })
    }
    if (nextProp.data !== this.props.data) {
      this.setState({
        // data: nextProp.data,
        tableData: nextProp.data
      })
    }
  }

  getSorting(order, orderBy) {
    return order === 'desc'
      ? (a, b) => (b[orderBy] < a[orderBy] ? -1 : 1)
      : (a, b) => (a[orderBy] < b[orderBy] ? -1 : 1)
  }
  handleRequestSort = (event, property) => {
    const orderBy = property
    let order = 'desc'

    if (this.state.orderBy === property && this.state.order === 'desc') {
      order = 'asc'
    }

    this.setState({ order, orderBy })
  }

  handleSelectAllClick = (event, checked) => {
    const { tableType } = this.props
    const { tableData } = this.state
    var selectedRows = []

  }

  handleClick = (event, id) => {
    const { selected } = this.state
    const selectedIndex = selected.indexOf(id)
    let newSelected = []

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id)
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1))
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1))
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1))
    }

    this.setState({ selected: newSelected })
    this.props.updateSelectedRows(newSelected)
  }
  isSelected = id => this.state.selected.indexOf(id) !== -1

  // handle button events
  openSideDrawer(g) {
    this.props.toggleSideDrawer(g)
  }
  handleChange12 = (panel, idx) => (event, expanded) => {
    this.setState({
      expanded: expanded ? idx : -1
    })
  }
  showFieldDetails(rowData, idx) {
    this.setState({
      fieldTableData: rowData,
      showExpand: idx === this.state.showExpand ? -1 : idx
    })
  }
  renderConfigTable(n, idx) {
    const { tableType } = this.props
    if (tableType === 'CENTERS_TABLE') {
      return this.renderCenterTable(n, idx)
    }
  }
  cellClick(row, event) {
    if (typeof this.props.cellClick === 'function') {
      this.props.cellClick(row);
    }
  }

  renderCenterTable(n, idx) {
    const { classes, columnData } = this.props
    const isSelected = this.isSelected(n.Email)
    return (
      <TableRow
        hover
        // onClick={event => this.handleClick(event, n.Email)}
        role='checkbox'
        aria-checked={isSelected}
        tabIndex={-1}
        key={n.Email + '-' + idx}
        selected={isSelected}
        className={classes.tBodyStyle}
      >
        {_.keys(n).map(d => {
          return (
            <TableCell key={d}
              align={((_.get(_.find(columnData, c => c.id === d), 'numeric') || false)
                && d !== 'Sno')
                ? 'right' : 'left'}

              component='td' scope='row' data-title={`${n}: `}>
              {
                d === 'Boundary' ? <span onClick={this.cellClick.bind(this, n)} className={classes.link}>{n[d]}</span> : n[d]

              }

            </TableCell>)
        })}
      </TableRow>
    )
  }

  setFilteredList(newList) {
    this.setState({
      tableData: newList
    })
  }

  handleChangePage = (event, page) => {
    this.setState({ page });
    // const { order, orderBy, rowsPerPage, page } = this.state
    // this.setState(
    //   { page: page + 1 }, () => {
    //     if (typeof this.props.callAPI === 'function') {
    //       this.props.callAPI({ page: page + 1, rowsPerPage, order, orderBy, needLastKey: true })
    //     }
    //   })
  }

  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value, page: 0 });
    // const { order, orderBy, page } = this.state
    // let rowsPerPage = event.target.value
    // // console.log(rowsPerPage, order, orderBy, page)

    // this.setState({ rowsPerPage: rowsPerPage }, state => {
    //   if (typeof this.props.callAPI === 'function') {
    //     this.props.callAPI({ page, rowsPerPage, order, orderBy })
    //   }
    // })
  }
  TablePaginationActions(props) {
  }

  render() {
    const { data, columnData,Gfilter, classes, tableType, needCheckBox, needHash, needSearch, needExport, excelName } = this.props
    // const { tableData, order, orderBy, selected } = this.state

    // const { data, columnData, totalCount, classes, tableType, needCheckBox, needHash, needSearch } = this.props;
    const { tableData, order, orderBy, totalCount = data.length, selected, rowsPerPage, page } = this.state;
    return (
      <Paper className={classes.root}>
        <div className={classes.downloadNsearch}>
          {needExport ? (
            <ExportToExcel
              data={tableData}
              name={excelName}
            />
          ) : null}
          {needSearch ? (
            <TableSearch
              list={data}
              tableType={tableType}
              search={this.props.searchOnServer}
              updated={this.setFilteredList.bind(this)}
            />
          ) : null}
        </div>
        <div className={classes.tableDiv}>
          {
            <Table className={[classes.table, 'responsiveTable'].join(' ')} aria-labelledby='tableTitle'>
              <UiTableHead
                className={classes.thead}
                columnData={columnData}
                numSelected={selected.length}
                order={order}
                stickyHeader={true}
                orderBy={orderBy}
                Globfilter={Gfilter}
                onSelectAllClick={this.handleSelectAllClick}
                onRequestSort={this.handleRequestSort}
                rowCount={tableData.length}
                tableType={tableType}
                needCheckBox={needCheckBox}
                needHash={needHash}
              />
              {tableData && tableData.length > 0 ? (
                <TableBody className={classes.fontStyle}>
                  {_.orderBy(tableData, item => (_.get(item, orderBy) || '').toString().toLowerCase(), [order])
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((n, idx) => {
                      return this.renderConfigTable(n, idx)
                    })}
                </TableBody>
              ) : (
                  <TableBody>
                    <TableRow className={classes.tBodyStyle}>
                      <TableCell colSpan={columnData.length + 3} component='th' scope='row' data-title={'Actions: '}>
                        <h4 className={classes.alignCenter}>No Data Available</h4>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
            </Table>
          }


        </div>
        {tableData && tableData.length >= 0 && (
          <TablePagination
            classes={{ menuItem: classes.pagination }}
            className={classes.pagination}
            component="div"
            count={totalCount}
            rowsPerPage={rowsPerPage}
            page={page}
            backIconButtonProps={{
              'aria-label': 'Previous Page'
            }}
            nextIconButtonProps={{
              'aria-label': 'Next Page'
            }}
            //labelRowsPerPage="Showing"
            labelRowsPerPage={"Rows"}
            onChangePage={this.handleChangePage}
            onChangeRowsPerPage={this.handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25, 50]}
          // ActionsComponent={this.TablePaginationActions}
          />

        )}
      </Paper>
    )
  }
}

export default withStyles(styles)(EnhancedTable)
