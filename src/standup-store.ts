export interface IStandupPost {
  userId: string;
  standupMessage: string;
}

interface IStandupSession {
  [date: string]: IStandupPost[];
}

interface IStore {
  [room: string]: IStandupSession;
}

const store: IStore = {};

export const addStandupPost = (
  userId: string,
  message: string,
  channelId: string,
  date: string
): Promise<IStandupPost | undefined | null> => {
  const post: IStandupPost = {
    userId,
    standupMessage: message
  };

  let todaysPosts: IStandupPost[] = [];
  let room: IStandupSession = {};

  if (store[channelId] == null) {
    store[channelId] = room;
  } else {
    room = store[channelId];
  }

  if (room[date] == null) {
    room[date] = todaysPosts;
  } else {
    todaysPosts = room[date];
  }

  todaysPosts.push(post);
  return Promise.resolve(post);
};

export const getStandupsForDate = (
  channelId: string,
  date: string
): Promise<IStandupPost[]> => {
  const channelPosts = store[channelId];

  if (
    channelPosts == null ||
    channelPosts[date] == null ||
    channelPosts[date].length === 0
  ) {
    return Promise.resolve([]);
  }

  return Promise.resolve(channelPosts[date]);
};
