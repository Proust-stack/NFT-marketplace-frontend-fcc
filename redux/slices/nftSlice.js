import { createSlice } from "@reduxjs/toolkit"

const setError = (state, action) => {
    state.loading = false
    state.error = action.payload
}

const nftsSlice = createSlice({
    name: "nfts",
    initialState: {
        nfts: [],
        currentNFT: null,
    },
    reducers: {
        setCurrentNFT(state, action) {
            state.currentNFT = action.payload
        },
    },
    extraReducers: {},
})
export const { setCurrentNFT } = nftsSlice.actions
export default nftsSlice.reducer
