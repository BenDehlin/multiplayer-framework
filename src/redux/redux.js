import {createStore} from 'redux'

const GAME_START = 'GAME_START'

const initialState = {
    gameStart: false
}

export function setGameStart(payload){
    return {type: GAME_START, payload}
}

export function reducer(state = initialState, action){
    const {type, payload} = action
    switch(type){
        case GAME_START:
            return {...payload}
        default:
            return state
    }
}

export default createStore(reducer)