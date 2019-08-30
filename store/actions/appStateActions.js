import { NOTIFICATIONS, SET_NIGHT_THEME, TEXT_SIZE, CHAT_BACKGROUND } from '../actions/constants'

export function setNotifications(data) {
    return {
      type: NOTIFICATIONS,
      data
    }
  }

  export function setNightTheme(data) {
    return {
      type: SET_NIGHT_THEME,
      data
    }
  }

  export function setTextSize(data) {
    return {
        type: TEXT_SIZE,
        data
      }  
  }

  export function setChatBackground(data) {
    return {
        type: CHAT_BACKGROUND,
        data
      }  
  }

  
