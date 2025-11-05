import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

interface MenuItem {
  id: number;
  name: string;
  code: string;
  type: string;
  varient: string;
  category: string;
  image: string | null;
  price: string;
}

interface MenuState {
  items: MenuItem[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: boolean;
  message: string | null
}

const initialState: MenuState = {
  items: [],
  status: 'idle',
  error: null,
  message : ''
};

export const fetchMenu = createAsyncThunk('menu/fetchMenu', async () => {
  const res = await fetch('/api/menu');
  return (await res.json()) as MenuItem[];
});

// Add Item
export const addMenuItem = createAsyncThunk("menu/add", async (item:Omit<MenuItem, 'id'>) => {
  const res = await fetch('/api/menu', {
    method : 'POST',
    body : JSON.stringify(item),
    headers : {
      'Content-Type' : 'application/json'
    }
  })
  return (await res.json()) as MenuItem;
});

// Update Item
export const updateMenuItem = createAsyncThunk("menu/update", async (item:MenuItem) => {
  const res = await fetch('/api/menu', {
    method : 'PUT',
    body: JSON.stringify(item),
    headers : {
      'Content-Type' : 'application/json'
    }
  })

  return (await res.json()) as MenuItem;
})

// Delete Item
export const deleteMenuItem = createAsyncThunk("menu/delete", async (id:number) => {
  const res = await fetch('/api/menu', {
    method : 'DELETE', 
    body : JSON.stringify({id}),
    headers : {
      'Content-Type' : 'application/json'
    }
  });

  return id;
})

const menuSlice = createSlice({
  name: 'menu',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMenu.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchMenu.fulfilled, (state, action: PayloadAction<MenuItem[]>) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(addMenuItem.fulfilled, (state, action: PayloadAction<MenuItem>) => {
        state.items.push(action.payload)
      })
      .addCase(updateMenuItem.fulfilled, (state, action: PayloadAction<MenuItem>) => {
        const index = state.items.findIndex(item => item.id === action.payload.id);
        if(index != -1) state.items[index] = action.payload;  
      })
      .addCase(deleteMenuItem.fulfilled, (state, action:PayloadAction<number>)=>{
        state.items = state.items.filter(item => item.id !== action.payload)
      });
  },
});

export default menuSlice.reducer;
