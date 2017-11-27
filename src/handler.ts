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

const handler = (request: ISlackRequest) => {
  console.log('handled!', request);
};

export default handler;
