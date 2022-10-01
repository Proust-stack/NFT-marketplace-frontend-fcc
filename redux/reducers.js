import { combineReducers } from "@reduxjs/toolkit"
import nftReducer from "./slices/nftSlice"
import { HYDRATE } from "next-redux-wrapper"

const rootReducer = combineReducers({
    nfts: nftReducer,
})

export const reducer = (state, action) => {
    console.log(`reducer action ${action.type}`, action)
    if (action.type === HYDRATE) {
        const nextState = {
            ...state, // use previous state
            ...action.payload, // apply delta from hydration
        }
        return nextState
    } else {
        return rootReducer(state, action)
    }
}
