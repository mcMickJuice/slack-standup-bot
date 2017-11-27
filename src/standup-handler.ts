import * as moment from 'moment';
import { Response } from 'express';

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

const formatStandupMessage = (post: IStandupPost) =>
  `@${post.userName} - ${post.standupMessage}`;

const handler = (request: ISlackRequest, res: Response) => {
  // if text is empty, post all standup messages for today
  const today = moment().format('MM/DD/Y');

  const { text, channel_id, user_name, user_id, response_url } = request;

  if (text.length === 0) {
    const channelPosts = store[channel_id];

    if (channelPosts == null) {
      res.send('no posts for today');
      return;
    }

    const todaysPosts = channelPosts[today];

    if (todaysPosts == null || todaysPosts.length === 0) {
      res.send('no posts for today');
      return;
    }

    const posts = todaysPosts.map(formatStandupMessage);

    res.send(['Here are standups for today', ...posts].join('/n'));
  } else {
    let room: IStandupSession = {};
    if (store[channel_id] == null) {
      store[channel_id] = room;
    } else {
      room = store[channel_id];
    }

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

    res.send(formatStandupMessage(post));
  }
};

export default handler;
