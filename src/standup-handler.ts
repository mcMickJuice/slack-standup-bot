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
  standupMessage: string;
}

interface IStandupSession {
  [date: string]: IStandupPost[];
}

interface IStore {
  [room: string]: IStandupSession;
}

interface IAttachment {
  text: string;
}

interface IStandupPostback {
  response_type: string;
  text: string;
  attachments?: IAttachment[];
}

const store: IStore = {};

const formatStandupMessage = (post: IStandupPost) =>
  `<@${post.userId}> - ${post.standupMessage}`;

const buildStandupPostback = (
  message: string,
  attachments?: IAttachment[]
): IStandupPostback => {
  return {
    response_type: 'in_channel',
    text: message,
    attachments
  };
};

const handler = (request: ISlackRequest, res: Response) => {
  // if text is empty, post all standup messages for today
  const today = moment().format('MM/DD/Y');

  const { text, channel_id, user_name, user_id, response_url } = request;

  if (text.length === 0) {
    const channelPosts = store[channel_id];

    if (
      channelPosts == null ||
      channelPosts[today] == null ||
      channelPosts[today].length === 0
    ) {
      res.send(buildStandupPostback('No Posts for Today'));
      return;
    }

    const todaysPosts = channelPosts[today];

    const posts = todaysPosts.map((post: IStandupPost) => {
      return {
        text: formatStandupMessage(post)
      };
    });

    res.send(
      buildStandupPostback('<!here> Here are standups for today', posts)
    );
  } else {
    let room: IStandupSession = {};
    if (store[channel_id] == null) {
      store[channel_id] = room;
    } else {
      room = store[channel_id];
    }

    const post: IStandupPost = {
      userId: user_id,
      standupMessage: text
    };
    let todaysPosts: IStandupPost[] = [];
    if (room[today] == null) {
      room[today] = todaysPosts;
    } else {
      todaysPosts = room[today];
    }
    todaysPosts.push(post);

    res.send(
      buildStandupPostback(`<!here> Here is <@${user_id}>'s standup`, [
        { text: post.standupMessage }
      ])
    );
  }
};

export default handler;
