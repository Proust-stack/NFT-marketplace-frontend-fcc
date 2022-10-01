import { configureStore } from "@reduxjs/toolkit"
import { createWrapper } from "next-redux-wrapper"
import { reducer, rootReducer } from "./reducers"

const makeStore = () => {
    const store = configureStore({
        reducer,
    })

    if (process.env.NODE_ENV !== "production" && module.hot) {
        module.hot.accept("./reducers", () => store.replaceReducer(rootReducer))
    }

    return store
}

export const wrapper = createWrapper(makeStore, { debug: true })
