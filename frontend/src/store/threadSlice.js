import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  threads: [],
  myThreads: [],
  cacheSource: '', // database atau cache
  loading: false,
  error: null,
};

const threadSlice = createSlice({
  name: 'threads',
  initialState,
  reducers: {
    fetchStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    setThreads: (state, action) => {
      state.loading = false;
      state.threads = action.payload;
    },
    addThread: (state, action) => {
      state.threads = [action.payload, ...state.threads];
      state.myThreads = [action.payload, ...state.myThreads];
    },
    setMyThreads: (state, action) => {
      state.loading = false;
      state.myThreads = action.payload.data;
      state.cacheSource = action.payload.source; // 'cache' atau 'database'
    },
    toggleLikeState: (state, action) => {
      const { threadId, currentUserId } = action.payload;
      
      // Update di timeline global
      const thread = state.threads.find((t) => t.id === threadId);
      if (thread) {
        if (thread.isLiked) {
          thread.isLiked = false;
          thread._count.likes -= 1;
        } else {
          thread.isLiked = true;
          thread._count.likes += 1;
        }
      }

      // Update di timeline profile
      const myThread = state.myThreads.find((t) => t.id === threadId);
      if (myThread) {
        if (myThread.isLiked) {
          myThread.isLiked = false;
          myThread._count.likes -= 1;
        } else {
          myThread.isLiked = true;
          myThread._count.likes += 1;
        }
      }
    },
    addReplyState: (state, action) => {
      const { threadId, reply } = action.payload;
      
      const thread = state.threads.find((t) => t.id === threadId);
      if (thread) {
        thread._count.replies += 1;
        if (thread.replies) {
          thread.replies.push(reply);
        }
      }

      const myThread = state.myThreads.find((t) => t.id === threadId);
      if (myThread) {
        myThread._count.replies += 1;
        if (myThread.replies) {
          myThread.replies.push(reply);
        }
      }
    },
  },
});

export const {
  fetchStart,
  fetchFailure,
  setThreads,
  addThread,
  setMyThreads,
  toggleLikeState,
  addReplyState,
} = threadSlice.actions;

export default threadSlice.reducer;
