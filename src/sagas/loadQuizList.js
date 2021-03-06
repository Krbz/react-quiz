import {call, put, takeEvery} from "redux-saga/effects";
import {fetchQuizList} from "../api/getQuizList";
import * as types from "../actions/actionTypes";

export function* loadQuizList() {
  try {
    const list = yield call(fetchQuizList);

    yield put({type: types.RECEIVED_QUIZ_LIST, list: list});
    yield put({type: types.ADD_SUCCESS});
  } catch (error) {
    yield put({type: types.FAILURE_QUIZ_LIST, error});
    yield put({type: types.ADD_ERROR, error});
  }
}

export function* watchQuizList() {
  yield takeEvery(types.FETCH_QUIZ_LIST, loadQuizList);
}
