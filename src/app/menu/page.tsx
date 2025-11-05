'use client';

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/store";
import { fetchMenu } from "../redux/features/menu/menuSlice";

import Alert from '@mui/material/Alert';
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';

import { DataGrid, gridClasses } from '@mui/x-data-grid';
import PageContainer from '../components/PageContainer';
import RefreshIcon from '@mui/icons-material/Refresh';
import AddIcon from '@mui/icons-material/Add';


export default function Menu(props) {
    const dispatch = useDispatch<AppDispatch>();
    const { items } = useSelector((state: RootState) => state.menu);

    const [search, setSearch] = useState("");
    const [sortBy, setSortBy] = useState<"name" | "price">("name");
    const [filterAbove, setFilterAbove] = useState<number>(0);

    // Add form state
    const [newName, setNewName] = useState("");
    const [newPrice, setNewPrice] = useState<number>(0);

    useEffect(() => {
        dispatch(fetchMenu());
    }, [dispatch]);

    const pageTitle = 'Employees';

    return (
        <PageContainer
        title={pageTitle}
        breadcrumbs={[{ title: pageTitle }]}
        actions={
          <Stack direction="row" alignItems="center" spacing={1}>
            <Tooltip title="Reload data" placement="right" enterDelay={1000}>
              <div>
                <IconButton size="small" aria-label="refresh" onClick={handleRefresh}>
                  <RefreshIcon />
                </IconButton>
              </div>
            </Tooltip>
            <Button
              variant="contained"
              onClick={handleCreateClick}
              startIcon={<AddIcon />}
            >
              Create
            </Button>
          </Stack>
        }
      >
        <Box sx={{ flex: 1, width: '100%' }}>
          {error ? (
            <Box sx={{ flexGrow: 1 }}>
              <Alert severity="error">{error.message}</Alert>
            </Box>
          ) : (
            <DataGrid
              rows={rowsState.rows}
              rowCount={rowsState.rowCount}
              columns={columns}
              pagination
              sortingMode="server"
              filterMode="server"
              paginationMode="server"
              paginationModel={paginationModel}
              onPaginationModelChange={handlePaginationModelChange}
              sortModel={sortModel}
              onSortModelChange={handleSortModelChange}
              filterModel={filterModel}
              onFilterModelChange={handleFilterModelChange}
              disableRowSelectionOnClick
              onRowClick={handleRowClick}
              loading={isLoading}
              initialState={initialState}
              showToolbar
              pageSizeOptions={[5, INITIAL_PAGE_SIZE, 25]}
              sx={{
                [`& .${gridClasses.columnHeader}, & .${gridClasses.cell}`]: {
                  outline: 'transparent',
                },
                [`& .${gridClasses.columnHeader}:focus-within, & .${gridClasses.cell}:focus-within`]:
                  {
                    outline: 'none',
                  },
                [`& .${gridClasses.row}:hover`]: {
                  cursor: 'pointer',
                },
              }}
              slotProps={{
                loadingOverlay: {
                  variant: 'circular-progress',
                  noRowsVariant: 'circular-progress',
                },
                baseIconButton: {
                  size: 'small',
                },
              }}
            />
          )}
        </Box>
      </PageContainer>
    );
}