// should this not be a d.ts file?
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

export interface IAttachment {
  text: string;
}

export interface IStandupPostback {
  response_type: string;
  text: string;
  attachments?: IAttachment[];
}
