import * as moment from 'moment';

// prob should go in types file?
export interface ISlackRequest {
  token: string;
  team_id: string;
  team_domain: string;
  channel_id: string;
  channel_name: string;
  user_id: string;
  user_name: string;
  command: string;
  text: string;
  response_url: string;
}
interface IStandupPost {
  userId: string;
  userName: string;
  standupMessage: string;
}

interface IStandupSession {
  [date: string]: IStandupPost[];
}

interface IStore {
  [room: string]: IStandupSession;
}

const store: IStore = {};

const handler = (request: ISlackRequest) => {
  // parse text
  const { text, channel_id, user_name, user_id, response_url } = request;

  let room: IStandupSession = {};
  if (store[channel_id] == null) {
    store[channel_id] = room;
  } else {
    room = store[channel_id];
  }

  const today = moment().format('MM/DD/Y');
  const post: IStandupPost = {
    userId: user_id,
    userName: user_name,
    standupMessage: text
  };
  let todaysPosts: IStandupPost[] = [];
  if (room[today] == null) {
    room[today] = todaysPosts;
  } else {
    todaysPosts = room[today];
  }
  todaysPosts.push(post);

  console.log(JSON.stringify(store, null, 2));
};

export default handler;
