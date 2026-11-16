import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { f1Service } from '../../services';

export const fetchDriverStandings = createAsyncThunk(
  'f1/fetchDriverStandings',
  async (_, { rejectWithValue }) => {
    try {
      const data = await f1Service.getDriverStandings();
      return data.MRData.StandingsTable.StandingsLists[0]?.DriverStandings ?? [];
    } catch (err) {
      return rejectWithValue(err.message || 'Error al obtener la tabla de posiciones');
    }
  }
);

export const fetchLastRaceResults = createAsyncThunk(
  'f1/fetchLastRaceResults',
  async (_, { rejectWithValue }) => {
    try {
      const data = await f1Service.getLastRaceResults();
      return data.MRData.RaceTable.Races[0] ?? null;
    } catch (err) {
      return rejectWithValue(err.message || 'Error al obtener los resultados de la última carrera');
    }
  }
);

const initialState = {
  standings: [],
  standingsLoading: false,
  standingsError: null,
  lastRace: null,
  lastRaceLoading: false,
  lastRaceError: null,
  // Piloto favorito: solo en memoria (Redux), sin persistencia en localStorage ni backend.
  favoriteDriverId: null,
};

const f1Slice = createSlice({
  name: 'f1',
  initialState,
  reducers: {
    setFavoriteDriver: (state, action) => {
      state.favoriteDriverId = action.payload ?? null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchDriverStandings.pending, state => {
        state.standingsLoading = true;
        state.standingsError = null;
      })
      .addCase(fetchDriverStandings.fulfilled, (state, action) => {
        state.standingsLoading = false;
        state.standings = action.payload;
      })
      .addCase(fetchDriverStandings.rejected, (state, action) => {
        state.standingsLoading = false;
        state.standingsError = action.payload || 'Error desconocido';
      })
      .addCase(fetchLastRaceResults.pending, state => {
        state.lastRaceLoading = true;
        state.lastRaceError = null;
      })
      .addCase(fetchLastRaceResults.fulfilled, (state, action) => {
        state.lastRaceLoading = false;
        state.lastRace = action.payload;
      })
      .addCase(fetchLastRaceResults.rejected, (state, action) => {
        state.lastRaceLoading = false;
        state.lastRaceError = action.payload || 'Error desconocido';
      });
  },
});

export const selectF1 = state => state.f1;
export const selectDriverStandings = state => state.f1.standings;
export const selectLastRace = state => state.f1.lastRace;
export const selectFavoriteDriverId = state => state.f1.favoriteDriverId;

export const { setFavoriteDriver } = f1Slice.actions;

export default f1Slice.reducer;
