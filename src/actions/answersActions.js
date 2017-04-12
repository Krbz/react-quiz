import * as types from "./actionTypes";

export function statusAnswer(payload) {
  return { type: types.CHECK_STATUS_ANSWER, payload };
}

export function receivedStatusAnswer(payload) {
  return { type: types.RECEIVED_STATUS_ANSWER, payload };
}

export function failureStatusAnswer(payload) {
  return { type: types.FAILURE_STATUS_ANSWER, payload };
}

export function clearAnswer(payload) {
  return {type: types.CLEAR_ANSWER, payload};
}

export function resetAnswers(payload) {
  return {type: types.RESET_ANSWERS, payload};
}
