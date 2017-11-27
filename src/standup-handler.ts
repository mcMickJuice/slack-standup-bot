import * as moment from 'moment';
import { Response } from 'express';
import {
  addStandupPost,
  getStandupsForDate,
  IStandupPost
} from './standup-store';

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

interface IAttachment {
  text: string;
}

interface IStandupPostback {
  response_type: string;
  text: string;
  attachments?: IAttachment[];
}

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

const handler = async (request: ISlackRequest, res: Response) => {
  const today = moment().format('MM/DD/Y');
  const { text, channel_id, user_name, user_id, response_url } = request;

  // if text is empty, post all standup messages for today
  if (text.length === 0) {
    const todaysPosts = await getStandupsForDate(channel_id, today);

    if (todaysPosts.length === 0) {
      res.send(buildStandupPostback('No Posts for Today'));
      return;
    }

    const posts = todaysPosts.map((post: IStandupPost) => {
      return {
        text: formatStandupMessage(post)
      };
    });

    res.send(
      buildStandupPostback('<!here> Here are standups for today', posts)
    );
  } else {
    const createdPost = await addStandupPost(user_id, text, channel_id, today);

    res.send(
      buildStandupPostback(`<!here> Here is <@${user_id}>'s standup`, [
        { text: createdPost.standupMessage }
      ])
    );
  }
};

export default handler;
